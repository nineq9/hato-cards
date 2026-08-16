# KAWASEMI Demo Visual QA — 2026-08-16

Status: **AUDIT COMPLETE — DIVE remains visually BLOCKED**

This audit applies `docs/DEMO_QUALITY_GATE.md` to the current production KAWASEMI and the three active isolated demos.

Targets:
- production KAWASEMI
- `demos/day2-baseline`
- `demos/live-trace`
- `demos/dive-focus-map`

The production application was rendered and captured first and used as the visual baseline. Automated interaction success alone was not treated as visual PASS; generated screenshots were manually inspected.

## 1. Audit basis

Canonical gate:
- `docs/DEMO_QUALITY_GATE.md`

Shared references:
- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`

Final UI audit branch was rebased on main commit `8810f0bbdbabf6ffcdd571ee0a6cffc94a12db5a`, which already included the LIVE TRACE QA stylesheet. Main later advanced with AI/Data-only work; that did not change the audited production / Day 2 / LIVE / DIVE UI files.

## 2. Required viewport matrix actually captured

All four targets were captured at:
- 320×568 portrait
- 375×667 portrait
- 390×844 portrait
- 430×932 portrait
- 844×390 landscape
- 1024×768 wider landscape/tablet

Additional state captures included, where relevant:
- Day 2 Tutorial
- Day 2 Menu
- Day 2 Source sheet
- LIVE Event Cluster detail
- DIVE FOCUS MAP
- light mode
- dark mode
- reduced-motion / keyboard-focus state

## 3. Production visual baseline observed

Dark 390×844 computed baseline:
- font family: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Noto Sans JP", Arial, sans-serif`
- background: `#081113`
- primary text: `#f3f1ec`
- kingfisher teal: `#118995`
- topbar height: approximately 62 px plus safe area
- topbar horizontal padding: 14 px
- CARDS article radius: approximately 30 px
- article headline: strong sans-serif, approximately 28–35 px depending on viewport, weight around 830
- article body: approximately 16.5 px, regular reading weight
- bottom navigation height: approximately 65 px plus safe area

Manual production screenshot review found no known text overlap, control/content collision, clipping that hides meaning, or page-level horizontal overflow in the required matrix.

Production remains the baseline; this audit does not propose a production visual redesign.

## 4. Result summary

| Target | Basic visual gate | Notes |
|---|---|---|
| Production | **PASS** | Baseline rendered first; required matrix manually inspected. |
| Day 2 baseline | **PASS after fix** | Tutorial originally covered the Source control; fixed and regression-guarded. |
| LIVE TRACE | **PASS** | Latest main LIVE QA styling aligns font/palette/topbar with production; no known blocking overlap/clipping/overflow in audited screenshots. |
| DIVE FOCUS MAP | **FAIL / BLOCKED** | Visible fixed-control/article collisions and overlapping map nodes remain on narrow portrait viewports. See Issue #19. |

Because DIVE still has known automatic-fail conditions from the Demo Quality Gate, **the complete set of KAWASEMI demos must not be described collectively as OWNER_REVIEW_READY yet.**

## 5. Day 2 baseline — finding and fix

### Finding

Before the fix, the Tutorial guidance strip occupied the same vertical region as the real CARDS Source control / upper article content on narrow portrait and short landscape viewports.

This was a Quality Gate FAIL because instructional UI covered operational content.

### Fix

Only `demos/day2-baseline/index.html` was changed:
- when Tutorial is active, reserve vertical space above the article so the Tutorial strip does not cover the real CARDS Source control;
- use a smaller reserved amount in short landscape;
- align the Hamburger Menu kingfisher mark from the stray `#1597a3` value to the production kingfisher teal token `#118995`.

No production CARDS gesture code was modified. Tutorial meaning remains:
- vertical = READ
- left = NEXT
- right = SAVE

### Regression guard

`tests/day2-visual-guard.mjs` checks 320×568, 390×844, and 844×390 for:
- no page-level horizontal overflow,
- Tutorial strip clearing the actual Source control,
- Menu kingfisher accent remaining at production teal.

Final guard result: **PASS**.

### Manual screenshot result after fix

Re-inspected:
- 320×568 Tutorial: Source line and article content are readable below the Tutorial strip;
- 390×844 Tutorial: no Tutorial/content collision;
- 844×390 Tutorial: Source control remains below the guidance strip;
- Menu / Source / Light / Dark / normal CARDS states: no known blocking overlap/clipping/overflow in the captured states.

Owner taste/visual approval remains separate from this basic quality PASS.

## 6. LIVE TRACE — final visual QA

The final audit used the latest LIVE TRACE layout available on main after its own QA stylesheet was loaded.

Baseline consistency observed:
- same production font stack including Japanese fallback behavior;
- background `#081113`;
- kingfisher teal `#118995`;
- topbar height / horizontal padding aligned to production;
- same off-white / muted text family;
- light and dark modes both available.

Feature-specific structure intentionally differs from CARDS because LIVE is a chronological Signal / Event Cluster observation surface, but it does not need a separate typography or color system.

Manual screenshots checked included:
- default at all required viewports,
- Event Cluster detail at 320×568, 390×844, 844×390, and 1024×768,
- light mode at 390×844 and 844×390,
- reduced-motion / focus state.

No known text overlap, clipping that hides meaning, page-level horizontal overflow, or content/control collision remained in those final captures.

**Result: PASS for basic visual QA.**

No LIVE feature/interaction files were changed by UI / Motion during this audit.

## 7. DIVE FOCUS MAP — blocking findings

DIVE feature behavior was not changed. The following are presentation/layout failures only and are tracked in Issue #19.

### 320×568 — CARDS-like entry
- `HOLD · DIVE` covers article content near the `CONFIRMED / 確認されていること` transition.
- bottom instructional / navigation chrome competes with visible reading content.

### 390×844 — CARDS-like entry
- `HOLD · DIVE` still visibly overlaps lower article text.

### 320×568 — FOCUS MAP
- satellite node labels overlap the current node and/or each other;
- edge directions become cramped/clipped;
- lower directions compete with the fixed trail/footer area.

### 390×844 — FOCUS MAP
- lower `TECHNOLOGY` and `IMPACT` directions visibly overlap;
- long Japanese labels do not have enough separation.

### 844×390
- substantially better than portrait, but lower direction density remains tight and should be rechecked after the portrait layout fix.

### Visual baseline drift to resolve or explicitly justify

Current isolated DIVE styling also differs from production in several shared tokens:
- body stack uses `"Segoe UI"` fallback instead of the production `"Helvetica Neue"` / Arial stack;
- major Japanese headings / nodes use `Georgia / Noto Serif JP`, unlike the production CARDS sans-serif baseline;
- background is approximately `#071214` rather than production `#081113`;
- accent is approximately `#46c6bb`, much brighter than production `#118995`;
- article radius is approximately 26 px rather than production ~30 px;
- dock height is approximately 70 px rather than production ~65 px;
- the isolated FOCUS MAP demo currently has no light-mode path.

These notes do **not** request a new DIVE design. Unintentional shared-token drift should be aligned; any feature-required difference should be documented rather than silently creating a second product language.

**Result: FAIL / BLOCKED.**

Do not label the current DIVE FOCUS MAP demo OWNER_REVIEW_READY until the visible overlaps are fixed and the required screenshots are re-inspected.

## 8. Automated evidence

Cross-demo visual audit:
- final run: `31916811871`
- final artifact: `demo-visual-audit`
- artifact ID: `9255146998`
- final audited branch head: `39f67a6d4171bc8f54fdc5f5d4a5808838a4d45d`
- result: **SUCCESS**

The workflow includes:
- JavaScript syntax checks,
- Day 2 strict visual-overlap guard,
- full required viewport screenshot matrix,
- style/layout metadata capture,
- artifact upload.

The automatic generic collision report is diagnostic only and can contain false positives from hidden/off-screen overlay elements. **Manual screenshot inspection is the authority for the visual PASS/FAIL findings in this document.**

DIVE blocking failures were observed directly in the screenshots and are not inferred from the generic detector.

## 9. Workstream safety

UI / Motion changed only:
- Day 2 baseline visual spacing/accent,
- cross-demo QA test/workflow,
- audit documentation.

UI / Motion did **not** modify:
- production `index.html`, `kingfisher.css`, or `kingfisher.js`,
- production CARDS gesture recognizer,
- LIVE feature behavior / interaction files,
- DIVE FOCUS MAP behavior / interaction files,
- AI/Data feature code.

## 10. NOT TESTED

Still NOT TESTED across the appropriate demos unless another workstream provides separate evidence:
- physical iPhone Safari for this final cross-demo pass,
- VoiceOver / TalkBack end-to-end flow,
- large browser-text / Dynamic-Type-equivalent stress across every reachable state.

Additional DIVE gap:
- light mode is not available in the current isolated FOCUS MAP demo; this is a known implementation/visual gap, not a tested PASS.

## 11. Next action

No Owner taste decision is required to resolve this audit.

- Day 2: basic visual QA is clear; Owner visual approval remains a separate review decision.
- LIVE: basic visual QA is clear on the audited latest-main version.
- DIVE: DIVE workstream fixes Issue #19 without changing the approved feature interaction model, then UI / Motion re-runs the same screenshot gate before DIVE can be considered owner-review-ready.
