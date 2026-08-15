# Design / Motion Status

### Status
REVIEW — Day 2 concrete CARDS / Tutorial / Bottom Navigation / Menu prototype is ready; production integration is not started

### Current goal
Review real light/dark screens and interactions before handing approved choices to Build. `docs/DESIGN_SYSTEM.md` remains the visual source of truth; this phase is for concrete application, not more abstract rule expansion.

### Completed
- Created an isolated Day 2 interactive prototype at `demos/day2-shell/` so the owner can compare real screens rather than abstract design rules.
- Applied the same information hierarchy and interaction grammar to LIGHT and DARK. The themes change tone/contrast, not structure.
- CARDS normal screen is concrete and touchable:
  - one continuous article surface,
  - no persistent large KAWASEMI wordmark,
  - headline/content outrank UI,
  - source/time remain visible,
  - `CONFIRMED` / `UNKNOWN` are expressed by wording and structure rather than truth-colored badges,
  - native vertical READ,
  - real horizontal NEXT / SAVE,
  - article-end LIKE,
  - no persistent NEXT/SAVE arrows on the normal reading screen.
- Tutorial is concrete and uses the real CARDS surface rather than a fake instructional card:
  - READ: explicit instruction to scroll to the article end,
  - LIKE: explicit instruction to tap the real article-end heart,
  - NEXT: explicit `left swipe` operational copy,
  - SAVE: explicit `right swipe` operational copy,
  - neutral civic/culture teaching content instead of war/death-heavy first-use content,
  - Skip remains available.
- Bottom Navigation is concrete with CARDS / LIVE / DIVE only.
  - Current location is visible.
  - This prototype keeps a minimal icon + short text label for each mode.
  - Icon-only was **not** advanced as a candidate because first-use comprehension has not been demonstrated yet.
  - SAVED / LIKES / HISTORY / SETTINGS remain outside the main navigation.
- Hamburger Menu is concrete with Saved / Likes / History / Settings utilities and conventional minimal icons.
  - Menu can be closed through an explicit close control, backdrop, or Escape.
  - Opening/closing the menu preserves the CARDS reading position.
- Source Sheet open/close preserves the CARDS reading position in prototype QA.
- Full Opening and Micro Opening are available for comparison in the prototype controls.
  - Full Opening is reserved for first launch / identity moments.
  - Micro Opening is a brief mark-only return launch.
  - In-app CARDS / LIVE / DIVE switching does not replay an opening.
- Added reduced-motion handling, focus-visible treatment, `aria-current` for main navigation, labels for icon buttons, and keyboard left/right equivalents in the prototype.
- Added `tests/day2-design.mjs` and CI coverage for the concrete prototype without replacing the stabilized production CARDS gesture implementation.

### Decisions made in this pass
- **Keep:** `Less interface, more experience` as the governing removal test.
- **Keep:** no large KAWASEMI wordmark on normal product screens.
- **Keep:** CARDS / LIVE / DIVE as the only persistent main modes.
- **Keep for this prototype:** icon + short label Bottom Navigation.
- **Do not approve yet:** icon-only CARDS / LIVE / DIVE navigation. A cleaner appearance alone is not enough evidence of comprehension.
- **Keep:** hamburger menu utilities labeled; these are not frequent enough to justify discoverability risk from icon-only treatment.
- **Keep:** operational Tutorial copy. Avoid poetic phrases that hide the requested action.
- **Keep:** Tutorial interaction on the real production-shaped article surface, not a separate teaching UI metaphor.
- **Keep:** LIGHT and DARK as the same product system with one restrained kingfisher accent.

### Evidence
- Issue #9: `Day 2: redesign Tutorial + Editorial Dock + Menu shell`.
- PR #10: `Day 2: concrete CARDS, Tutorial, Navigation and Menu prototype`.
- Prototype: `demos/day2-shell/index.html`.
- Prototype review notes: `demos/day2-shell/README.md`.
- CI run `31890291958`: SUCCESS.
  - Syntax check: PASS.
  - Existing production Browser smoke: PASS.
  - Existing human-like mobile E2E: PASS.
  - Existing untouched regression: PASS.
  - Day 2 design prototype QA: PASS.
- CI screenshot artifact: `kingfisher-visual-checks`, artifact ID `9248386840`.
- Day 2 artifact screenshots include:
  - normal CARDS LIGHT,
  - normal CARDS DARK,
  - Tutorial READ,
  - Tutorial complete,
  - Hamburger Menu DARK.
- Design-side visual inspection was performed on the generated light/dark CARDS, Tutorial, and Menu states. This is **not** owner approval.

### QA — actually verified in automated Chromium mobile emulation
PASS:
- LIGHT and DARK switch without changing layout semantics,
- normal header does not contain persistent KAWASEMI wordmark,
- CARDS / LIVE / DIVE labels and current-location state,
- Tutorial starts on the real CARDS reader,
- Tutorial READ → LIKE → NEXT → SAVE mechanical journey,
- Tutorial NEXT changes to the next real article,
- Tutorial SAVE completes without replacing the interaction with a fake control,
- hamburger menu contains Saved / Likes / History / Settings,
- menu open/close preserves reading position,
- Source Sheet open/close preserves reading position,
- Full Opening and Micro Opening have distinct behavior,
- existing stabilized production CARDS test suites remain green on the prototype branch.

### Known issues / limitations
- This is an isolated design/prototype artifact, not production integration.
- LIVE and DIVE content inside this prototype are only navigation-context placeholders. Their full experience design remains owned by the LIVE TRACE and DIVE FOCUS MAP workstreams.
- Physical iPhone / Safari visual feel and one-handed ergonomics are NOT TESTED here; CI uses Chromium mobile emulation.
- Final serif/sans family selection still needs real-iPhone Japanese legibility/performance review.
- Gesture accessibility beyond keyboard equivalents still needs a production-level accessibility plan; this prototype does not declare gesture-only interaction fully solved for all assistive technologies.
- Icon-only Bottom Navigation remains intentionally unresolved until comprehension is tested rather than assumed.
- Owner visual/taste approval is still required before Build should copy these exact spacing, sizes, radius, and chrome decisions into production.

### Product decisions needed from owner review
Only concrete screen judgments now:
1. Does normal CARDS feel sufficiently quiet while still clearly usable in both LIGHT and DARK?
2. Is the Tutorial guide explicit enough without feeling too heavy over the article?
3. Does the icon + short-label Bottom Navigation feel appropriately minimal, or should a later comprehension test compare an icon-only variant?
4. Is the Hamburger Menu density / hierarchy right, or should utilities be even quieter?

No new abstract design-system decision is required before this review.

### Next action
Merge the isolated prototype/status once CI is green so Product HQ can read it from `main`, keep Issue #9 open for owner review, then hand only owner-approved screen choices to Build for production integration.
