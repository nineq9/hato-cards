# LIVE TRACE touchable demo

This directory is an isolated, owner-reviewable prototype for KAWASEMI LIVE.

It does **not** load or modify production CARDS gesture code.

## Preview

GitHub Pages:

`https://nineq9.github.io/hato-cards/demos/live-trace/`

## How to evaluate it

1. Open the preview on a phone-sized browser.
2. Stay near `NOW` for a few seconds and watch a new Signal arrive quietly.
3. Open a `LIKELY SAME EVENT` cluster and inspect:
   - `CONFIRMED`
   - `CLAIM`
   - `UNKNOWN`
   - `WHO SAYS WHAT`
   - individual Signals / Sources.
4. Open a Source, then use Back to return to the same cluster.
5. Switch `GROUPED` → `ALL SIGNALS` and confirm the underlying Signals remain visible.
6. Find an `UNGROUPED SIGNAL` and confirm it has not disappeared because AI did not cluster it.
7. Scroll into the past, wait for another Signal, and confirm the screen does not jump to `NOW`.
8. Use the quiet `X new signals · ↑ NOW` control to return to the present.
9. Open `SINCE YOU LAST CHECKED` to inspect what changed by arrival time rather than importance ranking.
10. Open a `Not queued` cluster and use `WHY?` to reveal the demo reason only on demand.
11. Open the cluster marked `CARD AVAILABLE` and use `OPEN IN CARDS →` to see the isolated CARDS handoff preview.
12. Use the small theme icon in the top bar to check the same information hierarchy in dark and light modes.
13. When the scripted arrivals finish, use the replay control to replay the demo.

## Implemented

- NOW-based chronological timeline.
- Scripted real-time-style incoming Signals.
- Likely-same-event clustering without presenting the cluster as certainty.
- Cluster growth as new Signals arrive.
- Cluster detail with individual Signals.
- Actor/source-separated claims.
- Explicit `CONFIRMED / CLAIM / UNKNOWN` structural separation.
- `GROUPED / ALL SIGNALS` switch; default is `GROUPED`.
- Visible UNGROUPED Signals.
- Source sheet with original-title/excerpt metadata and explicit external-source action.
- Back navigation from Source → Cluster.
- `SINCE YOU LAST CHECKED` change view.
- Scroll anchoring while the user is reading older items.
- Quiet `X new signals · ↑ NOW` return control.
- `CARD AVAILABLE / Not queued` states.
- `Not queued` reason hidden behind `WHY?`.
- Isolated `CARD AVAILABLE → CARDS` handoff preview.
- Dark / light theme review toggle.
- Reduced-motion handling.
- 44px minimum hit areas for key controls.

## Visual consistency + basic layout QA — 2026-08-16

The visual pass used these canonical baselines before making changes:
- `docs/DEMO_QUALITY_GATE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- production `index.html`
- production `kingfisher.css`

The LIVE interaction model was not changed.

Visual alignment changes:
- production dark/light background, surface, text, muted, teal, and beige tokens are reused;
- the production font stack is reused, including `Noto Sans JP` fallback;
- Japanese line breaking and long mixed Japanese/Latin labels are allowed to wrap without horizontal clipping;
- title/body/metadata weights and hierarchy were brought closer to production;
- top-bar height/proportions and sheet radius/surface treatment were aligned with production;
- the theme glyph was replaced with a stable simple SVG icon so appearance does not depend on a platform font glyph;
- key controls keep at least a 44px hit target;
- long Source and Actor names use flexible columns and safe wrapping rather than truncating required identity.

Automated + screenshot matrix PASS on GitHub Actions run `31916615551`, commit `8810f0bbdbabf6ffcdd571ee0a6cffc94a12db5a`.

Viewport screenshots generated and visually inspected:
- 320×568 dark + light
- 375×667 dark
- 390×844 dark + light
- 430×932 dark
- 844×390 dark + light
- 1180×820 tablet landscape dark
- 320×568 long Japanese cluster title
- 320×568 long Actor name
- 320×568 long Source name / metadata
- 390×844 cluster sheet
- 390×844 `CONFIRMED / CLAIM / UNKNOWN`
- 390×844 Source sheet stress case
- 390×844 `ALL SIGNALS`
- 390×844 `SINCE LAST CHECK` dark + light
- 844×390 landscape cluster sheet

Visual inspection result:
- PASS — no observed text/control overlap.
- PASS — no observed horizontal clipping or page overflow.
- PASS — long Japanese, Actor, and Source text remains readable and wraps.
- PASS — dark/light hierarchy remains the same product grammar.
- PASS — LIVE-specific timeline stays visually distinct without becoming a separate app/dashboard aesthetic.

The screenshot artifact is stored by GitHub Actions as `kingfisher-visual-checks` for run `31916615551`.

## Intentionally unfinished

- Real source ingestion.
- Production event-clustering model/API.
- Production CARDS queue insertion.
- Persistent seen/unseen state across devices.
- Authentication / user-specific monitoring topics.
- Offline/network failure behavior for real data.
- Final production navigation integration.

## NOT TESTED / validation still required

- Real iPhone Safari touch/visual QA by Product Owner.
- VoiceOver / screen-reader flow.
- OS-level Dynamic Type behavior; browser-size responsive wrapping was tested, but not native iOS accessibility text scaling.
- Real external source sites; demo links intentionally use `example.com`.
- Production data volumes and long-running stream performance.

## Known limitations

- Incoming data is fictional and scripted in memory.
- Reloading or replaying resets the demo state.
- The CARDS handoff is a local preview, not production navigation.
- `CONFIRMED` reflects the scope explicitly represented by the demo Signal; it is not a universal truth label for an entire event.

## Production integration cautions

- Keep LIVE data/state separate from CARDS gesture state.
- Do not reuse or modify unstable CARDS swipe handlers merely to integrate LIVE.
- Treat Event Cluster membership as a revisable hypothesis (`likely same event`).
- Preserve source-level Signals and UNGROUPED material even when grouping/ranking exists.
- Keep claimant identity and source provenance on every claim.
- Never derive `CONFIRMED` from source importance alone.
- Preserve the no-auto-jump rule when live updates arrive while the user is looking backward in time.
- CARDS promotion should remain an explicit status/handoff; absence from CARDS must not make a LIVE Signal disappear.
- Re-run mobile, accessibility, source-sheet, navigation, and state-recovery QA before production integration.
