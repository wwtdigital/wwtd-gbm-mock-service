import { v4 as uuid } from "uuid";
import type { Thread } from "./types.js";

const threads = new Map<string, Thread>();
let nextThreadId = 1;
let nextEntryId = 1;

export function clearStore() {
  threads.clear();
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

