# CatSpy — Story Development Thread (Cursor Instructions)

## Purpose

This file is the entry point for a dedicated Cursor thread focused on **narrative and story development** for CatSpy. It is separate from the gameplay/code implementation threads.

## Before You Start

1. Read `AGENTS.md` for coordination rules (prepend `docs/JOURNAL.md` when you ship narrative chunks; append `docs/BACKLOG.md` for new tasks).
2. Read `CLAUDE.md` for project constraints and goals.
3. Read `DESIGN.md` Section 2 ("Story & Setting") for the established lore.
4. Read `DESIGN.md` Section 6.3 ("Room Types") for the room-by-room story beat map.

## What Has Been Established

- **Year:** 2070. The Cold War never ended. Soviet Union still exists.
- **Setting:** Eagle's Nest — a secret American orbital space station.
- **Antagonist:** USA / Project CHIMERA — a black-budget DNA splicing program creating hybrid operatives from kidnapped subjects.
- **Player:** Agent Koschei — a Soviet operative captured and mutated. Can shapeshift into a cat.
- **Progression:** Koschei starts as a prisoner (no gear), ambushes a lone guard in a scripted takedown (gets keycard + tactical gear), then steals CHIMERA data and escapes.
- **Key NPCs (mentioned, not seen):** Dr. Elena Cross (CHIMERA lead scientist), ARGUS (station security AI).
- **Narrative delivery:** Terminal text logs, environmental storytelling, room-entry HUD text. No cutscenes.

## What Needs Development

Work through these tasks in order. After each one, update this file with your progress notes.

### Task 1: Terminal Logs — Dr. Cross Research Notes
Write 5–7 short terminal log entries (max 150 words each) from Dr. Elena Cross. These are scattered across rooms (Genetics Lab, Security Wing, Server Core). They should:
- Reveal the CHIMERA program's escalation from "promising" to ethically horrific.
- Reference Koschei as "Subject K" — the unexpected success.
- Show Cross's deteriorating conscience (starts clinical, ends desperate).
- Include dates (2068–2070) and project codenames.
- Output as a JSON array in `assets/story/terminal_logs.json`.

### Task 2: Room Entry Text
Write a short HUD text line (max 15 words) for each of the 7 rooms. Displayed at the top of the screen when the player enters. Should set mood and hint at what happened there.
- Output as entries in room JSON files or a separate `assets/story/room_text.json`.

### Task 3: Environmental Story Details
For each room, list 2–3 specific environmental storytelling elements that should be visible in the pixel art (no text, purely visual). Examples: claw marks in holding cells, a flag draped over equipment, a smashed specimen tube. These guide the art/level design.
- Output as a section in `DESIGN.md` or a standalone `assets/story/env_details.json`.

### Task 4: Koschei's Internal Monologue (Optional)
Write 3–4 brief first-person thoughts (max 30 words each) that could appear as HUD text at key moments:
- Waking up in the cell.
- Seeing the failed experiments.
- After the guard takedown.
- Reaching the shuttle.
These are optional flavor — can be cut if they slow pacing.

### Task 5: Ending Text
Write a brief ending sequence (text only, displayed over a slow fade-to-black after reaching the shuttle):
- 3–5 short lines. Koschei's fate. What happens to the CHIMERA data.
- Tone: bittersweet. The mission succeeds but the cost is permanent — Koschei will never be fully human again.

## Constraints (Must Follow)

- **USA is the antagonist.** Do not soften or "both-sides" this. The Americans are running unethical experiments on kidnapped people. The Soviets are the player's side.
- **The Soviets are not saints** — they sent Koschei on a dangerous mission and may exploit the CHIMERA data themselves. But in THIS story, Koschei is the underdog.
- **No cutscenes, no dialogue trees.** All narrative is environmental or text-on-screen.
- **Dark tone with dry humor.** Koschei's situation is absurd (a spy turned into a cat) — lean into that occasionally without undermining the tension.
- **Keep text SHORT.** This is a stealth game, not a visual novel. Every word must earn its place.

## Output Locations

| Content | File |
|---------|------|
| Terminal logs | `assets/story/terminal_logs.json` |
| Room entry text | `assets/story/room_text.json` |
| Environmental details | `assets/story/env_details.json` |
| Ending text | `assets/story/ending.json` |
| Koschei thoughts | `assets/story/monologue.json` |

Create the `assets/story/` directory if it doesn't exist.

## Progress Notes

*(Cursor: update this section as you complete tasks)*

- [ ] Task 1: Terminal Logs
- [ ] Task 2: Room Entry Text
- [ ] Task 3: Environmental Story Details
- [ ] Task 4: Koschei Monologue (optional)
- [ ] Task 5: Ending Text
