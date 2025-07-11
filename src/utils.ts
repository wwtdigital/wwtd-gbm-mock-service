import type { Thread } from "./types";
export function formatUser(user: import("./types").User) {
  return {
    id: user.id,
    user_id: user.userId,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
  };
}

export function formatThread(thread: Thread) {
  return {
    id: thread.id,
    thread_id: thread.threadId,
    user_id: thread.userId,
    created_at: thread.createdAt,
    entries: thread.entries.map((e) => ({
      id: e.id,
      entry_id: e.entryId,
      thread_id: e.threadId,
      category: e.category,
      created_at: e.createdAt,
      data: e.data,
    })),
  };
}
