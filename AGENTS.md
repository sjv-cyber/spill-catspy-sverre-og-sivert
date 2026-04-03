# AGENTS.md — CatSpy AI Agent Guidelines

**Start here** for any coding agent session (before editing `src/` or `assets/`). Then read `CLAUDE.md` for full design constraints and `DESIGN.md` for mechanics depth.

## Tech Stack

**Canonical direction:** [ADR 002 — Godot 4 (2D), desktop first, web later](docs/adr/002-godot-desktop-primary-web-deferred.md). New long-term work should assume **Godot** unless the task is explicitly **prototype-only** in this repo.

### Target stack (production; Godot project — not yet in this repo)

| Layer | Choice | Notes |
|-------|--------|--------|
| Engine | **Godot 4.x** | 2D, text-first scenes/scripts for AI agents |
| Primary export | **Desktop** | Windows / Linux / macOS first |
| Web | **Deferred** | HTML5 export later; smoke-test occasionally |
| Backend (when needed) | **Railway** | Typed HTTP/WS services; optional for v1 single-player |
| Visuals | Engine VFX + packs + occasional GenAI plates | See ADR 002 |

### This repository (Phaser prototype until port)

| Layer | Choice | Version / Source |
|-------|--------|-----------------|
| Runtime | Browser (HTML5 Canvas) | Modern Chrome/Firefox/Edge |
| Framework | Phaser 3 | 3.87 via CDN (`jsdelivr`) |
| Language | JavaScript | ES modules, no TypeScript |
| Build | None | Static file serving, no bundler |
| Sprites | PNG + chroma-key | Magenta (#FF00FF) removed at boot |
| Audio | Web Audio API | Procedural synthesis (`CatSfx.js`) |
| Room data | JSON tilemaps | `assets/rooms/*.json` + `manifest.json` |
| Story / logs | JSON | `assets/story/*.json` |
| Tilemap editor | Tiled (optional) | Export to JSON |

**Prototype:** no npm game dependencies, no required backend. **Future Godot + Railway** layers are documented in ADR 002; do not add secret keys to this repo.

## Decisions

All architectural decisions are recorded in [docs/adr/](docs/adr/).

## Shared State

| File | Purpose | Write pattern |
|------|---------|---------------|
| `docs/STATUS.md` | Current project state | **Overwrite** with latest status |
| `docs/JOURNAL.md` | Development log | **Prepend** new entries (newest first) |
| `docs/BACKLOG.md` | Feature/task backlog | **Append** new items at the bottom |

## Coordination

### Multi-Agent File Safety

The project supports parallel agent work via track-based ownership (see `docs/agents/MULTI_AGENT.md`).

1. **Check JOURNAL.md before starting work** — see what other agents have done recently.
2. **Always prepend** (never overwrite) journal entries.
3. **Check existing ADR numbers** in `docs/adr/` before creating a new one — use the next sequential number.
4. **Respect track ownership** — each agent track owns specific files. Do not modify another track's files unless acting as integrator.
5. **Room JSON schema** is governed by `docs/contracts/room-runtime.md`. Changes require explicit coordination.

### Critical Design Constraints

See **CLAUDE.md** for the numbered list and narrative rationale. This block is the agent checklist; **room JSON** may opt into behaviors documented in **`docs/contracts/room-runtime.md`** (retreat, boss lock, lasers).

Summary:

1. **Detection:** Instant fail by default (no health, no global alert). **Exception:** `supports_retreat: true` → room-local combat / LOS calmdown per [room-runtime.md](docs/contracts/room-runtime.md). Boss and strict rooms stay hard-fail unless data says otherwise.
2. Two-form system is binary (human or cat, no hybrids)
3. Transformation cannot be weaponized
4. **Guards:** No hunt or multi-room pursuit. Patrol + cone only; retreat rooms may apply a short **speed pressure** cue — not chase AI.
5. Rooms are deterministic (no randomization)
6. No procedural generation
7. Cat form cannot interact with objectives
8. Guard takedown is a one-time scripted event
9. Doom-style sprite art only

## Engineering Patterns

### Code Conventions
- **No semicolons** (ASI-safe style)
- **camelCase** for variables/functions, **PascalCase** for classes/scenes
- **Functions over classes** where possible; classes only for Phaser GameObjects needing `update()`
- **Constants in `config.js`** — no magic numbers in entity/system files
- **Template literals** over string concatenation
- **Flat imports** — max 2 levels of directory depth under `src/`

### Error Handling
- Room loading failures show an error message on screen and allow returning to title
- Missing textures throw immediately at construction (fail fast in `BootScene`)
- Guard waypoint validation throws if fewer than 2 points

### Environment Variables
- **Phaser prototype:** none — zero-config static web game.
- **Future Railway services:** document vars in the service README or `.env.example` (never commit secrets).

### Testing
- No automated test framework in prototype.
- Manual testing: serve `index.html`, play through rooms, verify detection/laser/transform mechanics.
- Debug mode: set `arcade.debug: true` in `main.js` Phaser config to visualize physics bodies.

### Asset Pipeline
- Sprites: PNG with magenta (#FF00FF) background → chroma-keyed at boot via `chromaTexture.js` → cropped via `spriteCrop.js`
- Room data: JSON files in `assets/rooms/`, registered in `assets/rooms/manifest.json`
- Story content: JSON files in `assets/story/`
