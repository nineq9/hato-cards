# DIVE LAB B — PLAY / LEARNING

Status: **ISOLATED EXPERIMENT — OWNER REVIEW READY**  
Branch: `dive-lab-b-play-learning`  
Date: 2026-08-16  
Production integration: **none**  
Existing DIVE status: **unchanged**

## Purpose

This lab tests one question:

> What makes a person want to take one more meaningful step, without turning news into a game or pretending engagement equals understanding?

Hard constraints inherited from KAWASEMI:

- AI confidence is not truth.
- Attribution is not verification.
- Historical similarity is context, not evidence.
- AI alone cannot mark a claim confirmed.
- `UNKNOWN` is a valid information state, not a failure.
- DIVE is user-directed; AI may create paths but must not choose the conclusion.
- `HISTORY` records observable behavior only.
- `SAVED` requires an explicit user action.
- Visiting something never means learned / understood / mastered / believed / agreed.
- Production KAWASEMI and the existing FOCUS MAP are not modified by this lab.

## Research — mechanics, not visual styling

Current product/help material was reviewed for 17 products. The useful unit is the mechanic that creates progression, return motivation, or a reusable session.

| Product | Mechanic worth borrowing | Explicitly rejected for DIVE |
|---|---|---|
| Duolingo | tiny repeatable sessions; obvious continuation | streak loss, XP, ranks, social pressure |
| Brilliant | action → reveal → next interactive step | correctness as proof of understanding |
| Anki | bounded session; later resurfacing | memory estimate as news understanding |
| Readwise | explicit keep + later resurfacing | automatic mastery/retention inference |
| Readwise Reader | source-context reading + highlights/notes | auto-saving everything viewed |
| Zotero | one item can exist in multiple collections | collection membership as truth state |
| Hypothesis | annotation anchored to source context | annotation as automatic verification |
| Heptabase | exploration leaves persistent reusable objects | graph/whiteboard aesthetics as DIVE identity |
| Notion | links/backlinks and revisitable relations | generic workspace/database UI drift |
| RemNote | return queue for selected material | retrievability score, streak pressure |
| Khan Academy | legible checkpoints/progression | mastery %, correct/incorrect scoring for news |
| Outer Wilds | unanswered mysteries create return motivation | timer/failure-loop framing |
| Return of the Obra Dinn | evidence accumulation + deduction | forced single answer when evidence is insufficient |
| The Case of the Golden Idol | inspect fragments and construct a theory | puzzle-solution framing for contested reality |
| Her Story | user query reveals non-linear fragments | keyword recurrence as truth evidence |
| Telling Lies | non-linear archive exploration across perspectives | “player decides truth” framing |
| Slay the Spire | small next-choice set; run-specific collection | combat, rarity, loot, deck-game visuals |

The reusable structures were: small next choice, reveal, unfinished thread, checkpoint, collection, hypothesis→verification, revisit, route memory, and bounded sessions.

References used: Duolingo official blog; Brilliant Help; Anki Manual; Readwise/Reader docs; Zotero docs; Hypothesis Help; Heptabase; Notion Help; RemNote Help; Khan Academy Help; official/store descriptions for Outer Wilds, Return of the Obra Dinn, The Case of the Golden Idol, Her Story, Telling Lies, and Slay the Spire.

## Shared DIVE SESSION contract

Every demo uses the same local-only session rules.

Automatically record only observable facts:

- anchor article;
- steps actually opened;
- route and `parentStepId` branch history;
- current/resume position;
- relation/action used where relevant;
- evidence actually opened;
- comparison axes actually viewed;
- approximate active session time;
- last active time.

Explicit user action only:

- Saved Discovery;
- Open Question;
- collection placement.

Never infer:

- learned / understood / mastered;
- belief / agreement;
- political preference;
- viewpoint interest from a visit.

`SAVED` = deliberately kept.  
`SESSION HISTORY` = actually traversed.  
`Back` changes the current branch but does not erase previously visited branches.  
`PAUSE / RESUME` restores observable session state only.

---

# 01 — SOURCE TRACE

**NAME** — SOURCE TRACE  
**何をする** — 記事の記述から一次資料へ、根拠を一段ずつ遡る。出典が切れた地点も成果として残す。  
**主操作** — `次の出典を開く`。  
**なぜ続けたくなる** — 一段開くたび「この情報はどこから来た？」が具体化し、次の出典が自然な未完了になる。  
**最初の30秒** — 記事 → 運用機関の障害情報 → 監視ログを3回で開く。最後に「最終原因は未確定」が残る。  
**core loop** — statement → source → deeper source → provenance gap/checkpoint → save trace / keep question → resume  
**何を集める/完成させる/解明するのか** — 出典経路と未確認地点。  
**終了条件** — 十分だと思った地点、または根拠がそれ以上続かない地点。完了率なし。  
**次回再開理由** — 一次資料が追加された、または未確認地点を続けたい。  
**HISTORYに残るもの** — 開いた出典、順序、branch parent、最後の地点、active duration。  
**CARDS/LIVEとの違い** — 記事閲覧でも最新信号監視でもなく「この記述の根拠はどこまで遡れる？」を調べる。  
**参考mechanics** — Obra Dinn、Hypothesis、Zotero。  
**最小touch demo** — `demos/dive-lab-b/01-source-trace/`

# 02 — QUESTION CHAIN

**NAME** — QUESTION CHAIN  
**何をする** — 正解を選ばず、現在の材料から次に確かめる問いを選び、問いから問いへ進む。  
**主操作** — 複数の`QUESTION`から次に追う問いを選ぶ。  
**なぜ続けたくなる** — 1つを見ると次に確かめるべき不足が見える。未解決を失敗ではなく次回の入口にできる。  
**最初の30秒** — 影響範囲 → 因果 → 一次ログ、のように2〜3問を開く。  
**core loop** — choose question → inspect grounded material → reveal next questions → keep unresolved / choose again  
**何を集める/完成させる/解明するのか** — 問いの経路、開いた根拠、明示的に残したOpen Question。  
**終了条件** — 任意。問いが未解決でも停止可能。  
**次回再開理由** — 残した問いに新しい材料が来た、または続きを追いたい。  
**HISTORYに残るもの** — 選んだ問い、順序、開いた根拠、branch、resume位置。  
**CARDS/LIVEとの違い** — 情報の順番をAIが決めるのではなく、ユーザーの問いが探索方向を決める。  
**参考mechanics** — Outer Wilds、Her Story、Brilliant。  
**最小touch demo** — `demos/dive-lab-b/02-question-chain/`

# 03 — COVERAGE BOARD

**NAME** — COVERAGE BOARD  
**何をする** — CONFIRMED / CLAIMS / UNKNOWN / IMPACT / HISTORY / SOURCESなど、実際に見た観点だけを可視化する。  
**主操作** — 観点セルを開く。  
**なぜ続けたくなる** — 「まだ見ていない角度」が分かるが、全埋めは要求されない。  
**最初の30秒** — 2〜4セルを開き、UNKNOWNも「確認した未確定状態」として残ることを見る。  
**core loop** — choose facet → inspect → mark visited only → stop or inspect another facet  
**何を集める/完成させる/解明するのか** — 閲覧済みの観点。理解度ではない。  
**終了条件** — 必要な観点を見た時。100% completionなし。  
**次回再開理由** — 未閲覧の観点、または更新された観点がある。  
**HISTORYに残るもの** — visited facetsと順序。  
**CARDS/LIVEとの違い** — 記事/時系列ではなく、同一テーマを複数の意味方向から点検する。  
**参考mechanics** — Khan Academy/Brilliantの進行可視化を、observable-onlyへ変換。  
**最小touch demo** — `demos/dive-lab-b/03-coverage-board/`

# 04 — COMPARISON LENS

**NAME** — COMPARISON LENS  
**何をする** — 二つの情報源を時刻・表現・根拠・未確定点などの軸で切り替えて比較する。  
**主操作** — 比較軸を切り替える。  
**なぜ続けたくなる** — 軸を変えるたび別の差分が見え、差分自体が次の問いになる。  
**最初の30秒** — 2〜4軸を切り替え、差分を保存またはOpen Questionへ送る。  
**core loop** — choose axis → inspect A/B → note delta → choose another axis / save delta / keep question  
**何を集める/完成させる/解明するのか** — 実際に見た比較軸と明示保存した差分。  
**終了条件** — 必要な比較が終わった時。  
**次回再開理由** — 新しいsourceまたは新しい比較軸が追加された。  
**HISTORYに残るもの** — viewed axes、保存差分、open question、route。  
**CARDS/LIVEとの違い** — 複数sourceを一つの要約に潰さず、違いを読む。  
**参考mechanics** — Obra Dinnのfragment comparison、reading/annotation tools。  
**最小touch demo** — `demos/dive-lab-b/04-comparison-lens/`

# 05 — DISCOVERY HAND

**NAME** — DISCOVERY HAND  
**何をする** — 一度に3つだけ提示されたtyped connectionから、自分が追いたい1つを選ぶ。  
**主操作** — `この道を追う`。  
**なぜ続けたくなる** — 小さな選択で結果が変わり、毎回次の3方向が現れる。  
**最初の30秒** — 3方向から1つ選ぶ操作を2〜3回。relation typeを常に表示。  
**core loop** — small choice set → choose → reveal typed connections → choose again → save discovery / backtrack  
**何を集める/完成させる/解明するのか** — 今回実際に辿った発見の束。  
**終了条件** — 任意。run勝敗やscoreなし。  
**次回再開理由** — 前回選ばなかった道を追う、または新しい接続を試す。  
**HISTORYに残るもの** — 選択、relation、branch、visited paths。  
**CARDS/LIVEとの違い** — 次のニュースではなく「次の意味方向」を選ぶ。  
**参考mechanics** — Slay the Spireのsmall choice setを非ゲーム化、DIVE typed relations。  
**最小touch demo** — `demos/dive-lab-b/05-discovery-hand/`  
**主なリスク** — 10案中もっともゲームUI/AI steeringへ漂流しやすい。

# 06 — CHRONOLOGY TABLE

**NAME** — CHRONOLOGY TABLE  
**何をする** — 出来事の断片を時間順に並べる。確定時刻と時間幅を同じ精度にしない。  
**主操作** — 断片を上/下へ並べ替え、個別根拠を確認する。  
**なぜ続けたくなる** — 1つ動かすと因果に見える部分と、まだ分からない部分がはっきりする。  
**最初の30秒** — 2〜4回並べ替え、08:05–08:20のような時間幅がそのまま残ることを見る。  
**core loop** — inspect fragment → reorder working hypothesis → inspect evidence → revise / save order  
**何を集める/完成させる/解明するのか** — ユーザーの作業順序と各断片のsource/time precision。  
**終了条件** — 作業上十分な順序になった時。正解判定なし。  
**次回再開理由** — 新しい時刻情報で順序を再検討したい。  
**HISTORYに残るもの** — reorder actions、evidence opened、saved working order。  
**CARDS/LIVEとの違い** — LIVEの時系列表示ではなく、断片順をユーザーが検討する作業面。  
**参考mechanics** — detective reconstruction mechanics。  
**最小touch demo** — `demos/dive-lab-b/06-chronology-table/`

# 07 — CLAIM PAIR

**NAME** — CLAIM PAIR  
**何をする** — 帰属付きの二つの主張を選び、それぞれの根拠と不足を並べる。  
**主操作** — 二つのCLAIMをペアにする。  
**なぜ続けたくなる** — 「どちらが勝ち？」ではなく、二つを同時に見ることで不足証拠が見える。  
**最初の30秒** — 2主張を選択 → Verification Gap表示 → 不足証拠をOpen Questionへ。  
**core loop** — select claim A/B → inspect evidence → expose verification gap → save comparison / keep gap open  
**何を集める/完成させる/解明するのか** — 比較した主張、根拠、不足証拠。  
**終了条件** — 比較目的を満たした時。winnerなし。  
**次回再開理由** — 不足証拠が追加された、または別のclaim pairを比較したい。  
**HISTORYに残るもの** — selected pair、根拠、gap、saved comparison。  
**CARDS/LIVEとの違い** — 要約でも更新流でもなく、claim-level verification作業。  
**参考mechanics** — Obra Dinn / Golden Idolのhypothesis→evidence構造を非正解化。  
**最小touch demo** — `demos/dive-lab-b/07-claim-pair/`

# 08 — RETURN FILE

**NAME** — RETURN FILE  
**何をする** — 未解決の問いを残してPAUSEし、次回は「前回以降に増えた材料」だけを確認する。  
**主操作** — Open Questionを残す → PAUSE → RESUME → NEW SINCE THIS DIVEを開く。  
**なぜ続けたくなる** — streakではなく、自分が残した未完了の調査に新材料が来たことが戻る理由になる。  
**最初の30秒** — 問いを残してPAUSE、RESUME後に新材料を開く。新材料だけでは自動解決しない。  
**core loop** — keep unresolved → pause → new material appears → resume at thread → inspect delta → keep open or save update  
**何を集める/完成させる/解明するのか** — 未解決threadと、その後に実際に確認した更新材料。  
**終了条件** — 問いが解決しなくても停止可能。  
**次回再開理由** — その問いにsource/evidence/updateが追加された時。  
**HISTORYに残るもの** — open question、previous route、last position、new material actually opened。  
**CARDS/LIVEとの違い** — 全ニュース更新ではなく「以前の自分のDIVEに関係する差分」だけを戻す。  
**参考mechanics** — Outer Wildsのunfinished mystery、Readwise/Anki/RemNoteのrevisitを情報更新triggerへ変換。  
**最小touch demo** — `demos/dive-lab-b/08-return-file/`

# 09 — COLLECTION SHELF

**NAME** — COLLECTION SHELF  
**何をする** — 発見をEvidence / Context / Unknownなど、自分で選んだ棚へ明示的に残す。同じ発見を複数棚へ置ける。  
**主操作** — 棚を選ぶ → `＋`で発見を保存。  
**なぜ続けたくなる** — 探索が一回で消えず、自分の資料セットとして次のDIVEに使える。  
**最初の30秒** — Evidence → Context → Unknownへ2〜4個置く。  
**core loop** — find discovery → choose personal shelf → explicitly save → continue → reuse later  
**何を集める/完成させる/解明するのか** — ユーザー自身が残したdiscovery collection。棚はtruth stateではない。  
**終了条件** — 任意。コンプリート要求なし。  
**次回再開理由** — 過去collectionから別DIVEを始める、または新情報を加える。  
**HISTORYに残るもの** — 訪問履歴とは別のexplicit saveとshelf placement。  
**CARDS/LIVEとの違い** — Saved Articleより細かいdiscovery objectをDIVE文脈付きで残す。  
**参考mechanics** — Zotero multiple collections、Readwise highlights、Heptabase persistent objects。  
**最小touch demo** — `demos/dive-lab-b/09-collection-shelf/`

# 10 — ACTOR VIEW

**NAME** — ACTOR VIEW  
**何をする** — 関係者を切り替え、各人/組織のCLAIM / BASIS / UNKNOWNを同じ型で見る。  
**主操作** — 話者を切り替える。  
**なぜ続けたくなる** — 一人を見ると「他の当事者は同じ点をどう述べた？」が自然な次の一手になる。  
**最初の30秒** — 運用機関 → 保守会社 → 自治体を2〜3回切り替える。  
**core loop** — select actor → inspect attributed claim/basis/unknown → switch actor → save / keep unresolved  
**何を集める/完成させる/解明するのか** — 話者ごとの帰属付き記録と未確定点。  
**終了条件** — 必要な話者を見た時。全員訪問の要求なし。  
**次回再開理由** — 話者の更新、または新しい関係者追加。  
**HISTORYに残るもの** — viewed actors、順序、保存したactor record、open question。  
**CARDS/LIVEとの違い** — claim ownershipを崩さず、視点の違い自体を探索する。  
**参考mechanics** — Telling Lies / Her Storyのmulti-perspective fragments。  
**最小touch demo** — `demos/dive-lab-b/10-actor-view/`

---

# Comparison

Scale: 1 = weak/high-risk, 5 = strong. These are prototype fit scores only; they do not score truth, politics, values, or user understanding.

| # | Prototype | ワクワク | 継続 | 理解 | KAWASEMI | 非childish | 誠実さ | smartphone | landscape | v0.1 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 | SOURCE TRACE | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| 02 | QUESTION CHAIN | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 |
| 03 | COVERAGE BOARD | 3 | 3 | 4 | 4 | 4 | 5 | 5 | 5 | 5 |
| 04 | COMPARISON LENS | 4 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 5 |
| 05 | DISCOVERY HAND | 5 | 5 | 4 | 4 | 3 | 4 | 5 | 5 | 4 |
| 06 | CHRONOLOGY TABLE | 4 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | 4 |
| 07 | CLAIM PAIR | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| 08 | RETURN FILE | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 |
| 09 | COLLECTION SHELF | 4 | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 5 |
| 10 | ACTOR VIEW | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |

## Recommended top 3 — not a final decision

1. **RETURN FILE** — strongest test of DIVE SESSION as an asset. Return motivation comes from unfinished, source-grounded work that changed, not engagement pressure. Production risk: trustworthy update-diff is needed.
2. **SOURCE TRACE** — most KAWASEMI-native. Provenance becomes an interaction loop; a provenance gap remains useful instead of being hidden. Risk: shallow source chains must stop honestly.
3. **QUESTION CHAIN** — strongest “one more step” loop without rewards. User chooses inquiry direction. Risk: AI-generated candidate questions can become editorial steering, so grounding/diversity/explainability are required.

Strong supporting modules: CLAIM PAIR, COMPARISON LENS, CHRONOLOGY TABLE, COLLECTION SHELF.  
Highest-risk experiments: DISCOVERY HAND (game/steering drift), COVERAGE BOARD (completion/mastery drift).

# DIVE SESSION finding

The strongest result is not “add game mechanics.” It is:

> **The reusable object is the unfinished investigation, not the user’s inferred knowledge state.**

A useful session has three continuities:

1. **Navigation continuity** — put me where I was.
2. **Inquiry continuity** — show the question I intentionally left open.
3. **Evidence continuity** — show what changed since then without rewriting what I saw before.

The third is the largest long-term opportunity surfaced by this lab.

# Touchable implementation

Index: `demos/dive-lab-b/index.html`

Demos:

- `01-source-trace/`
- `02-question-chain/`
- `03-coverage-board/`
- `04-comparison-lens/`
- `05-discovery-hand/`
- `06-chronology-table/`
- `07-claim-pair/`
- `08-return-file/`
- `09-collection-shelf/`
- `10-actor-view/`

Shared isolated assets: `shared.css`, `shared.js`. All demo news content is visibly labelled fictional LAB fixture data.

# Visual / interaction QA

Headless Chromium interacted with the exact local HTML/CSS/JS bundle. Direct localhost/file navigation was blocked by the execution environment, so the same bundle was injected into a browser document for interaction/rendering rather than judged by static code inspection.

PASS across all 10 mode scripts:

- 2–4 mode-specific interactions;
- Back changed the current branch;
- prior branch steps remained in full session history;
- PAUSE persisted local session state;
- reload simulation exposed CONTINUE/RESUME;
- RESUME restored the session UI;
- no browser console/page errors;
- no horizontal page overflow in tested states;
- tested important controls met 44×44 minimum after correction.

`DEMO_QUALITY_GATE` screenshot/viewport checks were performed for the densest CLAIM PAIR state at:

- 320×568 — PASS
- 375×667 — PASS
- 390×844 — PASS
- 430×932 — PASS
- 844×390 — PASS
- 1180×820 — PASS

Additional completed SOURCE TRACE checks: 320×568 and 844×390 — PASS. DISCOVERY HAND, COLLECTION SHELF, index, portrait/landscape captures were also visually inspected. No known text overlap, clipping, or horizontal overflow was found in tested states.

QA correction: CHRONOLOGY TABLE arrow controls initially rendered 32px wide, which is a touch-target FAIL. They were changed to `min-width:44px; min-height:44px`, then the automated interaction/layout pass was rerun successfully.

NOT TESTED:

- physical iPhone Safari;
- physical Android browser;
- VoiceOver / TalkBack;
- production CARDS/LIVE/DIVE integration;
- production IndexedDB/backend persistence;
- real AI-generated paths/questions;
- real source-update detection for RETURN FILE.

# Production implication — deliberately not decided

This lab does not choose the DIVE v0.1 UI and does not merge anything into production.

A later synthesis worth testing, only after hands-on owner review, is:

- QUESTION CHAIN as the exploration loop;
- SOURCE TRACE / CLAIM PAIR / COMPARISON LENS as on-demand inspection primitives;
- RETURN FILE + COLLECTION SHELF as the persistent session layer.

That synthesis would be a new product decision. It is not implied by the scores above.
