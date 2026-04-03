# Agent spor C — Player + InputManager

## Din rolle

Du implementerer **spillerkontroll** (Arcade-fysikk), **input**, og **formbytte** i tråd med `config.js`.

## Før du koder

1. Les [docs/contracts/room-runtime.md](../contracts/room-runtime.md) (spawn er world-pixel senter fra loader).
2. Les [CLAUDE.md](../../CLAUDE.md) for tone og eventuelle gameplay-grenser som fortsatt gjelder.

## Filer du eier

- `src/entities/Player.js`
- `src/systems/InputManager.js`
- `src/config.js` (kun konstanter for spiller/hopp — unngå å endre globale spillhøyder uten avtale)

## Oppgaver (eksempler)

- Tastatur: A/D, piltaster, SPACE/W/↑ hopp, T transform, E interact (stub OK).
- Menneske/katt: forskjellig størrelse på kropp, `refreshBody` etter resize.
- Coyote tid / jump buffer (enkel versjon).
- Ingen direkte `fetch` av romdata i `Player` — scene håndterer kollider.

## Ikke gjør

- Ikke skriv om `RoomLoader` / `RoomScene` (spor B) med mindre du fikser et eksplisitt interface fra kontrakt.

## Ferdigkriterium

Bevegelse føles responsiv, hopp og transform fungerer, ingen input-lekkasjer ved scene-bytte.
