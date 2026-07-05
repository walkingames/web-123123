---
name: tech-architecture
description: >
  Tech architecture principles and blueprint-style design tokens for system
  breakdowns, API design, SDK documentation, and architectural decision records.
  Inspired by the blueprint theme from garden-skills.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  domain: frontend
---

## Tech Architecture Mindset

Every architectural decision should be visualized like a **blueprint** — clear,
structured, and precise. This skill is for creating, documenting, and
communicating technical architecture decisions.

## Principles

- **One step, one concept** — each beat covers exactly one architectural idea.
  No stacking.
- **System boundaries first** — always clarify module boundaries, data flow,
  and interface contracts before implementation.
- **Visualize structure** — prefer diagrams, component trees, and data-flow
  annotations over paragraphs.
- **Prefer mono for code** — use monospace for all code, types, SDK calls,
  and API signatures.
- **Cyan as accent** — reserved for data flow, API calls, and technical
  highlights. One accent, one purpose.
- **Dashed rules** — use dashed borders/rules to indicate "work in progress"
  or "extensible" boundaries in architecture diagrams.

## Blueprint Design Tokens

When building architecture documentation or technical UI:

```
--shell:          #0a1628 (deep navy)
--surface:        #0f1d33 (drafting board)
--surface-2:      #162240 (raised panel)
--text:           #d6e4ff (blueprint white)
--text-2:         #8ba8cc (annotation)
--accent:         #22d3ee (cyan)
--rule:           #22d3ee / 2px dashed
--font-mono:      IBM Plex Mono, JetBrains Mono
--grid:           60px base grid
```

## Architecture Decision Records

When proposing architecture, structure as:

```
## Context
Why is this decision needed?

## Decision
What is being chosen?

## Consequences
What trade-offs come with this decision?

## Diagram
ASCII / Mermaid / component tree
```

## Recommended Patterns

- **API contracts first** — define interfaces before implementation
- **Data flow over file structure** — organize by data flow, not by file type
- **Minimal state surface** — every state variable is a liability
- **Explicit over magic** — no implicit dependencies or global state
- **Cosmetic refactors are separate PRs** — never mix style and logic changes
