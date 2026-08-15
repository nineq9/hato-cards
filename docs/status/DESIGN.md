# Design / Motion Status

### Status
DONE — owner-confirmed KAWASEMI Design System v1 recorded

### Current goal
Apply the owner-confirmed KAWASEMI design rules consistently to CARDS, Tutorial, Navigation, Menu, LIVE, and DIVE without inventing a different visual language per feature.

### Completed
- Design preference interrogation produced an owner-confirmed KAWASEMI design direction.
- Updated `docs/DESIGN_SYSTEM.md` from the earlier dark-first v0.1 grammar to owner-confirmed v1.
- Default visual foundation is now white / off-white / light gray with restrained black/charcoal and one strong kingfisher blue-green brand color.
- Typography is explicitly a primary design element; refined serif headlines are welcomed where appropriate, with readable sans-serif for UI/metadata.
- Large photography is allowed but must support, not replace, information hierarchy.
- Conventional symbols are preferred for common actions; avoid custom icons that reduce comprehension.
- Rounded corners remain allowed but restrained; avoid nested-card and pill-heavy UI.
- CARDS remains one-article focus with continuous cover → article reading and subtle horizontal affordance, not large swipe instructions.
- LIVE must not become a generic `LATEST NEWS` list.
- DIVE must not look like a neon AI graph / game skill tree.
- Explicit anti-patterns now include colorful category-button rows, blue-purple gradients, excessive rounded boxes/shadows, Dribbble-first UI, generic AI-SaaS styling, and screens carried only by attractive photography.

### Evidence
- Commit `fc373021e3e2e393026b0a5d1a9f6ca479093cbe` — Adopt owner-confirmed KAWASEMI design rules v1.
- `docs/DESIGN_SYSTEM.md` is the current shared design-system source.
- Existing Editorial Dock prototype evidence remains commit `7144cdb7c4d9a41f6c20e924772a94d471b6f3c0`.

### Important decisions now usable by other workstreams
- Quiet / intellectual / premium / trustworthy over futuristic / AI-looking / flashy.
- Information and typography are the visual protagonists.
- Default v1 foundation is light, not dark-first.
- One strong kingfisher teal is the principal accent.
- Color communicates state/action, not truth.
- CARDS / LIVE / DIVE share a language but keep different experience structures.
- Ordinary icons should be conventional and immediately understandable.
- Minimal does not mean sparse; enough journalistic information must remain visible.

### Known issues / limitations
- The design system is confirmed, but production screens have not yet all been migrated to it.
- Legacy dark-first assumptions may remain in existing prototypes/code and should be treated as implementation debt, not current direction.
- Final serif/sans family selection still needs concrete screen validation for Japanese legibility and product feel.
- Current production tutorial still needs redesign.
- LIVE / DIVE prototypes should be visually reviewed against v1 before production integration.

### Product decisions needed
None for the design-system direction itself. Future owner review should focus on concrete screens and typography choices rather than re-opening the whole design language.

### Next action
Apply Design System v1 to the Day 2 Tutorial + Navigation + Menu work, then review CARDS/LIVE/DIVE prototypes for visual compliance before integration.
