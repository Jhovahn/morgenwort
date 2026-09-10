import type { ProgressMap } from "./types";

const STORAGE_KEY = "morgenwort:progress";

export interface StoredProgress {
  currentDay: number;
  progress: ProgressMap;
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
    return parsed;
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
