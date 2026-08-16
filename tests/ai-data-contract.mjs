import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  GOVUK_SOURCE,
  GovUkContentAdapter,
  normalizeGovUkContent
} from '../prototypes/ai-data-v0.1/govuk-content-adapter.mjs';
import { validateDiveRelationSemantics } from '../prototypes/ai-data-v0.1/contract-validation.mjs';
import {
  JMA_SOURCE,
  JMA_FEEDS,
  JmaXmlAdapter,
  normalizeJmaReport,
  parseJmaAtomFeed,
  parseJmaReport
} from '../prototypes/ai-data-v0.1/jma-xml-adapter.mjs';
import { projectRawItemToSignal } from '../prototypes/ai-data-v0.1/rawitem-signal-projector.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const sample = JSON.parse(
  await readFile(resolve(root, 'docs/ai-data/sample-v0.1.json'), 'utf8')
);
const govukFixture = JSON.parse(
  await readFile(resolve(root, 'prototypes/ai-data-v0.1/fixtures/govuk-content.json'), 'utf8')
);
const govukRedirectFixture = JSON.parse(
  await readFile(resolve(root, 'prototypes/ai-data-v0.1/fixtures/govuk-redirect.json'), 'utf8')
);
const jmaFeedFixture = await readFile(
  resolve(root, 'prototypes/ai-data-v0.1/fixtures/jma-extra-feed.xml'),
  'utf8'
);
const jmaWarningFixture = await readFile(
  resolve(root, 'prototypes/ai-data-v0.1/fixtures/jma-warning.xml'),
  'utf8'
);

function allArticleEntries(article) {
  return [
    ...article.what,
    ...article.certainty.confirmed,
    ...article.certainty.claims,
    ...article.certainty.unknowns,
    ...article.context,
    ...(article.keyNumbers || [])
  ];
}

assert.equal(sample.schemaVersion, '0.1');
assert.ok(sample.sources.length >= 2);
assert.ok(sample.rawItems.length >= 2);
assert.ok(sample.signals.length >= 2);
assert.ok(sample.eventCandidates.length >= 1);
assert.ok(sample.eventClusters.length >= 1);
assert.ok(sample.observations.length >= 1);
assert.ok(sample.claims.length >= 1);
assert.ok(sample.evidence.length >= 1);

for (const candidate of sample.eventCandidates) {
  assert.equal(candidate.sameEventConfidence.task, 'same_event_matching');
  assert.ok(candidate.sameEventConfidence.score >= 0 && candidate.sameEventConfidence.score <= 1);
  assert.equal('truthProbability' in candidate, false);
  assert.equal('truth_probability' in candidate, false);
}

const statementObservation = sample.observations.find((item) => item.id === 'obs-statement-issued');
const embeddedClaim = sample.claims.find((item) => item.id === 'claim-bridge-open');
assert.equal(statementObservation.verification.state, 'confirmed');
assert.ok(statementObservation.embeddedClaimIds.includes(embeddedClaim.id));
assert.notEqual(embeddedClaim.verification.state, 'confirmed');
assert.equal(embeddedClaim.verification.state, 'disputed');

for (const claim of sample.claims) {
  assert.ok(claim.attribution?.claimant?.name);
  assert.ok(claim.attribution?.sourceId);
  assert.ok(claim.attribution?.rawItemIds?.length > 0);
  assert.ok(claim.evidenceIds?.length > 0);
}

const sourceIds = new Set(sample.sources.map((source) => source.id));
const rawItemIds = new Set(sample.rawItems.map((item) => item.id));
for (const evidence of sample.evidence) {
  assert.ok(sourceIds.has(evidence.sourceId));
  assert.ok(rawItemIds.has(evidence.rawItemId));
  assert.match(evidence.originalUrl, /^https?:\/\//);
}

for (const entry of allArticleEntries(sample.article)) {
  assert.ok(entry.supportRefs?.length > 0, `${entry.id}: missing supportRefs`);
  assert.ok(entry.evidenceIds?.length > 0, `${entry.id}: missing evidenceIds`);
  assert.ok(entry.sourceIds?.length > 0, `${entry.id}: missing sourceIds`);
}
assert.equal(sample.article.generation.provenanceCoverage, 1);

const historicalRelations = sample.diveRelations.filter(
  (relation) => relation.relationType === 'historically_similar_to'
);
assert.ok(historicalRelations.length > 0);
for (const relation of historicalRelations) {
  assert.equal(relation.semanticClass, 'contextual');
  assert.notEqual(relation.relationType, 'supports');
  assert.equal(
    validateDiveRelationSemantics(relation, {
      diveNodes: sample.diveNodes,
      claims: sample.claims
    }),
    true
  );
}

const confirmsRelation = {
  id: 'rel-synthetic-confirms',
  fromNodeId: 'dive-current-event',
  toNodeId: 'dive-claim-open',
  relationType: 'confirms',
  semanticClass: 'evidentiary',
  sourceIds: ['src-transport-authority'],
  evidenceIds: ['ev-claim-attribution']
};
assert.throws(
  () => validateDiveRelationSemantics(confirmsRelation, {
    diveNodes: sample.diveNodes,
    claims: sample.claims
  }),
  /already-confirmed underlying Claim/
);

const independentlyConfirmedClaim = {
  ...embeddedClaim,
  verification: {
    ...embeddedClaim.verification,
    state: 'confirmed',
    decidedBy: 'deterministic_policy'
  }
};
assert.equal(
  validateDiveRelationSemantics(confirmsRelation, {
    diveNodes: sample.diveNodes,
    claims: [independentlyConfirmedClaim]
  }),
  true
);

const cursorTime = new Date(sample.liveCursor.lastVisitedAt).valueOf();
const expectedNewSignalIds = sample.signals
  .filter((signal) => new Date(signal.observedAt).valueOf() > cursorTime)
  .map((signal) => signal.id)
  .sort();
assert.deepEqual(
  [...sample.derivedLiveState.newSinceLastVisitSignalIds].sort(),
  expectedNewSignalIds
);

const normalized = normalizeGovUkContent(govukFixture, {
  observedAt: '2026-08-16T08:06:00Z'
});
assert.equal(normalized.sourceId, GOVUK_SOURCE.id);
assert.equal(normalized.externalId, 'synthetic-govuk-content-id');
assert.equal(normalized.canonicalUrl, 'https://www.gov.uk/government/news/example-status-update');
assert.equal(normalized.originalTitle, 'Example status update');
assert.equal(normalized.originalTextStorage, 'excerpt_only');
assert.equal(normalized.originalText, govukFixture.description);
assert.equal(normalized.originalText?.includes('synthetic body'), false);
assert.equal(normalized.organization.name, 'Example Government Organisation');

const normalizedRedirect = normalizeGovUkContent(govukRedirectFixture, {
  observedAt: '2026-08-16T09:00:00Z'
});
assert.equal(normalizedRedirect.sourceId, GOVUK_SOURCE.id);
assert.equal(normalizedRedirect.externalId, 'ddbe46fa-9ca1-44ea-a03c-b2832e357b7c');
assert.equal(normalizedRedirect.canonicalUrl, 'https://www.gov.uk/take-pet-abroad');
assert.equal(normalizedRedirect.originalTitle, undefined);
assert.equal(normalizedRedirect.originalText, undefined);
assert.equal(normalizedRedirect.originalTextStorage, 'metadata_only');
assert.equal(normalizedRedirect.publishedAt, '2020-08-10T15:30:03.000Z');
assert.equal(normalizedRedirect.modifiedAt, '2020-08-10T15:30:03.000Z');

const fakeFetch = async () => ({
  ok: true,
  status: 200,
  async json() {
    return govukFixture;
  }
});
const adapter = new GovUkContentAdapter({
  monitoredPaths: [govukFixture.base_path],
  fetchImpl: fakeFetch
});
const first = await adapter.fetch();
assert.equal(first.items.length, 1);
assert.ok(first.nextCursor);
const second = await adapter.fetch(first.nextCursor);
assert.equal(second.items.length, 0);

const redirectFetch = async () => ({
  ok: true,
  status: 200,
  async json() {
    return govukRedirectFixture;
  }
});
const redirectAdapter = new GovUkContentAdapter({
  monitoredPaths: [govukRedirectFixture.base_path],
  fetchImpl: redirectFetch
});
const redirectFirst = await redirectAdapter.fetch();
assert.equal(redirectFirst.items.length, 1);
assert.equal(redirectFirst.items[0].originalTextStorage, 'metadata_only');
const redirectSecond = await redirectAdapter.fetch(redirectFirst.nextCursor);
assert.equal(redirectSecond.items.length, 0);

const parsedJmaFeed = parseJmaAtomFeed(jmaFeedFixture);
assert.equal(parsedJmaFeed.entries.length, 1);
assert.equal(parsedJmaFeed.entries[0].id, 'urn:uuid:kawasemi-jma-warning-fixture-001');
assert.equal(parsedJmaFeed.entries[0].updatedAt, '2026-08-15T14:58:00.000Z');
assert.equal(
  parsedJmaFeed.entries[0].link,
  'https://www.data.jma.go.jp/developer/xml/data/kawasemi-jma-warning-fixture-001.xml'
);

const parsedJmaReport = parseJmaReport(jmaWarningFixture);
assert.equal(parsedJmaReport.control.publishingOffice, 'テスト地方気象台');
assert.equal(parsedJmaReport.head.infoType, '発表');
assert.equal(parsedJmaReport.head.eventId, 'KAWASEMI-JMA-FIXTURE-001');
assert.match(parsedJmaReport.head.headlineText, /架空電文/);

const normalizedJma = normalizeJmaReport(parsedJmaFeed.entries[0], jmaWarningFixture, {
  observedAt: '2026-08-16T00:00:00Z'
});
assert.equal(normalizedJma.sourceId, JMA_SOURCE.id);
assert.equal(normalizedJma.originalTextStorage, 'excerpt_only');
assert.equal(normalizedJma.organization.name, 'テスト地方気象台');
assert.equal(normalizedJma.publishedAt, '2026-08-15T14:58:00.000Z');
assert.equal(normalizedJma.retrieval.adapterVersion, 'jma-xml-v0.1');

const persistedJmaRawItem = {
  ...normalizedJma,
  id: 'raw:jma-fixture-001',
  retrieval: {
    ...normalizedJma.retrieval,
    httpStatus: 200
  }
};
const projectedJmaSignal = projectRawItemToSignal(persistedJmaRawItem, { source: JMA_SOURCE });
assert.equal(projectedJmaSignal.id, 'signal:raw:jma-fixture-001');
assert.equal(projectedJmaSignal.signalType, 'alert');
assert.equal(projectedJmaSignal.groupingState, 'ungrouped');
assert.deepEqual(projectedJmaSignal.eventCandidateIds, []);
assert.deepEqual(projectedJmaSignal.processingConfidence, []);
assert.ok(projectedJmaSignal.topics.includes('weather'));
assert.ok(projectedJmaSignal.topics.includes('warning'));
for (const forbiddenField of ['verification', 'attribution', 'sameEventConfidence', 'truthProbability', 'truth_probability']) {
  assert.equal(forbiddenField in projectedJmaSignal, false, `Signal must not contain ${forbiddenField}`);
}

const officialStatementRawItem = {
  id: 'raw:official-statement-fixture',
  sourceId: 'fixture-official-source',
  canonicalUrl: 'https://example.invalid/fixture',
  observedAt: '2026-08-16T00:00:00Z',
  originalTitle: 'Agency statement',
  originalText: 'Agency says X happened.',
  originalTextStorage: 'excerpt_only',
  language: 'en',
  media: [],
  retrieval: { fetchedAt: '2026-08-16T00:00:00Z', adapterVersion: 'fixture' }
};
const officialSource = {
  id: 'fixture-official-source',
  sourceType: 'government_api',
  role: 'official_actor'
};
const officialSignal = projectRawItemToSignal(officialStatementRawItem, { source: officialSource });
assert.equal(officialSignal.signalType, 'report');
assert.equal('verification' in officialSignal, false);
assert.equal('attribution' in officialSignal, false);

const revisionSignal = projectRawItemToSignal(
  { ...persistedJmaRawItem, id: 'raw:jma-fixture-002', revisionOfRawItemId: 'raw:jma-fixture-001' },
  { source: JMA_SOURCE }
);
assert.deepEqual(revisionSignal.relationships, [
  { type: 'revision_of', targetSignalId: 'signal:raw:jma-fixture-001' }
]);

let jmaBulletinFetches = 0;
const jmaFakeFetch = async (url) => {
  if (url === JMA_FEEDS.highFrequency.extra) {
    return {
      ok: true,
      status: 200,
      headers: { get() { return null; } },
      async text() { return jmaFeedFixture; }
    };
  }
  if (url === parsedJmaFeed.entries[0].link) {
    jmaBulletinFetches += 1;
    return {
      ok: true,
      status: 200,
      headers: { get() { return null; } },
      async text() { return jmaWarningFixture; }
    };
  }
  throw new Error(`Unexpected fixture URL: ${url}`);
};
const jmaAdapter = new JmaXmlAdapter({
  feedUrls: [JMA_FEEDS.highFrequency.extra],
  fetchImpl: jmaFakeFetch
});
const jmaFirst = await jmaAdapter.fetch();
assert.equal(jmaFirst.items.length, 1);
assert.equal(jmaBulletinFetches, 1);
const jmaSecond = await jmaAdapter.fetch(jmaFirst.nextCursor);
assert.equal(jmaSecond.items.length, 0);
assert.equal(jmaBulletinFetches, 1);

assert.throws(
  () => parseJmaAtomFeed(jmaFeedFixture.replace(
    'https://www.data.jma.go.jp/developer/xml/data/kawasemi-jma-warning-fixture-001.xml',
    'https://example.invalid/evil.xml'
  )),
  /outside the official XML data path/
);

console.log('AI/Data v0.1 contract fixture: PASS');
