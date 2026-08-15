# Core / CARDS Status

### Status
READY — Issue #4 automated mobile stabilization complete; physical iPhone/Safari remains NOT TESTED

### Current goal
Keep the repaired CARDS gesture foundation stable while Day 2 Tutorial / Navigation / Menu work proceeds. Do not reintroduce separate or competing gesture handlers.

### Completed
- Re-read Issue #4, `PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, `QA_CHECKLIST.md`, and the Day 1 sprint contract before the stabilization pass.
- Added `tests/mobile-e2e.mjs` using touch events and imperfect human-like gesture paths rather than only ideal mouse swipes.
- Reproduced the owner-visible CRITICAL failure: a vertical READ beginning with slight horizontal drift could be claimed as horizontal, preventing normal scrolling and leaving the following NEXT unavailable.
- Reworked the shared direction decision / reader gesture lifecycle so an ambiguous early horizontal lead can recover into vertical READ without poisoning the next gesture.
- Added the narrow manual vertical-scroll fallback only for ambiguous-start READ gestures where the browser may already have declined native vertical panning.
- Verified NEXT and SAVE through the same production reader path at article top, middle, and end.
- Verified SAVE stays on the current article and preserves its scroll position.
- Verified NEXT opens the next article at scroll position 0.
- Added repeated mixed imperfect READ / short horizontal-cancel sequences and verified they do not leave stale gesture state.
- Added a full finite-queue journey: repeated NEXT across multiple articles reaches the caught-up `CLEAR` state without looping or leaking previous scroll positions.
- Reproduced and fixed menu subview edge-return failure. `.drawer-body` keeps vertical panning while explicit pointer capture supports left-edge horizontal return.
- Reproduced and fixed a related non-edge SAVE failure immediately after closing the menu: the visually closing drawer was still intercepting hit-testing; closed drawer now becomes non-interactive immediately.
- Reproduced and fixed a settings language regression caused by delegated selector leakage: `closest('[data-theme]')` could match the ancestor `<html data-theme>`. Theme/language delegation is now scoped to the actual buttons.
- Removed `lostpointercapture` cleanup after QA showed it could interfere with Tutorial NEXT.
- Corrected two QA-harness false positives discovered during the full pass:
  - Source Sheet test now records the reading position after Playwright has made the source control visible, matching the position at the actual tap instead of comparing against an artificial pre-actionability scroll position.
  - Settled reader-transform checking now uses a numeric tolerance below 0.5px; a 0.017px compositor interpolation remainder is not treated as a stale interaction state, while meaningful residual transforms still fail.
- PR #8 was squash-merged to `main` as commit `6dfa645c5a4b4b037dd1e4d2e78899ec01a3bdbc`.

### Final QA evidence
- Final all-suite CI run: `31889389182` — SUCCESS.
  - Syntax check: PASS.
  - Browser smoke (`tests/smoke.mjs`): PASS.
  - Human-like mobile E2E (`tests/mobile-e2e.mjs`): PASS.
  - Untouched feature regression (`tests/untouched-regression.mjs`): PASS.
- Final screenshot artifact: `kingfisher-visual-checks`, artifact ID `9248160545`.
- Final artifact contains 8 screenshots:
  - article top,
  - article end / LIKE,
  - diagonal READ → NEXT result,
  - menu Settings,
  - tutorial READ,
  - tutorial LIKE,
  - tutorial complete,
  - caught-up / CLEAR.
- Reproduction CI run: `31888013108` captured the original CRITICAL diagonal READ failure and menu edge-return failure before fixes.
- Intermediate CI run `31888626520` proved the human-like gesture fix, then exposed separate smoke/language regressions that were subsequently fixed.
- Final pre-expansion CI run `31889096410` passed all three suites after those fixes.
- PR: https://github.com/nineq9/hato-cards/pull/8
- Issue: https://github.com/nineq9/hato-cards/issues/4

### QA matrix — actually verified
PASS — Playwright Chromium, mobile touch emulation at 390×844 unless noted:
- imperfect mostly-vertical READ with early horizontal drift scrolls vertically and does not NEXT/SAVE,
- NEXT remains available immediately after that imperfect READ,
- repeated imperfect READ reaches the real article end,
- NEXT at top / middle / end,
- SAVE at top / middle / end,
- NEXT resets the next article to scrollTop 0,
- SAVE preserves current article and scroll position,
- repeated mixed gestures do not leave meaningful stale transform/state,
- repeated NEXT across the finite queue reaches `CLEAR`,
- menu edge-open and Settings / Saved / Likes edge-return,
- non-edge right swipe remains SAVE rather than menu navigation,
- Tutorial mechanically uses the real article: READ to end → LIKE → NEXT → SAVE,
- Source Sheet open/close preserves the reading position in browser regression coverage,
- theme/language menu interactions and menu reopen-at-root behavior,
- article/card containment and no horizontal page overflow at 375×667, 390×844, and 430×932 in smoke coverage.

### Known issues / limitations
- NOT TESTED — physical iPhone / Safari. The automated touch suite uses Chromium mobile emulation, so real WebKit gesture arbitration and device/browser-chrome behavior must not be reported as PASS from this work.
- NOT TESTED — subjective one-handed feel of thresholds/velocity on a physical phone. Mechanical touch paths pass; ergonomics still require real-device review.
- Tutorial mechanical interaction is PASS, but its qualitative clarity remains owner-reported as confusing. This is a Day 2 Tutorial design problem, not evidence that the mechanics failed.
- Production navigation still shows legacy `FOR YOU / HOT / DIVE` wording. This is known Day 2 Navigation debt and was intentionally not mixed into the Day 1 CARDS gesture repair.
- The caught-up state is mechanically reachable and screenshot-verified, but the current `CLEAR` presentation is visually minimal and can be polished later without changing queue semantics.

### Product decisions needed
None for the Issue #4 stabilization fixes. All changes above preserve the existing READ / NEXT / SAVE / LIKE contract.

### Next action
Proceed to Day 2 Tutorial / Navigation / Menu work on top of this stabilized shared gesture foundation. Before calling the CARDS foundation production-ready, run a short physical iPhone/Safari journey covering imperfect vertical READ, NEXT, SAVE, menu edge return, Source Sheet return, and repeated mixed gestures.
