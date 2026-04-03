# CatSpy — Project Intelligence File

**Agent workflow, stack table, and coordination rules:** [AGENTS.md](AGENTS.md) (root). Shared state: overwrite [docs/STATUS.md](docs/STATUS.md), prepend [docs/JOURNAL.md](docs/JOURNAL.md), append [docs/BACKLOG.md](docs/BACKLOG.md). ADRs: [docs/adr/](docs/adr/).

## Project Goal

Build a 2D stealth/platformer web game set in 2070 where the Cold War never ended. The player is **Agent Koschei**, a Soviet operative captured and mutated by the American **Project CHIMERA** DNA program. Koschei can shapeshift into a cat. The game takes place on **Eagle's Nest**, a US orbital space station. USA are the antagonists. The player must steal CHIMERA data and escape. The game runs natively in a modern browser using HTML5 Canvas. The prototype must demonstrate: movement, transformation between human/cat forms, guard detection (instant fail), laser hazards, room transitions, and at least 3 playable rooms.

## Tech Stack

Authoritative summary also lives in [AGENTS.md](AGENTS.md) (keep these in sync).

- **Runtime:** Browser (HTML5 Canvas), modern Chrome / Firefox / Edge
- **Framework:** Phaser 3.87 via CDN (`jsdelivr`) — no local npm Phaser install
- **Language:** JavaScript ES modules only — **no TypeScript**, no JSX
- **Build:** None. Static `index.html` + any static file server (`npx serve .` is dev-only convenience — **no npm dependencies** in the game itself). No bundler.
- **Sprites:** PNG + magenta (`#FF00FF`) chroma-key at boot
- **Audio:** Web Audio API — procedural synthesis in `src/systems/CatSfx.js` (no audio file pipeline in prototype)
- **Room data:** JSON under `assets/rooms/`, registry in `manifest.json`
- **Story data:** JSON under `assets/story/`
- **Tilemap editor:** Tiled (optional) → JSON export
- **Target:** 60 FPS, 960×540 logical resolution (`config.js`)

## Architecture Principles

- **Modular scenes:** One **generic** `RoomScene` loads any room by `roomId` from the manifest (not one Phaser scene class per room file). Flow scenes (`Title`, `GameOver`, `Pause`, `BetaComplete`) are separate.
- **ECS-lite pattern:** Entities (player, guards, cameras, lasers, etc.) are Phaser GameObjects with update methods. No heavy ECS library.
- **State machines:** Where needed, use the lightweight `StateMachine` helper or simple enums — not a third-party FSM.
- **Config-driven:** Patrols, lasers, interactables, and room layout come from room JSON — not hardcoded per room in JS.

## Directory Structure

```
/
├── index.html              # Entry point, loads Phaser (CDN) + main module
├── AGENTS.md               # Agent guidelines, stack table, coordination rules
├── CLAUDE.md               # This file — constraints + architecture
├── DESIGN.md               # Full game design document
├── README.md               # Quick start + structure overview
├── assets/
│   ├── sprites/            # Player, guard, props (PNG, chroma-keyed at boot)
│   ├── backgrounds/        # Room backdrops
│   ├── rooms/              # Room JSON + manifest.json
│   ├── story/              # Terminal logs and narrative JSON
│   └── ui/                 # Title screen, map, etc.
├── docs/
│   ├── STATUS.md           # Overwrite with current truth (per AGENTS.md)
│   ├── JOURNAL.md          # Prepend-only dev log
│   ├── BACKLOG.md          # Append-only tasks
│   ├── adr/                # Architecture Decision Records
│   ├── agents/             # Multi-agent prompts + MULTI_AGENT.md
│   └── contracts/          # e.g. room-runtime.md JSON contract
└── src/
    ├── main.js             # Phaser config, scene list
    ├── config.js           # All tunable constants
    ├── scenes/             # Boot, Title, Room, GameOver, Pause, BetaComplete
    ├── entities/           # Player, Guard, SecurityCamera, Scientist, lasers, robots, VFX hooks
    ├── systems/            # Input, detection, room load, CatSfx, CatSpyVfx, ProgressStore, roomMetadata, …
    ├── ui/                 # e.g. TerminalOverlay.js
    └── utils/              # math, chromaTexture, spriteCrop, StateMachine, …
```

## Coding Conventions

- **No comments for obvious code.** Only comment non-trivial algorithms (raycast, cone math).
- **Functions over classes** where possible. Classes only for Phaser GameObjects that need `update()`.
- **Constants in config.js.** No magic numbers in entity/system files.
- **camelCase** for variables/functions, **PascalCase** for classes/scenes.
- **No semicolons** (ASI-safe style). Use template literals over concatenation.
- **Flat imports.** Avoid deep nesting. Max 2 levels of directory depth under `src/`.

## Critical Design Constraints (AI Must Enforce)

1. **DETECTION — DEFAULT INSTANT FAIL; ROOM DATA MAY OPT INTO RETREAT.** The intended tension is: spotted = dead. The **current slice** also supports **`supports_retreat: true`** in room JSON (`docs/contracts/room-runtime.md`): vision escalates to room-local **combat** (faster patrol), break LOS to calm, or exit the room — still **no** map-wide stealth state, **no** health, **no** combat systems. **Boss** and non-retreat rooms keep strict instant-fail. Do not add global alert levels or reusable “shoot guards” mechanics here.

2. **TWO-FORM SYSTEM IS BINARY.** The player is either human or cat. Never add hybrid states, partial transformations, or power-ups that blend forms. Each form has fixed, distinct capabilities as defined in DESIGN.md.

3. **TRANSFORMATION CANNOT BE WEAPONIZED.** Shapeshifting is a traversal/stealth tool only. It never damages guards, disables lasers, or has any offensive effect.

4. **GUARDS DO NOT CHASE.** No hunt pathing, no multi-room pursuit. Patrol + cone + (in retreat rooms) short **pressure** via speed when the room is in combat — not a chase game.

5. **ROOMS ARE DETERMINISTIC.** Guard patrols, laser timings, and hazard placements are fixed per room load. No randomization. The player solves each room like a puzzle.

6. **NO PROCEDURAL GENERATION.** All rooms are hand-designed (or agent-designed) via tilemap JSON. Level design is intentional, not random.

7. **CAT FORM CANNOT INTERACT WITH OBJECTIVES.** Terminals, keycards, and doors require human form. This forces the player to manage when to transform.

8. **GUARD TAKEDOWN IS A ONE-TIME SCRIPTED EVENT.** In the Isolated Corridor room, the player ambushes one guard from cat form. This is a scripted story beat — NOT a repeatable combat mechanic. After acquiring gear, the game remains stealth-focused: default instant-fail, with **optional** retreat-room behavior only where room JSON allows (`supports_retreat`). Never implement general combat, attack buttons, or repeatable takedowns in arbitrary rooms.

9. **DOOM-STYLE SPRITE ART.** All characters (player, guards) must use 2D pixel-art sprites inspired by Doom (1993) — chunky, low-res, pre-rendered look with frame-by-frame animation. No vector graphics, no skeletal animation, no smooth interpolation. Sprites are loaded from PNG spritesheets in `assets/sprites/`. Environment tiles follow the same pixel-art aesthetic. See DESIGN.md Section 10 and `docs/visual-ref-*.png` for the full style guide and reference art.

## AI Session Instructions

When continuing work on this project in a new session:
- Read **AGENTS.md** first for tech stack, coordination (`docs/STATUS.md` overwrite, `docs/JOURNAL.md` prepend, `docs/BACKLOG.md` append, `docs/adr/` numbering), multi-agent tracks (`docs/agents/MULTI_AGENT.md`), and engineering patterns.
- Read **DESIGN.md** for full mechanics reference.
- Read **this file (CLAUDE.md)** for critical design constraints and architecture.
- **Prepend** new notes to `docs/JOURNAL.md` when you complete a meaningful chunk of work (see AGENTS.md Shared State).
- Check existing code in `src/` before writing new files.
- Maintain the modular scene/entity/system structure.
- Test changes by serving `index.html` locally (any static server).
- When creating rooms, follow [`docs/contracts/room-runtime.md`](docs/contracts/room-runtime.md) and existing room JSON patterns.
- Never violate the **nine** critical constraints above. If a feature request conflicts with them, flag it and ask for clarification rather than implementing.
