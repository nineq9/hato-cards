# AI / Data Status

### Status
READY

### Current goal
Prepare the production AI/data pipeline only after stable UX and data contracts are clear enough to avoid rebuilding the backend around changing product behavior.

### Completed
- High-level architecture exists for source ingestion, raw items, event candidates, claims, structured articles, DIVE graph data, and provider abstraction.
- Product principles define AI as organizer/extractor rather than invisible truth judge.

### Evidence
- `docs/ARCHITECTURE.md`
- `PRODUCT_PRINCIPLES.md`
- `docs/DECISION_LOG.md`

### Known issues / limitations
- Production API/data implementation should not outrun unstable CARDS/LIVE/DIVE contracts.
- Source coverage, provider costs, and platform/API constraints require current verification before implementation commitments.

### Product decisions needed
None for the immediate core-stabilization phase.

### Next action
After core UX contracts stabilize, convert the architecture into concrete server-side interfaces, schemas, ingestion stages, provider abstraction, and cost/observability plan.
