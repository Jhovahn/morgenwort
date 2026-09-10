import { useEffect, useRef, useState } from "react";
import { submitAttempt } from "../api";
import type { AttemptResult, PracticeMode, WordSummary } from "../types";
import { useSpeechRecognition } from "../useSpeechRecognition";
import { useSpeechSynthesis } from "../useSpeechSynthesis";

// Web Speech API error reasons that specifically mean "the browser refused
// to give this page mic access" -- distinct from no-speech-detected, which
// means access was granted but nothing was heard. Conflating the two under
// one generic message sends a permission problem down a "try speaking
// again" dead end that can never succeed until the user changes a browser
// setting.
const PERMISSION_ERRORS = new Set(["not-allowed", "service-not-allowed"]);

function micErrorMessage(reason: string | null): string {
  if (reason && PERMISSION_ERRORS.has(reason)) {
    return "Microphone access was denied. Check your browser's site settings to allow the microphone for this page, then try again.";
  }
  if (reason === "audio-capture") {
    return "No microphone was found. Check that one is connected, then try again.";
  }
  if (reason === "no-speech") {
    return "Didn't catch that — tap to try again.";
  }
  return "Something went wrong with the microphone — tap to try again.";
}

interface SpeakProps {
  item: WordSummary;
  mode: PracticeMode;
  position: number;
  total: number;
  onResult: (result: AttemptResult, heardText: string) => void;
}

export function Speak({ item, mode, position, total, onResult }: SpeakProps) {
  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();
  const [manualText, setManualText] = useState("");
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Speak stays mounted across every item in the queue and across the
  // prompt<->result toggle within one item (App.tsx never remounts it),
  // so the mount-only useAutoFocus hook used elsewhere wouldn't refire
  // here -- this refocuses explicitly on the transitions that matter.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [item.id, result]);

  function resetAttempt() {
    setResult(null);
    setError(null);
    setManualText("");
    recognition.reset();
  }

  useEffect(() => {
    resetAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  async function score(heardText: string) {
    setScoring(true);
    setError(null);
    try {
      const attempt = await submitAttempt(item.id, heardText, item.strength);
      setResult(attempt);
    } catch {
      setError("Couldn't reach the server — check that the API is running.");
    } finally {
      setScoring(false);
    }
  }

  useEffect(() => {
    if (recognition.state === "done" && recognition.transcript) {
      score(recognition.transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition.state]);

  const listenIcon = synthesis.supported && (
    <button
      className="inline-listen-button"
      onClick={() => synthesis.speak(item.sentenceDe)}
      aria-label="Listen to the German sentence"
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );

  if (result) {
    return (
      <main className="screen screen-speak">
        <p className="eyebrow">{result.perfect ? "Nailed it" : `${result.score}% match`}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {item.word}
        </h1>
        <p className="sentence-de sentence-de--matched">
          {result.matched.map((m, i) => (
            <span
              key={i}
              className={m.correct ? "word-correct" : "word-incorrect"}
              aria-label={`${m.word}, ${m.correct ? "correct" : "incorrect"}`}
            >
              {m.word}{" "}
            </span>
          ))}
          {listenIcon}
        </p>
        <p className="tip">{result.tip}</p>
        <div className="button-row">
          <button className="secondary-button" onClick={resetAttempt}>
            Try again
          </button>
          <button className="primary-button" onClick={() => onResult(result, recognition.transcript || manualText)}>
            Next
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen screen-speak">
      <p className="eyebrow">
        {position} of {total}
        {mode === "translate" ? " · Translate" : ""}
      </p>
      <h1 ref={headingRef} tabIndex={-1}>
        {item.word}
      </h1>
      {mode === "translate" ? (
        <>
          <p className="lede">Say it in German.</p>
          <p className="sentence-de sentence-de--standalone">{item.sentenceEn}</p>
        </>
      ) : (
        <>
          <p className="sentence-de">
            {item.sentenceDe} {listenIcon}
          </p>
          <p className="sentence-en">{item.sentenceEn}</p>
        </>
      )}

      {recognition.supported ? (
        <>
          <button
            className={`mic-button ${recognition.state === "listening" ? "mic-button--active" : ""}`}
            onClick={recognition.start}
            disabled={recognition.state === "listening" || scoring}
          >
            {recognition.state === "listening" ? "Listening…" : "Tap to speak"}
          </button>
          {recognition.state === "listening" && (
            <p className="live-transcript" role="status" aria-live="polite">
              {recognition.transcript || "…"}
            </p>
          )}
          {recognition.state === "error" && (
            <p className="error-text">{micErrorMessage(recognition.errorReason)}</p>
          )}
        </>
      ) : (
        <div className="manual-fallback">
          <p className="fallback-note">
            Speech recognition isn&rsquo;t available in this browser — type what you would have said.
          </p>
          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type the sentence in German"
          />
          <button
            className="primary-button"
            onClick={() => score(manualText)}
            disabled={!manualText.trim() || scoring}
          >
            Submit
          </button>
        </div>
      )}

      {scoring && <p className="scoring-note">Scoring…</p>}
      {error && <p className="error-text">{error}</p>}
    </main>
  );
}
