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

export interface LessonDay {
  day: number;
  title: string;
  wordIds: string[];
}

type VocabContent = Omit<VocabItem, "introducedDaysAgo" | "strength">;

/** Content for every calendar-taught word, keyed by id. introducedDaysAgo
 * and strength aren't authored here — they're derived from LESSON_CALENDAR
 * below, so "which day teaches which word" has exactly one source of truth
 * instead of a day number and an offset that could quietly drift apart. */
const LESSON_CONTENT: Record<string, VocabContent> = {
  // Day 1 — Morning routine
  aufstehen: {
    id: "aufstehen",
    word: "aufstehen",
    sentenceDe: "Ich stehe um sieben Uhr auf.",
    sentenceEn: "I get up at seven.",
    tip: "In „sieben“ the ie is one long ee sound, not two.",
    strongTip: "Separable verb landed cleanly — auf carried the stress at the end.",
  },
  "das-bett": {
    id: "das-bett",
    word: "das Bett",
    sentenceDe: "Ich mache das Bett, bevor ich gehe.",
    sentenceEn: "I make the bed before I leave.",
    tip: "The final t in „Bett“ is short and unaspirated — no puff of air like the English t.",
    strongTip: "Nice and crisp — that final t stayed short, not puffed like an English t.",
  },
  "die-dusche": {
    id: "die-dusche",
    word: "die Dusche",
    sentenceDe: "Ich gehe zuerst unter die Dusche.",
    sentenceEn: "I get in the shower first.",
    tip: "„Dusche“ — the sch is one soft sh sound, and the u is short, not a long oo.",
    strongTip: "That sch came out soft and clean, no English oo dragging the u.",
  },
  "die-zaehne": {
    id: "die-zaehne",
    word: "die Zähne",
    sentenceDe: "Ich putze mir die Zähne.",
    sentenceEn: "I brush my teeth.",
    tip: "The z in „Zähne“ is a hard ts, not an English z, and the ä is an open eh.",
    strongTip: "Sharp ts on that z, and the ä landed nice and open.",
  },
  "das-fruehstueck": {
    id: "das-fruehstueck",
    word: "das Frühstück",
    sentenceDe: "Zum Frühstück esse ich ein Brötchen.",
    sentenceEn: "For breakfast I eat a bread roll.",
    tip: "„Frühstück“ has two ü sounds back to back — keep your lips rounded for both.",
    strongTip: "Both ü sounds stayed rounded the whole way through — that's the hard part nailed.",
  },

  // Day 2 — Getting dressed and out the door
  "die-kleidung": {
    id: "die-kleidung",
    word: "die Kleidung",
    sentenceDe: "Meine Kleidung liegt schon bereit.",
    sentenceEn: "My clothes are already laid out.",
    tip: "The ei in „Kleidung“ is one eye-sound, not two separate vowels.",
    strongTip: "That ei came out as one clean eye-sound, right where it should.",
  },
  "der-mantel": {
    id: "der-mantel",
    word: "der Mantel",
    sentenceDe: "Ich nehme meinen Mantel, weil es kalt ist.",
    sentenceEn: "I'm taking my coat because it's cold.",
    tip: "The a in „Mantel“ is short — a quick, clipped ah, not drawn out.",
    strongTip: "Short and clipped — that a in Mantel didn't drag out at all.",
  },
  "der-schluessel": {
    id: "der-schluessel",
    word: "der Schlüssel",
    sentenceDe: "Ich suche meinen Schlüssel.",
    sentenceEn: "I'm looking for my key.",
    tip: "The ü in „Schlüssel“ is short and rounded — round your lips like for oo but say ee.",
    strongTip: "Nice rounded ü — short and precise, not stretched into oo.",
  },
  "die-tuer": {
    id: "die-tuer",
    word: "die Tür",
    sentenceDe: "Ich schließe die Tür leise.",
    sentenceEn: "I close the door quietly.",
    tip: "The ü in „Tür“ is long — hold the rounded ee-shape a beat longer than in „Schlüssel“.",
    strongTip: "That long ü held just the right length — not rushed like the short one in Schlüssel.",
  },
  "die-strasse": {
    id: "die-strasse",
    word: "die Straße",
    sentenceDe: "Die Straße ist um diese Zeit noch leer.",
    sentenceEn: "The street is still empty at this time.",
    tip: "The ß in „Straße“ is just a sharp s sound, written differently because it follows a long vowel.",
    strongTip: "Sharp, clean s on that ß — exactly right.",
  },

  // Day 3 — The commute
  "die-u-bahn": {
    id: "die-u-bahn",
    word: "die U-Bahn",
    sentenceDe: "Ich fahre jeden Morgen mit der U-Bahn.",
    sentenceEn: "I take the subway every morning.",
    tip: "„U-Bahn“ is stressed on the U — say it like „OO-bahn“, not „u-BAHN“.",
    strongTip: "Stress landed right on the U, just like a native speaker would say it.",
  },
  "der-bus": {
    id: "der-bus",
    word: "der Bus",
    sentenceDe: "Der Bus kommt oft zu spät.",
    sentenceEn: "The bus often comes too late.",
    tip: "The u in „Bus“ is short — like the oo in „book“, not the long oo in „boot“.",
    strongTip: "Short and clipped u — exactly right, not dragged out.",
  },
  "das-fahrrad": {
    id: "das-fahrrad",
    word: "das Fahrrad",
    sentenceDe: "Manchmal fahre ich mit dem Fahrrad zur Arbeit.",
    sentenceEn: "Sometimes I ride my bike to work.",
    tip: "„Fahrrad“ has a long, open a — hold it, and keep the r afterward soft, almost swallowed.",
    strongTip: "That long a held nicely, and the r after it stayed soft.",
  },
  "die-ampel": {
    id: "die-ampel",
    word: "die Ampel",
    sentenceDe: "Ich warte an der Ampel.",
    sentenceEn: "I'm waiting at the traffic light.",
    tip: "Stress falls on the first syllable — AM-pel, not am-PEL.",
    strongTip: "Stress landed right on AM- where it belongs.",
  },
  puenktlich: {
    id: "puenktlich",
    word: "pünktlich",
    sentenceDe: "Ich bin heute pünktlich angekommen.",
    sentenceEn: "I arrived on time today.",
    tip: "The consonant cluster nktl needs every sound distinct — don't rush it into one blur.",
    strongTip: "Every consonant in that nktl cluster came through clearly — nothing blurred together.",
  },

  // Day 4 — At the office
  "das-buero": {
    id: "das-buero",
    word: "das Büro",
    sentenceDe: "Ich arbeite heute im Büro.",
    sentenceEn: "I'm working in the office today.",
    tip: "Stress lands on the second syllable — bü-RO, not BÜ-ro.",
    strongTip: "Stress landed on -RO exactly where it should.",
  },
  "der-kollege": {
    id: "der-kollege",
    word: "der Kollege",
    sentenceDe: "Mein Kollege hilft mir oft.",
    sentenceEn: "My colleague often helps me.",
    tip: "The final e in „Kollege“ is a light, neutral uh sound — don't stretch it into a full ay.",
    strongTip: "That final e stayed light and neutral, not stretched into ay.",
  },
  "die-besprechung": {
    id: "die-besprechung",
    word: "die Besprechung",
    sentenceDe: "Die Besprechung beginnt um neun Uhr.",
    sentenceEn: "The meeting starts at nine.",
    tip: "The ch after e in „Besprechung“ is a soft, breathy hiss at the front of the mouth, not a hard k.",
    strongTip: "That soft ch came through breathy and forward, not hardened into a k.",
  },
  "der-computer": {
    id: "der-computer",
    word: "der Computer",
    sentenceDe: "Mein Computer ist heute sehr langsam.",
    sentenceEn: "My computer is very slow today.",
    tip: "Even though it looks English, „Computer“ gets the German treatment — kom-PYU-ter, with a soft German r.",
    strongTip: "You gave it the German treatment, not an English one — well done.",
  },
  "die-pause": {
    id: "die-pause",
    word: "die Pause",
    sentenceDe: "Ich mache jetzt eine kurze Pause.",
    sentenceEn: "I'm taking a short break now.",
    tip: "„Pause“ has two clear syllables, Pau-se, and the au is one ow-sound, like in „house“.",
    strongTip: "That au came out as one clean ow-sound, and both syllables were distinct.",
  },

  // Day 5 — Lunch break
  "das-mittagessen": {
    id: "das-mittagessen",
    word: "das Mittagessen",
    sentenceDe: "Ich esse mein Mittagessen um zwölf Uhr.",
    sentenceEn: "I eat my lunch at twelve.",
    tip: "„Mittagessen“ is a compound of Mittag and essen — say it in two clear halves.",
    strongTip: "You kept the two halves of that compound word clear and distinct.",
  },
  "der-salat": {
    id: "der-salat",
    word: "der Salat",
    sentenceDe: "Ich nehme heute einen Salat.",
    sentenceEn: "I'm having a salad today.",
    tip: "Stress is on the second syllable — sa-LAT, not SA-lat.",
    strongTip: "Stress landed on -LAT exactly where it belongs.",
  },
  "das-brot": {
    id: "das-brot",
    word: "das Brot",
    sentenceDe: "Ich esse gern frisches Brot.",
    sentenceEn: "I like eating fresh bread.",
    tip: "The o in „Brot“ is long and closed — like the o in „note“, held a bit longer.",
    strongTip: "That long, closed o in Brot was held just right.",
  },
  "der-loeffel": {
    id: "der-loeffel",
    word: "der Löffel",
    sentenceDe: "Ich brauche noch einen Löffel.",
    sentenceEn: "I still need a spoon.",
    tip: "The ö in „Löffel“ is short — round your lips and say eh, not the long ö of „schön“.",
    strongTip: "Short and rounded — that ö didn't stretch out like a long one would.",
  },
  "die-gabel": {
    id: "die-gabel",
    word: "die Gabel",
    sentenceDe: "Die Gabel liegt neben dem Teller.",
    sentenceEn: "The fork is next to the plate.",
    tip: "The a in „Gabel“ is long and open — hold it, unlike the short a in „Mantel“.",
    strongTip: "That long open a in Gabel held nicely — good contrast with a short a.",
  },

  // Day 6 — Telling time
  "die-uhrzeit": {
    id: "die-uhrzeit",
    word: "die Uhrzeit",
    sentenceDe: "Ich weiß die genaue Uhrzeit nicht.",
    sentenceEn: "I don't know the exact time.",
    tip: "„Uhrzeit“ combines a long u (Uhr) with the ei diphthong (Zeit) — keep both distinct.",
    strongTip: "You kept the long u and the ei diphthong cleanly separate — nice.",
  },
  "die-minute": {
    id: "die-minute",
    word: "die Minute",
    sentenceDe: "Ich brauche noch eine Minute.",
    sentenceEn: "I need one more minute.",
    tip: "Stress falls on the second syllable — mi-NU-te, not MI-nu-te.",
    strongTip: "Stress landed right on -NU- where it belongs.",
  },
  "die-stunde": {
    id: "die-stunde",
    word: "die Stunde",
    sentenceDe: "Die Fahrt dauert eine Stunde.",
    sentenceEn: "The trip takes an hour.",
    tip: "The u in „Stunde“ is short — a quick, clipped oo, not the long u of „Uhr“.",
    strongTip: "Short and clipped — good contrast with the long u in Uhr.",
  },
  spaet: {
    id: "spaet",
    word: "spät",
    sentenceDe: "Ich bin heute leider spät dran.",
    sentenceEn: "Unfortunately I'm running late today.",
    tip: "The ä in „spät“ is long — an open, held eh sound.",
    strongTip: "That long ä held nicely, open and unhurried.",
  },
  frueh: {
    id: "frueh",
    word: "früh",
    sentenceDe: "Ich stehe morgen ganz früh auf.",
    sentenceEn: "I'm getting up very early tomorrow.",
    tip: "The ü in „früh“ is long — round your lips and hold the ee-shape, don't clip it short.",
    strongTip: "That long ü held its shape the whole way through.",
  },

  // Day 7 — Talking about the weather
  "das-wetter": {
    id: "das-wetter",
    word: "das Wetter",
    sentenceDe: "Das Wetter ist heute wechselhaft.",
    sentenceEn: "The weather is changeable today.",
    tip: "The e sounds in „Wetter“ are both short and open — nothing drawn out here.",
    strongTip: "Both of those short e's stayed crisp and short — nice.",
  },
  "die-sonne": {
    id: "die-sonne",
    word: "die Sonne",
    sentenceDe: "Die Sonne scheint heute den ganzen Tag.",
    sentenceEn: "The sun is shining all day today.",
    tip: "The o in „Sonne“ is short — cut off quickly by the double n.",
    strongTip: "Short and cut off cleanly — exactly right before that double n.",
  },
  "der-regen": {
    id: "der-regen",
    word: "der Regen",
    sentenceDe: "Der Regen hört gleich auf.",
    sentenceEn: "The rain will stop soon.",
    tip: "The e in „Regen“ is long — REH-gen — and the g stays a hard g, not soft.",
    strongTip: "Long e, hard g — both landed exactly right.",
  },
  kalt: {
    id: "kalt",
    word: "kalt",
    sentenceDe: "Es ist heute sehr kalt draußen.",
    sentenceEn: "It's very cold outside today.",
    tip: "The a in „kalt“ is short, and the final t is unaspirated, just like in „Bett“.",
    strongTip: "Short a, crisp final t — same clean pattern as Bett.",
  },
  warm: {
    id: "warm",
    word: "warm",
    sentenceDe: "Im Sommer ist es hier sehr warm.",
    sentenceEn: "In summer it's very warm here.",
    tip: "The a in „warm“ is long here, not short — hold it, then a soft r.",
    strongTip: "That long a held nicely before the soft r.",
  },

  // Day 8 — Grocery shopping
  "der-supermarkt": {
    id: "der-supermarkt",
    word: "der Supermarkt",
    sentenceDe: "Ich gehe schnell in den Supermarkt.",
    sentenceEn: "I'm quickly going to the supermarket.",
    tip: "„Supermarkt“: the u is long (SU-per), the a in -markt is short.",
    strongTip: "Long u up front, short a at the end — nice contrast, both correct.",
  },
  einkaufen: {
    id: "einkaufen",
    word: "einkaufen",
    sentenceDe: "Ich möchte heute Nachmittag einkaufen.",
    sentenceEn: "I want to go shopping this afternoon.",
    tip: "„Einkaufen“ starts with the ei diphthong, then au — two different diphthongs back to back.",
    strongTip: "Ei and au both came through as distinct, separate sounds — well done.",
  },
  "das-geld": {
    id: "das-geld",
    word: "das Geld",
    sentenceDe: "Ich habe nicht viel Geld dabei.",
    sentenceEn: "I don't have much money with me.",
    tip: "The final d in „Geld“ devoices to sound like a t at the end of the word.",
    strongTip: "That final d-sounds-like-t devoicing came through exactly right.",
  },
  bezahlen: {
    id: "bezahlen",
    word: "bezahlen",
    sentenceDe: "Ich bezahle das jetzt an der Kasse.",
    sentenceEn: "I'm paying for that now at the register.",
    tip: "The be- prefix is unstressed and quick — the stress lands on -ZAH-len.",
    strongTip: "Stress landed on -ZAH-len, with be- staying light in front.",
  },
  "die-kasse": {
    id: "die-kasse",
    word: "die Kasse",
    sentenceDe: "Die Schlange an der Kasse ist lang.",
    sentenceEn: "The line at the checkout is long.",
    tip: "The a in „Kasse“ is short, cut off by the double s.",
    strongTip: "Short, crisp a before that double s — right on pattern.",
  },

  // Day 9 — Family
  "die-familie": {
    id: "die-familie",
    word: "die Familie",
    sentenceDe: "Meine Familie wohnt nicht weit von hier.",
    sentenceEn: "My family doesn't live far from here.",
    tip: "„Familie“ has four syllables, fa-MI-li-e — don't swallow the final e.",
    strongTip: "All four syllables came through, including that final e — nicely paced.",
  },
  "die-mutter": {
    id: "die-mutter",
    word: "die Mutter",
    sentenceDe: "Meine Mutter ruft mich jeden Sonntag an.",
    sentenceEn: "My mother calls me every Sunday.",
    tip: "Both syllables in „Mutter“ are short and crisp — MUT-ter, no long vowels here.",
    strongTip: "Short and crisp all the way through — exactly right.",
  },
  "der-vater": {
    id: "der-vater",
    word: "der Vater",
    sentenceDe: "Mein Vater arbeitet noch immer viel.",
    sentenceEn: "My father still works a lot.",
    tip: "The a in „Vater“ is long, and the v sounds like an English f — FAH-ter.",
    strongTip: "That v-as-f and the long a both landed right where they should.",
  },
  "die-schwester": {
    id: "die-schwester",
    word: "die Schwester",
    sentenceDe: "Meine Schwester besucht mich diese Woche.",
    sentenceEn: "My sister is visiting me this week.",
    tip: "„Schwester“ starts sch plus a v-sounding w — SHVES-ter, not an English SHWES-ter.",
    strongTip: "That German w-as-v came through correctly, not an English w.",
  },
  "der-bruder": {
    id: "der-bruder",
    word: "der Bruder",
    sentenceDe: "Mein Bruder wohnt in einer anderen Stadt.",
    sentenceEn: "My brother lives in a different city.",
    tip: "The u in „Bruder“ is long — BROO-der, held a beat, with a soft d at the end.",
    strongTip: "Long, held u and a soft final d — both right on target.",
  },

  // Day 10 — A quiet evening at home
  "das-wohnzimmer": {
    id: "das-wohnzimmer",
    word: "das Wohnzimmer",
    sentenceDe: "Wir sitzen abends im Wohnzimmer.",
    sentenceEn: "In the evenings we sit in the living room.",
    tip: "„Wohnzimmer“ combines a long o (Wohn-) with a short i (-zim-) — keep the length contrast clear.",
    strongTip: "That length contrast between the long o and short i came through clearly.",
  },
  "das-sofa": {
    id: "das-sofa",
    word: "das Sofa",
    sentenceDe: "Ich lege mich kurz auf das Sofa.",
    sentenceEn: "I lie down on the sofa for a bit.",
    tip: "Stress is on the first syllable — SO-fa, not so-FA.",
    strongTip: "Stress landed on SO- right where German puts it.",
  },
  fernsehen: {
    id: "fernsehen",
    word: "fernsehen",
    sentenceDe: "Wir sehen heute Abend zusammen fern.",
    sentenceEn: "We're watching TV together tonight.",
    tip: "This is a separable verb — „fern“ splits off and moves to the end, just like „aufstehen“.",
    strongTip: "You handled the separable verb correctly — fern landed at the end, right where it belongs.",
  },
  kochen: {
    id: "kochen",
    word: "kochen",
    sentenceDe: "Ich koche heute etwas Einfaches.",
    sentenceEn: "I'm cooking something simple today.",
    tip: "The ch in „kochen“ after o is the back, throaty ch — not the soft ch of „ich“.",
    strongTip: "That back, throaty ch after the o came through correctly — different from the soft ch in ich.",
  },
  "das-abendessen": {
    id: "das-abendessen",
    word: "das Abendessen",
    sentenceDe: "Das Abendessen ist gleich fertig.",
    sentenceEn: "Dinner will be ready soon.",
    tip: "„Abendessen“ is a compound of Abend and essen — say it in two clear halves, like Mittagessen.",
    strongTip: "Both halves of that compound stayed distinct — nicely paced, just like Mittagessen.",
  },

  // Day 11 — Feelings
  muede: {
    id: "muede",
    word: "müde",
    sentenceDe: "Ich bin heute Abend schon müde.",
    sentenceEn: "I'm already tired this evening.",
    tip: "The ü in „müde“ is long — hold the rounded ee-shape through both syllables.",
    strongTip: "That long ü held its shape nicely through to the end.",
  },
  gluecklich: {
    id: "gluecklich",
    word: "glücklich",
    sentenceDe: "Ich bin sehr glücklich über die Nachricht.",
    sentenceEn: "I'm very happy about the news.",
    tip: "The ü in „glücklich“ is short, and the ck is one sharp k, not two separate sounds.",
    strongTip: "Short ü, one sharp k for that ck — both exactly right.",
  },
  traurig: {
    id: "traurig",
    word: "traurig",
    sentenceDe: "Er wirkt heute etwas traurig.",
    sentenceEn: "He seems a bit sad today.",
    tip: "„Traurig“ has the au diphthong, one ow-sound, followed by a soft, almost swallowed final g.",
    strongTip: "That au came through as one clean ow, and the final g stayed soft.",
  },
  aufgeregt: {
    id: "aufgeregt",
    word: "aufgeregt",
    sentenceDe: "Ich bin vor der Prüfung aufgeregt.",
    sentenceEn: "I'm nervous before the exam.",
    tip: "„Aufgeregt“ stacks two prefixes, auf and ge — keep each vowel distinct rather than rushing through.",
    strongTip: "You kept auf and ge distinct instead of rushing them together — nice control.",
  },
  ruhig: {
    id: "ruhig",
    word: "ruhig",
    sentenceDe: "Der Abend war sehr ruhig.",
    sentenceEn: "The evening was very calm.",
    tip: "The final -ig in „ruhig“ sounds like -ich, a soft ch, not a hard g.",
    strongTip: "That final -ig came out as the soft -ich sound, not a hard g — exactly right.",
  },

  // Day 12 — Weekend plans
  "das-wochenende": {
    id: "das-wochenende",
    word: "das Wochenende",
    sentenceDe: "Ich freue mich schon auf das Wochenende.",
    sentenceEn: "I'm already looking forward to the weekend.",
    tip: "„Wochenende“ has the throaty ch after o, then a completely different, soft final -ende.",
    strongTip: "You kept that throaty ch separate from the soft ending — good contrast.",
  },
  "der-ausflug": {
    id: "der-ausflug",
    word: "der Ausflug",
    sentenceDe: "Wir planen einen Ausflug für Samstag.",
    sentenceEn: "We're planning a trip for Saturday.",
    tip: "„Ausflug“ starts with the au diphthong, then a sharp fl cluster — keep both consonants distinct.",
    strongTip: "That fl cluster came through with both consonants distinct — nicely done.",
  },
  wandern: {
    id: "wandern",
    word: "wandern",
    sentenceDe: "Am Wochenende gehen wir gern wandern.",
    sentenceEn: "On weekends we like to go hiking.",
    tip: "The a in „wandern“ is short, and the German w sounds like an English v — VAHN-dern.",
    strongTip: "That w-as-v and the short a both came through correctly.",
  },
  "der-park": {
    id: "der-park",
    word: "der Park",
    sentenceDe: "Der Park ist um diese Zeit sehr ruhig.",
    sentenceEn: "The park is very quiet at this time.",
    tip: "The German r in „Park“ is softer than an English r — almost a light throat sound.",
    strongTip: "That softer German r came through — not the harder English version.",
  },
  spazieren: {
    id: "spazieren",
    word: "spazieren",
    sentenceDe: "Wir spazieren oft am Fluss entlang.",
    sentenceEn: "We often stroll along the river.",
    tip: "„Spazieren“ has the sp pronounced like „shp“ at the start of a word, plus a long ie.",
    strongTip: "That sp-as-shp and the long ie both landed right where they should.",
  },

  // Day 13 — Health and the doctor
  "der-arzt": {
    id: "der-arzt",
    word: "der Arzt",
    sentenceDe: "Ich habe morgen einen Termin beim Arzt.",
    sentenceEn: "I have a doctor's appointment tomorrow.",
    tip: "„Arzt“ packs three consonants at the end, rzt — say each one, don't drop the t.",
    strongTip: "You got all three of those final consonants in rzt — nothing dropped.",
  },
  krank: {
    id: "krank",
    word: "krank",
    sentenceDe: "Ich fühle mich heute etwas krank.",
    sentenceEn: "I feel a bit sick today.",
    tip: "The kr cluster at the start needs both consonants distinct, and the a is short.",
    strongTip: "That kr cluster came through with both sounds distinct — nicely crisp.",
  },
  gesund: {
    id: "gesund",
    word: "gesund",
    sentenceDe: "Ich versuche, mich gesund zu ernähren.",
    sentenceEn: "I try to eat healthily.",
    tip: "The u in „gesund“ is long — ge-ZUUND, with the stress on the second syllable.",
    strongTip: "Stress landed on -SUND with that long u held nicely.",
  },
  "die-apotheke": {
    id: "die-apotheke",
    word: "die Apotheke",
    sentenceDe: "Die Apotheke ist gleich um die Ecke.",
    sentenceEn: "The pharmacy is right around the corner.",
    tip: "The th in „Apotheke“ is just a plain t sound in German, not the English th.",
    strongTip: "You gave that th a plain German t, not an English th — exactly right.",
  },
  "die-medizin": {
    id: "die-medizin",
    word: "die Medizin",
    sentenceDe: "Ich nehme meine Medizin jeden Morgen.",
    sentenceEn: "I take my medicine every morning.",
    tip: "Stress falls on the last syllable, Medi-ZIN — unusual for German but common in this kind of loanword.",
    strongTip: "Stress landed on that final -ZIN, right where this loanword puts it.",
  },

  // Day 14 — Connecting your ideas
  trotzdem: {
    id: "trotzdem",
    word: "trotzdem",
    sentenceDe: "Es regnet, aber ich gehe trotzdem spazieren.",
    sentenceEn: "It's raining, but I'm going for a walk anyway.",
    tip: "„Trotzdem“ stacks tz and d back to back — say the tz as one sharp ts, then a clear d.",
    strongTip: "That tz-to-d transition came through clean and distinct.",
  },
  deshalb: {
    id: "deshalb",
    word: "deshalb",
    sentenceDe: "Ich bin müde, deshalb gehe ich früh ins Bett.",
    sentenceEn: "I'm tired, so I'm going to bed early.",
    tip: "The s in „deshalb“ is a hard, hissing s, not the softer z-sound German s sometimes has.",
    strongTip: "That hard, hissing s came through correctly — not softened.",
  },
  vielleicht: {
    id: "vielleicht",
    word: "vielleicht",
    sentenceDe: "Vielleicht regnet es morgen.",
    sentenceEn: "Maybe it will rain tomorrow.",
    tip: "„Vielleicht“ has a long ie followed by the ei diphthong — two different sounds, don't blend them.",
    strongTip: "You kept that long ie and the ei diphthong distinct — nice control on a tricky word.",
  },
  wahrscheinlich: {
    id: "wahrscheinlich",
    word: "wahrscheinlich",
    sentenceDe: "Ich komme wahrscheinlich etwas später.",
    sentenceEn: "I'll probably come a bit later.",
    tip: "This long word stresses the first syllable, WAHR-schein-lich — everything after stays lighter.",
    strongTip: "Stress landed on WAHR-, with the rest of this long word staying appropriately light.",
  },
  endlich: {
    id: "endlich",
    word: "endlich",
    sentenceDe: "Endlich ist die Woche vorbei.",
    sentenceEn: "Finally the week is over.",
    tip: "The final -lich has the same soft ch sound as the -ig ending in „ruhig“.",
    strongTip: "That soft -lich ending echoed the same soft ch as ruhig — nicely consistent.",
  },
};

/** The 3-month curriculum starts here. Only the first two weeks are
 * hand-written at this point — writing all ~90 days at this quality bar in
 * one pass wasn't a good use of a take-home's time, and 90 days of
 * thinner, templated content would undercut the thing this project is
 * actually trying to demonstrate. The pattern (a LessonDay entry + real
 * LESSON_CONTENT for its wordIds) extends directly; adding day 15 means
 * adding one more entry of each, nothing structural changes. */
export const LESSON_CALENDAR: LessonDay[] = [
  { day: 1, title: "Morning routine", wordIds: ["aufstehen", "das-bett", "die-dusche", "die-zaehne", "das-fruehstueck"] },
  { day: 2, title: "Getting dressed and out the door", wordIds: ["die-kleidung", "der-mantel", "der-schluessel", "die-tuer", "die-strasse"] },
  { day: 3, title: "The commute", wordIds: ["die-u-bahn", "der-bus", "das-fahrrad", "die-ampel", "puenktlich"] },
  { day: 4, title: "At the office", wordIds: ["das-buero", "der-kollege", "die-besprechung", "der-computer", "die-pause"] },
  { day: 5, title: "Lunch break", wordIds: ["das-mittagessen", "der-salat", "das-brot", "der-loeffel", "die-gabel"] },
  { day: 6, title: "Telling time", wordIds: ["die-uhrzeit", "die-minute", "die-stunde", "spaet", "frueh"] },
  { day: 7, title: "Talking about the weather", wordIds: ["das-wetter", "die-sonne", "der-regen", "kalt", "warm"] },
  { day: 8, title: "Grocery shopping", wordIds: ["der-supermarkt", "einkaufen", "das-geld", "bezahlen", "die-kasse"] },
  { day: 9, title: "Family", wordIds: ["die-familie", "die-mutter", "der-vater", "die-schwester", "der-bruder"] },
  { day: 10, title: "A quiet evening at home", wordIds: ["das-wohnzimmer", "das-sofa", "fernsehen", "kochen", "das-abendessen"] },
  { day: 11, title: "Feelings", wordIds: ["muede", "gluecklich", "traurig", "aufgeregt", "ruhig"] },
  { day: 12, title: "Weekend plans", wordIds: ["das-wochenende", "der-ausflug", "wandern", "der-park", "spazieren"] },
  { day: 13, title: "Health and the doctor", wordIds: ["der-arzt", "krank", "gesund", "die-apotheke", "die-medizin"] },
  { day: 14, title: "Connecting your ideas", wordIds: ["trotzdem", "deshalb", "vielleicht", "wahrscheinlich", "endlich"] },
];

export function lessonTitleForDay(day: number): string | undefined {
  return LESSON_CALENDAR.find((lesson) => lesson.day === day)?.title;
}

const CALENDAR_VOCAB: VocabItem[] = LESSON_CALENDAR.flatMap((lesson) =>
  lesson.wordIds.map((id) => ({
    ...LESSON_CONTENT[id],
    introducedDaysAgo: -(lesson.day - 1),
    strength: 1,
  })),
);

/** Words the demo user already learned before day one of this calendar —
 * exists purely to exercise the spaced-repetition review queue from the
 * start, not part of the day-by-day curriculum above. */
const REVIEW_DEMO_VOCAB: VocabItem[] = [
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

export const VOCAB: VocabItem[] = [...CALENDAR_VOCAB, ...REVIEW_DEMO_VOCAB];
