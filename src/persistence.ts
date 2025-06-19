import { promises as fs } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";
import type { Feedback, Thread } from "./types.js";

export interface PersistenceLayer {
  saveThread(thread: Thread): Promise<void>;
  loadThread(threadId: string): Promise<Thread | null>;
  loadAllThreads(): Promise<Thread[]>;
  deleteThread(threadId: string): Promise<boolean>;

  saveFeedback(feedback: Feedback): Promise<void>;
  loadFeedback(feedbackId: string): Promise<Feedback | null>;
  loadAllFeedback(): Promise<Feedback[]>;
  deleteFeedback(feedbackId: string): Promise<boolean>;
}

class FilePersistence implements PersistenceLayer {
  private threadsDir: string;
  private feedbackDir: string;

  constructor(dataDir: string) {
    this.threadsDir = join(dataDir, "threads");
    this.feedbackDir = join(dataDir, "feedback");
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.threadsDir, { recursive: true });
      await fs.mkdir(this.feedbackDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create data directories:", error);
    }
  }

  async saveThread(thread: Thread): Promise<void> {
    await this.ensureDirectories();
    const filePath = join(this.threadsDir, `${thread.threadId}.json`);
    await fs.writeFile(filePath, JSON.stringify(thread, null, 2));
  }

  async loadThread(threadId: string): Promise<Thread | null> {
    try {
      const filePath = join(this.threadsDir, `${threadId}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async loadAllThreads(): Promise<Thread[]> {
    try {
      await this.ensureDirectories();
      const files = await fs.readdir(this.threadsDir);
      const threads: Thread[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = await fs.readFile(join(this.threadsDir, file), "utf-8");
          threads.push(JSON.parse(data));
        }
      }

      return threads.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch {
      return [];
    }
  }

  async deleteThread(threadId: string): Promise<boolean> {
    try {
      const filePath = join(this.threadsDir, `${threadId}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async saveFeedback(feedback: Feedback): Promise<void> {
    await this.ensureDirectories();
    const filePath = join(this.feedbackDir, `${feedback.feedbackId}.json`);
    await fs.writeFile(filePath, JSON.stringify(feedback, null, 2));
  }

  async loadFeedback(feedbackId: string): Promise<Feedback | null> {
    try {
      const filePath = join(this.feedbackDir, `${feedbackId}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async loadAllFeedback(): Promise<Feedback[]> {
    try {
      await this.ensureDirectories();
      const files = await fs.readdir(this.feedbackDir);
      const feedback: Feedback[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = await fs.readFile(join(this.feedbackDir, file), "utf-8");
          feedback.push(JSON.parse(data));
        }
      }

      return feedback.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch {
      return [];
    }
  }

  async deleteFeedback(feedbackId: string): Promise<boolean> {
    try {
      const filePath = join(this.feedbackDir, `${feedbackId}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

class MemoryPersistence implements PersistenceLayer {
  // This is just the in-memory implementation (no actual persistence)
  async saveThread(thread: Thread): Promise<void> {
    // No-op for memory persistence
  }

  async loadThread(threadId: string): Promise<Thread | null> {
    return null;
  }

  async loadAllThreads(): Promise<Thread[]> {
    return [];
  }

  async deleteThread(threadId: string): Promise<boolean> {
    return false;
  }

  async saveFeedback(feedback: Feedback): Promise<void> {
    // No-op for memory persistence
  }

  async loadFeedback(feedbackId: string): Promise<Feedback | null> {
    return null;
  }

  async loadAllFeedback(): Promise<Feedback[]> {
    return [];
  }

  async deleteFeedback(feedbackId: string): Promise<boolean> {
    return false;
  }
}

// Singleton persistence instance
let persistenceInstance: PersistenceLayer | null = null;

export function getPersistence(): PersistenceLayer | null {
  if (!config.enablePersistence) {
    return null;
  }

  if (!persistenceInstance) {
    switch (config.persistenceType) {
      case "file":
        persistenceInstance = new FilePersistence(config.dataDirectory);
        break;
      case "memory":
        persistenceInstance = new MemoryPersistence();
        break;
      default:
        console.warn(`Unknown persistence type: ${config.persistenceType}`);
        return null;
    }
  }

  return persistenceInstance;
}

// Utility functions for store integration
export async function loadPersistedData(): Promise<{
  threads: Thread[];
  feedback: Feedback[];
}> {
  const persistence = getPersistence();
  if (!persistence) {
    return { threads: [], feedback: [] };
  }

  try {
    const [threads, feedback] = await Promise.all([
      persistence.loadAllThreads(),
      persistence.loadAllFeedback(),
    ]);

    return { threads, feedback };
  } catch (error) {
    console.error("Failed to load persisted data:", error);
    return { threads: [], feedback: [] };
  }
}

export async function persistThread(thread: Thread): Promise<void> {
  const persistence = getPersistence();
  if (persistence) {
    try {
      await persistence.saveThread(thread);
    } catch (error) {
      console.error("Failed to persist thread:", error);
    }
  }
}

export async function persistFeedback(feedback: Feedback): Promise<void> {
  const persistence = getPersistence();
  if (persistence) {
    try {
      await persistence.saveFeedback(feedback);
    } catch (error) {
      console.error("Failed to persist feedback:", error);
    }
  }
}
