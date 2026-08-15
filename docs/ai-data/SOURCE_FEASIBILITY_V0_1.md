# KAWASEMI Source Feasibility — 2026 v0.1

Research date: **2026-08-16**

Purpose: choose a five-day v0.1 source set that can produce real incoming information with low cost, high stability, fast implementation, and acceptable terms risk.

This is an engineering/product feasibility review, not legal advice. Source terms can change; re-check them before production enablement.

## Decision summary

### Recommended to implement / enable first

1. **GDELT 2.0 / DOC API** — broad discovery layer; free/open; no account dependency; never treated as a truth authority.
2. **Japan Meteorological Agency disaster-prevention XML PULL** — first-party Japanese live data; user registration not required.
3. **GOV.UK Content API** — structured first-party government content; no authentication/onboarding; documented 10 requests/second/client.
4. **Generic RSS / Atom adapter** — implement the adapter now, but enable feeds only after a source-specific terms check.

This combination supplies:
- broad discovery,
- high-quality first-party official Signals,
- chronological real incoming data,
- enough variation to exercise Event/Claim/Article/DIVE contracts,
- no paid API requirement for the initial path.

### Explicitly deferred from v0.1

- X
- Telegram
- Reddit
- YouTube Data API
- Reuters
- AP
- ACLED
- ReliefWeb
- publisher feeds whose terms have not been reviewed

The reason is not lack of product value. These currently add payment, credentials/accounts, approval/licensing, or material terms-review work that is unnecessary to prove the common foundation.

## Feasibility table

| Source class | Current acquisition path | Cost / account | Rate / quota notes | Terms / rights notes | Difficulty | v0.1 |
|---|---|---|---|---|---|---|
| RSS / Atom | Standard HTTP feed polling; conditional GET where supported | Usually no API fee; source-dependent | Feed/server dependent; use caching and respectful polling | Feed-specific terms control reuse/storage; never assume feed availability grants article-reuse rights | Low | **YES, adapter only; allowlist feeds** |
| Official Web | Structured endpoint where offered; otherwise careful HTML extraction | Usually no API fee; varies | Site dependent | Robots/terms/copyright/source retention must be checked per site | Medium | **Selective** |
| JMA | Disaster-prevention XML PULL feed | No user registration required | Pull at source-defined publication timing; service may stop/delay for maintenance | First-party official feed; record usage/source attribution and re-check site policy before production | Low–Medium | **YES** |
| GOV.UK | Content API JSON | No authentication, onboarding, or agreement for API use | Maximum 10 requests/sec per client | Government content generally reusable under Open Government Licence subject to its conditions/exceptions | Low | **YES** |
| GDELT 2.0 | DOC API / open data files | Free/open; no paid API dependency | DOC API docs reviewed; no numeric public rate limit found in reviewed official material — cache/throttle conservatively | GDELT data is open, but linked publisher content retains publisher rights | Low | **YES** |
| Telegram | Telegram API / TDLib / client APIs | API itself can be used without a per-call fee, but requires Telegram/API credentials | Dynamic `FLOOD_WAIT_X` limits | Current Telegram API terms include significant Content Licensing / AI-scraping restrictions; requires terms review for KAWASEMI processing | High policy risk | **NO** |
| X | X API | Pay-per-use; account/app/billing required | Current pricing docs list per-resource reads; monthly read cap also applies | Developer agreement + platform policy; cost begins with usage | Medium | **NO** |
| YouTube | YouTube Data API v3 | Google Cloud project/API credentials; quota based | Default quota is 10,000 units/day; `search.list` costs 100 units, effectively about 100 default search calls/day | API Services Terms / developer policies; extra quota requires audit/review | Medium | **NO for first path** |
| Reddit | OAuth Data API | Registration/OAuth; commercial use may require separate agreement/approval | Reddit controls limits and may change them | July 2026 terms materially restrict commercial and AI/model uses without required rights/permission | High policy risk | **NO** |
| News media | RSS, licensed API, or permitted web endpoints | Varies | Varies | Publisher-specific. Example: Guardian terms materially restrict automated/AI/commercial reuse; do not generalize across publishers | Medium–High | **Only approved RSS feeds** |
| Reuters | Reuters Connect API / content licensing | Commercial/metered subscription or licensing | Contract-dependent | Licensed content/entitlements | High cost/admin | **NO** |
| AP | AP Media API / licensed feeds | Licensed entitlement/contract | Contract-dependent | Licensed content/entitlements | High cost/admin | **NO** |
| ACLED | ACLED API | myACLED account + OAuth | Product/API rules apply | Account and dataset terms required | Medium | **NO** |
| ReliefWeb | ReliefWeb API | API has no usage fee; current app identification/approval requirement applies | Maximum 1,000 calls/day and up to 1,000 entries/call in current docs | Original-source content retains copyright; approved app identification required | Medium | **LATER** |
| Other OSINT | Prefer public structured feeds/datasets with explicit reuse terms | Varies | Varies | Dataset license and upstream-source rights must be separate fields | Varies | **Case by case** |

## Official references checked

### GDELT
- GDELT project: https://www.gdeltproject.org/
- GDELT 2.0: https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime/
- DOC 2.0 API: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/

Relevant current properties used by KAWASEMI:
- GDELT describes its database as free/open.
- GDELT 2.0 operates on a roughly 15-minute update heartbeat.
- DOC API can return structured result formats including JSON/JSONFeed.

KAWASEMI use: **discovery / candidate generation**, not source-of-truth status. Preserve original publisher URLs and downstream rights status.

### Japan Meteorological Agency
- Disaster prevention XML overview / PULL: https://xml.kishou.go.jp/xmlpull.html

The official page states user registration is not required for PULL access. It also warns that delivery can stop/delay during maintenance or system conditions.

KAWASEMI use: ideal first-party live Signal source for testing observation/change/event flow in Japan.

### GOV.UK
- Content API: https://content-api.publishing.service.gov.uk/
- API documentation: https://docs.publishing.service.gov.uk/repos/content-store/api/content_api.html
- Open Government Licence: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/

Official documentation states the API is available without authentication/onboarding/agreement and sets a maximum of 10 requests per second per client.

KAWASEMI use: stable structured first-party content; suitable for deterministic provenance examples.

### X
- Pricing: https://docs.x.com/x-api/getting-started/pricing
- Rate limits: https://docs.x.com/x-api/fundamentals/rate-limits

Current official pricing is pay-per-use and requires developer/app billing setup. Current documentation lists resource-read pricing and a monthly Post-read cap for pay-per-use access.

KAWASEMI decision: valuable later, but it violates the v0.1 “no paid/account dependency” goal. **Owner decision required before enabling.**

### Telegram
- API Terms: https://core.telegram.org/api/terms
- API obtaining ID: https://core.telegram.org/api/obtaining_api_id
- Error handling / flood waits: https://core.telegram.org/api/errors

The current API terms include a Content Licensing / AI Scraping section with restrictions material to AI/ML use of Telegram-derived content. API clients also require credentials and must handle dynamic flood waits.

KAWASEMI decision: **do not enable without explicit terms/legal review and Owner approval.**

### YouTube
- Quota calculator / cost: https://developers.google.com/youtube/v3/determine_quota_cost
- `search.list`: https://developers.google.com/youtube/v3/docs/search/list
- quota audit: https://support.google.com/youtube/contact/yt_api_form

Default projects receive 10,000 quota units/day; `search.list` costs 100 units. Additional quota requires a compliance audit.

KAWASEMI decision: useful later for official-channel video Signals, but unnecessary account/credential setup for first v0.1.

### Reddit
- Data API Terms: https://redditinc.com/policies/data-api-terms
- Developer Terms: https://redditinc.com/policies/developer-terms

Terms reviewed are dated July 20, 2026 and contain material restrictions around commercial usage and AI/model use without required permissions/rights.

KAWASEMI decision: **defer; do not scrape/API-ingest for v0.1.**

### Reuters / AP
- Reuters Connect developer/API: https://www.reutersconnect.com/
- AP Media API / developer: https://developer.ap.org/

Both are professional licensed-content systems rather than a zero-friction free-feed dependency. Reuters Connect describes metered/flexible commercial models; AP access depends on licensed entitlements.

KAWASEMI decision: not needed for five-day proof. Treat future integration as Owner-approved licensed source work.

### ACLED
- API access: https://acleddata.com/api-documentation/getting-started

Current access requires myACLED account/OAuth.

KAWASEMI decision: useful future event/OSINT dataset, but account dependency makes it non-essential for the first path.

### ReliefWeb
- API: https://apidoc.reliefweb.int/
- Terms / usage guidance: https://apidoc.reliefweb.int/terms-of-service

Current docs specify up to 1,000 calls/day and 1,000 entries/call, and require approved application identification under the newer access rules. Original-source material can retain its own copyright.

KAWASEMI decision: strong later humanitarian source, but current approval/app-identification dependency is unnecessary for v0.1.

### Example publisher RSS terms
- BBC RSS guidance: https://www.bbc.co.uk/news/10628494
- Guardian terms: https://www.theguardian.com/help/terms-of-service

The existence of RSS is not sufficient evidence that every downstream commercial/AI use is allowed. KAWASEMI therefore gates each publisher feed separately.

## v0.1 Source gate

A Source can be set `enabled=true` only after all of these have concrete values:

```text
acquisition method
termsStatus = approved
storeOriginalText policy
retention policy
rate/poll policy
source attribution rule
credential requirement
cost class
```

Suggested operational gate:

```ts
type SourceEnablement = {
  sourceId: string;
  enabled: boolean;
  termsStatus: 'approved' | 'review_required' | 'restricted' | 'unknown';
  credentialStatus: 'none_needed' | 'configured_server_side' | 'missing';
  costClass: 'free' | 'low' | 'paid' | 'licensed';
  approvedBy?: 'policy' | 'owner' | 'legal';
  reviewedAt: string;
  reviewDueAt?: string;
};
```

Rules:
- `paid` / `licensed` → Owner decision before enablement.
- account creation / external credentials → Owner decision before enablement.
- `review_required` / `restricted` → do not ingest until resolved.
- keys/tokens live only in server-side secrets.

## Recommended five-day real-data path

### Path A — fastest first-party proof

```text
JMA XML PULL
→ RawItem
→ Signal
→ EventCandidate / EventCluster
→ Observation / Claim if applicable
→ LIVE projection
→ optional Article
→ DIVE nodes/relations
```

Why: no user registration, highly structured, genuinely time-sensitive, strong provenance.

### Path B — easiest structured-content proof

```text
GOV.UK Content API
→ RawItem
→ Signal
→ Observation / attributed Claim
→ Article
```

Why: JSON, no auth, explicit rate limit, predictable first-party source identity.

### Discovery supplement

Use GDELT to discover additional public reporting and event candidates. Do not treat a GDELT match as independent confirmation. Follow the original URL, preserve source identity, and apply publisher-specific rights/storage policy.

## Risks

1. **Rights are independent of technical access.** A public URL/API response does not automatically grant unrestricted article storage/republication.
2. **Aggregators can duplicate one upstream source.** Use `Evidence.independenceGroup` and provenance.
3. **Official statements are still claims about the world.** First-party status confirms authorship/issuance, not every proposition.
4. **Rate limits change.** Store source policies as configuration, not constants spread through UI/domain code.
5. **Source terms change.** Keep `reviewedAt` / `reviewDueAt` and block unknown/restricted sources.

## Cost state for current work

- External source API spend incurred: **$0**.
- External account creation performed: **none**.
- Paid/licensed source enabled: **none**.
- Terms-risk source enabled: **none**.

## NOT TESTED

- live polling against any source
- production storage/retention compliance
- actual 429/rate-limit behavior
- production RSS allowlist
- live GDELT/JMA/GOV.UK adapter behavior
- legal review for commercial deployment

The feasibility review is complete; runtime behavior remains intentionally NOT TESTED.
