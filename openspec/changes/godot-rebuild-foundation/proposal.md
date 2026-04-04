## Why

CatSpy’s target stack is **Godot 4 (2D), desktop-first** ([ADR 002](docs/adr/002-godot-desktop-primary-web-deferred.md)). The Phaser prototype remains as reference; we need a **new Godot codebase** that loads existing **room JSON + manifest**, supports **multi-room navigation**, **player human/cat**, and **stealth detection parity**—without changing story or design intent.

## What Changes

- Add **`godot/`** Godot 4.x project (GDScript) with main loop, autoloads, and export notes.
- Add **`docs/contracts/godot-room-runtime.md`** mapping Phaser/JSON room fields to Godot nodes.
- Implement **room loader** reading manifest + room files (self-contained under `godot/data/rooms/` or documented sync from `assets/rooms/`).
- Implement **player** (CharacterBody2D), **guards**, **detection** (cone + raycast + hide zones), **title / game over / pause**, minimal **laser** hazard.
- Add **Gemini CLI** prompt packs and output staging under `docs/gemini-prompts/` and `docs/gemini-output/`.
- **BREAKING:** No change to Phaser URLs; new playable path is **Godot desktop**, not `index.html`.

## Capabilities

### New Capabilities

- `catspy-godot-runtime`: Godot 4 2D runtime loads room JSON, builds collision, spawns player, transitions rooms, runs guards/cameras detection per [room-runtime.md](docs/contracts/room-runtime.md) semantics.

### Modified Capabilities

- (none — `openspec/specs/` had no prior specs)

## Impact

- New directories: `godot/`, `tools/gemini/`, `docs/gemini-prompts/`, `docs/gemini-output/`.
- Duplicate or synced **room JSON** under `godot/data/rooms/` for `res://` access.
- README / STATUS / JOURNAL updated after merge.
