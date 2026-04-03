# Project Status

**Last updated:** 2026-04-04

## For agents (read first)

1. **[AGENTS.md](../AGENTS.md)** (repo root) — tech stack, shared-state rules, coordination, engineering patterns.
2. **[CLAUDE.md](../CLAUDE.md)** — design constraints, architecture, directory map.
3. **[docs/contracts/room-runtime.md](contracts/room-runtime.md)** — room JSON contract (coordinate changes with integrator).

## Shared state (AGENTS.md)

| File | Rule |
|------|------|
| `docs/STATUS.md` | Overwrite with latest truth (this file) |
| `docs/JOURNAL.md` | Prepend only (newest first) |
| `docs/BACKLOG.md` | Append new items at the bottom |

ADRs: [docs/adr/](adr/). Multi-agent tracks: [docs/agents/MULTI_AGENT.md](agents/MULTI_AGENT.md).

## Tech stack

| Layer | Choice |
|-------|--------|
| Runtime | Browser (Canvas), Chrome / Firefox / Edge |
| Framework | Phaser **3.87** (CDN **jsdelivr**, see `index.html`) |
| Language | JavaScript **ES modules**, **no TypeScript**, no bundler |
| Build | None — static `index.html` + `npx serve .` (or any static server) |
| Sprites | PNG, magenta `#FF00FF` chroma-key + crop at boot |
| Audio | Web Audio procedural synthesis (`src/systems/CatSfx.js`) |
| Rooms | JSON in `assets/rooms/*.json`, registry `manifest.json` |
| Story | JSON in `assets/story/` |
| Optional authoring | **Tiled** → JSON export (not required) |

**No npm dependencies, no backend, no external services.**

## Engineering patterns (from AGENTS.md)

Target style: **no semicolons** (ASI-safe), **template literals**, **constants in `config.js`**, **flat imports** (max two directory levels under `src/`). Much of `src/` still uses semicolons from earlier edits — treat a full style pass as backlog, but **new files** should follow AGENTS.

Debug: set `arcade.debug: true` in `src/main.js` to visualize physics bodies.

## Playable slice

Boot → title → `RoomScene` loads rooms from manifest → detection / lasers / interactables / terminals / boss lock (per room data) → pause, game over, beta complete. Optional **Janus** route (`room_janus_closet`) and progress flags via `ProgressStore`.

### Implemented (high level)

- Player: human/cat, movement, jump, transform + SFX; human-only interact (cat hiss on locked terminals).
- World: `RoomLoader`, `normalizeRoomData`, walls, gates, `LaserHazard`, ARGUS cameras, guards, scientists, maintenance robots, alarm lights, hide zones.
- Flow: map overlay (`M`), `TerminalOverlay` + `assets/story/terminal_logs.json`, `ProgressStore`, slice vs Janus **BetaComplete** variants.
- Presentation: `CatSpyVfx`, chroma/crop pipeline, room backgrounds + optional trim.

### Room inventory (`manifest.json`)

Includes: `room_cell_01`, graybox chain (`room_holding_corridor` … `room_mini_boss_arena`), `room_janus_closet`, `room_corridor_01`, `room_tutorial`.

### Gaps / next focus

- Narrative: more terminal logs, room copy, ending (see `docs/STORY_THREAD.md`, `docs/BACKLOG.md`).
- Gameplay: vents / wall climb, scripted takedown, keycard phase-2 (backlog).
- Audio: ambient, footsteps, richer laser/alarm layers.
- Style: align JS with AGENTS (no semicolons) across `src/` when convenient.
