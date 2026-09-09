import { useCallback, useRef, useState } from "react";

export type RecognitionState = "idle" | "listening" | "done" | "error";

export function useSpeechRecognition() {
  const [state, setState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognitionCtor);

  const start = useCallback(() => {
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let combined = "";
      let hasFinal = false;
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        combined += result[0]?.transcript ?? "";
        if (result.isFinal) hasFinal = true;
      }
      setTranscript(combined.trim());
      if (hasFinal) setState("done");
    };
    recognition.onerror = () => setState("error");
    recognition.onend = () => setState((current) => (current === "listening" ? "done" : current));

    recognitionRef.current = recognition;
    setTranscript("");
    setState("listening");
    recognition.start();
  }, [SpeechRecognitionCtor]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setState("idle");
  }, []);

  return { supported, state, transcript, start, stop, reset, setTranscript };
}
