# KAWASEMI DIVE Experience Spec v0.2

Status: **working experience specification for the next isolated prototype**  
Scope: experience contract first; **not a production UI contract**.

The existing `demos/dive-focus-map/` prototype remains preserved as technical / interaction evidence. FOCUS MAP is not assumed to be the final DIVE UI, and the next phase must not become a visual-polish pass on that demo.

---

## 1. One-sentence definition

> **DIVE is a source-grounded exploration session where one piece of information becomes multiple understandable paths, the user chooses where to go, and the observable trail of that exploration can be resumed later without AI claiming what the user learned or understood.**

DIVE is not valuable merely because it can show “more information.”

Its distinctive value is the combination of:

1. **directional choice** — Evidence / Claims / Confirmed / Unknown / Context / History / People / Technology / Economics / Politics / Impact, depending on what actually exists;
2. **typed connections** — the user can understand *why* two things are connected;
3. **source grounding** — factual connections remain inspectable back to provenance;
4. **exploration memory** — what the user actually viewed and how they got there remains available as a DIVE SESSION;
5. **resume** — the user can leave without finishing the world and continue from the same place later.

The desired feeling is:

> “I started from one story, followed the direction I cared about, found a connection I did not expect, understood why it was connected, and I can come back to exactly this exploration later.”

---

## 2. Experience thesis: what DIVE can do that CARDS / LIVE / chatbot / Wikipedia cannot

### CARDS
Answers: **What do I need to check?**

- finite review queue;
- completion matters;
- article is the reading surface;
- optimized for catching up.

### LIVE
Answers: **What is happening now?**

- incoming / changing information;
- source activity;
- raw or lightly processed signals remain visible;
- optimized for observation.

### DIVE
Answers: **What does this connect to, and where do I want to go from here?**

- open-ended but user-directed;
- one anchor can branch into different semantic directions;
- connections remain typed and source-grounded;
- the user's *route through the information* becomes useful state;
- optimized for understanding through exploration rather than completion.

### SAVED
Answers: **What did I deliberately decide to keep?**

SAVED is an intentional archive. DIVE HISTORY is not.

A user may view 20 DIVE nodes and save only one discovery. The 20 viewed nodes remain observable session history; only the one explicitly saved item becomes a deliberate saved discovery.

---

## 3. The strongest core loop

```text
ANCHOR
one article / event / signal / saved item

↓

CHOOSE A DIRECTION
Evidence / Claims / Unknown / History / People / Technology / Impact ...

↓

INSPECT A CONNECTION
What is this?
Why is it connected?
What source supports this connection?

↓

CHOOSE AGAIN
Go deeper / move sideways / go back

↓

KEEP ONLY WHAT MATTERS
Save a discovery and/or keep a question open

↓

LEAVE WHEN READY
Session state is preserved automatically

↓

RESUME
Return to the last position, route, saved discoveries, and open questions
```

There is **no required finish state** for DIVE.

The loop succeeds when curiosity produces a traceable next question or connection, not when the product maximizes time spent.

---

## 4. First DIVE

### Entry

A DIVE SESSION has an **anchor**.

Possible anchors:
- CARDS article;
- LIVE Event / Event Cluster;
- SAVED article or discovery;
- a topic selected from DIVE Home.

For the next prototype, the primary anchor remains one CARDS-like article because it makes the experience easy to evaluate.

### First screen requirement

The first DIVE state must answer immediately:

1. **What am I exploring?** — anchor is obvious.
2. **Where can I go?** — 4–7 meaningful directions that actually contain information.
3. **Why would I choose each direction?** — category + plain-language question.
4. **How do I get back?** — clear return path.

Example:

- `EVIDENCE` — 何が根拠になっている？
- `CLAIMS` — 誰が何を主張している？
- `UNKNOWN` — まだ何が分からない？
- `HISTORY` — 過去に似たことは？
- `PEOPLE` — 誰が関わっている？
- `TECHNOLOGY` — どんな技術が関係している？
- `IMPACT` — 何に影響する？

Do not show empty categories merely to keep the shape symmetrical.

### First-session creation rule

Entering DIVE may create an in-memory draft session, but **do not pollute history with accidental opens**.

Persist the session once the user performs the first meaningful exploration action, for example:
- moves from the anchor to another node;
- explicitly saves a discovery;
- explicitly keeps an open question.

---

## 5. Deeper exploration

A user action changes the **current focus**, not the product's opinion of what matters.

Each move must preserve:

- `from` node;
- `to` node;
- typed relation;
- source / evidence references where applicable;
- time opened;
- parent step in the session route.

The visible neighborhood should remain deliberately limited. The current FOCUS MAP demo uses 5–7 outward nodes; this is useful interaction evidence, not a final rendering requirement.

The durable requirement is:

> **Show only a small number of understandable next paths around the current focus, then expand on demand.**

A future UI could render those paths spatially, as structured lanes, as an editorial field, or another interaction form. The experience contract does not require a giant graph.

### Deep vs sideways

Do not create separate modes for “deep” and “sideways.”

The same action should support both:
- `Evidence → Satellite imagery → Capture time` = deeper;
- `Satellite imagery → History` = sideways.

The relation type explains what kind of move occurred.

---

## 6. Discovery: the reason to want to DIVE

DIVE should make **non-obvious but explainable connections discoverable**.

A good discovery is not random novelty. It must satisfy all of:

1. it is relevant to the current focus through a typed relation;
2. the relation is understandable in plain language;
3. factual grounding remains inspectable;
4. it does not silently change contextual similarity into evidence;
5. the user chooses whether to follow it.

Example:

```text
Current event
→ Technology
→ navigation method
→ historical deployment constraint
→ economic / infrastructure consequence
```

The user may not have predicted that path when opening the article, but every step is explainable.

### AI's role in discovery

AI may:
- identify candidate nodes;
- type relations;
- deduplicate paths;
- explain why a path exists;
- organize the small set of available directions;
- generate further structure on demand.

AI must not:
- present one path as “the next thing you should read” by default;
- visually privilege a political interpretation because it predicts engagement;
- turn an AI novelty score into hidden editorial truth;
- invent a connection simply to make DIVE feel surprising.

If no credible connection exists, show fewer paths.

---

## 7. Relation semantics remain a hard contract

DIVE must preserve typed relations such as:

- `supports`
- `contradicts`
- `claims`
- `confirms`
- `source_of`
- `context_for`
- `historically_similar_to`
- `affects`
- `caused_by`
- `part_of`
- `explains`
- `technical_dependency`

The user must be able to answer:

> **Why are these two things connected?**

Color alone is never enough.

### Critical invariant

`historically_similar_to` is contextual.

It is never silently promoted to `supports`, and it cannot change verification state for the current event merely because a past event looks similar.

---

## 8. DIVE SESSION is a first-class product object

The key v0.2 change is that a DIVE is not merely a temporary screen state.

A **DIVE SESSION** records observable exploration activity.

### Automatically record only observable facts

Allowed automatic session history:
- anchor item;
- nodes actually opened;
- route / branch actually taken;
- relation used for each move;
- timestamps;
- active exploration time;
- last current position;
- explicit saved discoveries;
- explicit open questions;
- origin article + scroll position when applicable.

### Do not infer cognition

Never automatically store or say:
- “you learned X”;
- “you understood X”;
- “you mastered X”;
- “you believe X”;
- “you agree with X”;
- “you are interested in this viewpoint” merely because the route was visited.

A route is evidence of navigation, not belief or understanding.

### Proposed session shape

This extends the existing `DiveNode` / `DiveRelation` data without changing their epistemic meaning.

```ts
type DiveSession = {
  id: string;
  anchor: {
    type: 'article' | 'event' | 'signal' | 'saved_item' | 'topic';
    id: string;
    label: string;
    originArticleId?: string;
    originScrollPosition?: number;
  };
  startedAt: string;
  lastActiveAt: string;
  activeDurationMs: number;
  currentStepId: string;
  steps: DiveSessionStep[];
  savedDiscoveryIds: string[];
  openQuestionIds: string[];
  state: 'active' | 'paused' | 'archived';
};

type DiveSessionStep = {
  id: string;
  parentStepId?: string;
  nodeId: string;
  viaRelationId?: string;
  openedAt: string;
};
```

`parentStepId` matters: if the user goes back and takes another branch, the session can preserve both paths instead of pretending the exploration was one linear chain.

### Exploration time

`activeDurationMs` should represent approximate active DIVE time, not raw wall-clock time with a forgotten background tab.

Pause counting when the document is hidden / inactive for a reasonable idle threshold. It is activity metadata, not productivity scoring.

---

## 9. Saved discoveries

A **Saved Discovery** is an explicit user action inside DIVE.

It can save:
- a node;
- a typed connection / relation;
- an evidence item;
- a claim + its current verification context;
- an unresolved item the user wants to retain.

Minimum record:

```ts
type SavedDiscovery = {
  id: string;
  sessionId: string;
  nodeId?: string;
  relationId?: string;
  savedAt: string;
  routeStepId: string;
  sourceIds: string[];
  evidenceIds: string[];
};
```

The important difference is:

- **viewed in DIVE** = automatic observable history;
- **saved discovery** = deliberate keep.

Do not automatically convert every visited node into SAVED.

### Relationship to global SAVED

Long term, global SAVED may contain multiple object types (`Article`, `Discovery`, etc.).

For the next isolated prototype, it is enough to show saved discoveries inside the session and DIVE Home. Production SAVED integration is not required yet.

---

## 10. Unresolved / open questions

Two different concepts must remain separate.

### `UNKNOWN`
An epistemic state in the underlying information.

Example:
- attack origin not independently confirmed;
- weapon type not established.

### `OPEN QUESTION`
A user-controlled session object: “I want to return to this question.”

An Open Question can be created from an UNKNOWN node, but it can also be a question raised by context or evidence.

```ts
type DiveOpenQuestion = {
  id: string;
  sessionId: string;
  text: string;
  createdAt: string;
  linkedNodeIds: string[];
  linkedRelationIds: string[];
  state: 'open' | 'dismissed';
};
```

AI may propose wording for an open question, but it enters the user's persistent list only after an explicit user action.

Do not say that an Open Question means the user “does not understand” something.

Future data updates may say **new evidence is available for this question**. They should not automatically say the question is resolved unless the underlying verification rules actually support that conclusion.

---

## 11. DIVE HISTORY and resume

There is a naming collision to avoid:

- `HISTORY` inside an exploration = historical context direction;
- past user exploration = **DIVE HISTORY / Recent Dives**.

Inside DIVE UI, prefer `RECENT DIVES` or `SESSIONS` for past explorations so `HISTORY` keeps its epistemic meaning.

### DIVE Home should prioritize continuation

Conceptual order:

1. **CONTINUE** — most recent paused DIVE;
2. **RECENT DIVES** — previous sessions;
3. optionally start another exploration.

A recent-session item may show only observable metadata:

- anchor title;
- last visited focus;
- last active time;
- approximate active exploration time;
- number of explicitly saved discoveries;
- number of explicitly kept open questions.

No completion percentage. No “knowledge level.”

### Resume contract

Resume restores:
- current step;
- route / branch history;
- saved discoveries;
- open questions;
- session anchor;
- originating article context where relevant.

The user should reach the previous current position within one or two actions from DIVE Home.

### History must not be rewritten by later AI output

A previous session is a record of what the user actually saw at that time.

If underlying information changes later:
- preserve the historical route;
- attach new/updated data separately;
- do not silently rewrite the old path as though the user had seen the new information.

A future version may show `UPDATED SINCE THIS DIVE`, but that is not required for the first implementation slice.

---

## 12. Trail vs Session History

These are related but different.

### DIVE TRAIL
Immediate navigation aid for the current branch.

Example:

`Event › Evidence › Satellite imagery › History`

It answers: **Where am I right now and how did I get here on this branch?**

### DIVE SESSION HISTORY
Persistent record of the entire exploration, including branches taken after going back.

It answers: **What did I actually look at during this dive, and where can I resume?**

The current FOCUS MAP demo validates a linear trail interaction. v0.2 adds the persistent session model underneath it.

---

## 13. Portrait and Landscape roles

Portrait and Landscape must use the **same session and information model**. Orientation must not create two different DIVE products.

### Portrait
Best for:
- quick curiosity from CARDS;
- one current focus at a time;
- one-handed use;
- following one branch with minimal context chrome.

Primary experience:

> anchor → direction → focus → next direction

The origin article can be returned to exactly, and context can be reopened when needed.

### Landscape
Best for:
- investigation / comparison;
- keeping the originating article or current context visible;
- inspecting relation / source detail without losing the current exploration;
- wider presentation of multiple next directions.

Promising structure:

```text
LEFT
origin article / current context

RIGHT
current DIVE focus / available paths
```

The existing demo provides useful evidence for this two-pane hypothesis.

Do not force rotation. Landscape is a responsive enhancement, not a required gateway to “serious” DIVE.

---

## 14. The role of the current FOCUS MAP demo

Keep `demos/dive-focus-map/`.

It has already validated useful interaction primitives:
- small visible neighborhood;
- typed relations;
- question labels;
- deeper + sideways movement;
- trail/back;
- article return state;
- Drag to DIVE feasibility;
- Landscape context + exploration split.

But it **does not prove that FOCUS MAP is the final visual architecture**.

Do not spend the next phase polishing node shapes, graph lines, decorative motion, or spatial aesthetics unless a concrete experience test requires it.

The next prototype should test **session value**:

- Do I want to continue exploring?
- Did I find something useful / unexpected?
- Do I understand why it connects?
- Can I keep only the discovery I care about?
- Can I leave a question open?
- Can I return tomorrow and immediately know where I was?

---

## 15. What DIVE must not become

### Not Wikipedia navigation
Do not reduce DIVE to pages of encyclopedic links.

### Not related articles
A generic similarity list does not explain relation semantics or preserve a user route.

### Not an AI chatbot
The primary interaction is not “ask AI and receive an answer.” Free-form questions may become an input later, but answers must still land inside the source-grounded exploration structure.

### Not a mind map / graph database viewer
The user should never need graph-literacy to use DIVE. Nodes and edges are an internal model, not the product purpose.

### Not a Skill Tree
No levels, completion percentages, unlocks, XP, streaks, mastery, or learning-path gamification.

### Not a knowledge-profile inference engine
Do not transform route history into claims about the user's beliefs, ideology, knowledge, or comprehension.

### Not an engagement tunnel
Do not optimize DIVE to keep the user exploring indefinitely. Leaving and resuming later is a first-class successful outcome.

---

## 16. Minimum implementation slice — DIVE Experience v0.1

The next isolated prototype should implement the smallest end-to-end loop that tests whether session memory makes DIVE worth returning to.

### Required

1. **Start DIVE SESSION from one article**
   - anchor article ID;
   - exact origin scroll position.

2. **Show 4–7 real available exploration directions**
   - category + question label;
   - no recommendation ranking language.

3. **Explore at least three semantic directions**
   - EVIDENCE;
   - HISTORY;
   - one of PEOPLE / TECHNOLOGY / IMPACT / CLAIMS;
   - include at least one non-obvious but grounded sideways connection.

4. **Typed relation inspection**
   - relation name;
   - plain-language explanation;
   - demo provenance;
   - explicit `historically_similar_to ≠ supports` behavior.

5. **Persistent session route**
   - store steps;
   - preserve parent step so branching survives backtracking;
   - current step / resume position.

6. **Save Discovery**
   - save one node or relation explicitly;
   - show it in current session summary.

7. **Keep Open Question**
   - explicit user action;
   - show it in current session summary.

8. **Leave DIVE and resume**
   - DIVE Home shows `CONTINUE` and `RECENT DIVES`;
   - resume returns to current step and restores route.

9. **Return to article**
   - restore exact origin article and scroll position.

10. **Portrait + Landscape**
   - same session state;
   - Landscape may keep origin/context visible in a second pane;
   - no forced rotation.

11. **Observable-only history**
   - timestamps / active duration / viewed route / explicit saves / explicit open questions only;
   - no inferred `learned`, `understood`, `believes`, or viewpoint profile.

### Persistence for the isolated prototype

Use local browser persistence only (`IndexedDB` preferred; `localStorage` is acceptable for a very small fixture) so the experience can be tested across reloads without production backend work.

Do not integrate production CARDS / LIVE / SAVED databases yet.

### Not required in v0.1

- real AI generation;
- production source ingestion;
- cross-device sync;
- global SAVED integration;
- automatic “updated since your dive” detection;
- free-form chatbot;
- full world graph;
- graph pan / zoom as a product requirement;
- session sharing;
- collaborative research;
- inferred learning model;
- production notification strategy.

---

## 17. Experience success criteria for the next prototype

A prototype is successful only if an evaluator can complete this story:

1. start from an article;
2. choose their own direction;
3. reach a connection that was not obvious from the article alone;
4. understand why it is connected and inspect provenance;
5. save one discovery;
6. keep one question open;
7. leave the session;
8. return to DIVE Home later;
9. identify the previous dive without remembering the UI;
10. resume at the previous position with route / save / open question intact;
11. return to the original article context.

The evaluator should **not** encounter language claiming what they learned, understood, believed, or completed.

---

## 18. Product principle summary

The v0.2 experience direction is:

> **KAWASEMI remembers the user's exploration, not a theory about the user's mind.**

The product may preserve what the user opened, how they moved, what they deliberately saved, what they deliberately left open, and where they stopped.

The user remains responsible for interpretation and judgment.
