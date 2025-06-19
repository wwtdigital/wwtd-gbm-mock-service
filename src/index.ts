import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { appendToThread, createThread, getThread, listThreads } from "./store.js";
import {
  type ThreadRequest,
  ThreadRequestSchema,
  ThreadSchema,
} from "./types.js";
import { formatThread } from "./utils.js";

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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.log(`Mock service listening on http://localhost:${PORT}`);
  });
}
