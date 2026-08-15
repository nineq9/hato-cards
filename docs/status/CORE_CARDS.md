# Core / CARDS Status

### Status
RUNNING

### Current goal
Execute Issue #4 (`Day 1: stabilize CARDS with human-like mobile E2E QA`) and remove reproducible critical gesture failures before adding more production scope.

### Completed
- Phase 0 article interaction foundation refactor is on main.
- ARTICLE CARD uses the production reading surface for tutorial and normal reading.
- Shared READ / NEXT / SAVE gesture path exists.
- Issue #4 scope, sprint contract, PRODUCT_PRINCIPLES.md, UX_RULES.md, QA_CHECKLIST.md, and development process were re-read before this pass.
- Added `tests/mobile-e2e.mjs` with imperfect diagonal READ, top/middle/end NEXT and SAVE, mixed gestures, menu recovery, tutorial journey, and screenshot capture.
- Reproduced the owner-visible diagonal READ failure with touch input in CI.
- Reproduced menu subview edge-return failure with touch input in CI.
- Applied a shared gesture-direction fix and reader gesture-lifecycle cleanup in `kingfisher.js`.
- Added explicit `touch-action: pan-y` to `.drawer-body` so horizontal edge-return can coexist with vertical drawer scrolling.

### Evidence
- Issue #4: https://github.com/nineq9/hato-cards/issues/4
- PR #8: https://github.com/nineq9/hato-cards/pull/8
- Working branch: `issue-4-cards-human-e2e`
- Baseline main at start of this pass: `2d4483e3b72d3e9c379d1cf36215720919dd69d6`
- Reproduction CI run: `31888013108`
  - CRITICAL: imperfect vertical READ was captured as horizontal instead of scrolling.
  - HIGH: Settings edge return failed.
  - Additional regression signal: RU language switch assertion failed and remains under investigation.
- Product fix commit on branch: `5d3f0a7a3c4f0b102caf5d74138cec4cc8c5ed16`
  - `kingfisher.js`: `decideAxis()`, `bindReaderGesture()` lifecycle cleanup.
  - `kingfisher.css`: `.drawer-body` touch-action policy.

### Known issues / limitations
- Fixes above are implemented but the post-fix human-like E2E run is still pending at the time of this status update. Do not treat them as PASS yet.
- RU language-switch regression from `tests/untouched-regression.mjs` is not yet classified as product bug vs test issue.
- Tutorial mechanical journey must still pass the post-fix E2E and screenshots need to be retained as artifacts.
- Tutorial qualitative clarity remains owner-reported as confusing; mechanical PASS alone will not prove the copy is acceptable.
- Production navigation still shows legacy `FOR YOU / HOT / DIVE` wording; this is outside the critical gesture fix and remains visible debt.
- Real iPhone/Safari behavior is NOT TESTED in this workstream environment unless separately stated.

### Product decisions needed
None for the immediate Issue #4 stabilization pass. Fix confirmed regressions and align with existing UX rules first.

### Next action
Run PR CI against the post-fix branch head; inspect all smoke / human-like mobile E2E / untouched-regression results; fix any remaining confirmed regressions; retain screenshot artifacts; then persist the final PASS / FAIL / NOT TESTED matrix here and on Issue #4.
