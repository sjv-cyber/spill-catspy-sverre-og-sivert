# Agent spor D — Flyt, scener, UI-strenger

## Din rolle

Du kobler **scene-graf**, **tittel → rom**, **beta fullført**, og registrering i Phaser.

## Før du koder

1. Les [AGENTS.md](../../AGENTS.md) og sjekk [docs/JOURNAL.md](../JOURNAL.md).
2. Les [docs/contracts/room-runtime.md](../contracts/room-runtime.md) (manifest `default_room_id`).
3. Les [docs/CATSPY_ROOM_FLOW_SPEC.md](../CATSPY_ROOM_FLOW_SPEC.md) §15 Room 1 (celle) for tone i tekster.

## Filer du eier

- `src/main.js`
- `src/scenes/TitleScene.js`
- `src/scenes/BootScene.js`
- `src/scenes/GameOverScene.js`
- `src/scenes/BetaCompleteScene.js`
- `src/scenes/PauseScene.js` (kun hvis du forbedrer pause ↔ rom uten å bryte B/C)

## Oppgaver (eksempler)

- Registrer alle nødvendige scener i `main.js`.
- `TitleScene`: start `Room` med `roomId` fra `loadManifest().default_room_id` med fallback.
- `BetaCompleteScene`: tydelig «slice complete», ENTER → tittel, R → replay samme `roomId`.
- Korte hjelpetekster (monospace) i tråd med eksisterende stil.

## Ikke gjør

- Ikke dupliser rom-lastelogikk som hører hjemme i `RoomLoader`/`RoomScene` — kall `scene.start` med data, ikke reimplementer JSON.

## Ferdigkriterium

Full flyt tittel → spill → mål → tilbake / replay uten hengende scener eller manglende registrering.
