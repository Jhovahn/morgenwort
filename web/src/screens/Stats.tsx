import type { SessionView } from "../types";
import { useAutoFocus } from "../useAutoFocus";

interface StatsProps {
  session: SessionView;
  onBack: () => void;
}

const STRENGTH_LEVELS = [5, 4, 3, 2, 1];

export function Stats({ session, onBack }: StatsProps) {
  const focusRef = useAutoFocus<HTMLElement>();
  const entries = Object.values(session.progress);
  const totalWords = entries.length;
  const daysCompleted = Math.max(0, session.currentDay - 1);

  const countsByStrength = new Map<number, number>();
  for (const entry of entries) {
    countsByStrength.set(entry.strength, (countsByStrength.get(entry.strength) ?? 0) + 1);
  }
  const maxCount = Math.max(1, ...countsByStrength.values());

  return (
    <main className="screen screen-stats" ref={focusRef} tabIndex={-1}>
      <p className="eyebrow">Your progress</p>
      <h1>
        {totalWords} word{totalWords === 1 ? "" : "s"} learned
      </h1>
      <p className="lede">
        {daysCompleted} day{daysCompleted === 1 ? "" : "s"} completed
      </p>

      {totalWords > 0 ? (
        <div className="card stats-card">
          {STRENGTH_LEVELS.map((strength) => {
            const count = countsByStrength.get(strength) ?? 0;
            return (
              <div className="stats-row" key={strength}>
                <span className="stats-label">Strength {strength}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="stats-count" aria-label={`${count} word${count === 1 ? "" : "s"}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="lede">No words learned yet — finish today&rsquo;s session to see progress here.</p>
      )}

      <button className="primary-button" onClick={onBack}>
        Back
      </button>
    </main>
  );
}
