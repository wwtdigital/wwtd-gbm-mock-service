import request from "supertest";
import { app } from "../src/express-server";
import { clearStore } from "../src/store";

// Utility to build a minimal valid message
const buildMessage = () => ({
  role: "user" as const,
  content: {
    text: "hello",
  },
});

describe("API Endpoints", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("GET /health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /threads", () => {
    test("should create new thread when no threadId provided", async () => {
      const body = { userId: "user123", message: buildMessage() };
      const res = await request(app).post("/threads").send(body);
      expect(res.status).toBe(200);
      expect(res.body.thread_id).toBeDefined();
      expect(res.body.entries).toHaveLength(2); // includes auto assistant
    });

    test("should append to existing thread when threadId provided", async () => {
      const first = await request(app)
        .post("/threads")
        .send({ userId: "u1", message: buildMessage() });
      const threadId = first.body.thread_id;
      const second = await request(app)
        .post("/threads")
        .send({ userId: "u1", threadId, message: buildMessage() });
      expect(second.status).toBe(200);
      expect(second.body.entries).toHaveLength(4);
    });

    test("should return 400 for invalid request body", async () => {
      const res = await request(app).post("/threads").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /threads", () => {
    test("should return list of threads", async () => {
      // ensure at least one thread exists
      await request(app)
        .post("/threads")
        .send({ userId: "prep", message: buildMessage() });
      const res = await request(app).get("/threads");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /threads/:id", () => {
    test("should return thread by id", async () => {
      const create = await request(app)
        .post("/threads")
        .send({ userId: "u2", message: buildMessage() });
      const id = create.body.thread_id;
      const res = await request(app).get(`/threads/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.thread_id).toBe(id);
    });

    test("should return 404 for non-existent thread", async () => {
      const res = await request(app).get("/threads/non-existent");
      expect(res.status).toBe(404);
    });
  });

  describe("Feedback Endpoints", () => {
    let threadId: string;
    let entryId: string;

    beforeEach(async () => {
      // Create a thread with entries to test feedback on
      const threadRes = await request(app)
        .post("/threads")
        .send({ userId: "user123", message: buildMessage() });
      threadId = threadRes.body.thread_id;
      entryId = threadRes.body.entries[1].entry_id; // Use assistant response entry
    });

    describe("POST /feedback", () => {
      test("should create thumbs up feedback", async () => {
        const feedbackBody = {
          entryId,
          threadId,
          userId: "user123",
          rating: "thumbs_up",
          comment: "Great response!",
        };

        const res = await request(app).post("/feedback").send(feedbackBody);
        expect(res.status).toBe(201);
        expect(res.body.feedback_id).toBeDefined();
        expect(res.body.rating).toBe("thumbs_up");
        expect(res.body.comment).toBe("Great response!");
        expect(res.body.entry_id).toBe(entryId);
        expect(res.body.thread_id).toBe(threadId);
      });

      test("should create thumbs down feedback without comment", async () => {
        const feedbackBody = {
          entryId,
          threadId,
          userId: "user123",
          rating: "thumbs_down",
        };

        const res = await request(app).post("/feedback").send(feedbackBody);
        expect(res.status).toBe(201);
        expect(res.body.rating).toBe("thumbs_down");
        expect(res.body.comment).toBeUndefined();
      });

      test("should return 400 for invalid feedback body", async () => {
        const res = await request(app).post("/feedback").send({});
        expect(res.status).toBe(400);
      });

      test("should return 404 for non-existent thread", async () => {
        const feedbackBody = {
          entryId,
          threadId: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID but non-existent
          userId: "user123",
          rating: "thumbs_up",
        };

        const res = await request(app).post("/feedback").send(feedbackBody);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Thread not found");
      });

      test("should return 404 for non-existent entry", async () => {
        const feedbackBody = {
          entryId: "550e8400-e29b-41d4-a716-446655440001", // Valid UUID but non-existent
          threadId,
          userId: "user123",
          rating: "thumbs_up",
        };

        const res = await request(app).post("/feedback").send(feedbackBody);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Entry not found");
      });
    });

    describe("GET /feedback/:id", () => {
      test("should return feedback by id", async () => {
        // Create feedback first
        const feedbackBody = {
          entryId,
          threadId,
          userId: "user123",
          rating: "thumbs_up",
        };
        const createRes = await request(app)
          .post("/feedback")
          .send(feedbackBody);
        const feedbackId = createRes.body.feedback_id;

        const res = await request(app).get(`/feedback/${feedbackId}`);
        expect(res.status).toBe(200);
        expect(res.body.feedback_id).toBe(feedbackId);
        expect(res.body.rating).toBe("thumbs_up");
      });

      test("should return 404 for non-existent feedback", async () => {
        const res = await request(app).get("/feedback/non-existent");
        expect(res.status).toBe(404);
      });
    });

    describe("GET /entries/:entryId/feedback", () => {
      test("should return feedback for specific entry", async () => {
        // Create multiple feedback for the same entry
        const feedback1 = {
          entryId,
          threadId,
          userId: "user1",
          rating: "thumbs_up",
        };
        const feedback2 = {
          entryId,
          threadId,
          userId: "user2",
          rating: "thumbs_down",
        };

        await request(app).post("/feedback").send(feedback1);
        await request(app).post("/feedback").send(feedback2);

        const res = await request(app).get(`/entries/${entryId}/feedback`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].entry_id).toBe(entryId);
        expect(res.body[1].entry_id).toBe(entryId);
      });

      test("should return empty array for entry with no feedback", async () => {
        const res = await request(app).get(
          "/entries/non-existent-entry/feedback",
        );
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });
    });

    describe("GET /threads/:threadId/feedback", () => {
      test("should return all feedback for thread", async () => {
        // Create feedback for different entries in the thread
        const userEntryId = threadId; // Use threadId as placeholder for user entry
        const feedback1 = {
          entryId,
          threadId,
          userId: "user1",
          rating: "thumbs_up",
        };

        await request(app).post("/feedback").send(feedback1);

        const res = await request(app).get(`/threads/${threadId}/feedback`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].thread_id).toBe(threadId);
      });

      test("should return empty array for thread with no feedback", async () => {
        // Create a new thread without feedback
        const newThreadRes = await request(app)
          .post("/threads")
          .send({ userId: "user456", message: buildMessage() });
        const newThreadId = newThreadRes.body.thread_id;

        const res = await request(app).get(`/threads/${newThreadId}/feedback`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });
    });
  });
});
