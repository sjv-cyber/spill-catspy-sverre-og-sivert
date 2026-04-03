# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for CatSpy.

**Canonical stack + agent workflow** (not duplicated as an ADR): **[AGENTS.md](../../AGENTS.md)** at repository root. ADRs record specific decisions; AGENTS is the day-to-day handbook.

## Index of records

| # | Title | File |
|---|--------|------|
| 001 | Initial tech stack (Phaser 3 + vanilla JS + static serving) | [001-initial-tech-stack.md](001-initial-tech-stack.md) |
| 002 | Godot 4 (2D) primary; desktop first; web deferred | [002-godot-desktop-primary-web-deferred.md](002-godot-desktop-primary-web-deferred.md) |

## Naming Convention

Files follow the pattern `NNN-<slug>.md` where:
- `NNN` is a zero-padded sequential number (001, 002, ...)
- `<slug>` is a lowercase kebab-case summary of the decision

## Valid Statuses

- **Accepted** — Currently active and followed
- **Deprecated** — No longer relevant but kept for historical context
- **Superseded** — Replaced by a newer ADR (link to replacement in body)

## Adding a New ADR

1. Check existing files for the next available number.
2. Create `NNN-<slug>.md` using the template below.
3. Prepend a journal entry in `docs/JOURNAL.md`.

## Template

```markdown
# NNN — Title

**Status:** Accepted
**Date:** YYYY-MM-DD

## Context
What prompted this decision?

## Decision
What was decided?

## Consequences
What are the trade-offs?
```
