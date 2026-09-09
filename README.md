# Morgenwort

A German daily-word learning app: each day surfaces one new word plus any
words due for spaced-repetition review, has you speak the example sentence
aloud, and scores your attempt against what the browser's speech recognizer
actually heard.

## What's here vs. what's cut

This was scoped down deliberately from a larger design (permission flow,
lock-screen notification simulation, quiz mode, "extra reviews," a
tomorrow's-word teaser) to the core loop that proves the concept end to end:
**word → speak → done → home**. The cut screens are straightforward
extensions of the same data model, not architectural gaps — see
`server/src/content.ts` for where quiz-style content would plug in.

**Pronunciation scoring is a mock, and deliberately so.** The design implies
phoneme-level feedback (e.g. "your ü in Küche is coming out as oo"). Real
pronunciation analysis is an ML problem outside a take-home's scope. Instead:
speech-to-text is real (the browser's native Web Speech API), and scoring is
a deterministic word-by-word diff between the target sentence and what was
actually transcribed (`server/src/scoring.ts`) — grounded in a real
transcript, not faked, but it can't hear a wrong vowel *inside* a correctly
transcribed word. Feedback tips are curated per vocabulary item rather than
generated. This mirrors a pattern already established in a sibling project
of mine (Clarity, a voice-transcription app): mock the capability you don't
have, but be explicit about the boundary rather than hiding it.

**State is in-memory, not persisted.** One demo session, reset on server
restart. A real product would key this by authenticated user and back it
with a database — no auth exists here to make that meaningful, and adding
one would be scope creep for a take-home. The spaced-repetition logic itself
(`server/src/srs.ts`) is written as pure, tested functions specifically so
swapping in persistence later is a storage change, not a logic rewrite.

## Architecture

Two independent npm projects (no root workspace) — matches the structure
I've used elsewhere for similar full-stack take-homes:

- **`server/`** — Express 5 + TypeScript (ESM). Owns vocabulary content,
  spaced-repetition scheduling, and attempt scoring. No external API calls,
  no API keys — speech-to-text runs client-side in the browser.
- **`web/`** — React 19 + Vite + TypeScript. Renders the four-screen flow
  and captures speech via the Web Speech API, falling back to a manual text
  input in browsers that don't support it (Safari/Firefox).

## Commands

Backend (`server/`):

```bash
npm install
npm run dev      # tsx watch, http://localhost:8787
npm test         # vitest run
npm run build    # tsc -> dist/
npm start        # node dist/index.js
```

Frontend (`web/`):

```bash
npm install
npm run dev       # vite, http://localhost:5173, proxies /api to :8787
npm run lint      # oxlint
npm run build     # tsc -b && vite build
```

Run both `npm run dev` commands concurrently, then open the Vite URL.
**Use Chrome** for real speech recognition — Safari and Firefox don't
implement the Web Speech API, and the app falls back to a text input there.

CI (`.github/workflows/ci.yml`) runs on push/PR to `main`: the server job
builds and runs the vitest suite; the web job lints and builds.

## Testing approach

Coverage is concentrated on the two pure logic modules where correctness
actually matters — `srs.ts` (scheduling: strength transitions, interval
widening, due-date comparison) and `scoring.ts` (word-match diffing:
case/punctuation handling, partial matches, empty input). The Express layer
and React components are thin enough that bugs there would be visually
obvious; the scheduling and scoring math is where a subtle off-by-one would
hide.
