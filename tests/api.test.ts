import request from "supertest";
import { app } from "../src/index";
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
      await request(app).post("/threads").send({ userId: "prep", message: buildMessage() });
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
});
