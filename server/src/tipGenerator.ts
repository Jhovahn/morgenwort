import Anthropic from "@anthropic-ai/sdk";
import type { WordMatch } from "./scoring.js";

let anthropic: Anthropic | undefined;

function getClient(): Anthropic {
  if (!anthropic) anthropic = new Anthropic();
  return anthropic;
}

export interface TipRequest {
  word: string;
  sentenceDe: string;
  heardText: string;
  matched: WordMatch[];
  perfect: boolean;
  /** The curated fallback tip for this outcome (content.ts's `tip` or
   * `strongTip`) — the only phonetic ground truth available, since there's
   * no audio here, only text. Passed to Claude as domain knowledge to
   * phrase around; used verbatim when no API key is configured. */
  cannedTip: string;
}

const SYSTEM_PROMPT = `You are a warm, specific German pronunciation coach reviewing a learner's spoken-sentence attempt.

You are NOT given audio — only the target sentence, a transcript of what speech recognition heard, and a per-word correct/incorrect list from an exact text comparison. You're also given a curated note about this vocabulary item's known trouble spot, written by a human reviewer. Treat that note as the only phonetic ground truth you have — never invent a phonetic claim beyond what it tells you.

Write ONE short tip, at most two sentences, personalized to this specific attempt:
- If every word was correct: congratulate them briefly, referencing the curated note as something they evidently got right this time.
- If some word(s) were wrong: name which word(s) differed from the target sentence. If the curated note's trouble spot is among the wrong words, weave the note in naturally. If not, just note the mismatch plainly rather than stretching the note to fit.

Keep it encouraging. No preamble, no quotation marks — just the tip itself.`;

function mockTip(req: TipRequest): string {
  return req.cannedTip;
}

export async function generateTip(req: TipRequest): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[tipGenerator] ANTHROPIC_API_KEY not set — using canned tip instead of Claude.");
    return mockTip(req);
  }

  const wrongWords = req.matched.filter((m) => !m.correct).map((m) => m.word);

  try {
    const message = await getClient().messages.create({
      model: "claude-sonnet-5",
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            `Vocabulary word: ${req.word}`,
            `Target sentence: ${req.sentenceDe}`,
            `Heard (speech-to-text transcript): ${req.heardText || "(nothing recognized)"}`,
            `Per-word result: ${req.matched.map((m) => `${m.word}=${m.correct ? "correct" : "wrong"}`).join(", ")}`,
            `Wrong words: ${wrongWords.length ? wrongWords.join(", ") : "none"}`,
            `Curated trouble-spot note: ${req.cannedTip}`,
          ].join("\n"),
        },
      ],
    });

    const textBlock = message.content.find((block): block is Anthropic.TextBlock => block.type === "text");
    return textBlock?.text.trim() || mockTip(req);
  } catch (err) {
    console.warn("[tipGenerator] Claude call failed — falling back to canned tip.", err);
    return mockTip(req);
  }
}
