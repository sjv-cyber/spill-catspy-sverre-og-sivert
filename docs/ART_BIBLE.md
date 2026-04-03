# CatSpy — Art Bible & Production Pack

Dark retro sci-fi pixel art for a 2D room-based stealth/action game on a militarized orbital black-site station. Style anchor: existing assets (`player_human`, `player_cat`, `guard_pmc`, `prop_camera`, title screen, corridor/cell backgrounds) and `DESIGN.md` visual references.

---

## 1. Inferred Visual Rules

- **Readability:** Figures and hazards read first as silhouette; backgrounds keep contrast low against the play plane.
- **Resolution:** Side-view chunky pixel (human guideline ~32×64 per `DESIGN.md`).
- **Outline:** Dark, clear contours on characters and key interactables; not thin anime lines.
- **Shading:** Limited palette, dithering/banding acceptable; avoid smooth gradients; “used future” with rust and grime.
- **Accents:** **Red** = surveillance / alarm / classified; **toxic green** = bio / mutation / robot sensor; avoid full neon rainbow.
- **Backgrounds:** Corridor/cell: metal, grates, panels, cables — high detail in back layers, **low in the play zone** (quiet floor).
- **UI / title:** Blocky typography, CRT/LED feel, same limited grey + red/green as the world.

---

## 2. CatSpy Art Bible (Production)

### Silhouette rules

- Readable **head–shoulder mass** on humans; weapons and packs as extra “hooks” for facing direction.
- Cat: lower profile, **long back line**, tail readable for motion.
- Enemies: **unique head shapes** (helmet vs hood vs mutated skull) before adding surface detail.

### Sprite proportions

- **Human / guard / scientist:** ~1:2 height:width feel; head ~1/5 of height.
- **Cat:** ~1:1 to 1:1.2 width:height, lower center of mass.
- **Mutant:** 10–25% wider than human; heavy lower body.
- **Robot:** modular “box + limbs”; facing from a clear “front panel.”

### Outline

- **1px dark outline** on figures and interactable props; backgrounds **without** hard outlines except edges that must separate (door frames, large panels).

### Shading

- **2–3 tones per material** + highlight; dither where metal should feel rough.
- Avoid mirror-bright metal; highlights are **small, sharp patches**.

### Palette logic

- **Base:** cool grey, olive, brown-rust, black-blue shadow.
- **Red accent:** lights, HUD, locks, cameras, alarms — not main wall fill.
- **Green accent:** bio, fluid, mutant details, robot eye — limited area.
- **Skin:** desaturated; avoid “healthy” pink.

### Material rendering

- **Metal:** horizontal panel seams, small bolts, rust in **corners and lower third**.
- **Glass/plastic (tubes):** high-contrast edge + **one** inner highlight + weak green/cyan glow — not glassmorphism.
- **Fabric:** fewer highlights than metal; more flat tones.

### Background detail density

- **Back:** dense panels, pipes, small signs (readable as shapes, not readable text).
- **Mid:** fewer large forms; **doors, cabinets, big pipes**.
- **Fore (if used):** only **very** simple silhouettes or empty air above the play floor.

### Lighting

- **Top/side key** from “ceiling fixtures” — small warm or cool hotspots on metal.
- **Red/green** as point sources (lamp, screen, fluid) — not full scene tint.

### UI / title consistency

- Same outline and dither language as sprites; **large, hard** letters; minimal glow.
- Colour use: grey UI + red warning + green “system/bio.”

### Do / don’t

| Do | Don’t |
|----|--------|
| Strong silhouettes, limited palette | Neon cyberpunk, hologram aesthetic |
| Gritty, rust, cables | Clean “Apple sci-fi” |
| Subtle bio-horror (implant, fluid) | Cute / chibi / cartoon proportions |
| Readable interaction props | Microscopic wall UI without gameplay reason |
| 90s military sci-fi industrial | Copies of known IP creatures or weapons |

---

## 3. Prioritized Asset Backlog — First Playable Vertical Slice

Columns: **Asset | Gameplay purpose | Size | Animation | Priority | Style notes**

### Player assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Human idle/walk (prisoner) | Stealth navigation | Character | Idle 2–4f, walk 4–6f | **Critical** | Match `player_human`; thin jumpsuit |
| Human hurt/death | Feedback | Character | 2–4f each | Critical | Short, readable |
| Cat idle/walk | Vents / low profile | Smaller char | Idle 2f, walk 4f | Critical | Match `player_cat` silhouette |
| Transform FX (human↔cat) | Form change readability | Overlay ~32×64 | 6–12f | Critical | Red/green **sparingly**, not full screen |
| Armed human variant | Combat after gear | Character | +shoot | Useful | Same body, different top |

### Enemy assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Guard idle/walk/alert/shoot | Primary threat | Character | Idle 2f, walk 4–6f, alert 2–4f, shoot 2–4f | Critical | Anchor: `guard_pmc` |
| Guard hurt/death | Feedback | Character | 2–4f | Critical | |
| Elite guard | Harder encounter | Character | Same set | Useful | Thicker armor, different helmet |
| Security heavy | Mini-boss / room block | Large char | Slow walk, telegraphed attack | Later | |

### Scientist assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Scientist idle | Ambient / objective NPC | Character | Idle 2f | **Critical** | Lab coat, grimy |
| Scientist panic run | Alarm / escort beats | Character | Run 4–6f | Critical | Clear “fleeing” pose |
| Scientist hostile runner | Alarm trigger | Character | Run + point 2f | Useful | |

### Mutant assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Unstable mutant idle/walk | Dangerous NPC | Character | Idle 2–4f, walk 4f | **Critical** | Green accent, heavy silhouette |
| Mutant lunge / attack | Telegraphed threat | Character | 4–6f | Useful | Clear forward motion |
| Mutant hurt/death | Feedback | Character | 2–4f | Useful | |

### Robot assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Small hackable robot | Puzzle / cover | Small ~24×24–32×32 | Idle 2f, move 4f, hacked 2–4f | **Critical** | Green “eye,” industrial body |
| Wall turret / heavy camera | Zone hazard | Prop/large | Rotate/aim 2–4f, flash 2f | Critical | Red lens, rust |

### Environment tiles

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Floor tile set (grate + concrete) | Consistent floor | 16×16 or 32×32 | — | Critical | Low contrast center |
| Wall edge / corner set | Room building | Tile | — | Critical | Panel seams |
| Door frame modules | Door placement | Tile/modular | — | Useful | |

### Room props

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Metal crates / barriers | Cover | Medium prop | — | **Critical** | Simple silhouettes |
| Broken lab machinery | Story / blocking | Large prop | — | Useful | Chaotic but readable |
| Cable clusters / pipes | Vertical breakup | Decal/tile | — | Useful | |

### Security props

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Wall camera (`prop_camera` extension) | Line-of-sight | Small | Pan 2–4f, detect flash | Critical | Red lens |
| Alarm light strobe | Player stress | Small | 2–4f loop | **Critical** | Red core + weak spill only |
| Warning signage / panels | Readable hazard | Small | — | Useful | Symbols over text |

### UI assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Interaction prompt (E) | Interaction | UI | Subtle blink | Critical | Matches title typography |
| Alarm vignette / border | Tension | Fullscreen | 2–4f | Useful | Must not blind gameplay |
| Minimap icons | Orientation | Tiny | — | Later | |

### VFX assets

| Asset | Purpose | Size | Animation | Priority | Notes |
|-------|---------|------|-----------|----------|-------|
| Muzzle flash | Shot readability | Small | 1–3f | **Critical** | White/yellow core, short |
| Bullet spark on metal | Hit feedback | Small | 2–4f | Critical | Yellow/orange sparks |
| Blood / hit squib | Damage | Small | 2–3f | Useful | Dark red, limited |
| Terminal activate | Interaction confirm | Medium | 4–6f | Critical | Green CRT “pop” |
| Door unlock | Progress | Medium | 4–8f | Critical | Mechanical + small LED |
| Robot hack | Puzzle payoff | On robot | 4–8f | Critical | Green glitch lines, sparse |
| Camera detect | Player warning | On camera | 2–3f | Critical | Red core pulse |
| Boss lock / slow-mo cue | Arena | Fullscreen edge | 4–8f | Later | Desaturate + red stripe |

---

## 4. Twenty Concrete Art Briefs (Missing Assets)

1. **Scientist (researcher idle)** — Character — scripting, objective NPC — Observation Lab — tall silhouette (coat + underlayer), head clear — olive/grey coat, **no** strong red on body — fabric + rust on shoes — idle 2–4f — grimy real lab, not pristine white coat.

2. **Scientist panic run** — Character — alarm escalation — Security Junction — forward lean, hands up, coat reads as **two parallel shapes** — same palette as idle — darker boots — run 4–6f — military panic, not comedy.

3. **Unstable prisoner-mutant** — Enemy — close threat — Holding Corridor / Containment — broad shoulders, **irregular back line** (implant/lump) — grey-olive skin, **toxic green** only eyes/wounds/tubing — wet skin + rusty metal implant — idle/walk 4f, lunge later — black-site test subject, not generic zombie.

4. **Small hackable robot** — Prop/character — hack puzzle — Utility Bay — low **box** + 3–4 visible legs/servos — bronze/steel, **one** green eye — bolted panel, small antenna — idle 2f, move 4f, hacked flicker — maintenance droid, not cute companion.

5. **Wall security turret** — Security — zone control — Security Junction — half-moon or box on pivot, **barrel** as clear “snout” — dark steel, red sight lamp — rust at mount — aim 2–4f, muzzle 1–2f — mounted PMC gear, not glossy sci-fi drone.

6. **Prison cell door (single)** — Environment — room boundary, lock — Cell — massive plate + **small vent** + yellow/black lock stripe as readable band — grey metal, yellow **only** on hazard — bulkhead seams — open 4–8f (slide) — prison, not luxury ship.

7. **Containment door (double)** — Environment — high-risk zone — Specimen Containment — **symmetric** two-leaf, thicker frame, **weak green** “bio” light strip — rust low, “sterile” panels upper (still dirty) — open with green blink sequence — lab security vs cell door.

8. **Interactable terminal** — Prop — hack / lore — all rooms — bulky CRT, angled keyboard silhouette — screen **red or green** glow by state — plastic/metal mix, stains — activate 4–6f — 90s classified workstation.

9. **Specimen tube (intact)** — Prop — cover + hazard — Observation Lab — cylinder with **thick frame**, green fluid **inside edge** — glass = one highlight stripe — weak inner glow — idle glow 2f loop — bio-horror **hint**, not splatter focus.

10. **Specimen tube (cracked)** — Prop — environmental story — Containment — same tube, **dark leak pool** silhouette on floor — sharp crack line — optional drip 2f — “something happened.”

11. **Metal crate stack** — Prop — cover — Utility Bay — **cube stack** with corner bolts — no bright decals — rust in corners — static — industrial shipping, not branded crates.

12. **Low cover barrier** — Prop — sightlines — Mini Boss Arena — long low box, **angled top** readable — battle-worn paint chips — static — arena feels like PMC training bay.

13. **Alarm strobe light** — Security — tension — Security Junction — small dome, **red core** + dark base — 2–4f pulse — hard edge, no soft glow blob — retro industrial alarm.

14. **Transform FX (human→cat)** — VFX — shapeshift — global — **vertical split** or scan lines + suit fragments — red **security sweep** 1 frame + green **bio** 1–2 frames (not whole effect) — 8–12f — secret agent + CHIMERA, not magic puff.

15. **Muzzle flash (rifle)** — VFX — shooting — combat — asymmetric **flame wedge** + one hot core — 1–2f — high intensity, small size — tactical, not oversized fantasy weapon.

16. **Bullet impact metal** — VFX — hit feedback — combat — 2–3 sparks + **white chip** — 2–4f — metal station identity.

17. **Utility Bay background** — BG — mood + readable floor — Utility Bay — **tall shelves**, tools as **vertical stripes**, yellow floor marking as gameplay-quiet line — olive/grey, **no** large saturated color fields — overhead sodium-ish spots — maintenance wing.

18. **Security room background** — BG — surveillance density — Security Junction — **monitor wall** as dark rectangles, **red** small dots — cable tray along ceiling — ARGUS identity.

19. **Containment room background** — BG — bio hazard — Specimen Containment — large **pipes** + tube row in mid-back — green glow **behind** glass, not on floor — lab, not clean hospital.

20. **Docking / transit bay background** — BG — arrival / escape — Transit — **horizontal repeating panels**, distant hangar opening as dark gradient — cold blue-grey rim lights — orbital dock, not airport terminal.

---

## 5. Sprite Sheet Plan — Characters

**Footprint (relative to current assets):** human/guard/scientist ~**32×64**; cat ~**28×32–32×40**; mutant +5–15% width; robot **24×32** or **32×32** module.

| Character | Silhouette target | Footprint | Required states | Optional | Reuse | Frames per anim (reasonable) | Simplify |
|-----------|-------------------|-----------|-----------------|----------|-------|------------------------------|----------|
| Player human | tactical, narrow | match `player_human` | idle, walk, hurt, death, transform (with FX) | crouch, climb | — | idle 2–4, walk 4–6, hurt 2, death 3–4 | Side + mirror only |
| Player cat | low, long | match `player_cat` | idle, walk, hurt?, death? | sneak stretch | shared transform FX | idle 2, walk 4 | Jump only if gameplay demands |
| Guard | helmet, rifle hook | match `guard_pmc` | idle, walk, alert, shoot, hurt, death | melee | Elite = palette + helmet overlay | walk 4–6, shoot 2–4 | Alert = 2-frame hold |
| Scientist | coat, narrow head | human height | idle, run (panic) | point, crouch | panic shared with “hostile runner” | run 4–6 | No weapon anims until designed |
| Unstable mutant | broad, uneven back | +10% width | idle, walk, attack (lunge), hurt, death | roar hold | — | walk 4, lunge 4–6 | Avoid 10-frame combos |
| Small robot | box + limbs | shorter than human | idle, patrol move, hacked/off | spark death | turret shares **red/green LED** logic | move 4 | Rotation = 2–3 stills + flip |

**Recommended frame budget (vertical slice):** ~**80–140** drawn frames total for all characters including hurt/death (excluding VFX), with **4–6f walk** as default.

**Minimum viable animation set (build first):**

1. Human: idle 2, walk 4, hurt 1–2, death 2–3  
2. Cat: idle 2, walk 4  
3. Guard: idle 2, walk 4, shoot 2, hurt 2, death 3  
4. Scientist: idle 2, run 4  
5. Mutant: idle 2, walk 4, lunge 4  
6. Robot: idle 2, move 4, hacked 2  

Transform: prefer **dedicated FX sheet** over 20+ character frames.

---

## 6. Background Pack — Six Rooms

### Holding Corridor

- **Purpose:** Linear tension, prison flow.
- **Dominant shapes:** Long horizontal, vertical door bays, ceiling cable.
- **Layers:** BG panels; MG doors/grates; FG empty or thin high pipes.
- **Colour:** Cold grey, rust brown lower third; **red** only on sensors.
- **Lights:** Even weak ceiling spots + **red** dot far away.
- **Key props:** Cell doors, floor warnings, camera in MG.
- **Storytelling:** Scratched metal, broken floor stripe.
- **Quiet for gameplay:** Floor center — flat tone, low detail.
- **Unique:** Repeating **cell rhythm** + one broken fixture.

### Observation Lab

- **Purpose:** “Being watched”; camera/puzzle setup.
- **Shapes:** Large horizontal windows/grate toward dark “other side.”
- **Layers:** BG dark glass/reflection; MG benches + monitors; FG minimal.
- **Colour:** Grey lab + **weak green** from equipment; red on monitor alarms.
- **Lights:** Cool panel lights + green underbench.
- **Key props:** Tubes (silhouette), chairs, terminal.
- **Storytelling:** Smudges on glass, loose papers as abstract squares.
- **Quiet:** Mid-floor in front of window.
- **Unique:** **Two-way glass** feel without readable faces.

### Security Junction

- **Purpose:** Hazard hub, many sightlines.
- **Shapes:** Crossing pipes, **monitor wall** as grid.
- **Layers:** BG grid; MG desk/console; FG must not block door openings.
- **Colour:** Darker overall; **red** dots on screens.
- **Lights:** Screen rim-light on desk, otherwise dim.
- **Key props:** Chair, keyboard blob, corner camera.
- **Storytelling:** Coffee stain, abstract “locked” iconography.
- **Quiet:** **Corridor floor** through the junction.
- **Unique:** Visible **cable tray** leading eye to exit.

### Utility Bay

- **Purpose:** Cover and vertical variety via props.
- **Shapes:** Shelves, crate stacks, workshop bulk (abstract).
- **Layers:** BG tool walls; MG shelves; FG low crates optional.
- **Colour:** Olive/grey; **yellow** floor line thin.
- **Lights:** Warmer single spot (not orange overload).
- **Key props:** Robot, pallets, hoses.
- **Storytelling:** Oil stains, “out of order” dented panel.
- **Quiet:** Central **floor lane** for patrols.
- **Unique:** **Vertical tool silhouettes** vs horizontal lab benches.

### Specimen Containment

- **Purpose:** Readable bio hazard; tubes as landmarks.
- **Shapes:** Large vertical cylinders, curved ceiling pipes.
- **Layers:** BG pipe net; MG tubes; weak floor reflection (one tone).
- **Colour:** Dark metal + **toxic green** behind glass; minimal red.
- **Lights:** Green inner glow, weak at floor edge only.
- **Key props:** Leaking pipe, shattered tube on one side.
- **Storytelling:** Scratch patterns on glass, abstract handprint.
- **Quiet:** **Clear path** between tubes — no mid clutter.
- **Unique:** **Symmetric tube row** vs corridor repetition.

### Mini Boss Arena

- **Purpose:** Clear arena boundary, telegraphed fight.
- **Shapes:** Wide back wall, side equipment alcoves.
- **Layers:** BG massive; MG cover; FG empty.
- **Colour:** Lower value contrast overall; **red** on lock/door accents.
- **Lights:** Stronger key from ceiling center (not blinding).
- **Key props:** Turret platform, barrier, alarm.
- **Storytelling:** Scrapes, impact marks, sealed bulkhead read.
- **Quiet:** **Central oval** with even floor.
- **Unique:** Tactical **cover island** mid + open flanks.

---

## 7. Asset Families (Consistency)

### Security

- **Identity:** PMC / ARGUS — threatening, functional.
- **Materials:** Armored plastic, steel, yellow hazard stripes.
- **Accents:** alarm **red.**
- **Shapes:** Camera domes, bulkheads, monitor grids.
- **Motifs:** Bolts, cable channels, abstract “LOCKED” panels.
- **Wear:** Scratches near handles and corners.
- **Lights/screens:** Small red LEDs, CRT with red text.
- **Interactables:** Terminal, door control, camera (hack).
- **8–12 assets:** Wall camera, turret, alarm light, monitor bank, security door, card reader, barricade, strobe bracket, cable tray, PMC crate, gun port, floor sensor tile, red phone box.

### Research

- **Identity:** CHIMERA lab — “too much science.”
- **Materials:** White-grey panels (dirty), glass, rubber floor.
- **Accents:** **Toxic green** bio, cyan on fluid sparingly.
- **Shapes:** Benches, pipe clamps, microscope silhouettes.
- **Motifs:** Cable coils, label squares.
- **Wear:** Chemical stains low on cabinets.
- **Lights:** Underbench green, cool fluorescents.
- **Interactables:** Terminal, sample drawer, abstract microwave lock.
- **Assets:** Lab bench, chair, sink, specimen tube, microscope, reagent rack silhouette, bio bin, glass shards decal, lab HVAC vent, intercom, clipboard, spill cabinet.

### Prison / Containment

- **Identity:** Black-site internment.
- **Materials:** Rough steel, concrete, rust.
- **Accents:** Yellow/black + a little red lock read.
- **Shapes:** Bars, thick doors, small windows.
- **Motifs:** Rivets, abstract chains, scratch marks.
- **Wear:** Rust always **bottom** of vertical surfaces.
- **Lights:** Hard, simple — often “failed.”
- **Interactables:** Cell door, vent (cat path), bed (non-interactive).
- **Assets:** Cell bed, toilet silhouette, sink, grating floor tile, wall shackles abstract, meal slot, intercom grill, security glass port, bench, corridor light cage, drip stain.

### Utility / Maintenance

- **Identity:** Work area, temporary.
- **Materials:** Oiled metal, rubber, cardboard boxes.
- **Accents:** Yellow floor stripe, orange caution sparse.
- **Shapes:** Shelves, crate, cart, hose loops.
- **Motifs:** Zip-tie blobs, duct tape patches.
- **Wear:** Everything — dirtiest family.
- **Lights:** Simple workshop, warm or neutral.
- **Interactables:** Robot, generator toggle, toolbox.
- **Assets:** Shelves, oil drum silhouette, hand truck, tool wall, hose reel, breaker panel, spill tray, cable spool, stepladder, extinguisher case, floor drain, wet floor sign.

### Docking / Transit

- **Identity:** Movement between sections.
- **Materials:** Rough plate, anti-slip pixel noise, large clamps.
- **Accents:** Cold blue-grey highlights, **red** runway lights sparse.
- **Shapes:** Long horizons, dock clamp bulk.
- **Motifs:** Pylon repeats, low-contrast reflective striping.
- **Wear:** Subtle scoring upper (particle/wind).
- **Lights:** Strong but small sources along walls.
- **Interactables:** Airlock console, hangar control.
- **Assets:** Airlock wheel, docking clamp, transit bench, window shutter, pressure gauge panel, cargo strap, ceiling hoist, warning stripe decal, bulkhead label plate, floor tie-down ring, evacuation arrows.

### CHIMERA Bio-Lab

- **Identity:** Mutation / dangerous research — same station, different “smell.”
- **Materials:** Glass + steel + abstract organic smear on glass.
- **Accents:** **Toxic green**; avoid purple-neon overload.
- **Shapes:** Curved pipes, cylinders, tank bulk.
- **Motifs:** Simplified biohazard symbol, quarantine striping.
- **Wear:** Glass cracks, dried spill.
- **Lights:** Glow **inside** vessels, not whole room.
- **Interactables:** Tank vent, override valve, sample lock.
- **Assets:** Containment door, cracked tube, spill pool, autoclave silhouette, centrifuge, bio-lock keypad, quarantine light, specimen cart, decon ceiling shower, observation mirror panel, seal gasket ring, rupture tape.

---

## 8. Enemy Variants (Guard-Anchored)

| Variant | Role | Silhouette | Scale vs guard | Palette | Gear / body language | Animation | Rooms | CatSpy read |
|---------|------|------------|----------------|---------|----------------------|-----------|-------|-------------|
| Standard guard | Patrol baseline | Rifle, standard helmet | 1× | PMC grey + small red | Relaxed guard | walk/shoot | all | anchor |
| Elite guard | Tougher fight | **Thicker chest**, different helmet crest | 1×–1.05× | Darker grey, **less** red (pro) | Aggressive stance | + shield flash later | security, boss | “special section” |
| Security heavy | Area lock | **Wide square shoulders** | 1.15–1.3× | Matte black-olive | LMG silhouette, visor | slow walk, telegraph | arena, junction | orbital PMC, not anime mech |
| Panicked scientist | Ambient / escort | Soft coat, **high head** | 0.95× height feel | Pale skin, grey coat | Hands up | run | lab, corridor | human fear |
| Hostile / alarm scientist | Trigger alarm | Coat + **tablet** or lanyard | 1× | + **red** LED on chest | Pointing, running | run, point 2f | lab | loyal to program |
| Unstable prisoner-mutant | Melee threat | Uneven, **extra mass** one arm | 1.05–1.15× wide | Green accent | Shaved implant, chain remnants | lunge | holding, containment | black-site subject |
| Controlled CHIMERA operative | Mini-boss fodder | **Hybrid** still tactical | 1.1× | Green + military vest | Patchwork rust armor | short combo | bio-lab | weaponized mutant, not fantasy orc |
| Small hackable robot | Puzzle | Low box | 0.5–0.7× height | Bronze + green eye | Tool arm | patrol | utility | maintenance, not pet |
| Armed support / wall turret | Zone denial | **Mounted** base + gun snout | Wall-mounted | Rust + red sight | No legs | rotate aim | junction, arena | installed security |

---

## 9. VFX Plan

| VFX | Purpose | Colour | Frames | Intensity | Pixel readability | Avoid |
|-----|---------|--------|--------|-----------|-------------------|-------|
| Transform human↔cat | Clear shift | 1–2f red sweep + 2–3f green scan + neutral grey fragments | 8–12 | medium | Large **contoured** shapes | Full-screen flash |
| Muzzle flash | Shot direction | Hot white/yellow core | 1–3 | high, small | Asymmetric wedge along barrel | Bloom |
| Bullet impact metal | Hit type | Yellow/orange sparks + white chip | 2–4 | medium | Few large pixels | Spark rain |
| Blood / damage hit | Damage | Dark red + black shadow | 2–3 | low–medium | Short squib | Splatter covering sprite |
| Alarm light pulse | Tension | Red core, outer barely visible | 2–4 loop | medium | Hard circle on/off | Soft gradient glow |
| Camera detection flash | Player must react | Red lens + 1 white glint | 2–3 | high | Only on camera sprite | Whole room red |
| Terminal activation | OK feedback | Green 2–3px pop + 1 scanline | 4–6 | low | Localized to terminal | Whole UI blink |
| Door unlock | Progress | Green LED strip + 2px mechanical shift | 4–8 | medium | Horizontal motion clear | Particle spam |
| Robot hack | Puzzle payoff | Green **horizontal** glitch on robot | 4–8 | medium | Stay inside robot bbox | RGB split on scene |
| Mutant lunge / bio energy | Telegraph | Green edge on claws + 2px dark trail | 4–6 | medium | Forward pillar 3–5px | Large energy orb |
| Slow motion activation | Boss beat | Desaturate overlay + **thin red** 2px frame | 4–8 | low | Edge frame, center clear | Blur filters |
| Boss room lock trigger | Arena sealed | Red lights + bulkhead “seal” vertical lines in | 6–10 | medium–high | Geometric | Shake overload |

---

## 10. Production Task Order (Vertical Slice)

### A — Before rooms are playable

| Task | Why | Minimum | Better later | Dependencies |
|------|-----|---------|--------------|--------------|
| Floor + wall tile set | Collision + read | 4–8 tiles | Full autotile | — |
| Cell + containment door sprites | Room boundaries | Open/closed 2–4f | More states | tiles |
| Terminal + activate VFX | Objectives/puzzles | 1 state + flash | Multi-screen | — |
| Interaction prompt UI | Player knows E | Static icon | Animation | — |
| Validate existing corridor/cell BG | Mood baseline | Use current art | New room BGs | — |

### B — Before enemies feel readable

| Task | Why | Minimum | Better later | Dependencies |
|------|-----|---------|--------------|---------------|
| Guard walk + shoot + death | Core loop | 4f walk, 2f shoot | Alert, variants | — |
| Muzzle flash + metal impact | Combat read | 1–3f / 2–4f | Smoke, variants | guard shoot |
| Camera + detect flash | Stealth hazard | 2 states | Pan anim | — |
| Alarm strobe | Pressure | 2f loop | Audio sync | — |

### C — Before world mood is convincing

| Task | Why | Minimum | Better later | Dependencies |
|------|-----|---------|--------------|---------------|
| Scientist idle + panic run | Story beat | 2f + 4f | More poses | — |
| Specimen tube + spill pool | Lab identity | 2 variants | More breaks | containment BG |
| Crates + low cover | Navigation | 2 silhouettes | Damaged set | — |
| BG: observation, security, utility, containment, mini-boss, docking | Room identity | One pass each | Parallax/FG | tile set |
| Broken lab machine (one) | Grit | Static | Spark anim | — |

### D — Can wait (polish)

Elite/heavy guards, full docking polish, minimap, blood variants, boss lock VFX polish, slow-mo polish, full signage pack, prisoner outfit variant, complete prop families.

---

## 11. AI / Image-Generation Prompt Template

```text
Asset name: [NAME]
Gameplay role: [ROLE]
Scene/theme: [ROOM / CONTEXT]
CatSpy style: original dark retro sci-fi pixel art, militarized orbital black-site station, gritty industrial metal with rust and cables, bold dark outlines, strong readable silhouette, restrained cool grey/olive palette, alarm red only for security lights/LEDs/CRT alerts, toxic green only for bio fluid/mutation/robot sensor, subtle body-horror hints, chunky low-res pixels, heavy dithering not smooth gradients, 90s sci-fi action mood without copying any existing game IP
Palette: [specific]
Silhouette: [shape]
Materials: [metal/glass/rust/stained panels]
Output: single sprite OR background OR spritesheet row, side view, transparent PNG if sprite, [WxH] target, no text except abstract glyphs
Negative: cute, chibi, glossy sci-fi, neon cyberpunk city, holographic UI, smooth vector, lens flare bloom, recognizable copies of famous game designs, watermark, photorealistic
```

**Filled examples (short):**

- **Scientist:** Observation Lab, thin lab coat readable head, olive/grey, grime on hem, 32×64 side view.
- **Unstable mutant:** Holding Corridor, broad uneven shoulders, grey-olive skin green only eyes/wounds, rusty implants.
- **Hackable robot:** Utility Bay, low rectangle + three short legs, bronze steel one green eye, ~32×32.
- **Security turret:** Security Junction, wall box + short barrel, dark steel red sight lamp.
- **Prison door:** Cell, massive plate small vent yellow/black lock stripe.
- **Containment door:** Specimen, double leaf weak green stripe.
- **Terminal:** Bulky CRT red or green glow by state.
- **Specimen tube:** Thick glass green fluid inner glow.
- **Utility prop set:** Shelves crate hose oil stain silhouettes, props sheet.
- **Security prop set:** Monitor chunk alarm keypad barricade.
- **Docking prop set:** Airlock wheel clamp tie-down stripe decal.
- **Transform FX:** 8-frame 32×64 human vertical breaking to low cat, 1f red sweep + 2f green scan lines.

---

## 12. Operative Short Reference

**Mini art bible:** Dark orbital black-site in **chunky pixel**, **dark outlines**, **limited grey/olive/rust**, **red** only security/alarms, **toxic green** only bio/robot/mutant, **dither** not gradients, **busy back / quiet floor**, **subtle bio-horror**, **90s military sci-fi** without copying known IP — **readability over detail.**

**Slice priorities:** Scientist → mutant → robot → turret → doors + unlock VFX → terminals + activate → specimen tubes → crates/cover → alarm → transform + muzzle + impact VFX → next room backgrounds.

**Top 12 briefs:** Scientist idle, scientist panic, unstable mutant, hack robot, wall turret, prison door, containment door, terminal, specimen tube set, crate/barrier pack, alarm strobe, transform FX sheet.

---

*Document generated for CatSpy production. Update as assets land in `assets/sprites/` and `assets/backgrounds/`.*

## Appendix — runtime graybox ↔ art targets

Until final sprites exist, the game uses **CatSpy-tuned grayboxes** that follow the art bible palette:

| Stand-in | Implementation | When art lands |
|----------|----------------|----------------|
| Maintenance robot | `MaintenanceRobot.js` — olive body, **toxic green** sensor, bolt-read silhouette | Replace container with spritesheet; keep `id` / `hack()` / patrol API |
| Alarm strobes | `AlarmLight.js` — hard red pulse | Swap rectangle for dome sprite + same tween |
| Scientist | `Scientist.js` — coat / clipboard container | Swap for `scientist` texture; keep flee tile logic |
| Mutant / elite | `Guard.js` + `variant` on `guard_pmc` | Unique sprites per variant; keep patrol + cone fields |
| Transform / hack / gate / console | `CatSpyVfx.js` | Optional filmstrip overlays; keep one-shot duration ~same for game feel |
