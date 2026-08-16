# Core / CARDS Status

### Status
READY FOR OWNER DEVICE REVIEW — PR #11 has been synchronized with current `main` and the automated CARDS merge gate has passed repeatedly. **Physical iPhone/Safari feel and Product Owner subjective approval remain NOT TESTED / NOT APPROVED.**

### Canonical contract
- vertical = READ
- right-to-left = NEXT
- left-to-right = SAVE
- article-end heart = LIKE

This pass changes gesture recognition quality only. The product contract is unchanged and one shared recognizer remains responsible for READ / NEXT / SAVE.

### Why this work was reopened
The Product Owner found that ordinary reading motion still fought NEXT/SAVE. Per `docs/UI_UX_BASELINE.md`, that owner-visible failure overrides an earlier green automated run.

The replaced behavior was too eager for a text-first surface: recognition began around 10px, ambiguous diagonals could be forced to an axis around 28px, commit was fixed around 70px, and velocity commit was around 0.42 px/ms.

### Gesture design now
`kingfisher.js` centralizes gesture parameters in `GESTURE_DEFAULTS` / `GESTURE`.

- initial neutral zone before intent recognition
- explicit READ-biased vertical activation
- horizontal activation requires distance + stronger horizontal dominance
- ambiguous diagonal motion is not forced horizontal by distance alone
- browser-native `pan-y` remains the normal READ path
- manual `scrollTop` fallback is restricted to the demonstrated initially-horizontal-then-clear-READ arbitration edge case
- no horizontal panel motion before horizontal intent is established
- dead-zone offset is recovered progressively after horizontal activation to avoid a visual jump
- commit distance scales with reader/card width
- flick requires displacement + dominance + velocity
- release motion considers remaining travel and release velocity

### Parameter profiles compared
All profiles use the same human-like trajectories.

#### A — RESPONSIVE
- neutral 14px
- horizontal activation 18px
- horizontal dominance 1.60×
- commit ratio 0.22; min 82px; max 106px
- flick min 38px; velocity 0.60 px/ms; dominance 1.25×
- READ fallback 36px

Measured: READ 10/10, jitter 0px, activation 20px, first transform 3.4392px, slow SAVE 88px, fast SAVE flick 40px.

Assessment: responsive but intentionally more eager than desired for the Owner-reported problem.

#### B — BALANCED — selected production candidate
- neutral 16px
- vertical activation 16px
- vertical dominance 1.06×
- horizontal activation 22px
- horizontal dominance 1.70×
- read-bias distance 30px; floor 0.78
- commit ratio 0.24; min 88px; max 112px
- flick min 46px; velocity 0.68 px/ms; dominance 1.35×
- finger-follow recovery 28px
- READ fallback 40px

Measured: READ 10/10 including the Owner early-horizontal reproduction, jitter 0px, activation 24px, first transform 3.51662px, slow SAVE 100px on the 390px-class viewport, fast SAVE flick 46px.

Reason selected: B protects every tested READ trajectory while intentional horizontal input remains responsive. A is more eager than needed; C becomes too conservative.

#### C — CONSERVATIVE
- neutral 18px
- horizontal activation 26px
- horizontal dominance 1.85×
- commit ratio 0.25; min 92px; max 118px
- flick min 50px; velocity 0.75 px/ms; dominance 1.45×
- READ fallback 44px

Measured: READ 9/10, jitter 0px, activation 28px, first transform 3.57526px, slow SAVE 100px, fast SAVE flick 52px. The Owner early-horizontal READ reproduction did not begin scrolling, so C is rejected.

### Latest-main conflict resolution
Final synchronization target for this status: `main` `4cbea4de0d0852052681f105762c446707fdec4d`.

PR #11 diverged while LIVE / DIVE / AI-Data / UI and visual-QA work continued on `main`. Resolution policy:
- current `main` tree is always the base,
- all parallel-workstream files come from current `main`,
- only intended CARDS gesture changes are carried forward,
- `smoke.yml` combines gesture QA with the current AI/Data and LIVE gates,
- temporary gesture diagnostic workflow/test files are excluded from the final PR diff.

The final intended PR diff is limited to:
- `kingfisher.js`
- `sw.js`
- `tests/gesture-tuning.mjs`
- `.github/workflows/smoke.yml`
- `docs/status/CORE_CARDS.md`

The newest main additions through this sync are isolated DIVE demo/prototype work plus DIVE status documentation; they do not replace or modify the CARDS gesture files above.

### Automated QA evidence
Latest complete code-bearing run before the final DIVE-status-only sync: KINGFISHER smoke `31917634954` on head `aca12038c7ae837aa5e04e383871593eb0f6788b`: **PASS**.

- Syntax check: PASS
- AI/Data contract fixture including current JMA adapter work: PASS
- Gesture profile comparison: PASS — selected B_BALANCED
- Browser smoke: PASS
- Human-like mobile E2E: PASS
- Untouched feature regression: PASS
- LIVE TRACE demo E2E: PASS
- LIVE TRACE visual consistency matrix: PASS

Selected-profile human-like coverage includes:
- near-vertical / slow / fast / up / down READ
- initial left/right wobble into READ
- Owner early-horizontal READ reproduction
- 20–35° read-like diagonals
- mid-READ horizontal wobble
- no horizontal READ jitter
- slow deliberate NEXT/SAVE
- fast NEXT/SAVE flick
- too-short horizontal cancel
- ambiguous diagonal does not commit horizontal
- clearly horizontal diagonal can commit
- SAVE top/middle/end preserves article and reading position
- NEXT top/middle/end resets next article to scrollTop 0
- READ → NEXT → READ → SAVE → READ → NEXT
- no stale transform/state after release
- edge-menu vs non-edge SAVE regression through existing mobile/untouched suites

Artifacts from that full run:
- `kingfisher-gesture-tuning-evidence` — artifact ID `9255438696`
- `kingfisher-visual-checks` — artifact ID `9255438482`

The final synchronized branch HEAD must also show the required GitHub checks green before merge. Exact synchronized-head run IDs are recorded on PR #11 once complete.

### Service worker
`sw.js` cache is bumped to `kingfisher-v18` so the tuned recognizer is not masked by an older cached `kingfisher.js`.

### Known issues / NOT TESTED
- **NOT TESTED — physical iPhone / Safari.** Chromium mobile touch emulation is not a substitute for WebKit/device gesture arbitration.
- **NOT APPROVED — subjective one-handed feel on a physical phone.** The Owner must still judge whether READ feels sufficiently insensitive and NEXT/SAVE sufficiently direct.
- Automated PASS means **safe to reach the merge decision**, not “production gesture fully approved.”

### Product decisions needed
None before Owner device review. Parameter tuning remains inside the approved READ / NEXT / SAVE / LIKE contract.

### GitHub evidence
- PR #11: https://github.com/nineq9/hato-cards/pull/11
- Issue #4: https://github.com/nineq9/hato-cards/issues/4
- Working branch: `cards-gesture-intent-tuning`

### Next action
Keep PR #11 unmerged until Product Owner performs the physical iPhone/Safari gesture check. If the Owner accepts the feel, merge without further product-spec changes. If the Owner still feels READ/NEXT/SAVE competition, reopen parameter tuning rather than treating CI as overriding the device finding.
