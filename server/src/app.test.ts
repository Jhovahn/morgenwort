import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./app.js";

// Exercises real HTTP request/response handling (routing, JSON parsing,
// status codes, input validation) through supertest against the actual
// Express app -- store.ts/scoring.ts/srs.ts already have their own unit
// tests for the logic itself; this is the thin layer wiring HTTP to that
// logic, which was previously untested end to end.
describe("API routes", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY; // deterministic (canned) tips, no live API calls
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  });

  describe("GET /api/health", () => {
    it("returns 200 ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /api/session", () => {
    it("seeds a brand-new visitor's defaults when the body is empty", async () => {
      const res = await request(app).post("/api/session").send({});
      expect(res.status).toBe(200);
      expect(res.body.currentDay).toBe(1);
      expect(res.body.lessonTitle).toBe("Morning routine");
      expect(res.body.newWords).toHaveLength(5);
      expect(Object.keys(res.body.progress).length).toBeGreaterThan(0);
    });

    it("honors a caller-supplied currentDay and progress", async () => {
      const progress = { "der-kaffee": { strength: 3, dueAt: new Date().toISOString() } };
      const res = await request(app).post("/api/session").send({ currentDay: 2, progress });
      expect(res.status).toBe(200);
      expect(res.body.currentDay).toBe(2);
      expect(res.body.lessonTitle).toBe("Getting dressed and out the door");
      expect(res.body.progress).toEqual(progress);
    });
  });

  describe("POST /api/attempt", () => {
    it("scores a correct attempt and returns updated strength/dueAt", async () => {
      const res = await request(app)
        .post("/api/attempt")
        .send({ id: "aufstehen", heardText: "ich stehe um sieben uhr auf", currentStrength: 1 });
      expect(res.status).toBe(200);
      expect(res.body.perfect).toBe(true);
      expect(res.body.score).toBe(100);
      expect(res.body.strength).toBe(2);
      expect(new Date(res.body.dueAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("400s when a required field is missing", async () => {
      const res = await request(app).post("/api/attempt").send({ id: "aufstehen", heardText: "hallo" });
      expect(res.status).toBe(400);
    });

    it("404s for an unknown vocab id", async () => {
      const res = await request(app)
        .post("/api/attempt")
        .send({ id: "not-a-real-id", heardText: "hallo", currentStrength: 1 });
      expect(res.status).toBe(404);
    });
  });
});
