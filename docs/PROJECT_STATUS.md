# KAWASEMI Project Status

Last refreshed: 2026-08-15

This is the Product HQ status board. It summarizes GitHub-visible state. It is not a substitute for source code, QA evidence, or the detailed workstream files.

## Overall

KAWASEMI is in foundation stabilization plus parallel design/prototype exploration.

Production integration of LIVE and DIVE is intentionally blocked until the CARDS interaction foundation is reliable.

## Tracks

| Track | Status | Current reality | Next executable action |
|---|---|---|---|
| Core / CARDS | REWORKING | Phase 0 refactor exists, but human-visible gesture and tutorial issues remain | Run human-like E2E audit, reproduce diagonal-scroll/NEXT failure, fix and re-run QA |
| Design System | RUNNING | Visual direction exists but is not yet a formal shared design system | Define shared typography, spacing, surfaces, motion, navigation and epistemic-state grammar |
| Navigation / Tutorial | REWORKING | Editorial Dock prototype exists; current production tutorial/copy is not acceptable | Refine Editorial Dock and redesign tutorial around real KAWASEMI interaction |
| LIVE | RUNNING | LIVE TRACE direction and demo work exist; production integration not approved | Make owner-reviewable browser demo and record findings |
| DIVE | RUNNING | FOCUS MAP direction and DIVE demo branch exist; Drag-to-DIVE is under prototype exploration | Produce owner-reviewable demo including article-to-DIVE entry and record findings |
| AI / Data | BLOCKED | Architecture can be explored, but production pipeline depends on stable product contracts | Wait for core UX/data contracts before production integration |

## Confirmed product direction

- Main modes: CARDS / LIVE / DIVE
- SAVED / LIKES / HISTORY / SETTINGS are utility areas, not main modes
- CARDS: vertical READ, right-to-left NEXT, left-to-right SAVE, article-end LIKE
- The card itself is the article
- LIVE: observation of incoming information, not another recommendation feed
- DIVE: user-directed exploration, not an AI recommendation tunnel
- AI must not silently collapse disputed claims into one authoritative truth

## Known owner-visible problems to reproduce

- Tutorial copy is abstract, confusing, and not sufficiently connected to KAWASEMI's purpose
- Tutorial content tone is too heavy for first-run onboarding
- Current production navigation still exposes old FOR YOU / HOT language in places
- Slight horizontal drift during vertical reading can leave NEXT behavior broken or unavailable
- A demo is not acceptable if the owner only receives a GitHub code listing instead of a directly touchable browser preview

## PM rule

Important specialist results must be persisted to GitHub according to `docs/WORKSTREAM_HANDOFF_PROTOCOL.md` so Product HQ can continue without asking the owner to relay long thread outputs.
