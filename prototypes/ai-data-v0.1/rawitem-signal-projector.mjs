// Isolated AI/Data v0.1 deterministic RawItem -> Signal projector.
// No AI/provider call, no truth/verification decision, no production integration.

function required(value, name) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`RawItem missing required field: ${name}`);
  }
  return value;
}

function compactText(value) {
  if (typeof value !== 'string') return undefined;
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact || undefined;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

const TOPIC_RULES = Object.freeze([
  { topic: 'weather', pattern: /気象|天気|大雨|大雪|暴風|強風|雷|洪水|波浪|高潮|竜巻|台風|降水|降雪/ },
  { topic: 'warning', pattern: /特別警報|警報|注意報|警戒情報|早期注意情報/ },
  { topic: 'earthquake', pattern: /地震|震度|長周期地震動/ },
  { topic: 'tsunami', pattern: /津波/ },
  { topic: 'volcano', pattern: /火山|噴火/ },
  { topic: 'disaster', pattern: /災害|避難|防災/ }
]);

const ALERT_PATTERN = /特別警報|警報|注意報|警戒情報|津波警報|津波注意報|噴火警報|竜巻注意情報/;
const MEASUREMENT_PATTERN = /震度速報|観測|実況|測定/;

export function classifyDeterministicSignalType(rawItem, { source } = {}) {
  const haystack = `${compactText(rawItem.originalTitle) || ''} ${compactText(rawItem.originalText) || ''}`;

  if (source?.sourceType === 'youtube') return 'video';
  if (['x', 'telegram', 'reddit'].includes(source?.sourceType)) return 'post';
  if (rawItem.media?.some((item) => item?.type === 'video')) return 'video';

  // JMA classifications are deliberately mechanical. They describe the kind of
  // source message, not whether any proposition inside the message is true.
  if (rawItem.sourceId === 'jma-disaster-prevention-xml') {
    if (ALERT_PATTERN.test(haystack)) return 'alert';
    if (MEASUREMENT_PATTERN.test(haystack)) return 'measurement';
    return 'report';
  }

  if (source?.role === 'official_actor') return 'report';
  if (rawItem.media?.some((item) => item?.type === 'document')) return 'document';
  return 'report';
}

export function classifyDeterministicTopics(rawItem) {
  const haystack = `${compactText(rawItem.originalTitle) || ''} ${compactText(rawItem.originalText) || ''}`;
  return TOPIC_RULES.filter((rule) => rule.pattern.test(haystack)).map((rule) => rule.topic);
}

export function projectRawItemToSignal(rawItem, { source, signalId } = {}) {
  required(rawItem, 'rawItem');
  const rawItemId = required(rawItem.id, 'id');
  const sourceId = required(rawItem.sourceId, 'sourceId');
  const canonicalUrl = required(rawItem.canonicalUrl, 'canonicalUrl');
  const observedAt = required(rawItem.observedAt, 'observedAt');

  if (source?.id && source.id !== sourceId) {
    throw new Error(`Source mismatch: RawItem=${sourceId} Source=${source.id}`);
  }

  const relationships = [];
  if (rawItem.revisionOfRawItemId) {
    relationships.push({
      type: 'revision_of',
      targetSignalId: `signal:${rawItem.revisionOfRawItemId}`
    });
  }

  const signal = {
    id: signalId || `signal:${rawItemId}`,
    rawItemId,
    sourceId,
    canonicalUrl,
    signalType: classifyDeterministicSignalType(rawItem, { source }),
    publishedAt: rawItem.publishedAt,
    observedAt,
    normalizedTitle: compactText(rawItem.originalTitle),
    normalizedExcerpt: compactText(rawItem.originalText),
    language: rawItem.language,
    topics: unique(classifyDeterministicTopics(rawItem)),
    entities: [],
    locations: [],
    groupingState: 'ungrouped',
    eventCandidateIds: [],
    processingConfidence: [],
    relationships: relationships.length ? relationships : undefined
  };

  // Explicitly do not create Claim, Verification, attribution, EventCandidate, or
  // same-event confidence here. Those are later stages with separate contracts.
  return signal;
}
