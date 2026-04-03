# CatSpy

A 2D stealth/platformer set in 2070 where the Cold War never ended.

> **Platform strategy (2026-04):** Target **Godot 4 (2D)** with **desktop** as the primary export; **web (HTML5) later**. This repo still contains the **Phaser 3 browser prototype** — playable via static serve — until a Godot project is added and content is ported. See [ADR 002](docs/adr/002-godot-desktop-primary-web-deferred.md). You play as **Agent Koschei**, a Soviet operative captured and mutated by the American **Project CHIMERA** DNA program. Koschei can shapeshift into a cat. Escape the US orbital space station **Eagle's Nest**, steal the CHIMERA data, and get out alive.

## Quick Start (Phaser prototype in this repo)

```bash
# Any static file server works — no build step required
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` (or whatever port) in a modern browser.

**Godot builds** will live in a separate folder or repo when bootstrapped; follow `docs/STATUS.md` and ADR 002.

## Controls

| Action | Key |
|--------|-----|
| Move | A/D or Arrow keys |
| Jump | Space / W / Up |
| Transform (human/cat) | T |
| Interact (human only) | E |
| Pause | Escape |
| Restart room | R |
| Map | M |

## How It Works

- **Phaser 3** renders the game on HTML5 Canvas (loaded via CDN, no npm install).
- Rooms are defined as JSON tilemaps in `assets/rooms/`.
- Sprites are Doom-style pixel art PNGs with chroma-key removal at load time.
- All game logic is vanilla JavaScript ES modules — no build step, no TypeScript, no bundler.
- **Detection:** default is instant-fail when spotted; some rooms use **`supports_retreat`** (room-local pressure, break line-of-sight to reset). See [`docs/contracts/room-runtime.md`](docs/contracts/room-runtime.md) and root [`AGENTS.md`](AGENTS.md).

## Project Structure

See [AGENTS.md](AGENTS.md) for the authoritative tech stack. Layout in brief:

```
index.html              Entry point (Phaser 3.87 from CDN, ES modules)
AGENTS.md               AI agent guidelines + coordination rules
CLAUDE.md               Design constraints + architecture notes
src/
  main.js               Phaser config, scene registration
  config.js             All game constants
  scenes/               Boot, Title, Room, GameOver, Pause, BetaComplete
  entities/             Player, Guard, SecurityCamera, Scientist, lasers, robots, …
  systems/              Input, detection, RoomLoader, roomMetadata, CatSfx, CatSpyVfx, ProgressStore, …
  ui/                   TerminalOverlay
  utils/                StateMachine, math, chromaTexture, spriteCrop, …
assets/
  sprites/              PNG sprites (magenta chroma-key at boot)
  rooms/                Room JSON + manifest.json
  backgrounds/          Room backdrops
  story/                Narrative JSON (e.g. terminal logs)
  ui/                   Title, map, HUD art
docs/
  STATUS.md             Current project state (agents overwrite)
  JOURNAL.md            Dev log (prepend only)
  BACKLOG.md            Tasks (append only)
  agents/               Multi-agent prompts + MULTI_AGENT.md
  contracts/            Room runtime contract (room-runtime.md)
  adr/                  Architecture Decision Records
```

## Services & Infrastructure

**Prototype (this folder):** fully client-side — `fetch()` loads local JSON only; no required backend.

**Planned (ADR 002):** **Godot desktop** builds; optional **Railway** API when saves/auth/online features land.

| Component | Technology | Notes |
|-----------|-----------|-------|
| Target engine | **Godot 4.x (2D)** | Desktop-first; web export later |
| Prototype runtime | Browser (HTML5 Canvas) | Chrome, Firefox, Edge |
| Prototype framework | Phaser 3.87 | CDN (`jsdelivr`) |
| Language (prototype) | JavaScript (ES modules) | No build step |
| Sprites | PNG with magenta chroma-key | Processed at boot via Canvas API |
| Audio | Web Audio API (procedural) | No audio files — synthesized at runtime |
| Room data | JSON tilemaps | Hand-designed, loaded via `fetch()` |

## Project Coordination

- **Agent guidelines (start here for AI coding)**: [AGENTS.md](AGENTS.md)
- **Design document**: [DESIGN.md](DESIGN.md)
- **AI project memory / constraints**: [CLAUDE.md](CLAUDE.md)
- **Multi-agent prompts**: [docs/agents/](docs/agents/)
- **Runtime contract**: [docs/contracts/room-runtime.md](docs/contracts/room-runtime.md)
- **Status**: [docs/STATUS.md](docs/STATUS.md)
- **Journal**: [docs/JOURNAL.md](docs/JOURNAL.md)
- **Backlog**: [docs/BACKLOG.md](docs/BACKLOG.md)
- **Decisions (ADRs)**: [docs/adr/](docs/adr/)
