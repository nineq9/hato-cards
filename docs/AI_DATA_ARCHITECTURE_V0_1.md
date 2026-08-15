# KAWASEMI AI / Data Common Foundation v0.1

Status: **CONTRACT READY — isolated; not integrated into production CARDS / LIVE / DIVE**

Research / contract date: **2026-08-16**

Companion artifacts:
- `docs/ai-data/schema-v0.1.md`
- `docs/ai-data/interfaces-v0.1.ts`
- `docs/ai-data/sample-v0.1.json`
- `docs/ai-data/SOURCE_FEASIBILITY_V0_1.md`

This document concretizes `docs/ARCHITECTURE.md` without changing the current CARDS gesture implementation, LIVE TRACE demo, or DIVE FOCUS MAP demo.

## 1. Goal

Use one provenance-first substrate for all three product modes:

```text
Source
  ↓
RawItem
  ↓
Signal
  ↓
EventCandidate
  ↓
EventCluster
  ↓
Observation / Claim / Evidence / Verification
  ↓
Article
  ├─→ CARDS
  ├─→ LIVE
  └─→ DIVE Node / DIVE Relation
```

The same incoming information must not be rebuilt into unrelated feature-specific formats.

## 2. Non-negotiable epistemic rules

### No AI truth probability

There is intentionally no `truth_probability` field.

`ProcessingConfidence` may only measure a processing operation:
- extraction
- language detection
- entity linking
- topic classification
- duplicate matching
- same-event matching
- relation detection
- change detection

A `same_event = 0.94` score means only “these records probably concern the same event.” It says nothing about whether any claim inside them is true.

### Observation and Claim are separate

“Government A said X” can create:
1. an **Observation** that Government A published / uttered a statement;
2. a **Claim** containing proposition X, attributed to Government A.

The Observation may be confirmed from the first-party statement while Claim X remains unverified, disputed, contradicted, or unknown.

### Attribution is not verification

Every Claim keeps:
- claimant;
- original RawItem / source;
- assertion time;
- original wording or locator where permitted.

The claimant’s identity never automatically proves the proposition.

### AI may suggest; it may not silently confirm

`Verification` is separate from AI output. Authoritative `decidedBy` values are:
- `deterministic_policy`
- `human`
- `external_authority`
- `not_assessed`

AI may write an auditable `modelSuggestion`, but an AI suggestion alone cannot set a Claim to `confirmed`.

### Contradictions stay visible

Conflicting material remains separate Evidence / Claims. The pipeline must not smooth conflicting sources into one authoritative narrative.

### Source authority is scoped, not scored globally

`Source.authorityScopes[]` describes narrow domains such as “this agency’s own issued warnings.” It is not a universal credibility number.

### Multiple URLs are not automatically independent evidence

`Evidence.independenceGroup` groups syndicated copies / common upstream origins so three copies of one report are not counted as three independent confirmations.

## 3. Core records

Detailed fields are in `schema-v0.1.md` and `interfaces-v0.1.ts`.

### Source
Operational definition of an ingestible source/platform: identity, endpoint, language/jurisdiction, narrow authority scope, fetch/auth method, rate policy, rights status, storage/retention policy.

### RawItem
Recoverable source capture. Keeps source ID, external ID, canonical URL, published/modified/observed time, author/organization, original title/text when rights allow, language/media, content hash, retrieval metadata, and revision links.

Do not silently overwrite changed source material. A material source update becomes a new RawItem revision linked with `revisionOfRawItemId` / `supersedes` / `updates`.

### Signal
Normalized incoming unit used by LIVE and downstream processing. Keeps RawItem/source IDs, normalized excerpt, timestamps, topic/entities/location, grouping state, candidate/cluster IDs, and processing confidence.

A Signal remains valid even if enrichment fails. LIVE must not hide a real incoming item just because clustering or claim extraction failed.

### EventCandidate
Temporary hypothesis that one or more Signals may concern the same event. Keeps time/entity/location/topic features, candidate cluster IDs, grouping reasons, and **same-event confidence only**.

### EventCluster
Durable but revisable grouping. Keeps member Signals/RawItems, Claims/Observations/Articles, topic/entities/location, and merge/split/member history.

### Observation
A checkable observation about a source/world record: a statement was issued, a document exists, a measured value was reported, etc. It may contain links to embedded Claims.

### Claim
An attributed proposition. Keeps proposition, claimant, source records, time, event cluster, entities/location/topics, Evidence, Verification, and extraction confidence.

### Evidence
Provenance link from source material to a target record. v0.1 relations:
- `establishes_observation`
- `establishes_attribution`
- `supports`
- `contradicts`
- `context_only`

Keeps source, RawItem, original URL, excerpt/locator where permitted, timing, origin type, and independence group.

### Verification
Evidence state independent from AI confidence. v0.1 states:
- `not_assessed`
- `unverified`
- `supported`
- `confirmed`
- `contradicted`
- `disputed`
- `insufficient_evidence`

Conservative v0.1 rule:
- first-party source behavior can be deterministically confirmed, e.g. “JMA issued this warning”;
- proposition-level Claims begin unverified unless a non-AI policy has sufficient evidence;
- conflicting independent evidence becomes `disputed` rather than forcing a winner;
- AI does not invent the future `supported → confirmed` policy.

### Article
CARDS projection with lineage:
- `what[]` → **WHAT**
- `certainty.confirmed[] / claims[] / unknowns[]` → **CERTAINTY**
- `context[]` → **CONTEXT**
- `explore[]` → **EXPLORE**

Every factual/generated entry keeps `supportRefs`, `evidenceIds`, and `sourceIds`. AI prose never replaces the underlying source records.

### DIVE Node
Typed node such as event, claim, evidence, source, person, organization, place, technology, historical event, concept, economic/political factor, article, unknown.

### DIVE Relation
Generic `related` is intentionally absent. v0.1 relation types:
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

Each relation also has a semantic class: evidentiary, attribution, contextual, causal, structural, or explanatory.

Invariant: `historically_similar_to` is **contextual** and must never change Verification state or be treated as supporting evidence.

## 4. CONFIRMED / CLAIM / UNKNOWN presentation

These are derived presentation buckets, not raw AI labels.

### CONFIRMED
Display only when the sentence is backed by a record with `Verification.state = confirmed` and linked Evidence.

Safe example: “Agency A published statement X.” This may be confirmed as an Observation while X remains a Claim.

### CLAIM
Attributed proposition not confirmed. The claimant stays visible.

### UNKNOWN
Unresolved question, missing evidence, or conflicting/insufficient evidence. Do not fabricate a resolution.

## 5. LIVE TRACE projection

| LIVE need | Common-data derivation |
|---|---|
| Signal | `Signal` |
| Event Cluster | `EventCluster` |
| likely same event | `EventCandidate.sameEventConfidence` |
| grouped / ungrouped | `Signal.groupingState` |
| claimant | `Claim.attribution.claimant` |
| source | `RawItem.sourceId → Source` |
| conflicting claims | Claim + Evidence `contradicts` / Verification `disputed` |
| new since last visit | `Signal.observedAt > LiveCursor.lastVisitedAt` |
| raw / non-promoted | RawItem/Signal may exist without Article |

Newness is timestamp/cursor state, not an AI importance score.

## 6. CARDS projection

### WHAT
Short event framing from the cluster, confirmed Observations, and clearly attributed Claims. Every entry keeps provenance.

### CERTAINTY
Three explicit lists: confirmed, claims, unknowns. Each entry must trace to Claim/Observation → Evidence → RawItem → Source.

### CONTEXT
Use typed contextual/causal/explanatory relations. Historical similarity may appear as context but never as evidence for the current event.

### EXPLORE
Points to DIVE nodes/directions rather than an opaque AI “read next” tunnel.

## 7. DIVE projection

DIVE can lazily materialize a current EventCluster plus up to 5–7 directions from Claims, Evidence, Unknowns, Sources, context, history, technical/economic/political factors.

`confirms` is stronger than `supports` and is never inferred merely because texts are similar.

## 8. Ingestion pipeline v0.1

```text
1. SourceAdapter.fetch()
2. persist RawItem first
3. normalize URL / encoding / language / timestamps
4. deterministic exact duplicate checks
5. cheap mechanical extraction
6. duplicate + same-event candidate generation
7. EventCandidate → EventCluster update
8. Claim + attribution extraction
9. Evidence linking + Verification policy
10. change detection / revision linking
11. materialize LIVE view
12. compose Article only when requested / queued
13. expand DIVE lazily
```

Persist RawItem before enrichment. An AI failure may leave an ungrouped Signal; it must not erase the incoming record.

Exact duplicate order:
1. `(sourceId, externalId)`
2. normalized canonical URL
3. content hash
4. fuzzy/embedding/model assistance only for unresolved near-duplicates

Change detection creates a new revision rather than overwriting the old record.

## 9. Source adapter boundary

```ts
interface SourceAdapter {
  sourceId: string;
  fetch(cursor?: string): Promise<{
    items: RawItemInput[];
    nextCursor?: string;
    observedAt: string;
  }>;
}
```

Adapters own authentication, pagination, conditional GET, rate limits, retries, source IDs, and rights/storage policy. Downstream code receives normalized common records rather than X/Telegram/GDELT/RSS-specific payloads.

## 10. AI provider abstraction

Browser/UI code never imports model SDKs.

```text
CARDS / LIVE / DIVE
      ↓
KAWASEMI server API
      ↓
AI task router
      ↓
AIProvider adapter
```

Provider interface lives in `interfaces-v0.1.ts`. Task routing uses product tasks (`extract_claims`, `duplicate_assist`, `compare_claims`, `compose_article`, `expand_dive`) rather than hard-coding model names into domain records.

### Mechanical tier
- signal / claim / entity extraction
- language detection
- broad topic classification
- duplicate candidate assistance

### Reasoning tier
- nuanced Claim comparison
- multi-source context construction
- structured Article composition
- DIVE relation/structure reasoning

### Candidate OpenAI mapping — NOT ACTIVATED
Official OpenAI docs checked 2026-08-16:

| Role | Candidate | Input / 1M | Output / 1M |
|---|---:|---:|---:|
| Mechanical default | GPT-5.4 nano | $0.20 | $1.25 |
| Mechanical escalation | GPT-5.4 mini | $0.75 | $4.50 |
| Reasoning default | GPT-5.6 Terra | $2.50 | $15.00 |
| Hard-case escalation | GPT-5.6 Sol | $5.00 | $30.00 |

GPT-5.4 nano is explicitly positioned by OpenAI for classification/data extraction/ranking. Structured Outputs / JSON Schema should be used where supported, followed by server validation.

Model names belong in server configuration and audit records, not CARDS/LIVE/DIVE schemas. Another provider can later implement the same `AIProvider` contract.

**No paid AI call is authorized or executed in this v0.1 work.** Owner approval is required before first paid call/account setup.

## 11. Illustrative AI cost model — no spend incurred

Planning example only:
- 1,000 raw items/day × 1,500 input + 250 output tokens on GPT-5.4 nano ≈ **$0.61/day**
- 100 complex cluster jobs/day × 4,000 input + 800 output on GPT-5.6 Terra ≈ **$2.20/day**
- 30 Article jobs/day × 6,000 input + 1,200 output on GPT-5.6 Terra ≈ **$0.99/day**
- hypothetical total ≈ **$3.80/day / $114 per 30 days**

This is not a budget commitment. The five-day prototype should be much smaller and should make no paid provider call before Owner approval.

## 12. v0.1 source direction

See `SOURCE_FEASIBILITY_V0_1.md` for current official-source research.

Recommended first set:
1. **GDELT 2.0 / DOC API** — broad discovery; free/open; never a truth authority.
2. **JMA disaster-prevention XML PULL** — first-party Japanese live information; no user registration.
3. **GOV.UK Content API** — structured first-party official content; no authentication; documented 10 req/s/client.
4. **RSS/Atom adapter** — implement now, enable each feed only after source-specific terms approval.

Do not make v0.1 depend on X, Telegram, Reddit, Reuters, AP, ACLED, ReliefWeb, or YouTube API because they currently introduce payment, account/approval, licensing, or material terms-review dependencies.

## 13. Error handling

- Every stage is idempotent by source/external ID/canonical URL/content hash.
- Retry transient network/429/5xx with bounded exponential backoff + jitter.
- Respect source-specific wait headers/signals.
- Per-source circuit breaker after repeated failure.
- Quarantine invalid structured output / rights violations / impossible metadata.
- Preserve RawItem when enrichment fails and storage is permitted.
- AI structured output: validate → at most one repair/escalation → fail visibly; never silently coerce malformed output.

## 14. Observability

Every pipeline operation carries `runId` plus:
- stage/source/record IDs
- provider/model/task when used
- prompt/schema version
- input/output tokens and estimated cost
- duration/retries/status/error code

Minimum metrics:
- source fetch success + lag
- items/source
- exact/near duplicate rate
- grouped vs ungrouped
- cluster merge/split churn
- provenance completeness
- Article provenance coverage
- enrichment backlog
- provider schema-invalid/failure rate
- tokens/cost by task/model
- rate-limit events/source

Never log API keys/bearer tokens. Avoid logging full licensed/private source text by default.

## 15. Security / storage

- Provider/source credentials only in server environment/secret storage.
- No secrets in browser JavaScript or public GitHub.
- Database/queue/hosting vendor intentionally not selected.
- A relational database plus typed relation tables is sufficient for v0.1; do not adopt a graph DB only because DIVE is graph-shaped.
- Embeddings/vectors are derived rebuildable indexes, never canonical Evidence.

## 16. Validation invariants for Build

Fail validation when:
1. a factual Article entry has no support/source refs;
2. an AI confidence is used as truth probability;
3. a Claim lacks attribution/source records;
4. `historically_similar_to` is treated as evidence;
5. Evidence lacks source/RawItem/original URL;
6. a cluster merge discards provenance;
7. a RawItem revision overwrites history;
8. provider output bypasses schema validation;
9. browser/client code contains provider secrets.

## 17. Intentionally unresolved

Not blockers for this isolated contract:
- proposition-level `supported → confirmed` policy;
- DB/queue/hosting vendor;
- embedding provider;
- near-duplicate / same-event thresholds;
- cluster split/merge tuning;
- final per-publisher RSS rights allowlist;
- source-specific retention windows;
- external paid/credentialed accounts;
- production volume/budget.

## 18. Test status

### PASS
- Schema/interfaces/sample were reviewed for the required Source → RawItem → Signal → Event → epistemic → Article → DIVE lineage.
- Synthetic example preserves “confirmed observation of a statement” separately from “truth of embedded Claim.”
- Historical similarity is explicitly contextual, not supporting Evidence.
- No production code was touched.

### NOT TESTED
- live source ingestion
- database persistence
- OpenAI or other provider calls
- end-to-end Article generation
- production CARDS integration
- production LIVE integration
- production DIVE integration
- real rate-limit behavior
- production rights/legal compliance review

This is intentional for the current stage.
