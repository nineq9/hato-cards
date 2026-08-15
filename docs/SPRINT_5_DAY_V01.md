# KAWASEMI — 5-Day v0.1 Sprint

Dates: 2026-08-15 → 2026-08-19

## Sprint goal

Ship a **surprise-ready KAWASEMI v0.1** that feels coherent on a real phone and demonstrates the product idea clearly.

This is not a full production launch. It is a convincing, reliable working product slice.

## v0.1 finish line

By the end of Day 5, the owner should be able to open one URL on a phone and demonstrate:

1. a polished KAWASEMI opening / first-run experience,
2. CARDS with reliable READ / NEXT / SAVE / LIKE,
3. a finite remaining count and caught-up state,
4. readable article structure with source transparency and clear claim / confirmed / unknown handling,
5. CARDS / LIVE / DIVE Editorial Dock navigation,
6. a directly touchable LIVE TRACE experience,
7. a directly touchable DIVE FOCUS MAP experience,
8. article → DIVE entry as a prototype interaction,
9. menu access to SAVED / LIKES / HISTORY / SETTINGS,
10. no known critical gesture or navigation trap in the demo path.

## Non-goals for this sprint

Do not spend the five days trying to complete:

- full X / Meta / Telegram ingestion,
- native iOS / Android builds,
- production-scale accounts / auth,
- every future DIVE direction,
- full LIVE production backend,
- VALUE MAP or historical-persona concepts,
- broad source coverage.

A narrow product that works is more valuable than many half-connected systems.

---

# Day 1 — Stabilize the body + lock the design grammar

## Core / CARDS

Goal: stop the current product from fighting the user.

Required:
- run human-like mobile E2E audit,
- reproduce diagonal-scroll → broken NEXT behavior,
- repair gesture state / direction-lock failures,
- verify READ / NEXT / SAVE at article top, middle, end,
- verify SAVE preserves scroll position,
- verify NEXT resets next article to top,
- verify menu subview return,
- capture screenshots of major states,
- document remaining NOT TESTED items honestly.

Exit condition:
No known reproducible critical gesture failure in the primary CARDS path.

## Design System

Goal: create one visual grammar before polishing features independently.

Define:
- typography hierarchy,
- spacing scale,
- color roles,
- surfaces / borders / radius,
- icon style,
- image treatment,
- source presentation,
- epistemic-state presentation,
- motion timing / easing,
- Editorial Dock grammar.

Output:
`docs/DESIGN_SYSTEM.md`

Do not redesign every screen today. Define the rules first.

---

# Day 2 — Tutorial + Navigation + Menu

Goal: make first use understandable and the app shell coherent.

Required:
- replace legacy FOR YOU / HOT language with CARDS / LIVE / DIVE in the prototype/app shell,
- use Editorial Dock as the primary navigation prototype,
- rebuild tutorial around real KAWASEMI interaction instead of abstract fake cards,
- use neutral, non-heavy tutorial content,
- teach actual vertical READ,
- teach article-end LIKE,
- teach NEXT and SAVE with the real gesture model,
- fix menu return behavior,
- keep SAVED / LIKES / HISTORY / SETTINGS inside menu utilities,
- first-run Full Opening; normal launch Micro Opening; in-app return no opening.

Exit condition:
A first-time user can reach CARDS and understand how to read, move on, save, and like without interpreting poetic instructions.

---

# Day 3 — Make CARDS journalist-worthy

Goal: turn the card from a visual demo into a useful information object.

Required:
- strengthen article structure,
- preserve text-first hierarchy,
- show source identity clearly,
- source opens sheet first, then explicit original link,
- separate confirmed information, attributed claims, and unknowns,
- avoid false balance and avoid AI truth-judge language,
- keep cover → article continuous inside one card,
- polish caught-up state,
- verify Saved / Like state behavior.

Preferred output:
At least several convincing demo stories with different epistemic structures, not one repeated template.

Exit condition:
A journalist can understand what happened, who claims what, what is not known, and where the source came from.

---

# Day 4 — Make LIVE and DIVE genuinely touchable + connect a minimal real-data path

## LIVE

Goal: owner-reviewable LIVE TRACE.

Required:
- direct mobile browser URL,
- NOW / chronological trace,
- signals and event clusters,
- grouped ↔ all signals,
- source identity,
- conflicting claims remain separate,
- source sheet,
- new-since-last-check indicator,
- CARD AVAILABLE / Not queued state.

Production integration is optional; direct touchability is mandatory.

## DIVE

Goal: owner-reviewable FOCUS MAP.

Required:
- direct mobile browser URL,
- central current node,
- 5–7 surrounding directions,
- question labels for expert categories,
- typed relationships,
- trail / back,
- return to original article context,
- prototype article → DIVE entry,
- test Drag-to-DIVE without breaking READ / NEXT / SAVE.

## Minimal real-data path

If infrastructure is ready, implement only one narrow end-to-end source path:

`one approved feed / source → raw item → structured KAWASEMI object → CARDS`

Rules:
- server-side secrets only,
- provider abstraction,
- preserve source provenance,
- no attempt to solve broad ingestion today.

If blocked by credentials / hosting, do not derail the sprint. Record the blocker and keep the demo data layer shaped like the intended production contract.

---

# Day 5 — Product integration, human QA, and presentation polish

Goal: one coherent v0.1, not a collection of demos.

Required:
- integrate only the pieces proven good enough during prototype review,
- run full mechanical QA,
- run human-like mobile journey QA,
- test at iPhone-like widths,
- review screenshots for visual regressions,
- confirm no navigation dead ends,
- confirm no critical gesture state leak after repeated imperfect touches,
- confirm direct demo/product URLs work,
- remove obviously obsolete prototype text / labels,
- polish opening, caught-up state, empty/error states needed for the demonstration.

Final demo path should be short and intentional:

`Open KAWASEMI → Tutorial / CARDS → read → source → save / like / next → LIVE → DIVE → return → caught up`

Exit condition:
The owner can demonstrate KAWASEMI without explaining away broken interactions.

---

# Daily PM cadence

Product HQ owns sprint sequencing.

At the beginning of each day:
1. read `docs/PROJECT_STATUS.md` and relevant workstream status files,
2. confirm what is actually DONE vs merely planned,
3. choose the day's critical path,
4. avoid adding unrelated scope.

During the day:
- specialists persist important results to GitHub,
- Product HQ reads GitHub rather than asking the owner to relay long thread responses,
- owner decisions are requested only for taste / product choices that genuinely need human judgment.

At the end of each day:
- update workstream status files,
- update `docs/PROJECT_STATUS.md`,
- record important accepted decisions in `docs/DECISION_LOG.md`,
- list blockers and tomorrow's first executable action.

# Decision discipline

When something is reversible and clearly within an approved direction, proceed without asking the owner repeatedly.

Ask the owner only when:
- the experience meaningfully changes,
- taste is central,
- the choice is hard to reverse,
- cost / external publishing / credentials are involved,
- there is a real tradeoff with no clear best answer.

# Sprint priority order

When work conflicts, use this order:

1. core gesture reliability,
2. understandable first-run UX,
3. coherent shared design,
4. journalist-quality article information,
5. touchable LIVE / DIVE,
6. minimal real-data integration,
7. polish.

Do not sacrifice 1–3 just to claim more features are implemented.
