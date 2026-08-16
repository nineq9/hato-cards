# LIVE Status

### Status
OWNER_REVIEW_READY

### Current goal
Evaluate the completed standalone LIVE TRACE interaction demo before any production integration.

The prototype demonstrates LIVE as an observation layer for incoming information rather than a ranked article feed.

### Owner review URL

`https://nineq9.github.io/hato-cards/demos/live-trace/`

### Completed
- LIVE TRACE remains the leading LIVE direction.
- The demo is published from `main` under `demos/live-trace/` and is isolated from production CARDS gesture code.
- Default view is `GROUPED`; `ALL SIGNALS` is one tap away.
- NOW-based chronological ordering is implemented; the primary order is arrival time, not importance ranking.
- Scripted incoming Signals arrive over time and grow existing Event Clusters.
- Event Clusters are explicitly labeled `LIKELY SAME EVENT` and AI grouping is disclosed as a hypothesis.
- Cluster detail exposes individual Signals and Sources.
- `CONFIRMED`, `CLAIM`, and `UNKNOWN` are structurally separated and remain source-attributed.
- Actor/organization claims remain separate rather than collapsing into two sides.
- UNGROUPED Signals remain visible.
- Source sheets expose source identity, original title, original excerpt, time, attribution, and explicit external-source action.
- Source → Cluster back navigation preserves context.
- `SINCE YOU LAST CHECKED` shows additions by arrival time.
- New arrivals do not force the user back to NOW while older information is being viewed.
- A quiet `X new signals · ↑ NOW` control appears when new information arrives while the user is looking backward in time.
- `CARD AVAILABLE` and `Not queued` states are visible.
- `Not queued` reason stays hidden until `WHY?` is opened.
- `CARD AVAILABLE → OPEN IN CARDS` opens an isolated structured CARDS handoff preview without loading production CARDS gesture code.
- Dark and light visual directions are both reviewable.
- Reduced-motion handling and 44px key touch targets are included.
- Demo usage, limitations, NOT TESTED items, known issues, production-integration cautions, and visual QA evidence are documented in `demos/live-trace/README.md`.

### Implementation files
- `demos/live-trace/index.html`
- `demos/live-trace/live-trace.css`
- `demos/live-trace/live-trace-qa.css`
- `demos/live-trace/live-trace.js`
- `demos/live-trace/README.md`
- `tests/live-trace-demo.mjs`
- `tests/live-trace-visual.mjs`

### Interaction QA evidence

PASS on GitHub Actions run `31916615551` for commit `8810f0bbdbabf6ffcdd571ee0a6cffc94a12db5a`:
- syntax checks
- existing browser smoke
- existing human-like mobile E2E
- untouched-feature regression
- dedicated `LIVE TRACE demo E2E`
- dedicated `LIVE TRACE visual consistency matrix`
- screenshot artifact upload

The interaction E2E still exercises:
- GROUPED initial state
- UNGROUPED visibility
- Cluster open
- CONFIRMED / CLAIM / UNKNOWN separation
- WHO SAYS WHAT
- Source open and Back to Cluster
- CARD AVAILABLE → CARDS handoff preview
- ALL SIGNALS raw visibility
- past-view scroll preservation during new Signal arrival
- `1 new signal · ↑ NOW` return control
- Cluster growth from 4 → 5 Signals
- Not queued → WHY? detail
- SINCE LAST CHECK view
- light-theme switch
- no captured page/console errors

### Visual consistency + basic layout QA — 2026-08-16

Canonical baselines read before the pass:
- `docs/DEMO_QUALITY_GATE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- production `index.html`
- production `kingfisher.css`

This was a visual/layout QA pass only. The LIVE interaction model and functional specification were not changed. Production CARDS files/gesture code were not modified.

Changes made to align LIVE with production KAWASEMI:
- reuse production dark/light background, surface, text, muted, teal, and beige values;
- reuse the production font family/fallback stack including `Noto Sans JP`;
- bring title/body/metadata font weights and hierarchy closer to production;
- use Japanese-aware wrapping plus safe overflow handling for long mixed Japanese/Latin text;
- align top-bar height/proportions and sheet surface/radius treatment with production;
- replace a platform-dependent theme glyph with a simple stable SVG icon;
- make long Source/Actor identities wrap instead of clipping or losing provenance;
- keep key controls at or above the 44px touch target baseline.

The first visual-matrix run correctly FAILED because the 320×568 `GROUPED` control measured 43px high. This was treated as a quality failure, fixed to a true 44px+ hit area, and rerun rather than waived as a taste issue.

Final required viewport matrix — PASS:
- 320×568
- 375×667
- 390×844
- 430×932
- 844×390
- 1180×820 tablet landscape

Additional screenshot states generated — PASS:
- dark and light defaults
- long Japanese cluster title
- long Actor name
- long Source name / metadata
- cluster sheet
- `CONFIRMED / CLAIM / UNKNOWN`
- Source sheet stress case
- `ALL SIGNALS`
- `SINCE LAST CHECK` in dark and light
- landscape cluster sheet

Visual inspection was performed on the generated screenshots after automated PASS. Results:
- PASS — no observed text/control overlap.
- PASS — no observed horizontal clipping, page overflow, or control/text collision in the required matrix.
- PASS — long Japanese, Source, and Actor strings remain readable and wrap safely.
- PASS — Source and truth-state hierarchy remains legible in both dark and light modes.
- PASS — LIVE retains its chronological observation identity while using the same KAWASEMI visual grammar rather than a separate dashboard/app style.

Screenshot evidence is stored in GitHub Actions artifact `kingfisher-visual-checks` (artifact `9255099471`) for run `31916615551`.

GitHub Pages build `1153948675` for commit `8810f0bbdbabf6ffcdd571ee0a6cffc94a12db5a` completed successfully.

### NOT TESTED
- Real iPhone Safari touch/visual review.
- VoiceOver / screen-reader flow.
- Native iOS Dynamic Type behavior; browser-size responsive wrapping was tested, but not OS-level accessibility text scaling.
- Real external source sites; demo source links intentionally use `example.com`.
- Production-scale source volume and long-running stream performance.

### Known issues / limitations
- No known visual overlap/clipping failure remains in the required demo viewport matrix.
- Incoming data is fictional and scripted in memory.
- Reload/replay resets demo state.
- The CARDS handoff is a local prototype preview, not production navigation or queue insertion.
- `CONFIRMED` applies only to the explicitly represented Signal scope; it does not certify an entire event as true.
- No real clustering model/API is connected yet.

### Production integration cautions
- Do not integrate LIVE by modifying or reusing unstable CARDS swipe handlers.
- Keep LIVE observation state separate from CARDS reading/gesture state.
- Event Cluster membership must remain revisable and explainable as `likely same event`.
- Preserve raw and UNGROUPED Signals even when grouping exists.
- Preserve source provenance and claimant identity on every claim.
- Never infer `CONFIRMED` from source prestige alone.
- Preserve the no-auto-jump rule during live updates.
- A Signal not entering CARDS must remain inspectable in LIVE.
- Preserve the production visual-token and typography relationship established by this pass when integrating LIVE.
- Re-run real mobile Safari, accessibility, source-sheet, navigation, and state-recovery QA before production integration.

### Product decisions needed
None for this visual consistency pass.

### Next action
The LIVE TRACE standalone demo is ready for Product Owner visual/experience review. Production integration remains intentionally deferred.
