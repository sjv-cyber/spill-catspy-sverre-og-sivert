# Handoff — autonomous art/gameplay pass (integrator / next agent)

This note is for **parallel Cursor sessions** following [MULTI_AGENT.md](MULTI_AGENT.md). It summarizes a self-contained integration batch so other tracks can avoid conflicting assumptions.

## What landed (code)

- **`src/entities/MaintenanceRobot.js`** — Graybox hackable bot (green sensor, optional patrol). Wired from `entities.robots[]`.
- **`src/entities/AlarmLight.js`** — Pulsing red strobes from optional room field **`alarm_lights`**.
- **`src/systems/CatSpyVfx.js`** — Transform flash, terminal pulse, gate unlock sparks, robot hack lines.
- **`src/entities/Guard.js`** — Optional JSON **`variant`**: `"mutant"` | `"elite"` (tint, scale, cone tuning) on the same `guard_pmc` sprite.
- **`src/entities/Scientist.js`** — Replaced flat rectangle with a **container silhouette** (coat, head, clipboard).
- **`src/entities/Player.js`** — Emits **`catspy-player-transform`** on successful transform (for VFX).
- **`src/scenes/RoomScene.js`** — Spawns robots & alarm lights; handles **`hack_robot`** interactable; **`suppress_cameras`** / **`open_gate`** trigger VFX; ARGUS cameras **pulse red tint** while the player is inside their cone (throttled); cleanup on shutdown.
- **`src/systems/DetectionSystem.js`** — New **`argusCameraSeesPlayer()`** (same rules as full detection, for per-camera VFX).
- **`src/entities/SecurityCamera.js`** — **`pulseLensIfHot()`** for that tint flash.
- **`src/systems/roomMetadata.js`** — Normalizes **`alarm_lights`** (default `[]`).

## What landed (data)

- **`room_utility_bay`**: robot has **`id`**, short **`patrol`**; closet interactable is **`hack_robot`** + **`open_gate: true`**.
- **`room_specimen_containment`**: mutant entry includes **`variant": "mutant"`**.
- **`room_mini_boss_arena`**: guard includes **`variant": "elite"`**.
- **`room_security_junction`**: three **`alarm_lights`** tiles for ARGUS mood.

## Contract

- Updated **`docs/contracts/room-runtime.md`** for `alarm_lights`, `hack_robot`, guard `variant`, robot `id`/`patrol`.

## Suggested next tasks (pick one track)

| Track | Idea |
|-------|------|
| **E** | Extend camera feedback: separate tint when **suppressed** vs hot, or aim-arrow decal on floor (avoid double-tint with current pulse). |
| **A** | More rooms: `hack_robot` without gate, or **`alarm_lights`** in specimen / boss arena. |
| **B** | Preload hooks if real PNG robots/alarms replace grayboxes. |
| **D** | HUD line when robot is hacked; optional mute VFX in settings. |

## Integrator check

- Play: **Holding → Lab → Security → Utility**; at utility, **E** on closet: gate opens, bot **hack** VFX, patrol stops.
- Transform (**T**): brief red/green flash at player.

Do **not** edit the same JSON rooms in parallel without rebasing; prefer one agent per **room file** or serialize merges.
