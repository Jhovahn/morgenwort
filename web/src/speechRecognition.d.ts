// Minimal ambient types for the Web Speech API — not in TS's default DOM
// lib. Only the surface this app actually uses.
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    [index: number]: SpeechRecognitionResultLike;
    length: number;
  };
}

// error is a fixed set of strings per spec: "no-speech", "aborted",
// "audio-capture", "network", "not-allowed", "service-not-allowed",
// "bad-grammar", "language-not-supported" -- typed as string here rather
// than that literal union since browsers occasionally add new values and
// this is meant to be minimal, not exhaustive.
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}
