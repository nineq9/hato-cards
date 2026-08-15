# KAWASEMI AI / Data Schema v0.1

Status: **contract definition — isolated from production code**

This schema is the shared contract for future CARDS / LIVE / DIVE data. Field names are provider-neutral. IDs are opaque strings; timestamps are ISO 8601 UTC unless a source supplies only local/partial time.

## Cross-cutting types

### ProcessingConfidence

```ts
type ProcessingConfidence = {
  task: 'extraction' | 'language_detection' | 'entity_linking' | 'topic_classification' |
        'duplicate_matching' | 'same_event_matching' | 'relation_detection' | 'change_detection';
  score: number;          // 0..1, confidence in this processing operation only
  method: 'deterministic' | 'heuristic' | 'model';
  modelRunId?: string;
  explanation?: string;
};
```

**Invariant:** this must never mean “probability that the information is true.”

### Verification

```ts
type VerificationState =
  | 'not_assessed'
  | 'unverified'
  | 'supported'
  | 'confirmed'
  | 'contradicted'
  | 'disputed'
  | 'insufficient_evidence';

type Verification = {
  state: VerificationState;
  decidedBy: 'deterministic_policy' | 'human' | 'external_authority' | 'not_assessed';
  evidenceIds: string[];
  contradictionEvidenceIds: string[];
  policyVersion?: string;
  checkedAt?: string;
  modelSuggestion?: {
    state: VerificationState;
    modelRunId: string;
    rationale?: string;
  };
};
```

**Invariant:** AI output alone cannot set `decidedBy` to a confirming authority.

### EntityRef

```ts
type EntityRef = {
  id: string;
  type: 'person' | 'organization' | 'place' | 'country' | 'facility' | 'technology' | 'concept' | 'other';
  name: string;
  aliases?: string[];
  canonicalUrl?: string;
};
```

### LocationRef

```ts
type LocationRef = {
  name: string;
  countryCode?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  precision?: 'exact' | 'approximate' | 'region' | 'country' | 'unknown';
};
```

### Attribution

```ts
type Attribution = {
  claimant: {
    entityId?: string;
    name: string;
    role?: string;
  };
  sourceId: string;
  rawItemIds: string[];
  assertedAt?: string;
  attributionText?: string;
};
```

## 1. Source

Operational definition of one ingestible origin/platform.

```ts
type Source = {
  id: string;
  name: string;
  sourceType: 'rss' | 'atom' | 'official_web' | 'government_api' | 'telegram' | 'x' |
              'youtube' | 'reddit' | 'news_media' | 'wire' | 'osint' | 'other';
  role: 'official_actor' | 'publisher' | 'platform' | 'aggregator' | 'dataset' | 'archive' | 'eyewitness';
  homepageUrl?: string;
  feedOrApiUrl?: string;
  organization?: string;
  languages?: string[];
  jurisdictions?: string[];
  authorityScopes?: string[];
  ingestion: {
    method: 'rss' | 'atom' | 'http_json' | 'http_xml' | 'html' | 'platform_api' | 'manual';
    auth: 'none' | 'api_key' | 'oauth' | 'account' | 'licensed';
    rateLimit?: string;
    cursorStrategy?: string;
  };
  rights: {
    termsStatus: 'approved' | 'review_required' | 'restricted' | 'unknown';
    termsUrl?: string;
    robotsPolicy?: string;
    storeOriginalText: 'allowed' | 'limited' | 'not_allowed' | 'unknown';
    retention?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
};
```

No global “credibility score.” `authorityScopes` is narrow: e.g. an agency is authoritative that it issued its own notice, not automatically that every embedded proposition is true.

## 2. RawItem

Recoverable source capture. Source updates create revisions instead of overwriting history.

```ts
type RawItem = {
  id: string;
  sourceId: string;
  externalId?: string;
  canonicalUrl: string;
  publishedAt?: string;
  modifiedAt?: string;
  observedAt: string;
  author?: { name: string; entityId?: string };
  organization?: { name: string; entityId?: string };
  originalTitle?: string;
  originalText?: string;
  originalTextStorage: 'full' | 'excerpt_only' | 'metadata_only';
  language?: string;
  media?: Array<{ type: 'image' | 'video' | 'audio' | 'document'; url: string; caption?: string }>;
  contentHash?: string;
  retrieval: {
    fetchedAt: string;
    httpStatus?: number;
    etag?: string;
    lastModified?: string;
    adapterVersion: string;
  };
  revisionOfRawItemId?: string;
  relationships?: Array<{
    type: 'supersedes' | 'updates' | 'corrects' | 'quotes' | 'reposts';
    rawItemId: string;
  }>;
};
```

## 3. Signal

Normalized incoming unit. It may remain ungrouped and still be displayed in LIVE.

```ts
type Signal = {
  id: string;
  rawItemId: string;
  sourceId: string;
  canonicalUrl: string;
  signalType: 'report' | 'official_statement' | 'alert' | 'measurement' | 'post' | 'video' | 'document' | 'other';
  publishedAt?: string;
  observedAt: string;
  normalizedTitle?: string;
  normalizedExcerpt?: string;
  language?: string;
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  groupingState: 'ungrouped' | 'candidate' | 'grouped';
  eventCandidateIds: string[];
  eventClusterId?: string;
  processingConfidence: ProcessingConfidence[];
  relationships?: Array<{ type: 'revision_of' | 'duplicate_of' | 'near_duplicate_of'; targetSignalId: string }>;
};
```

## 4. EventCandidate

Temporary same-event hypothesis.

```ts
type EventCandidate = {
  id: string;
  createdAt: string;
  updatedAt: string;
  signalIds: string[];
  rawItemIds: string[];
  timeWindow?: { start?: string; end?: string };
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  candidateClusterIds: string[];
  sameEventConfidence: ProcessingConfidence; // task must be same_event_matching
  reasons: string[];
  status: 'open' | 'grouped' | 'rejected' | 'needs_review';
};
```

**Invariant:** `sameEventConfidence` says nothing about truth or source reliability.

## 5. EventCluster

Durable but revisable grouping of Signals that likely concern one event.

```ts
type EventCluster = {
  id: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
  timeWindow?: { start?: string; end?: string };
  signalIds: string[];
  rawItemIds: string[];
  eventCandidateIds: string[];
  observationIds: string[];
  claimIds: string[];
  articleIds: string[];
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  history: Array<{
    at: string;
    type: 'created' | 'member_added' | 'member_removed' | 'merged' | 'split' | 'label_changed';
    relatedClusterIds?: string[];
    reason?: string;
  }>;
};
```

A cluster is an organizational container, never an authoritative narrative.

## 6. Observation

Checkable observation separate from any embedded proposition.

```ts
type Observation = {
  id: string;
  eventClusterId?: string;
  type: 'statement_issued' | 'document_published' | 'measurement_reported' | 'source_update' |
        'media_published' | 'event_observed' | 'other';
  text: string;
  observedAt?: string;
  occurredAt?: string;
  sourceIds: string[];
  rawItemIds: string[];
  evidenceIds: string[];
  embeddedClaimIds: string[];
  verification: Verification;
};
```

Example: “Government A issued a statement saying X” may be a confirmed Observation even while X remains an unverified Claim.

## 7. Claim

Attributed proposition; attribution and verification are separate.

```ts
type Claim = {
  id: string;
  eventClusterId?: string;
  proposition: string;
  language?: string;
  attribution: Attribution;
  assertedAt?: string;
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  evidenceIds: string[];
  verification: Verification;
  extractionConfidence?: ProcessingConfidence;
  relationships?: Array<{
    type: 'contradicts' | 'qualifies' | 'updates' | 'repeats';
    claimId: string;
  }>;
};
```

## 8. Evidence

Traceable source material attached to an Observation, Claim, Article entry, or DIVE relation.

```ts
type Evidence = {
  id: string;
  target: {
    type: 'observation' | 'claim' | 'article_entry' | 'dive_relation';
    id: string;
  };
  relation: 'establishes_observation' | 'establishes_attribution' | 'supports' | 'contradicts' | 'context_only';
  sourceId: string;
  rawItemId: string;
  originalUrl: string;
  publishedAt?: string;
  observedAt: string;
  excerpt?: string;
  locator?: { type: 'paragraph' | 'timestamp' | 'page' | 'section' | 'other'; value: string };
  originType: 'first_party' | 'independent_report' | 'syndicated' | 'aggregator' | 'archive' | 'unknown';
  independenceGroup?: string;
  notes?: string;
};
```

`independenceGroup` prevents syndicated copies of one upstream report from masquerading as multiple independent confirmations.

## 9. Article

CARDS-ready structured presentation with complete lineage.

```ts
type ArticleEntry = {
  id: string;
  text: string;
  supportRefs: Array<{ type: 'observation' | 'claim' | 'event_cluster' | 'dive_node'; id: string }>;
  evidenceIds: string[];
  sourceIds: string[];
};

type Article = {
  id: string;
  eventClusterId: string;
  title: string;
  conciseSummary: string;
  language: string;
  publishedAt?: string;
  generatedAt: string;
  what: ArticleEntry[];
  certainty: {
    confirmed: ArticleEntry[];
    claims: ArticleEntry[];
    unknowns: ArticleEntry[];
  };
  context: Array<ArticleEntry & { relationType?: DiveRelationType }>;
  explore: Array<{ label: string; question?: string; diveNodeId: string; relationType?: DiveRelationType }>;
  keyNumbers?: ArticleEntry[];
  topicTags: string[];
  sourceIds: string[];
  rawItemIds: string[];
  claimIds: string[];
  observationIds: string[];
  generation: {
    status: 'draft' | 'validated' | 'rejected';
    providerRunIds: string[];
    promptVersion?: string;
    schemaVersion: '0.1';
    provenanceCoverage: number; // fraction of factual entries carrying usable refs
  };
};
```

**Invariant:** factual Article entries without `supportRefs`, `evidenceIds`, or `sourceIds` fail validation.

## 10. DIVE Node

```ts
type DiveNode = {
  id: string;
  nodeType: 'event' | 'claim' | 'evidence' | 'source' | 'person' | 'organization' | 'place' |
            'technology' | 'historical_event' | 'concept' | 'economic_factor' | 'political_factor' |
            'article' | 'unknown';
  label: string;
  questionLabel?: string;
  description?: string;
  sourceIds: string[];
  evidenceIds: string[];
  backingRefs: Array<{ type: 'event_cluster' | 'observation' | 'claim' | 'article' | 'raw_item'; id: string }>;
};
```

## 11. DIVE Relation

```ts
type DiveRelationType =
  | 'supports'
  | 'contradicts'
  | 'claims'
  | 'confirms'
  | 'source_of'
  | 'context_for'
  | 'historically_similar_to'
  | 'affects'
  | 'caused_by'
  | 'part_of'
  | 'explains'
  | 'technical_dependency';

type DiveRelation = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relationType: DiveRelationType;
  semanticClass: 'evidentiary' | 'attribution' | 'contextual' | 'causal' | 'structural' | 'explanatory';
  label?: string;
  sourceIds: string[];
  evidenceIds: string[];
  processingConfidence?: ProcessingConfidence;
};
```

**Invariant:** `historically_similar_to` must use `semanticClass: 'contextual'`; it cannot be converted into `supports` or change Claim Verification.

## 12. LIVE cursor

```ts
type LiveCursor = {
  userOrDeviceId: string;
  lastVisitedAt: string;
  lastObservedSignalId?: string;
};
```

`new since last visit` is derived from `Signal.observedAt > LiveCursor.lastVisitedAt`; it is not an AI relevance score.

## Validation invariants

A v0.1 implementation must reject or quarantine records when:

1. an AI confidence field is used as truth probability;
2. a Claim has no claimant/source/raw provenance;
3. Evidence has no Source, RawItem, or original URL;
4. a factual Article entry has no support/evidence/source lineage;
5. `historically_similar_to` is evidentiary;
6. an EventCluster merge deletes member provenance/history;
7. a changed source item overwrites a previous RawItem revision;
8. AI structured output bypasses server validation;
9. browser code contains provider/source credentials.

## NOT TESTED

This is a schema contract, not a production migration. Database constraints, live ingestion, provider responses, rate-limit behavior, and CARDS/LIVE/DIVE production projections remain NOT TESTED.
