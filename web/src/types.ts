export interface WordSummary {
  id: string;
  word: string;
  sentenceDe: string;
  sentenceEn: string;
  strength: number;
}

export interface SessionView {
  newWord: WordSummary;
  reviewQueue: (WordSummary & { dueAt: string })[];
  upcomingCount: number;
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
  nextDueInDays: number;
}
