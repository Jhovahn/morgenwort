import { getGreeting } from "../greeting";
import type { CompletedLesson, SessionView } from "../types";
import { useAutoFocus } from "../useAutoFocus";

interface HomeProps {
  session: SessionView;
  streak: number;
  completedToday: boolean;
  isFirstVisit: boolean;
  onStart: () => void;
  onRepeat: (lesson: CompletedLesson) => void;
  onReset: () => void;
}

export function Home({ session, streak, completedToday, isFirstVisit, onStart, onRepeat, onReset }: HomeProps) {
  const reviewCount = session.reviewQueue.length;
  const newCount = session.newWords.length;
  const focusRef = useAutoFocus<HTMLElement>();

  return (
    <main className="screen screen-home" ref={focusRef} tabIndex={-1}>
      <details className="brand-accordion" open={isFirstVisit}>
        <summary>Morgenwort</summary>
        <p>
          Morgenwort teaches you German through short daily lessons — hear or read a sentence, say it out loud,
          and get instant feedback on your pronunciation.
        </p>
        <p>
          New words arrive each day, and words you&rsquo;ve learned come back later for review, translated from
          English instead of read aloud. Finish a lesson to keep your streak going.
        </p>
      </details>

      <p className="eyebrow">{getGreeting()}</p>
      <h1>{completedToday ? "Tomorrow" : "Today"}&rsquo;s lesson: {session.lessonTitle}</h1>
      <p className="lede">
        {newCount} new word{newCount === 1 ? "" : "s"}
        {reviewCount > 0
          ? `, plus ${reviewCount} due for review.`
          : " — no reviews due today."}
      </p>
      <p
        className={
          streak === 0 ? "streak streak--empty" : completedToday ? "streak" : "streak streak--at-risk"
        }
      >
        {streak > 0 ? (
          <>
            {streak}-day streak{" "}
            <span aria-hidden="true" className={completedToday ? "" : "streak-flame--unlit"}>
              🔥
            </span>
            {!completedToday && " — do today's lesson to keep it going"}
          </>
        ) : (
          "No streak yet — finish today's lesson to start one"
        )}
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
            <span
              className="queue-strength"
              title={`strength ${item.strength}/5`}
              aria-label={`strength ${item.strength} of 5`}
            >
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
        {completedToday ? "Jump-start tomorrow’s lesson" : "Start today’s session"}
      </button>

      {session.completedLessons.length > 0 && (
        <div className="card completed-card">
          <p className="card-heading">Completed</p>
          {session.completedLessons.map((lesson) => (
            <div className="completed-row" key={lesson.day}>
              <div className="calendar-heading">
                <span className="calendar-day">Day {lesson.day}</span>
                <span className="calendar-title">
                  {lesson.title}
                  <span className="calendar-icon" aria-hidden="true">
                    {lesson.icon}
                  </span>
                </span>
              </div>
              <button
                className="repeat-button"
                onClick={() => onRepeat(lesson)}
                aria-label={`Repeat day ${lesson.day}: ${lesson.title}`}
              >
                <span aria-hidden="true">↻</span> Repeat
              </button>
            </div>
          ))}
        </div>
      )}

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

      <button className="text-link-button text-link-button--muted" onClick={onReset}>
        Reset progress
      </button>
    </main>
  );
}
