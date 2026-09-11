# CLAUDE.md

## What this is

A video-GIF homage to Wario. A full-bleed silent looping video plays behind; a GIF is welded to the
cursor in front. Press and hold → the audio unmutes and the cursor GIF swaps from the instruction
GIF to that pairing's GIF. Release → mutes, and advances to the next pairing.

**Status: parked.** It used to run on Replit and is currently offline. See `RESTART.md` before
picking it up again.

## The mechanic — do not break this

The video never stops. It is `loop autoPlay` permanently, and the only thing your finger toggles is
`muted` (`src/Season1/ScratchCard.jsx:80-92`).

That means you don't *start* a sound when you press — you drop into a loop that was already running,
mid-flight, and get yanked back out on release. That asymmetry is the entire feel of the thing, and
it is four characters of state.

Any rework preserves this or it isn't the same project.

## Shape

- **Web app** — Vite 5 + React 18 SPA. No router, no state library, no data layer, no backend.
- One live component, holding one `useState`.

## File map

Three of the four components in `src/` are dead but look live. Read this before editing anything.

| Path | Status |
|---|---|
| `src/Season1/ScratchCard.jsx` | **the only live component** — everything happens here |
| `src/App.jsx` | renders it, nothing else |
| `src/main.jsx` | entry point |
| `src/ScratchCard.jsx` | dead — earlier draft, never worked (see `RESTART.md`) |
| `src/FrontPage.jsx` | dead — season switcher that was never wired up |
| `src/index.js` | dead — React 17 `ReactDOM.render`, a CRA leftover |
| `src/utils/*.js` | dead — only ever used by the dead components |

## Assets

`public/Season1/videos/video{1..6}.mp4` and `public/Season1/gifs/gif{1..6}.gif`.

A pairing is **implicit**: index N means video N + gif N, coupled by filename convention alone.
There is no manifest and no data model. The count `6` is hardcoded in three places.

Sound is **not** a separate axis — it's baked into each mp4's audio track. Changing that is the
central idea in `RESTART.md`.

~15MB total, committed to the repo. `video3.mp4` alone is 7.5MB.

## Commands

```
npm run dev      # vite dev server
npm run build    # production build to dist/
npm run lint     # eslint — note: ESLint 8, which is EOL
```

There is no test script. CI guards for this with `--if-present`; don't remove that guard without
adding tests.

## Conventions

- Assets are referenced by root-relative path (`/Season1/...`). One place still gets this wrong —
  see `RESTART.md`.
- `node_modules/` and `dist/` are ignored. They were previously committed (10,476 tracked files);
  don't reintroduce them.
