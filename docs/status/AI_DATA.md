# AI / Data Status

### Status
DONE — AI/Data common foundation v0.1 contracts, source/provider feasibility, deterministic RawItem → Signal projection, isolated GOV.UK/JMA source adapters, and offline contract fixtures are persisted. Production ingestion and CARDS/LIVE/DIVE integration remain intentionally **NOT TESTED**.

### Current goal
Provide one provenance-first shared data contract and isolated ingestion components that future CARDS, LIVE TRACE, and DIVE integrations can consume without rebuilding the same information into feature-specific formats.

### Completed
- Converted the high-level architecture into a concrete isolated v0.1 contract.
- Defined Source, RawItem, Signal, EventCandidate, EventCluster, Observation, Claim, Evidence, Verification, Article, DIVE Node, and typed DIVE Relation schemas.
- Separated AI processing confidence from epistemic verification. There is intentionally no `truth_probability` field.
- Separated “a source said X” from “X is true”: source behavior can be a confirmed Observation while the embedded proposition remains a Claim.
- Defined conservative Verification states: `not_assessed`, `unverified`, `supported`, `confirmed`, `contradicted`, `disputed`, `insufficient_evidence`.
- Prevented AI output alone from setting a Claim to `confirmed`; AI may produce an auditable suggestion only.
- Defined Evidence provenance and `independenceGroup` so syndicated copies do not masquerade as independent confirmations.
- Defined LIVE projection: Signal, EventCluster, likely-same-event confidence, grouped/ungrouped state, claimant/source, conflicting claims, raw/non-promoted information, and new-since-last-visit cursor logic.
- Defined CARDS projection for WHAT / CERTAINTY / CONTEXT / EXPLORE with source/evidence lineage on every factual entry.
- Defined DIVE typed relationships and explicitly made `historically_similar_to` contextual rather than evidentiary.
- Added server-side semantic guards so a DIVE `confirms` relation is downstream of an already-confirmed non-AI Verification state rather than a way for AI relation generation to create confirmation.
- Defined immutable/revisioned RawItem behavior and a provenance-preserving ingestion pipeline.
- Defined `SourceAdapter`, provider-neutral `AIProvider`, task router, usage accounting, and audit interfaces.
- Researched current 2026 official source/API constraints and model pricing before making recommendations.
- Corrected the YouTube entry to the June 2026 granular quota model after rechecking current official documentation.
- Recommended a no-paid-API initial source set: GDELT + JMA XML PULL + GOV.UK Content API + a terms-gated RSS/Atom adapter.
- Deferred X, Telegram, Reddit, YouTube API, Reuters, AP, ACLED, ReliefWeb, and unreviewed publisher feeds from the first path because they currently introduce payment, credentials/accounts, approval/licensing, or material terms review.
- Defined error handling, retry/quarantine behavior, source enablement gates, observability, token/cost accounting, and server-side secret rules.
- Added a synthetic sample that demonstrates a **confirmed observation of a statement** coexisting with a **disputed embedded claim**.
- Added an isolated GOV.UK Content API adapter prototype that emits the common RawItem input shape, keeps a per-path revision cursor, requires no secret, and defaults to metadata/description storage rather than full body retention.
- Ran one unauthenticated live GET against the official GOV.UK Content API quick-start endpoint on 2026-08-16; the resulting redirect edge case is covered by an offline fixture.
- Added a deterministic `RawItem → Signal` projector. It normalizes text, assigns only mechanical signal type/topic labels, preserves revision lineage, and starts every Signal ungrouped. It does **not** create Claims, Verification, attribution, EventCandidates, same-event confidence, or truth confidence.
- Rechecked the current JMA disaster-prevention XML service from official JMA material on 2026-08-16: PULL-only, no user registration, four high-frequency Atom feeds updated every minute, four long-term feeds updated hourly, and current common XML format Ver.1.3.
- Recorded JMA's explicit download-safety constraint: repeated downloads should be avoided and public XML URLs can block an IP after 10GB/day of downloads.
- Added an isolated JMA XML adapter with an official-host allowlist, Atom parsing, common `Control` / `Head` parsing, RawItem normalization, HTTP validators, and a bounded seen-entry cursor so successfully processed bulletins are not fetched twice.
- Added synthetic offline JMA Atom + report fixtures. They are explicitly test-only and are not real warnings.
- Extended the AI/Data contract suite to test JMA parsing, RawItem normalization, deterministic Signal projection, epistemic non-escalation, revision lineage, cursor deduplication, and rejection of non-JMA bulletin URLs.
- No production CARDS/LIVE/DIVE code was changed.
- No paid AI/source API call was executed and no external account was created.

### Evidence
- `docs/AI_DATA_ARCHITECTURE_V0_1.md`
- `docs/ai-data/schema-v0.1.md`
- `docs/ai-data/interfaces-v0.1.ts`
- `docs/ai-data/sample-v0.1.json`
- `docs/ai-data/SOURCE_FEASIBILITY_V0_1.md`
- `docs/ai-data/validation-v0.1.md`
- `docs/ai-data/JMA_ADAPTER_V0_1.md`
- `prototypes/ai-data-v0.1/govuk-content-adapter.mjs`
- `prototypes/ai-data-v0.1/jma-xml-adapter.mjs`
- `prototypes/ai-data-v0.1/rawitem-signal-projector.mjs`
- `prototypes/ai-data-v0.1/contract-validation.mjs`
- `prototypes/ai-data-v0.1/fixtures/govuk-content.json`
- `prototypes/ai-data-v0.1/fixtures/govuk-redirect.json`
- `prototypes/ai-data-v0.1/fixtures/jma-extra-feed.xml`
- `prototypes/ai-data-v0.1/fixtures/jma-warning.xml`
- `tests/ai-data-contract.mjs`
- `PRODUCT_PRINCIPLES.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`

### v0.1 data flow

```text
SourceAdapter
→ RawItemInput
→ persisted RawItem
→ deterministic Signal projector
→ Signal
→ EventCandidate
→ EventCluster
→ Observation / Claim / Evidence / Verification
→ Article
├─→ CARDS
├─→ LIVE
└─→ DIVE Node / DIVE Relation
```

### Key epistemic invariants
- `same_event` confidence means grouping confidence, not truth confidence.
- AI extraction/classification confidence is not a fact score.
- Attribution is not verification.
- “Government A said X” can be confirmed without confirming X.
- Contradictory sources remain separate and inspectable.
- AI alone cannot promote a proposition to `confirmed`.
- DIVE `confirms` cannot create verification; it can only reflect an already-confirmed underlying Claim.
- Historical similarity does not support the current event.
- AI-generated Article prose must retain source/evidence lineage.
- The deterministic RawItem → Signal projector does not perform epistemic escalation.

### Recommended first real-data adapters
1. **JMA disaster-prevention XML PULL** — first-party, structured, time-sensitive, no user registration required. Isolated parser/adapter + offline fixtures now exist; live continuous polling is still NOT TESTED.
2. **GOV.UK Content API** — structured first-party JSON, no auth/onboarding, documented 10 requests/sec/client. Isolated adapter + normal/redirect fixtures exist, and one official endpoint response shape was live-smoked once.
3. **GDELT 2.0 / DOC API** — broad free/open discovery layer; not a truth authority.
4. **Generic RSS/Atom adapter** — code can be shared; each actual feed remains disabled until its terms/storage policy are approved.

### Provider strategy
- UI/browser never imports OpenAI or another model SDK.
- Server routes product tasks through `AIProvider` / `AITaskRouter`.
- Mechanical tier: extraction, entities, topic classification, duplicate/same-event assistance.
- Reasoning tier: nuanced claim comparison, context construction, Article composition, DIVE structure.
- Candidate model/pricing notes are planning-only; **no provider is activated by this work**.
- Any first paid API call or account creation requires Owner approval.

### Cost state
- Source/API spend incurred by this work: **$0**.
- Paid AI calls executed: **0**.
- External accounts created: **0**.
- Paid/licensed sources enabled: **0**.

### Known issues / limitations
- Proposition-level rules for moving `supported → confirmed` are intentionally unresolved; a future non-AI verification policy is needed.
- Database / queue / hosting vendor is intentionally not selected.
- Near-duplicate and same-event thresholds require real-data tuning.
- Cluster merge/split behavior requires runtime evaluation.
- Final RSS publisher allowlist and retention rules require source-specific terms review.
- Telegram and Reddit have material current AI/data-usage restrictions and are not approved.
- X is paid and requires account/app/billing setup.
- Reuters/AP are licensed commercial sources.
- YouTube, ACLED, and current ReliefWeb integration introduce account/credential/approval dependencies.
- Live provider rate-limit behavior is not validated.
- JMA v0.1 only parses common Atom + `Control` / `Head` / `Headline` fields. Message-specific `Body` schemas are deliberately deferred until the relevant current JMA explanatory material is implemented and fixture-tested.
- JMA continuous polling and real download-volume behavior are not validated.

### Product decisions needed
None for this isolated, no-cost implementation.

Owner decision becomes necessary only before:
- a paid or licensed API/provider is activated,
- an external account/credential must be created,
- a source with unresolved terms risk is enabled,
- or a major product/epistemic policy changes.

### PASS
- Required common entities have concrete field-level schemas.
- Observation / attribution / Claim / Verification / Evidence are separated.
- LIVE same-event confidence and Claim verification are different data types/fields.
- CARDS factual entries carry provenance references.
- DIVE has typed relations with historical similarity explicitly contextual.
- DIVE `confirms` is guarded behind already-confirmed non-AI Verification.
- Provider boundary and usage accounting are server-side contracts.
- Synthetic sample exercises contradictory evidence without forcing one narrative.
- Isolated GOV.UK adapter normalization/cursor fixtures pass without network or secrets.
- JMA Atom and common `Control` / `Head` parsers have offline fixture coverage.
- JMA RawItem normalization keeps source URL, source identity, issue time, publishing office, title/headline, and retrieval adapter version.
- Deterministic RawItem → Signal projection produces no Claim/Verification/attribution/same-event/truth fields.
- JMA cursor tests prove a successfully processed bulletin is not downloaded twice on the next identical feed pass.
- JMA bulletin URLs outside the official `www.data.jma.go.jp/developer/xml/data/` path are rejected.
- Existing CARDS / LIVE / DIVE production code remains untouched.

### NOT TESTED
- continuous/live-polling JMA / GOV.UK / GDELT ingestion
- direct external-network execution of the `JmaXmlAdapter` class
- full JMA message-specific Body extraction
- database persistence
- real OpenAI or other paid AI provider responses
- Article generation against live source material
- production CARDS integration
- production LIVE integration
- production DIVE integration
- real rate-limit / retry / download-volume behavior
- production commercial-rights/legal review

### Next executable action
Build an isolated idempotent ingestion runner around `SourceAdapter → RawItem persistence boundary → deterministic Signal projector`, with exact-duplicate/revision fixtures and no production database dependency. This remains no-secret/no-paid and should precede CARDS/LIVE/DIVE integration.
