# KAWASEMI Project Status

Last refreshed: 2026-08-16

This is the Product HQ status board. It summarizes GitHub-visible state. It is not a substitute for source code, QA evidence, or the detailed workstream files.

## Overall

KAWASEMI is on Day 2 of the 5-day v0.1 sprint. Prototype work has advanced faster than the original day-by-day minimum: LIVE, DIVE Session v0.2, DIVE TOP 10 synthesis, Day 2 UI/Motion, and the AI/Data v0.1 foundation are already available as isolated artifacts.

The critical path is now:

1. finish and merge the CARDS gesture retune only after green CI;
2. obtain short Owner hands-on review of the baseline-preserving shell, LIVE, and DIVE candidates;
3. pull Day 3 journalist-quality CARDS information work forward immediately;
4. begin narrow real-data ingestion plumbing without paid providers or production integration;
5. integrate only the pieces that survive Owner review.

Day labels in `docs/SPRINT_5_DAY_V01.md` are deadlines / latest-finish targets, not reasons to wait.

## Tracks

| Track | Status | Current reality | Next executable action |
|---|---|---|---|
| Core / CARDS | REWORKING | Gesture retune PR #11 is open and mergeable. Main smoke on the current PR head passes Browser smoke, human-like mobile E2E, untouched regression, LIVE E2E and LIVE visual matrix, but the Gesture profile comparison step currently FAILS. Physical iPhone/Safari subjective feel remains NOT TESTED. | Fix the gesture-profile comparison failure, rerun all required QA, then merge only if green. After merge, run Owner physical feel check before calling gesture feel approved. |
| Design / Tutorial / Navigation | REVIEW | PR #12 baseline-preserving Day 2 prototype is merged. It keeps the current production KAWASEMI visual baseline and provides CARDS/LIVE/DIVE navigation, utility menu, real-interaction tutorial, Full/Micro Opening, light/dark and landscape QA. Owner visual approval is still pending. Current opening background/kingfisher treatment is not considered visually final. | Owner reviews one baseline-preserving shell; meanwhile refine opening assets separately without changing the shell or gesture contract. |
| LIVE | OWNER_REVIEW_READY | LIVE TRACE is deployed and interaction-tested. A dedicated visual-consistency pass aligned fonts/colors/topbar/sheets with production and passed the required viewport matrix with no known overlap/clipping failures. | Owner experience review; production integration remains deferred until core shell/gesture decisions are stable. |
| DIVE | OWNER_REVIEW_READY | DIVE Experience Spec v0.2 and a persistent DIVE SESSION prototype are deployed. Session/resume, branches, Saved Discovery, Open Question, provenance and exact article return are tested. DIVE TOP 10 synthesis is also on main with ten different interaction models; Question Field is the current synthesis leader, not a final Owner decision. | Owner compares the strongest DIVE candidates and Session value. Keep FOCUS MAP as technical evidence, not final UI. Continue LAB work only as isolated evidence. |
| DIVE LAB | EXPLORING | DIVE TOP 10 synthesis is on main. A separate draft PR #24 contains NEWSROOM LAB D with ten more touchable prototypes; it is intentionally not merged into production. Existing FOCUS MAP visual QA issue #19 records legacy overlap/baseline drift problems. | Use LABs to identify winning mechanics; do not polish or integrate losing graph variants. |
| AI / Data | DONE — isolated v0.1 | Common provenance-first contracts, GOV.UK/JMA adapters, deterministic RawItem→Signal projection and semantic guards are persisted. Spend remains $0; no paid provider or account has been activated. | Build an isolated idempotent ingestion runner around SourceAdapter → RawItem persistence boundary → Signal projector with duplicate/revision fixtures. |
| Day 3 CARDS content | READY TO START | The sprint requires journalist-worthy article structure, source transparency and explicit CONFIRMED / CLAIM / UNKNOWN handling. Supporting data contracts already exist, so this no longer needs to wait for Day 3. | Start isolated article-information prototype/content fixtures now; avoid touching unstable gesture code. |

## Confirmed product direction

- Main modes: CARDS / LIVE / DIVE.
- SAVED / LIKES / HISTORY / SETTINGS are utility areas, not main modes.
- CARDS: vertical READ, right-to-left NEXT, left-to-right SAVE, article-end LIKE.
- The card itself is the article.
- LIVE: observation of incoming information, not another recommendation feed.
- DIVE: source-grounded, user-directed exploration; the current FOCUS MAP is not assumed to be final UI.
- DIVE SESSION records observable exploration and resume state without inferring what the user learned, believes, or mastered.
- AI must not silently collapse disputed claims into one authoritative truth.
- Demo visual quality uses `docs/DEMO_QUALITY_GATE.md`; overlap, clipping, overflow, or unintentional production-font/color drift are failures, not prototype excuses.

## Owner-visible items that still need hands-on judgment

- CARDS physical swipe feel on a real iPhone/Safari after PR #11 is green and merged.
- Whether the Day 2 baseline-preserving shell still feels like KAWASEMI and avoids looking cheap.
- Which DIVE interaction mechanics actually feel exciting enough to become the production direction.
- Whether LIVE TRACE feels useful and calm rather than like another feed/dashboard.
- Final opening background / polygonal kingfisher taste.

These should be grouped into short review blocks rather than repeatedly interrupting the Owner.

## PM rule

Important specialist results must be persisted to GitHub according to `docs/WORKSTREAM_HANDOFF_PROTOCOL.md` so Product HQ can continue without asking the Owner to relay long thread outputs.

User action being unnecessary does not mean the project should stop. Safe independent research, implementation, QA, documentation, and integration preparation should be pulled forward whenever dependencies allow.
