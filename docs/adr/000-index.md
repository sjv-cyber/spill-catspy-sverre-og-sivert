# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for CatSpy.

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
