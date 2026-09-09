import type { WordSummary } from "../types";

interface WordProps {
  item: WordSummary;
  position: number;
  total: number;
  onReady: () => void;
}

export function Word({ item, position, total, onReady }: WordProps) {
  return (
    <div className="screen screen-word">
      <p className="eyebrow">
        {position} of {total}
      </p>
      <h1>{item.word}</h1>
      <p className="sentence-de">{item.sentenceDe}</p>
      <p className="sentence-en">{item.sentenceEn}</p>
      <button className="primary-button" onClick={onReady}>
        I&rsquo;m ready to say it
      </button>
    </div>
  );
}
