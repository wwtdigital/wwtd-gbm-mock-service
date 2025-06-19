/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import { POST as feedbackPost } from "../app/api/feedback/route";
import { GET as healthGet } from "../app/api/health/route";
import { GET as threadGet } from "../app/api/threads/[id]/route";
import {
  GET as threadsGet,
  POST as threadsPost,
} from "../app/api/threads/route";
import { clearStore } from "../src/store";

// Utility to build a minimal valid message
const buildMessage = () => ({
  role: "user" as const,
  content: {
    text: "hello",
  },
});

// Helper to create NextRequest mock
function createNextRequest(method: string, url: string, body?: unknown) {
  const mockRequest = createMocks({ method, url, body }).req;
  const request = new Request(`http://localhost:3000${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Add nextUrl property for compatibility
  // biome-ignore lint/suspicious/noExplicitAny: Required for Next.js request mock
  (request as any).nextUrl = new URL(`http://localhost:3000${url}`);

  // biome-ignore lint/suspicious/noExplicitAny: Required for Next.js request mock
  return request as any;
}

describe("Next.js API Routes", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await healthGet();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe("ok");
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBe("1.0.0");
    });
  });

  describe("POST /api/threads", () => {
    test("should create new thread when no threadId provided", async () => {
      const body = { userId: "user123", message: buildMessage() };
      const request = createNextRequest("POST", "/api/threads", body);

      const response = await threadsPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.thread_id).toBeDefined();
      expect(data.entries).toHaveLength(2); // includes auto assistant response
    });

    test("should return 400 for invalid request body", async () => {
      const request = createNextRequest("POST", "/api/threads", {});

      const response = await threadsPost(request);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/threads", () => {
    test("should return list of threads", async () => {
      // Create a thread first
      const body = { userId: "prep", message: buildMessage() };
      const createRequest = createNextRequest("POST", "/api/threads", body);
      await threadsPost(createRequest);

      const response = await threadsGet();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/threads/[id]", () => {
    test("should return thread by id", async () => {
      // Create a thread first
      const body = { userId: "u2", message: buildMessage() };
      const createRequest = createNextRequest("POST", "/api/threads", body);
      const createResponse = await threadsPost(createRequest);
      const createData = await createResponse.json();
      const threadId = createData.thread_id;

      const request = createNextRequest("GET", `/api/threads/${threadId}`);
      const response = await threadGet(request, { params: { id: threadId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.thread_id).toBe(threadId);
    });

    test("should return 404 for non-existent thread", async () => {
      const request = createNextRequest("GET", "/api/threads/non-existent");
      const response = await threadGet(request, {
        params: { id: "non-existent" },
      });

      expect(response.status).toBe(404);
    });
  });

  describe("Feedback Endpoints", () => {
    let threadId: string;
    let entryId: string;

    beforeEach(async () => {
      // Create a thread with entries to test feedback on
      const body = { userId: "user123", message: buildMessage() };
      const request = createNextRequest("POST", "/api/threads", body);
      const response = await threadsPost(request);
      const data = await response.json();

      threadId = data.thread_id;
      entryId = data.entries[1].entry_id; // Use assistant response entry
    });

    describe("POST /api/feedback", () => {
      test("should create thumbs up feedback", async () => {
        const feedbackBody = {
          entryId,
          threadId,
          userId: "user123",
          rating: "thumbs_up",
          comment: "Great response!",
        };

        const request = createNextRequest(
          "POST",
          "/api/feedback",
          feedbackBody,
        );
        const response = await feedbackPost(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.feedback_id).toBeDefined();
        expect(data.rating).toBe("thumbs_up");
        expect(data.comment).toBe("Great response!");
        expect(data.entry_id).toBe(entryId);
        expect(data.thread_id).toBe(threadId);
      });

      test("should return 400 for invalid feedback body", async () => {
        const request = createNextRequest("POST", "/api/feedback", {});
        const response = await feedbackPost(request);

        expect(response.status).toBe(400);
      });

      test("should return 404 for non-existent thread", async () => {
        const feedbackBody = {
          entryId,
          threadId: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID but non-existent
          userId: "user123",
          rating: "thumbs_up",
        };

        const request = createNextRequest(
          "POST",
          "/api/feedback",
          feedbackBody,
        );
        const response = await feedbackPost(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Thread not found");
      });
    });
  });
});
