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
- Detection is instant-fail: if a guard or ARGUS camera sees you, it's game over.

## Project Structure

```
index.html              Entry point
src/
  main.js               Phaser config, scene registration
  config.js             All game constants
  scenes/               Phaser scenes (Boot, Title, Room, GameOver, Pause)
  entities/             Player, Guard, SecurityCamera, LaserHazard, etc.
  systems/              InputManager, DetectionSystem, RoomLoader, VFX, SFX
  ui/                   TerminalOverlay
  utils/                StateMachine, math helpers, texture utilities
assets/
  sprites/              Character PNGs (player_human, player_cat, guard_pmc)
  rooms/                Room JSON tilemaps + manifest.json
  backgrounds/          Room background images
  story/                Terminal logs, narrative text (JSON)
  ui/                   Title screen, map image
docs/
  agents/               Multi-agent coordination prompts
  contracts/            Runtime contracts (room JSON schema)
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

- **Design document**: [DESIGN.md](DESIGN.md)
- **AI project memory**: [CLAUDE.md](CLAUDE.md)
- **Agent guidelines**: [AGENTS.md](AGENTS.md)
- **Multi-agent prompts**: [docs/agents/](docs/agents/)
- **Runtime contract**: [docs/contracts/room-runtime.md](docs/contracts/room-runtime.md)
- **Status**: [docs/STATUS.md](docs/STATUS.md)
- **Journal**: [docs/JOURNAL.md](docs/JOURNAL.md)
- **Backlog**: [docs/BACKLOG.md](docs/BACKLOG.md)
- **Decisions**: [docs/adr/](docs/adr/)
