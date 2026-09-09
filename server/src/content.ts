export interface VocabItem {
  id: string;
  word: string;
  sentenceDe: string;
  sentenceEn: string;
  /** Shown when the attempt has a mismatched word — a canned pronunciation
   * note for this item's known tricky sound, standing in for real phonetic
   * analysis (see README: scoring is a word-match diff, not audio ML). */
  tip: string;
  /** Shown when the attempt matches every word. */
  strongTip: string;
  introducedDaysAgo: number;
  strength: number;
}

export const VOCAB: VocabItem[] = [
  {
    id: "aufstehen",
    word: "aufstehen",
    sentenceDe: "Ich stehe um sieben Uhr auf.",
    sentenceEn: "I get up at seven.",
    tip: "In „sieben“ the ie is one long ee sound, not two.",
    strongTip: "Separable verb landed cleanly — auf carried the stress at the end.",
    introducedDaysAgo: 0,
    strength: 1,
  },
  {
    id: "der-kaffee",
    word: "der Kaffee",
    sentenceDe: "Dann trinke ich einen Kaffee in der Küche.",
    sentenceEn: "Then I drink a coffee in the kitchen.",
    tip: "The ü in „Küche“ is still coming out as oo. Round your lips, tongue forward.",
    strongTip: "Clean run — the ü landed exactly right.",
    introducedDaysAgo: 2,
    strength: 2,
  },
  {
    id: "die-bahn",
    word: "die Bahn",
    sentenceDe: "Ich nehme die Bahn um acht zur Arbeit.",
    sentenceEn: "I take the train to work at eight.",
    tip: "The r in „Arbeit“ is soft, almost swallowed — not a hard English r.",
    strongTip: "Nothing to fix — the r in Arbeit lands exactly right.",
    introducedDaysAgo: 5,
    strength: 3,
  },
  {
    id: "gemuetlich",
    word: "gemütlich",
    sentenceDe: "Abends ist es gemütlich bei mir.",
    sentenceEn: "In the evening it is cosy at my place.",
    tip: "ge-müt-lich — three even beats, stress on the middle syllable.",
    strongTip: "Three even beats, stress exactly on müt — well placed.",
    introducedDaysAgo: 9,
    strength: 2,
  },
];
