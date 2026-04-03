# Project Status

**Last updated:** 2026-04-03

## Current State: Playable Prototype (Beta)

The game boots, loads rooms from JSON, and is playable with:
- Player movement + human/cat transformation
- Guard patrol AI with vision cone detection (instant-fail)
- ARGUS security cameras
- Laser hazards (timed toggle)
- Room transitions via exit zones
- Terminal interaction overlay
- Procedural audio (cat SFX)
- Doom-style sprite art with chroma-key processing
- Title screen, game over screen, pause overlay
- Multi-room progression with manifest system

## What Works
- Room loading from JSON tilemaps
- Player physics (dual-form: human 64x96, cat 72x48)
- Guard entities with waypoint patrol + vision cone + LOS raycasting
- Security cameras with suppression support
- Laser hazards with on/off timing
- Detection system (guards + cameras, hide zones, cat range reduction)
- Sprite pipeline (chroma-key + crop at boot)
- VFX system (transform flash, terminal pulse, gate unlock)
- Progress store (room visited tracking, flags)
- Map overlay (M key)

## What's Missing / In Progress
- Story content (terminal logs, room entry text, ending)
- More rooms (currently early room set)
- Boss encounter mechanics
- Sound design beyond cat SFX
- Vent/crawl mechanics for cat form
- Wall climbing for cat form
- Gamepad support (mapped but untested)
