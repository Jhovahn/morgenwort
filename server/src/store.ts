import { LESSON_CALENDAR, REVIEW_DEMO_SEED, VOCAB } from "./content.js";
import { addDays, intervalDaysForStrength, isDue, nextStrength } from "./srs.js";
import { scoreAttempt, type ScoredAttempt } from "./scoring.js";
import { generateTip } from "./tipGenerator.js";

// Stateless by design: nothing in this module holds progress between
// requests. The browser is the source of truth (see web/src/progress.ts) --
// every call here takes the caller's current progress as an argument and
// returns what changed, rather than mutating an in-memory store that would
// reset on every server restart/redeploy (Render's free tier does this
// often) and couldn't be resumed from a different device visit anyway.

export interface ProgressEntry {
  strength: number;
  dueAt: string; // ISO
}

export type ProgressMap = Record<string, ProgressEntry>;

const VOCAB_BY_ID = new Map(VOCAB.map((item) => [item.id, item]));

/** A brand-new visitor's starting point: the pre-existing review-demo pool,
 * seeded relative to "now" exactly as the old server-side seed did, so a
 * first-time user still sees a word or two already due for review instead
 * of a completely empty queue. Never consulted again once a client has its
 * own saved progress. */
export function defaultProgress(now: Date): ProgressMap {
  const progress: ProgressMap = {};
  for (const seed of REVIEW_DEMO_SEED) {
    const introducedAt = addDays(now, -seed.introducedDaysAgo);
    const dueAt = addDays(introducedAt, intervalDaysForStrength(seed.strength));
    progress[seed.id] = { strength: seed.strength, dueAt: dueAt.toISOString() };
  }
  return progress;
}

interface WordSummary {
  id: string;
  word: string;
  sentenceDe: string;
  sentenceEn: string;
  strength: number;
}

export interface SessionView {
  currentDay: number;
  lessonTitle: string;
  newWords: WordSummary[];
  reviewQueue: (WordSummary & { dueAt: string })[];
  upcomingCount: number;
  upcomingLessons: { day: number; title: string; icon: string; featuredWord: string }[];
  /** Full progress snapshot, including entries the current view doesn't
   * otherwise surface (e.g. reviews not yet due) -- the client persists
   * this verbatim to localStorage after every request rather than trying
   * to merge partial updates itself. */
  progress: ProgressMap;
}

export function getSession(currentDay: number, progress: ProgressMap, now = new Date()): SessionView {
  const lesson = LESSON_CALENDAR.find((l) => l.day === currentDay);
  const lessonWordIds = new Set(lesson?.wordIds ?? []);

  const dueReviews: (WordSummary & { dueAt: string })[] = [];
  const upcomingReviewIds: string[] = [];
  for (const [id, entry] of Object.entries(progress)) {
    if (lessonWordIds.has(id)) continue;
    const item = VOCAB_BY_ID.get(id);
    if (!item) continue; // stale/unknown id in client-supplied progress -- ignore rather than throw
    if (isDue(new Date(entry.dueAt), now)) {
      dueReviews.push({
        id: item.id,
        word: item.word,
        sentenceDe: item.sentenceDe,
        sentenceEn: item.sentenceEn,
        strength: entry.strength,
        dueAt: entry.dueAt,
      });
    } else {
      upcomingReviewIds.push(id);
    }
  }

  const newWords: WordSummary[] = (lesson?.wordIds ?? []).map((id) => {
    const item = VOCAB_BY_ID.get(id)!;
    return {
      id: item.id,
      word: item.word,
      sentenceDe: item.sentenceDe,
      sentenceEn: item.sentenceEn,
      strength: progress[id]?.strength ?? 1,
    };
  });

  return {
    currentDay,
    // Past the last authored day, there's no lesson to teach -- see
    // README for why only 2 weeks are hand-written rather than all ~90.
    lessonTitle: lesson?.title ?? "You've completed every written lesson!",
    newWords,
    reviewQueue: dueReviews.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    upcomingCount: upcomingReviewIds.length,
    upcomingLessons: LESSON_CALENDAR.filter((l) => l.day > currentDay).map((l) => ({
      day: l.day,
      title: l.title,
      icon: l.icon,
      featuredWord: VOCAB_BY_ID.get(l.wordIds[0])?.word ?? "",
    })),
    progress,
  };
}

export interface AttemptResult extends ScoredAttempt {
  tip: string;
  strength: number;
  dueAt: string;
}

export async function recordAttempt(
  id: string,
  heardText: string,
  currentStrength: number,
  now = new Date(),
): Promise<AttemptResult | null> {
  const item = VOCAB_BY_ID.get(id);
  if (!item) return null;

  const scored = scoreAttempt(item.sentenceDe, heardText);
  const strength = nextStrength(currentStrength, scored.score);
  const dueAt = addDays(now, intervalDaysForStrength(strength));

  const tip = await generateTip({
    word: item.word,
    sentenceDe: item.sentenceDe,
    heardText,
    matched: scored.matched,
    perfect: scored.perfect,
    cannedTip: scored.perfect ? item.strongTip : item.tip,
  });

  return {
    ...scored,
    tip,
    strength,
    dueAt: dueAt.toISOString(),
  };
}
