# Restarting Press and Hold

Parked September 2026. `CLAUDE.md` has the facts about how the thing works; this file has the plan,
the known breakage, and the decisions already taken.

## Known bugs

All live, all found by reading the source, none fixed.

**`src/Season1/ScratchCard.jsx:26` — preload is off by one.**
`(currentIndex + 2) % 6` resolves to `video0.mp4` when `currentIndex` is 4. That file doesn't exist,
so one preload in six 404s silently. Should be `((currentIndex + 1) % 6) + 1`.

**`src/Season1/ScratchCard.jsx:5` — `instructionGif = "instruction.gif"` is relative.**
Not `/`-rooted like every other asset path. Works at `/`, breaks on any nested route.

**`src/Season1/ScratchCard.jsx:11` — `window.innerWidth` in a `useState` initializer.**
Harmless in a client-rendered SPA. A hard crash the moment anything server-renders, so it matters if
the rework moves framework.

**`src/utils/fileUtils.js:4` — builds the wrong filename.**
`${path}/video${i}.${extension}` means GIFs resolve to `gifs/video1.gif`, which has never matched
`gif1.gif` on disk. **This is why `src/ScratchCard.jsx` never worked.** Recorded so nobody tries to
revive that component thinking it's a working alternative.

**Hardcoded `6`** in three separate places in the live component.

**`.github/workflows/npm-publish-github-packages.yml` is broken by design.** It runs `npm publish`
on a package marked `"private": true`, so it can only ever fail. It only fires on release, so it has
never been noticed. Delete it unless there's a plan to publish.

## The rework

### The core idea: three axes, not one index

Today a pairing is an index. Video N and GIF N are welded together by filename, and sound isn't a
thing at all — it's a passenger on the video's audio track.

Split it into **sound / background / foreground**, independently shuffleable. That turns addition
into multiplication: 6 + 6 + 6 assets stops being 6 pairings and becomes 216. That combinatorial
space is the whole point of the project, and it's the reason an authoring tool is worth building
rather than just a folder of files.

Shape:

```
sounds       id, url, loopMs, gainDb, tags[]
backgrounds  id, url, kind: 'video'|'image', tags[]
foregrounds  id, url, kind: 'webm-alpha'|'gif', tags[]
pairings     id, soundId, backgroundId, foregroundId, status, rating
```

**The risk:** audio leaving the video means the always-playing/toggle-`muted` trick now spans two
elements that must stay in sync. This is the one change that can regress the feel. Test it on a real
phone before building anything on top of it. If there's a perceptible gap between video and audio on
press, the split has failed and needs rethinking, not papering over.

### Foreground transparency

GIF is 1-bit alpha, so every foreground currently has hard jagged edges. Move to **WebM/VP9 with
alpha**, plus an **HEVC-with-alpha** sibling for Safari, with `kind` on the row saying which.

Biggest available visual upgrade, and it's invisible in a screenshot — it only shows when the thing
is moving over a busy background.

### Everything else

- Media moves to blob storage. 15MB now, unbounded once generation starts, and it shouldn't be in
  git.
- Unify `mousedown`/`touchstart` onto Pointer Events — one code path, and pen/hybrid input works.
- Derive the pairing count from data instead of the hardcoded `6`.
- Delete the four dead files listed in `CLAUDE.md`.

### Generation

The ambition: describe a pairing and have the pieces generated — a sound loop, a background, and a
matted foreground with real alpha — then review and keep or reject.

**Generation cannot sit in a serverless request.** Video generation takes minutes; functions time
out well before that. It has to be an offline pipeline that writes finished assets to storage and
marks new pairings as drafts. The live site only ever reads finished work.

### Reviewing

The review UI should **be** the toy. These can't be judged by looking, only by holding.

Three columns; press and hold anywhere to audition the current triple exactly as the live site plays
it; while holding, reroll any one column independently. **Lock two, reroll one** — that's how you
actually find the good ones, and it falls straight out of the three-axis model. Starring promotes a
draft to live.

## Decisions already taken

- Host on **Vercel**.
- Rebuild on the revised `~/Code/_boilerplate` stack — that revision is a separate workstream and
  was still in progress when this was parked. Don't start the migration until it lands.
- **Seed the three-axis model by demuxing Season 1.** The six existing videos have baked-in audio;
  splitting them gives six sounds and six silent backgrounds for free, which is 36 combinations
  before generating anything. It's also the cheapest possible test of whether three axes actually
  feel better than the welded version — do this before building a generation pipeline.

## Open

**Whether generation runs through Hugging Face.** Findings from the session that parked this, so the
research isn't repeated:

- The Hugging Face connector is **not installed** on this account.
- Its MCP tools are **discovery, not inference** — `model_search`, `model_details`, `space_search`,
  `hf_doc_search`. Useful for picking a model; it is not how an app calls one. Actual generation
  would go over HTTP to HF Inference Providers with an `HF_TOKEN`.
- `huggingface.co` is **egress-blocked from Claude Code cloud containers**. Any pipeline touching it
  has to run locally.

## Already done

On `claude/jolly-gauss-35l2ts`, ahead of `main`:

- Patched 12 dependency advisories, notably `@xmldom/xmldom` 0.8.10 → 0.8.15 (a `pixi.js`
  transitive dep with 15 open advisories). Three dev-only advisories remain — `esbuild` → `vite` →
  `@vitejs/plugin-react` — which need a Vite major bump to clear. They affect the dev server only,
  never the production build. Left alone deliberately, since the rework replaces the toolchain.
- Untracked `node_modules` (10,476 files), `dist/` and `.DS_Store`; added `.gitignore`.
- Fixed Node.js CI, which had been red on every push — it ran `npm test` against a package with no
  test script.

`pixi.js` and `howler` are both in `dependencies` and neither is imported anywhere in `src/`. Check
before carrying them across.
