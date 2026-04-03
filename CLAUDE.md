# CatSpy — Project Intelligence File

## Project Goal

Build a 2D stealth/platformer web game set in 2070 where the Cold War never ended. The player is **Agent Koschei**, a Soviet operative captured and mutated by the American **Project CHIMERA** DNA program. Koschei can shapeshift into a cat. The game takes place on **Eagle's Nest**, a US orbital space station. USA are the antagonists. The player must steal CHIMERA data and escape. The game runs natively in a modern browser using HTML5 Canvas. The prototype must demonstrate: movement, transformation between human/cat forms, guard detection (instant fail), laser hazards, room transitions, and at least 3 playable rooms.

## Tech Stack

- **Runtime:** Browser (HTML5 Canvas)
- **Framework:** Phaser 3 (via CDN or bundled)
- **Language:** JavaScript (ES modules). TypeScript optional if agents prefer it.
- **Build:** No build step required for prototype. Use ES module `<script type="module">` imports. Add bundler (Vite) only if needed later.
- **Tilemap format:** Tiled JSON export (`.json`).
- **Target:** 60 FPS, 960×540 logical resolution.

## Architecture Principles

- **Modular scenes:** Each room = one Phaser Scene. Room data loaded from JSON config.
- **ECS-lite pattern:** Game objects (player, guards, lasers) are Phaser GameObjects with component-like behavior methods. No heavy ECS library needed.
- **State machines:** Player state (idle, running, jumping, climbing, transforming) and Guard state (patrol, detected) managed via simple finite state machines (switch/enum, not a library).
- **Config-driven hazards:** Laser timing, guard waypoints, pit positions all defined in room JSON data—not hardcoded.

## Directory Structure

```
/
├── index.html              # Entry point, loads Phaser + main module
├── CLAUDE.md               # This file
├── DESIGN.md               # Full game design document
├── assets/
│   ├── sprites/            # Doom-style pixel art sprite sheets (PNG)
│   │   ├── spy_human_prisoner.png  # Phase 1: prisoner jumpsuit
│   │   ├── spy_human_armed.png     # Phase 2: stolen PMC gear
│   │   ├── spy_cat.png             # Cat form (both phases)
│   │   └── guard.png               # PMC guard spritesheet
│   └── rooms/              # Room tilemap JSON files
│       ├── room_tutorial.json
│       ├── room_guard.json
│       └── room_laser.json
├── src/
│   ├── main.js             # Phaser game config, scene registration, boot
│   ├── config.js           # Game constants (physics, sizes, timings)
│   ├── scenes/
│   │   ├── BootScene.js    # Preload, setup
│   │   ├── TitleScene.js   # Title screen
│   │   ├── RoomScene.js    # Generic room scene (loads any room JSON)
│   │   ├── GameOverScene.js# Detection overlay / restart
│   │   └── PauseScene.js   # Pause overlay
│   ├── entities/
│   │   ├── Player.js       # Player class (both forms, transformation logic)
│   │   ├── Guard.js        # Guard patrol + vision cone detection
│   │   └── Laser.js        # Laser hazard (timed toggle, sweep)
│   ├── systems/
│   │   ├── InputManager.js # Keyboard + gamepad abstraction
│   │   ├── DetectionSystem.js # Guard LOS raycasting, detection check
│   │   └── RoomLoader.js   # Parse room JSON, spawn entities, setup tilemap
│   └── utils/
│       ├── StateMachine.js # Lightweight FSM utility
│       └── math.js         # Geometry helpers (cone check, raycast)
└── README.md               # How to run (serve index.html)
```

## Coding Conventions

- **No comments for obvious code.** Only comment non-trivial algorithms (raycast, cone math).
- **Functions over classes** where possible. Classes only for Phaser GameObjects that need `update()`.
- **Constants in config.js.** No magic numbers in entity/system files.
- **camelCase** for variables/functions, **PascalCase** for classes/scenes.
- **No semicolons** (ASI-safe style). Use template literals over concatenation.
- **Flat imports.** Avoid deep nesting. Max 2 levels of directory depth under `src/`.

## Critical Design Constraints (AI Must Enforce)

1. **ONE-HIT DETECTION = INSTANT FAIL.** If a guard's vision cone + LOS check reaches the player, it is ALWAYS game over. No health, no alert phases, no second chances. This is the core tension of the game. Never implement a grace period, health bar, or chase sequence.

2. **TWO-FORM SYSTEM IS BINARY.** The player is either human or cat. Never add hybrid states, partial transformations, or power-ups that blend forms. Each form has fixed, distinct capabilities as defined in DESIGN.md.

3. **TRANSFORMATION CANNOT BE WEAPONIZED.** Shapeshifting is a traversal/stealth tool only. It never damages guards, disables lasers, or has any offensive effect.

4. **GUARDS DO NOT CHASE.** Detection is instant-fail. There is no pursuit AI, no alert countdown, no "escape" mechanic. Simplicity here is a feature.

5. **ROOMS ARE DETERMINISTIC.** Guard patrols, laser timings, and hazard placements are fixed per room load. No randomization. The player solves each room like a puzzle.

6. **NO PROCEDURAL GENERATION.** All rooms are hand-designed (or agent-designed) via tilemap JSON. Level design is intentional, not random.

7. **CAT FORM CANNOT INTERACT WITH OBJECTIVES.** Terminals, keycards, and doors require human form. This forces the player to manage when to transform.

8. **GUARD TAKEDOWN IS A ONE-TIME SCRIPTED EVENT.** In the Isolated Corridor room, the player ambushes one guard from cat form. This is a scripted story beat — NOT a repeatable combat mechanic. After acquiring gear, the game remains pure stealth with instant-fail detection. Never implement general combat, attack buttons, or the ability to take down guards in other rooms.

9. **DOOM-STYLE SPRITE ART.** All characters (player, guards) must use 2D pixel-art sprites inspired by Doom (1993) — chunky, low-res, pre-rendered look with frame-by-frame animation. No vector graphics, no skeletal animation, no smooth interpolation. Sprites are loaded from PNG spritesheets in `assets/sprites/`. Environment tiles follow the same pixel-art aesthetic. See DESIGN.md Section 9 for full style guide.

## AI Session Instructions

When continuing work on this project in a new session:
- Read DESIGN.md first for full mechanics reference.
- Read this file (CLAUDE.md) for constraints and architecture.
- Check existing code in `src/` before writing new files.
- Maintain the modular scene/entity/system structure.
- Test changes by serving `index.html` locally (any static server).
- When creating rooms, follow the JSON schema established by the first room files.
- Never violate the 7 critical constraints above. If a feature request conflicts with them, flag it and ask for clarification rather than implementing.
