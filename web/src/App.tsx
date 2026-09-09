import { useEffect, useState } from "react";
import "./App.css";
import { fetchSession } from "./api";
import { Done } from "./screens/Done";
import { Home } from "./screens/Home";
import { Speak } from "./screens/Speak";
import { Word } from "./screens/Word";
import type { AttemptResult, SessionView, WordSummary } from "./types";

type Screen = "loading" | "home" | "word" | "speak" | "done" | "error";

interface CompletedAttempt {
  word: string;
  score: number;
}

function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [session, setSession] = useState<SessionView | null>(null);
  const [queue, setQueue] = useState<WordSummary[]>([]);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<CompletedAttempt[]>([]);

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
    setQueue([session.newWord, ...session.reviewQueue]);
    setIndex(0);
    setCompleted([]);
    setScreen("word");
  }

  function handleAttemptResult(result: AttemptResult, currentWord: WordSummary) {
    setCompleted((prev) => [...prev, { word: currentWord.word, score: result.score }]);
    const nextIndex = index + 1;
    if (nextIndex < queue.length) {
      setIndex(nextIndex);
      setScreen("word");
    } else {
      setScreen("done");
    }
  }

  async function backToHome() {
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
      </div>
    );
  }

  if (screen === "error" || !session) {
    return (
      <div className="screen">
        <h1>Couldn&rsquo;t load today&rsquo;s session</h1>
        <p className="lede">Make sure the API server is running on port 8787.</p>
      </div>
    );
  }

  if (screen === "home") {
    return <Home session={session} onStart={startSession} />;
  }

  const currentItem = queue[index];

  if (screen === "word" && currentItem) {
    return (
      <Word
        item={currentItem}
        position={index + 1}
        total={queue.length}
        onReady={() => setScreen("speak")}
      />
    );
  }

  if (screen === "speak" && currentItem) {
    return <Speak item={currentItem} onResult={(result) => handleAttemptResult(result, currentItem)} />;
  }

  if (screen === "done") {
    return <Done attempts={completed} onHome={backToHome} />;
  }

  return null;
}

export default App;
