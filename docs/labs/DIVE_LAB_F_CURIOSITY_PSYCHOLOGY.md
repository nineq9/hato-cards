# DIVE LAB F — CURIOSITY PSYCHOLOGY

Status: **OWNER_REVIEW_READY (isolated lab)** — 10 touchable prototypes implemented and QA-reviewed on the dedicated lab branch. Production integration is intentionally not approved.

## Goal
Test ten interaction structures that can create genuine curiosity, agency, understanding, memory support, and intellectual satisfaction without streaks, FOMO, variable-reward loops, fake suspense, or ideological steering.

## Canonical constraints preserved
- User chooses DIVE direction; AI does not prescribe a worldview.
- Attribution is not verification.
- AI confidence is not truth confidence.
- Historical similarity is context, not evidence.
- Source/provenance remains reachable.
- Session history records observable actions, not inferred understanding.
- production CARDS / LIVE / DIVE are untouched.

## Research synthesis
1. **Curiosity / information gaps:** Loewenstein (1994) frames curiosity around perceived knowledge gaps; Kang et al. (2009) and Gruber et al. (2014) link higher curiosity states with information seeking and memory benefits. Product use here is an inference, not a guarantee.
2. **Information foraging / scent:** Pirolli & Card's work models navigation using proximal cues to expected information value. This motivates short route previews rather than opaque AI sequencing.
3. **Prediction / generation:** explicit predictions can improve learning for expectancy-violating information in some experiments; the generation effect supports actively producing material rather than only reading it. We avoid scoring, preference inference, and uncertain-event quizzes.
4. **Autonomy:** Self-Determination Theory identifies autonomy as a core condition associated with self-directed motivation. In product terms, we infer that choosing the question/route is safer than an AI-controlled tunnel.
5. **Retrieval:** retrieval practice can strengthen later retention compared with restudy in learning settings. The demo uses optional, scoreless recall only on previously inspected source facts.
6. **Serendipity:** HCI work describes serendipitous information encounters as a process, not merely randomness. The demo therefore exposes *why* an unexpected connection surfaced.
7. **Unfinished work:** the classic Zeigarnik memory advantage is not treated as a reliable law; a 2025 meta-analysis notes replication difficulty. OPEN THREAD relies on explicit external memory / resume state, not engineered tension.

## 10 prototypes
- **01 CURIOUS GAP** — 重要な未知を一つだけ見える化する. `demos/dive-lab-f/01-curiosity-gap/`
- **02 INFORMATION SCENT** — 進む前に「この先に何がありそうか」を嗅げる. `demos/dive-lab-f/02-information-scent/`
- **03 PREDICT → REVEAL** — 軽い予想を持ってから証拠を見る. `demos/dive-lab-f/03-predict-reveal/`
- **04 GENERATE BEFORE REVEAL** — 先に自分の説明を一度つくってから背景を見る. `demos/dive-lab-f/04-generate-before-reveal/`
- **05 CHOOSE THE QUESTION** — 答えではなく、最初の問いを自分で選ぶ. `demos/dive-lab-f/05-choose-the-question/`
- **06 WHY LADDER** — 「なぜ？」を一段ずつ、分岐を選びながら掘る. `demos/dive-lab-f/06-why-ladder/`
- **07 KNOW / DON’T KNOW BORDER** — 分かっていることと未確定の境界から進む. `demos/dive-lab-f/07-knowledge-border/`
- **08 SURPRISE, WITH A REASON** — 意外な接点を出すが、関連理由も同時に開示する. `demos/dive-lab-f/08-surprise-with-reason/`
- **09 RETRIEVAL REVISIT** — 以前見た根拠を軽く思い出してから更新を見る. `demos/dive-lab-f/09-retrieval-revisit/`
- **10 OPEN THREAD / RESUME** — 自分で残した未解決問いから探索を再開する. `demos/dive-lab-f/10-open-thread-resume/`

## Comparison
Scale 1–5. These are lab design judgments after implementation, not user-study results.

| Prototype | WOW | Genuine curiosity | Agency | Understanding | Memory potential | KAWASEMI uniqueness | Ethical safety | News suitability | Smartphone | v0.1 feasibility |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 01 CURIOUS GAP | 5 | 5 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 |
| 02 INFORMATION SCENT | 4 | 4 | 5 | 4 | 3 | 4 | 5 | 5 | 5 | 5 |
| 03 PREDICT → REVEAL | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 |
| 04 GENERATE BEFORE REVEAL | 4 | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 |
| 05 CHOOSE THE QUESTION | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 5 | 5 |
| 06 WHY LADDER | 4 | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 4 | 4 |
| 07 KNOW / DON’T KNOW BORDER | 4 | 4 | 5 | 5 | 3 | 5 | 5 | 5 | 4 | 4 |
| 08 SURPRISE, WITH A REASON | 5 | 5 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 4 |
| 09 RETRIEVAL REVISIT | 4 | 4 | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 4 |
| 10 OPEN THREAD / RESUME | 5 | 5 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 |

## Top 3 recommendation
1. **05 CHOOSE THE QUESTION** — strongest fit with KAWASEMI's user-directed DIVE principle; high agency, neutral by construction, straightforward on smartphone.
2. **01 CURIOUS GAP** — makes epistemic uncertainty itself the interaction surface; strong KAWASEMI fit when gaps are source-grounded rather than manufactured.
3. **10 OPEN THREAD / RESUME** — converts curiosity into durable session value without claiming knowledge/comprehension; pairs directly with DIVE SESSION v0.2.

Close contenders: 08 SURPRISE, WITH A REASON has high WOW/uniqueness but requires stricter ranking-transparency safeguards; 03 PREDICT → REVEAL has strong memory potential but needs careful domain restrictions.

## Dark-pattern final check
- 01: PASS — gap must be real, not manufactured suspense.
- 02: PASS — scent copy must not bias toward a preferred conclusion.
- 03: PASS WITH GUARDRAILS — no scores, ideology, profiling, or unknowable-event quizzes.
- 04: PASS WITH GUARDRAILS — generated hypotheses stay local and are not personality/viewpoint features.
- 05: PASS — question set must remain viewpoint-neutral and offer lateral movement.
- 06: PASS WITH GUARDRAILS — stop at UNKNOWN; do not fabricate causal depth.
- 07: PASS — border describes evidence state, never "your understanding level".
- 08: PASS WITH GUARDRAILS — no random-reward loop; every surprise shows why surfaced + typed relationship.
- 09: PASS WITH GUARDRAILS — optional recall, no score or mastery label.
- 10: PASS — no forced reminders/FOMO; open questions are explicit user-owned items.

## Visual drift report
Intentionally different from production: DIVE interaction panel replaces normal production DIVE rendering because this is an experience experiment. Preserved: dark production tokens, system Japanese sans stack, subdued teal/beige accents, restrained radius, 44px controls, source sheet pattern, quiet motion, no large wordmark, content-first hierarchy.

## QA
Automated Chromium interaction/layout checks were performed against all ten entries. Required viewport matrix: **320×568, 375×667, 390×844, 430×932, 844×390, 1024×768**.

Core flow was exercised for every demo: article → DIVE → first choice → reveal → second choice → deeper reveal → Session/History → return to article → Resume control. Source and History overlays were also opened and closed on all ten demos.

Screenshot review actually performed:
- all 10 article/default states at 390×844;
- all 10 STEP 1 states at 390×844;
- all 10 first-reveal / STEP 2 states at 390×844;
- all 10 deeper-reveal states across the complete six-viewport matrix (60 screenshots);
- Source and Session/History overlays for representative 01 / 05 / 10 states;
- additional full-resolution inspection of Landscape state.

A real interaction FAIL was found during QA: dynamically inserted Source / History sheets initially had no working close binding. The shared overlay-close handler was corrected, then the complete automated pass was rerun.

### PASS
- All 10 routes load and reach deeper reveal after multiple user actions.
- Source/provenance and Session/History sheets open **and close**.
- Session/History records the route actions actually taken; no comprehension score is generated.
- Return-to-article exposes a Resume point in the tested storage-equivalent QA path.
- No horizontal page overflow detected across the 60 final-state viewport checks.
- No horizontal text/control clipping detected by DOM bounding-box checks in tested article, Source, History, and final states.
- Core interactive targets met the 44px baseline in the tested states.
- Screenshot inspection found no known overlap, clipping, control/content collision, or obvious production-baseline visual drift in the reviewed states.
- Reduced-motion CSS is present.

### NOT TESTED
- Real-origin `localStorage` persistence across a browser reload. The sandbox browser blocks navigation to `file://`, localhost, and intercepted test origins, so automated QA used an API-equivalent in-memory storage shim. The production prototype code itself uses `localStorage`.
- physical iPhone Safari / Android browser.
- VoiceOver / TalkBack.
- production integration.
- real AI generated routes.
- real source ingestion.

## Research references
- Loewenstein, G. (1994). Psychological Bulletin. DOI 10.1037/0033-2909.116.1.75.
- Kang, M. J. et al. (2009). Psychological Science. DOI 10.1111/j.1467-9280.2009.02402.x.
- Gruber, M. J. et al. (2014). Neuron. DOI 10.1016/j.neuron.2014.08.060.
- Pirolli, P. (2005). Cognitive Science. DOI 10.1207/s15516709cog0000_20.
- Chi, E. H. et al. (2001). CHI '01, information scent.
- Ryan, R. M. & Deci, E. L. (2000). American Psychologist. DOI 10.1037/0003-066X.55.1.68.
- Slamecka, N. J. & Graf, P. (1978). JEP: Human Learning and Memory. DOI 10.1037/0278-7393.4.6.592.
- Karpicke, J. D. & Roediger, H. L. (2008). Science. DOI 10.1126/science.1152408.
- Makri, S. & Blandford, A. (2012). Journal of Documentation. DOI 10.1108/00220411211256030.
- Ghibellini, R. & Meier, B. (2025). Humanities and Social Sciences Communications, interruption / recall / resumption meta-analysis.

## Production decision
None. This LAB is evidence for later DIVE experience-spec selection only. Do **not** merge a prototype interaction into final DIVE by implication.
