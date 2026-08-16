# DIVE LAB E — NETWORK / DEEP

Status: **OWNER_REVIEW_READY — isolated lab only**  
Date: 2026-08-16  
Branch: `dive-lab-e-network-deep`  
Scope: `demos/dive-lab-e/**` + this document only. Production KAWASEMI and `docs/status/DIVE.md` are intentionally unchanged.

## 1. Goal

Test ten fundamentally different ways to feel **connection, depth, hierarchy, time, place, and causality** without assuming that a network must be rendered as circles and lines.

Every prototype starts from the same CARDS-like synthetic fixture article and supports: at least three primary operations, a real depth change, one lateral/unexpected discovery, typed relationship inspection, provenance, BACK, TRAIL, ARTICLE return, SESSION HISTORY, and a resume point.

The fixture story is explicitly fictional. The lab is interaction evidence, not factual reporting and not a production DIVE implementation.

## 2. Canonical constraints retained

The lab follows the current repository contracts:

- DIVE is user-directed; AI does not silently choose the next interpretation.
- source grounding and typed relationships remain inspectable;
- `supports`, `contradicts`, `claims`, `confirms`, `context_for`, `historically_similar_to`, `affects`, `explains`, `caused_by`, `part_of`, and `source_of` keep distinct meanings;
- historical similarity is contextual, never evidence by itself;
- proximity is not causality; simultaneity is not causality; relatedness is not support;
- session history stores observable navigation, not inferred belief, understanding, mastery, or ideology;
- production KAWASEMI visual baseline remains quiet, intellectual, precise, premium, and content-first.

## 3. Web research — mechanic extraction

Research was intentionally broader than news. The UI of these products was not copied; only exploration mechanics were extracted.

| Product / domain | Mechanic extracted for LAB E |
|---|---|
| Google Earth historical imagery | move through time while geographic context stays stable |
| Google Earth Voyager | curated entry points that open a wider exploratory world |
| FamilySearch Family Tree | refocus the whole structure around a selected person; branch and return |
| NASA Worldview | time + layer comparison; change one dimension without losing the other |
| Sefaria | start from a passage, then reveal typed categories of connected material |
| OpenAlex | traverse works, authors, institutions, topics, citations as different entity classes |
| Connected Papers | discover shared scholarly neighborhoods and bridging works |
| Europeana | move laterally across collection, creator, place, period, and object |
| Google Arts & Culture | zoom from collection/context into individual objects and details |
| MusicBrainz | explicit typed relationships between artists, releases, works, labels, places |
| Discogs | artist ↔ release ↔ master ↔ label traversal |
| Wikidata Query Service | one underlying data set can become graph, map, timeline, or table depending on question |
| Met Heilbrunn Timeline of Art History | time/place/culture intersections rather than one linear chronology |
| Smithsonian collections | object → maker → place → collection → related records |
| Library of Congress finding aids | hierarchy as progressive disclosure from collection to item |
| iNaturalist Explore | independent filtering by taxon, place, date, observation |
| OpenHistoricalMap | date-sensitive geography; map state changes with historical time |
| Outer Wilds | discoveries and unresolved clues accumulate without the system declaring the answer |
| Heaven's Vault | interpretation remains provisional; uncertainty can remain visible while exploration continues |
| Her Story | fragment retrieval causes the user to build a path rather than receive one final narrative |

Mechanics carried forward: **zoom/refocus, tunneling, branching, convergence, scale change, lateral movement, temporal movement, geographic movement, semantic proximity, unexpected intersection, contradiction, evidence typing, breadcrumbs/trails, unresolved paths, and return to prior depth.**

## 4. Ten touchable prototypes

### 01 — SEMANTIC TUNNEL
Primary operation: **go one question deeper**.

- Level 0: article + “why did capacity drop?”
- Level 1: identify a Claim and its claimant.
- Level 2: inspect supporting observation and what it does *not* establish.
- Level 3: an assumption opens a lateral maintenance-log path.

Value: the clearest portrait “one more level” feeling without a graph.

### 02 — BRAID
Primary operation: **advance one of three independent threads** (cable / vessel / weather).

- Level 0: three separate timelines.
- Level 1: each thread reveals its next observation independently.
- Level 2: the user notices temporal/geographic overlap.
- Level 3: an INTERSECTION appears only when the threads genuinely share a context.

Value: strong serendipity; the user creates the comparison order.

### 03 — LAYER PEEL
Primary operation: **peel one semantic layer**.

Surface → actors → claims → evidence → origin.

Level 3 ends at an explicit primary monitoring record rather than merely “more detail.” The model distinguishes attribution from verification.

### 04 — ENTITY WORMHOLE
Primary operation: **make an entity the new center**.

Article → operator → repeater technology → supplier bulletin. A historical equipment similarity appears, but is explicitly labeled `historically_similar_to`, not `supports`.

### 05 — CONVERGENCE LENS
Primary operation: **widen semantic radius** for two distant threads.

Cable and vessel paths remain separate until both reference maintenance plan `MP-442`. The convergence is a shared inspectable reference; it is not visual closeness and does not imply that the vessel caused the outage.

### 06 — CAUSE CASCADE
Primary operation: **move backward into candidate causes or forward into effects**.

Past and future are separate directions. `caused_by` is used only where evidence supports a causal statement; future operational consequences use `affects`.

### 07 — EVIDENCE LOOM
Primary operation: **pin one evidence thread to one Claim**.

`supports`, `contradicts`, and `context_for` remain simultaneously visible. Adding two supporting items does not erase contradictory/contextual material or become a vote count.

### 08 — TIME × PLACE
Primary operation: **change time and place independently**.

The user can move across monitoring station / cable sector / vessel and across times. A vessel coincidence becomes a discovery but is explicitly described as coincidence, not causality or support.

### 09 — FRACTAL DIVE
Primary operation: **change scale**.

WORLD → COUNTRY → ORG → PERSON → STATEMENT → PRIMARY. The experience tests whether “deep” can mean moving from a huge system to one source-bearing record rather than moving downward in a node map.

### 10 — CONTRADICTION READER
Primary operation: **select the clauses that disagree**.

Two accounts stay side-by-side. The user narrows the disagreement clause by clause. The deepest state finds the narrower observation both can point back to (“a monitoring anomaly was recorded”) without falsely synthesizing agreement on cause.

## 5. Portrait vs Landscape

Portrait-first: **01, 03, 04, 09** — one focus and a strong directional/scale operation are clearer in a narrow reading flow.

Landscape-strong: **02, 05, 06, 07, 08, 10** — simultaneous comparison materially improves the test. On narrow screens these recompose vertically; rotation is never forced and the landscape version is not a stretched portrait layout.

## 6. Relationship and provenance behavior

Every factual-looking lab item is static synthetic fixture data. Relationship pills expose PROVENANCE. Example source fixtures distinguish:

- observation log vs operator claim;
- maritime contradiction vs maintenance context;
- primary alarm record vs historical supplier bulletin;
- shared maintenance-plan reference vs causal inference;
- AIS time/place coincidence vs evidence of causality.

The lab therefore tests interaction semantics without pretending that UI proximity changes epistemic state.

## 7. Session / History hypothesis

Each concept persists after the first meaningful exploration action. The session records:

- active route;
- append-only visited journey;
- parent step for branch history;
- sources inspected;
- discovery points;
- unresolved count;
- resume focus;
- origin article scroll position.

BACK changes the active route but does not silently delete the previously visited journey. SESSION HISTORY explicitly says the system does not infer that the user “understood” anything. ARTICLE restores the origin reading position in the tested browser harness.

## 8. QA performed

Automated browser interaction plus screenshot review was run against all ten concepts.

### Viewports

Required matrix:

- 320×568
- 375×667
- 390×844
- 430×932
- 844×390

Landscape-strong concepts additionally: **1180×760**.

### Automated checks — final pass

For every concept:

- start from CARDS-like article: PASS
- at least 3 primary operations: PASS
- depth changes: PASS
- visible lateral/unexpected discovery: PASS
- typed relationship present: PASS
- provenance sheet opens: PASS
- TRAIL contains >=3 steps: PASS
- BACK changes/restores exploration state: PASS
- SESSION HISTORY + resume point: PASS
- ARTICLE return: PASS
- article scroll restoration in harness: PASS
- persistence write after meaningful action: PASS
- continue previous DIVE: PASS
- reduced-motion smoke check: PASS
- JS/page errors: **0**
- document horizontal overflow: **0 failures**
- visible buttons below 44×44: **0 failures**

Demo 07 also tested BACK → alternate evidence branch; append-only branch history remained available.

Japanese long headline/source-name stress content was used.

### Screenshot review — final pass

All ten viewport contact sheets were visually inspected. No remaining text overlap, clipping, horizontal escape, control/text collision, neon graph aesthetic, giant spiderweb, or unreadably tiny graph labels were found.

### Defects found and fixed during QA

1. TIME × PLACE and FRACTAL originally stored discoveries in history without visibly surfacing them. Fixed by adding on-surface discovery states.
2. FRACTAL initially scaled its interactive card, shrinking the actual provenance hit target below 44px. Fixed by removing interactive-container scaling.
3. Discovery history had duplicate/missing entries in a few concepts. Normalized.
4. ARTICLE return now restores origin article scroll position in the test harness.
5. relation provenance, range controls, and contradiction clauses were normalized to >=44px interactive targets.

### Harness limitation

The managed Chromium environment blocked direct URL navigation. The QA harness therefore loaded the exact HTML/CSS/JS source into Chromium with `set_content` / injected assets. Because that produces an opaque origin, QA injected a small Storage API-compatible in-memory mock. The production code itself still uses browser `localStorage`.

Therefore **real-origin reload persistence is NOT TESTED** in this run, even though same-document leave/resume behavior and persistence calls were exercised.

## 9. Comparison

Scores are 1–10, weighted qualitatively across WOW, “diving” feeling, unexpected discovery, intellectual value, KAWASEMI uniqueness, information integrity, navigation clarity, smartphone, landscape, and v0.1 feasibility.

| # | Concept | Score | Main reason |
|---|---|---:|---|
| 01 | Semantic Tunnel | 8.3 | simplest deep-loop; strong portrait |
| 02 | Braid | 8.7 | excellent multi-story serendipity |
| 03 | Layer Peel | 8.4 | clear provenance descent |
| 04 | Entity Wormhole | 8.2 | strong lateral refocus |
| 05 | Convergence Lens | 8.9 | network feeling without graph; inspectable convergence |
| 06 | Cause Cascade | 8.2 | intuitive past/future causal discipline |
| 07 | Evidence Loom | 8.8 | epistemically strong evidence interaction |
| 08 | Time × Place | 8.6 | strong landscape investigation |
| 09 | Fractal Dive | 8.7 | strongest scale-change metaphor |
| 10 | Contradiction Reader | **9.2** | disagreement itself becomes a source-grounded exploration entrance |

## 10. Recommended top three

### 1. CONTRADICTION READER
Best KAWASEMI signature. It creates curiosity from disagreement while preserving source boundaries, and its deepest state can narrow what is actually shared without inventing consensus.

### 2. CONVERGENCE LENS
Best demonstration that **network ≠ graph**. Surprise comes from an inspectable shared reference rather than node distance or visual proximity.

### 3. EVIDENCE LOOM
Best relationship-semantics test. It makes support, contradiction, and context something the user manipulates while keeping conflicting evidence visible.

**Close fourth: BRAID.** It may have the highest serendipity value for multi-story exploration, but smartphone density and real data requirements are harder than the top three.

## 11. NOT TESTED

- physical iPhone / Safari;
- physical Android browser;
- VoiceOver / TalkBack end-to-end behavior;
- system text enlargement beyond the long-text wrapping stress used here;
- real-origin full reload persistence using `localStorage`;
- cross-device sync / production backend;
- real sources or AI-generated expansion;
- production CARDS / LIVE / DIVE integration.

## 12. Product conclusion

LAB E provides evidence that DIVE can feel like a network without rendering a graph. The strongest models make the **operation itself** carry the connection: select the disagreement, widen the radius until paths converge, weave evidence into a claim, refocus on an entity, or change scale.

No production decision is made by this lab. The next Product HQ decision can compare these three LAB E finalists with the strongest results from LAB A–D before selecting the next isolated DIVE experience spec.