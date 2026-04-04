## Architecture

- **Autoload `Game`:** Holds `current_room_id`, `from_room_id`, `pending_room_id`, `default_room_id`; methods `start_game()`, `go_to_room(id)`, `game_over()`, `return_to_title()`. Loads scenes via `change_scene_to_packed` / tree root swap.
- **Room scene `RoomRoot`:** Child `World` (Node2D) containing StaticBody2D wall segments, optional `Background` Sprite2D, `ExitForward` Area2D, optional `ReturnExit` Area2D, spawned guards/cameras/lasers from JSON.
- **Player:** `CharacterBody2D` + `CollisionShape2D` (rectangle), feet at origin bottom-center (`position` = feet). Sprite2D child; human/cat swap via texture + hitbox constants from `config.gd`.
- **Data:** JSON parsed with `JSON.parse_string`; normalize optional fields like Phaser’s `roomMetadata.js` (subset in `room_normalize.gd`).
- **Detection:** `detection.gd` — static functions mirroring [DetectionSystem.js](src/systems/DetectionSystem.js); `math_catspy.gd` for cone + raycast.
- **Input:** Project input map `move_left`, `move_right`, `jump`, `transform`, `interact`, `pause`, `debug_next_room` (F1).

## Room data location

Godot only serves `res://` inside the project. **Room JSON** lives in **`godot/data/rooms/`**, synced from repo root `assets/rooms/` (copy in git; README documents re-sync).

## Background / sprites

- `godot/assets/` holds imported PNGs (copy from `assets/backgrounds`, `assets/sprites` for keys used in JSON). Missing keys → **ColorRect** placeholder per room.

## Merge / parallel constraints

- Single owner for `project.godot` input map and `Main.tscn` wiring during bootstrap; subsystems in separate scripts/scenes to reduce conflicts.

## Out of scope (this change)

- Railway, HTML5 export polish, full interactables/terminal overlay parity.
