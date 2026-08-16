# DIVE Status

### Status
OWNER_REVIEW_READY — isolated DIVE SESSION v0.2 prototype is implemented, interaction-tested, visually inspected across the required viewport matrix, committed to `main`, and deployed through GitHub Pages. Production DIVE integration remains intentionally deferred.

### Current question
The prototype now tests the v0.2 experience hypothesis rather than another visual concept:

> If a source-grounded DIVE preserves what the user actually viewed, the branches they took, discoveries they explicitly saved, questions they explicitly left open, and the exact place they stopped, does DIVE become something they want to return to rather than a one-off investigation?

Canonical experience spec:
- `docs/DIVE_EXPERIENCE_V0_2.md`

Direct preview:
- `https://nineq9.github.io/hato-cards/demos/dive-session-v02/`

Implementation / review guide:
- `demos/dive-session-v02/`
- `demos/dive-session-v02/README.md`

Automated interaction QA:
- `demos/dive-session-v02/qa/test_dive_session_v02.py`

Deployment evidence:
- GitHub Pages source: `main` at `/`
- Pages build: `1153979113`
- build commit: `1188313c2fba2ea7cb8428cd2ddc879786e2a5ce`
- result: `built`
- completed: `2026-08-16T00:41:34Z`

### What is implemented
- CARDS-like article anchor with DIVE start from an arbitrary reading position.
- DIVE Home ordered as `CONTINUE` → `RECENT DIVES` → `NEW EXPLORATION`.
- Recent Dive metadata limited to observable state: anchor, last focus, last active, approximate active time, explicit Saved Discovery count, explicit Open Question count.
- Seven fixture directions at the root when data exists: EVIDENCE / CLAIMS / UNKNOWN / HISTORY / PEOPLE / TECHNOLOGY / IMPACT.
- Plain-language question labels alongside internal direction types.
- At least three genuinely traversable semantic directions, including EVIDENCE, HISTORY, TECHNOLOGY and others.
- Every movement can expose `from`, `to`, typed relation, plain-language connection meaning, explanation, and source/provenance.
- `historically_similar_to` is explicitly contextual and immediately states that historical similarity is not evidence for the current event.
- Session steps preserve `parentStepId`; BACK followed by a different route creates a sibling branch without deleting the earlier route.
- DIVE TRAIL remains the current-branch navigation aid.
- SESSION HISTORY separately shows the whole observed exploration including branches and permits jumping back to previously visited steps.
- Saved Discovery requires explicit SAVE; visited items are not automatically saved.
- Open Question requires explicit KEEP; `UNKNOWN` remains an information-side epistemic state and is not equated with user understanding.
- LEAVE pauses the DIVE without requiring a finish state.
- CONTINUE restores anchor, current focus, route / branches, Saved Discoveries, Open Questions, and resume position.
- Return to the originating article restores the exact reading position.
- Portrait → Landscape → Portrait retains the same Session state.
- Runtime prototype persistence uses IndexedDB (`kawasemi-dive-session-v02`).

### Replaceable Session-layer architecture
The Session implementation is deliberately separated from the current renderer so DIVE LAB interaction models can reuse it without adopting this UI.

- `exploration-adapter.js` — replaceable Node / Direction / Relation / Source access boundary.
- `session-engine.js` — UI-independent session semantics: create, first-meaningful-action persistence, move, back, branch, history jump, explicit save, explicit open question, leave / resume, active-time metadata.
- `session-store.js` — runtime IndexedDB persistence boundary.
- `app.js` — current minimal renderer only.

The current prototype renders `current focus + small editorial list of next directions` because that makes Session value easy to evaluate. This is **not** a final DIVE visual architecture decision.

### Relationship to other DIVE work
The existing FOCUS MAP prototype remains preserved at:
- `demos/dive-focus-map/`

It remains technical / interaction evidence and is not treated as the final UI.

The separately developed DIVE LAB / synthesis work already on `main` was preserved. This Session work does not roll it back and does not require future LAB UIs to use FOCUS MAP aesthetics.

### Automated interaction QA
Final browser-automation journey: PASS.

Verified:
- PASS — Article → DIVE from arbitrary article position.
- PASS — an accidental DIVE open remains a draft until first meaningful exploration.
- PASS — first meaningful EVIDENCE move persists the Session.
- PASS — EVIDENCE → Satellite imagery deeper exploration.
- PASS — Satellite imagery → HISTORY sideways exploration.
- PASS — typed relation + provenance inspection.
- PASS — historical similarity warning says it is not evidence.
- PASS — visited ≠ saved.
- PASS — explicit Saved Discovery persists.
- PASS — BACK then TECHNOLOGY preserves HISTORY as a sibling branch via parent step.
- PASS — Session History can revisit earlier branch steps.
- PASS — explicit Open Question persists from a non-UNKNOWN node, demonstrating `UNKNOWN ≠ OPEN QUESTION`.
- PASS — LEAVE → DIVE Home → CONTINUE restores exact current focus and session objects.
- PASS — app reinitialization preserves the session through the same Store interface used by the automated harness.
- PASS — article origin scroll restored exactly in recorded test: `720 → 720`.
- PASS — Portrait → Landscape → Portrait preserves current step / Saved Discovery / Open Question state.
- PASS — no browser console/page errors in the final journey.
- PASS — no page-level horizontal overflow in required inspected states.

### Demo Quality Gate / visual inspection
Screenshots were generated **and visually inspected**, not only captured.

Required viewport matrix:
- PASS — 320×568 portrait
- PASS — 375×667 portrait
- PASS — 390×844 portrait
- PASS — 430×932 portrait
- PASS — 844×390 landscape
- PASS — 1024×768 wider landscape

Inspected states included:
- long Japanese Article headline;
- DIVE Home with CONTINUE + multiple Recent Dives;
- current-focus exploration;
- Connection / provenance sheet with a deliberately long source name;
- long Open Question sheet;
- `historically_similar_to` warning.

Stress results:
- PASS — long Japanese text wraps without overlap.
- PASS — long source / organization names wrap without horizontal overflow.
- PASS — long Open Question remains readable and editable.
- PASS — multiple Recent Dives remain usable; short screens scroll instead of compressing text into overlap.
- PASS — 844×390 Open Question keeps the KEEP action reachable/visible.
- PASS — historical-similarity warning is visible near the top of the relation sheet.

Visual bugs found and corrected before this status:
1. Article DIVE action initially overlaid reading content → moved to topbar.
2. 844×390 Open Question confirmation initially fell below the visible sheet → short-landscape sheet / textarea spacing corrected.
3. Historical-similarity warning could appear too low in Portrait → moved directly under the relation meaning.

Final known visual FAILs in the inspected matrix: **none**.

### Information-integrity invariants retained
- AI / processing confidence ≠ truth confidence.
- same-event confidence ≠ truth confidence.
- attribution ≠ verification.
- historical similarity ≠ evidence.
- AI alone cannot set a proposition to CONFIRMED.
- typed relation meaning is readable without color.
- source / provenance remains inspectable.
- no generic `related` relation substitutes for semantic type.
- no understanding %, knowledge %, mastery, belief, or inferred viewpoint is stored/displayed.

### Production safety
Not changed:
- production CARDS gesture code;
- production DIVE UI;
- production navigation;
- production backend;
- existing FOCUS MAP evidence prototype;
- DIVE LAB / synthesis demos.

This is isolated evidence under `demos/dive-session-v02/` only.

### NOT TESTED
- Physical iPhone Safari touch behavior.
- Physical Android browser behavior.
- VoiceOver / TalkBack final behavior.
- Automated real-origin GitHub Pages reload + IndexedDB persistence in this sandbox. Runtime code uses IndexedDB, but sandbox Chromium navigation to normal origins is administratively blocked, so the automated QA uses a persistent test backing behind the same Store interface. The deployed page should be manually refreshed once during Owner review to confirm real-browser IndexedDB continuation.
- Cross-device sync.
- Production CARDS / LIVE / SAVED integration.
- Real AI-generated DIVE structure.
- Real source URLs / production data integrity.
- Large browser text enlargement beyond the viewport/text stress performed here.
- Light-theme version of this isolated experience prototype.

### Known limitations
- News, source, provenance, and historical content are synthetic fixtures.
- Two Recent Dives are labelled demo sessions and exist to test list density.
- Active exploration time is approximate activity metadata, not productivity or understanding scoring.
- No backend / cross-device state.
- No automatic `UPDATED SINCE THIS DIVE` behavior.
- Saved Discovery remains inside the Session; global production SAVED integration is deferred.
- Open Question resolution / new-evidence notification is not implemented.

### Product decisions needed
None to evaluate this isolated prototype.

The Owner should now evaluate one question hands-on before production design/integration decisions:

> After leaving DIVE, does seeing `CONTINUE`, the preserved branches, the one thing you explicitly saved, and the question you explicitly left open make the exploration feel worth returning to?

Production integration remains deferred even if the answer is yes. A positive result would validate the Session layer; it would **not** automatically approve this renderer, FOCUS MAP, Drag to DIVE, Landscape two-pane, or any LAB visual interaction as the final production DIVE UI.
