import { useCallback } from "react";

// Unlike SpeechRecognition, SpeechSynthesis is a standard Web API (part of
// TS's DOM lib already) -- no ambient type declarations needed here.
export function useSpeechSynthesis() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel(); // don't let utterances stack up on repeat taps
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { supported, speak };
}
