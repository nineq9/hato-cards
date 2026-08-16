# KAWASEMI JMA XML Adapter v0.1

Status: **isolated implementation — no production CARDS / LIVE / DIVE integration**

Research / implementation date: **2026-08-16**

## Current official JMA contract checked

Official sources checked on 2026-08-16:

- JMA disaster-prevention XML PULL: https://xml.kishou.go.jp/xmlpull.html
- JMA XML technical materials: https://xml.kishou.go.jp/tec_material.html
- JMA XML FAQ: https://xml.kishou.go.jp/qanda.html
- JMA XML update log: https://xml.kishou.go.jp/revise.html

Current properties relevant to KAWASEMI:

- the public JMA XML service is **PULL-only**;
- user registration is not required;
- high-frequency Atom feeds update every minute and list at least roughly the latest 10 minutes of arrivals;
- long-term Atom feeds update hourly; the FAQ says they currently contain roughly seven days, without guaranteeing that retention window;
- JMA explicitly warns users not to repeatedly download the same XML;
- an IP can be blocked when downloads from the public JMA XML URLs reach **10GB/day or more**;
- the current common XML format is **JMA Disaster Prevention XML Format Ver.1.3**; the technical-material page was partially updated again on 2026-08-06;
- `Control` and `Head` are common across message types; `Body` is message-specific;
- JMA says the public XML can generally be reused, including commercially, subject to its usage notes, attribution, and applicable Meteorological Service Act constraints.

No paid service, account, API key, or external credential is used by this v0.1 implementation.

## Feed URLs

High-frequency feeds:

```text
https://www.data.jma.go.jp/developer/xml/feed/regular.xml
https://www.data.jma.go.jp/developer/xml/feed/extra.xml
https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml
https://www.data.jma.go.jp/developer/xml/feed/other.xml
```

Long-term feeds:

```text
https://www.data.jma.go.jp/developer/xml/feed/regular_l.xml
https://www.data.jma.go.jp/developer/xml/feed/extra_l.xml
https://www.data.jma.go.jp/developer/xml/feed/eqvol_l.xml
https://www.data.jma.go.jp/developer/xml/feed/other_l.xml
```

The adapter defaults to the four high-frequency feeds but accepts a smaller explicit allowlisted set for tests or later runtime policy.

## Parser boundary

`prototypes/ai-data-v0.1/jma-xml-adapter.mjs` contains two deterministic parsers:

1. `parseJmaAtomFeed()`
   - entry ID
   - entry title
   - updated time
   - author
   - official bulletin XML URL

2. `parseJmaReport()`
   - common `Control` fields
   - common `Head` fields
   - `Headline/Text`

v0.1 intentionally does **not** pretend one generic parser understands every message-specific `Body`. Deeper warning / earthquake / volcano Body adapters can be added only against the corresponding current JMA explanatory material and fixtures.

## RawItem normalization

`normalizeJmaReport()` emits the common `RawItemInput` shape:

- `sourceId = jma-disaster-prevention-xml`
- Atom entry ID as external ID
- official JMA XML URL as canonical URL
- report/control timestamps
- publishing office as organization
- Head title
- Headline text as an excerpt when present
- Japanese language
- canonical XML URL as a document media reference

The full message-specific Body is not copied into `originalText` in v0.1. The official XML URL remains available for provenance and later source-specific processing.

## Download-safety cursor

The cursor stores:

- successfully processed Atom entry IDs;
- HTTP `ETag` / `Last-Modified` validators when JMA returns them.

A bulletin entry is marked seen **only after** its linked XML has been fetched and normalized successfully. This prevents both:

- repeatedly downloading successful bulletins;
- silently losing a bulletin after a transient fetch/parse failure.

The seen-entry list is bounded to 4096 IDs so the cursor cannot grow without limit.

## Deterministic RawItem → Signal projector

`prototypes/ai-data-v0.1/rawitem-signal-projector.mjs` is deliberately narrower than AI extraction.

It may deterministically produce:

- normalized title / excerpt whitespace;
- mechanical signal type;
- simple keyword topics;
- revision relationship;
- initial `ungrouped` state.

It does **not** create:

- Claim;
- Verification;
- attribution;
- EventCandidate;
- EventCluster;
- same-event confidence;
- truth confidence.

`processingConfidence` remains empty for this deterministic projection. A deterministic rule does not become a `truth = 1.0` score.

## Epistemic invariants preserved

- AI confidence ≠ truth.
- attribution ≠ verification.
- same-event confidence ≠ truth confidence.
- AI alone cannot mark a Claim confirmed.
- historical similarity is contextual, not evidence.
- JMA being first-party confirms what JMA issued; it does not automatically prove every proposition that may appear inside a bulletin.

## Offline fixtures

Fixtures are intentionally synthetic and are **not real warnings**:

- `prototypes/ai-data-v0.1/fixtures/jma-extra-feed.xml`
- `prototypes/ai-data-v0.1/fixtures/jma-warning.xml`

They reproduce only the common Atom / Control / Head structure needed for deterministic contract testing.

## NOT TESTED

- continuous polling of JMA public feeds;
- production rate / download-volume behavior;
- all current message-specific Body schemas;
- earthquake/volcano-specific Body extraction;
- persistence/revision linking in a real database;
- production CARDS/LIVE/DIVE projection;
- paid JMA distribution services.
