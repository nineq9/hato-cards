// Isolated AI/Data v0.1 JMA disaster-prevention XML PULL adapter.
// No credentials, no paid API, no production CARDS/LIVE/DIVE import.

const JMA_HOST = 'www.data.jma.go.jp';
const JMA_DATA_PREFIX = '/developer/xml/data/';
const CURSOR_SEEN_LIMIT = 4096;
const ADAPTER_VERSION = 'jma-xml-v0.1';

export const JMA_FEEDS = Object.freeze({
  highFrequency: Object.freeze({
    regular: 'https://www.data.jma.go.jp/developer/xml/feed/regular.xml',
    extra: 'https://www.data.jma.go.jp/developer/xml/feed/extra.xml',
    eqvol: 'https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml',
    other: 'https://www.data.jma.go.jp/developer/xml/feed/other.xml'
  }),
  longTerm: Object.freeze({
    regular: 'https://www.data.jma.go.jp/developer/xml/feed/regular_l.xml',
    extra: 'https://www.data.jma.go.jp/developer/xml/feed/extra_l.xml',
    eqvol: 'https://www.data.jma.go.jp/developer/xml/feed/eqvol_l.xml',
    other: 'https://www.data.jma.go.jp/developer/xml/feed/other_l.xml'
  })
});

export const JMA_SOURCE = Object.freeze({
  id: 'jma-disaster-prevention-xml',
  name: 'Japan Meteorological Agency Disaster Prevention XML',
  sourceType: 'government_api',
  role: 'official_actor',
  homepageUrl: 'https://xml.kishou.go.jp/',
  feedOrApiUrl: JMA_FEEDS.highFrequency.extra,
  organization: 'Japan Meteorological Agency',
  languages: ['ja'],
  jurisdictions: ['JP'],
  authorityScopes: [
    'whether the Japan Meteorological Agency issued or updated its own disaster-prevention bulletin'
  ],
  ingestion: {
    method: 'http_xml',
    auth: 'none',
    rateLimit: 'No request-per-second quota published; avoid re-downloading XML. JMA blocks an IP after 10GB/day of downloads to the public XML URLs.',
    cursorStrategy: 'Atom entry IDs + HTTP validators; bounded seen-entry set prevents repeated bulletin downloads'
  },
  rights: {
    termsStatus: 'approved',
    termsUrl: 'https://xml.kishou.go.jp/qanda.html',
    storeOriginalText: 'limited',
    notes: 'v0.1 stores common header/headline text plus the canonical JMA XML URL, not the full Body. Follow JMA usage notes and attribution rules.'
  }
});

function required(value, name) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`JMA payload missing required field: ${name}`);
  }
  return value;
}

function decodeXmlText(value) {
  if (typeof value !== 'string') return undefined;
  const withoutCdata = value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/u, '$1');
  const decoded = withoutCdata
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return decoded || undefined;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tagPattern(localName, flags = 'i') {
  const name = escapeRegExp(localName);
  return new RegExp(`<(?:(?:[\\w.-]+):)?${name}\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?${name}\\s*>`, flags);
}

function textOf(xml, localName) {
  const match = tagPattern(localName).exec(xml || '');
  return match ? decodeXmlText(match[1]) : undefined;
}

function blockOf(xml, localName) {
  const match = tagPattern(localName).exec(xml || '');
  return match ? match[1] : undefined;
}

function blocksOf(xml, localName) {
  const name = escapeRegExp(localName);
  const pattern = new RegExp(`<(?:(?:[\\w.-]+):)?${name}\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?${name}\\s*>`, 'gi');
  return [...(xml || '').matchAll(pattern)].map((match) => match[1]);
}

function linkHrefs(xml) {
  const pattern = /<(?:(?:[\w.-]+):)?link\b([^>]*)\/?\s*>/gi;
  const hrefs = [];
  for (const match of (xml || '').matchAll(pattern)) {
    const attrs = match[1] || '';
    const hrefMatch = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(attrs);
    if (!hrefMatch) continue;
    const typeMatch = /\btype\s*=\s*(["'])(.*?)\1/i.exec(attrs);
    hrefs.push({ href: decodeXmlText(hrefMatch[2]), type: typeMatch?.[2] });
  }
  return hrefs;
}

function asIso(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid JMA timestamp: ${value}`);
  return parsed.toISOString();
}

function normalizeJmaDataUrl(value) {
  const url = new URL(required(value, 'entry.link'));
  if (url.hostname !== JMA_HOST || !url.pathname.startsWith(JMA_DATA_PREFIX)) {
    throw new Error(`JMA entry link is outside the official XML data path: ${url.toString()}`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported JMA entry protocol: ${url.protocol}`);
  }
  url.protocol = 'https:';
  return url.toString();
}

function validateFeedUrl(value) {
  const url = new URL(value);
  if (url.hostname !== JMA_HOST || !url.pathname.startsWith('/developer/xml/feed/')) {
    throw new Error(`JMA feed URL is outside the official feed path: ${url.toString()}`);
  }
  url.protocol = 'https:';
  return url.toString();
}

export function parseJmaAtomFeed(xml) {
  const entries = blocksOf(xml, 'entry').map((entryXml) => {
    const links = linkHrefs(entryXml);
    const xmlLink = links.find((link) => link.type === 'application/xml') || links.find((link) => /\.xml(?:$|\?)/i.test(link.href || '')) || links[0];
    const authorBlock = blockOf(entryXml, 'author');
    return {
      id: required(textOf(entryXml, 'id'), 'Atom entry.id'),
      title: textOf(entryXml, 'title'),
      updatedAt: asIso(textOf(entryXml, 'updated')),
      author: textOf(authorBlock, 'name'),
      link: normalizeJmaDataUrl(required(xmlLink?.href, 'Atom entry.link'))
    };
  });

  return {
    id: textOf(xml, 'id'),
    title: textOf(xml, 'title'),
    updatedAt: asIso(textOf(xml, 'updated')),
    entries
  };
}

export function parseJmaReport(xml) {
  const control = required(blockOf(xml, 'Control'), 'Control');
  const head = required(blockOf(xml, 'Head'), 'Head');
  const headline = blockOf(head, 'Headline');

  return {
    control: {
      title: textOf(control, 'Title'),
      dateTime: asIso(textOf(control, 'DateTime')),
      status: textOf(control, 'Status'),
      editorialOffice: textOf(control, 'EditorialOffice'),
      publishingOffice: textOf(control, 'PublishingOffice')
    },
    head: {
      title: textOf(head, 'Title'),
      reportDateTime: asIso(textOf(head, 'ReportDateTime')),
      targetDateTime: asIso(textOf(head, 'TargetDateTime')),
      eventId: textOf(head, 'EventID'),
      infoType: textOf(head, 'InfoType'),
      serial: textOf(head, 'Serial'),
      infoKind: textOf(head, 'InfoKind'),
      infoKindVersion: textOf(head, 'InfoKindVersion'),
      headlineText: textOf(headline, 'Text')
    }
  };
}

export function normalizeJmaReport(entry, xml, { observedAt = new Date().toISOString() } = {}) {
  const parsed = parseJmaReport(xml);
  const canonicalUrl = normalizeJmaDataUrl(entry.link);
  const title = parsed.head.title || parsed.control.title || entry.title;
  const headline = parsed.head.headlineText;
  const publishedAt = parsed.head.reportDateTime || parsed.control.dateTime || entry.updatedAt;
  const modifiedAt = parsed.control.dateTime || entry.updatedAt || publishedAt;
  const organizationName = parsed.control.publishingOffice || parsed.control.editorialOffice || entry.author || 'Japan Meteorological Agency';

  return {
    sourceId: JMA_SOURCE.id,
    externalId: required(entry.id, 'entry.id'),
    canonicalUrl,
    publishedAt,
    modifiedAt,
    observedAt: asIso(observedAt),
    organization: { name: organizationName },
    originalTitle: title,
    originalText: headline,
    originalTextStorage: headline ? 'excerpt_only' : 'metadata_only',
    language: 'ja',
    media: [{ type: 'document', url: canonicalUrl, caption: parsed.head.infoKind || title }],
    contentHash: undefined,
    relationships: [],
    retrieval: {
      fetchedAt: asIso(observedAt),
      adapterVersion: ADAPTER_VERSION
    }
  };
}

function parseCursor(cursor) {
  if (!cursor) return { version: 1, seenEntryIds: [], feedValidators: {} };
  let parsed;
  try {
    parsed = JSON.parse(cursor);
  } catch {
    throw new Error('Invalid JMA cursor JSON');
  }
  return {
    version: 1,
    seenEntryIds: Array.isArray(parsed.seenEntryIds) ? parsed.seenEntryIds.filter((value) => typeof value === 'string') : [],
    feedValidators: parsed.feedValidators && typeof parsed.feedValidators === 'object' ? parsed.feedValidators : {}
  };
}

function getHeader(response, name) {
  return typeof response?.headers?.get === 'function' ? response.headers.get(name) : undefined;
}

export class JmaXmlAdapter {
  constructor({
    feedUrls = Object.values(JMA_FEEDS.highFrequency),
    fetchImpl = globalThis.fetch,
    maxEntriesPerFetch = 100
  } = {}) {
    if (!Array.isArray(feedUrls) || feedUrls.length === 0) throw new Error('JmaXmlAdapter requires at least one feed URL');
    if (typeof fetchImpl !== 'function') throw new Error('JmaXmlAdapter requires fetch');
    if (!Number.isInteger(maxEntriesPerFetch) || maxEntriesPerFetch <= 0) throw new Error('maxEntriesPerFetch must be a positive integer');

    this.sourceId = JMA_SOURCE.id;
    this.feedUrls = feedUrls.map(validateFeedUrl);
    this.fetchImpl = fetchImpl;
    this.maxEntriesPerFetch = maxEntriesPerFetch;
  }

  async fetch(cursor) {
    const state = parseCursor(cursor);
    const seen = new Set(state.seenEntryIds);
    const feedValidators = { ...state.feedValidators };
    const items = [];
    const observedAt = new Date().toISOString();

    for (const feedUrl of this.feedUrls) {
      const validators = feedValidators[feedUrl] || {};
      const headers = { accept: 'application/atom+xml, application/xml, text/xml' };
      if (validators.etag) headers['if-none-match'] = validators.etag;
      if (validators.lastModified) headers['if-modified-since'] = validators.lastModified;

      const feedResponse = await this.fetchImpl(feedUrl, { headers });
      if (feedResponse.status === 304) continue;
      if (!feedResponse.ok) {
        const error = new Error(`JMA feed fetch failed: HTTP ${feedResponse.status}`);
        error.code = `HTTP_${feedResponse.status}`;
        throw error;
      }

      feedValidators[feedUrl] = {
        etag: getHeader(feedResponse, 'etag') || validators.etag,
        lastModified: getHeader(feedResponse, 'last-modified') || validators.lastModified
      };

      const feed = parseJmaAtomFeed(await feedResponse.text());
      const unseenEntries = feed.entries.filter((entry) => !seen.has(entry.id));

      for (const entry of unseenEntries) {
        if (items.length >= this.maxEntriesPerFetch) break;

        const reportResponse = await this.fetchImpl(entry.link, {
          headers: { accept: 'application/xml, text/xml' }
        });
        if (!reportResponse.ok) {
          const error = new Error(`JMA bulletin fetch failed for ${entry.id}: HTTP ${reportResponse.status}`);
          error.code = `HTTP_${reportResponse.status}`;
          throw error;
        }

        const reportXml = await reportResponse.text();
        items.push(normalizeJmaReport(entry, reportXml, { observedAt }));
        // Mark only successfully normalized entries. This avoids silently losing a
        // bulletin after a transient fetch/parse failure while still preventing
        // repeated downloads of successful records.
        seen.add(entry.id);
      }

      if (items.length >= this.maxEntriesPerFetch) break;
    }

    const seenEntryIds = [...seen].slice(-CURSOR_SEEN_LIMIT);
    return {
      items,
      nextCursor: JSON.stringify({ version: 1, seenEntryIds, feedValidators }),
      observedAt
    };
  }
}
