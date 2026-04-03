# CatSpy

A 2D stealth/platformer web game set in 2070 where the Cold War never ended. You play as **Agent Koschei**, a Soviet operative captured and mutated by the American **Project CHIMERA** DNA program. Koschei can shapeshift into a cat. Escape the US orbital space station **Eagle's Nest**, steal the CHIMERA data, and get out alive.

## Quick Start

```bash
# Any static file server works — no build step required
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` (or whatever port) in a modern browser. That's it.

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

This is a fully client-side game with **no external services**. All `fetch()` calls load local JSON files (room data, manifest). No database, no API keys, no backend.

| Component | Technology | Notes |
|-----------|-----------|-------|
| Runtime | Browser (HTML5 Canvas) | Chrome, Firefox, Edge |
| Framework | Phaser 3.87 | Loaded via CDN (`jsdelivr`) |
| Language | JavaScript (ES modules) | No build step |
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
