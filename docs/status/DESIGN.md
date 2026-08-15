# Design / Motion Status

### Status
DONE — Day 1 shared design grammar defined

### Current goal
Use the shared KAWASEMI design system as the baseline for subsequent CARDS, LIVE, DIVE, Tutorial, Navigation, and Menu work without independently inventing visual rules per feature.

### Completed
- Reviewed GitHub Issue #5: `Day 1: define shared KAWASEMI design system`.
- Reviewed the Day 1 design-system requirements in `docs/SPRINT_5_DAY_V01.md`.
- Created `docs/DESIGN_SYSTEM.md` as the v0.1 shared visual/motion grammar.
- Defined typography hierarchy and a v0.1 system-font policy.
- Defined a 4px-based spacing scale and smartphone spacing/touch-target rules.
- Defined semantic color roles using the existing deep blue-green, warm off-white, teal, beige, and restrained warm accent direction.
- Explicitly defined that color must not encode truth; CONFIRMED / CLAIM / UNKNOWN remain understandable through wording and structure.
- Defined base / reading / raised / scrim surface roles and a line-first editorial separation policy.
- Defined restrained radius rules and limited pills to genuinely categorical compact objects.
- Defined geometric line iconography and non-mascot kingfisher usage.
- Defined text-first image treatment and editorial-integrity rules for imagery.
- Defined Source Sheet grammar that preserves reading/exploration context.
- Defined epistemic-state presentation for CONFIRMED / CLAIM / UNKNOWN / competing claims.
- Defined ordinary motion timing bands (120–320ms), easing, Observe → Commit → Settle grammar, and reduced-motion behavior.
- Formalized Editorial Dock grammar: text-only `CARDS / LIVE / DIVE`, persistent bottom placement, fine-line active state, no pill/icon/glow treatment, state preservation, and one-handed touch targets.
- Formalized `SAVED / LIKES / HISTORY / SETTINGS` as hamburger-menu utilities; SAVED may evolve toward Personal Archive.
- Defined shared design language across CARDS / LIVE / DIVE while preserving distinct mode characters: read / observe / explore.
- Recorded explicit anti-patterns: AI neon, game-like glow/HUD, glass-heavy SaaS styling, cute mascot bird, bouncy motion, excessive pills, generic news-app feed/tab styling, and color-coded truth scores.
- Separated routine v0.1 choices from owner-taste decisions that should be reviewed through touchable prototypes.

### Evidence
- Commit `38842cc542fbdf687bbc22d9540e8cbb4facb744` — Define shared KAWASEMI design system.
- `docs/DESIGN_SYSTEM.md` now contains the shared grammar required by Issue #5.
- Existing Editorial Dock prototype evidence remains: commit `7144cdb7c4d9a41f6c20e924772a94d471b6f3c0`.

### Important decisions now usable by other workstreams
- Quiet by default; sharp on action.
- Information is the protagonist; use typography/spacing before adding containers or color.
- Color is not truth.
- Main navigation grammar is Editorial Dock with only CARDS / LIVE / DIVE.
- Utilities stay inside the hamburger menu.
- CARDS / LIVE / DIVE share tokens, source/epistemic language, and motion grammar but must not share the same layout metaphor.
- Ordinary product motion should generally remain within 120–320ms and avoid spring/bounce behavior.
- Kingfisher remains geometric brand identity, not a character/mascot.

### Known issues / limitations
- This issue defines grammar; it does not redesign or polish every production screen.
- Production still contains legacy navigation language in places and must be migrated separately.
- Current tutorial implementation still needs Day 2 work to use real product interaction and the shared grammar.
- Existing LIVE / DIVE prototypes must be reviewed against the new shared system before integration.
- Final visual taste has not been validated on all target iPhone sizes.

### Owner-taste decisions still open
These are not blockers for implementation of the shared grammar:
- final branded typeface, if any,
- exact headline weight/tracking,
- exact card/sheet radius personality within the restrained policy,
- exact teal/warm-accent saturation,
- final kingfisher mark proportions/opening choreography,
- exact CARDS cover darkness/texture,
- exact Editorial Dock height/rule length/letter spacing after real-phone review.

### Product decisions needed now
None. Day 1 design-system work can be considered complete. Owner review is best requested later against concrete touchable screens, not abstract tokens.

### Next action
Day 2 design work: apply `docs/DESIGN_SYSTEM.md` to Tutorial + Navigation + Menu prototypes, remove legacy FOR YOU / HOT language from the relevant prototype/app-shell work, keep CARDS / LIVE / DIVE as Editorial Dock main modes, and keep SAVED / LIKES / HISTORY / SETTINGS as menu utilities.
