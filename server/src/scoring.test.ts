import { describe, expect, it } from "vitest";
import { scoreAttempt } from "./scoring.js";

describe("scoreAttempt", () => {
  it("scores a perfect transcript as 100 with every word correct", () => {
    const result = scoreAttempt("Ich stehe um sieben Uhr auf.", "ich stehe um sieben uhr auf");
    expect(result.score).toBe(100);
    expect(result.perfect).toBe(true);
    expect(result.matched.every((m) => m.correct)).toBe(true);
  });

  it("is case- and punctuation-insensitive", () => {
    const result = scoreAttempt("Die Bahn.", "DIE BAHN");
    expect(result.perfect).toBe(true);
  });

  it("marks mismatched words as incorrect and lowers the score proportionally", () => {
    const result = scoreAttempt("Ich nehme die Bahn.", "ich nehme das bahn");
    expect(result.perfect).toBe(false);
    expect(result.score).toBe(75);
    expect(result.matched.map((m) => m.correct)).toEqual([true, true, false, true]);
  });

  it("treats a missing trailing word as incorrect rather than throwing", () => {
    const result = scoreAttempt("Ich stehe auf.", "ich stehe");
    expect(result.score).toBe(67);
    expect(result.matched[2]).toEqual({ word: "auf", correct: false });
  });

  it("scores an empty transcript as zero", () => {
    const result = scoreAttempt("Die Bahn.", "");
    expect(result.score).toBe(0);
    expect(result.perfect).toBe(false);
  });

  it("normalizes digits the recognizer substitutes for spoken numbers", () => {
    const result = scoreAttempt("Ich stehe um sieben Uhr auf.", "ich stehe um 7 uhr auf");
    expect(result.perfect).toBe(true);
    expect(result.matched.find((m) => m.word === "sieben")).toEqual({ word: "sieben", correct: true });
  });

  it("leaves unrecognized digits (outside the covered 0-12 range) as a mismatch", () => {
    const result = scoreAttempt("Der Preis ist siebzehn Euro.", "der preis ist 17 euro");
    expect(result.matched.find((m) => m.word === "siebzehn")).toEqual({ word: "siebzehn", correct: false });
  });
});
