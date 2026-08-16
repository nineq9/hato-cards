# DIVE LAB A — DISCOVERY

Status: **implemented on isolated branch; owner interaction review pending**  
Branch: `dive-lab-a-discovery`  
Baseline inspected: `main` at `4d6fc08d1dc9620eb35da49f0da5baba322ecde6` (2026-08-16)  
Scope: discovery/serendipity experiments only. No production CARDS / LIVE / DIVE changes. No `docs/status/DIVE.md` changes.

## 1. Lab question

> What interaction makes a user think “one more step” because the next step may reveal something they did not know — while preserving source visibility, typed relationships, uncertainty, and user control?

This lab is deliberately **not** a FOCUS MAP refinement. `demos/dive-focus-map/` remains preserved as technical / interaction evidence and is not modified.

Hard constraints from canonical KAWASEMI docs:

- AI confidence is not truth confidence.
- `related` is not `supports`.
- `historically_similar_to` is context, never evidence for the current event.
- AI alone cannot make a claim `CONFIRMED`.
- DIVE must preserve understandable directions and source grounding.
- Exploration history records observable navigation, not inferred belief or understanding.
- Discovery must not become a manipulative endless-engagement loop.

## 2. Cross-product discovery research

The research question was not “what UI should KAWASEMI copy?” but **“why does the next interaction feel worth trying?”**

| Product / experience | Mechanic extracted | Why the next action attracts |
|---|---|---|
| Spotify Discover Weekly / Made For You | familiar anchor + bounded novelty | enough trust to accept surprise |
| SoundCloud Stations | start exploration from any known track | one known item becomes a doorway |
| Bandcamp Discover / tags | user-chosen genre/tag boundary | wandering stays intentional |
| Pinterest visual search | select the exact sub-object of interest | curiosity attaches to a concrete detail |
| Google Arts & Culture Explore | orthogonal facets: artist, time, medium, color, place | same collection can be re-entered from another angle |
| Airbnb Categories | discover by theme before knowing a destination | no need to know the correct query first |
| Atlas Obscura | nearby + random + story-rich objects | surprise has a geographic / explicit frame |
| Google Maps Explore | nearby / trending / curated discovery | adjacency makes discovery understandable |
| AllTrails Explore | map + radius + filters | changing a boundary reveals a new neighborhood |
| Are.na Connections | human-made links between objects / collections | the connection itself has meaning |
| Unsplash Topics | curated topic collections + rotating modules | one subject opens multiple visual paths |
| Letterboxd Lists | human-curated lists + history/watchlist | exploration creates a useful return state |
| Europeana Explore | theme / century / institution facets | artifacts can move across structured dimensions |
| Wikipedia hyperlink wandering | contextual links exactly where curiosity occurs | the entry point is the phrase that raised the question |
| Google Trends Explore | comparison from one topic | contrast and changing frames create discovery |

### Extracted principles

1. **Attach curiosity to something concrete.** Phrase, object, source, time, or place beats generic `MORE`.
2. **Let the user set a boundary before surprise.** Direction, radius, source pair, shelf, or time keeps serendipity explainable.
3. **Progressive reveal beats graph dumping.** Small next steps preserve anticipation and comprehension.
4. **Make `WHY THIS?` cheap.** Surprise without an inspectable relation becomes opaque recommendation.
5. **Contrast itself can be discovery.** Different sources, times, or categories can reveal something without inventing facts.
6. **Movement should create useful memory.** SESSION / TRAIL makes wandering resumable without claiming learning or belief.
7. **Randomness is acceptable only inside explicit constraints.** Unbounded surprise is entertainment; bounded surprise can be research.
8. **A detour must return safely to the anchor.** Curiosity should not cost reading context.

## 3. Grounded demo data

All ten experiments use the same CARDS-like anchor for comparability:

**令和6年能登半島地震で、地形はどこまで変わったのか**

Static demo facts are intentionally narrow:

- JMA: 2024-01-01 16:10, M7.6, maximum seismic intensity 7.
- GSI: ALOS-2 / SAR analysis reported major crustal deformation and coastline changes.
- GSI: field survey at Kaiso fishing port confirmed approximately 4 m uplift, consistent with satellite analysis.
- Cabinet Office: damage-status material was revised repeatedly as information accumulated.
- 2007 Noto Peninsula earthquake: M6.9 **historical context only**. The demo marks it `historically_similar_to`; it never supports or verifies a 2024 claim.

Potential impacts are labeled context unless the source set directly establishes them. The demos intentionally do not infer a specific facility’s damage cause from general uplift/coastline observations.

---

## 4. Ten interaction models

### 01 — X-RAY ARTICLE

**NAME** — X-RAY ARTICLE  
**One-line** — Keep the article in place and reveal EVIDENCE / CONTEXT / UNKNOWN / SOURCE layers inside it.  
**Primary action** — Choose a semantic lens, then tap the exact surfaced fragment.  
**What creates excitement** — The story feels deeper without becoming another screen or a generic related-items list.  
**First 30 seconds** — `記事を透かして見る` → EVIDENCE → `最大約4mの隆起` → see relation, source, and confirmation basis.  
**After 2–3 minutes** — Switch to CONTEXT and discover SAR as the observation method; switch to UNKNOWN and see what the available sources do not establish.  
**Deeper path** — observation → measurement method → another observation → provenance / unknown.  
**HISTORY** — lens changes, fragments actually opened, typed relations, saves/questions, last focus.  
**CARDS / LIVE difference** — CARDS reads the article; LIVE observes incoming signals; X-RAY interrogates the semantic structure inside one article.  
**Reference principle** — Pinterest sub-object discovery + museum facets + contextual links.  
**v0.1 core** — four lenses, tappable fragments, one deeper step, BACK, TRAIL, SESSION.

### 02 — CURIOSITY COMPASS

**NAME** — CURIOSITY COMPASS  
**One-line** — Replace “recommended next item” with understandable directions around the current article.  
**Primary action** — Choose EVIDENCE / TECHNOLOGY / HISTORY / IMPACT.  
**What creates excitement** — The user chooses the kind of question, not the title an algorithm chose.  
**First 30 seconds** — TECHNOLOGY → SAR → coastline observation.  
**After 2–3 minutes** — HISTORY → 2007 Noto, clearly labeled context/not evidence → contrast against 2024 direct observations.  
**Deeper path** — any direction becomes a new focus with another small set of directions.  
**HISTORY** — direction choices, opened items, relation types, branches after BACK.  
**CARDS / LIVE difference** — asks “what kind of question do I want to ask next?” rather than “what should I review?” or “what changed now?”.  
**Reference principle** — Airbnb Categories + Europeana / Arts & Culture facets.  
**v0.1 core** — four directional doors, detail, second step, BACK/TRAIL/SESSION.

### 03 — DIVE STATION

**NAME** — DIVE STATION  
**One-line** — Turn one anchor into a short stream of adjacent discoveries with relationship type and `WHY THIS` visible.  
**Primary action** — Choose a station flavor, then `次の1件` or branch.  
**What creates excitement** — Very low effort to see the next discovery, while retaining an inspectable reason.  
**First 30 seconds** — uplift → next reveals SAR as `explains`, not generic “related”.  
**After 2–3 minutes** — observation → method → coastline → historical context; the epistemic role visibly changes.  
**Deeper path** — branch to UNKNOWN or switch flavor.  
**HISTORY** — actual sequence and branches seen, not every candidate the system considered.  
**CARDS / LIVE difference** — optional semantic exploration, not required review and not chronology.  
**Reference principle** — SoundCloud Stations + Spotify bounded discovery.  
**v0.1 core** — bounded four-item station, `WHY THIS`, two flavors, branch, TRAIL/SESSION.  
**Risk** — if this feels like an AI recommendation tunnel, it should not become primary DIVE.

### 04 — THREAD PULL

**NAME** — THREAD PULL  
**One-line** — Start from the exact phrase that created curiosity and pull one typed connection at a time.  
**Primary action** — Tap the underlined phrase `海岸線の変化`, then follow the thread.  
**What creates excitement** — DIVE happens at the moment the question forms; no separate exploration dashboard decision is needed.  
**First 30 seconds** — article phrase → Coastline → SAR.  
**After 2–3 minutes** — coastline → method → uplift → impact → 2007 history, with weaker/contextual relations visibly different.  
**Deeper path** — any step can open detail and spawn a deeper connection; BACK returns one step.  
**HISTORY** — origin phrase, opened thread steps, branch point, relations, saves/questions.  
**CARDS / LIVE difference** — turns a specific reading moment into exploration while preserving the article anchor.  
**Reference principle** — Wikipedia contextual links + Pinterest sub-object focus + Are.na connection traversal.  
**v0.1 core** — inline article trigger, typed thread, detail, deeper step, BACK/TRAIL/SESSION.

### 05 — TIME SCRUB

**NAME** — TIME SCRUB  
**One-line** — Explore not just what is known, but when and by what method it became knowable.  
**Primary action** — Move between dated knowledge states.  
**What creates excitement** — A later observation can change how an earlier headline is understood; the reveal is temporal.  
**First 30 seconds** — 1/1 earthquake observation → 1/11 coastline analysis.  
**After 2–3 minutes** — 1/19 field/satellite confirmation → later damage-report updates; discover that “the event” is a changing evidence picture.  
**Deeper path** — source role / observation method at each time; unresolved questions may remain unresolved.  
**HISTORY** — time states visited and source snapshot attached to each state.  
**CARDS / LIVE difference** — LIVE shows what is arriving now; TIME SCRUB reconstructs how knowledge changed after the event.  
**Reference principle** — timeline scrubbing + Google Trends comparison + archive revision history.  
**v0.1 core** — four time stops, epistemic detail, method/source drill-down, BACK/TRAIL/SESSION.

### 06 — KNOWLEDGE NEARBY

**NAME** — KNOWLEDGE NEARBY  
**One-line** — Treat typed semantic distance like a map radius: one step = direct observation; farther steps = method, provenance, history, impact.  
**Primary action** — Change radius 1–3 and open a nearby item.  
**What creates excitement** — Expanding the radius reveals more of the world while preserving why the new item is farther away.  
**First 30 seconds** — radius 1 shows uplift/coastline direct observations → radius 2 reveals SAR/source roles.  
**After 2–3 minutes** — radius 3 reveals 2007 history and possible impact, explicitly marked contextual/weak where appropriate.  
**Deeper path** — open any nearby item → its own direct observation / unknown.  
**HISTORY** — radius changes, objects opened, relation distance and types.  
**CARDS / LIVE difference** — neither queue nor timeline; it is semantic-neighborhood exploration.  
**Reference principle** — Maps Explore + AllTrails radius search + Atlas Obscura nearby.  
**v0.1 core** — radius control, six typed nearby objects, detail/deeper step, BACK/TRAIL/SESSION.

### 07 — DISCOVERY SHELVES

**NAME** — DISCOVERY SHELVES  
**One-line** — Re-enter the same event through different curated “shelves”: observation, technology, history, impact, unknown.  
**Primary action** — Choose a shelf, horizontally browse its pieces, then cross to another shelf through a typed connection.  
**What creates excitement** — The same story reveals a different character when entered through another collection.  
**First 30 seconds** — observation shelf → coastline → cross to technology shelf.  
**After 2–3 minutes** — move between technology and unknown/history without flattening them into one related list.  
**Deeper path** — cross-shelf transition from the selected object.  
**HISTORY** — shelves entered, objects opened, cross-shelf paths.  
**CARDS / LIVE difference** — an editorial collection-space for exploration, not review queue or incoming feed.  
**Reference principle** — museum/archive facets + Letterboxd lists + Unsplash topics.  
**v0.1 core** — five shelves, horizontal pieces, cross-shelf link, BACK/TRAIL/SESSION.

### 08 — SOURCE SPLIT

**NAME** — SOURCE SPLIT  
**One-line** — Put two observation windows side by side and make their difference the discovery surface.  
**Primary action** — Choose a source pair, then open the differing observations/questions each source can answer.  
**What creates excitement** — “Same event, different measurable world” creates a real surprise without inventing a new fact.  
**First 30 seconds** — JMA × GSI → earthquake magnitude/intensity vs crustal/coastline change.  
**After 2–3 minutes** — GSI × Cabinet Office → physical observation vs damage aggregation → `因果は別途検証` instead of silently inferring causation.  
**Deeper path** — measurement method, source role, missing evidence, update history.  
**HISTORY** — source pairs compared, rows opened, method/source steps, unresolved causality questions.  
**CARDS / LIVE difference** — CARDS synthesizes for reading; LIVE preserves incoming sources; SOURCE SPLIT is an active comparison workspace.  
**Reference principle** — comparison browsing + Google Trends compare + archive institution facets.  
**v0.1 core** — two source pairs, side-by-side windows, typed detail, deeper method/source step, BACK/TRAIL/SESSION.

### 09 — SAFE SURPRISE

**NAME** — SAFE SURPRISE  
**One-line** — Let the user choose the *kind* of surprise first, then reveal one unexpected connection with `WHY THIS` and relationship strength visible.  
**Primary action** — Choose TECH / CONTEXT / IMPACT boundary, then inspect reveal/explanation.  
**What creates excitement** — There is a real curiosity gap, but the user decides the epistemic territory before the reveal.  
**First 30 seconds** — TECH → SAR → `なぜこれが出た？`.  
**After 2–3 minutes** — CONTEXT reveals 2007 Noto with explicit similarity-not-evidence warning; IMPACT similarly warns against specific damage inference.  
**Deeper path** — revealed item → limitation/unknown, or return and choose another boundary.  
**HISTORY** — boundary chosen, reveal seen, explanation opened; no hidden novelty score is presented as truth.  
**CARDS / LIVE difference** — optional bounded serendipity; never required CARDS review and not chronological LIVE.  
**Reference principle** — random/lucky discovery mechanics, but bounded by user-selected context.  
**v0.1 core** — three boundaries, one reveal, WHY explanation, weak-link warning, TRAIL/SESSION.  
**Risk** — never optimize surprise selection for time-spent or inferred ideology.

### 10 — FIELD NOTES

**NAME** — FIELD NOTES  
**One-line** — Make DIVE a lightweight investigation: collect two clues, then let a new question emerge from the combination.  
**Primary action** — Add selected evidence/context items to a session notebook.  
**What creates excitement** — The next step is shaped by what the user deliberately collected, so exploration feels authored rather than served.  
**First 30 seconds** — open `地形はどこまで変わった？` → add uplift + coastline.  
**After 2–3 minutes** — the pair raises `観測方法の違いで、見える変化はどう変わる？` → follow SAR or explicitly keep the question open.  
**Deeper path** — collected clues → new question → evidence/context/source/unknown.  
**HISTORY** — question, explicitly collected clues, explicitly kept follow-up questions, route/source refs.  
**CARDS / LIVE difference** — makes the user’s explicit investigative choices first-class DIVE state without inferring belief or learning.  
**Reference principle** — Are.na collection/connection behavior + research notebook + deliberate lists.  
**v0.1 core** — open question, four candidate clues, collect two, new question, follow/keep, SESSION.

---

## 5. Comparison

Scale: 1 (weak) → 5 (strong). These are lab hypotheses, **not owner decisions**.

| # | Model | WOW | Use again | Deeper understanding | KAWASEMI uniqueness | Info integrity | Smartphone | Landscape growth | v0.1 feasible | Total /40 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 | X-RAY ARTICLE | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **38** |
| 02 | CURIOSITY COMPASS | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 5 | 35 |
| 03 | DIVE STATION | 5 | 5 | 3 | 3 | 3 | 5 | 3 | 5 | 32 |
| 04 | THREAD PULL | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **39** |
| 05 | TIME SCRUB | 4 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 36 |
| 06 | KNOWLEDGE NEARBY | 4 | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 34 |
| 07 | DISCOVERY SHELVES | 3 | 4 | 4 | 3 | 5 | 5 | 4 | 5 | 33 |
| 08 | SOURCE SPLIT | 4 | 4 | 5 | 5 | 5 | 4 | 5 | 5 | **37** |
| 09 | SAFE SURPRISE | 5 | 5 | 3 | 4 | 4 | 5 | 4 | 5 | 35 |
| 10 | FIELD NOTES | 4 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 36 |

### Recommended top 3 for owner touch review

1. **THREAD PULL** — strongest because curiosity begins exactly where reading creates the question; very smartphone-friendly and naturally preserves why the route began.
2. **X-RAY ARTICLE** — strongest at making KAWASEMI’s epistemic structure a usable experience while keeping the article as anchor.
3. **SOURCE SPLIT** — strongest at turning provenance/source literacy into visible product value; especially promising in landscape.

The three are complementary, not cosmetic variants:

- THREAD PULL = curiosity from an exact phrase.
- X-RAY ARTICLE = curiosity from semantic layers.
- SOURCE SPLIT = curiosity from contrast between observation windows.

Owner should still touch all ten before deciding. SAFE SURPRISE may have the strongest immediate “one more” feeling; TIME SCRUB and FIELD NOTES may produce stronger investigative value for certain stories.

## 6. Touchable demo structure

```text
demos/dive-lab-a/
  index.html
  common.css
  common.js            # sequential module loader
  data.js              # grounded static data + mode metadata
  core.js              # shared article / session / trail / detail logic
  modes-a.js           # experiments 01–05
  modes-b.js           # experiments 06–10
  app-init.js          # shared shell/bootstrap
  01-xray-article/index.html
  02-curiosity-compass/index.html
  03-dive-station/index.html
  04-thread-pull/index.html
  05-time-scrub/index.html
  06-knowledge-nearby/index.html
  07-discovery-shelves/index.html
  08-source-split/index.html
  09-safe-surprise/index.html
  10-field-notes/index.html
```

Shared demo affordances:

- CARDS-like article anchor;
- model-specific DIVE entry;
- BACK / ARTICLE return;
- DIVE TRAIL;
- SESSION sheet with observable steps only;
- explicit SAVE DISCOVERY / OPEN QUESTION actions;
- production dark tokens / Japanese system font / restrained teal / 44px targets;
- portrait single-focus and landscape article + DIVE two-pane behavior;
- `prefers-reduced-motion` fallback.

No paid API, OpenAI call, external account, or production integration.

## 7. QA / quality-gate status

### PASS — actually checked

- `node --check` passed for `common.js`, `data.js`, `core.js`, `modes-a.js`, `modes-b.js`, and `app-init.js`.
- LAB index, shared modules, and all ten demo routes return HTTP 200 on the local static server.
- All 10 demo HTML paths are isolated under `demos/dive-lab-a/`.
- Demo copy retains explicit `CONFIRMED / CONTEXT / UNKNOWN` states.
- The 2007 item is structurally `historically_similar_to` and displays a “not evidence” warning.
- Potential coastal-use impact is context and warns against inferring specific facility damage.
- Core production visual tokens and Japanese system font stack were used rather than a separate visual language.
- No production file, existing DIVE demo, or `docs/status/DIVE.md` is part of the LAB change set.

### NOT TESTED — do not call PASS

- Required screenshot matrix: 320×568, 375×667, 390×844, 430×932, 844×390, wider landscape.
- Screenshot inspection for overlap/clipping/control collision.
- Physical iPhone / Safari.
- Real touch behavior.
- VoiceOver / screen-reader flow.

The available container Chromium starts but hangs before emitting screenshots even for a trivial static page. This is not evidence that the demos pass or fail. Therefore the lab **must not be labeled `OWNER_REVIEW_READY` under `docs/DEMO_QUALITY_GATE.md` yet**.

### Visual drift report

Intentional differences:

- each DIVE layout differs because interaction architecture is the experiment variable;
- landscape can keep article and exploration visible simultaneously.

Preserved:

- deep charcoal / blue-black foundation;
- `#118995` kingfisher teal;
- off-white text and muted metadata hierarchy;
- system / Japanese font stack;
- restrained borders/surfaces/radii;
- 44px important targets;
- minimal motion + reduced-motion fallback;
- content-over-brand hierarchy.

Known remaining mismatch:

- the LAB uses a simplified article renderer rather than production CARDS gesture/components, intentionally to avoid production coupling. It is an interaction experiment, not a production-component candidate.

## 8. Fast owner review order

1. THREAD PULL
2. X-RAY ARTICLE
3. SOURCE SPLIT
4. SAFE SURPRISE
5. TIME SCRUB
6. FIELD NOTES
7. CURIOSITY COMPASS
8. KNOWLEDGE NEARBY
9. DIVE STATION
10. DISCOVERY SHELVES

Decision question:

> **Which one makes you want to take one more step, while making you feel more—not less—in control of what the relationship means?**
