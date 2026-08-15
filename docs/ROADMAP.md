# KAWASEMI Roadmap

This roadmap is ordered to reduce rework. Do not build advanced information features on top of unstable core gestures and navigation.

## Phase 0 — Stabilize the interaction foundation

Goal: make the current product reliable enough that new features do not repeatedly break old ones.

Required work:
- audit current card / article structure,
- make article content remain inside the card,
- unify vertical READ + horizontal NEXT / SAVE gesture handling,
- restore NEXT and SAVE at article top / middle / end,
- rebuild tutorial using production components,
- add real scroll-to-LIKE tutorial experience,
- fix menu subview return behavior,
- remove obsolete detail-view interactions,
- run QA_CHECKLIST.md.

Exit condition:
Core article reading and gestures work consistently on iPhone-like Safari behavior.

## Phase 1 — Real article quality and source transparency

Goal: replace demo-like content with useful, inspectable information.

Build:
- structured article format,
- source metadata,
- source modal / bottom sheet,
- claim attribution,
- confirmed / disputed / unknown separation,
- text-first visual hierarchy,
- better article length and readability.

Exit condition:
A journalist can open a card, understand the event, see whose claims are whose, and reach the underlying source.

## Phase 2 — OpenAI API integration

Goal: process real incoming information using replaceable AI infrastructure.

Build API layer for:
- extraction,
- topic classification,
- exact / near duplicate detection,
- event-cluster candidate generation,
- claim extraction,
- structured article generation,
- change detection,
- DIVE node generation.

Architecture rule:
Do not expose API keys in frontend code. AI provider must be replaceable later.

Exit condition:
Real source material can be processed into structured KAWASEMI data without hardcoding demo articles.

## Phase 3 — CARDS as a real monitoring inbox

Goal: make the original journalist workflow genuinely useful.

Build:
- finite review queue,
- remaining count,
- user-defined monitoring topics,
- reason why an item entered CARDS,
- caught-up state,
- preserve raw / excluded material elsewhere,
- reliable seen / saved / liked state.

Exit condition:
The user can finish a monitoring session and know what they reviewed.

## Phase 4 — LIVE

Goal: expose the incoming information environment without turning AI into a hidden gatekeeper.

Build:
- chronological incoming information,
- visible source identity,
- likely same-event grouping,
- conflicting claims remain separate,
- what-changed indicators,
- access to raw items not promoted into CARDS,
- path from LIVE event cluster to structured CARDS content.

UI direction should be evaluated separately from CARDS so LIVE does not become a duplicate feed.

Exit condition:
The user can observe what is arriving now and inspect what AI did or did not elevate.

## Phase 5 — DIVE v1

Goal: turn one news event into user-directed understanding.

Build:
- DIVE entry from article end,
- first-level directions: evidence / claims / confirmed / unknown / context / history / technology / economics / politics / impact,
- typed relationships,
- on-demand node generation,
- graph pan / zoom / node selection,
- visited-path state,
- source provenance for factual nodes,
- no generic AI "you should read this next" chain.

Exit condition:
The user can move both deeper and sideways from one event and understand why nodes are connected.

## Phase 6 — Product polish

Goal: turn the working system into something people want to keep using.

Refine:
- opening interaction,
- kingfisher logo usage,
- motion system,
- light / dark themes,
- typography,
- mobile safe areas,
- loading / empty / error states,
- accessibility,
- perceived performance,
- notification strategy.

## Phase 7 — Broader source coverage

Expand real-world ingestion carefully:
- news sites / RSS where available,
- official government / institution sources,
- Telegram where technically and legally practical,
- X / Meta sources depending on API access and cost,
- other primary or specialist sources.

Source coverage should be documented rather than implied as universal.

## Later / separate product exploration

Not required for KAWASEMI core:
- personal VALUE MAP,
- worldview / philosophy log,
- historical figure dialogue grounded in sources,
- historical consequences exploration,
- linking a user's values to historical thinkers or decisions.

These concepts should stay documented but separate until the core information product is coherent.

## Development discipline

For every phase:
1. define the UX / data contract,
2. inspect existing implementation,
3. implement one coherent slice,
4. run regression QA,
5. test on real smartphone behavior,
6. record important decisions in DECISION_LOG.md,
7. only then move to the next slice.
