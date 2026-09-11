import { useEffect, useState } from "react";
import "./App.css";
import { fetchSession } from "./api";
import { bumpStreak, clearProgress, loadProgress, saveProgress, todayDateString, type StoredProgress } from "./progress";
import { useAutoFocus } from "./useAutoFocus";
import { Done } from "./screens/Done";
import { Home } from "./screens/Home";
import { Speak } from "./screens/Speak";
import type { AttemptResult, CompletedLesson, QueueItem, SessionView } from "./types";

type Screen = "loading" | "home" | "speak" | "done" | "error";

interface CompletedAttempt {
  word: string;
  score: number;
  dueAt: string;
}

// Render's free tier sleeps the API after inactivity; the first request
// that wakes it can take 30-60s. Anything still loading past this point is
// almost certainly a cold start, not a hang, so the message should say so
// rather than leaving a bare "Loading…" that looks broken.
const COLD_START_HINT_MS = 4000;

function LoadingScreen({ slowLoad }: { slowLoad: boolean }) {
  const ref = useAutoFocus<HTMLElement>();
  return (
    <main className="screen" ref={ref} tabIndex={-1}>
      <p className="eyebrow">Loading…</p>
      {slowLoad && (
        <p className="lede">
          Waking up the server — this can take up to a minute on the first request after a while idle.
        </p>
      )}
    </main>
  );
}

function ErrorScreen() {
  const ref = useAutoFocus<HTMLElement>();
  return (
    <main className="screen" ref={ref} tabIndex={-1}>
      <h1>Couldn&rsquo;t load today&rsquo;s session</h1>
      <p className="lede">Couldn&rsquo;t reach the API — check your connection and try refreshing.</p>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [session, setSession] = useState<SessionView | null>(null);
  const [saved, setSaved] = useState<StoredProgress | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<CompletedAttempt[]>([]);
  const [slowLoad, setSlowLoad] = useState(false);
  // Snapshot taken once, before the mount effect below ever writes to
  // localStorage -- loadInto() saves progress as soon as the first session
  // loads, so re-deriving "is this a first visit" from saved state after
  // that point would always read false, even on a brand-new visitor.
  const [isFirstVisit] = useState(() => loadProgress() === null);

  useEffect(() => {
    if (screen !== "loading") return;
    const timer = setTimeout(() => setSlowLoad(true), COLD_START_HINT_MS);
    return () => clearTimeout(timer);
  }, [screen]);

  // Shared by the initial mount, "back to overview," and "reset progress" --
  // all three are "fetch a session for whatever progress currently applies
  // and land on Home," differing only in what progress (if any) that is.
  async function loadInto(saved: StoredProgress | undefined) {
    setSlowLoad(false);
    setScreen("loading");
    try {
      const data = await fetchSession(saved);
      const next: StoredProgress = {
        currentDay: data.currentDay,
        progress: data.progress,
        streak: saved?.streak ?? 0,
        lastCompletionDate: saved?.lastCompletionDate ?? null,
      };
      saveProgress(next);
      setSaved(next);
      setSession(data);
      setScreen("home");
    } catch {
      setScreen("error");
    }
  }

  useEffect(() => {
    loadInto(loadProgress() ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function todaysQueue(): QueueItem[] {
    if (!session) return [];
    return [
      ...session.newWords.map((w) => ({ ...w, mode: "repeat" as const })),
      ...session.reviewQueue.map((w) => ({ ...w, mode: "translate" as const })),
    ];
  }

  function startSession() {
    setQueue(todaysQueue());
    setIndex(0);
    setCompleted([]);
    setScreen("speak");
  }

  // A repeated day's words go in front of today's normal queue rather than
  // replacing it -- "up next," not a separate detour -- so finishing the
  // combined queue still represents finishing today's lesson, and the
  // existing day-advancement logic in handleAttemptResult applies
  // unchanged with no special-casing for "this was a repeat."
  function repeatDay(lesson: CompletedLesson) {
    const repeatItems: QueueItem[] = lesson.words.map((w) => ({ ...w, mode: "translate" as const }));
    setQueue([...repeatItems, ...todaysQueue()]);
    setIndex(0);
    setCompleted([]);
    setScreen("speak");
  }

  function handleAttemptResult(result: AttemptResult, currentWord: QueueItem) {
    setCompleted((prev) => [...prev, { word: currentWord.word, score: result.score, dueAt: result.dueAt }]);

    const nextIndex = index + 1;
    const isLastItem = nextIndex >= queue.length;

    // A finished lesson unlocks the next day for the *next* visit -- saved
    // immediately (not deferred to leaving Done) so the day advances even
    // if the tab closes right after the last word.
    setSaved((prev) => {
      if (!prev) return prev;
      const streakUpdate = isLastItem ? bumpStreak(prev.streak, prev.lastCompletionDate) : null;
      const next: StoredProgress = {
        currentDay: isLastItem ? prev.currentDay + 1 : prev.currentDay,
        progress: { ...prev.progress, [currentWord.id]: { strength: result.strength, dueAt: result.dueAt } },
        streak: streakUpdate?.streak ?? prev.streak,
        lastCompletionDate: streakUpdate?.lastCompletionDate ?? prev.lastCompletionDate,
      };
      saveProgress(next);
      return next;
    });

    if (isLastItem) {
      setScreen("done");
    } else {
      setIndex(nextIndex);
      setScreen("speak");
    }
  }

  function backToHome() {
    loadInto(saved ?? undefined);
  }

  function resetProgress() {
    if (!window.confirm("Reset all progress? This can't be undone.")) return;
    clearProgress();
    setSaved(null);
    loadInto(undefined);
  }

  if (screen === "loading") {
    return <LoadingScreen slowLoad={slowLoad} />;
  }

  if (screen === "error" || !session) {
    return <ErrorScreen />;
  }

  if (screen === "home") {
    return (
      <Home
        session={session}
        streak={saved?.streak ?? 0}
        completedToday={saved?.lastCompletionDate === todayDateString()}
        isFirstVisit={isFirstVisit}
        onStart={startSession}
        onRepeat={repeatDay}
        onReset={resetProgress}
      />
    );
  }

  const currentItem = queue[index];

  if (screen === "speak" && currentItem) {
    return (
      <Speak
        item={currentItem}
        mode={currentItem.mode}
        position={index + 1}
        total={queue.length}
        onResult={(result) => handleAttemptResult(result, currentItem)}
        onBack={backToHome}
      />
    );
  }

  if (screen === "done") {
    return <Done attempts={completed} onHome={backToHome} />;
  }

  return null;
}

export default App;
