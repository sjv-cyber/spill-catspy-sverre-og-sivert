# Room runtime contract (CatSpy)

Single source of truth for parallel work on **room JSON**, **RoomLoader**, and **RoomScene**. Change this file deliberately and sync all consumers.

## Coordinates

- **`layers.walls`**: 2D array, **row-major**. Index `[row][col]` where `row = 0` is the **top** of the room, `col = 0` is the **left**.
- **Tile value `1`**: solid wall. **`0`**: empty.
- **`playerSpawn`**, **`exit`**: **tile coordinates** `{ x, y }` matching wall grid indices (integer). Origin is top-left of that tile.
- **`width`**, **`height`**: room size in **tiles** (must match `layers.walls` dimensions).
- **`tileSize`**: logical tile in source data (default **16**). Display scale comes from [`src/config.js`](../../src/config.js) `TILE_SCALE` (default **2**). **World pixel size per tile** = `tileSize * TILE_SCALE`.

## Required room JSON fields (v1)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | File basename convention: `room_cell_01` matches `room_cell_01.json`. |
| `name` | string | Human-readable; may be shown in debug UI. |
| `width` | number | Tiles. |
| `height` | number | Tiles. |
| `tileSize` | number | Usually 16. |
| `playerSpawn` | `{ x, y }` | Tile coords. |
| `exit` | object | At minimum `{ x, y, type }`. Optional `w`, `h` (tiles, default `1` × `2`) for trigger AABB. |
| `layers.walls` | number[][] | Height × width. |
| `entry_text` | string | One line, max ~15 words; shown once when the room starts. |
| `background` | string | Optional texture key preloaded in `BootScene` (e.g. `bg_cell`, `bg_corridor`). Stretched to full room; walls draw semi-transparent on top. |

## Optional fields (CATSPY_ROOM_FLOW_SPEC §14)

Include when present; runtime **must not** require them for v1 beta.

- `room_id` — if omitted, use `id`.
- `room_name` — if omitted, use `name`.
- `room_type`: `"normal"` | `"encounter"` | `"boss"` | `"hub"` | `"transition"`
- `zone`: string
- `exits`: string[] (logical exit names)
- `entry_points`: string[]
- `lock_state`: string
- `default_state`: `"idle"` | `"aware"` | `"alert"` | `"combat"` | `"cleared"` | `"locked"` | `"locked_boss"` (legacy alias for locked boss flow)
- `layout_tags`: string[]
- `entities` | `interactables` | `hazards`: objects/arrays (structure TBD)

## Room metadata (graybox / progression v2)

Normalized at runtime by [`src/systems/roomMetadata.js`](../../src/systems/roomMetadata.js) (`normalizeRoomData`). Designers may set:

| Field | Type | Notes |
|-------|------|--------|
| `supports_retreat` | boolean | If `true`, vision does **not** instant-fail: room goes to **`combat`**, guards speed up; break LOS ~72 frames to return **`idle`**; getting very close to a guard still fails. Forward/back exits work while not boss-locked. |
| `lock_behavior` | string | `"none"` or `"boss"`. Boss flow below. |
| `return_exit` | object \| omit | `{ x, y, w?, h?, target_room_id }` tile AABB. Overlap starts `Room` with `target_room_id` and `fromRoomId` = current room. Omit or omit `target_room_id` for no back exit. |
| `entry_spawns` | `Record<string, {x,y}>` | When `Room` starts with `init({ fromRoomId })` matching a key, player spawns at that tile instead of `playerSpawn`. |
| `extra_solid_tiles` | `{x,y}[]` | Extra wall collision (e.g. closed gate). Removed when an interactable runs `action: "open_gate"`. |
| `danger_zone` | `{ x, y, w?, h? }` | Graybox overlay only (readability). |
| `interaction_point` | `{ x, y, w?, h? }` | Graybox overlay for primary interactable / objective. |
| `cat_route_hint` | `{ x, y, w?, h? }` | Graybox overlay for cat-favoured lane. |
| `world_labels` | `{ x, y, text, size?, color?, alpha? }[]` | Screen-space story / CHIMERA labels in world coords (tile-based x,y). |
| `background_tint` | number | Multiply tint for background image (e.g. `0x706878`). |
| `background_trim_bottom_ratio` | number | `0`–`0.95`: fraction of the **source** background image height cropped from the **bottom** before the texture is stretched to the room. Use when the PNG has empty letterboxing below the painted floor so the art floor lines up with collision tiles. |
| `boss_trigger` | `{ x, y, w?, h? }` | With `lock_behavior: "boss"`, overlap sets **`exitLocked`**, `roomState` **`locked`**, `bossEngaged`. |
| `entity_summary` | string[] | Optional explicit list for tooling; else derived from `entities` / `interactables`. |
| `states` | string[] | Declared vocabulary for design tools (runtime uses `roomState` on the scene). |

### Boss room flow (`lock_behavior: "boss"`)

- Until the player overlaps **`boss_trigger`**, the forward exit behaves like a normal room.
- After trigger, forward exit is blocked until an **`interactables`** entry with `action: "clear_boss"` is used (**human**, **E**). Then `roomState` → **`cleared`** and the exit unlocks.
- **`supports_retreat`** should be **`false`**: detection causes immediate **GameOver** (local combat pressure).
- No **`return_exit`** (or leave it null): retreat is disabled while the encounter is active.

### Interactables (minimal)

Array of `{ id?, x, y, w?, h?, requires_human?, action, duration_ms? }`:

- `suppress_cameras` — `duration_ms` (default 5500): ARGUS cones ignored for that window.
- `open_gate` — removes **`extra_solid_tiles`** bodies from the static group.
- `clear_boss` — see boss flow above.

### `entities` extensions

- `scientists[]` — tile `{ x, y, flee_x?, flee_y?, triggerRadius?, speed? }`; graybox flee behavior.
- `mutants[]` — same shape as **`guards[]`** (patrol guards with tuned speed/cone).
- `robots[]` — tile `{ x, y }` for graybox closet bot prop.
- `hideZones[]` — tile AABB; **cat form** inside breaks line-of-sight checks for that frame.

## Progression (slice)

- Optional top-level **`next_room_id`**: string room id. When the player hits the **exit** zone and this field is set, start `Room` with that id instead of the beta-complete scene.
- If **`next_room_id`** is omitted or `null`, exit triggers the slice-complete / win flow.
- **`Room` scene** `init({ roomId, fromRoomId? })` — `fromRoomId` drives **`entry_spawns`** resolution.

## Manifest: `assets/rooms/manifest.json`

```json
{
  "default_room_id": "room_cell_01",
  "rooms": {
    "room_cell_01": { "path": "assets/rooms/room_cell_01.json" }
  }
}
```

- **Loader**: resolve `path` relative to site root (same directory as `index.html`).
- Unknown `roomId` → try `assets/rooms/${roomId}.json` as fallback.

## Module API — [`src/systems/RoomLoader.js`](../../src/systems/RoomLoader.js)

### `loadManifest()`

- **Returns:** `Promise<{ default_room_id: string, rooms: Record<string, { path: string }> }>`
- **Fetches:** `assets/rooms/manifest.json`

### `resolveRoomPath(roomId, manifest)`

- **Returns:** `string` URL path to JSON.

### `loadRoomData(path)`

- **Returns:** `Promise<object>` parsed room JSON.

### `buildRoom(scene, roomData)`

- **Parameters:** `scene` — active Phaser scene with `this.physics` (Arcade).
- **Returns:** `{ staticGroup, gateSolids, worldWidth, worldHeight, tileWorldSize, wallGrid, playerSpawnPixels: { x, y }, exitZone: { x, y, width, height }, roomData }`
  - `staticGroup`: `Phaser.Physics.Arcade.StaticGroup` with one immovable body per wall tile (hidden rectangles OK).
  - `gateSolids`: array of wall bodies created from **`extra_solid_tiles`** (removed when gate opens).
  - `exitZone`: **pixel** rect (top-left origin) for overlap with player — door trigger region covering `exit` tiles × `tileWorldSize`.
  - `playerSpawnPixels`: **center** of default spawn tile; **`RoomScene`** may override using **`entry_spawns`** + **`fromRoomId`**.

### Wall → world pixel (center of tile)

For tile `(col, row)`:

- `px = col * tileWorldSize + tileWorldSize / 2`
- `py = row * tileWorldSize + tileWorldSize / 2`

### Exit zone (top-left pixel)

For exit at tile `(ex, ey)` with width `ew`, height `eh` tiles:

- `x = ex * tileWorldSize`
- `y = ey * tileWorldSize`
- `width = ew * tileWorldSize`
- `height = eh * tileWorldSize`

## Scene integration — [`src/scenes/RoomScene.js`](../../src/scenes/RoomScene.js)

- `init(data)` receives `{ roomId?: string, fromRoomId?: string | null }`.
- Load manifest → resolve path → `loadRoomData` → `normalizeRoomData` → `buildRoom`.
- Destroy previous room bodies/groups on shutdown (Phaser `scene.shutdown` or explicit cleanup) if revisiting.
- On player overlap **forward** `exitZone` (if not locked) → start **`Room`** with `{ roomId: next_room_id, fromRoomId: current }` or **BetaComplete** when there is no next room.
- On overlap **`return_exit`** (when defined and exit not boss-locked) → start **`Room`** with `{ roomId: target_room_id, fromRoomId: current }`.
- Show `entry_text` once at top of screen (e.g. `y = 24`), auto-hide after ~4s or fade; must not repeat on same run unless scene restarted.

## Player — [`src/entities/Player.js`](../../src/entities/Player.js)

- Expects spawn at **pixel center** from loader.
- Uses [`InputManager`](../../src/systems/InputManager.js) for movement, jump, transform.
- Collides with room `staticGroup`.

## Parallel agents

For **flere Cursor-økter / worktrees** og spor A–D, se [docs/agents/MULTI_AGENT.md](../agents/MULTI_AGENT.md).
