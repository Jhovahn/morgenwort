import type { AttemptResult, SessionView } from "./types";

export async function fetchSession(): Promise<SessionView> {
  const res = await fetch("/api/session");
  if (!res.ok) throw new Error(`session fetch failed: ${res.status}`);
  return res.json();
}

export async function submitAttempt(id: string, heardText: string): Promise<AttemptResult> {
  const res = await fetch("/api/attempt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, heardText }),
  });
  if (!res.ok) throw new Error(`attempt submission failed: ${res.status}`);
  return res.json();
}
