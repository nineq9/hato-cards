# KAWASEMI DIVE TOP 10 — Production-Quality Synthesis

Status: **OWNER_REVIEW_READY — isolated demos only; production integration not approved**  
Branch: `dive-top10-synthesis`  
Scope: `demos/dive-top10/` only. Existing `demos/dive-focus-map/` is preserved unchanged.

## 1. What this synthesis is trying to answer

The question is no longer “what can DIVE draw?” It is:

> **What DIVE experience is valuable enough that a user would deliberately enter it from a news story, choose another step, discover something useful, and want to return later — without KAWASEMI deciding what the user should believe?**

The ten demos deliberately share one fictional article fixture and the same KAWASEMI visual grammar. The variable is the **experience mechanism**, not a different color palette or decorative layout.

The fictional fixture prevents a UI prototype from accidentally presenting invented current-news claims as real. Every source sheet states what that fixture can and cannot establish.

## 2. Canonical constraints used

Read before implementation:

- `README.md`
- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/FEATURE_MAP.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- `docs/DEMO_QUALITY_GATE.md`
- `docs/DIVE_EXPERIENCE_V0_2.md`
- `docs/status/DIVE.md`
- `docs/status/LIVE.md`
- `docs/status/AI_DATA.md`
- current production `index.html` / `kingfisher.css`
- `demos/dive-focus-map/README.md`

At branch creation time, canonical `main` had no `docs/labs/` directory and no persisted DIVE LAB result files. The synthesis therefore does not invent unavailable LAB findings. It uses the canonical product rules, the persisted FOCUS MAP evidence, and the LAB directions named in the Product Owner brief: discovery/serendipity, play/learning, investigation/time, newsroom/source transparency, network/deep exploration, and curiosity psychology.

Hard invariants preserved in all ten demos:

- AI confidence is not truth confidence.
- Attribution is not verification.
- Same-event confidence is not truth confidence.
- Historical similarity is context, not evidence.
- AI alone cannot mark a proposition confirmed.
- Sources and provenance remain inspectable.
- The user chooses the next direction; there is no single AI recommendation tunnel.
- Observable route history is not interpreted as belief, learning, or ideological preference.

## 3. Why these ten survived the filter

The earlier concept space collapses into ten genuinely different reasons to enter DIVE:

1. **Choose the question** — explore by semantic intent.
2. **Inspect the evidence** — test what a claim rests on.
3. **See what changed** — understand revision over time.
4. **Descend to the source** — trace information to origins.
5. **Separate competing claims** — see disagreement without false synthesis.
6. **Find an explainable surprise** — discover a non-obvious typed connection.
7. **Peel dependencies** — expose constraints behind the visible event.
8. **Keep a casebook** — preserve route, discoveries, and open questions.
9. **Trace a story back to LIVE** — see the raw signals that became the article.
10. **Resume without rewriting history** — keep the old exploration and layer new information separately.

These are not ten skins of FOCUS MAP. Several contain no graph-like visualization at all.

---

## 4. The ten demos

### 01 — QUESTION FIELD

**One-line concept:** 問いを選ぶと、同じニュースが違う方向に開く。  
**Why exciting:** “次の記事”ではなく“次の問い”を自分で選ぶため、DIVEが自分の探索になる。  
**Core interaction:** Evidence / Claims / Unknown / History / Technology / Impact などの問いを選び、接続理由を辿る。  
**Understanding:** 何を知りたいかを保ったまま深くも横にも進める。  
**Risk:** 選択肢が多すぎると選択疲れが起きる。空カテゴリを出してはいけない。  
**Implementation note:** Existing `DiveNode` / typed `DiveRelation` can be projected through a thin question layer.  
**Best form:** Portrait-first; landscape can widen the same model without changing it.

### 02 — EVIDENCE DESK

**One-line concept:** 記事の主張を、根拠・帰属された主張・未確認に分けて机の上で見る。  
**Why exciting:** “この記事は何に立っている？”を一手でほどける。  
**Core interaction:** 検査したいClaimを選び、supporting material / attributed claim / not established を比較する。  
**Understanding:** 断定の強さ、根拠の位置、まだ検証できていない部分が見える。  
**Risk:** 根拠が乏しいニュースでは画面が薄くなる。それは埋めるのではなく、そのまま表現すべき。  
**Implementation note:** Current Claim / Evidence / Verification data contract maps directly.  
**Best form:** Landscape two-pane is especially valuable; portrait remains usable as stacked panes.

### 03 — CHANGE LENS

**One-line concept:** このニュースが前回から何を変えたかだけを追う。  
**Why exciting:** 継続案件で同じ説明を読み直さず、新しい部分だけを発見できる。  
**Core interaction:** Updateを選び、Before / Now とその更新sourceを見る。  
**Understanding:** 新情報と既知情報、revisionの時系列が分かる。  
**Risk:** 初回閲覧では価値が弱い。  
**Implementation note:** LIVE new-since cursor + Article revisions + provenance can feed it.  
**Best form:** Portrait-first; recurring monitoring is the main use case.

### 04 — SOURCE DESCENT

**One-line concept:** 要約から出所へ、情報がどこから来たかを一段ずつ降りる。  
**Why exciting:** “その話の元は何？”を摩擦なく追える。  
**Core interaction:** Structured article → attributed release → original document → planning/source material.  
**Understanding:** Each source’s scope: what it can confirm and what it cannot.  
**Risk:** Original material may be unavailable or incomplete; descent must be allowed to stop honestly.  
**Implementation note:** Mostly a provenance projection over source refs, so it is comparatively low-risk to implement.  
**Best form:** Portrait-first.

### 05 — CLAIMS MATRIX

**One-line concept:** 対立する人ではなく、対立する主張そのものを並べる。  
**Why exciting:** “誰が正しい？”の前に“どこが一致し、どこが食い違う？”が分かる。  
**Core interaction:** All / agreed points / conflicts & unresolved を切り替え、各claim sourceへ降りる。  
**Understanding:** Dispute structure without collapsing multiple actors into a false two-sided summary.  
**Risk:** Large events can produce too many claims; clustering must stay explainable.  
**Implementation note:** Natural projection from actor-attributed Claim records.  
**Best form:** Landscape valuable for comparison; portrait uses vertical separation.

### 06 — EXPLAINABLE WORMHOLES

**One-line concept:** 意外だが説明できる接続を、数本だけ横に抜ける。  
**Why exciting:** “そこにつながるのか”という DIVE-specific discovery moment can happen without a giant graph.  
**Core interaction:** Choose one of a few non-obvious typed connections, inspect why it connects, then continue sideways/deeper.  
**Understanding:** Technical, institutional, geographic, historical, and economic context that a single article does not surface.  
**Risk:** Optimizing for surprise can generate weak or misleading relevance. Every hop requires typed relation + provenance; fewer paths are better than invented novelty.  
**Implementation note:** Requires the strongest relation-generation/evaluation quality of the ten.  
**Best form:** Portrait-first; landscape can show the origin/context beside the path.

### 07 — DEPENDENCY PEEL

**One-line concept:** 出来事を“何に依存しているか”で一層ずつ剥がす。  
**Why exciting:** 表面の理由から、その下の constraint / technical dependency / capacity に潜れる。  
**Core interaction:** Peel one layer at a time; inspect the source and relation at the current layer.  
**Understanding:** Cause, constraint, and technical dependency are not treated as the same thing.  
**Risk:** A dependency can be mistaken for “the cause.” Relation wording must remain conservative.  
**Implementation note:** Best when `caused_by`, `technical_dependency`, `context_for`, and constraint relationships are structurally distinct.  
**Best form:** Portrait-first.

### 08 — DIVE CASEBOOK

**One-line concept:** 探索すると、保存した発見と未解決の問いだけが静かに残る。  
**Why exciting:** DIVE becomes something worth returning to instead of a disposable screen.  
**Core interaction:** Explore → explicitly Save Discovery / Keep Open Question → leave → Continue → resume exact route.  
**Understanding:** The user can preserve what mattered without KAWASEMI pretending every viewed item was learned or saved.  
**Risk:** If session chrome becomes too prominent, DIVE starts feeling like project-management software.  
**Implementation note:** Direct test of `DIVE_EXPERIENCE_V0_2` session model; local fixture state in demo, production persistence deferred.  
**Best form:** Landscape is valuable for casebook + current focus; portrait should keep session UI quiet.

### 09 — SIGNAL TRACEBACK

**One-line concept:** 完成した記事から、LIVEで何がどう到着したかを逆向きに見る。  
**Why exciting:** The editorial/AI transformation becomes inspectable instead of invisible.  
**Core interaction:** Article → grouped Signals → individual raw/source item → grouping reason.  
**Understanding:** Where the story came from and why items were considered likely same-event, without equating grouping with truth.  
**Risk:** Raw-signal volume can overwhelm the user. Default should stay focused and expand on demand.  
**Implementation note:** Shares the common LIVE Signal / EventCluster substrate; grouping is explicitly labeled a hypothesis.  
**Best form:** Landscape is especially useful for story ↔ signals comparison.

### 10 — RESUME + UPDATED

**One-line concept:** 前回の探索はそのまま残し、新しい情報だけを上に重ねて再開する。  
**Why exciting:** A DIVE becomes a living investigation without rewriting what the user actually saw last time.  
**Core interaction:** Explore → leave → resume prior snapshot → separately open “Updated since this dive”.  
**Understanding:** What was known then versus what arrived later.  
**Risk:** Version/state complexity grows quickly with real backend synchronization.  
**Implementation note:** Requires immutable/revisioned session snapshot + a separate update layer; never silently mutate historical route content.  
**Best form:** Portrait-first; landscape adds comparison value later.

---

## 5. Comparative evaluation

Scores are **1–5** and are intentionally product-weighted rather than “visual wow” scores. Higher `Landscape value` means landscape materially improves that concept; it is not a penalty against portrait concepts.

| # | Concept | WOW | Want to use | Understanding | Source transparency | Epistemic honesty | KAWASEMI fit | Smartphone | Landscape value | Feasibility | Production potential |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 | Question Field | 4.9 | 5.0 | 4.9 | 4.7 | 5.0 | 5.0 | 5.0 | 4.1 | 4.8 | 5.0 |
| 02 | Evidence Desk | 4.4 | 4.8 | 5.0 | 5.0 | 5.0 | 4.9 | 4.1 | 5.0 | 4.6 | 4.9 |
| 03 | Change Lens | 4.5 | 5.0 | 4.9 | 4.8 | 5.0 | 5.0 | 4.9 | 3.8 | 4.6 | 5.0 |
| 04 | Source Descent | 4.0 | 4.5 | 4.8 | 5.0 | 5.0 | 4.9 | 5.0 | 3.2 | 4.9 | 4.8 |
| 05 | Claims Matrix | 4.3 | 4.7 | 5.0 | 5.0 | 5.0 | 4.9 | 4.1 | 4.9 | 4.5 | 4.8 |
| 06 | Explainable Wormholes | 5.0 | 4.7 | 4.7 | 4.6 | 4.5 | 5.0 | 4.7 | 4.2 | 3.6 | 4.5 |
| 07 | Dependency Peel | 4.5 | 4.5 | 4.9 | 4.6 | 4.7 | 4.8 | 4.8 | 3.6 | 4.1 | 4.6 |
| 08 | DIVE Casebook | 4.5 | 4.9 | 4.7 | 4.5 | 5.0 | 5.0 | 4.4 | 5.0 | 4.5 | 5.0 |
| 09 | Signal Traceback | 4.5 | 4.6 | 4.8 | 5.0 | 5.0 | 5.0 | 4.0 | 4.9 | 4.3 | 4.7 |
| 10 | Resume + Updated | 4.6 | 5.0 | 4.9 | 4.8 | 5.0 | 5.0 | 4.9 | 4.0 | 4.3 | 5.0 |

### Top 3 owner-facing experiences

1. **01 — QUESTION FIELD**  
   Strongest candidate for the *front door / core navigation grammar* of DIVE. It is unique to DIVE, works on a phone, preserves user direction, and can host multiple specialized renderers later without becoming an AI recommendation chain.

2. **02 — EVIDENCE DESK**  
   Strongest “serious-news value” experience. It makes KAWASEMI’s epistemic philosophy tangible instead of hiding it in labels or policy text. It is particularly strong in landscape.

3. **03 — CHANGE LENS**  
   Strongest recurring-use value. For a journalist or anyone following a developing story, “what changed since last time?” is a reason to reopen DIVE repeatedly.

### Most likely one concept

**01 — QUESTION FIELD.**

Reason: it is the most convincing **DIVE-shaped interaction model**, not merely a valuable panel. It answers “where do I want to go next?” without a graph-tool feel, chatbot feel, or AI recommendation tunnel. It can remain quiet in Portrait, while Landscape can add article/context without changing the mental model.

### Easiest to bring toward production first

**04 — SOURCE DESCENT.**

Reason: source sheets, source refs, provenance, and current source metadata already exist conceptually in KAWASEMI. The UI is simple, smartphone-friendly, and does not require advanced relation generation. It is not the full DIVE answer, but it is a high-confidence production slice.

### Most interesting long-term bet

**06 — EXPLAINABLE WORMHOLES.**

Reason: it creates the strongest “I would not have found that connection by just reading the article” moment. It is also the most dangerous if relation generation is weak, so it should come **after** typed relation/provenance quality is proven.

## 6. The synthesis underneath the ranking

The demos suggest that DIVE should probably not choose one visual gimmick and use it for everything.

The strongest eventual product architecture is likely:

```text
ARTICLE / LIVE / SAVED ANCHOR
        ↓
QUESTION FIELD            ← the user chooses semantic direction
        ↓
SPECIALIZED INSPECTOR     ← Evidence Desk / Change Lens / Source Descent / Claims / etc.
        ↓
TYPED CONNECTION + SOURCE
        ↓
QUIET SESSION MEMORY      ← Casebook / route / Saved Discovery / Open Question
        ↓
RESUME + UPDATED          ← preserve the old session; layer new information separately
```

This is **not a production decision yet**. It is the clearest hypothesis produced by comparing the ten demos.

FOCUS MAP remains useful as interaction evidence for small-neighborhood spatial exploration, Drag to DIVE, trail/back, and landscape context. It should not be deleted, but it no longer needs to carry every DIVE use case visually.

## 7. Visual system and intentional differences

Preserved from production / canonical design:

- deep charcoal / blue-black background (`#081113` family),
- soft off-white text,
- restrained kingfisher teal,
- system Japanese sans stack,
- subtle borders and tonal surfaces,
- restrained rounded corners,
- minimal topbar and small geometric kingfisher mark,
- no large wordmark,
- no neon/glow/cyberpunk,
- no giant graph,
- no game-tree styling,
- no generic AI chatbot layout,
- source as a sheet rather than context-destroying navigation.

Intentional differences from current production:

- demos use their own isolated DIVE article fixture rather than production article state;
- different layouts are used only where the experience benefits from comparison (notably 02, 05, 08, 09);
- a small demo-info control exposes concept/risk/implementation metadata for owner comparison;
- the session strip is demo-local and not production global navigation.

No production `index.html`, `kingfisher.css`, `kingfisher.js`, CARDS gesture code, LIVE demo, or FOCUS MAP demo was modified by this work.

## 8. QA performed

Browser rendering used the **exact generated demo HTML/CSS/JS** in local Chromium via Playwright `set_content`. Direct `file://` / localhost navigation is blocked by the execution environment’s browser policy, so URL loading itself remains separately unverified until published/served.

### Interaction QA — PASS

At 390×844 Chromium:

- PASS — all 10 demos render without page errors.
- PASS — article → DIVE entry works in all 10.
- PASS — each demo executes its concept-specific 2–4+ step interaction path.
- PASS — source/provenance sheet opens and closes.
- PASS — Back path smoke works.
- PASS — explicit return to article works.
- PASS — session/history/resume behavior is touchable where relevant (08, 10).
- PASS — Signal grouping caveat is touchable in 09.
- PASS — historical-similarity caveat is visible where used.

### Required visual viewport matrix — PASS for inspected demo states

Captured and visually inspected representative DIVE states at:

- 320×568
- 375×667
- 390×844
- 430×932
- 844×390
- 1024×768

Automated checks across **60 representative DIVE captures**:

- PASS — 0 horizontal-overflow failures.
- PASS — 0 remaining flagged undersized demo buttons after route-control correction.

Additional screenshot inspection:

- PASS — index at 320×568, 390×844, 1024×768; 10 links visible and no horizontal overflow.
- PASS — long Japanese article headline at 320×568, 430×932, 844×390, 1024×768.
- PASS — common source sheet at 320×568, 390×844, 844×390, 1024×768; short landscape/small portrait content is scrollable rather than clipped.
- PASS — no observed text overlap, control overlap, obvious clipping, or fixed UI covering the main content in reviewed states.

A first screenshot pass exposed the common DIVE entry/session UI as an unnecessary fixed overlay over content. It was changed to normal document flow before final visual review. A first touch-target pass also exposed route buttons below the 44px baseline; they were corrected and rechecked.

### NOT TESTED

- physical iPhone Safari / real safe-area browser chrome,
- physical Android browser,
- VoiceOver / TalkBack,
- full keyboard + screen-reader focus management in sheets,
- browser text enlargement / Dynamic Type-equivalent stress beyond normal wrapping,
- real external source URLs (fixture is intentionally offline/fictional),
- production CARDS gesture integration,
- production LIVE integration,
- production persistence / cross-device DIVE sessions,
- real AI-generated DIVE relations,
- real backend revisions / update synchronization.

## 9. Review order for the Product Owner

For the fastest useful comparison, try in this order:

**01 → 02 → 03 → 08 → 06**, then the remaining five.

That sequence answers the most important product questions first:

1. Does choosing the next *question* feel like DIVE?
2. Does evidence inspection feel uniquely valuable?
3. Does change-over-time create a repeat-use reason?
4. Does session memory make exploration worth returning to?
5. Can an explainable unexpected connection create the desired “wow” without becoming dishonest?

No owner decision is required to keep this isolated synthesis available. Production integration should remain deferred until hands-on owner review.
