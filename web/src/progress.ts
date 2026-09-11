import type { ProgressMap } from "./types";

const STORAGE_KEY = "morgenwort:progress";

export interface StoredProgress {
  currentDay: number;
  progress: ProgressMap;
  /** Consecutive real-world days with at least one finished lesson.
   * Deliberately separate from currentDay, which advances per finished
   * session regardless of real elapsed time -- a streak has to track
   * actual calendar dates or it isn't measuring anything. */
  streak: number;
  /** UTC date string (YYYY-MM-DD) of the last day a lesson was finished,
   * or null before the first one ever. UTC rather than local time so the
   * boundary is deterministic and simple to reason about/test; the
   * tradeoff is the day can flip a few hours off from a user's actual
   * midnight depending on their timezone. */
  lastCompletionDate: string | null;
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Call once when a lesson session is finished. Increments the streak only
 * the first time that happens on a given (UTC) day -- repeating a day via
 * "Repeat" or finishing a second session the same day doesn't double-count.
 * A gap of a full day or more resets to 1 rather than continuing. */
export function bumpStreak(
  streak: number,
  lastCompletionDate: string | null,
): { streak: number; lastCompletionDate: string } {
  const today = todayDateString();
  if (lastCompletionDate === today) {
    return { streak, lastCompletionDate: today };
  }
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const wasYesterday = lastCompletionDate === yesterday.toISOString().slice(0, 10);
  return { streak: wasYesterday ? streak + 1 : 1, lastCompletionDate: today };
}

/** localStorage can throw (private browsing, disabled storage, quota) or
 * simply be empty/stale -- every caller treats a missing/broken value as
 * "brand new visitor" rather than an error, since that's already a state
 * the app has to handle (the very first visit, ever). */
export function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.currentDay !== "number" || typeof parsed?.progress !== "object") return null;
    // streak/lastCompletionDate postdate the original saved shape --
    // backfill rather than discarding otherwise-valid saved progress from
    // before this feature existed.
    return {
      currentDay: parsed.currentDay,
      progress: parsed.progress,
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      lastCompletionDate: typeof parsed.lastCompletionDate === "string" ? parsed.lastCompletionDate : null,
    };
  } catch {
    return null;
  }
}

export function saveProgress(state: StoredProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Nothing else reads this synchronously -- a failed save just means
    // progress won't survive a reload this time, not a broken app.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // If storage is inaccessible there was never anything to clear.
  }
}
