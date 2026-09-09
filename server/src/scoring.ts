import { digitToGermanWord } from "./numberWords.js";

/**
 * Attempt scoring is a deterministic word-match diff between the target
 * sentence and the transcript the browser's speech-recognition API heard —
 * NOT phonetic/pronunciation analysis. It's a stand-in for real audio-based
 * scoring (see README), grounded in an actual transcript rather than
 * faked, but it can't detect a wrong vowel sound inside an otherwise
 * correctly-recognized word.
 */
export interface WordMatch {
  word: string;
  correct: boolean;
}

export interface ScoredAttempt {
  score: number;
  matched: WordMatch[];
  perfect: boolean;
}

function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[.,!?;:„“"]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function scoreAttempt(targetSentence: string, heardText: string): ScoredAttempt {
  const targetWords = tokenize(targetSentence);
  // The recognizer renders spoken numbers as digits (see numberWords.ts) —
  // undo that before diffing, since target sentences are always spelled out.
  const heardWords = tokenize(heardText).map((word) => digitToGermanWord(word) ?? word);

  const matched: WordMatch[] = targetWords.map((word, i) => ({
    word,
    correct: heardWords[i] === word,
  }));

  const correctCount = matched.filter((m) => m.correct).length;
  const score = targetWords.length === 0 ? 0 : Math.round((correctCount / targetWords.length) * 100);

  return { score, matched, perfect: correctCount === targetWords.length };
}
