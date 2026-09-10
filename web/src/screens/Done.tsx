import { useAutoFocus } from "../useAutoFocus";

interface DoneAttempt {
  word: string;
  score: number;
}

interface DoneProps {
  attempts: DoneAttempt[];
  onHome: () => void;
}

export function Done({ attempts, onHome }: DoneProps) {
  const focusRef = useAutoFocus<HTMLElement>();
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  return (
    <main className="screen screen-done" ref={focusRef} tabIndex={-1}>
      <p className="eyebrow">Session complete</p>
      <h1>{average}% average</h1>
      <div className="card">
        {attempts.map((attempt, i) => (
          <div className="queue-row" key={i}>
            <span className="queue-word">{attempt.word}</span>
            <span className="queue-tag">{attempt.score}%</span>
          </div>
        ))}
      </div>
      <button className="primary-button" onClick={onHome}>
        Back to overview
      </button>
    </main>
  );
}
