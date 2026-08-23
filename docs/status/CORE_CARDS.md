# Core / CARDS Status

### Status
READY TO MERGE AFTER FINAL PR CHECK — PR #33 aligns the production CARDS / Menu implementation with the already-canonical Owner feedback contract. The latest code-bearing full smoke run `32352975547` passed every automated gate. **Physical iPhone / Safari feel after this change remains NOT TESTED.**

### Canonical contract
- vertical = READ
- right-to-left = NEXT + ADVANCE
- left-to-right = SAVE + ADVANCE
- article-end heart = LIKE
- successful SAVE dismisses the current card to the right and reveals the next article at `scrollTop = 0`
- no persistent UNDO control/state/handler on the normal article surface
- finite caught-up state uses exact text `CLEAR!`
- while Menu is open, a right-to-left swipe may close it from anywhere in the drawer; closed-state Menu open remains a narrow left-edge gesture so it does not compete with article SAVE

Canonical sources: `UX_RULES.md`, `QA_CHECKLIST.md`, and `docs/DECISION_LOG.md`.

### Implementation in PR #33
- replaced the old SAVE bounce-back path with shared dismiss-and-advance behavior
- SAVE remains idempotent for the saved set while still consuming the current card
- removed obsolete UNDO state, snapshot handler, toast handler, DOM control, and event binding
- changed caught-up rendering from `CLEAR` to `CLEAR!`
- added Menu right-to-left swipe-close from non-edge drawer positions while preserving left-edge subview back behavior
- updated tutorial, smoke, mobile E2E, gesture-tuning, and untouched regression expectations to the new SAVE + ADVANCE contract
- bumped the service-worker cache to `kingfisher-v19`

### Automated QA evidence
Latest complete code-bearing run: KINGFISHER smoke `32352975547` on PR #33 head `b68da1ae94060e06f925be4e77fa35d9c5ebae7c`: **PASS**.

- Syntax check: PASS
- AI/Data contract fixture: PASS
- be minimal mobile E2E: PASS
- Gesture profile comparison: PASS — selected B_BALANCED
- Browser smoke: PASS
- Human-like mobile E2E: PASS
- Untouched feature regression: PASS
- LIVE TRACE demo E2E: PASS
- LIVE TRACE visual consistency matrix: PASS

Current CARDS-specific regression coverage includes:
- READ remains vertical and protected from ambiguous diagonals
- deliberate NEXT advances and resets the new article to top
- deliberate SAVE persists the article, exits right, advances, and resets the new article to top
- SAVE works from article top / middle / end and from interactive source-card regions
- tutorial SAVE follows the same production SAVE + ADVANCE behavior
- no persistent UNDO DOM path remains
- finite queue reaches exact `CLEAR!`
- Menu subview edge-back remains intact
- Menu right-to-left close works from non-edge body and header-area positions
- closed-state edge Menu gesture and non-edge article SAVE remain separated
- repeated one-handed READ / NEXT / SAVE journeys leave no stale gesture transform/state

The first PR #33 run correctly exposed three stale-test issues: a reopened-drawer animation timing assumption in the two new Menu tests and the old SAVE/UNDO expectation in `untouched-regression.mjs`. Those tests were corrected and the full code-bearing rerun above is green.

### Known issues / NOT TESTED
- **NOT TESTED — physical iPhone / Safari after PR #33.** Chromium mobile touch emulation does not replace WebKit/device gesture arbitration.
- **NOT APPROVED — subjective one-handed feel after the Owner-requested behavior change.** Automated PASS verifies the specified behavior, not subjective feel.

### Product decisions needed
None. This work implements an already-recorded product decision; it does not introduce a new CARDS interaction model.

### GitHub evidence
- PR #33: https://github.com/nineq9/hato-cards/pull/33
- working branch: `cards-owner-feedback-2026-08-20`
- code-bearing PASS run: `32352975547`

### Next action
Let the final PR-head CI check pass after this status-only documentation update, then merge PR #33. After the merged build is available, perform the physical iPhone / Safari Owner re-test for READ / NEXT / SAVE and Menu swipe-close feel.
