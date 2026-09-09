import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { defaultProgress, getSession, recordAttempt, type ProgressMap } from "./store.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

app.use(cors());
app.use(express.json());

// Render's deploy health check needs a GET route that's always cheap and
// always 200 -- registered ahead of the rate limiter so frequent health
// checks can never themselves trip it. /api/session used to double as
// this before it became POST-only; a GET health check against a
// POST-only route 404s, which reads to Render as "unhealthy" and blocks
// the rollout from ever completing, silently, with no build error.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Crude per-IP limiter — no auth on this API, this plus the fixed content
// set is the whole cost-control story. Fine for a demo, not production.
app.use(
  "/api",
  rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }),
);

function isValidProgress(value: unknown): value is ProgressMap {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value).every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as ProgressEntryLike).strength === "number" &&
      typeof (entry as ProgressEntryLike).dueAt === "string",
  );
}

interface ProgressEntryLike {
  strength: unknown;
  dueAt: unknown;
}

app.post("/api/session", (req, res) => {
  const body = req.body ?? {};
  const now = new Date();

  // No progress key at all is how a brand-new client (nothing in
  // localStorage yet) signals itself; a malformed-but-present progress
  // value falls back to the same default rather than 400ing, since this
  // is trusted-by-construction client state, not a real security boundary.
  const progress: ProgressMap = isValidProgress(body.progress) ? body.progress : defaultProgress(now);
  const currentDay = typeof body.currentDay === "number" && body.currentDay >= 1 ? body.currentDay : 1;

  res.json(getSession(currentDay, progress, now));
});

app.post("/api/attempt", async (req, res) => {
  const { id, heardText, currentStrength } = req.body ?? {};
  if (typeof id !== "string" || typeof heardText !== "string" || typeof currentStrength !== "number") {
    res.status(400).json({ error: "id, heardText, and currentStrength are required" });
    return;
  }

  const result = await recordAttempt(id, heardText, currentStrength);
  if (!result) {
    res.status(404).json({ error: `no vocab item with id "${id}"` });
    return;
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Morgenwort API listening on http://localhost:${PORT}`);
});
