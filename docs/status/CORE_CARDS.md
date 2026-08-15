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
- Updated `decideAxis()` / `bindReaderGesture()` so an ambiguous horizontal lead can recover into vertical READ without poisoning the next gesture.
- Added `.drawer-body { touch-action: pan-y; }` and pointer capture for subview edge return.
- Removed `lostpointercapture` cleanup after it was shown to interfere with Tutorial NEXT.
- Human-like mobile E2E passed on CI run `31888626520`, including the previously failing diagonal READ → NEXT path, top/middle/end NEXT/SAVE, mixed gestures, menu recovery, tutorial, and screenshots.
- Screenshot artifact `kingfisher-visual-checks`, artifact ID `9247954765`, was uploaded from CI run `31888626520` with 7 images.
- Diagnosed RU language switch failure as event-delegation selector leakage: `closest('[data-theme]')` matched the ancestor `<html data-theme>`. Restricted theme/language selectors to their buttons.
- Diagnosed existing smoke SAVE failure after backdrop close as hit-testing against the still-animating closed drawer. Closed drawer is now immediately `pointer-events:none`.

### Evidence
- Issue #4: https://github.com/nineq9/hato-cards/issues/4
- PR #8: https://github.com/nineq9/hato-cards/pull/8
- Working branch: `issue-4-cards-human-e2e`
- Baseline main at start of this pass: `2d4483e3b72d3e9c379d1cf36215720919dd69d6`
- Reproduction CI run: `31888013108`
  - CRITICAL: imperfect vertical READ was captured as horizontal instead of scrolling.
  - HIGH: Settings edge return failed.
  - Additional regression: RU language switch assertion failed.
- First complete human-like post-fix run: `31888626520`
  - `tests/mobile-e2e.mjs`: PASS.
  - 7 screenshots retained in artifact `9247954765`.
  - Existing smoke still failed `non-edge SAVE` after backdrop-close race; fixed after this run.
  - Untouched regression still failed RU language switching; fixed after this run.
- Current final product-fix branch head before final QA: `e4c796fdb1dc212df4a111b58ff8079651defea1` plus this status commit.

### Known issues / limitations
- The final all-suite QA run after the last two regression fixes is pending. Do not mark READY/DONE until it passes or remaining failures are classified.
- Tutorial mechanical journey passed in human-like E2E. Tutorial qualitative clarity remains owner-reported as confusing; automated mechanics do not prove the copy/experience is subjectively clear.
- Production navigation still shows legacy `FOR YOU / HOT / DIVE` wording. This is visible debt but not part of the confirmed critical gesture fix in Issue #4.
- Real iPhone/Safari behavior is NOT TESTED in this workstream environment unless separately stated.

### Product decisions needed
None for the immediate Issue #4 stabilization pass. Confirmed regressions are being fixed against existing UX contracts only.

### Next action
Run all three PR QA suites against the final branch head, verify screenshots/artifacts, update PASS / FAIL / NOT TESTED here and on Issue #4, then merge only if no reproducible CRITICAL failure remains and the PR is conflict-free.
