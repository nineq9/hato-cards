# AI / Data Status

### Status
DONE — AI/Data common foundation v0.1 contracts and current source/provider feasibility are persisted. Production ingestion and CARDS/LIVE/DIVE integration remain intentionally **NOT TESTED**.

### Current goal
Provide one provenance-first shared data contract that future CARDS, LIVE TRACE, and DIVE FOCUS MAP integrations can consume without rebuilding the same information into feature-specific formats.

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
- Defined immutable/revisioned RawItem behavior and a provenance-preserving ingestion pipeline.
- Defined `SourceAdapter`, provider-neutral `AIProvider`, task router, usage accounting, and audit interfaces.
- Researched current 2026 official source/API constraints and model pricing before making recommendations.
- Recommended a no-paid-API initial source set: GDELT + JMA XML PULL + GOV.UK Content API + a terms-gated RSS/Atom adapter.
- Deferred X, Telegram, Reddit, YouTube API, Reuters, AP, ACLED, ReliefWeb, and unreviewed publisher feeds from the first path because they currently introduce payment, credentials/accounts, approval/licensing, or material terms review.
- Defined error handling, retry/quarantine behavior, source enablement gates, observability, token/cost accounting, and server-side secret rules.
- Added a synthetic sample that demonstrates a **confirmed observation of a statement** coexisting with a **disputed embedded claim**.
- No production CARDS/LIVE/DIVE code was changed.
- No paid AI/source API call was executed and no external account was created.

### Evidence
- `docs/AI_DATA_ARCHITECTURE_V0_1.md`
- `docs/ai-data/schema-v0.1.md`
- `docs/ai-data/interfaces-v0.1.ts`
- `docs/ai-data/sample-v0.1.json`
- `docs/ai-data/SOURCE_FEASIBILITY_V0_1.md`
- `PRODUCT_PRINCIPLES.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`

### v0.1 data flow

```text
Source
→ RawItem
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
- Historical similarity does not support the current event.
- AI-generated Article prose must retain source/evidence lineage.

### Recommended first real-data adapters
1. **JMA disaster-prevention XML PULL** — first-party, structured, time-sensitive, no user registration required.
2. **GOV.UK Content API** — structured first-party JSON, no auth/onboarding, documented 10 requests/sec/client.
3. **GDELT 2.0 / DOC API** — broad free/open discovery layer; not a truth authority.
4. **Generic RSS/Atom adapter** — code can be shared; each actual feed remains disabled until its terms/storage policy are approved.

### Provider strategy
- UI/browser never imports OpenAI or another model SDK.
- Server routes product tasks through `AIProvider` / `AITaskRouter`.
- Mechanical tier: extraction, entities, topic classification, duplicate/same-event assistance.
- Reasoning tier: nuanced claim comparison, context construction, Article composition, DIVE structure.
- Candidate OpenAI models/prices are documented only for planning; **no provider is activated by this work**.
- Any first paid API call or account creation requires Owner approval.

### Cost state
- Source/API spend incurred by this work: **$0**.
- Paid AI calls executed: **0**.
- External accounts created: **0**.
- Paid/licensed sources enabled: **0**.
- Planning-only illustrative cost model lives in `docs/AI_DATA_ARCHITECTURE_V0_1.md`; it is not a budget commitment.

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

### Product decisions needed
None for the isolated, no-cost v0.1 contract.

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
- Provider boundary and usage accounting are server-side contracts.
- Synthetic sample exercises contradictory evidence without forcing one narrative.
- Existing CARDS / LIVE / DIVE production code remains untouched.

### NOT TESTED
- live JMA / GOV.UK / GDELT ingestion
- database persistence
- real OpenAI or other AI provider responses
- Article generation against live source material
- production CARDS integration
- production LIVE integration
- production DIVE integration
- real rate-limit / retry behavior
- production commercial-rights/legal review

### Next executable action
Build an isolated, no-secret source-adapter fixture against one approved first-party endpoint (prefer JMA XML PULL or GOV.UK Content API), emit the v0.1 RawItem/Signal contract, and validate lineage before any production integration. This can proceed without changing CARDS/LIVE/DIVE.
