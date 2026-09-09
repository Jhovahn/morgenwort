import { TODAYS_LESSON_TITLE, VOCAB, type VocabItem } from "./content.js";
import { addDays, intervalDaysForStrength, isDue, nextStrength } from "./srs.js";
import { scoreAttempt, type ScoredAttempt } from "./scoring.js";
import { generateTip } from "./tipGenerator.js";

interface TrackedItem extends VocabItem {
  dueAt: Date;
}

function seedItems(now: Date): TrackedItem[] {
  return VOCAB.map((item) => {
    const introducedAt = addDays(now, -item.introducedDaysAgo);
    return { ...item, dueAt: addDays(introducedAt, intervalDaysForStrength(item.strength)) };
  });
}

// Single in-memory demo session — deliberately not per-user or persistent.
// A real product would key this store by authenticated user id and back
// it with a database; out of scope for this take-home (see README).
const items: TrackedItem[] = seedItems(new Date());

export interface SessionView {
  lessonTitle: string;
  newWords: Pick<TrackedItem, "id" | "word" | "sentenceDe" | "sentenceEn" | "strength">[];
  reviewQueue: Pick<TrackedItem, "id" | "word" | "sentenceDe" | "sentenceEn" | "strength" | "dueAt">[];
  upcomingCount: number;
}

export function getSession(now = new Date()): SessionView {
  // Today's lesson is every item introduced today (introducedDaysAgo === 0),
  // in content.ts's authored order — that ordering is the lesson's intended
  // narrative sequence (get up -> make the bed -> shower -> ...), not
  // arbitrary, so it's preserved rather than re-sorted.
  const lessonItems = items.filter((item) => item.introducedDaysAgo === 0);
  const lessonIds = new Set(lessonItems.map((item) => item.id));
  const dueReviews = items.filter((item) => !lessonIds.has(item.id) && isDue(item.dueAt, now));
  const upcoming = items.filter((item) => !lessonIds.has(item.id) && !isDue(item.dueAt, now));

  return {
    lessonTitle: TODAYS_LESSON_TITLE,
    newWords: lessonItems.map(pickWordFields),
    reviewQueue: dueReviews
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
      .map((item) => ({ ...pickWordFields(item), dueAt: item.dueAt })),
    upcomingCount: upcoming.length,
  };
}

function pickWordFields(item: TrackedItem) {
  return {
    id: item.id,
    word: item.word,
    sentenceDe: item.sentenceDe,
    sentenceEn: item.sentenceEn,
    strength: item.strength,
  };
}

export interface AttemptResult extends ScoredAttempt {
  tip: string;
  strength: number;
  nextDueInDays: number;
}

export async function recordAttempt(
  id: string,
  heardText: string,
  now = new Date(),
): Promise<AttemptResult | null> {
  const item = items.find((i) => i.id === id);
  if (!item) return null;

  const scored = scoreAttempt(item.sentenceDe, heardText);
  item.strength = nextStrength(item.strength, scored.score);
  const nextDueInDays = intervalDaysForStrength(item.strength);
  item.dueAt = addDays(now, nextDueInDays);

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
    strength: item.strength,
    nextDueInDays,
  };
}

export function resetStore(now = new Date()): void {
  items.splice(0, items.length, ...seedItems(now));
}
