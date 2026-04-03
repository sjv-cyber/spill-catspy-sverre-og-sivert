# Agent spor B — RoomLoader + RoomScene

## Din rolle

Du implementerer **lasting og oppbygging** av rom i Phaser, pluss **RoomScene**-logikk som bruker loaderen.

## Før du koder

1. Les [docs/contracts/room-runtime.md](../contracts/room-runtime.md) — API for `loadManifest`, `resolveRoomPath`, `loadRoomData`, `buildRoom`.
2. Les [docs/CATSPY_ROOM_FLOW_SPEC.md](../CATSPY_ROOM_FLOW_SPEC.md) §13, §17 (rom som container, prioritert rekkefølge).

## Filer du eier

- `src/systems/RoomLoader.js`
- `src/scenes/RoomScene.js`

## Oppgaver (eksempler)

- `fetch` manifest + rom-JSON; bygg statisk kollisjon fra `layers.walls`.
- Beregn `playerSpawnPixels` og `exitZone` som beskrevet i kontrakten.
- I `RoomScene`: kamera bounds, følge spiller, kollider, overlap mot exit → start win-scene.
- `entry_text` én gang + fade (scrollFactor 0).
- Rydd opp staticGroup/spiller ved `SHUTDOWN` for å unngå lekkasjer ved restart.

## Koordinering

- Hvis du trenger nye felt i JSON, oppdater **først** `room-runtime.md` og spor A, eller implementer defensivt (valgfrie felt).

## Ikke gjør

- Ikke implementer full `Player`-logikk her (spor C) — hold deg til scene + loader + kollisjon/overlap.

## Ferdigkriterium

Rom lastes uten console-feil, vegger stopper kropp, exit utløser overgang.
