// Isolated AI/Data v0.1 prototype.
// No production CARDS/LIVE/DIVE import. No credentials required.
// A one-request live source smoke is documented in docs/status/AI_DATA.md;
// fixture tests remain network-independent and deterministic.

const DEFAULT_BASE_URL = 'https://www.gov.uk/api/content';

export const GOVUK_SOURCE = Object.freeze({
  id: 'govuk-content-api',
  name: 'GOV.UK Content API',
  sourceType: 'government_api',
  role: 'official_actor',
  homepageUrl: 'https://www.gov.uk/',
  feedOrApiUrl: DEFAULT_BASE_URL,
  organization: 'UK Government',
  languages: ['en'],
  jurisdictions: ['GB'],
  authorityScopes: ['content published on GOV.UK by the represented government organisation'],
  ingestion: {
    method: 'http_json',
    auth: 'none',
    rateLimit: '10 requests/second/client per current official documentation',
    cursorStrategy: 'per-monitored-path public_updated_at'
  },
  rights: {
    termsStatus: 'approved',
    termsUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    storeOriginalText: 'metadata_only',
    notes: 'Prototype stores title/description metadata, not full rendered body. Re-check exceptions/third-party rights before production retention.'
  }
});

function required(value, name) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`GOV.UK payload missing required field: ${name}`);
  }
  return value;
}

function optionalText(value) {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asIso(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid GOV.UK timestamp: ${value}`);
  return parsed.toISOString();
}

function normalizePath(path) {
  if (!path) throw new Error('GOV.UK content path is required');
  return path.startsWith('/') ? path : `/${path}`;
}

function sourceOrganisation(payload) {
  const org = payload?.links?.organisations?.[0];
  return org?.title ? { name: org.title } : { name: 'UK Government' };
}

export function normalizeGovUkContent(payload, { observedAt = new Date().toISOString() } = {}) {
  const basePath = normalizePath(required(payload.base_path, 'base_path'));
  const canonicalUrl = `https://www.gov.uk${basePath}`;
  const title = optionalText(payload.title);
  const description = optionalText(payload.description);
  const updatedAt = asIso(payload.public_updated_at || payload.updated_at);
  const publishedAt = asIso(payload.first_published_at || payload.public_updated_at || payload.updated_at);

  // GOV.UK Content API can legitimately return redirect records whose `title`
  // and `description` are null. RawItem permits an optional originalTitle, so
  // preserving the record is safer than throwing away a real source update.
  // Redirect destination metadata remains in the source payload and can be
  // modeled explicitly if/when the ingestion layer adds source-specific metadata.
  return {
    sourceId: GOVUK_SOURCE.id,
    externalId: payload.content_id || canonicalUrl,
    canonicalUrl,
    publishedAt,
    modifiedAt: updatedAt,
    observedAt: asIso(observedAt),
    organization: sourceOrganisation(payload),
    originalTitle: title,
    // Rights-safe prototype default: description only. A production rights policy
    // must explicitly authorize storing richer body text.
    originalText: description,
    originalTextStorage: description ? 'excerpt_only' : 'metadata_only',
    language: payload.locale || 'en',
    media: [],
    contentHash: undefined,
    relationships: []
  };
}

export class GovUkContentAdapter {
  constructor({ monitoredPaths, fetchImpl = globalThis.fetch, baseUrl = DEFAULT_BASE_URL } = {}) {
    if (!Array.isArray(monitoredPaths) || monitoredPaths.length === 0) {
      throw new Error('GovUkContentAdapter requires at least one monitored path');
    }
    if (typeof fetchImpl !== 'function') throw new Error('GovUkContentAdapter requires fetch');
    this.sourceId = GOVUK_SOURCE.id;
    this.monitoredPaths = monitoredPaths.map(normalizePath);
    this.fetchImpl = fetchImpl;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async fetch(cursor) {
    const cursorState = cursor ? JSON.parse(cursor) : {};
    const nextState = { ...cursorState };
    const items = [];
    const observedAt = new Date().toISOString();

    for (const path of this.monitoredPaths) {
      const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        headers: { accept: 'application/json' }
      });
      if (!response.ok) {
        const error = new Error(`GOV.UK fetch failed for ${path}: HTTP ${response.status}`);
        error.code = `HTTP_${response.status}`;
        throw error;
      }

      const payload = await response.json();
      const item = normalizeGovUkContent(payload, { observedAt });
      const sourceRevision = item.modifiedAt || item.publishedAt || item.externalId;

      // Cursor suppresses unchanged records but never overwrites old RawItems.
      // A changed public_updated_at is emitted as a new RawItem input so storage
      // can link it as a revision.
      if (cursorState[path] !== sourceRevision) items.push(item);
      nextState[path] = sourceRevision;
    }

    return {
      items,
      nextCursor: JSON.stringify(nextState),
      observedAt
    };
  }
}
