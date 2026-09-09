/**
 * Chrome's German speech recognizer applies inverse text normalization: it
 * renders spoken numbers as digits in the transcript — "um sieben Uhr"
 * comes back as "um 7 Uhr" — even though it recognized the word correctly.
 * That's a formatting choice by the STT engine, not a mishearing, so
 * scoring.ts undoes it before diffing against the target sentence's
 * spelled-out numbers.
 *
 * Covers 0-12, the range that actually appears when telling time — the
 * only place numbers show up in this app's vocabulary — rather than
 * general German numeral formation, which gets grammatically involved past
 * twenty (compounds like "einundzwanzig") and isn't needed by any current
 * content. "1" maps to "eins" (the standalone form); it won't match a
 * sentence using the gendered "ein"/"eine"/"einen", but nothing in the
 * current content hits that case.
 */
const DIGIT_TO_WORD: Record<string, string> = {
  "0": "null",
  "1": "eins",
  "2": "zwei",
  "3": "drei",
  "4": "vier",
  "5": "fünf",
  "6": "sechs",
  "7": "sieben",
  "8": "acht",
  "9": "neun",
  "10": "zehn",
  "11": "elf",
  "12": "zwölf",
};

export function digitToGermanWord(token: string): string | undefined {
  return DIGIT_TO_WORD[token];
}
