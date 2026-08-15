# Design / Motion Status

### Status
DONE — owner-confirmed light + dark KAWASEMI design directions recorded

### Current goal
Apply the shared KAWASEMI design system consistently to CARDS, Tutorial, Navigation, Menu, LIVE, and DIVE while validating concrete screens rather than endlessly expanding abstract rules.

### Completed
- Design preference interrogation produced an owner-confirmed shared design direction.
- Light mode direction is recorded: white / off-white / light gray foundation, refined editorial typography, restrained kingfisher teal, large but subordinate photography, restrained radius and controls.
- Dark mode direction is now also recorded: deep charcoal / blue-black foundation, soft white typography, restrained kingfisher teal, subtle image gradients, one main article card, generous spacing, minimal chrome.
- Added core principle: `Less interface, more experience.`
- Added the removal rule: remove UI that does not earn its place, but never remove discoverability, accessibility, feedback, current location, or a clear way back.
- Ordinary product screens should not use a large KAWASEMI wordmark as persistent branding.
- Icon system is now explicitly thin-but-confident, familiar, monochrome, geometrically minimal, and consistent.
- Gesture-first CARDS remains: vertical READ, left NEXT, right SAVE, article-end LIKE; permanent NEXT/SAVE controls are not required if first-run discoverability is handled properly.
- Main modes remain CARDS / LIVE / DIVE; utilities remain outside the main mode navigation.
- Icon-only main navigation is allowed only as a prototype hypothesis, not a confirmed replacement for text labels. It must prove comprehension, current-location clarity, and accessibility first.
- Both themes share one information hierarchy, interaction grammar, source/uncertainty presentation, spacing logic, and motion language.

### Evidence
- Commit `b04c8ba028f66b44837a12ba1e4b9cc32a795d57` — Add refined KAWASEMI dark-mode direction.
- `docs/DESIGN_SYSTEM.md` is the current shared design-system source for both themes.
- Existing Editorial Dock prototype evidence remains commit `7144cdb7c4d9a41f6c20e924772a94d471b6f3c0`.

### Important decisions now usable by other workstreams
- Quiet / intellectual / precise / premium / trustworthy over futuristic / AI-looking / flashy.
- Information and typography are the visual protagonists.
- KAWASEMI supports both light and dark visual directions as the same product system.
- One restrained kingfisher teal is the principal brand/action accent.
- Color communicates state/action, not truth.
- Large app-name branding should not occupy ordinary content screens.
- Use familiar conventional symbols before inventing custom icons.
- Minimalism must never create confusion.
- CARDS / LIVE / DIVE share a language but keep different experience structures.

### Known issues / limitations
- Production screens have not yet all been migrated to the new shared light/dark design system.
- Current production tutorial still needs redesign.
- LIVE / DIVE prototypes must be visually reviewed against the shared system before production integration.
- Final serif/sans family selection still needs real-screen validation for Japanese legibility and product feel.
- Exact icon-only vs text-label behavior for the main Dock is intentionally not finalized yet; it should be tested in a touchable prototype rather than decided by minimalism alone.

### Product decisions needed
None before concrete screen prototypes. The next owner decisions should be visual/interaction judgments on real CARDS / Navigation / Tutorial screens rather than more abstract design-system discussion.

### Next action
Apply the shared light/dark Design System to concrete Tutorial + Navigation + Menu prototypes, then validate CARDS/LIVE/DIVE screens for comprehension, accessibility, information hierarchy, and unnecessary UI before production integration.
