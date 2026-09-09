import { describe, expect, it } from "vitest";
import { LESSON_CALENDAR, VOCAB, lessonTitleForDay } from "./content.js";

describe("LESSON_CALENDAR / VOCAB integrity", () => {
  it("has no duplicate ids in VOCAB", () => {
    const ids = VOCAB.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every wordId referenced by the calendar to a real, fully-populated VocabItem", () => {
    const byId = new Map(VOCAB.map((item) => [item.id, item]));
    for (const lesson of LESSON_CALENDAR) {
      for (const id of lesson.wordIds) {
        const item = byId.get(id);
        expect(item, `day ${lesson.day} references unknown word id "${id}"`).toBeDefined();
        // A typo'd id spreads `undefined` into the VocabItem (object spread on
        // undefined is a silent no-op, not a throw), leaving every field
        // undefined at runtime despite the static VocabItem type claiming
        // they're required strings -- this catches that case explicitly.
        expect(item?.word, `word id "${id}" resolved to an incomplete item`).toBeTruthy();
        expect(item?.sentenceDe, `word id "${id}" resolved to an incomplete item`).toBeTruthy();
        expect(item?.sentenceEn, `word id "${id}" resolved to an incomplete item`).toBeTruthy();
        expect(item?.tip, `word id "${id}" resolved to an incomplete item`).toBeTruthy();
        expect(item?.strongTip, `word id "${id}" resolved to an incomplete item`).toBeTruthy();
      }
    }
  });

  it("has consecutive day numbers starting at 1, each introducing exactly 5 words", () => {
    const days = LESSON_CALENDAR.map((lesson) => lesson.day);
    expect(days).toEqual(Array.from({ length: days.length }, (_, i) => i + 1));
    for (const lesson of LESSON_CALENDAR) {
      expect(lesson.wordIds.length, `day ${lesson.day} should introduce 5 words`).toBe(5);
    }
  });

  it("maps day 1's calendar entry to exactly the words with introducedDaysAgo 0", () => {
    const day1 = LESSON_CALENDAR.find((lesson) => lesson.day === 1);
    const todaysWordIds = VOCAB.filter((item) => item.introducedDaysAgo === 0).map((item) => item.id);
    expect(new Set(todaysWordIds)).toEqual(new Set(day1?.wordIds));
  });

  it("looks up a known day's title and returns undefined past the end of the calendar", () => {
    expect(lessonTitleForDay(1)).toBe("Morning routine");
    expect(lessonTitleForDay(LESSON_CALENDAR.length + 1)).toBeUndefined();
  });
});
