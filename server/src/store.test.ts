import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LESSON_CALENDAR, REVIEW_DEMO_SEED } from "./content.js";
import { defaultProgress, getSession, recordAttempt, type ProgressMap } from "./store.js";

const NOW = new Date("2026-09-08T08:00:00Z");

describe("defaultProgress", () => {
  it("seeds one entry per REVIEW_DEMO_SEED id, with strength carried through unchanged", () => {
    const progress = defaultProgress(NOW);
    expect(Object.keys(progress).sort()).toEqual(REVIEW_DEMO_SEED.map((s) => s.id).sort());
    for (const seed of REVIEW_DEMO_SEED) {
      expect(progress[seed.id].strength).toBe(seed.strength);
    }
  });

  it("computes dueAt as introducedDaysAgo ago plus that strength's review interval", () => {
    // gemuetlich: introduced 9 days ago, strength 2 -> 3-day interval ->
    // due 6 days ago (already overdue) -- matches the review queue always
    // showing gemuetlich as due for a brand-new visitor.
    const progress = defaultProgress(NOW);
    const dueAt = new Date(progress.gemuetlich.dueAt);
    const expected = new Date(NOW);
    expected.setDate(expected.getDate() - 6);
    expect(dueAt.toDateString()).toBe(expected.toDateString());
  });
});

describe("getSession", () => {
  it("returns day 1's words as newWords with default strength when progress is empty", () => {
    const session = getSession(1, {}, NOW);
    const day1 = LESSON_CALENDAR.find((l) => l.day === 1)!;
    expect(session.newWords.map((w) => w.id)).toEqual(day1.wordIds);
    expect(session.newWords.every((w) => w.strength === 1)).toBe(true);
    expect(session.lessonTitle).toBe(day1.title);
  });

  it("puts a word with a past dueAt in reviewQueue, not upcomingCount", () => {
    const progress: ProgressMap = {
      "der-kaffee": { strength: 2, dueAt: new Date(NOW.getTime() - 86_400_000).toISOString() },
    };
    const session = getSession(1, progress, NOW);
    expect(session.reviewQueue.map((w) => w.id)).toContain("der-kaffee");
    expect(session.upcomingCount).toBe(0);
  });

  it("puts a word with a future dueAt in upcomingCount, not reviewQueue", () => {
    const progress: ProgressMap = {
      "der-kaffee": { strength: 2, dueAt: new Date(NOW.getTime() + 86_400_000).toISOString() },
    };
    const session = getSession(1, progress, NOW);
    expect(session.reviewQueue).toHaveLength(0);
    expect(session.upcomingCount).toBe(1);
  });

  it("excludes a word from the review queue if it's also today's lesson, even if it's in progress", () => {
    const day1 = LESSON_CALENDAR.find((l) => l.day === 1)!;
    const wordId = day1.wordIds[0];
    const progress: ProgressMap = {
      [wordId]: { strength: 3, dueAt: new Date(NOW.getTime() - 86_400_000).toISOString() },
    };
    const session = getSession(1, progress, NOW);
    expect(session.reviewQueue.map((w) => w.id)).not.toContain(wordId);
    expect(session.upcomingCount).toBe(0);
  });

  it("only lists lesson days after currentDay in upcomingLessons", () => {
    const session = getSession(3, {}, NOW);
    expect(session.upcomingLessons.every((l) => l.day > 3)).toBe(true);
    expect(session.upcomingLessons.map((l) => l.day)).not.toContain(3);
  });

  it("falls back gracefully past the end of the written calendar", () => {
    const session = getSession(LESSON_CALENDAR.length + 1, {}, NOW);
    expect(session.newWords).toHaveLength(0);
    expect(session.upcomingLessons).toHaveLength(0);
    expect(session.lessonTitle).not.toBe("");
  });

  it("echoes the input progress back unchanged", () => {
    const progress: ProgressMap = { "die-bahn": { strength: 4, dueAt: NOW.toISOString() } };
    const session = getSession(1, progress, NOW);
    expect(session.progress).toEqual(progress);
  });
});

describe("recordAttempt", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  });

  it("computes strength and dueAt from the caller-supplied currentStrength, without any hidden state", async () => {
    const result = await recordAttempt("aufstehen", "ich stehe um sieben uhr auf", 2, NOW);
    expect(result).not.toBeNull();
    expect(result!.perfect).toBe(true);
    expect(result!.strength).toBe(3); // nextStrength(2, 100) -> 3
    expect(new Date(result!.dueAt).getTime()).toBeGreaterThan(NOW.getTime());
  });

  it("returns null for an unknown id instead of throwing", async () => {
    const result = await recordAttempt("not-a-real-id", "whatever", 1, NOW);
    expect(result).toBeNull();
  });
});
