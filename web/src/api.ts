import type { AttemptResult, ProgressMap, SessionView } from "./types";

// In dev, Vite's proxy (vite.config.ts) forwards relative /api requests to
// the local server, so the empty default is correct there. A static
// production build has no such proxy, so it needs the deployed API's
// actual origin baked in at build time.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchSession(saved?: { currentDay: number; progress: ProgressMap }): Promise<SessionView> {
  const res = await fetch(`${API_BASE}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Omitting the body/progress entirely is how a brand-new visitor (no
    // saved state yet) signals that to the server -- see index.ts.
    body: saved ? JSON.stringify(saved) : JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`session fetch failed: ${res.status}`);
  return res.json();
}

export async function submitAttempt(id: string, heardText: string, currentStrength: number): Promise<AttemptResult> {
  const res = await fetch(`${API_BASE}/api/attempt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, heardText, currentStrength }),
  });
  if (!res.ok) throw new Error(`attempt submission failed: ${res.status}`);
  return res.json();
}
