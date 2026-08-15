import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  GOVUK_SOURCE,
  GovUkContentAdapter,
  normalizeGovUkContent
} from '../prototypes/ai-data-v0.1/govuk-content-adapter.mjs';

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

// Processing confidence must describe a processing task, not truth.
for (const candidate of sample.eventCandidates) {
  assert.equal(candidate.sameEventConfidence.task, 'same_event_matching');
  assert.ok(candidate.sameEventConfidence.score >= 0 && candidate.sameEventConfidence.score <= 1);
  assert.equal('truthProbability' in candidate, false);
  assert.equal('truth_probability' in candidate, false);
}

// The central epistemic invariant: confirming that a statement exists does not
// confirm its embedded proposition.
const statementObservation = sample.observations.find((item) => item.id === 'obs-statement-issued');
const embeddedClaim = sample.claims.find((item) => item.id === 'claim-bridge-open');
assert.equal(statementObservation.verification.state, 'confirmed');
assert.ok(statementObservation.embeddedClaimIds.includes(embeddedClaim.id));
assert.notEqual(embeddedClaim.verification.state, 'confirmed');
assert.equal(embeddedClaim.verification.state, 'disputed');

// Claims retain attribution and raw/source lineage.
for (const claim of sample.claims) {
  assert.ok(claim.attribution?.claimant?.name);
  assert.ok(claim.attribution?.sourceId);
  assert.ok(claim.attribution?.rawItemIds?.length > 0);
  assert.ok(claim.evidenceIds?.length > 0);
}

// Evidence always has a reachable source, RawItem, and original URL.
const sourceIds = new Set(sample.sources.map((source) => source.id));
const rawItemIds = new Set(sample.rawItems.map((item) => item.id));
for (const evidence of sample.evidence) {
  assert.ok(sourceIds.has(evidence.sourceId));
  assert.ok(rawItemIds.has(evidence.rawItemId));
  assert.match(evidence.originalUrl, /^https?:\/\//);
}

// Factual Article entries cannot lose provenance during generation.
for (const entry of allArticleEntries(sample.article)) {
  assert.ok(entry.supportRefs?.length > 0, `${entry.id}: missing supportRefs`);
  assert.ok(entry.evidenceIds?.length > 0, `${entry.id}: missing evidenceIds`);
  assert.ok(entry.sourceIds?.length > 0, `${entry.id}: missing sourceIds`);
}
assert.equal(sample.article.generation.provenanceCoverage, 1);

// Historical similarity is contextual only, never evidentiary support.
const historicalRelations = sample.diveRelations.filter(
  (relation) => relation.relationType === 'historically_similar_to'
);
assert.ok(historicalRelations.length > 0);
for (const relation of historicalRelations) {
  assert.equal(relation.semanticClass, 'contextual');
  assert.notEqual(relation.relationType, 'supports');
}

// LIVE newness is cursor/timestamp based.
const cursorTime = new Date(sample.liveCursor.lastVisitedAt).valueOf();
const expectedNewSignalIds = sample.signals
  .filter((signal) => new Date(signal.observedAt).valueOf() > cursorTime)
  .map((signal) => signal.id)
  .sort();
assert.deepEqual(
  [...sample.derivedLiveState.newSinceLastVisitSignalIds].sort(),
  expectedNewSignalIds
);

// Isolated GOV.UK normalizer emits the common RawItemInput shape and does not
// retain the fixture's full body by default.
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

// The official quick-start endpoint currently returns a redirect record with
// title/description null. That is valid source data and must not be discarded.
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

// SourceAdapter cursor behavior: first observation emits; unchanged revision
// on the next cursor does not. No network is used by this test.
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

console.log('AI/Data v0.1 contract fixture: PASS');
