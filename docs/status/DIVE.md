# DIVE Status

### Status
DONE — standalone interactive demo only

The isolated DIVE prototype is implemented, browser-interaction tested in Portrait and Landscape, committed to `main`, and deployed through GitHub Pages. Production KAWASEMI integration remains intentionally deferred.

### Current goal achieved
Validate the approved DIVE prototype direction as a touchable experience without changing production CARDS gesture code.

Validated demo direction:
- FOCUS MAP
- QUESTION LABEL
- Drag to DIVE
- typed relationships
- DIVE TRAIL
- exact return to the originating article position
- Portrait and Landscape comparison

### Access
GitHub Pages:
- `https://nineq9.github.io/hato-cards/demos/dive-focus-map/`

Repository:
- `demos/dive-focus-map/`

Guide:
- `demos/dive-focus-map/README.md`

Deployment evidence:
- GitHub Pages source: `main` at `/`
- Pages build `1153865937`
- Build commit: `07320ebdfb5e7aeb9fdc1b41b2ea4f84fe52cefe`
- Result: `built`
- Completed: 2026-08-15 23:05:18 UTC

### Implemented
- Isolated static demo under `demos/dive-focus-map/`; production CARDS gesture implementation is untouched.
- CARDS-like article with vertical READ and isolated demo NEXT / SAVE gesture lock.
- Dedicated `HOLD · DIVE` grab affordance; article-body long press does not enter Drag Mode.
- Drag Mode lifts a compact article representation and turns Editorial Dock DIVE into a drop target.
- Article → DIVE drop starts the article as the central FOCUS MAP Node.
- Normal DIVE Dock tap opens DIVE Home instead of directly diving the current article.
- FOCUS MAP keeps one current Node central and shows at most 5–7 actual next directions.
- Internal category names plus plain-language QUESTION LABELS.
- Node selection moves the chosen Node to the center and rebuilds the visible neighborhood.
- Typed relations including `supports`, `contradicts`, `claims`, `confirms`, `context_for`, `historically_similar_to`, `affects`, and `explains`.
- Relation type is readable in text rather than color-only.
- `historically_similar_to` explicitly states that historical similarity is not evidence for the current event.
- Relation / provenance sheet with demo source metadata.
- DIVE TRAIL with direct jump to earlier visited Nodes.
- One-step BACK.
- Return to the originating CARDS article with the exact saved scroll position.
- Portrait exploration layout.
- Landscape two-pane comparison: originating article/context on the left and FOCUS MAP on the right.
- Landscape context pane remains independently scrollable while the map remains interactive.
- Reduced-motion fallback.
- Non-gesture direct Article → DIVE path exists for keyboard / assistive-operation prototyping.

### Drag activation decision in the demo
Compared technically:

1. Article-body long press
   - Rejected as the default.
   - High conflict risk with iPhone/Safari text selection, native callout, READ, NEXT, and SAVE.

2. Dedicated grab affordance
   - Selected for this demo.
   - Drag Mode can only begin from the explicit grab surface.
   - Once committed to Drag Mode, READ / NEXT / SAVE are suspended until drop or cancel.

3. Article-end-only drag
   - Not selected as the primary path.
   - Reduces availability at the moment curiosity occurs and weakens discoverability.

This remains a prototype decision, not a production interaction contract.

### QA — local Chromium browser automation

Portrait required path:
- PASS — CARDS article loads.
- PASS — article can be vertically scrolled.
- PASS — dedicated hold commits Drag Mode.
- PASS — drop on DIVE enters FOCUS MAP.
- PASS — root shows no more than 7 outward Nodes.
- PASS — EVIDENCE can become the central Node.
- PASS — Satellite imagery can become the central Node.
- PASS — Satellite view still shows no more than 7 outward Nodes.
- PASS — typed relation names are visible in text.
- PASS — HISTORY can be entered sideways from Satellite imagery.
- PASS — arrival relation is visible and typed `historically_similar_to`.
- PASS — relation sheet states that historical similarity is not evidence and is not `supports`.
- PASS — BACK returns one step.
- PASS — DIVE TRAIL jumps to EVIDENCE.
- PASS — ARTICLE returns to CARDS.
- PASS — origin article scroll position restored exactly (test: 650 → 650).
- PASS — normal DIVE tap opens DIVE Home.
- PASS — Portrait hides the Landscape context pane.
- PASS — no page-level horizontal overflow.
- PASS — no browser console / page errors during the tested scenario.

Landscape required path:
- PASS — same core exploration path through EVIDENCE → Satellite imagery → HISTORY.
- PASS — relation inspection / Back / Trail / Article return.
- PASS — origin article scroll position restored exactly (test: 650 → 650).
- PASS — two-pane geometry is active.
- PASS — originating article/context pane is visible.
- PASS — context pane is independently scrollable.
- PASS — FOCUS MAP remains usable on the right.
- PASS — no page-level horizontal overflow.
- PASS — no browser console / page errors during the tested scenario.

Gesture conflict checks:
- PASS — holding the article body does not create a DIVE drag ghost.
- PASS — normal vertical READ scrolls the article.
- PASS — right swipe produces demo SAVE feedback and preserves reading position.
- PASS — left swipe produces demo NEXT and next article starts at top.
- PASS — Drag cancel stays in CARDS, preserves article scroll, and leaves no drag ghost.
- PASS — dedicated grab affordance and DIVE Dock target meet the 44 pt minimum in the tested viewport.
- PASS — keyboard direct-DIVE fallback can enter FOCUS MAP.

### Portrait vs Landscape observation
Portrait:
- Stronger for focused, one-object-at-a-time exploration.
- Better fit for one-handed use and a simpler visual hierarchy.
- 5–7 directions fit when Node positions stay deliberately compact and asymmetric.

Landscape:
- Browser QA supports the hypothesis that Landscape is stronger for investigative exploration.
- Keeping the originating article/context visible on the left reduces context loss while moving through the map on the right.
- Horizontal width makes relation names and 5–7 directions easier to keep readable without turning the screen into a giant graph.
- The context pane can scroll independently, so the map does not need to move just to reread the source context.

This is an observation from the isolated demo, not a final production orientation decision. KAWASEMI should not force device rotation.

### Not implemented
- Production KAWASEMI integration.
- Changes to production CARDS gesture code.
- Real OpenAI / AI Node generation.
- Production backend or persistence.
- Real source URLs / production provenance.
- Full graph pan / zoom.
- Personalization.
- Production analytics.
- Final tutorial integration.

### NOT TESTED
- Physical iPhone Safari touch behavior.
- Physical Android browser behavior.
- VoiceOver / TalkBack final interaction behavior.
- Production browser-history contract.
- Production AI / backend data integrity.
- Production CARDS integration regression QA.

### Known issues / limitations
- Demo data and provenance are intentionally static/fake and labelled as demo material.
- The dedicated grab affordance is a prototype choice; production visual placement still needs hands-on Owner evaluation.
- Landscape two-pane is promising but is not yet a production orientation rule.
- Local automated browser QA is not a substitute for physical iPhone Safari testing before production integration.

### Production integration cautions
- Do not attach DIVE Drag Mode to article-body long press.
- Do not add a second competing gesture handler beside the shared production CARDS gesture decision layer.
- Drag Mode must be an explicit locked interaction state; cancel must never fall through into NEXT or SAVE.
- System edge gestures, normal scrolling, and text selection retain priority outside the dedicated grab surface.
- Preserve a non-drag accessibility path for direct Article → DIVE.
- Restore article identity and exact reading position on return.
- Keep typed relation semantics and provenance when demo data is replaced by generated graph data.

### Product decisions needed
None to complete or evaluate the standalone demo.

Before production integration, Product HQ should decide only after hands-on evaluation:
- whether Drag to DIVE becomes part of the production interaction contract,
- whether the dedicated grab affordance is retained or redesigned,
- whether Landscape two-pane becomes a supported production layout rather than only a responsive enhancement.

### Next action
Product Owner can now evaluate the deployed standalone demo. Production integration remains intentionally deferred until that evaluation and until the CARDS interaction foundation is stable.
