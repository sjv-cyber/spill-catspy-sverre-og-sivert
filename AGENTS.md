# AGENTS.md — CatSpy AI Agent Guidelines

## Tech Stack

| Layer | Choice | Version / Source |
|-------|--------|-----------------|
| Runtime | Browser (HTML5 Canvas) | Modern Chrome/Firefox/Edge |
| Framework | Phaser 3 | 3.87 via CDN (`jsdelivr`) |
| Language | JavaScript | ES modules, no TypeScript |
| Build | None | Static file serving, no bundler |
| Sprites | PNG + chroma-key | Magenta (#FF00FF) removed at boot |
| Audio | Web Audio API | Procedural synthesis (`CatSfx.js`) |
| Room data | JSON tilemaps | `assets/rooms/*.json` |
| Tilemap editor | Tiled (optional) | Export to JSON |

**No external services.** No database, no API keys, no backend, no npm dependencies.

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

These are inviolable. See CLAUDE.md for the full list. Summary:

1. One-hit detection = instant fail (no health, no chase)
2. Two-form system is binary (human or cat, no hybrids)
3. Transformation cannot be weaponized
4. Guards do not chase
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
- None. This is a zero-config static web game.

### Testing
- No automated test framework in prototype.
- Manual testing: serve `index.html`, play through rooms, verify detection/laser/transform mechanics.
- Debug mode: set `arcade.debug: true` in `main.js` Phaser config to visualize physics bodies.

### Asset Pipeline
- Sprites: PNG with magenta (#FF00FF) background → chroma-keyed at boot via `chromaTexture.js` → cropped via `spriteCrop.js`
- Room data: JSON files in `assets/rooms/`, registered in `assets/rooms/manifest.json`
- Story content: JSON files in `assets/story/`
