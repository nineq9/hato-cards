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
- Demo usage, limitations, NOT TESTED items, known issues, and production-integration cautions are documented in `demos/live-trace/README.md`.

### Implementation files
- `demos/live-trace/index.html`
- `demos/live-trace/live-trace.css`
- `demos/live-trace/live-trace.js`
- `demos/live-trace/README.md`
- `tests/live-trace-demo.mjs`

### Automated QA evidence

PASS on GitHub Actions run `31913078099` for commit `15034727c8554ed414ef2e302dcebe46ebe5475b`:
- syntax checks, including `demos/live-trace/live-trace.js`
- existing browser smoke
- existing human-like mobile E2E
- untouched-feature regression
- dedicated `LIVE TRACE demo E2E` using Playwright/Chromium at a 390×844 mobile viewport
- visual screenshot artifact upload

The dedicated LIVE test actually exercises:
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

GitHub Pages build for the tested demo commit completed successfully.

### NOT TESTED
- Real iPhone Safari owner touch review.
- VoiceOver / screen-reader flow.
- Large browser text scaling / Dynamic Type-equivalent stress testing.
- Real external source sites; demo source links intentionally use `example.com`.
- Production-scale source volume and long-running stream performance.

### Known issues / limitations
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
- Re-run mobile Safari, accessibility, source-sheet, navigation, and state-recovery QA before production integration.

### Product decisions needed
None before owner review of the current prototype. The next meaningful decisions should come from touching the demo rather than further abstract specification.

### Next action
Product Owner reviews the published LIVE TRACE demo on iPhone and gives experience-level feedback. Production integration remains intentionally deferred.
