import type { SessionView } from "../types";

interface HomeProps {
  session: SessionView;
  onStart: () => void;
}

export function Home({ session, onStart }: HomeProps) {
  const reviewCount = session.reviewQueue.length;

  return (
    <div className="screen screen-home">
      <p className="eyebrow">Good morning</p>
      <h1>Today&rsquo;s word is &ldquo;{session.newWord.word}&rdquo;</h1>
      <p className="lede">
        {reviewCount > 0
          ? `Plus ${reviewCount} word${reviewCount === 1 ? "" : "s"} due for review.`
          : "No reviews due today — just the new word."}
      </p>

      <div className="card queue-card">
        <div className="queue-row queue-row--new">
          <span className="queue-word">{session.newWord.word}</span>
          <span className="queue-tag">new</span>
        </div>
        {session.reviewQueue.map((item) => (
          <div className="queue-row" key={item.id}>
            <span className="queue-word">{item.word}</span>
            <span className="queue-strength" title={`strength ${item.strength}/5`}>
              {"●".repeat(item.strength)}
              {"○".repeat(5 - item.strength)}
            </span>
          </div>
        ))}
        {session.upcomingCount > 0 && (
          <p className="upcoming-note">
            {session.upcomingCount} more word{session.upcomingCount === 1 ? "" : "s"} not due yet.
          </p>
        )}
      </div>

      <button className="primary-button" onClick={onStart}>
        Start today&rsquo;s session
      </button>
    </div>
  );
}
