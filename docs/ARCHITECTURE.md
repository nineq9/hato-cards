# KAWASEMI Architecture Outline

This is a product-level architecture guide, not a commitment to a specific backend vendor or AI provider.

## 1. Frontend

Current repository contains the web / PWA prototype.

Frontend responsibilities:
- card rendering,
- article-in-card reading,
- gesture handling,
- menu / settings,
- saved / liked state UI,
- LIVE visualization,
- DIVE graph visualization,
- source sheet / modal,
- onboarding / tutorial,
- local optimistic interaction state.

Important rule:
Core gestures should be implemented through a shared gesture decision layer rather than independent handlers competing on the same surface.

## 2. Backend / service layer

A production version should add a server-side layer for:
- source ingestion,
- AI calls,
- API key protection,
- event processing,
- persistence,
- user-specific review state,
- notification scheduling,
- auditability.

Do not place OpenAI or other paid provider secrets directly in browser JavaScript.

## 3. Source ingestion

Conceptual pipeline:

SOURCE
→ raw item
→ normalization
→ exact duplicate check
→ near-duplicate / same-event candidate detection
→ claim / entity extraction
→ topic tagging
→ store raw + structured representation

Raw items should remain recoverable when possible.

## 4. Event model

Do not prematurely convert multiple reports into one authoritative narrative.

Suggested structure:

EventCandidate
- id
- time window
- entities
- locations
- broad topic tags
- linked raw items
- confidence that items refer to the same event

RawSourceItem
- source
- source type
- original URL / identifier
- timestamp
- original text / extracted text
- language
- media references

Claim
- claimant / source
- claim text
- related event candidate
- evidence links
- status: claim / confirmed / contradicted / unknown

## 5. Article model

KAWASEMI article is a structured presentation layer built from source material.

Suggested fields:
- title
- concise summary
- what_happened
- confirmed_information[]
- claims[]
- unknowns[]
- context[]
- key_numbers[]
- source_refs[]
- topic_tags[]
- monitoring_reason[]

Do not store an AI-generated interpretation as if it were raw source truth.

## 6. CARDS state

Per user / device:
- unseen
- seen
- saved
- liked
- skipped / nexted
- reading progress if intentionally preserved

Important:
Skip behavior should not automatically become ideological preference data.

A card can enter the queue because of:
- explicit FOLLOW topic,
- role / monitoring rule,
- broader significant-event rule.

The reason should be inspectable.

## 7. LIVE state

LIVE should preserve access to:
- raw recent items,
- source activity,
- likely event clusters,
- new information since last review,
- material not promoted into CARDS.

LIVE is not required to resolve truth before display.

## 8. DIVE graph

Suggested node categories:
- event
- claim
- evidence
- source
- person
- organization
- place
- technology
- historical event
- concept
- economic factor
- political factor

Suggested edge types:
- supports
- contradicts
- claims
- confirms
- source_of
- context_for
- historically_similar_to
- affects
- caused_by
- part_of
- explains

Each node / edge derived from factual source material should preserve provenance.

DIVE generation may be lazy / on demand. Do not precompute the entire world graph.

## 9. AI provider abstraction

Use an abstraction such as:

AIProvider
- extractStructuredData()
- classifyTopics()
- findDuplicateCandidates()
- extractClaims()
- generateStructuredArticle()
- generateDiveExpansion()

Initial implementation may use OpenAI, but the rest of the application should not depend directly on one provider's response format.

## 10. Model-tier strategy

Use cheaper models for high-volume mechanical tasks when quality is sufficient:
- classification,
- extraction,
- simple deduplication assistance.

Use stronger models only where needed:
- complex multi-source synthesis,
- nuanced claim separation,
- difficult DIVE expansion.

Cost should be measurable per pipeline stage.

## 11. Auditability

For every transformed item, preserve enough information to answer:
- where did this come from?
- what did AI change?
- why was this grouped?
- why was this surfaced?
- what did the user not see in CARDS?

The system should make hidden editorial choices inspectable where practical.

## 12. Testing boundaries

Separate tests for:
- gesture behavior,
- state transitions,
- article rendering,
- source attribution,
- event grouping,
- AI output schema validation,
- DIVE graph integrity,
- user review-count logic.

UX regression requirements live in `QA_CHECKLIST.md`.

## 13. Concrete AI / Data common contract v0.1

The abstract architecture above is concretized in:
- `docs/AI_DATA_ARCHITECTURE_V0_1.md`
- `docs/ai-data/schema-v0.1.md`
- `docs/ai-data/interfaces-v0.1.ts`
- `docs/ai-data/sample-v0.1.json`
- `docs/ai-data/SOURCE_FEASIBILITY_V0_1.md`

The common substrate is:

```text
Source
→ RawItem
→ Signal
→ EventCandidate
→ EventCluster
→ Observation / Claim / Evidence / Verification
→ Article
├─→ CARDS
├─→ LIVE
└─→ DIVE Node / DIVE Relation
```

Critical invariants:
- AI processing confidence is not truth confidence; there is no `truth_probability` field.
- Same-event probability is a grouping judgment only and is separate from Claim Verification.
- Observation, attribution, proposition-level Claim, Evidence, and Verification are separate records/concepts.
- A first-party source can confirm that it issued a statement without automatically confirming the statement's proposition.
- AI alone cannot set a Claim to `confirmed`; any model judgment remains an auditable suggestion until a non-AI verification policy or human/external authority establishes state.
- Raw source material and revisions retain provenance rather than being overwritten by AI summaries.
- CARDS factual entries must keep source/evidence refs back to common data.
- LIVE may display an ungrouped Signal when enrichment fails; grouping is not a prerequisite for visibility.
- DIVE relationships are typed; `historically_similar_to` is contextual and cannot be treated as supporting Evidence.
- AI providers are accessed server-side through a provider/task abstraction. Browser/UI code must not contain provider credentials or vendor response assumptions.

This v0.1 contract is intentionally isolated from current production CARDS / LIVE / DIVE code until its adapters and projections are tested against real data.
