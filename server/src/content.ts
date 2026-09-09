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

/** Today's lesson: every VocabItem with introducedDaysAgo === 0. Themed as
 * one morning-routine narrative rather than unrelated words, so day one
 * reads as an actual lesson instead of a single flashcard. */
export const TODAYS_LESSON_TITLE = "Morning routine";

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
    id: "das-bett",
    word: "das Bett",
    sentenceDe: "Ich mache das Bett, bevor ich gehe.",
    sentenceEn: "I make the bed before I leave.",
    tip: "The final t in „Bett“ is short and unaspirated — no puff of air like the English t.",
    strongTip: "Nice and crisp — that final t stayed short, not puffed like an English t.",
    introducedDaysAgo: 0,
    strength: 1,
  },
  {
    id: "die-dusche",
    word: "die Dusche",
    sentenceDe: "Ich gehe zuerst unter die Dusche.",
    sentenceEn: "I get in the shower first.",
    tip: "„Dusche“ — the sch is one soft sh sound, and the u is short, not a long oo.",
    strongTip: "That sch came out soft and clean, no English oo dragging the u.",
    introducedDaysAgo: 0,
    strength: 1,
  },
  {
    id: "die-zaehne",
    word: "die Zähne",
    sentenceDe: "Ich putze mir die Zähne.",
    sentenceEn: "I brush my teeth.",
    tip: "The z in „Zähne“ is a hard ts, not an English z, and the ä is an open eh.",
    strongTip: "Sharp ts on that z, and the ä landed nice and open.",
    introducedDaysAgo: 0,
    strength: 1,
  },
  {
    id: "das-fruehstueck",
    word: "das Frühstück",
    sentenceDe: "Zum Frühstück esse ich ein Brötchen.",
    sentenceEn: "For breakfast I eat a bread roll.",
    tip: "„Frühstück“ has two ü sounds back to back — keep your lips rounded for both.",
    strongTip: "Both ü sounds stayed rounded the whole way through — that's the hard part nailed.",
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
