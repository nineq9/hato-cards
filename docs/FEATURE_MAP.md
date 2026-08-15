# KAWASEMI Feature Map

This document separates current core product features from later ideas so the product does not become conceptually overloaded.

## A. Core v1 product

### 1. CARDS
Purpose: finite review queue.

Required behavior:
- shows information the user is expected to review,
- unread / remaining count is visible,
- article is read by vertical scrolling inside the card,
- NEXT = right-to-left swipe,
- SAVE = left-to-right swipe,
- LIKE = heart at article end,
- next article starts at scroll position 0,
- reaching zero produces a caught-up state,
- source is inspectable.

### 2. LIVE
Purpose: observe incoming information before or alongside full editorial processing.

Core requirements:
- chronological incoming items,
- source identity remains visible,
- same-event candidates may be grouped without collapsing conflicting claims,
- raw / excluded information remains inspectable,
- show what is new compared with the user's previous review,
- allow transition from a live event cluster into a structured card when appropriate.

Possible UI direction:
- pulse / radar / event-cluster view rather than another identical card feed,
- clear distinction between raw incoming signals and reviewed information.

### 3. DIVE
Purpose: user-directed deeper exploration.

DIVE should expose directions rather than opaque recommendations.

Possible entry directions:
- evidence
- claims
- confirmed
- unknown
- context
- history
- technology
- economics
- politics
- impact

Important rule:
A related historical event must never be presented as evidence for the current event merely because it is similar.

Knowledge structure may expand both:
- deeper into a topic,
- sideways into connected topics.

The user should be able to navigate a map of connected nodes rather than a single AI-selected path.

### 4. SAVED
Purpose: deliberate archive.

Requirements:
- saved items remain accessible,
- grouping / organization can grow later,
- saving is distinct from liking,
- save must not consume the current article or change reading position.

### 5. SOURCES
Purpose: preserve traceability.

Requirements:
- source name,
- source title,
- time / publication metadata when available,
- claim attribution,
- external original link,
- modal / sheet first, then explicit external navigation.

### 6. MENU / SETTINGS
Minimum settings:
- language,
- broad interests / monitoring topics,
- light / dark or theme preferences,
- saved / liked access.

Navigation must never trap the user in a menu subview.

## B. AI processing capabilities

These are capabilities, not user-facing modes.

### Collection
Gather information from connected feeds / sources.

### Deduplication
Remove exact duplicates and flag near-duplicates.

### Event clustering
Group items that likely refer to the same event while preserving each source's wording and claim identity.

### Claim extraction
Represent statements as attributed claims rather than silently converting them into facts.

### Change detection
Identify what is genuinely new since the user last reviewed an event.

### Topic classification
Use broad user-controlled topic categories.

### Structured article generation
Create a readable article structure from source material without inventing certainty.

### DIVE graph generation
Generate connected nodes and typed relationships on demand.

## C. Important relationship types for DIVE / knowledge graph

Avoid generic `related` when a more precise relationship is possible.

Potential relationship types:
- supports
- contradicts
- claims
- confirms
- source_of
- context_for
- historically_similar_to
- caused_by
- affects
- part_of
- explains
- technical_dependency

Each relationship should preserve provenance when possible.

## D. Personalization boundaries

Allowed:
- broad topic interests,
- monitoring goals,
- role-specific needs,
- saved items,
- broad reading interest signals.

Do not automatically use:
- inferred ideology,
- political alignment,
- approval / disapproval of a side,
- skipped article as a political preference signal.

## E. Not part of core v1

Keep as future concepts:
- VALUE MAP / personal worldview map,
- historical-figure dialogue,
- ideological similarity matching,
- historical consequences simulator,
- personal philosophy timeline.

These may become separate products or optional connected modules later.
