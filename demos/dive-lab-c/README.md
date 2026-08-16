# KAWASEMI DIVE LAB C — INVESTIGATION / TIME

Status: **isolated owner-comparison prototype. Not production DIVE.**

This LAB contains ten fundamentally different investigation mechanics built from the same synthetic CARDS article.

Open `index.html`, then enter each prototype:

1. `01-time-machine/` — scrub backward through source-grounded historical states.
2. `02-what-changed/` — compare two revisions and read only semantic differences.
3. `03-claim-comparison/` — compare attributed claims without collapsing them into one narrative.
4. `04-evidence-chain/` — reverse-trace an article statement to upstream and independent evidence.
5. `05-event-reconstruction/` — assemble fragments while keeping occurred time separate from observed time.
6. `06-follow-entity/` — pivot on an organization/place and follow it across documents and time.
7. `07-contradiction/` — inspect exact wording to see what actually conflicts.
8. `08-unanswered/` — investigate UNKNOWNs and explicitly keep an OPEN QUESTION.
9. `09-who-knew-when/` — scrub PUBLIC RECORD by actor while private knowledge stays UNKNOWN.
10. `10-hypothesis-test/` — test clearly labeled hypotheses with evidence without probability theater.

## Epistemic contract

All content is synthetic. The prototypes preserve these KAWASEMI rules:

- FACT / CLAIM / EVIDENCE / HYPOTHESIS / UNKNOWN remain structurally distinct.
- Attribution is not verification.
- AI processing confidence is not truth confidence.
- Historical similarity is CONTEXT ONLY.
- Multiple reports sharing one upstream source do not become multiple independent confirmations.
- Source / provenance can be inspected.
- DIVE SESSION records observable navigation only, not belief or understanding.
- HYPOTHESIS is never presented as FACT.

## Shared demo path

Every prototype supports:

1. Start from a CARDS-like synthetic article.
2. Enter the unique DIVE mechanic.
3. Perform 2–4 meaningful actions.
4. Reach one explicit discovery moment.
5. Open Source / provenance at least once.
6. Use Back.
7. Open SESSION.
8. Leave and Resume conceptually from stored local demo state.

Landscape is a responsive enhancement. Rotation is never forced. On wider landscape viewports the originating article context is kept in a left pane while the investigation workbench remains on the right.

## Visual baseline

The demo preserves the production KAWASEMI dark baseline and shared design grammar:

- deep charcoal base;
- restrained kingfisher teal;
- Japanese system sans typography;
- content-first hierarchy;
- low-chrome surfaces;
- quiet motion;
- 44px important touch targets;
- no graph-demo, BI dashboard, spreadsheet, chatbot, cyberpunk, or OSINT-military aesthetic.

## Quality gate

Browser-rendered QA and screenshot inspection were performed for all ten prototypes at:

- 320×568
- 375×667
- 390×844
- 430×932
- 844×390
- 1180×760

Total: **60 rendered prototype/viewport cases**.

Checked:

- CARDS → DIVE;
- unique interaction path;
- Source sheet;
- SESSION sheet;
- Back;
- serialized session state / reconstructed Resume state;
- horizontal overflow;
- visible important controls below 44×44;
- important clipping;
- Source sheet bounds;
- page/console errors;
- screenshot overlap / hierarchy / spacing review.

Result: **PASS for those checked conditions — 60/60, 0 known layout failures.**

NOT TESTED:

- physical iPhone / Safari browser chrome and safe-area behavior;
- VoiceOver / TalkBack end-to-end;
- GitHub Pages branch deployment;
- production data / backend / AI;
- production or multi-device session persistence;
- production integration.

The managed test browser blocked direct `localhost` and `file:` navigation. QA therefore loaded the exact generated HTML/CSS/JS into Chromium and used a deterministic in-page storage substitute to exercise serialization and Resume reconstruction. Real browser-origin persistence transport remains NOT TESTED.

## LAB record

Full research, ten experience specifications, comparison scores, and top-three recommendation:

`docs/labs/DIVE_LAB_C_INVESTIGATION_TIME.md`

Production files and `docs/status/DIVE.md` are outside this LAB scope and must not be changed by it.
