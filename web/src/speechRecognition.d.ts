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

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}
