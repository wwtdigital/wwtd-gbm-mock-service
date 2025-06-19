import { v4 as uuid } from "uuid";
import type { Thread, Feedback } from "./types.js";

const threads = new Map<string, Thread>();
const feedback = new Map<string, Feedback>();
let nextThreadId = 1;
let nextEntryId = 1;
let nextFeedbackId = 1;

export function clearStore() {
  threads.clear();
  feedback.clear();
}

export function createThread(
  userId: string,
  message: Thread["entries"][number]["data"],
): Thread {
  const threadId = uuid();
  const entryId = uuid();
  const now = new Date().toISOString();

  const thread: Thread = {
    id: nextThreadId++,
    threadId,
    userId,
    createdAt: now,
    entries: [
      {
        id: nextEntryId++,
        entryId,
        threadId,
        category: "request",
        data: message,
        createdAt: now,
      },
    ],
  };
  threads.set(threadId, thread);
  return thread;
}

export function appendToThread(
  threadId: string,
  message: Thread["entries"][number]["data"],
): Thread | undefined {
  const thread = threads.get(threadId);
  if (!thread) return undefined;
  const entryId = uuid();
  const now = new Date().toISOString();
  thread.entries.push({
    id: nextEntryId++,
    entryId,
    threadId,
    category: "request",
    data: message,
    createdAt: now,
  });
  return thread;
}

export function getThread(id: string): Thread | undefined {
  return threads.get(id);
}

export function listThreads(): Thread[] {
  return Array.from(threads.values());
}

export function nextEntryIdValue() {
  return nextEntryId;
}

// Feedback functions
export function createFeedback(
  entryId: string,
  threadId: string,
  userId: string,
  rating: "thumbs_up" | "thumbs_down",
  comment?: string,
): Feedback {
  const feedbackId = uuid();
  const now = new Date().toISOString();

  const feedbackRecord: Feedback = {
    id: nextFeedbackId++,
    feedbackId,
    entryId,
    threadId,
    userId,
    rating,
    comment,
    createdAt: now,
  };

  feedback.set(feedbackId, feedbackRecord);
  return feedbackRecord;
}

export function getFeedback(id: string): Feedback | undefined {
  return feedback.get(id);
}

export function getFeedbackByEntry(entryId: string): Feedback[] {
  return Array.from(feedback.values()).filter(f => f.entryId === entryId);
}

export function getFeedbackByThread(threadId: string): Feedback[] {
  return Array.from(feedback.values()).filter(f => f.threadId === threadId);
}

export function listFeedback(): Feedback[] {
  return Array.from(feedback.values());
}

