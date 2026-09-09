import { useEffect, useState } from "react";
import "./App.css";
import { fetchSession } from "./api";
import { Done } from "./screens/Done";
import { Home } from "./screens/Home";
import { Speak } from "./screens/Speak";
import type { AttemptResult, SessionView, WordSummary } from "./types";

type Screen = "loading" | "home" | "speak" | "done" | "error";

interface CompletedAttempt {
  word: string;
  score: number;
}

// Render's free tier sleeps the API after inactivity; the first request
// that wakes it can take 30-60s. Anything still loading past this point is
// almost certainly a cold start, not a hang, so the message should say so
// rather than leaving a bare "Loading…" that looks broken.
const COLD_START_HINT_MS = 4000;

function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [session, setSession] = useState<SessionView | null>(null);
  const [queue, setQueue] = useState<WordSummary[]>([]);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<CompletedAttempt[]>([]);
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    if (screen !== "loading") return;
    const timer = setTimeout(() => setSlowLoad(true), COLD_START_HINT_MS);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    fetchSession()
      .then((data) => {
        setSession(data);
        setScreen("home");
      })
      .catch(() => setScreen("error"));
  }, []);

  function startSession() {
    if (!session) return;
    setQueue([...session.newWords, ...session.reviewQueue]);
    setIndex(0);
    setCompleted([]);
    setScreen("speak");
  }

  function handleAttemptResult(result: AttemptResult, currentWord: WordSummary) {
    setCompleted((prev) => [...prev, { word: currentWord.word, score: result.score }]);
    const nextIndex = index + 1;
    if (nextIndex < queue.length) {
      setIndex(nextIndex);
      setScreen("speak");
    } else {
      setScreen("done");
    }
  }

  async function backToHome() {
    setSlowLoad(false);
    setScreen("loading");
    try {
      const data = await fetchSession();
      setSession(data);
      setScreen("home");
    } catch {
      setScreen("error");
    }
  }

  if (screen === "loading") {
    return (
      <div className="screen">
        <p className="eyebrow">Loading…</p>
        {slowLoad && (
          <p className="lede">
            Waking up the server — this can take up to a minute on the first request after a while idle.
          </p>
        )}
      </div>
    );
  }

  if (screen === "error" || !session) {
    return (
      <div className="screen">
        <h1>Couldn&rsquo;t load today&rsquo;s session</h1>
        <p className="lede">Couldn&rsquo;t reach the API — check your connection and try refreshing.</p>
      </div>
    );
  }

  if (screen === "home") {
    return <Home session={session} onStart={startSession} />;
  }

  const currentItem = queue[index];

  if (screen === "speak" && currentItem) {
    return (
      <Speak
        item={currentItem}
        position={index + 1}
        total={queue.length}
        onResult={(result) => handleAttemptResult(result, currentItem)}
      />
    );
  }

  if (screen === "done") {
    return <Done attempts={completed} onHome={backToHome} />;
  }

  return null;
}

export default App;
