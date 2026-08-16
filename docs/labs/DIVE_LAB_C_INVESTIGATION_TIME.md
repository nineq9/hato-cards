# DIVE LAB C — INVESTIGATION / TIME

Status: **isolated experimental workstream — owner comparison prototype**

Branch: `dive-lab-c-investigation-time`

Scope: `demos/dive-lab-c/` only, plus this lab record. Production CARDS / LIVE / DIVE and `docs/status/DIVE.md` are intentionally unchanged.

## 1. Purpose

This LAB asks whether KAWASEMI DIVE can become a place where a user investigates the **time, evidence, claims, actors, versions, provenance, contradictions, and unanswered parts** behind one news story.

It is intentionally independent of the existing FOCUS MAP demo. The goal is not to reskin a graph. Each prototype changes the primary investigation mechanic itself.

Canonical constraints applied from:

- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- `docs/DEMO_QUALITY_GATE.md`
- `docs/ai-data/*`
- `docs/DIVE_EXPERIENCE_V0_2.md`

Hard epistemic rules used in all 10 prototypes:

- FACT / CLAIM / EVIDENCE / HYPOTHESIS / UNKNOWN never silently collapse into one state.
- AI processing confidence is not truth confidence.
- Attribution is not verification.
- Same-event confidence is not truth confidence.
- AI alone cannot make a Claim `confirmed`.
- Historical similarity is contextual, never supporting evidence for the current event.
- Source / revision / original wording remain traceable.
- DIVE SESSION records observable navigation only, not belief or understanding.

## 2. Research — interaction mechanics, not UI copying

Research deliberately extended beyond news products.

| Product / domain | Mechanics studied | LAB use |
|---|---|---|
| GitHub Compare / Activity / Blame | ref-to-ref diff, changed files, time/actor history, line provenance | WHAT CHANGED / TIME MACHINE |
| MediaWiki page history | compare arbitrary revisions, permanent revision references | TIME MACHINE / WHAT CHANGED |
| Internet Archive Wayback Machine | archived historical page states | TIME MACHINE |
| Diffchecker | split/unified difference reading, hide unchanged text | WHAT CHANGED |
| OCCRP Aleph | entity cross-reference, investigations, timelines, networks | FOLLOW ENTITY / EVENT RECONSTRUCTION |
| Google Pinpoint | search large document collections, entity filters, supporting evidence | CLAIM COMPARISON / EVIDENCE CHAIN |
| Hunchly | URL/time/hash capture and case/audit record | EVIDENCE CHAIN / provenance |
| Perma.cc | preserved web record separate from live page | EVIDENCE CHAIN / source history |
| DocumentCloud | page/region annotation anchored to source documents | EVIDENCE CHAIN / exact evidence |
| Hypothesis | annotation anchored to exact web text | CONTRADICTION / exact wording |
| Tropy | source-photo items, metadata, notes, selections | EVENT RECONSTRUCTION / evidence objects |
| FamilySearch | person timelines, maps, sources, follows, latest changes | FOLLOW ENTITY |
| CourtListener / RECAP | dockets, citations, alerts, document coverage/gaps | UNANSWERED / evidence availability |
| Zotero | collections, tags, saved searches, annotations, notes | SESSION / saved discoveries / open questions |
| Google Earth historical imagery | time slider over location imagery | TIME MACHINE / LOCATION×TIME consideration |
| Maltego | entity transforms and targeted enrichment | FOLLOW ENTITY / branching investigation |

Research conclusion: the most reusable mechanics are not “network graphs.” They are:

1. **time-selectable historical state**;
2. **before/after semantic difference**;
3. **attributed claims kept side-by-side**;
4. **reverse tracing from an article sentence to upstream evidence**;
5. **independence grouping so repeated syndication does not look like multiple confirmation**;
6. **event fragments with occurred-time and observed-time kept separate**;
7. **entity pivoting**;
8. **exact-wording contradiction inspection**;
9. **unanswered questions as persistent investigation state**;
10. **hypotheses tested against evidence without becoming facts**.

## 3. Shared synthetic case

All ten demos start from the same fictional CARDS article so the interaction model, rather than the content, is what changes.

**Article:** 「青波港ゲート3、通信障害後に航行制限を解除」

Synthetic record:

- 07:42 — public communications sensor records a steep response-rate drop.
- 07:51 — Port Authority notice v1 says the restriction is for a “technical inspection”; cause remains under review.
- 07:58 — contractor creates an additional “communications unstable” ticket; the record is observed later at 08:05.
- 08:31 — broadcaster reports an anonymous-source CLAIM that intrusion is also being investigated; not independently confirmed.
- 09:02 — Authority notice v2 changes wording to “communications outage” and says there is currently no confirmed evidence showing external intrusion.
- 09:08 / 09:10 — two publishers paraphrase that as “Authority denies cyberattack”; both depend on the same Authority notice.
- 09:14 — archived camera image shows two workboats. Their purpose remains unknown.
- 10:18 — Authority notice v3 says service recovered and adds that possible relation to third-party maintenance is under investigation.
- 2025 historical record — the same contractor appears in another outage, but that past event had a different established cause. It is **context only**.

The direct cause of the current synthetic incident remains **UNKNOWN**.

---

# 01 — TIME MACHINE

**一文定義**  
今の記事から過去の公開状態へ戻り、「その時点で何が分かっていたか」だけを見る。

**主操作**  
Time scrubberを左右に動かし、07:42 / 07:51 / 09:02 / 10:18のsource-grounded snapshotを切り替える。

**何が面白い**  
現在の結論を知ったまま過去記事を読むのではなく、当時の不確実性をそのまま体験できる。

**最初の30秒**  
CARDS記事 → DIVE → scrubberを07:42まで戻す → Sourceを開く。

**core loop**  
現在 → 過去時点を選ぶ → 当時存在したFACT/CLAIM/UNKNOWNを見る → Source → 別時点へ移動。

**何が明らかになる**  
07:42には障害の観測はあるが、原因説明はまだ存在しない。

**どこに意外性がある**  
後から当然に見える説明が、当時は存在していなかったこと自体が発見になる。

**何がUNKNOWNのまま残るか**  
保存されていない内部記録、未公開の判断、アーカイブ欠損。

**SESSION / HISTORY**  
scrubした時点をrouteとして保存。Resumeで最後に見ていた時点へ戻る。

**CARDS / LIVEとの違い**  
CARDSは現在の有限レビュー、LIVEは今流入しているSignal。TIME MACHINEは「過去時点の知識状態」を調べる。

**参考mechanics**  
Google Earth historical imagery / Wayback Machine / MediaWiki history / GitHub history.

**v0.1最小demo**  
4 snapshot + range scrub + provenance sheet + session resume。

---

# 02 — WHAT CHANGED

**一文定義**  
同じ情報の2時点を重ね、追加・削除・言い換えだけを読む。

**主操作**  
revision pairを選び、BEFORE / AFTERのdiffを読む。

**何が面白い**  
全文を読み比べなくても、編集者・組織が「どこを変えたか」だけに注意を集中できる。

**最初の30秒**  
07:51→09:02を比較 → 次に09:02→10:18 → 変更後Sourceを開く。

**core loop**  
比較時点選択 → 差分 → 原文 → さらに別revisionを比較。

**何が明らかになる**  
「技術点検」から「通信障害」へ変化し、10:18で初めて第三者保守との関連調査が追記された。

**どこに意外性がある**  
「保守会社が原因」ではなく、原文は「関連を含め調査中」という限定表現だった。

**何がUNKNOWNのまま残るか**  
なぜ文言を変更したかという内部理由。

**SESSION / HISTORY**  
比較したrevision pairを記録しResume。

**CARDS / LIVEとの違い**  
ニュースの更新一覧ではなく、「意味が変わった場所」を調査対象にする。

**参考mechanics**  
GitHub Compare / Diffchecker / MediaWiki revision comparison.

**v0.1最小demo**  
2 revision pairs + semantic diff + source sheet。

---

# 03 — CLAIM COMPARISON

**一文定義**  
一つの問いに対し、誰がいつ何を言ったかを混ぜずに横並びにする。

**主操作**  
propositionを切り替え、actorごとの原文・時刻・claim stateを比較する。

**何が面白い**  
「報道ではこう言われている」を、誰の主張が何本あるのかへ分解できる。

**最初の30秒**  
「外部攻撃は否定された？」へ切替 → 3 card比較 → 原文Source。

**core loop**  
問い → actor claims → wording / verification → Source → 別の問い。

**何が明らかになる**  
3つに見える説明のうち2記事は同じ公式告知を強く言い換えただけ。

**どこに意外性がある**  
見かけの「複数報道」が複数の独立確認ではない。

**何がUNKNOWNのまま残るか**  
どの命題が最終的に真かは、別のEvidence / Verificationが必要。

**SESSION / HISTORY**  
比較したpropositionとopened sourcesを保存。

**CARDS / LIVEとの違い**  
CARDSの要約やLIVEの時系列ではなく、proposition単位の主張構造を調べる。

**参考mechanics**  
Pinpoint / legal-database issue comparison / source tables.

**v0.1最小demo**  
2 propositions × 3 claims + provenance。

---

# 04 — EVIDENCE CHAIN

**一文定義**  
記事の文から一次資料まで、情報がどこを通ってきたかを一段ずつ逆引きする。

**主操作**  
「もう1段、根拠へ戻る」で Article → secondary reports → primary notice → independent measurement と剥がす。

**何が面白い**  
記事数ではなく、実際に何本の独立Evidenceへ到達するかが見える。

**最初の30秒**  
「当局、外部攻撃を否定」→ upstreamを2段戻る → independence groupを見る → Source。

**core loop**  
statement → upstream source → primary record → independent evidence → wording / contradiction → deeper source。

**何が明らかになる**  
東浜ニュースと朝潮オンラインは同じ `authority-notice` に依存し、独立確認線は増えていない。

**どこに意外性がある**  
「複数社が報道」という見かけが、1本の上流Sourceへ折りたたまれる瞬間。

**何がUNKNOWNのまま残るか**  
一次資料が存在しない・消えた・非公開ならchainはそこでUNKNOWNになる。

**SESSION / HISTORY**  
辿ったchain depth、opened source、最後のEvidenceを保存。

**CARDS / LIVEとの違い**  
「何が書かれているか」ではなく「この文を信じる根拠はどこまで遡れるか」を調べる。

**参考mechanics**  
Hunchly capture/audit, Perma preserved records, DocumentCloud anchored source annotations, provenance systems.

**v0.1最小demo**  
4 layers + independence group + provenance sheet。

---

# 05 — EVENT RECONSTRUCTION

**一文定義**  
断片的Signalを、occurredAtとobservedAtを分けたまま時系列へ組み立てる。

**主操作**  
Signal fragmentを順番にpinし、イベントの空白を可視化する。

**何が面白い**  
ニュース記事の完成済みストーリーを読むのではなく、自分で断片を組み立てる調査感がある。

**最初の30秒**  
3つのfragmentをpin → 07:42–07:51 gapを見る → contractor recordを開く。

**core loop**  
fragmentを選ぶ → occurred/observed time確認 → pin → gap/contradictionを見る → Source。

**何が明らかになる**  
07:58作成の記録が08:05に観測された。後から見つかった資料を「08:05に起きた」と誤読しない。

**どこに意外性がある**  
出来事の時刻と、KAWASEMIが知った時刻がズレる。

**何がUNKNOWNのまま残るか**  
公開記録のないgap、未観測Signal、正確な原因時刻。

**SESSION / HISTORY**  
pinned fragmentsとbranchを保存。

**CARDS / LIVEとの違い**  
LIVEのchronologyを眺めるのではなく、自分でイベント構造を再構築する。

**参考mechanics**  
Aleph timelines / Tropy source objects / case chronology tools.

**v0.1最小demo**  
4 fragments + two timestamps + gap detection + Source。

---

# 06 — FOLLOW ENTITY

**一文定義**  
人物・組織・場所を軸に、現在の事件から別時点・別事件・別資料へ潜る。

**主操作**  
Authority / contractor / Gate 3 をentity pivotとして選ぶ。

**何が面白い**  
「この記事の関連記事」ではなく、同じ主体がどこに現れたかを自分で追跡できる。

**最初の30秒**  
contractorを選ぶ → 07:58 record → 2025 historic record → context warning。

**core loop**  
entity → appearances → source → another appearance → history/context → back。

**何が明らかになる**  
同じ保守会社が過去障害にも登場する。

**どこに意外性がある**  
主体の反復出現は面白いが、それ自体は今回の原因Evidenceではないという線引き。

**何がUNKNOWNのまま残るか**  
同名人物のentity resolution、非公開所属、関与の意味。

**SESSION / HISTORY**  
pivotしたentityとopened appearancesを保存。

**CARDS / LIVEとの違い**  
story/event軸ではなくentity軸で世界を横断する。

**参考mechanics**  
OCCRP Aleph / FamilySearch timelines & sources / Maltego transforms.

**v0.1最小demo**  
3 entities + 3 appearances each + explicit CONTEXT ONLY historic relation。

---

# 07 — CONTRADICTION

**一文定義**  
対立する文を近づけ、何が本当に矛盾し、何が言い換え・限定落ちなのかを確かめる。

**主操作**  
2 sourceをsplit表示し、「原文の限定語」を展開する。

**何が面白い**  
AIの「矛盾検出」結果を鵜呑みにせず、人が原文で食い違いの場所を確認できる。

**最初の30秒**  
Authority原文 vs publisher要約 → 限定語比較 → 2 Sources。

**core loop**  
proposition → candidate contradiction → exact wording → sources → classify tension。

**何が明らかになる**  
「確認済みの証拠は現時点でない」が「攻撃を否定」に変わり、確度が増幅している。

**どこに意外性がある**  
正反対の主張というより、要約時に限定が消えたことが問題だった。

**何がUNKNOWNのまま残るか**  
外部侵入の実在そのもの。

**SESSION / HISTORY**  
比較したproposition pairとopened wordingを保存。

**CARDS / LIVEとの違い**  
conflicting stories一覧ではなく、命題と原文のどこがズレたかまで調べる。

**参考mechanics**  
Diff tools / Hypothesis exact-text anchors / legal source comparison.

**v0.1最小demo**  
1 strong contradiction candidate + exact-wording reveal + both sources。

---

# 08 — UNANSWERED

**一文定義**  
分かっていることではなく、まだ答えが出ていない問いと、答えるために必要なEvidenceだけを見る。

**主操作**  
UNKNOWNを選び、「何があれば解けるか」を確認し、必要ならOPEN QUESTIONとして保存する。

**何が面白い**  
“不明”が行き止まりではなく、次の調査入口になる。

**最初の30秒**  
「原因は何か？」→ required evidence → OPEN QUESTION保存 → Session。

**core loop**  
UNKNOWN → needed evidence → source availability → keep question → leave → resume when new evidence appears。

**何が明らかになる**  
原因を語る記事が複数あっても、直接原因を確定する資料はまだ無い。

**どこに意外性がある**  
KAWASEMIが「分からないこと」を隠さず、次に見るべき証拠の形まで示す。

**何がUNKNOWNのまま残るか**  
問いそのもの。Evidenceが来るまで無理に閉じない。

**SESSION / HISTORY**  
OPEN QUESTIONは明示保存。将来、新Evidenceが来たときResume入口になれる。

**CARDS / LIVEとの違い**  
CARDSの要約・LIVEの流入ではなく、未解決をfirst-class investigation objectにする。

**参考mechanics**  
research queues / docket missing-document awareness / Zotero saved-search mindset.

**v0.1最小demo**  
3 UNKNOWNs + evidence-needed checklist + explicit Open Question + Resume。

---

# 09 — WHO KNEW WHAT WHEN

**一文定義**  
各主体について、「公開記録上いつ何が確認できるか」を時間で並べる。

**主操作**  
time scrubberを動かし、actor laneのPUBLIC RECORDを切り替える。

**何が面白い**  
一つのイベントtimelineではなく、同じ時刻でも主体ごとに利用可能な情報が違うことを観察できる。

**最初の30秒**  
08:05 → 09:02へscrub → contractor laneとAuthority laneの差を見る。

**core loop**  
time → actor → public record → Source → next time → compare information asymmetry。

**何が明らかになる**  
08:05にはcontractor側の記録が存在するが、Authorityがその内容を知っていた証拠はない。

**どこに意外性がある**  
「記録が存在した」と「別主体が知っていた」を分離できる。

**何がUNKNOWNのまま残るか**  
PRIVATE KNOWLEDGE。内部で誰がいつ知ったかは、公開Evidenceなしでは推測しない。

**SESSION / HISTORY**  
最後のtime + actor contextを保存。

**CARDS / LIVEとの違い**  
単純なevent chronologyではなく、情報の到達範囲を調査する。

**参考mechanics**  
legal chronology / disclosure timelines / audit trails.

**v0.1最小demo**  
6 times × 4 actor lanes + permanent PRIVATE KNOWLEDGE = UNKNOWN warning。

**主要リスク**  
最も誤推測しやすい案。productionでは「誰が知っていた」と断定せず、PUBLIC RECORDとPRIVATE UNKNOWNを構造的に分ける必要がある。

---

# 10 — HYPOTHESIS TEST

**一文定義**  
複数の説明候補をFACTと分けたまま、Evidenceが何を支持・弱め・判別不能にするかを試す。

**主操作**  
H1/H2/H3を選び、Evidence tokenを順に適用する。

**何が面白い**  
証拠集めを「自分の仮説を強める作業」にせず、どの仮説が壊れるかを見る。

**最初の30秒**  
H1を選ぶ → sensor → contractor ticket → Authority wordingでテスト。

**core loop**  
HYPOTHESIS → evidence → supports possibility / weakens / no discrimination → next evidence → keep UNKNOWN。

**何が明らかになる**  
同じEvidenceでも、ある仮説には少し効き、別の仮説には何も言えない。

**どこに意外性がある**  
“関連する情報”を全部支持材料へ積まないこと自体が調査体験になる。

**何がUNKNOWNのまま残るか**  
v0.1の3 hypothesisすべてで直接原因は未確定。

**SESSION / HISTORY**  
選んだhypothesisとtested Evidenceを保存。ただし「ユーザーが信じた仮説」とは記録しない。

**CARDS / LIVEとの違い**  
答えを受け取るのではなく、説明候補をEvidenceで検査する。

**参考mechanics**  
scientific hypothesis testing / structured analytic techniques / branching investigation tools.

**v0.1最小demo**  
3 hypotheses + 3 Evidence items + non-probabilistic verdict language。

**主要リスク**  
probability theater、AI-generated causal story、confirmation bias。UI上で常に `HYPOTHESIS · NOT FACT` を表示する。

---

## 4. Considered but not standalone prototypes

### LOCATION × TIME

Strong mechanic, especially with historical imagery and event reconstruction. It is folded into EVENT RECONSTRUCTION / FOLLOW ENTITY for this LAB because a map-first standalone demo risks turning DIVE into an OSINT dashboard and over-weighting location even when the source only supports approximate region-level precision.

Future requirement if tested: preserve location precision (`exact / approximate / region / country / unknown`) and never render guessed coordinates as fact.

### CAUSE / EFFECT EXPLORER

Not made standalone because `caused_by` is epistemically stronger than generic relevance. Until evidence policies for causal relations are mature, HYPOTHESIS TEST is safer: it lets the user examine explanations without turning model-generated relation candidates into causal facts.

## 5. Comparison

Scale: 1–5. These are LAB judgments, not production approval.

| # | Model | WOW | 調査したくなる | 意外な発見 | 理解が本当に深まる | 情報の誠実さ | KAWASEMI独自性 | smartphone | landscape | v0.1実装可能性 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 | TIME MACHINE | 4.5 | 4.5 | 4.5 | 4.5 | 5.0 | 4.5 | 4.5 | 4.5 | 4.5 |
| 02 | WHAT CHANGED | 4.5 | 5.0 | 4.5 | 4.5 | 5.0 | 4.5 | 4.5 | 5.0 | 5.0 |
| 03 | CLAIM COMPARISON | 4.0 | 5.0 | 4.5 | 5.0 | 5.0 | 4.5 | 4.5 | 5.0 | 4.5 |
| 04 | EVIDENCE CHAIN | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 4.5 | 5.0 | 4.5 |
| 05 | EVENT RECONSTRUCTION | 4.5 | 5.0 | 4.5 | 5.0 | 5.0 | 4.5 | 4.0 | 5.0 | 4.0 |
| 06 | FOLLOW ENTITY | 4.5 | 5.0 | 5.0 | 4.5 | 4.5 | 4.5 | 4.5 | 5.0 | 4.0 |
| 07 | CONTRADICTION | 4.5 | 5.0 | 5.0 | 5.0 | 5.0 | 4.5 | 4.5 | 5.0 | 5.0 |
| 08 | UNANSWERED | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 4.0 | 4.5 |
| 09 | WHO KNEW WHAT WHEN | 5.0 | 5.0 | 5.0 | 5.0 | 4.5 | 5.0 | 3.5 | 5.0 | 3.5 |
| 10 | HYPOTHESIS TEST | 5.0 | 5.0 | 4.5 | 5.0 | 4.5 | 5.0 | 4.0 | 5.0 | 3.5 |

## 6. Recommended top 3 — not a final product decision

### 1. EVIDENCE CHAIN

Strongest combination of WOW, genuine investigation, provenance, and KAWASEMI’s epistemic principles.

Its signature moment is **“many articles collapse into one upstream source.”** This is difficult for normal news readers to communicate, highly useful, and naturally maps onto `Evidence.independenceGroup` in the v0.1 data model.

### 2. UNANSWERED

Most distinctly KAWASEMI in product philosophy.

Instead of pretending uncertainty is a temporary UI defect, it turns **UNKNOWN → what evidence is missing → explicit OPEN QUESTION → Resume** into a valuable loop. It also gives DIVE SESSION a reason to exist beyond remembering visited nodes.

### 3. WHAT CHANGED

Best time-oriented mechanic for v0.1: immediate, understandable, smartphone-friendly, and technically realistic because RawItem revisions are already part of the canonical data model.

It exposes a subtle but important form of news evolution: not just “new article arrived,” but **the same actor changed the wording**.

### Close fourth: CONTRADICTION

Very strong, but it may work best as a reusable sub-mechanic inside EVIDENCE CHAIN / CLAIM COMPARISON rather than as an entire top-level DIVE architecture.

### High-upside but highest semantic risk: WHO KNEW WHAT WHEN

The investigation value is unusually strong. Production use should wait until the product can strictly enforce `PUBLIC RECORD` versus `PRIVATE KNOWLEDGE = UNKNOWN` so the UI never accuses an actor of having knowledge without evidence.

## 7. Product implication to test next

The strongest result is not “pick one of ten UIs.”

A possible future DIVE model is:

```text
one DIVE SESSION
→ user chooses an investigative question
→ the surface changes to the mechanic best suited to that question
   evidence → EVIDENCE CHAIN
   revision → WHAT CHANGED
   unknown → UNANSWERED
   actor → CLAIM COMPARISON / FOLLOW ENTITY
   chronology → EVENT RECONSTRUCTION
```

This is only a hypothesis from the LAB. Do **not** turn the ten experiments into ten permanent product modes yet. The owner comparison should focus on one question:

> Which mechanic makes you naturally want to perform one more investigation action, while still trusting the distinction between what is known, claimed, evidenced, hypothesized, and unknown?

## 8. Demo implementation

Paths:

- `demos/dive-lab-c/index.html`
- `demos/dive-lab-c/01-time-machine/`
- `demos/dive-lab-c/02-what-changed/`
- `demos/dive-lab-c/03-claim-comparison/`
- `demos/dive-lab-c/04-evidence-chain/`
- `demos/dive-lab-c/05-event-reconstruction/`
- `demos/dive-lab-c/06-follow-entity/`
- `demos/dive-lab-c/07-contradiction/`
- `demos/dive-lab-c/08-unanswered/`
- `demos/dive-lab-c/09-who-knew-when/`
- `demos/dive-lab-c/10-hypothesis-test/`

Every prototype includes:

- CARDS-like synthetic article start;
- unique primary interaction;
- 2–4 meaningful actions;
- one explicit discovery moment;
- Source / provenance inspection;
- Back;
- DIVE SESSION;
- Resume concept and local demo persistence;
- portrait and responsive landscape layouts;
- no paid API / backend / AI call.

## 9. Visual drift report

Preserved from production KAWASEMI:

- dark `#081113` base direction;
- restrained teal `#118995` accent;
- Apple-system / Japanese sans typography stack;
- quiet border/surface hierarchy;
- content before interface chrome;
- minimal familiar Back/Source controls;
- 44px minimum important tap targets;
- restrained motion and reduced-motion fallback;
- source state communicated with text/structure, not color alone.

Intentional differences:

- investigative workbench can become two-pane in landscape so origin context remains visible;
- each prototype has a different manipulation surface because the LAB is testing interaction mechanics, not final DIVE visual architecture.

Avoided:

- graph as default;
- enterprise BI dashboard;
- spreadsheet UI;
- cyberpunk / OSINT military aesthetic;
- glowing nodes;
- chatbot-centered flow;
- related-article lists;
- point/rank/achievement gamification.

## 10. QA result

Browser-rendered automated + screenshot review was performed against:

- 320×568 portrait
- 375×667 portrait
- 390×844 portrait
- 430×932 portrait
- 844×390 landscape
- 1180×760 wide landscape

Total: **10 prototypes × 6 viewports = 60 rendered cases**.

Checked in the exact LAB HTML/CSS/JS rendering path:

- CARDS article → DIVE entry;
- unique model interaction path;
- Source sheet open/close;
- SESSION sheet open/close;
- Back;
- serialized session state → reconstructed page → Resume state;
- horizontal overflow;
- important visible controls below 44×44;
- important content clipping;
- Source sheet out-of-bounds;
- browser page / console errors;
- screenshot visual inspection for overlap, hierarchy, clipping, spacing, landscape context pane, 320px readability.

Result for the above checks: **PASS — 60/60 cases, 0 known layout failures in the checked conditions.**

Additional shared-state screenshots reviewed:

- Source sheet at 320×568;
- SESSION sheet at 844×390;
- LAB index at small portrait and landscape/wide sizes.

### NOT TESTED

- physical iPhone / Safari safe-area and browser-chrome behavior;
- VoiceOver / TalkBack end-to-end behavior;
- real GitHub Pages deployment behavior for this branch;
- real production source data;
- production backend / AI generation;
- production account or multi-device session persistence;
- final production integration.

The managed browser environment blocked direct `localhost` / `file:` navigation, so browser QA loaded the exact generated HTML/CSS/JS into Chromium and used a deterministic in-page storage substitute for serialization/Resume testing. This verifies UI logic and reconstruction behavior, but real browser-origin persistence transport remains NOT TESTED.

## 11. Research references

Primary/current product documentation consulted during this LAB includes:

- GitHub Docs — comparing commits / activity / blame: https://docs.github.com/
- MediaWiki / Wikimedia — page history and revision comparison: https://www.mediawiki.org/ and https://www.wikimedia.org/
- Internet Archive — Save Page Now / Wayback Machine: https://web.archive.org/
- OCCRP Aleph documentation: https://docs.aleph.occrp.org/
- Google Pinpoint: https://journaliststudio.google.com/pinpoint/
- Hunchly documentation: https://docs.hunch.ly/
- Perma.cc documentation: https://perma.cc/docs/
- DocumentCloud documentation: https://www.documentcloud.org/
- Hypothesis help / annotation docs: https://web.hypothes.is/help/
- Tropy documentation: https://docs.tropy.org/
- FamilySearch help: https://www.familysearch.org/en/help/helpcenter/
- CourtListener / RECAP help: https://www.courtlistener.com/help/
- Zotero documentation: https://www.zotero.org/support/
- Google Earth historical imagery help: https://support.google.com/earth/
- Maltego documentation: https://docs.maltego.com/

These mechanics are research inputs only. UI copy and visual systems were not copied into KAWASEMI.
