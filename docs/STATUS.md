# Project Status

**Last updated:** 2026-04-06

## For agents (read first)

1. **[AGENTS.md](../AGENTS.md)** (repo root) — **target stack (Godot) vs Phaser prototype**, shared-state rules, coordination.
2. **[ADR 002](adr/002-godot-desktop-primary-web-deferred.md)** — desktop-first Godot 4 2D; web deferred; Railway when backend needed.
3. **[docs/JOURNAL.md](JOURNAL.md)** — read **newest entries first** before parallel or overlapping work.
4. **[CLAUDE.md](../CLAUDE.md)** — design constraints, architecture, directory map.
5. **[docs/contracts/room-runtime.md](contracts/room-runtime.md)** — room JSON contract (design reference until Godot port).

## Shared state (AGENTS.md)

| File | Rule |
|------|------|
| `docs/STATUS.md` | Overwrite with latest truth (this file) |
| `docs/JOURNAL.md` | Prepend only (newest first) |
| `docs/BACKLOG.md` | Append new items at the bottom |

ADRs: [docs/adr/](adr/). Multi-agent tracks: [docs/agents/MULTI_AGENT.md](agents/MULTI_AGENT.md).

## Platform strategy

| Horizon | Stack | Notes |
|---------|--------|--------|
| **Target** | **Godot 4.x 2D**, desktop export first | Rich tooling + VFX; web HTML5 later. See ADR 002. |
| **This repo (now)** | Phaser 3.87 + static JS | Playable prototype; maintain for fixes / reference until Godot bootstrap. |
| **Backend** | **Railway** (when needed) | Optional API/saves; not required for prototype `fetch()`-only flow. |

## Tech stack (prototype in this repository)

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

**Prototype:** no npm game dependencies, no required backend.

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

- **Engine:** bootstrap **Godot 4** project (folder or sibling repo), document room/scene mapping from `docs/contracts/room-runtime.md`; plan web export smoke-tests after desktop slice is fun.
- Narrative: more terminal logs, room copy, ending (see `docs/STORY_THREAD.md`, `docs/BACKLOG.md`).
- Gameplay: vents / wall climb, scripted takedown, keycard phase-2 (backlog).
- Audio: ambient, footsteps, richer laser/alarm layers.
- Style: align JS with AGENTS (no semicolons) across `src/` when convenient (Phaser prototype only).
