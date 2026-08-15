// KAWASEMI AI / Data common interfaces v0.1
// Contract only. No provider credentials or production integration belong here.

export type Id = string;
export type ISODateTime = string;

export type ProcessingTask =
  | 'extraction'
  | 'language_detection'
  | 'entity_linking'
  | 'topic_classification'
  | 'duplicate_matching'
  | 'same_event_matching'
  | 'relation_detection'
  | 'change_detection';

export interface ProcessingConfidence {
  task: ProcessingTask;
  score: number; // 0..1: processing confidence ONLY, never truth probability.
  method: 'deterministic' | 'heuristic' | 'model';
  modelRunId?: Id;
  explanation?: string;
}

export type VerificationState =
  | 'not_assessed'
  | 'unverified'
  | 'supported'
  | 'confirmed'
  | 'contradicted'
  | 'disputed'
  | 'insufficient_evidence';

export interface Verification {
  state: VerificationState;
  decidedBy: 'deterministic_policy' | 'human' | 'external_authority' | 'not_assessed';
  evidenceIds: Id[];
  contradictionEvidenceIds: Id[];
  policyVersion?: string;
  checkedAt?: ISODateTime;
  modelSuggestion?: {
    state: VerificationState;
    modelRunId: Id;
    rationale?: string;
  };
}

export interface EntityRef {
  id: Id;
  type: 'person' | 'organization' | 'place' | 'country' | 'facility' | 'technology' | 'concept' | 'other';
  name: string;
  aliases?: string[];
  canonicalUrl?: string;
}

export interface LocationRef {
  name: string;
  countryCode?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  precision?: 'exact' | 'approximate' | 'region' | 'country' | 'unknown';
}

export interface Attribution {
  claimant: { entityId?: Id; name: string; role?: string };
  sourceId: Id;
  rawItemIds: Id[];
  assertedAt?: ISODateTime;
  attributionText?: string;
}

export interface Source {
  id: Id;
  name: string;
  sourceType: 'rss' | 'atom' | 'official_web' | 'government_api' | 'telegram' | 'x' | 'youtube' | 'reddit' | 'news_media' | 'wire' | 'osint' | 'other';
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
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface RawItem {
  id: Id;
  sourceId: Id;
  externalId?: string;
  canonicalUrl: string;
  publishedAt?: ISODateTime;
  modifiedAt?: ISODateTime;
  observedAt: ISODateTime;
  author?: { name: string; entityId?: Id };
  organization?: { name: string; entityId?: Id };
  originalTitle?: string;
  originalText?: string;
  originalTextStorage: 'full' | 'excerpt_only' | 'metadata_only';
  language?: string;
  media?: Array<{ type: 'image' | 'video' | 'audio' | 'document'; url: string; caption?: string }>;
  contentHash?: string;
  retrieval: {
    fetchedAt: ISODateTime;
    httpStatus?: number;
    etag?: string;
    lastModified?: string;
    adapterVersion: string;
  };
  revisionOfRawItemId?: Id;
  relationships?: Array<{ type: 'supersedes' | 'updates' | 'corrects' | 'quotes' | 'reposts'; rawItemId: Id }>;
}

export type RawItemInput = Omit<RawItem, 'id' | 'retrieval'> & {
  retrieval?: Partial<RawItem['retrieval']>;
};

export interface Signal {
  id: Id;
  rawItemId: Id;
  sourceId: Id;
  canonicalUrl: string;
  signalType: 'report' | 'official_statement' | 'alert' | 'measurement' | 'post' | 'video' | 'document' | 'other';
  publishedAt?: ISODateTime;
  observedAt: ISODateTime;
  normalizedTitle?: string;
  normalizedExcerpt?: string;
  language?: string;
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  groupingState: 'ungrouped' | 'candidate' | 'grouped';
  eventCandidateIds: Id[];
  eventClusterId?: Id;
  processingConfidence: ProcessingConfidence[];
  relationships?: Array<{ type: 'revision_of' | 'duplicate_of' | 'near_duplicate_of'; targetSignalId: Id }>;
}

export interface EventCandidate {
  id: Id;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  signalIds: Id[];
  rawItemIds: Id[];
  timeWindow?: { start?: ISODateTime; end?: ISODateTime };
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  candidateClusterIds: Id[];
  sameEventConfidence: ProcessingConfidence;
  reasons: string[];
  status: 'open' | 'grouped' | 'rejected' | 'needs_review';
}

export interface EventCluster {
  id: Id;
  label?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  timeWindow?: { start?: ISODateTime; end?: ISODateTime };
  signalIds: Id[];
  rawItemIds: Id[];
  eventCandidateIds: Id[];
  observationIds: Id[];
  claimIds: Id[];
  articleIds: Id[];
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  history: Array<{
    at: ISODateTime;
    type: 'created' | 'member_added' | 'member_removed' | 'merged' | 'split' | 'label_changed';
    relatedClusterIds?: Id[];
    reason?: string;
  }>;
}

export interface Observation {
  id: Id;
  eventClusterId?: Id;
  type: 'statement_issued' | 'document_published' | 'measurement_reported' | 'source_update' | 'media_published' | 'event_observed' | 'other';
  text: string;
  observedAt?: ISODateTime;
  occurredAt?: ISODateTime;
  sourceIds: Id[];
  rawItemIds: Id[];
  evidenceIds: Id[];
  embeddedClaimIds: Id[];
  verification: Verification;
}

export interface Claim {
  id: Id;
  eventClusterId?: Id;
  proposition: string;
  language?: string;
  attribution: Attribution;
  assertedAt?: ISODateTime;
  topics: string[];
  entities: EntityRef[];
  locations: LocationRef[];
  evidenceIds: Id[];
  verification: Verification;
  extractionConfidence?: ProcessingConfidence;
  relationships?: Array<{ type: 'contradicts' | 'qualifies' | 'updates' | 'repeats'; claimId: Id }>;
}

export interface Evidence {
  id: Id;
  target: { type: 'observation' | 'claim' | 'article_entry' | 'dive_relation'; id: Id };
  relation: 'establishes_observation' | 'establishes_attribution' | 'supports' | 'contradicts' | 'context_only';
  sourceId: Id;
  rawItemId: Id;
  originalUrl: string;
  publishedAt?: ISODateTime;
  observedAt: ISODateTime;
  excerpt?: string;
  locator?: { type: 'paragraph' | 'timestamp' | 'page' | 'section' | 'other'; value: string };
  originType: 'first_party' | 'independent_report' | 'syndicated' | 'aggregator' | 'archive' | 'unknown';
  independenceGroup?: string;
  notes?: string;
}

export type DiveRelationType =
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

export interface ArticleEntry {
  id: Id;
  text: string;
  supportRefs: Array<{ type: 'observation' | 'claim' | 'event_cluster' | 'dive_node'; id: Id }>;
  evidenceIds: Id[];
  sourceIds: Id[];
}

export interface Article {
  id: Id;
  eventClusterId: Id;
  title: string;
  conciseSummary: string;
  language: string;
  publishedAt?: ISODateTime;
  generatedAt: ISODateTime;
  what: ArticleEntry[];
  certainty: { confirmed: ArticleEntry[]; claims: ArticleEntry[]; unknowns: ArticleEntry[] };
  context: Array<ArticleEntry & { relationType?: DiveRelationType }>;
  explore: Array<{ label: string; question?: string; diveNodeId: Id; relationType?: DiveRelationType }>;
  keyNumbers?: ArticleEntry[];
  topicTags: string[];
  sourceIds: Id[];
  rawItemIds: Id[];
  claimIds: Id[];
  observationIds: Id[];
  generation: {
    status: 'draft' | 'validated' | 'rejected';
    providerRunIds: Id[];
    promptVersion?: string;
    schemaVersion: '0.1';
    provenanceCoverage: number;
  };
}

export interface DiveNode {
  id: Id;
  nodeType: 'event' | 'claim' | 'evidence' | 'source' | 'person' | 'organization' | 'place' | 'technology' | 'historical_event' | 'concept' | 'economic_factor' | 'political_factor' | 'article' | 'unknown';
  label: string;
  questionLabel?: string;
  description?: string;
  sourceIds: Id[];
  evidenceIds: Id[];
  backingRefs: Array<{ type: 'event_cluster' | 'observation' | 'claim' | 'article' | 'raw_item'; id: Id }>;
}

export interface DiveRelation {
  id: Id;
  fromNodeId: Id;
  toNodeId: Id;
  relationType: DiveRelationType;
  semanticClass: 'evidentiary' | 'attribution' | 'contextual' | 'causal' | 'structural' | 'explanatory';
  label?: string;
  sourceIds: Id[];
  evidenceIds: Id[];
  processingConfidence?: ProcessingConfidence;
}

export interface LiveCursor {
  userOrDeviceId: Id;
  lastVisitedAt: ISODateTime;
  lastObservedSignalId?: Id;
}

// ---- Ingestion boundary ----------------------------------------------------

export interface SourceFetchResult {
  items: RawItemInput[];
  nextCursor?: string;
  observedAt: ISODateTime;
}

export interface SourceAdapter {
  readonly sourceId: Id;
  fetch(cursor?: string): Promise<SourceFetchResult>;
}

export interface NormalizedIngestionResult {
  rawItems: RawItem[];
  signals: Signal[];
  exactDuplicateRawItemIds: Id[];
  warnings: string[];
}

// ---- AI provider boundary -------------------------------------------------

export type AITask =
  | 'extract_signal'
  | 'extract_entities'
  | 'classify_topics'
  | 'duplicate_assist'
  | 'same_event_assist'
  | 'extract_claims'
  | 'compare_claims'
  | 'construct_context'
  | 'compose_article'
  | 'expand_dive';

export interface AIRequestMeta {
  task: AITask;
  runId: Id;
  schemaVersion: '0.1';
  promptVersion: string;
  preferredTier: 'mechanical' | 'reasoning';
}

export interface AIUsage {
  provider: string;
  model: string;
  inputTokens?: number;
  cachedInputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
  durationMs?: number;
}

export interface AIResult<T> {
  data: T;
  usage: AIUsage;
  warnings: string[];
  validated: boolean;
}

export interface ExtractClaimsInput {
  rawItem: RawItem;
  signal: Signal;
}

export interface CompareClaimsInput {
  claims: Claim[];
  evidence: Evidence[];
}

export interface ComposeArticleInput {
  cluster: EventCluster;
  observations: Observation[];
  claims: Claim[];
  evidence: Evidence[];
  sources: Source[];
}

export interface ExpandDiveInput {
  currentNode: DiveNode;
  cluster?: EventCluster;
  claims: Claim[];
  evidence: Evidence[];
  maxDirections: number; // FOCUS MAP target: normally 5–7.
}

export interface AIProvider {
  extractSignal(input: RawItem, meta: AIRequestMeta): Promise<AIResult<Partial<Signal>>>;
  extractEntities(input: { text: string; language?: string }, meta: AIRequestMeta): Promise<AIResult<EntityRef[]>>;
  classifyTopics(input: { text: string; language?: string }, meta: AIRequestMeta): Promise<AIResult<string[]>>;
  duplicateAssist(input: { signal: Signal; candidates: Signal[] }, meta: AIRequestMeta): Promise<AIResult<Array<{ signalId: Id; confidence: ProcessingConfidence }>>>;
  sameEventAssist(input: { signal: Signal; clusters: EventCluster[] }, meta: AIRequestMeta): Promise<AIResult<EventCandidate[]>>;
  extractClaims(input: ExtractClaimsInput, meta: AIRequestMeta): Promise<AIResult<{ observations: Observation[]; claims: Claim[] }>>;
  compareClaims(input: CompareClaimsInput, meta: AIRequestMeta): Promise<AIResult<{ suggestions: Array<{ claimId: Id; state: VerificationState; rationale?: string }> }>>;
  constructContext(input: ComposeArticleInput, meta: AIRequestMeta): Promise<AIResult<ArticleEntry[]>>;
  composeArticle(input: ComposeArticleInput, meta: AIRequestMeta): Promise<AIResult<Article>>;
  expandDive(input: ExpandDiveInput, meta: AIRequestMeta): Promise<AIResult<{ nodes: DiveNode[]; relations: DiveRelation[] }>>;
}

// Server-side router chooses providers/models by product task. Domain code never
// imports a vendor SDK. Browser/UI code calls KAWASEMI server endpoints only.
export interface AITaskRouter {
  providerFor(task: AITask, tier: 'mechanical' | 'reasoning'): AIProvider;
}

// ---- Audit / observability ------------------------------------------------

export interface PipelineRunRecord {
  runId: Id;
  stage: string;
  startedAt: ISODateTime;
  finishedAt?: ISODateTime;
  sourceId?: Id;
  recordIds: Id[];
  status: 'running' | 'success' | 'failed' | 'quarantined';
  retries: number;
  errorCode?: string;
  provider?: string;
  model?: string;
  task?: AITask;
  promptVersion?: string;
  schemaVersion: '0.1';
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
}
