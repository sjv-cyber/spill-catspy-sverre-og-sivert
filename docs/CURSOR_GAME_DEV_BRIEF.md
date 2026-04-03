# CatSpy — Cursor Game Development Brief

This document is the practical handoff for **code-first development** of CatSpy.
It translates the current story direction into a buildable game plan.
It is meant for Cursor as the working source for implementation decisions.

Grounding story assumptions from the current story thread:
- 2070. The Cold War never ended.
- Setting: Eagle's Nest, a secret American orbital station.
- Project CHIMERA is a U.S. black-budget mutation program.
- Player character: Agent Koschei / Subject K.
- Koschei can shapeshift into a cat.
- Narrative delivery should remain lightweight: terminals, HUD text, environmental storytelling. No cutscenes or dialogue trees.
- ARGUS exists as station security AI, but should be used sparingly as cold system messaging.

---

## 1. Project Goal

Build a **playable vertical slice** of CatSpy focused on:
- stealth-first gameplay
- cat/human switching
- light shooting
- one small hacking/robot-control mechanic
- one researcher encounter
- one unstable mutant encounter
- one mini-boss or boss-style confrontation
- lightweight story delivery through room text, terminals, and environmental detail

This vertical slice should prove the core fantasy:

**A captured Soviet agent escapes an orbital U.S. black site by using cat mobility, stealth, violence, and improvised control over station systems.**

---

## 2. Core Design Pillars

### Pillar A — Stealth First
The main loop should reward:
- staying unseen
- observing patrols
- using small size and mobility
- choosing when to attack

### Pillar B — Short Bursts of Violence
Combat exists, but should feel dangerous and fast.
The player is not a tank.
Use short, decisive action rather than sustained firefights.

### Pillar C — Mutation as Utility, Not Spectacle
Cat-form, slow-motion reflexes, and limited robot hacking should support infiltration and escape.
Do not build a superhero game.

### Pillar D — Story Through Systems
The station should tell the story through:
- locked doors
- alarms
- containment failures
- lab debris
- terminals
- frightened or complicit personnel

---

## 3. Scope Rule

When in doubt, prefer the **simpler implementation** that preserves the fantasy.

Priority order:
1. movement feels good
2. stealth works reliably
3. cat/human switching is readable
4. enemies react clearly
5. one or two powers work cleanly
6. story content is delivered simply
7. only then add polish or extra systems

Do not expand into:
- dialogue trees
- inventory-heavy RPG systems
- open world structure
- many boss fights
- multiple overlapping upgrade trees
- large numbers of weapon types

---

## 4. Recommended Vertical Slice Content

Build **5 connected rooms** first, not the full station.

Suggested room sequence:
1. **Holding Cell**
2. **Lab Corridor**
3. **Research Lab**
4. **Security Checkpoint**
5. **Shuttle Access / Escape Bay**

This slice is enough to prove:
- awakening and escape
- stealth navigation
- first takedown / first weapon
- one researcher interaction
- one mutant threat
- one robot-control puzzle
- one final combat/escape climax

---

## 5. Player States

Implement the player as a small state machine first.

### Required Forms

#### Human Form
Capabilities:
- walk / run
- crouch
- use weapon
- interact with terminals, doors, panels
- perform takedown
- hack robots (limited)

Tradeoffs:
- louder
- larger target
- stronger in combat

#### Cat Form
Capabilities:
- move through vents/small gaps
- move faster in tight spaces
- lower visibility
- jump to small ledges
- bypass certain sensors or geometry

Tradeoffs:
- cannot use firearm
- cannot perform complex interactions
- fragile if spotted

### Optional Near-Term Ability
#### Reflex Slow Motion
Treat as a short defensive ability, not constant power mode.
Recommended implementation:
- manually triggered or auto-trigger on detection
- lasts 1 to 1.5 seconds
- small cooldown or energy cost
- best used to land a precise shot or avoid fatal damage

Avoid bullet-time as a dominant combat system.

---

## 6. Core Gameplay Loop

Target loop:
1. observe room
2. choose route
3. infiltrate in cat or human form
4. avoid or isolate threat
5. interact / unlock / sabotage
6. handle a short crisis
7. move to next room

Each room should contain at least one of:
- route choice
- stealth pressure
- environmental storytelling beat
- system interaction
- chase / panic moment

---

## 7. Minimum Systems to Implement First

### System 1 — Movement Controller
Must feel responsive before anything else.
Need:
- left/right or free movement depending on current project camera
- jump
- crouch
- form-switch input
- collision that supports different body sizes

### System 2 — Detection / Stealth
Need a simple, readable stealth model:
- enemy vision cone
- alert meter or immediate detection
- suspicious state
- alert state
- return-to-patrol state

Keep this simple. Reliable is more important than realistic.

### System 3 — Basic Combat
Need:
- one firearm only for first slice
- ammo optional; if used, keep it simple
- one melee takedown from stealth
- enemy hit/death reaction

### System 4 — Doors / Access Control
Need:
- locked vs unlocked doors
- keycard flag or security level flag
- panel-based door opening
- one door opened by researcher help or robot hack

### System 5 — Terminal / HUD Text Delivery
Need:
- room entry text trigger
- terminal popup UI
- short ARGUS system message support
- optional Koschei thought popup support

### System 6 — Robot Hacking (Limited)
Keep this small.
Allowed scope for first slice:
- player can take control of one small lab robot type
- robot can move to a target panel or shoot briefly
- used once or twice in the slice only

Do not build a full RTS/control framework.

---

## 8. Enemy and NPC Types for First Slice

Do not implement all possible content now.
Start with these 5 classes.

### A. Guard
Purpose:
- baseline stealth/combat threat

Behaviors:
- patrol
- detect player
- shoot
- investigate sound or disturbance if implemented

### B. Researcher
Purpose:
- narrative and light systemic variation

Two modes only in first slice:
1. **Panic Researcher**: flees, locks door, or triggers alarm
2. **Helpful Researcher**: briefly helps, opens path, then disappears

No dialogue trees.
Use short line, animation, or scripted event.

### C. Unstable Mutant
Purpose:
- horror beat
- show CHIMERA cost

Behavior:
- semi-feral movement
- aggressive when provoked or approached
- less tactical than guard
- should feel unpredictable

### D. Mini-Boss / CHIMERA Operative
Purpose:
- climax encounter
- show the weaponized goal of CHIMERA

For first slice, this should be a single elite enemy with:
- partial mutation
- weapon use or enhanced movement
- readable attack pattern

### E. Small Lab Robot
Purpose:
- tiny side mechanic
- utility or limited weapon use

For first slice, choose only **one** functional type:
- maintenance bot that can access a vent/panel
OR
- gun bot that can fire briefly

Do not implement both first.

---

## 9. Recommended Encounter Structure for the Slice

### Room 1 — Holding Cell
Function:
- teach movement
- teach form-switch
- establish tone

Required content:
- wake-up state
- environmental damage
- first room-entry text
- exit path requiring cat-form or improvised escape

### Room 2 — Lab Corridor
Function:
- teach stealth basics

Required content:
- first guard patrol
- first line from ARGUS
- optional hidden vent route

### Room 3 — Research Lab
Function:
- first researcher encounter
- first terminal log
- first strong CHIMERA visual evidence

Suggested scripted beat:
- one researcher helps unlock or disable something, then flees
OR
- one researcher panics and creates a complication

### Room 4 — Security Checkpoint
Function:
- first weapon pickup / first decisive takedown
- optional robot-hack interaction

Suggested content:
- keycard or security override
- one short combat beat
- one panel or turret/door solved through robot use

### Room 5 — Shuttle Access / Escape Bay
Function:
- climax

Suggested content:
- unstable mutant or CHIMERA operative boss
- alarm state
- optional slow-motion use moment
- ending trigger

---

## 10. Narrative Delivery Rules for Code Development

All narrative should be implemented as short, interrupt-light systems.

### Allowed Delivery Methods
- room entry text
- terminal logs
- environmental props
- short ARGUS announcements
- optional Koschei inner-thought stingers
- short researcher barks

### Not Allowed
- long cutscenes
- branching conversation systems
- exposition-heavy dialogue
- large text walls during danger moments

### Practical UI Rule
Any text shown during active gameplay should be readable in under 2 seconds.
Longer text belongs only in terminals or ending screens.

---

## 11. Technical Architecture Recommendation

Use a modular structure. Keep it boring and readable.

Suggested gameplay folders:

```text
src/
  entities/
    player/
    enemies/
    npc/
    robots/
  systems/
    stealth/
    combat/
    interaction/
    hacking/
    narrative/
  levels/
    room_data/
    triggers/
  ui/
  data/
    story/
```

Suggested data files:

```text
assets/story/
  terminal_logs.json
  room_text.json
  ending.json
  monologue.json
```

If room metadata is data-driven, consider:

```json
{
  "room_id": "research_lab",
  "entry_text": "Science without conscience leaves a smell.",
  "security_level": 2,
  "contains_terminal": true,
  "encounter_type": "researcher"
}
```

---

## 12. AI / State Logic Recommendation

Keep NPC logic small and explicit.

### Guard State Machine
- Patrol
- Suspicious
- Alert
- Search
- Return

### Researcher State Machine
- Work
- Startled
- Flee
- HelpScripted
- Despawn / Exit

### Mutant State Machine
- Idle
- Roam
- Triggered
- Attack
- Recover

### Robot State Machine
- Inactive
- Hacked
- ExecuteTask
- Timeout / Destroyed

Avoid complex behavior trees in the first version unless already needed by the engine setup.

---

## 13. Story Logic to Preserve in Code

These fiction rules should remain consistent:

1. **CHIMERA is a weapon program**, not random horror.
2. **Subject K is valuable** because he is a successful result and a security breach.
3. **USA is the active antagonist** in this story.
4. **The station should feel functional**, not abandoned.
5. **Some researchers are complicit, some frightened, some briefly helpful.**
6. **Other mutants are mostly tragic and dangerous**, not chatty characters.
7. **ARGUS should sound institutional**, not theatrical.
8. **Koschei should sound disciplined and dry**, not goofy.

---

## 14. First Implementation Milestones

### Milestone 1 — Playable Movement Sandbox
Build:
- player movement
- form switching
- door interaction
- camera
- one test room

Done when:
- switching forms feels good
- collision works
- basic traversal is fun

### Milestone 2 — Stealth Prototype
Build:
- one guard enemy
- detection cone
- alert feedback
- takedown

Done when:
- player can meaningfully avoid or ambush one guard

### Milestone 3 — Narrative Hooks
Build:
- room entry text system
- terminal UI
- JSON story loading
- basic ARGUS message trigger

Done when:
- first room can establish tone with almost no dialogue

### Milestone 4 — Interaction Layer
Build:
- locked doors
- keycard/security flags
- one scripted researcher event
- one robot-hack event

Done when:
- progression depends on interaction, not just movement

### Milestone 5 — Vertical Slice Climax
Build:
- one unstable mutant or CHIMERA elite encounter
- alarm escalation
- ending trigger

Done when:
- the slice has a clear beginning, middle, and end

---

## 15. What Cursor Should Build First

Recommended implementation order:

1. player controller
2. form switching
3. room trigger system
4. guard AI and detection
5. takedown and simple shooting
6. door/keycard progression
7. terminal/HUD text system
8. researcher scripted event
9. one robot-hack interaction
10. one mutant/boss encounter
11. ending trigger

This order matters. Do not start with boss content.

---

## 16. What to Stub or Fake Early

To move fast, fake these first:
- final art
- final enemy animations
- final soundscape
- full lore text set
- multiple weapon types
- advanced hacking UI
- complex pathfinding

Use placeholders where needed.
The goal is to validate flow, not finish presentation.

---

## 17. Open Questions to Resolve During Development

These do not need final answers before coding starts, but code should stay flexible enough to allow them:
- exact number of total rooms in the full game
- whether slow motion is manual or reactive
- how many bosses exist in full game
- whether cat-form can attack at all
- whether researchers can be killed without consequence
- whether robot control is local hack or remote takeover

---

## 18. Cursor Instructions

Use this as the implementation stance:

- prefer small, testable systems
- prefer data-driven room and story triggers
- keep classes/components focused
- avoid over-engineering
- build the vertical slice before expanding content
- preserve the stealth-first identity
- treat story as support for gameplay, not replacement for gameplay

If a choice is unclear, choose the version that is:
1. easiest to test
2. easiest to maintain
3. closest to stealth + escape fantasy

---

## 19. Immediate Next Task for Cursor

Start by creating a **playable prototype scene** with:
- player movement
- human/cat switching
- one guard patrol
- one locked door
- one room-entry text trigger
- one terminal interaction

Then expand from that base.

That is the correct starting point.
