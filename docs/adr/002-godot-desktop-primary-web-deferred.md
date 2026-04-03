# 002 — Godot 4 (2D) as primary target; desktop first; web export deferred

**Status:** Accepted  
**Date:** 2026-04-06

## Context

- The team wants **playable, rich experiences as fast as possible**, then heavy iteration. “Rich” should lean on **engine-provided visuals** (particles, lights, tweens, camera juice, UI, tile workflow) because **LLMs are stronger at text and code than at bespoke art**.
- **All production coding is AI-assisted** (e.g. Cursor agents). Favour **text-first artifacts** (scripts, `.tscn`, resources) over GUI-only workflows.
- **Web delivery is secondary**: browser was attractive for ease of hosting, but **Godot’s HTML5 export** is heavier and less frictionless than a small Phaser static build. **Porting to web later** is acceptable.
- **Backend** may live on **Railway** when saves, auth, or APIs are needed; not required for core single-player fun.
- Side tools (**Gemini** for image passes, **ChatGPT** for narrative) stay outside the engine; the **canonical game implementation** moves toward **Godot 4.x 2D**.

The existing **Phaser 3 + vanilla JS** codebase in this repository remains a **working prototype and design reference** until a Godot project is bootstrapped and content is ported or re-authored.

## Decision

1. **Primary game framework:** **Godot Engine 4.x**, **2D** mode, for new feature work and the long-term codebase.
2. **Primary export / play target:** **Desktop** (Windows / Linux / macOS) first. Tune for **60 FPS** and controller-friendly input where relevant.
3. **Web (HTML5):** **Deferred** to a later milestone. Plan occasional export smoke-tests so we do not rely on desktop-only APIs without abstraction.
4. **Phaser prototype (this repo):** **Maintain only as needed** (fixes, small experiments, contract reference). **Do not** treat Phaser as the long-term stack; new large systems should assume **Godot** unless explicitly scoped as prototype-only.
5. **Backend:** When persistence or online features are required, prefer **Railway-hosted** services with **clear HTTP/WS contracts** (typed handlers, OpenAPI-style docs) suitable for AI agents.
6. **Visual leverage:** Prefer **asset packs** (e.g. Kenney, licensed itch.io), **engine VFX**, and **occasional generated plates** (Gemini) over expecting fully model-generated sprite pipelines.

## Consequences

**Benefits**

- Faster path to **juice and readability** without a full art team.
- **Scenes and scripts on disk** align with autonomous coding agents and story-driven design notes (“wish → spec → files”).
- **Desktop-first** avoids web export constraints during core gameplay iteration.

**Trade-offs**

- **Migration cost:** Room JSON, loaders, and entities must be **reimplemented or imported** in Godot; `docs/contracts/room-runtime.md` stays the **design contract** until a Godot equivalent is documented.
- **Two stacks temporarily:** Agents must read **ADR 002 + STATUS** to know whether a task targets **prototype Phaser** or **new Godot** work.
- **Web players wait** until an explicit HTML5 polish pass.

## Supersedes (for target stack only)

For **what we build toward**, this decision supersedes the *platform and framework* implications of [001-initial-tech-stack.md](001-initial-tech-stack.md). ADR **001** remains the accurate record of the **current Phaser prototype** in this repo.

## See also

- [AGENTS.md](../../AGENTS.md) — stack table (target vs this repo)
- [docs/STATUS.md](../STATUS.md) — current state and migration note
