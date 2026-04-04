## 1. OpenSpec & docs

- [x] 1.1 Proposal, design, delta spec for `catspy-godot-runtime`
- [x] 1.2 `openspec validate godot-rebuild-foundation`

## 2. Wave 0 — Bootstrap

- [x] 2.1 `godot/project.godot`, folder layout, `Game` autoload, `Main.tscn` entry
- [x] 2.2 `docs/contracts/godot-room-runtime.md`
- [x] 2.3 Copy `assets/rooms/*.json` + manifest → `godot/data/rooms/` (paths adjusted to `res://`)

## 3. Wave 1 — Core loop

- [x] 3.1 `config.gd`, `room_normalize.gd`, `room_loader.gd`, `room_builder.gd`, `RoomRoot.tscn`
- [x] 3.2 `player.gd` + `Player.tscn` (CharacterBody2D)
- [x] 3.3 `godot/assets/README.md` + import copies for `bg_cell`, player sprites
- [x] 3.4 `tools/gemini/` prompts + `docs/gemini-output/.gitkeep`

## 4. Wave 2 — Stealth & flow

- [x] 4.1 `math_catspy.gd`, `detection.gd`
- [x] 4.2 `guard.gd` + spawn from JSON
- [x] 4.3 `Title.tscn`, `GameOver.tscn`, `PauseOverlay` integration
- [x] 4.4 `laser_hazard.gd` minimal port

## 5. Verification

- [x] 5.1 Play: Title → `room_cell_01` → second room via exit → detection game over (manual in Godot editor)
- [x] 5.2 `godot/README.md` run instructions + F1 debug room cycle
- [x] 5.3 Prepend `docs/JOURNAL.md`
