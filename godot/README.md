# CatSpy — Godot 4.2+ rebuild

## Engine pin

Use **Godot 4.2 or newer** (4.x stable). Open this folder as the project root (`project.godot` lives here).

## First open

1. Open Godot → **Import** → select `godot/project.godot`.
2. Let the editor generate `.import` files for PNGs under `assets/`.
3. Run (**F5**) or play the main scene.

## Controls

| Action | Keys |
|--------|------|
| Move | A/D or arrows |
| Jump | Space / W / Up |
| Transform | T |
| Pause | Esc (in room) |
| Debug next room | F1 |

## Flow

**Title** → **SPACE / ENTER** → **RoomRoot** loads `Game.current_room_id` (default `room_cell_01` from manifest). Forward **exit** `Area2D` loads `next_room_id`. **Detection** (guards / cameras) → **Game Over** → title.

## Data

- Room JSON + `manifest.json`: `data/rooms/` (copies of repo root `assets/rooms/`). Re-sync after editing Phaser data:

```powershell
Copy-Item ..\assets\rooms\*.json -Destination .\data\rooms\ -Force
```

## Room contract

See [docs/contracts/godot-room-runtime.md](../docs/contracts/godot-room-runtime.md).

## Headless smoke (when Godot is on PATH)

```bash
godot --path godot --headless --quit-after 2
```

(Adjust flags for your Godot build; not all exports support meaningful headless gameplay checks.)
