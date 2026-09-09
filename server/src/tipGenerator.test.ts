import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateTip } from "./tipGenerator.js";

describe("generateTip", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  });

  it("falls back to the canned tip when no API key is configured", async () => {
    const tip = await generateTip({
      word: "die Bahn",
      sentenceDe: "Ich nehme die Bahn.",
      heardText: "ich nehme das bahn",
      matched: [
        { word: "ich", correct: true },
        { word: "nehme", correct: true },
        { word: "die", correct: false },
        { word: "bahn", correct: true },
      ],
      perfect: false,
      cannedTip: "The r in Arbeit is soft, almost swallowed.",
    });

    expect(tip).toBe("The r in Arbeit is soft, almost swallowed.");
  });
});
