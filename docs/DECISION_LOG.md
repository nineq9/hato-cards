# KAWASEMI Decision Log

Record important product and technical decisions here so future changes do not accidentally reverse them.

---

## 2026-08-15 — Article card is the article

Decision:
Do not use the old model of card preview → separate detail screen for ordinary article reading.

Current interaction contract:
- vertical scroll = READ
- right-to-left swipe = NEXT
- left-to-right swipe = SAVE
- heart at article end = LIKE

Reason:
The previous detail transition felt discontinuous and made returning awkward. Continuous reading inside the card is more direct.

Implication:
Old detail-view navigation and gesture logic should be removed or integrated rather than kept in parallel.

---

## 2026-08-15 — Tutorial should teach through real interaction

Decision:
Tutorial should reuse production components and gestures wherever possible.

Reason:
A tutorial that says "scroll" or "swipe" without letting the user perform the real interaction is confusing and easily drifts out of sync with production behavior.

Implication:
Tutorial QA is part of gesture regression QA.

---

## 2026-08-15 — SAVE and LIKE are different signals

Decision:
SAVE and LIKE remain distinct.

SAVE:
Useful / keep for later.

LIKE:
This article or broad topic / quality was valuable.

Reason:
They represent different user intentions and should not be collapsed into one personalization signal.

---

## 2026-08-15 — Personalize broad interests, not ideology

Decision:
Personalization may learn broad topics and monitoring needs but should not automatically infer and reinforce political viewpoint.

Reason:
Viewpoint personalization can create an information bubble and turn user behavior into ideological filtering.

Implication:
A skipped article is not automatically interpreted as disagreement with its viewpoint.

---

## 2026-08-15 — AI should not act as an invisible judge of truth

Decision:
AI is primarily an organizer, extractor, summarizer, clusterer, and exploration assistant.

When evidence is disputed or incomplete, the system should preserve source attribution and uncertainty instead of silently producing one authoritative narrative.

Reason:
AI output can sound certain even when source material is not.

---

## 2026-08-15 — Relevance is not evidence

Decision:
DIVE and related information must distinguish the type of relationship.

Example:
A previous attack on a similar facility may provide historical context but is not evidence that the current event happened in the same way.

Reason:
Selecting "related" information can bias perception even without making an explicit claim.

Implication:
Knowledge graph edges should be typed whenever possible.

---

## 2026-08-15 — DIVE is user-directed, not an AI recommendation tunnel

Decision:
DIVE should offer directions such as evidence, claims, confirmed, unknown, context, history, technology, economics, politics, and impact.

The user chooses the path.

Reason:
An AI-selected sequence of "what to read next" can implicitly privilege one interpretation.

---

## 2026-08-15 — CARDS should be finite

Decision:
Core required monitoring should have a meaningful caught-up state.

Reason:
The original user problem is information overload and fear of missing necessary information, not lack of endless content.

Implication:
Open-ended exploration belongs primarily in DIVE / discovery-like experiences, not required monitoring.

---

## 2026-08-15 — LIVE preserves visibility into incoming / non-promoted information

Decision:
LIVE should make incoming information and raw/source-level material inspectable, including information not elevated into CARDS when practical.

Reason:
AI selection cannot be eliminated completely, so the system should reduce hidden filtering and allow human audit.

---

## 2026-08-15 — Product documentation is part of the development process

Decision:
Before major UX or information-policy changes, consult:
- PRODUCT_PRINCIPLES.md
- UX_RULES.md
- QA_CHECKLIST.md

Record major reversals or new principles in this decision log.

Reason:
Repeated isolated AI coding instructions caused regressions, duplicated behavior, and inconsistent interaction rules.

---

## 2026-08-15 — Editorial Dock is the primary main-mode navigation direction

Decision:
Use a persistent, restrained Editorial Dock for the three primary product modes:
- CARDS
- LIVE
- DIVE

The Dock should be text-first and indicate the active mode with typography / a fine rule rather than icon + label tabs, pill backgrounds, or glow.

SAVED / LIKES / HISTORY / SETTINGS are utilities inside the hamburger menu, not peer main modes.

Reason:
CARDS, LIVE, and DIVE answer three different primary user questions (review, observe, explore), while the other destinations are supporting utilities. The structure should make that hierarchy visible without looking like a generic news-app tab bar.

Implication:
Legacy FOR YOU / HOT navigation language should be removed during the relevant app-shell work. Mode switching should preserve per-mode context where practical.

---

## 2026-08-15 — Shared KAWASEMI design grammar precedes feature-specific polish

Decision:
Use `docs/DESIGN_SYSTEM.md` as the shared v0.1 visual/motion grammar for CARDS, LIVE, DIVE, Tutorial, Menu, and common overlays.

Key rules include:
- quiet by default, sharp on action,
- information before interface decoration,
- color is not truth,
- text/spacing/structure before containers,
- shared source and epistemic-state presentation,
- restrained ordinary motion,
- geometric kingfisher, not mascot treatment,
- avoid neon/game/SaaS/pill-heavy visual drift.

Reason:
Polishing features independently would create multiple visual languages and increase integration rework during the sprint.

Implication:
Feature-specific designs may extend the system but should not silently contradict it. Owner-taste refinements should be decided from touchable prototypes after the shared grammar is applied.
