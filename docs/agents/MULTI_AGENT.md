# CatSpy — multi-agent utvikling (parallelle Cursor-økter)

**English:** Stack, shared-state rules, and code-style targets: read **[AGENTS.md](../../AGENTS.md)** first. **Platform:** [ADR 002](../adr/002-godot-desktop-primary-web-deferred.md) — **Godot** is the long-term target; **Phaser** in this repo is the prototype until migration.

Dette dokumentet støtter **flere parallelle agent-økter** (f.eks. én Cursor-vindu eller én terminal-agent per spor) uten at alle skriver i samme filer.

**Før du starter:** les [AGENTS.md](../../AGENTS.md) (stack, mønstre, delt state). Sjekk **siste oppføringer** i [docs/JOURNAL.md](../JOURNAL.md) for hva andre nettopp gjorde.

## Grunnregler

1. **Kontrakt først** — les og følg [docs/contracts/room-runtime.md](../contracts/room-runtime.md). Endringer der koordineres eksplisitt før merge.
2. **Eierskap per spor** — hvert spor har en **primær fil-liste** (se prompt-filer under). Unngå å endre andre spors filer med mindre du er integrator.
3. **Én git worktree per spor** (anbefalt) — unngår at to agenter pusher samme working tree.
4. **Én dev-server** — etter merge: kjør `npx serve .` (eller tilsvarende) fra **hovedrepo** én gang; ikke to servere på samme port.
5. **Merge-rekkefølge** — **A (data) → B (loader/scene)**, **C (player)** kan ofte parallelt med **B** når spawn/koordinater i JSON er stabile; **D (flyt/UI)** sist eller parallelt når `RoomScene`-API er kjent.

## Git worktrees (PowerShell)

Fra hovedrepo (`spill-catspy-sverre-og-sivert`), på `main` (eller felles feature-branch):

```powershell
# Opprett mapper ved siden av repoet (tilpass stier)
git worktree add ..\catspy-wt-A main
git worktree add ..\catspy-wt-B main
git worktree add ..\catspy-wt-C main
git worktree add ..\catspy-wt-D main
```

Alternativt **én branch per spor** (tydeligere PR-er):

```powershell
git branch agent/track-a-data
git worktree add ..\catspy-wt-A agent/track-a-data
# ... gjenta for B/C/D med egne branch-navn
```

Når et spor er ferdig:

```powershell
cd <hovedrepo>
git merge agent/track-a-data   # eller cherry-pick / PR via GitHub
git worktree remove ..\catspy-wt-A
```

## Cursor CLI og parallelle sesjoner

### Åpne flere IDE-vinduer (ulike worktrees)

```powershell
cursor -n C:\path\to\catspy-wt-A
cursor -n C:\path\to\catspy-wt-B
```

Lim inn innholdet fra riktig `docs/agents/prompt-track-*.md` i **Agent**-chatten i det vinduet, eller åpne filen og be agenten følge den.

### Terminal-agent (`cursor agent`)

Cursor 3.x eksponerer subkommandoen **`agent`** (headless/terminal-modus). Kjør fra rot i worktreet du jobber i:

```powershell
cd C:\path\to\catspy-wt-A
cursor agent
```

**Merk:** Eksakt syntaks for ikke-interaktiv prompt (f.eks. stdin eller flagg) varierer med Cursor-versjon. Kjør `cursor --help` og sjekk eventuell egen dokumentasjon for din installasjon. Inntil du har bekreftet flagg, er tryggeste mønster:

- Én terminal per spor → `cursor agent` → lim inn hele prompt-filen når agenten spør, **eller**
- Bruk IDE-vindu + Agent med prompt-filen som kontekst (`@docs/agents/prompt-track-....md`).

### Standalone chat-vindu

```powershell
cursor --chat
```

Nyttig for rask sparring uten full workspace; for kodeendringer foretrekk workspace i riktig worktree.

## Prompt-filer (kopier eller @-referer i Agent)

| Spor | Fil | Primære filer |
|------|-----|----------------|
| A | [prompt-track-A-data.md](prompt-track-A-data.md) | `assets/rooms/*.json` |
| B | [prompt-track-B-loader-scene.md](prompt-track-B-loader-scene.md) | `src/systems/RoomLoader.js`, `src/scenes/RoomScene.js` |
| C | [prompt-track-C-player.md](prompt-track-C-player.md) | `src/entities/Player.js`, `src/systems/InputManager.js`, `src/config.js` |
| D | [prompt-track-D-flow-ui.md](prompt-track-D-flow-ui.md) | `src/main.js`, `src/scenes/BootScene.js`, `src/scenes/TitleScene.js`, `src/scenes/GameOverScene.js`, `src/scenes/PauseScene.js`, `src/scenes/BetaCompleteScene.js` |
| E | [prompt-track-E-guards-cameras.md](prompt-track-E-guards-cameras.md) | `src/entities/Guard.js`, `src/entities/SecurityCamera.js`, `src/systems/DetectionSystem.js`, `RoomScene` (spawn/update), `assets/rooms/*` (`entities.guards`, `entities.cameras`) |

## Integrator-sjekkliste (etter merge)

- [ ] `npx serve .` → tittel → rom → bevegelse → utgang → «slice complete»
- [ ] Ingen dupliserte statiske kolliderere ved scene-restart
- [ ] `docs/contracts/room-runtime.md` reflekterer eventuelle JSON- eller API-endringer

## Videre lesning

- Romflyt og tilstander: [docs/CATSPY_ROOM_FLOW_SPEC.md](../CATSPY_ROOM_FLOW_SPEC.md)
- Implementasjonsprioriteringer: [docs/CURSOR_GAME_DEV_BRIEF.md](../CURSOR_GAME_DEV_BRIEF.md)
- Siste integrasjonshandoff (robots / VFX / alarm lights): [AGENT_HANDOFF_AUTONOMOUS.md](AGENT_HANDOFF_AUTONOMOUS.md)
