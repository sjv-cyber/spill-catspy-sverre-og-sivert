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

## Optional fields (CATSPY_ROOM_FLOW_SPEC §14)

Include when present; runtime **must not** require them for v1 beta.

- `room_id` — if omitted, use `id`.
- `room_name` — if omitted, use `name`.
- `room_type`: `"normal"` | `"encounter"` | `"boss"` | `"hub"` | `"transition"`
- `zone`: string
- `exits`: string[] (logical exit names)
- `entry_points`: string[]
- `lock_state`: string
- `default_state`: `"idle"` | `"alert"` | `"combat"` | `"cleared"` | `"locked_boss"`
- `layout_tags`: string[]
- `entities` | `interactables` | `hazards`: objects/arrays (structure TBD)

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
- **Returns:** `{ staticGroup, worldWidth, worldHeight, tileWorldSize, playerSpawnPixels: { x, y }, exitZone: { x, y, width, height }, roomData }`
  - `staticGroup`: `Phaser.Physics.Arcade.StaticGroup` with one immovable body per wall tile (hidden rectangles OK).
  - `exitZone`: **pixel** rect (top-left origin) for overlap with player — door trigger region covering `exit` tiles × `tileWorldSize`.
  - `playerSpawnPixels`: **center** of spawn tile in world space (where player body origin 0.5,0.5 should sit).

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

- `init(data)` receives `{ roomId?: string }`.
- Load manifest → resolve path → `loadRoomData` → `buildRoom`.
- Destroy previous room bodies/groups on shutdown (Phaser `scene.shutdown` or explicit cleanup) if revisiting.
- On player overlap `exitZone` → start **BetaComplete** scene (or equivalent) with `{ roomId }`.
- Show `entry_text` once at top of screen (e.g. `y = 24`), auto-hide after ~4s or fade; must not repeat on same run unless scene restarted.

## Player — [`src/entities/Player.js`](../../src/entities/Player.js)

- Expects spawn at **pixel center** from loader.
- Uses [`InputManager`](../../src/systems/InputManager.js) for movement, jump, transform.
- Collides with room `staticGroup`.

## Parallel agents

For **flere Cursor-økter / worktrees** og spor A–D, se [docs/agents/MULTI_AGENT.md](../agents/MULTI_AGENT.md).
