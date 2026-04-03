# CatSpy — Game Design Document

## 1. Overview

**Genre:** 2D Stealth/Platformer
**Setting:** A secret American space laboratory, orbiting Earth, year 2070.
**Objective:** Infiltrate the lab as a Soviet agent who was transformed into a human-cat hybrid through DNA experiments. Steal classified weapons data and escape undetected.
**Tone:** Cold War paranoia meets sci-fi body horror. Tense stealth with dark humor and Soviet grit.

---

## 2. Story & Setting

### 2.1 World

The year is **2070**. The Cold War never ended. The Soviet Union endured — battered, stubborn, still standing. By the 2040s, both superpowers agreed on one thing: Earth was too small and too fragile for their rivalry. The battleground shifted to space.

Orbital stations, lunar outposts, and asteroid mining colonies became the new frontlines. Not through open warfare — that would shatter the stations both sides depend on — but through espionage, sabotage, and covert operations in the corridors of each other's installations.

### 2.2 The DNA Program

**The Americans** — in this timeline the aggressors, the ones pushing boundaries that shouldn't be pushed — launched **Project CHIMERA**: a black-budget program to create enhanced operatives through forced DNA splicing. Kidnapped subjects, both American dissidents and captured foreign agents, were experimented on in orbital labs far from any oversight.

Most subjects died. Some went insane. A few survived with unstable hybrid DNA — able to shift between human and animal forms, but at a cost to their humanity.

### 2.3 The Player — Codename "KOSCHEI"

**Agent Koschei** (real name classified) is a Soviet operative who was captured during a failed reconnaissance mission on the American station **Eagle's Nest**. Instead of execution, Koschei was handed to Project CHIMERA as a test subject.

The experiment worked — too well. Koschei gained the ability to transform into a cat: small, silent, nearly invisible. The Americans planned to break Koschei's will and turn them into a controllable asset.

They failed.

Koschei escaped the holding cells during a power fluctuation — barefoot, wearing nothing but a torn prisoner jumpsuit. No weapons, no gear, no comms. Just the CHIMERA mutation coursing through unstable DNA.

**Progression arc:**
1. **Phase 1 — Prisoner.** Koschei starts as a plain communist prisoner. Jumpsuit, no equipment. Must rely entirely on cat form to evade. Cannot interact with secured terminals (need keycard).
2. **Phase 2 — Armed.** Koschei ambushes an isolated guard (scripted stealth takedown in cat form — pounce from above/behind). Takes the guard's **keycard**, **tactical vest**, and **helmet**. Visual upgrade: sprite changes to armored look. Can now access secured terminals and doors.
3. **Phase 3 — Escape.** With CHIMERA data downloaded, reach the docking bay and hijack a shuttle.

The "eliminate a guard" moment is a key story beat — the first room where the player can take down a guard. It is NOT a general combat mechanic. It is a one-time scripted event in a specific room. After this, stealth rules remain: detection = instant fail. Koschei does not gain the ability to fight guards in general.

### 2.4 The Antagonists — USA / Project CHIMERA

- **Eagle's Nest** is a massive orbital station disguised as a "civilian research platform." In reality, it is the hub of American black operations in orbit.
- **Security forces** are PMC contractors (private military) — not regular soldiers. Ruthless, well-equipped, expendable. They wear sleek tactical armor with US flag patches and corporate logos.
- **Dr. Elena Cross** (mentioned in intel logs, not a boss fight) — the lead CHIMERA scientist. Her research notes are scattered across terminals. They reveal increasing desperation and ethical collapse.
- The station AI, **ARGUS**, controls doors, cameras, and laser grids. It is not sentient but is highly efficient — the player is evading an automated security net as much as human guards.

### 2.5 Narrative Delivery

- **No cutscenes.** Story is told through:
  - Terminal text logs (accessed in human form via interact).
  - Environmental storytelling (holding cells with claw marks, failed experiment rooms, propaganda posters).
  - Brief HUD text at room entry ("Module 7 — Genetics Lab. Subject holding area.").
  - Room names that hint at what happened there.
- Tone: The Soviets are not saints either, but in this story, the player is the underdog fighting against a superpower's atrocities. Dark, dry humor in Koschei's situation — a spy who became a literal lab rat (cat).

### 2.6 Key Story Beats (Room Progression)

| Room/Module | Phase | Story Beat |
|-------------|-------|------------|
| Holding Cells | 1 (Prisoner) | Koschei's escape. Tutorial — movement + cat form only. Broken restraints, claw marks. |
| Genetics Lab | 1 (Prisoner) | Where the experiments happened. Failed subjects in tubes. Cat-only navigation. Terminal visible but inaccessible (no keycard). |
| Isolated Corridor | 1→2 (Takedown) | **Key moment.** One lone guard, back turned. Scripted cat-form pounce from a vent above. Koschei takes the guard's gear. Visual upgrade. Acquire keycard. |
| Security Wing | 2 (Armed) | Heavy guard presence. Now has keycard — can open locked doors. First real stealth puzzle with full capabilities. |
| Server Core | 2 (Armed) | The objective — download CHIMERA data from central terminal (human form + keycard). Guarded by rotating-cone guard + ARGUS lasers. |
| Ventilation Nexus | 2 (Armed) | Cat-form maze through ducts. Pit drops to space. Route to docking bay. |
| Docking Bay | 3 (Escape) | Final room. Reach the shuttle. Heaviest security. Multiple guards + sweeping lasers. Escape = victory. |

---

## 3. Core Gameplay Loop

```
Enter Room → Observe Hazards & Patrol Patterns → Plan Route →
Execute (switch forms as needed) → Reach Objective/Exit → Next Room
```

Each room is a self-contained stealth puzzle. The player must:
1. Study guard patrols, laser timings, and terrain.
2. Decide which form (human/cat) to use for each segment.
3. Execute the route with zero detection.
4. Reach the room exit or interact with the objective terminal.

Failure at any point (guard detection) resets the current room.

---

## 4. Player Forms & Transformation

### 4.1 Human Form

| Property         | Value                  |
|------------------|------------------------|
| Speed            | 1.0x (base)            |
| Jump Height      | 1.0x (base)            |
| Collision Box    | 32×64 px (tall, wide)  |
| Can Interact     | Yes (terminals, doors) |
| Can Climb Walls  | No                     |
| Stealth Level    | Low (guards detect at full cone range) |
| Can Crawl        | No                     |

- Required for interacting with objective terminals and keycards.
- Larger hitbox means cannot fit through vents or narrow gaps.

### 4.2 Cat Form

| Property         | Value                           |
|------------------|---------------------------------|
| Speed            | 1.6x                           |
| Jump Height      | 2.2x                           |
| Collision Box    | 24×16 px (small, low-profile)   |
| Can Interact     | No                              |
| Can Climb Walls  | Yes (tagged climbable surfaces) |
| Stealth Level    | High (guard detection range halved, can hide under furniture) |
| Can Crawl/Vent   | Yes (fits through vent shafts)  |

- Cannot operate terminals, pick up keycards, or open doors.
- Can climb designated wall surfaces (marked tiles).
- Guard vision cone range reduced by 50% against cat form.
- Can hide under tables/shelves (tagged hide zones) to become fully invisible.

### 4.3 Transformation Rules

- Transform is instant (no animation delay in prototype; add 0.3s morph anim later).
- Cooldown: 0.5s between transformations to prevent spam.
- Cannot transform while mid-climb or inside a vent (must exit first).
- If transforming to human inside a space too small for the human hitbox, transformation is blocked (play error feedback).
- Transformation has no sound/alert radius (stealth-safe).

---

## 5. Control Scheme

### 5.1 Keyboard

| Action             | Key              |
|--------------------|------------------|
| Move Left/Right    | A / D or ← / →  |
| Jump               | Space / W / ↑    |
| Transform          | Shift            |
| Interact (Human)   | E                |
| Climb (Cat, on wall) | Hold W / ↑ near wall |
| Crawl/Enter Vent (Cat) | S / ↓ at vent entrance |
| Pause              | Escape           |
| Restart Room       | R                |

### 5.2 Gamepad

| Action             | Button            |
|--------------------|-------------------|
| Move               | Left Stick / D-pad |
| Jump               | A (Xbox) / X (PS) |
| Transform          | Y (Xbox) / △ (PS) |
| Interact (Human)   | X (Xbox) / □ (PS) |
| Climb (Cat)        | Hold Up on stick near wall |
| Crawl/Vent (Cat)   | Down on stick at vent |
| Pause              | Start / Options   |
| Restart Room       | Select / Share    |

---

## 6. Room & Level Design

### 6.1 Room Structure

- Each room is a single screen or scrollable section (camera follows player if room exceeds viewport).
- Rooms are connected via doors (human) or vents (cat).
- Room data is stored as JSON tilemaps (Tiled-compatible).
- Tile size: 16×16 px, scaled 2x for rendering (32×32 visual).

### 6.2 Room Transition Logic

1. Player reaches an exit trigger zone (door or vent).
2. If door: player must be in human form. If vent: must be in cat form.
3. Fade-to-black transition (0.4s).
4. Unload current room scene, load next room scene from tilemap JSON.
5. Spawn player at the designated entry point of the new room.
6. Fade-in (0.4s).
7. Room state (guards, lasers) initializes fresh on each entry (no persistence needed in prototype).

### 6.3 Room Types (Mapped to Story Modules)

1. **Holding Cells** (Phase 1 — Prisoner) — Koschei's escape. Learn movement + cat transformation. No guards. Broken restraints, claw marks.
2. **Genetics Lab** (Phase 1 — Prisoner) — Cat-only stealth past one guard. Specimen tubes, flickering lights. Terminal visible but locked (no keycard yet).
3. **Isolated Corridor** (Phase 1→2 — Takedown) — Scripted ambush. One lone guard, back turned. Cat pounce from vent. **Gear acquired.** Sprite upgrade.
4. **Security Wing** (Phase 2 — Armed) — Full stealth puzzle. ARGUS laser grid + two patrolling PMCs. Keycard opens locked doors.
5. **Server Core** (Phase 2 — Armed) — Objective room. Download CHIMERA data from terminal (human form + keycard). Rotating-cone guard + laser grid.
6. **Ventilation Nexus** (Phase 2 — Armed) — Cat-only vent maze. Pit drops to space (instant death). Route to docking bay.
7. **Docking Bay** (Phase 3 — Escape) — Final room. Heaviest security. Multiple guards + sweeping lasers. Reach shuttle = victory.

---

## 7. Hazard Mechanics

### 7.1 Bottomless Pits / Shaft Drops

- Tile type: `pit` (no collision, kill zone below).
- On contact with kill zone trigger → instant room reset.
- Visual: dark gap in floor with parallax depth lines.
- Cat form can jump further, making some pit jumps cat-only.

### 7.2 Laser Traps (ARGUS Security Grid)

- **Horizontal lasers:** Fixed beams that toggle on/off on a timer cycle.
  - Pattern stored per-laser: `{ onDuration: ms, offDuration: ms, startDelay: ms }`.
  - Collision with active beam → instant room reset.
- **Vertical lasers:** Same logic, vertical orientation.
- **Sweeping lasers:** Rotate around a pivot point. Angle range and speed configurable.
- Cat form's smaller hitbox allows crawling under horizontal lasers that block human form.
- Lasers are always visible (bright red line + glow). Never invisible/unfair.

### 7.3 Guards (PMC Security Contractors)

#### Vision Cone (Line of Sight)

```
Guard facing right:

         /‾‾‾‾‾‾‾‾‾‾‾‾\
  [G]---<   VISION CONE   >--- range
         \____________/

  Cone angle: 90° (45° above + 45° below facing direction)
  Range: 200px (human detection) / 100px (cat detection)
```

- **Cone geometry:** 2D triangle/sector from guard position in facing direction.
- **Detection algorithm:**
  1. Check if player center is within cone angle and range.
  2. If yes, raycast from guard to player.
  3. If ray hits a wall/obstacle tile before reaching player → NOT detected (occluded).
  4. If ray reaches player unblocked → DETECTED → game over.
- **Cat form modifier:** Detection range halved. If cat is in a hide zone → fully invisible regardless of cone.

#### Patrol Behavior

- Guards follow waypoint paths defined per-room in tilemap data.
- Movement: constant speed between waypoints.
- At each waypoint: optional `waitDuration` (guard pauses and may rotate facing direction).
- Patrol loops infinitely.
- Guards do NOT chase (instant fail, no chase needed).

#### Guard State Machine

```
PATROL → (player in cone + LOS clear) → DETECTED → GAME_OVER
  ↑                                                    ↓
  └──────────── room reset ←──────────────────────────┘
```

No alert state, no searching. Detection = immediate fail. Clean and punishing.

---

## 8. Physics Parameters

| Parameter                  | Human   | Cat     |
|----------------------------|---------|---------|
| Gravity                    | 980     | 980     |
| Max Horizontal Speed       | 200     | 320     |
| Acceleration               | 1200    | 1800    |
| Deceleration (friction)    | 1500    | 1000    |
| Jump Velocity (initial)    | -400    | -550    |
| Max Fall Speed             | 600     | 600     |
| Wall Slide Speed (cat only)| —       | 60      |
| Wall Jump Velocity         | —       | (-350, -400) |
| Coyote Time                | 80ms    | 80ms    |
| Jump Buffer                | 100ms   | 100ms   |

Units: pixels/second (speed/accel), pixels/second² (gravity). Negative Y = up.

---

## 9. Camera

- Default: static per-room (room fits viewport).
- For rooms larger than viewport: smooth follow on player with deadzone (64px box).
- Clamp camera to room bounds (no showing outside the room).

---

## 10. Art Direction — Doom-Style Sprites

Inspired by the original Doom (1993): characters are **2D pixel-art sprites** with a chunky, pre-rendered aesthetic. The game itself remains 2D side-scrolling — the Doom influence is purely visual, not structural.

### 10.1 Sprite Style

- **Look & feel:** Low-res, high-contrast pixel art. Bold outlines, limited palette, slight "3D-rendered then downsampled" feel like Doom's monsters.
- **Sprite size:** Characters rendered at native low resolution (e.g., 32×64 for human, 24×16 for cat) and displayed at 2x scale. Pixels must be visible and crisp — no anti-aliasing or smoothing.
- **Animation:** Frame-by-frame sprite sheet animation (not skeletal). 3–6 frames per action. Snappy, not fluid — match Doom's choppy-but-readable animation cadence.
- **Facing directions:** Minimum 2 directions (left/right, mirror-flip for opposite). Optionally add front-facing idle for guards at waypoint pauses.

### 10.2 Character Sprites

#### Player — Human Form (Agent Koschei)

**Phase 1 — Prisoner sprite (`spy_human_prisoner.png`):**
- Torn orange/gray prisoner jumpsuit. Barefoot. Visible experiment scars and stitching on arms/neck. Gaunt, underfed.
- Face: hollow cheeks, buzz cut, defiant eyes. Looks like a regular person, not a soldier — a communist who got caught.
- No gear, no patches. Just a lab subject who broke free.
- Color palette: faded orange, grays, skin tone with scar highlights.

**Phase 2 — Armed sprite (`spy_human_armed.png`):**
- Stolen PMC tactical vest over prisoner jumpsuit. Guard helmet (visor up to show face). Keycard clipped to vest.
- Same scars visible but now partially covered by armor. Looks improvised — mismatched gear cobbled together from the takedown.
- Color palette: dark navy vest (stolen), orange jumpsuit underneath, blue-white helmet, keycard yellow accent.

Both phases share animations: idle (2 frames), run (4 frames), jump (1 up, 1 fall), transform-out (2 frames — body contorts and shrinks, Doom body-horror style).

#### Player — Cat Form
- Not a normal cat. Unnaturally sleek black cat with faint bioluminescent veins (1-2 bright pixel lines along the body) — a visible side effect of CHIMERA DNA splicing.
- Eyes: piercing yellow-green, slightly too large. Unsettling, not cute.
- Animations: idle (2 frames tail flick), run (4 frames), jump (1 frame leap), wall-cling (1 frame), crawl/vent (2 frames), transform-in (2 frames — expands from cat with a brief distortion frame).
- Color palette: pure blacks, dark blue-blacks, neon green vein accents, yellow-green eyes.

#### Guards (PMC Contractors)
- American private military. Bulky tactical armor with US flag patch and corporate logo ("AEGIS SEC" or similar). Helmet with glowing visor (blue-white).
- Doom-style menacing stance — exaggerated proportions (big shoulders, armored torso, heavy boots).
- Carry flashlight (visual only — cone is the gameplay element) and sidearm (holstered, never fired — detection is instant).
- Animations: idle (2 frames), patrol-walk (4 frames), "alert" pose for detection frame (1 frame — visor flashes red, arm reaches for radio, shown for a split second before game over).
- Color palette: dark navy, black armor plates, white/blue visor glow, US flag red-white-blue accent.
- Vision cone: semi-transparent green overlay, rendered as geometry (not part of the sprite).

### 10.3 Environment (Eagle's Nest Station)

- Tiles are flat pixel art (16×16 native, 2x scaled).
- Orbital station aesthetic: brushed metal floors, riveted steel walls, reinforced viewport windows showing stars/Earth, grated ventilation shafts, blinking control panels with American iconography.
- US propaganda posters on walls (pixel art: eagle logos, "FREEDOM THROUGH STRENGTH" slogans, CHIMERA project insignia).
- Holding cells: sterile white tiles, broken restraints, claw marks scratched into walls.
- Genetics lab: specimen tubes with dark silhouettes inside, flickering fluorescent lighting.
- Lasers: bright red beam lines with a pulsing glow — labeled "ARGUS SECURITY GRID" on nearby wall panels.
- Pits/shaft drops: open maintenance shafts leading to the void of space. Stars visible below.
- Terminals: CRT-style monitors with green text, CHIMERA logo on boot screen, "E" prompt floats above.

### 10.4 Sprite Production Pipeline

For prototype, sprites can be:
1. **AI-generated pixel art** (e.g., prompted with "Doom 1993 sprite style, side view, 32x64, dark spy character") then cleaned up.
2. **Hand-drawn in Aseprite/Piskel** following the style guide.
3. **Placeholder colored rectangles** with 1-2px detail (eyes, belt line) as minimum viable stand-in — but upgrade to proper sprites before playtesting.

Sprite sheets: horizontal strip layout, uniform frame size, PNG with transparency.
File location: `assets/sprites/` (e.g., `spy_human.png`, `spy_cat.png`, `guard.png`).

---

## 11. Audio (Prototype)

- Deferred to post-prototype. Silent prototype is acceptable.
- Plan for: ambient hum, footstep sounds (human louder, cat silent), laser buzz, detection alarm sting, Doom-style "ugh" on detection.

---

## 12. UI

- **HUD:** Current form indicator (top-left icon), room name/number.
- **Game Over screen:** "DETECTED!" text, fade to red, auto-restart after 1.5s or press R.
- **Pause menu:** Resume, Restart Room, Quit to Title.
- **Title screen:** Game name, "Press any key to start."

---

## 13. Technical Targets

- 60 FPS on modern browsers (Chrome, Firefox, Edge).
- Resolution: 960×540 logical, scaled to fit window.
- Sprite assets loaded via Phaser preload (PNG sprite sheets).
- Total prototype JS bundle target: < 500KB uncompressed (excluding sprite PNGs).
