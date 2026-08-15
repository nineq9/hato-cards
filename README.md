# KAWASEMI / KINGFISHER

KAWASEMI is an AI-assisted information monitoring and knowledge exploration product.

Its purpose is not merely to show news. It is designed to help a user:

1. catch up on information they need to review without missing important items,
2. inspect source material and conflicting claims,
3. understand context without letting AI silently decide what to believe,
4. explore a topic more deeply and sideways through DIVE,
5. finish required monitoring instead of being trapped in an endless feed.

The current prototype is implemented as a web app / PWA in this repository.

## Project docs

Start here:

- [Project Status](docs/PROJECT_STATUS.md)
- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Feature Map](docs/FEATURE_MAP.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision Log](docs/DECISION_LOG.md)
- [Product Development Process](docs/PRODUCT_DEVELOPMENT_PROCESS.md)
- [Workstream Handoff Protocol](docs/WORKSTREAM_HANDOFF_PROTOCOL.md)

Permanent product / UX rules:

- [Product Principles](PRODUCT_PRINCIPLES.md)
- [UX Rules](UX_RULES.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [UI/UX Baseline](docs/UI_UX_BASELINE.md)
- [QA Checklist](QA_CHECKLIST.md)

## Current interaction contract

- vertical scroll = READ
- right-to-left swipe = NEXT
- left-to-right swipe = SAVE
- heart at article end = LIKE

The card itself is the article. Reading must not require navigating to a separate detail page.

## Core product modes

### CARDS
Finite review queue for information the user should check. The user can reach a meaningful caught-up state.

### LIVE
Observation layer for incoming information. Raw or lightly organized information remains inspectable instead of disappearing behind AI selection.

### DIVE
User-directed exploration of evidence, claims, background, history, technology, economics, politics, and other connected knowledge. DIVE must not become an opaque AI recommendation chain.

### SAVED
Articles or information deliberately kept by the user for later use.

## Development rule

Before changing core UX or information-selection behavior, read:

1. `PRODUCT_PRINCIPLES.md`
2. `UX_RULES.md`
3. `docs/DESIGN_SYSTEM.md`
4. `docs/UI_UX_BASELINE.md`
5. `QA_CHECKLIST.md`
6. `docs/PRODUCT_DEVELOPMENT_PROCESS.md`
7. `docs/WORKSTREAM_HANDOFF_PROTOCOL.md`

After changes, run the relevant QA checklist sections and report PASS / FAIL / NOT TESTED accurately.

Important specialist results must be persisted to GitHub so Product HQ can reconstruct project state without requiring the product owner to relay long chat outputs manually.
