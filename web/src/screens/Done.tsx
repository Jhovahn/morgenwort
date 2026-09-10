import { useAutoFocus } from "../useAutoFocus";

interface DoneAttempt {
  word: string;
  score: number;
  dueAt: string;
}

interface DoneProps {
  attempts: DoneAttempt[];
  onHome: () => void;
}

function daysUntil(dueAt: string): number {
  const ms = new Date(dueAt).getTime() - Date.now();
  return Math.max(1, Math.round(ms / 86_400_000));
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
        {attempts.map((attempt, i) => {
          const days = daysUntil(attempt.dueAt);
          return (
            <div className="done-row" key={i}>
              <div className="queue-row">
                <span className="queue-word">{attempt.word}</span>
                <span className="queue-tag">{attempt.score}%</span>
              </div>
              <p className="done-review-note">
                Next review in {days} day{days === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
      </div>
      <button className="primary-button" onClick={onHome}>
        Back to overview
      </button>
    </main>
  );
}
