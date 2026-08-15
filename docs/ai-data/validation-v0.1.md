# KAWASEMI AI / Data Semantic Validation v0.1

Status: **contract guard — isolated from production CARDS / LIVE / DIVE**

These rules close gaps that type definitions alone cannot prevent.

## 1. AI confidence never becomes truth confidence

Reject any transformation that treats `ProcessingConfidence.score` as a probability that a proposition is true.

Examples:
- `same_event_matching: 0.94` means the records likely concern the same event.
- `extraction: 0.98` means the model likely extracted the text correctly.
- neither value may promote a Claim to `confirmed`.

## 2. `historically_similar_to` is contextual only

A DIVE relation with `relationType = historically_similar_to` must use `semanticClass = contextual`.

It cannot:
- create Evidence with relation `supports`;
- increase a Claim verification state;
- be presented as confirmation of the current event.

## 3. `confirms` is downstream of Verification, never a source of Verification

`confirms` is intentionally stricter than `supports`.

For v0.1, a DIVE `confirms` relation is valid only when all are true:
1. `semanticClass = evidentiary`;
2. `evidenceIds` is non-empty;
3. the relation targets a DIVE node of `nodeType = claim`;
4. that node retains a `backingRefs` reference to the underlying Claim;
5. the underlying Claim already has `verification.state = confirmed` from the non-AI Verification layer.

The direction of authority is therefore:

```text
Evidence + non-AI verification policy / human / external authority
→ Claim.verification = confirmed
→ DIVE may materialize a `confirms` relation
```

Never:

```text
AI generated DIVE relation
→ `confirms`
→ Claim becomes confirmed
```

An AI provider may propose a relation candidate, but server-side semantic validation must reject it unless the underlying Claim is already confirmed.

## 4. Article provenance remains mandatory

Every factual CARDS Article entry must retain:
- `supportRefs`;
- `evidenceIds`;
- `sourceIds`.

Generated prose cannot become the sole record of a factual statement.

## 5. Validation implementation

The isolated helper is:

`prototypes/ai-data-v0.1/contract-validation.mjs`

The fixture suite is:

`tests/ai-data-contract.mjs`

Current fixture coverage includes:
- confirmed Observation vs disputed embedded Claim;
- same-event confidence separated from truth;
- historical similarity contextual-only;
- invalid AI-created `confirms` rejected;
- valid `confirms` accepted only after underlying Claim verification is already confirmed;
- Article provenance;
- LIVE new-since-last-visit cursor logic;
- GOV.UK normal and redirect normalization/cursor behavior.

## NOT TESTED

- production database constraints;
- production DIVE graph materialization;
- production AI relation-generation responses;
- human/external-authority verification workflow;
- production CARDS/LIVE/DIVE integration.
