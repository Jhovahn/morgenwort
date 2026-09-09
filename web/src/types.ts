export interface WordSummary {
  id: string;
  word: string;
  sentenceDe: string;
  sentenceEn: string;
  strength: number;
}

export interface UpcomingLesson {
  day: number;
  title: string;
  icon: string;
  featuredWord: string;
}

export interface ProgressEntry {
  strength: number;
  dueAt: string;
}

export type ProgressMap = Record<string, ProgressEntry>;

export interface SessionView {
  currentDay: number;
  lessonTitle: string;
  newWords: WordSummary[];
  reviewQueue: (WordSummary & { dueAt: string })[];
  upcomingCount: number;
  upcomingLessons: UpcomingLesson[];
  progress: ProgressMap;
}

// "repeat": the target German sentence is shown; read it aloud. Used for
// new lesson words, which haven't been learned yet, so there's nothing to
// recall.
// "translate": only the English sentence is shown; produce the German
// from memory. Used for review-queue words, which the learner is
// expected to already know -- recall, not repetition, is the point.
export type PracticeMode = "repeat" | "translate";

export interface QueueItem extends WordSummary {
  mode: PracticeMode;
}

export interface WordMatch {
  word: string;
  correct: boolean;
}

export interface AttemptResult {
  score: number;
  matched: WordMatch[];
  perfect: boolean;
  tip: string;
  strength: number;
  dueAt: string;
}
