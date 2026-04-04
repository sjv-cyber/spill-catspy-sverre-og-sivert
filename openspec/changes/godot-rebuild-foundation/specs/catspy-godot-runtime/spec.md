# Capability: CatSpy Godot runtime

## ADDED Requirements

### Requirement: Godot project bootstrap

The repository SHALL contain a Godot 4.2+ project under `godot/` with a pinned engine version note and a main scene that launches the game without Phaser.

#### Scenario: Developer opens project

- **WHEN** a developer opens `godot/project.godot` in Godot 4.2+ and runs the main scene
- **THEN** the game starts without errors and reaches either Title or gameplay.

### Requirement: Multi-room JSON loading

The runtime SHALL load `godot/data/rooms/manifest.json` and each listed room file, building collision from `layers.walls` and optional `extra_solid_tiles`.

#### Scenario: All manifest rooms parse

- **WHEN** the loader reads the manifest and each room path
- **THEN** every room builds walkable space and solids consistent with grid dimensions `width` × `height`.

### Requirement: Room transitions

The runtime SHALL spawn the player at `playerSpawn` or matching `entry_spawns[from_room_id]` and SHALL transition forward when the player overlaps the exit area (subject to boss lock rules when implemented).

#### Scenario: Exit to next room

- **WHEN** the player overlaps the forward exit `Area2D` and the exit is not locked
- **THEN** `Game` loads the next room from `next_room_id` with `from_room_id` set for entry spawn resolution.

### Requirement: Player human and cat forms

The player SHALL move, jump, and transform between human and cat with parameters aligned to prototype `config.js` (speed, jump, hitbox sizes).

#### Scenario: Transform toggles form

- **WHEN** the player presses the transform action
- **THEN** the form toggles and collision/visual updates without physics explosions.

### Requirement: Guard detection and game over

Guards SHALL patrol from JSON waypoints and SHALL detect the player via cone + line-of-sight through the wall grid; detection SHALL trigger game over when `supports_retreat` is false.

#### Scenario: Spotted in default room

- **WHEN** a guard’s vision cone and ray hit the player and the room does not use retreat rules
- **THEN** the game transitions to game over.

### Requirement: Title pause and game over flow

The game SHALL provide title, in-game pause, and game over scenes returning to title.

#### Scenario: Pause and resume

- **WHEN** the player presses pause
- **THEN** gameplay freezes and unpause resumes.

### Requirement: Contract documentation

`docs/contracts/godot-room-runtime.md` SHALL document JSON field mapping to Godot nodes.

#### Scenario: Agent implements a new field

- **WHEN** an agent reads the mapping doc
- **THEN** they can wire a new optional JSON field without reading Phaser sources.
