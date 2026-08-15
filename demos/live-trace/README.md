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
12. Use `◐` to check the same information hierarchy in dark and light modes.
13. When the scripted arrivals finish, use `↻` to replay the demo.

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

## Intentionally unfinished

- Real source ingestion.
- Production event-clustering model/API.
- Production CARDS queue insertion.
- Persistent seen/unseen state across devices.
- Authentication / user-specific monitoring topics.
- Offline/network failure behavior for real data.
- Final production navigation integration.

## NOT TESTED / validation still required

- Real iPhone Safari touch QA by Product Owner.
- VoiceOver / screen-reader flow.
- Large Dynamic Type / browser text enlargement beyond basic responsive wrapping.
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
