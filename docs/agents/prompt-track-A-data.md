# Agent spor A — romdata og manifest

## Din rolle

Du jobber **kun** med datafiler for rom. Ikke endre `src/` i dette sporet med mindre integrator ber om det.

## Før du koder

1. Les [AGENTS.md](../../AGENTS.md) og sjekk [docs/JOURNAL.md](../JOURNAL.md) for nylig arbeid.
2. Les [docs/contracts/room-runtime.md](../contracts/room-runtime.md) fullstendig.
3. Les [docs/CATSPY_ROOM_FLOW_SPEC.md](../CATSPY_ROOM_FLOW_SPEC.md) §14–§16 for semantikk (romtyper, tags).

## Filer du eier

- `assets/rooms/manifest.json`
- `assets/rooms/room_cell_01.json` (og evt. nye `room_*.json`)
- Valgfritt: utvide `room_tutorial.json` med `entry_text` / spec-felt **uten** å bryte eksisterende `width`/`height`/`layers`

## Oppgaver (eksempler)

- Legg til eller juster rom JSON: `room_type`, `zone`, `exits`, `entry_points`, `default_state`, `layout_tags`, `entry_text`, `entities` / `interactables` / `hazards` som **tomme eller gyldige** strukturer.
- Oppdater manifest med nye `room_id` → `path`.
- Sikre at `layers.walls` matcher `width` × `height` og at `playerSpawn` / `exit` ligger på gyldige tile-koordinater.

## Ikke gjør

- Ikke endre `RoomLoader.js` eller `RoomScene.js` her (spor B).
- Ikke endre kontrakten uten å oppdatere `room-runtime.md` og varsle andre spor.

## Ferdigkriterium

JSON validerer visuelt (ingen hull i yttervegger uten hensikt), manifest peker riktig, og kontrakten er oppfylt.
