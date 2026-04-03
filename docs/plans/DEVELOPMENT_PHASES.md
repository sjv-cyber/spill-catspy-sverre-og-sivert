# CatSpy — development phases (post–ADR 002)

**Audience:** human designers + Cursor / autonomous agents.  
**Ground truth:** [AGENTS.md](../../AGENTS.md), [docs/JOURNAL.md](../JOURNAL.md), [ADR 002](../adr/002-godot-desktop-primary-web-deferred.md).

## Principles

1. **Target stack = Godot 4 (2D), desktop first**; Phaser in this repo = **prototype + contract reference** until Godot carries the slice.
2. **Playable richness before scope:** one tight vertical slice in Godot beats spreading features across two engines.
3. **Story wishes → OpenSpec change → tasks:** the boys stay descriptive; agents implement from **proposal / design / tasks** under `openspec/changes/<name>/`.
4. **LLM strengths:** text (dialogue, terminal logs, room copy), code (systems, GDScript), structured data (JSON, specs). **Visuals:** packs + engine VFX + occasional Gemini plates—not full bespoke art per room in v1.

---

## Phase 0 — Spec discipline & OpenSpec (now)

**Goal:** Every non-trivial body of work is traceable and agent-executable.

| Action | Owner |
|--------|--------|
| OpenSpec initialized (Cursor skills + `/opsx:*` commands) | done |
| Use **`openspec new change "<kebab-name>"`** then **`openspec status --change … --json`** to drive **proposal → design → tasks** (or Cursor **`/opsx:propose`**) | ongoing |
| **`openspec validate`** before merge on active changes | agents |
| **`/opsx:apply`** (or manual task execution) implements; **`/opsx:archive`** merges learnings into **`openspec/specs/<capability>/spec.md`** when appropriate | agents |
| Keep [docs/contracts/room-runtime.md](../contracts/room-runtime.md) aligned with **Godot mapping doc** (Phase 1) | integrator |

**OpenSpec fit:** Large migrations (Godot bootstrap), new mechanics (vents, takedown), Railway API—each gets its **own change** so parallel agents do not collide.

---

## Phase 1 — Godot foundation (blocking)

**Goal:** A committed **`godot/`** project (or linked repo, documented in README) with pinned **Godot 4.x** version and a **single playable room** on desktop.

| Deliverable | Notes |
|-------------|--------|
| `project.godot`, 2D renderer, input map (keyboard + pad stub) | text-first; scenes as `.tscn` |
| **Room contract mapping** | New doc: `docs/contracts/godot-room-runtime.md` — TileMap layers ↔ `layers.walls`, spawn, exit, `supports_retreat`, boss lock, etc. |
| **Import path** for assets | Reuse PNG rules from [ART_BIBLE.md](../ART_BIBLE.md); chroma optional in Godot (shader or import script) |
| One room: **cell or tutorial** | Movement, jump, transform toggle, collision with floor/walls |
| Export preset notes | Desktop; HTML5 **not** required to pass this phase |

**OpenSpec change suggestion:** `godot-bootstrap-vertical-slice`

**Phaser:** maintenance only (critical fixes); no new large systems unless explicitly **prototype-only** per AGENTS.

---

## Phase 2 — Gameplay parity slice (Godot)

**Goal:** Prove **stealth loop** in engine: detection, fail state, room transition, optional retreat room behaviour.

| Deliverable | Notes |
|-------------|--------|
| Player forms, camera, juice (tween/shake) | engine-native where possible |
| Guard patrol + cone + **instant fail** (default) | match CLAUDE constraints |
| One **retreat** room or flag demo | `supports_retreat` semantics from room-runtime |
| **Laser** or simplified hazard | parity with design doc minimum |
| Scene flow: title → room → game over / retry | minimal UI |

**OpenSpec change suggestions:** `godot-detection-guards`, `godot-room-flow-ui` (can be one change if tasks stay small).

---

## Phase 3 — Content & narrative velocity

**Goal:** Many rooms and story beats without rewriting core code per room.

| Stream | Work |
|--------|------|
| **Rooms** | Tiled or Godot TileMap + data files; manifest equivalent (`rooms.json` or Resource list) |
| **Narrative** | Execute [BACKLOG.md](../BACKLOG.md) story tasks; terminal JSON → Godot UI (RichTextLabel, etc.) |
| **New rooms from DESIGN** | Genetics Lab, Isolated Corridor (takedown), … as separate small changes |
| **Gameplay backlog** | Vents, wall climb, keycard—**one OpenSpec change per mechanic** |

**Phaser:** optional playtest reference; deprecate when Godot slice is the daily driver.

---

## Phase 4 — Backend (Railway), when needed

**Goal:** Cloud saves, auth, or telemetry—**not** required for core single-player fun.

| Deliverable | Notes |
|-------------|--------|
| Minimal service (health, CORS, `.env.example`) | typed routes; no secrets in git |
| Client in Godot | `HTTPRequest` or small REST wrapper |
| **OpenSpec change:** `railway-cloud-save-stub` (or similar) | proposal defines API contract |

---

## Phase 5 — Web export (polish milestone)

**Goal:** HTML5 export **smoke-tested**; document load size, audio policy, known limitations.

| Deliverable | Notes |
|-------------|--------|
| Export preset + one CI or manual checklist | link from README |
| Trim asset budget if needed | ADR 002 consequence |

---

## Mapping: BACKLOG → phases

| BACKLOG section | Primary phase |
|-----------------|---------------|
| Platform (ADR 002) | 0–1 |
| Gameplay (vents, takedown, keycard) | 2–3 |
| Rooms (new level JSON / scenes) | 3 |
| Story & narrative | 3 |
| Polish (audio, gamepad, art) | 2–3 + 5 |
| Repo hygiene | 0 (ongoing) |

---

## Agent checklist (start of session)

1. Read [AGENTS.md](../../AGENTS.md) and newest [JOURNAL.md](../JOURNAL.md).
2. Confirm task target: **Godot** vs **Phaser prototype-only**.
3. If starting multi-step feature: **`openspec new change …`** or **`/opsx:propose`**.
4. After merge: prepend **JOURNAL**, update **STATUS** if direction shifted, **archive** OpenSpec change when done.
