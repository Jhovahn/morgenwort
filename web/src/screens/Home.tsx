import type { SessionView } from "../types";

interface HomeProps {
  session: SessionView;
  onStart: () => void;
}

export function Home({ session, onStart }: HomeProps) {
  const reviewCount = session.reviewQueue.length;
  const newCount = session.newWords.length;

  return (
    <div className="screen screen-home">
      <p className="eyebrow">Good morning</p>
      <h1>Today&rsquo;s lesson: {session.lessonTitle}</h1>
      <p className="lede">
        {newCount} new word{newCount === 1 ? "" : "s"}
        {reviewCount > 0
          ? `, plus ${reviewCount} due for review.`
          : " — no reviews due today."}
      </p>

      <div className="card queue-card">
        {session.newWords.map((item) => (
          <div className="queue-row queue-row--new" key={item.id}>
            <span className="queue-word">{item.word}</span>
            <span className="queue-tag">new</span>
          </div>
        ))}
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

      {session.upcomingLessons.length > 0 && (
        <div className="card calendar-card">
          <p className="card-heading">Coming up</p>
          {session.upcomingLessons.map((lesson) => (
            <div className="calendar-row" key={lesson.day}>
              <div className="calendar-heading">
                <span className="calendar-day">Day {lesson.day}</span>
                <span className="calendar-title">
                  {lesson.title}
                  <span className="calendar-icon" aria-hidden="true">
                    {lesson.icon}
                  </span>
                </span>
              </div>
              <p className="calendar-word">{lesson.featuredWord}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
