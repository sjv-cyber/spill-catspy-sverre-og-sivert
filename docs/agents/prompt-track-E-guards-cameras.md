# Agent spor E — vakter, ARGUS-kamera, deteksjon

## Din rolle

Rom-basert **stealth**: vakt-patrulje, sveipende kamera, **synkegel + LOS** mot spiller → `GameOver` som standard (jf. [AGENTS.md](../../AGENTS.md) / [CLAUDE.md](../../CLAUDE.md); unntak `supports_retreat` i [room-runtime.md](../contracts/room-runtime.md)).

## Før du koder

1. Les [AGENTS.md](../../AGENTS.md) og nyeste oppføringer i [docs/JOURNAL.md](../JOURNAL.md).
2. [docs/contracts/room-runtime.md](../contracts/room-runtime.md) — `wallGrid`, `tileWorldSize`, rom-JSON `entities.guards` / `entities.cameras`, `supports_retreat`.
3. [docs/CATSPY_ROOM_FLOW_SPEC.md](../CATSPY_ROOM_FLOW_SPEC.md) §4–§6, §13 (rom-lokal logikk).

## Filer du eier

- `src/entities/Guard.js`
- `src/entities/SecurityCamera.js`
- `src/systems/DetectionSystem.js`
- `src/scenes/RoomScene.js` (kun spawn/update/kall til `checkDetection`)
- Rom-JSON: vakt/kamera-plassering under `entities`

## JSON-eksempel

**Vakt:** `patrol` er minst to punkter i **tile-koordinater**; valgfritt `coneRange`, `coneAngle`, `speed`.

**Kamera:** `x`, `y` tiles; `baseAngle`, `sweep`, `sweepSpeed`, `range`, `coneAngle` (radianer).

## Ikke gjør

- Ikke gjør om hele `RoomLoader` tile-bygg uten avtale (spor B).
- Ikke legg inn dialogtrær for forskere her — bruk eget spor senere.

## Ferdigkriterium

Synlig patrulje, kamera-sveip, spottes i åpent sikt → `GameOver`; vegg blokkerer LOS.
