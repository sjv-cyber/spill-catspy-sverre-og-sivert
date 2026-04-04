# Godot room runtime mapping

Maps [room-runtime.md](room-runtime.md) JSON fields to **Godot 4.2+** nodes used in `godot/`. Phaser remains a behavioral reference only.

## Scale and coordinates

- **Tile size (logic):** `tileSize` from JSON (default `16`).
- **World pixels per tile:** `tile_world_size = tileSize * 2` (matches prototype `TILE_SCALE` in [src/config.js](../../src/config.js)).
- **Grid:** `layers.walls[row][col]` — row `0` = top, col `0` = left. Solid = `1`, empty = `0`.
- **World origin:** Top-left of room at `(0, 0)`; Y increases downward.

## Core JSON → nodes

| JSON | Godot |
|------|--------|
| `layers.walls` + `width` / `height` | Multiple **StaticBody2D** children (one per solid tile) each with **CollisionShape2D** (`RectangleShape2D` size `tile_world_size`), centered on tile. Alternative: single **TileMap** — current implementation uses StaticBody2D for parity with Phaser rectangles. |
| `extra_solid_tiles[]` | Same as walls; tagged for gate removal (`open_gate` interactable). |
| `playerSpawn` `{x,y}` tile | Player global position: feet at `(x * tw + tw/2, y * tw + tw/2)` with `CharacterBody2D` origin feet-center. |
| `entry_spawns[from_room_id]` | When `Game.from_room_id` matches, use this tile instead of `playerSpawn`. |
| `exit` `{x,y,w?,h?}` | **Area2D** `ExitForward` with **CollisionShape2D** rectangle in tile space → pixel AABB. |
| `return_exit` | **Area2D** `ExitReturn` same pattern; calls `Game.go_to_room(target_room_id)`. |
| `background` | Texture key → `res://assets/backgrounds/<key>.png` if present; else **ColorRect** fallback. |
| `background_trim_bottom_ratio` | **Sprite2D** `region_enabled` crop from bottom of texture before `scale` to room size, or shader (implementation: region_rect on loaded `Texture2D`). |
| `background_tint` | `Sprite2D.modulate` from hex (optional). |
| `next_room_id` | Forward exit body_entered → `Game.go_to_room(next_room_id)`. |
| `entities.guards[]` | Spawn [guard.gd](../../godot/scripts/entities/guard.gd) scene per spec (`patrol` tile waypoints → world). |
| `entities.cameras[]` | **CameraWatcher** nodes providing `get_watcher_state()` for detection. |
| `entities.lasers[]` | **Area2D** or **StaticBody2D** toggling collision + visible beam (see `laser_hazard.gd`). |
| `entities.hideZones` | **Area2D** (monitoring) for cat hide detection logic. |
| `supports_retreat` | Room script flag: detection triggers **combat** + LOS cooldown instead of instant game over (Phase 2 parity). |
| `lock_behavior` + `boss_trigger` | Exit locked until `clear_boss` interactable (minimal port). |

## Manifest

- File: `res://data/rooms/manifest.json` (copy of repo `assets/rooms/manifest.json`).
- Loader resolves `rooms[room_id].path` by **filename only** → `res://data/rooms/<basename>`.

## Autoload `Game`

- `from_room_id`, `current_room_id`, `pending_room_id`
- `go_to_room(id)`, `start_game()`, `game_over()`, `return_to_title()`
- Scene changes: `packed` load `res://scenes/room/RoomRoot.tscn` or swap child under Main.

## Player hitbox (reference)

- Human / cat sizes and speeds: [godot/scripts/config.gd](../../godot/scripts/config.gd) (mirrors `HUMAN` / `CAT` in JS).
