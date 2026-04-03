# CATSPY — Room Flow Spec (2D)  
**Purpose:** Addendum to the existing game dev brief and 2D level concept. This file defines the room-to-room gameplay structure for CatSpy so Cursor can implement the first playable version with the correct pacing, room logic, and combat boundaries.

---

## 1. Core Direction

CatSpy is a **2D room-based stealth/action game**.

It should feel like:
- **Among Us** in readability and room identity
- **Metroid** in progression, gating, and route discovery
- **Not** like a continuous open-world map
- **Not** like a pure arena shooter

### Core Rule
The player moves **from room to room** inside Eagle's Nest.
Each room is a small gameplay scene with its own logic, threats, and exits.

### Combat Rule
- Normal combat happens **inside the room the player is currently in**.
- The player can usually retreat out of a room during combat.
- **Boss rooms are the exception**: once the boss encounter begins, exits lock until the encounter is resolved.

This rule should shape layout, AI, room states, and camera behavior.

---

## 2. Design Goals

The room system should support these goals:

1. **Fast readability**  
   A player entering a room should quickly understand where the exits, threats, and interactables are.

2. **Strong room identity**  
   Each room should feel like a real station module: lab, security, maintenance, containment, server core, etc.

3. **Short decision loops**  
   On entry, the player should make a quick tactical choice:
   - sneak
   - fight
   - retreat
   - interact
   - switch form
   - use a robot

4. **Localized tension**  
   Action should feel contained and legible, not spread chaotically across the whole station.

5. **Controlled progression**  
   Some rooms should only become useful or accessible later through abilities, keys, or route knowledge.

---

## 3. High-Level Map Structure

The station should be built as a **network of connected rooms**, not one long corridor and not one giant scrolling level.

### Recommended Structure
Use major station zones connected by room-to-room travel:

- Cell Block
- Maintenance
- Small Lab
- Security
- Specimen Wing
- Genetics Lab
- Server Core
- Dock / Shuttle Bay

Each zone can contain 2–5 rooms depending on scope.

### Recommended Map Logic
- One **main critical path** toward escape / objective progression
- One or more **side paths** for optional story, upgrades, or safer routes
- A few **locked or ability-gated routes** for mild Metroid-style progression
- A few **cat-only traversal routes** such as vents, small ducts, and wall gaps

Do **not** build a giant interconnected metroidvania on first pass.
Build a **node-based station map** with selective backtracking.

---

## 4. Room Types

Each room should have a `room_type` that drives gameplay rules.

### 4.1 Normal Room
Used for traversal, stealth, light combat, and minor interactions.

Properties:
- player can enter and leave freely
- may contain guards, scientists, hazards, or a small robot
- combat stays inside this room
- retreat is allowed

Use for:
- corridors
- labs
- storage
- maintenance rooms

### 4.2 Encounter Room
Used for a more deliberate gameplay beat.

Properties:
- stronger identity than a normal room
- may contain a mutant, scientist event, mini-combat, puzzle, or scripted tension beat
- player can still retreat unless explicitly locked by script

Use for:
- mutant specimen room
- alarmed security station
- scientist rescue/help scene
- puzzle room with robot control

### 4.3 Boss Room
Used for major combat or climactic encounters.

Properties:
- room looks and feels distinct before entry
- exits lock when encounter begins
- player cannot leave during the fight
- unlocks only when encounter is resolved

Use for:
- CHIMERA operative encounter
- containment breach boss
- elite security commander

### 4.4 Hub / Safe Transition Room
A lower-pressure room used to reset pacing.

Properties:
- low threat or no threat
- used to orient the player
- may include terminals, story props, or route decisions

Use for:
- junctions
- observation hallways
- post-encounter decompression

### 4.5 Transition Room
Small connector used to separate major scenes.

Properties:
- simple geometry
- limited interaction
- used to reset rhythm and maintain readability

Do not overdesign these.
They mainly support flow.

---

## 5. Room State Model

Each room should support a clear internal state machine.

### Minimum Required States
- `idle`
- `alert`
- `combat`
- `cleared`
- `locked_boss`

### State Definitions

#### `idle`
Default state.
- enemies patrol or behave normally
- exits function normally
- interactables available

#### `alert`
Triggered by noise, sighting, suspicious activity, or minor escalation.
- enemies search
- scientists panic, hide, flee, or trigger alarms
- room remains traversable unless scripted otherwise

#### `combat`
Triggered when direct conflict begins.
- local enemies attack the player
- combat music / UI can activate
- retreat from non-boss rooms remains possible

#### `cleared`
Primary local threat has been removed or resolved.
- room becomes safer
- some interactables may unlock
- used to reward progress and reduce noise in revisits

#### `locked_boss`
Boss fight is active.
- exits sealed
- no retreat
- room camera and logic focus on the encounter

### Important Rule
Avoid station-wide global combat states on the first implementation.
Keep escalation mostly **room-local**.
Neighboring rooms may react lightly later, but the primary logic is local.

---

## 6. Room Layout Rules for 2D

Because this is 2D, each room must read clearly and play cleanly.
Do not build realistic architecture at the cost of gameplay.

### Every Room Should Usually Have
- 1–3 exits
- 1 clear main floor path
- 1 secondary positional element (platform, vent route, upper ledge, crawl path)
- 1 piece of cover or stealth support
- 1 interactable or hazard
- 1 dominant gameplay question

### Examples of Dominant Gameplay Questions
- Can I sneak past the guard?
- Should I go through as cat or human?
- Is this scientist dangerous or useful?
- Should I hack the robot or conserve time?
- Is this room worth clearing or should I retreat?

### Readability Rules
The player should quickly understand:
- where they entered
- where exits are
- where danger is
- what can be interacted with
- what movement options exist

### Avoid
- overcomplicated multi-level platform mazes inside one room
- too many props blocking readability
- long horizontal dead space with no decision-making
- repeated room silhouettes that make navigation confusing

---

## 7. Forms and Room Design

Koschei can operate in at least two play states:
- **cat form**
- **human/armed form**

Room layouts should support this difference.

### Cat Form Supports
- vents
- narrow ducts
- under-table or under-console traversal
- smaller hitbox routes
- stealthier movement

### Human / Armed Form Supports
- direct combat
- using firearms
- stronger interaction with doors / panels / pickups

### Layout Rule
At least some rooms should offer:
- a **safe/small cat route**
- a **riskier/direct human route**

This should not exist in every room, but it should be common enough to define the game's identity.

---

## 8. Scientists in the Room System

Scientists are one of the most important new elements and should not behave like guards with different sprites.

### Scientist Roles
Scientists can be:
- hostile by behavior, not by direct combat
- morally compromised witnesses
- frightened civilians
- brief helpers who disappear after assisting

### Allowed Scientist Behaviors
- flee when they see the player
- trigger alarm
- lock or unlock a door
- hand over a code or access hint
- disable a system for a moment
- release a contained threat by mistake or on purpose
- vanish after helping

### Design Rule
Scientists should mostly create **situations**, not prolonged conversations.
There are no dialogue trees and no cutscenes.

### Tone Rule
Some scientists can be helpful, but they should not turn the station into a hopeful place.
They are part of the system, even when they crack.

---

## 9. Mutants / Other Prisoners

Other prisoners with unstable mutations are important for horror and moral weight.

### Role in Gameplay
They are primarily:
- sudden threats
- environmental warnings about CHIMERA
- tragic mirrors of Koschei

### Behavior Direction
- almost feral
- unstable movement or attacks
- frightening and ugly rather than elegant
- may have flashes of human behavior only if needed for a strong moment

### Emotional Goal
Player should mainly feel:
- fear
- disgust

Secondarily:
- recognition of what Koschei might have become

### Design Rule
Do not overuse them. A few memorable encounters are better than many generic monster rooms.

---

## 10. Boss Room Rules

Boss rooms are the major exception to normal flow.

### Boss Room Principles
1. Distinct visual identity before the fight
2. Clear threshold into the encounter
3. Exits lock on encounter start
4. Layout is simpler and more intentional than normal rooms
5. The boss expresses CHIMERA's purpose: controllable weaponized mutation

### Boss Direction
Bosses should usually feel like a mix of:
- weapon
- victim

They are not just monsters.
They are evidence of what the program is trying to mass-produce.

### Good Boss Categories
- controlled CHIMERA operative
- unstable near-success
- elite security/mutation hybrid
- former prisoner pushed into weapon duty

### Bad Boss Direction
Avoid making every boss just a giant screaming creature.
That flattens the fiction and weakens the espionage angle.

---

## 11. Robot Hacking (Small Gimmick)

Robot hacking is a **secondary mechanic**, not a core pillar.

### Confirmed Role
Used for:
- small problem-solving
- occasional weapon use
- short tactical opportunities

### Included Robot Types for First Pass
- **Gun robot**
- **Cabinet/closet robot**

Jetpack robots are postponed unless the first implementation is already stable.

### Fiction
Koschei can hack small lab robots.
Implementation can be abstracted into a proximity interaction or short hack action.

### Good Uses
- open a storage unit
- attack a nearby enemy briefly
- distract guards
- trigger a switch from a safer position
- create a temporary route change

### Design Rule
This mechanic should solve a room problem in a memorable way, but should not become the dominant strategy in every room.

---

## 12. Slow Motion Ability

Slow motion can work, but only if it supports the stealth/action identity instead of turning the game into pure run-and-gun.

### Recommended First Implementation
Use slow motion as a **short panic-response combat aid**.

### Suggested Rules
- very short duration
- used for precision, escape, or quick reaction
- paired with shooting or urgent repositioning
- limited by cooldown or energy

### Good Use Cases
- the player gets spotted and needs one sharp response
- the player lines up a quick shot in a tight room
- the player avoids death in a boss phase

### Do Not Make It
- a permanent bullet-time fantasy
- the main combat identity of the game

This should feel like mutant reflexes under stress, not superhero dominance.

---

## 13. Room Boundaries and Combat Behavior

Because combat is room-local, AI and camera should respect room boundaries.

### For Normal and Encounter Rooms
- enemies inside the room engage the player
- player may retreat out through an exit
- combat should de-escalate if the player breaks contact and leaves
- room may stay in `alert` state for some time after retreat

### For Boss Rooms
- exits lock when the boss encounter officially starts
- player cannot leave until boss is defeated or the scripted condition completes

### Important Implementation Principle
Treat a room as the primary simulation container for:
- enemy activation
- combat music
- alert state
- temporary hazards
- scientist reactions

This will simplify implementation and help keep the game readable.

---

## 14. Recommended Data Model

Cursor should structure rooms as data-driven content.

### Minimum Room Data
```json
{
  "room_id": "small_lab_01",
  "room_name": "Small Lab",
  "room_type": "encounter",
  "zone": "research",
  "exits": ["hall_left", "vent_upper"],
  "entry_points": ["door_left"],
  "lock_state": "unlocked",
  "default_state": "idle",
  "layout_tags": [
    "cat_route",
    "upper_platform",
    "scientist_present",
    "robot_socket"
  ],
  "entities": [
    "scientist_01",
    "guard_01",
    "cabinet_robot_01"
  ],
  "interactables": [
    "terminal_01",
    "security_switch_01"
  ],
  "hazards": [
    "glass_tank_01"
  ]
}
```

### Useful `room_type` Values
- `normal`
- `encounter`
- `boss`
- `hub`
- `transition`

### Useful `layout_tags`
- `cat_route`
- `human_fire_lane`
- `upper_platform`
- `cover_heavy`
- `scientist_present`
- `camera_zone`
- `robot_socket`
- `hazardous_floor`
- `boss_lock`

This should support both grayboxing and later content expansion.

---

## 15. Vertical Slice — Recommended First Sequence

Build the first playable slice as 6 rooms.
This is enough to prove the structure.

### Room 1 — Cell
Purpose:
- wake-up space
- immediate mood
- basic movement
- exit discovery

Key Features:
- tiny intro room
- one visible door or barred exit
- one obvious interactable or escape point

### Room 2 — Holding Corridor
Purpose:
- teach room-to-room movement
- first stealth read

Key Features:
- one guard patrol
- one obvious safe route and one riskier route
- low complexity

### Room 3 — Small Lab
Purpose:
- first scientist encounter
- first stronger room identity
- optional robot interaction

Key Features:
- scientist behavior event
- one robot use case
- one story prop or terminal

### Room 4 — Security Room
Purpose:
- teach room-local combat risk
- establish guns, surveillance, or alarms

Key Features:
- armed threat
- camera or alarm device
- possible tactical retreat

### Room 5 — Specimen Room
Purpose:
- first unstable mutant encounter
- horror beat

Key Features:
- visual evidence of CHIMERA
- mutant threat
- room feels dangerous and wrong

### Room 6 — Containment / Mini Boss
Purpose:
- teach locked encounter rule
- first boss-like escalation

Key Features:
- distinct entrance
- exits lock on trigger
- stronger combat pattern than prior rooms

If this six-room slice works, the rest of the game can scale from it.

---

## 16. Graybox Rules for Cursor

When generating the first version of levels, Cursor should follow these rules:

1. **One room = one clean gameplay idea**
2. **Prefer clarity over realism**
3. **Keep most rooms small enough to understand immediately**
4. **Do not make every room a combat room**
5. **Use scientists as encounter design tools, not exposition dumps**
6. **Use mutants sparingly for impact**
7. **Make boss rooms visually and mechanically distinct**
8. **Support both cat-route and direct-route logic where useful**
9. **Keep robot hacking optional and short**
10. **Localize combat logic to the active room**

---

## 17. What Cursor Should Build First

### Priority Order
1. Room manager / room transition system
2. Data-driven room definitions
3. Room-local combat and alert states
4. Basic room exits and entry points
5. Graybox rooms for the first 6-room slice
6. Guard AI scoped to room boundaries
7. Scientist event logic
8. One mutant encounter type
9. One robot hack interaction
10. One mini-boss locked room encounter

Do not start by building the full station.
Prove the room-flow model first.

---

## 18. Final Implementation Principle

CatSpy should feel like moving through a series of tense, readable, purpose-built spaces.
The player is not wandering a giant map.
They are surviving and progressing **room by room**, making small tactical decisions under pressure.

That room logic is one of the core identities of the game.

