# KAWASEMI DIVE LAB D — NEWSROOM

Status: **isolated experimental implementation — 10 touchable prototypes built on `dive-lab-d-newsroom`; production integration intentionally deferred.**

Date: 2026-08-16

## 1. Scope

This LAB explores one question:

> How can newsroom / reporting / source-transparency mechanics make a reader want to go one level deeper into a news story without turning AI confidence, attribution, similarity, or source prestige into truth?

This is **not** a redesign of `demos/dive-focus-map/` and does not change production CARDS, LIVE, DIVE, or `docs/status/DIVE.md`.

Output:

- `demos/dive-lab-d/index.html`
- `demos/dive-lab-d/01-story-evolution/`
- `demos/dive-lab-d/02-source-ladder/`
- `demos/dive-lab-d/03-newsroom-notebook/`
- `demos/dive-lab-d/04-angle-switch/`
- `demos/dive-lab-d/05-claim-ledger/`
- `demos/dive-lab-d/06-signal-to-story/`
- `demos/dive-lab-d/07-what-changed/`
- `demos/dive-lab-d/08-source-collision/`
- `demos/dive-lab-d/09-beat-dive/`
- `demos/dive-lab-d/10-backstory/`

All story data in the demos is a clearly labeled **fictional fixture**. It does not describe a real incident or real organization.

## 2. Canonical constraints applied

Before implementation, the current repository baseline was reviewed, including:

- `README.md`
- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/FEATURE_MAP.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- `docs/DEMO_QUALITY_GATE.md`
- `docs/status/DIVE.md`
- `docs/status/LIVE.md`
- `docs/status/AI_DATA.md`
- `docs/DIVE_EXPERIENCE_V0_2.md`
- current production `index.html` / `kingfisher.css`
- `demos/dive-focus-map/`

Hard rules preserved in every prototype:

- AI confidence is not truth.
- attribution is not verification.
- same-event confidence is not truth confidence.
- historical similarity is contextual and not evidence for the present event.
- AI alone cannot make a claim `CONFIRMED`.
- `FACT`, `OBSERVATION`, `CLAIM`, `EVIDENCE`, and `UNKNOWN` remain distinguishable.
- conflicting Sources remain inspectable rather than being averaged into a synthetic middle conclusion.
- factual content keeps inspectable Source/provenance lineage.
- session history records observable navigation only; it never says the user learned, understood, mastered, believed, or agreed with something.

## 3. Research scan — current products / practices checked

The visual style of these products was **not** copied. The LAB extracted interaction mechanics from current newsroom, investigation, fact-checking, document, archive, and long-form tooling.

1. **DocumentCloud** — source documents are first-class objects; organize, annotate, search, embed, and publish primary documents. Mechanic extracted: *show the source, not merely the citation.*  
   https://www.documentcloud.org/
2. **MuckRock** — public-record requests expose request state, agency correspondence, and released documents. Mechanic: *the reporting process itself can be navigable state.*  
   https://www.muckrock.com/
3. **OCCRP Aleph / Aleph Pro** — cross-document search, people/company tracking, private investigations, timelines, and links across datasets. Mechanic: *an investigation can be resumed around entities, documents, and time rather than one article.*  
   https://docs.aleph.occrp.org/
4. **Bellingcat** — open-source investigation guides and tools emphasize reproducible verification paths. Mechanic: *verification is a sequence of inspectable operations, not a magic badge.*  
   https://www.bellingcat.com/resources/
5. **ICIJ Offshore Leaks Database** — relationships are explorable while the product explicitly warns that inclusion does not imply wrongdoing and identities must be confirmed. Mechanic: *powerful connections need equally visible non-inference boundaries.*  
   https://offshoreleaks.icij.org/
6. **Full Fact** — primary-source linking, multiple-source checking where possible, claim-focused evidence, visible corrections and updates. Mechanic: *claims, supporting material, and later corrections should remain linked but distinct.*  
   https://fullfact.org/about/how-we-fact-check/  
   https://fullfact.org/about/corrections/
7. **PolitiFact** — on-the-record sourcing, source lists, correction/update handling, and claim-by-claim review. Mechanic: *a claim can have a durable ledger rather than disappearing into article prose.*  
   https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/
8. **Reuters Fact Check** — traces claim origins, seeks evidence for and against, links public material, and separates correction / refile / update. Mechanic: *revision type is meaningful state.*  
   https://www.reuters.com/fact-check/about/
9. **ProPublica “How We Reported” methodology pieces** — exposes records, interviews, datasets, and reporting methods used to build an investigation. Mechanic: *the story can be decomposed back into the reporting process.*  
   https://www.propublica.org/article/sears-methodology-study
10. **AP News Verification / AP Verify** — combines source checks, metadata, geolocation, visual analysis, and collaborative verification workflow. Mechanic: *different evidence operations should stay individually auditable.*  
    https://www.ap.org/solutions/verify/
11. **The Guardian live-blog practice** — rolling posts make the changing state of a story visible rather than pretending every moment is a finished article. Mechanic: *incoming information and polished synthesis are different layers.*  
    https://www.theguardian.com/membership/2016/feb/04/inside-the-guardian-how-live-blog-changed--ews-reporting
12. **The New York Times Visual Investigations** — combines conventional reporting with digital sleuthing and forensic visual evidence. Mechanic: *evidence inspection can be part of the narrative path rather than hidden newsroom work.*
13. **Google Pinpoint** — search and analyze large document collections, transcripts, entities, notes, and archives. Mechanic: *the user can descend from a story into a working corpus.*  
    https://journaliststudio.google.com/pinpoint/about/
14. **Internet Archive Wayback Machine / Save Page Now** — preserves addressable versions of web pages through time. Mechanic: *a previous source state should remain inspectable after the live page changes.*  
    https://archivesupport.zendesk.com/hc/en-us/articles/360001513491-Save-Pages-in-the-Wayback-Machine
15. **Knight Lab TimelineJS** — chronology works best when events build a narrative rather than becoming a generic date list. Mechanic: *time should answer a story question, not merely display timestamps.*  
    https://timeline.knightlab.com/

### Extracted interaction principles

The strongest reusable principles were:

- descend from summary → publication → attachment → primary line;
- preserve revision/correction history instead of silently replacing text;
- expose what changed since the last visit;
- keep Source disagreement visible rather than synthesizing false consensus;
- let the reader see the reporting notebook state (`FACT` / `CLAIM` / `UNKNOWN`);
- decompose a polished sentence into the Signals / observations / claims that produced it;
- switch actor position without turning actor position into editorial truth;
- follow one claim or one beat over time;
- treat unanswered questions as useful persistent objects;
- preserve reporting history and Source lineage so an exploration can be resumed.

## 4. Shared fictional fixture and epistemic model

All 10 demos begin from the same CARDS-like story:

> 東湾市、沿岸浄水場でPFAS暫定基準超過　給水制限を開始、汚染源はなお未特定

The fixture deliberately contains information that is easy to conflate unless the interface keeps types separate:

- `FACT / OBSERVATION`: the city published an emergency notice and started a drinking-water response.
- `EVIDENCE`: a laboratory report records PFOS 34 ng/L + PFOA 28 ng/L = 62 ng/L for the fixture sample.
- `CLAIM`: a fictional company states that it does not believe its current discharge caused the event.
- `UNKNOWN`: source, route, and onset time of contamination are not established.
- `HISTORICAL CONTEXT`: an older monitoring record exists, but that similarity/history is not evidence that the same actor caused the current event.

The demos repeatedly state the key distinction:

> Confirming that “Organization A said X” confirms the attribution. It does **not** automatically confirm X.

## 5. Ten different interaction models

### 01 — STORY EVOLUTION

**Main action:** choose article versions: initial → update → correction → current.

The discovery moment is a correction that removes a location phrase capable of implying a causal actor. The interaction makes editorial change itself inspectable instead of silently mutating the current article.

Session value:

- versions actually opened;
- correction viewed;
- Source opened for a version;
- saved wording difference;
- unresolved question about why the earlier wording existed;
- last viewed version for Resume.

### 02 — SOURCE LADDER

**Main action:** repeatedly descend one level:

`ARTICLE → PUBLICATION → ATTACHMENT → PRIMARY LINE`

The discovery moment is reaching the exact source row showing that the article's “62 ng/L” is composed from two recorded measurements, while the same primary line says nothing about contamination source.

Session value:

- deepest level actually reached;
- exact source levels opened;
- primary row viewed;
- source sheet opened;
- saved discovery / open question;
- Resume returns to the deepest viewed level.

### 03 — NEWSROOM NOTEBOOK

**Main action:** open notebook items separated into:

- FACT / EVIDENCE RECORD;
- CLAIM / OBSERVATION;
- UNKNOWN / INVESTIGATING.

The discovery is that a resident observation can be important reporting material without being elevated to evidence of PFAS causation.

Session value:

- note IDs actually opened;
- status categories inspected;
- Source opened;
- unresolved investigative item explicitly kept.

### 04 — ANGLE SWITCH

**Main action:** switch the information lens between administration, residents, company, and regulator.

This does **not** switch “truth” or ask the user to choose a side. It switches which actor's Source position and unanswered questions are visible.

The discovery moment is that the company's wording concerns “current discharge,” while the regulator is sampling multiple possible routes.

Session value:

- lenses actually opened;
- Source opened under each lens;
- saved connection;
- last lens for Resume.

### 05 — CLAIM LEDGER

**Main action:** move through dated statements from the same organization.

The experience asks “what exactly changed in the wording?” rather than “did the organization flip-flop?”

The discovery is the narrowing of claim scope across time: process use → regulatory abnormality → current discharge causation.

Session value:

- statement dates opened;
- wording differences viewed;
- Source provenance opened;
- last claim date.

### 06 — SIGNAL → STORY

**Main action:** select an article sentence and decompose it into the Signal / Observation / Claim / Evidence objects used to construct the sentence.

The discovery moment is that “source remains unidentified” is not an AI uncertainty score; it is grounded in explicit investigation-status statements from Sources.

This is the strongest bridge between KAWASEMI's common AI/Data substrate, LIVE Signals, CARDS article prose, and DIVE provenance — while remaining an isolated prototype.

Session value:

- article sentences decomposed;
- source components opened;
- saved sentence-to-source connection;
- unresolved excluded/counter-evidence question;
- last decomposed sentence.

### 07 — WHAT CHANGED

**Main action:** start from only the items added since the previous visit, then reveal the earlier context on demand.

The discovery is that “new since last visit” may include an **article correction**, not only a new external event. Editorial changes and world changes remain distinguishable.

Session value:

- change items expanded;
- before-context revealed;
- Source opened;
- saved meaningful change;
- last expanded change.

### 08 — SOURCE COLLISION

**Main action:** choose the collision dimension (`current discharge`, `timing`, `route`) and explicitly cross-examine Source A against Source B.

The interface does not manufacture a compromise conclusion. It states where the propositions do not line up and what remains unresolved.

The discovery is that “we don't believe current discharge caused it” and “source not identified” do not cancel each other out; they are claims/statuses with different scopes.

Session value:

- collision dimensions compared;
- Sources opened on each side;
- unresolved mismatch saved;
- open question linked to the comparison;
- last comparison for Resume.

### 09 — BEAT DIVE

**Main action:** turn the single article into an ongoing beat: regulation, measurement, company, or residents.

The discovery is that today's event can be understood as a new turn in a longer reporting thread without treating the older thread as evidence for current causation.

Session value:

- beats opened;
- turns visited;
- Source opened;
- beat-specific open question;
- last beat.

### 10 — BACKSTORY

**Main action:** repeatedly ask one more “why today?” and peel backward through trigger → precondition → older context.

The key guardrail is explicit: older monitoring explains why the issue could be measured/reported today, but does not prove the current contamination source.

Session value:

- deepest backstory layer viewed;
- Sources opened at each layer;
- saved contextual connection;
- unanswered trigger question;
- Resume depth.

## 6. Shared DIVE SESSION behavior

Every demo implements local browser persistence with a separate storage key.

A session is **not** persisted merely because DIVE was opened. It becomes persistent after the first meaningful exploration action or an explicit Save/Open Question action.

Automatically retained observable state:

- anchor article;
- meaningful exploration actions actually performed;
- current / last focus;
- Source sheets opened after the session exists;
- explicit Saved Discoveries;
- explicit Open Questions;
- session timestamps;
- enough UI state to render the previous focus on Resume.

Not inferred or stored:

- “user understood X”;
- “user learned X”;
- “user believes X”;
- political ideology;
- completion percentage;
- knowledge score.

Common navigation:

- DIVE-level Back;
- return to origin article;
- DIVE SESSION sheet;
- Resume from article or Session sheet;
- CARDS / LIVE / DIVE dock remains visually consistent with the production grammar; LIVE is intentionally inert in this LAB.

## 7. Visual baseline

This LAB deliberately does **not** introduce a new visual design system.

Production-derived values retained include:

- dark background `#081113`;
- surface `#111f22` / `#15272a` family;
- kingfisher teal `#118995`;
- production-style system font stack;
- 62px topbar baseline and ~64px bottom dock;
- quiet borders, restrained radius, text-first hierarchy;
- 44px interactive target baseline;
- source sheets and article treatment consistent with current KAWASEMI grammar.

Visual differences exist only where an interaction model requires a distinct control, such as a version rail, source ladder, lens selector, claim timeline, collision split, or backstory stack.

## 8. QA performed

### Syntax / state-transition checks

PASS:

- `node --check demos/dive-lab-d/shared.js` equivalent local source.
- all 10 renderers produce valid state output for their deepest / most revealing state.
- custom deterministic state harness exercised each demo through 2–5 meaningful exploration actions.
- each sequence persisted a DIVE session after meaningful interaction.
- Source overlay content is available.
- Saved Discovery is retained.
- Open Question is retained.
- Session view shows observable action history.
- returning to article exposes Resume.

Meaningful actions exercised by demo:

- 01: 3 version moves;
- 02: 3 source descents;
- 03: FACT → CLAIM → UNKNOWN notes;
- 04: resident → company → regulator lens;
- 05: 2 dated-claim moves;
- 06: 3 sentence decompositions;
- 07: 3 prior-context reveals;
- 08: 5 collision/focus/compare operations;
- 09: 3 beat switches;
- 10: 3 backstory descents.

### Required static visual-render matrix

A 60-state visual matrix was rendered from the actual demo markup/CSS at:

- 320×568
- 375×667
- 390×844
- 430×932
- 844×390
- 1024×768 tablet landscape

The matrix was visually inspected, including 320px portrait stress and 844×390 landscape stress. Shared Source and Session sheets were separately rendered and inspected at 320×568, 390×844, and 844×390.

The inspection found no intended fixed control covering the top of content, no horizontal control layout that requires page-level horizontal scrolling, and no source/session close control hidden by the sheet. Long Japanese headline and long fictional Source names were included in the fixture specifically to stress wrapping.

### Important NOT TESTED

The container's installed Chromium is managed with a machine policy that blocks all URL/file navigation, so a real Chromium/Playwright viewport screenshot pass could not be truthfully completed in this workstream. The static render matrix above is useful layout evidence but does **not** replace the repository's browser quality gate.

Therefore these remain **NOT TESTED**:

- real browser visual/layout pass after the final CSS;
- actual pointer/touch event dispatch in Chromium/Safari (state transitions were exercised deterministically rather than through browser clicks);
- physical iPhone Safari;
- physical Android browser;
- VoiceOver / TalkBack;
- Dynamic Type / very large browser text scaling;
- production integration.

Do not mark this LAB as production-ready based on the static matrix.

## 9. Comparison

Scores are 1–5 and are comparative LAB judgments, not production approval.

| Demo | WOW | Curiosity | Deepens understanding | News fit | KAWASEMI uniqueness | Source transparency | Epistemic honesty | Smartphone | Landscape | v0.1 feasibility | Total / 50 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 STORY EVOLUTION | 4 | 4 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | 5 | **46** |
| 02 SOURCE LADDER | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **49** |
| 03 NEWSROOM NOTEBOOK | 4 | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | **46** |
| 04 ANGLE SWITCH | 4 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 4 | **45** |
| 05 CLAIM LEDGER | 4 | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 5 | **46** |
| 06 SIGNAL → STORY | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | **49** |
| 07 WHAT CHANGED | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | **47** |
| 08 SOURCE COLLISION | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | **48** |
| 09 BEAT DIVE | 4 | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 5 | 4 | **46** |
| 10 BACKSTORY | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 4 | **47** |

## 10. Recommended top three for owner comparison

### #1 — 06 SIGNAL → STORY

Why it stands out:

- It is unusually native to KAWASEMI's architecture: LIVE Signal / AI-Data provenance / CARDS article / DIVE exploration can conceptually meet here.
- It makes source transparency feel like discovery rather than compliance paperwork.
- It directly exposes where prose contains Observation, Claim, Evidence, or explicit Unknown status.
- A user can ask “where did this sentence come from?” without entering a generic graph or chatbot.

Primary risk: real production implementation requires high-quality sentence-to-provenance mapping; that data contract must remain conservative.

### #2 — 02 SOURCE LADDER

Why it stands out:

- It has the clearest one-sentence promise and is immediately understandable on a phone.
- Each descent gives a small reward: summary → publication → attachment → exact line.
- It naturally teaches the difference between “measurement Evidence exists” and “cause is known.”
- It is relatively feasible for a v0.1 if source lineage already exists.

Primary risk: not every article has a deep or clean source chain; the UI must simply show fewer levels rather than fabricate depth.

### #3 — 08 SOURCE COLLISION

Why it stands out:

- It converts disagreement into a reason to DIVE without rewarding outrage or forcing false balance.
- It directly embodies KAWASEMI's epistemic rules: claims can conflict or miss each other in scope while remaining unresolved.
- Landscape has a particularly strong investigative role, but the stacked smartphone version still works conceptually.

Primary risk: “collision” detection must not be based on superficial semantic difference. A production version needs relation/scope typing strong enough to avoid manufacturing conflict.

### Strong fourth candidate — 07 WHAT CHANGED

`WHAT CHANGED` is less visually surprising but could become one of the most practically useful return loops because it gives a reason to resume a DIVE later. It may combine especially well with DIVE SESSION in a future experiment, but no production combination is proposed by this LAB.

## 11. Decision boundary

This LAB recommends **comparison only**.

It does **not** propose:

- selecting a production DIVE architecture yet;
- merging any of these mechanics into production CARDS/LIVE/DIVE;
- replacing `DIVE_EXPERIENCE_V0_2.md`;
- deleting or visually reworking `demos/dive-focus-map/`;
- changing the shared AI/Data verification policy.

The next product evidence should come from hands-on owner comparison of the ten mechanics, especially 06 / 02 / 08, followed by a deliberate experience decision rather than visual convergence by default.
