import express from "express";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import {
  appendToThread,
  createFeedback,
  createThread,
  getFeedback,
  getFeedbackByEntry,
  getFeedbackByThread,
  getThread,
  listFeedback,
  listThreads,
} from "./store";
import {
  type FeedbackRequest,
  FeedbackRequestSchema,
  type ThreadRequest,
  ThreadRequestSchema,
  ThreadSchema,
} from "./types";
import { formatThread } from "./utils";

export const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Post thread (create or append)
app.post("/threads", async (req, res) => {
  const maybeDelay = Number(req.query.delayMs);
  if (!Number.isNaN(maybeDelay) && maybeDelay > 0) {
    await new Promise((r) => setTimeout(r, maybeDelay));
  }

  const forcedError = req.query.error;
  if (forcedError) {
    return res.status(Number(forcedError)).json({ error: "forced error" });
  }

  const parse = ThreadRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }
  const body: ThreadRequest = parse.data;
  const { threadId, userId, message } = body;

  const thread = threadId ? appendToThread(threadId, message) : undefined;
  if (threadId && !thread) {
    return res.status(404).json({ error: "Thread not found" });
  }

  const updated = thread ?? createThread(userId, message);

  // Auto-generate assistant response entry to simulate LLM reply
  const assistantEntry = {
    entryId: uuid(),
    threadId: updated.threadId,
    category: "response" as const,
    data: {
      role: "assistant" as const,
      content: {
        text: `Mock response to: ${message.content.text ?? "(no text)"}`,
        visual: {},
        sources: [],
      },
    },
    createdAt: new Date().toISOString(),
  };
  updated.entries.push(assistantEntry);

  return res.status(200).json(formatThread(updated));
});

// List all threads
app.get("/threads", (req, res) => {
  const arr = listThreads().map(formatThread);
  res.json(arr);
});

// Get thread by id
app.get("/threads/:id", (req, res) => {
  const thread = getThread(req.params.id);
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" });
  }
  return res.json(formatThread(thread));
});

// Create feedback for an entry
app.post("/feedback", (req, res) => {
  const parse = FeedbackRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  const { entryId, threadId, userId, rating, comment } = parse.data;

  // Verify thread and entry exist
  const thread = getThread(threadId);
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" });
  }

  const entry = thread.entries.find((e) => e.entryId === entryId);
  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  const feedback = createFeedback(entryId, threadId, userId, rating, comment);

  return res.status(201).json({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  });
});

// Get feedback by feedback ID
app.get("/feedback/:id", (req, res) => {
  const feedback = getFeedback(req.params.id);
  if (!feedback) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  return res.json({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  });
});

// Get feedback for a specific entry
app.get("/entries/:entryId/feedback", (req, res) => {
  const feedbackList = getFeedbackByEntry(req.params.entryId);

  const formatted = feedbackList.map((feedback) => ({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  }));

  return res.json(formatted);
});

// Get all feedback for a thread
app.get("/threads/:threadId/feedback", (req, res) => {
  const feedbackList = getFeedbackByThread(req.params.threadId);

  const formatted = feedbackList.map((feedback) => ({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  }));

  return res.json(formatted);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.log(`Mock service listening on http://localhost:${PORT}`);
  });
}
