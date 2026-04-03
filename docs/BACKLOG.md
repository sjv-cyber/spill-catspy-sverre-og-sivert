# Backlog

Append new items at the bottom. Mark completed items with `[x]`.

---

## Story & Narrative
- [ ] Write Dr. Cross terminal logs (5-7 entries) — see STORY_THREAD.md Task 1
- [ ] Write room entry HUD text for all rooms — STORY_THREAD.md Task 2
- [ ] Environmental storytelling details per room — STORY_THREAD.md Task 3
- [ ] Koschei internal monologue lines — STORY_THREAD.md Task 4
- [ ] Ending sequence text — STORY_THREAD.md Task 5

## Gameplay
- [ ] Cat wall climbing on tagged surfaces
- [ ] Cat vent/crawl mechanic
- [ ] Scripted guard takedown in Isolated Corridor (Phase 1→2 transition)
- [ ] Player sprite swap on gear acquisition (prisoner → armed)
- [ ] Keycard-locked doors/terminals (Phase 2 requirement)

## Rooms
- [ ] Genetics Lab room
- [ ] Isolated Corridor room (takedown)
- [ ] Security Wing room
- [ ] Server Core room
- [ ] Ventilation Nexus room
- [ ] Docking Bay room (final)

## Polish
- [ ] Sound design (ambient, footsteps, laser buzz, detection alarm)
- [ ] Gamepad testing and tuning
- [ ] Sweeping laser variant
- [ ] Room background art for all rooms
- [ ] Performance profiling at 60 FPS target

## Repo / agent hygiene
- [ ] After large merges: overwrite `docs/STATUS.md`, prepend `docs/JOURNAL.md`, append `docs/BACKLOG.md` per [AGENTS.md](../AGENTS.md) Shared State section
- [ ] Migrate `src/**/*.js` toward AGENTS style (**no semicolons**, ASI-safe) in a dedicated pass; avoid mixing styles in single-file edits until then
- [x] Add Cursor/IDE rule file (e.g. `.cursor/rules`) that points agents at `AGENTS.md` + `CLAUDE.md` if the team uses Cursor rules

## Platform (ADR 002 — Godot target)
- [ ] Bootstrap **Godot 4.x** project (e.g. `godot/` in repo or linked repo); pin engine version in README or `export_presets.cfg` notes
- [ ] Document Godot ↔ `docs/contracts/room-runtime.md` mapping (TileMap layers, spawn, exits, retreat/boss flags)
- [ ] First **desktop** playable slice in Godot (one room + movement + transform stub acceptable)
- [ ] Optional: HTML5 export smoke-test checklist (load size, audio unlock) before calling web “supported”
- [ ] When needed: minimal **Railway** service template (env vars, CORS, health route) — no secrets in git
