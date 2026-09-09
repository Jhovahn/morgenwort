import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { getSession, recordAttempt } from "./store.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

app.use(cors());
app.use(express.json());

// Crude per-IP limiter — no auth on this API, this plus the fixed in-memory
// dataset is the whole cost-control story. Fine for a demo, not production.
app.use(
  "/api",
  rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }),
);

app.get("/api/session", (_req, res) => {
  res.json(getSession());
});

app.post("/api/attempt", (req, res) => {
  const { id, heardText } = req.body ?? {};
  if (typeof id !== "string" || typeof heardText !== "string") {
    res.status(400).json({ error: "id and heardText are required strings" });
    return;
  }

  const result = recordAttempt(id, heardText);
  if (!result) {
    res.status(404).json({ error: `no vocab item with id "${id}"` });
    return;
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Morgenwort API listening on http://localhost:${PORT}`);
});
