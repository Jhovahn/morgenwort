import { useEffect, useState } from "react";
import { submitAttempt } from "../api";
import type { AttemptResult, WordSummary } from "../types";
import { useSpeechRecognition } from "../useSpeechRecognition";

interface SpeakProps {
  item: WordSummary;
  onResult: (result: AttemptResult, heardText: string) => void;
}

export function Speak({ item, onResult }: SpeakProps) {
  const recognition = useSpeechRecognition();
  const [manualText, setManualText] = useState("");
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResult(null);
    setError(null);
    setManualText("");
    recognition.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  async function score(heardText: string) {
    setScoring(true);
    setError(null);
    try {
      const attempt = await submitAttempt(item.id, heardText);
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

  if (result) {
    return (
      <div className="screen screen-speak">
        <p className="eyebrow">{result.perfect ? "Nailed it" : `${result.score}% match`}</p>
        <h1>{item.word}</h1>
        <p className="sentence-de sentence-de--matched">
          {result.matched.map((m, i) => (
            <span key={i} className={m.correct ? "word-correct" : "word-incorrect"}>
              {m.word}{" "}
            </span>
          ))}
        </p>
        <p className="tip">{result.tip}</p>
        <button className="primary-button" onClick={() => onResult(result, recognition.transcript || manualText)}>
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="screen screen-speak">
      <p className="eyebrow">Say it out loud</p>
      <h1>{item.word}</h1>
      <p className="sentence-de">{item.sentenceDe}</p>

      {recognition.supported ? (
        <>
          <button
            className={`mic-button ${recognition.state === "listening" ? "mic-button--active" : ""}`}
            onClick={recognition.start}
            disabled={recognition.state === "listening" || scoring}
          >
            {recognition.state === "listening" ? "Listening…" : "Tap to speak"}
          </button>
          {recognition.state === "error" && (
            <p className="error-text">Didn&rsquo;t catch that — tap to try again.</p>
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
    </div>
  );
}
