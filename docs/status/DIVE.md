# DIVE Status

### Status
DONE — Experience Spec v0.2 documented; standalone FOCUS MAP demo preserved; production integration intentionally deferred.

### Current direction
The next DIVE phase is **experience specification / session value**, not visual redesign.

Canonical working experience spec:
- `docs/DIVE_EXPERIENCE_V0_2.md`

Core hypothesis:

> DIVE becomes worth returning to when a source-grounded exploration is preserved as a session: what the user actually viewed, the route they took, what they deliberately saved, what they deliberately left open, and where they stopped — without AI claiming what they learned, understood, believed, or mastered.

### What changed in v0.2
- DIVE is defined as a **source-grounded exploration session**, not merely a graph screen.
- The strongest core loop is anchor → choose direction → inspect typed connection/provenance → choose again → save discovery / keep question open → leave → resume.
- DIVE SESSION becomes a first-class proposed product object.
- Observable route history is separated from inferred cognition.
- Branch history uses parent-step structure so backtracking + a new branch can both remain in session history.
- `Saved Discovery` is an explicit keep action; visited nodes are not automatically SAVED.
- `UNKNOWN` (epistemic state) is separated from `OPEN QUESTION` (user-controlled item to revisit).
- DIVE Home should prioritize `CONTINUE` and `RECENT DIVES`.
- Past user exploration should not be called plain `HISTORY` inside DIVE because `HISTORY` already means historical-context exploration.
- Resume restores current step, route, saved discoveries, open questions, anchor, and origin article context.
- A previous session must not be silently rewritten when later AI/data changes.
- Portrait and Landscape use the same session model; Landscape may keep origin/context visible as an investigative enhancement but rotation is never forced.

### Relationship to current FOCUS MAP demo
The existing prototype remains at:
- `demos/dive-focus-map/`
- `https://nineq9.github.io/hato-cards/demos/dive-focus-map/`

It is retained as **technical / interaction evidence**, not as the final DIVE UI.

Evidence already provided by the demo:
- small visible neighborhood instead of giant graph;
- question labels;
- typed relations;
- deeper + sideways movement;
- DIVE TRAIL / one-step back;
- Article → DIVE drag feasibility;
- exact article scroll restoration;
- Landscape two-pane context hypothesis.

Do not continue polishing node/graph aesthetics unless a specific experience test requires it.

### Demo Quality Gate maintenance
`docs/DEMO_QUALITY_GATE.md` remains applicable.

During v0.2 experience work, an existing screenshot review exposed an obvious layout FAIL:
- lower FOCUS MAP nodes collided / overlapped in Portrait and Landscape.

Minimal corrective change:
- widened lower-node horizontal spacing in responsive CSS;
- removed the forced 440px minimum map canvas on narrow Portrait so short screens do not clip the intended node field.

This was a layout-correctness fix only, not visual redesign.

Post-fix complete viewport screenshot matrix is **NOT TESTED** in this workstream. Physical iPhone/Safari remains **NOT TESTED**.

### Existing demo interaction evidence retained
Earlier isolated-browser QA recorded:
- PASS — CARDS-like vertical READ.
- PASS — dedicated hold commits Drag Mode.
- PASS — Article → DIVE drop enters exploration.
- PASS — no more than 5–7 outward Nodes in tested states.
- PASS — EVIDENCE → Satellite imagery → HISTORY sideways path.
- PASS — relation `historically_similar_to` explicitly states similarity is not evidence.
- PASS — BACK and TRAIL navigation.
- PASS — exact origin article scroll restoration (recorded test: 650 → 650).
- PASS — normal DIVE tap opens DIVE Home.
- PASS — Landscape context pane remains independently scrollable in the tested demo.
- PASS — article-body hold does not start DIVE drag.
- PASS — demo READ / SAVE / NEXT and Drag cancel did not fall through into each other in the tested browser run.

These validate interaction primitives only; they do not approve the FOCUS MAP as final visual architecture.

### Next isolated implementation slice
Build a new or extended isolated prototype that tests **session value**, using local browser persistence only.

Minimum required experience:
1. start one DIVE SESSION from an article;
2. choose among 4–7 available semantic directions;
3. explore at least EVIDENCE, HISTORY, and one additional direction;
4. inspect typed relation + provenance;
5. persist route steps with branch parentage;
6. explicitly Save Discovery;
7. explicitly Keep Open Question;
8. leave DIVE;
9. see CONTINUE / RECENT DIVES;
10. resume at the prior current step with route / save / open question intact;
11. return to the original article + exact scroll position;
12. preserve the same session state across Portrait / Landscape.

For the isolated slice, `IndexedDB` is preferred; `localStorage` is acceptable for a small fixture. No production backend is required.

### Not implemented
- production KAWASEMI DIVE integration;
- production CARDS gesture changes;
- real DIVE SESSION persistence backend;
- cross-device sync;
- real AI node generation;
- automatic updated-since-session detection;
- global SAVED integration for discovery objects;
- inferred knowledge / comprehension model;
- forced Landscape behavior.

### NOT TESTED
- physical iPhone Safari after the latest layout correction;
- physical Android browser;
- full post-fix `DEMO_QUALITY_GATE.md` viewport screenshot matrix;
- VoiceOver / TalkBack final behavior;
- production CARDS/LIVE/SAVED integration;
- production persistence / multi-device state;
- real AI-generated DIVE structure.

### Product decisions needed
None before the next isolated session prototype.

The current task deliberately does **not** ask the Owner to choose among A/B/C UI concepts. The next useful evidence is whether persistent session / resume / discovery / open-question behavior makes DIVE meaningfully more desirable to use.

Before production integration, Product HQ still needs hands-on evidence for:
- whether Drag to DIVE becomes a production interaction contract;
- whether Landscape two-pane becomes a supported responsive production layout;
- how DIVE session/discovery objects ultimately surface in global HISTORY / SAVED without confusing historical-context `HISTORY`.

### Next action
Use `docs/DIVE_EXPERIENCE_V0_2.md` as the source for the next **isolated session prototype**. Do not integrate production UI yet and do not treat the existing FOCUS MAP rendering as final.
