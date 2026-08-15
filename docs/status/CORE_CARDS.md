# Core / CARDS Status

### Status
REWORKING

### Current goal
Finish Phase 0 so article reading, tutorial, navigation recovery, and READ/NEXT/SAVE/LIKE interactions are reliable on mobile.

### Completed
- Phase 0 article interaction foundation refactor has been committed to main.
- Article structure was moved toward a single continuous article card.
- Automated smoke coverage exists for several gesture/state cases.

### Evidence
- Commit `fb28c0f9ec1c3ba0aa3d34c970b57d1774866cb1` — Refactor Phase 0 article interaction foundation
- Commit `289ea83d61d3dec2483aaf4c24b5653fec1061c8` — Make Phase 0 smoke assertions non-visual
- Branch `phase0-interaction-refactor`

### Known issues / limitations
- Owner reports that a slightly diagonal vertical reading gesture can leave left-swipe NEXT unavailable/broken afterward.
- Current tutorial copy/experience is confusing and not acceptable as first-run KAWASEMI onboarding.
- Human-like visual QA is insufficient; current automated PASS results do not prove the experience feels correct.
- Production navigation still contains older language in places.

### Product decisions needed
None for the immediate stabilization pass. Fix confirmed regressions and align with existing UX rules first.

### Next action
Run a human-like mobile E2E audit with imperfect diagonal gestures, screenshots, tutorial flow, menu recovery, and repeated READ/NEXT/SAVE actions; reproduce the owner-visible failures; then fix and rerun QA.
