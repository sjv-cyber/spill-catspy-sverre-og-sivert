# 001 — Initial Tech Stack: Phaser 3 + Vanilla JS + Static Serving

**Status:** Accepted (prototype in repo; **target production stack** → [002-godot-desktop-primary-web-deferred.md](002-godot-desktop-primary-web-deferred.md))  
**Date:** 2026-04-03

## Context

CatSpy is a 2D stealth/platformer web game that must run natively in modern browsers at 60 FPS. The prototype must be fast to iterate on, AI-agent-friendly (no complex build chains), and playable by opening a single HTML file via any static server.

## Decision

- **Phaser 3** (v3.87) loaded via CDN for rendering, physics, input, and scene management.
- **Vanilla JavaScript** with ES modules (`<script type="module">`). No TypeScript, no JSX.
- **No build step**. No Vite, no Webpack, no npm install. Serve `index.html` directly.
- **No external services**. All data is local JSON files loaded via `fetch()`. No database, no backend, no API keys.
- **Sprites** are PNG files with magenta (#FF00FF) chroma-key, processed at boot time using Canvas API.
- **Audio** is procedural Web Audio API synthesis — no audio file assets.

## See also

- **[ADR 002](002-godot-desktop-primary-web-deferred.md)** — Godot 4 2D desktop-first; web later; Phaser here = prototype/reference until migration.
- **[AGENTS.md](../../AGENTS.md)** — full agent guidelines; distinguishes **target stack** vs **this repository**.

## Consequences

**Benefits:**
- Zero setup friction — any static file server works.
- AI agents can modify and test code without managing a build pipeline.
- No dependency vulnerabilities, no `node_modules`, no lock files.
- Phaser handles the hard parts (physics, input, scene lifecycle) while staying out of the way for custom game logic.

**Trade-offs:**
- No type checking (mitigated by JSDoc annotations where needed).
- No tree-shaking — full Phaser library loaded via CDN (~1.2MB).
- No hot module replacement — manual browser refresh for changes.
- CDN dependency for Phaser (could be vendored later if needed).
