# Core / CARDS Status

### Status
RUNNING

### Current goal
Execute Issue #4 (`Day 1: stabilize CARDS with human-like mobile E2E QA`) and remove reproducible critical gesture failures before adding more production scope.

### Completed
- Phase 0 article interaction foundation refactor is on main.
- ARTICLE CARD uses the production reading surface for tutorial and normal reading.
- Shared READ / NEXT / SAVE gesture path exists.
- Issue #4 scope, sprint contract, PRODUCT_PRINCIPLES.md, UX_RULES.md, QA_CHECKLIST.md, and development process were re-read before this pass.

### Evidence
- Issue #4: https://github.com/nineq9/hato-cards/issues/4
- Working branch: `issue-4-cards-human-e2e`
- Baseline main at start of this pass: `2d4483e3b72d3e9c379d1cf36215720919dd69d6`
- Existing Phase 0 commits: `fb28c0f9ec1c3ba0aa3d34c970b57d1774866cb1`, `289ea83d61d3dec2483aaf4c24b5653fec1061c8`

### Known issues / limitations
- Owner-reported: a slightly diagonal vertical READ can leave a subsequent left-swipe NEXT unavailable/broken. Reproduction E2E is being added now.
- Human-like E2E currently lacks repeated imperfect diagonal/mixed gesture coverage and durable screenshot evidence.
- Tutorial experience remains owner-reported as confusing; it must be exercised visually, not accepted from code inspection alone.
- Production navigation still shows legacy `FOR YOU / HOT / DIVE` wording.
- Real iPhone/Safari behavior is NOT TESTED in this workstream environment unless separately stated.

### Product decisions needed
None for the immediate Issue #4 stabilization pass. Fix confirmed regressions and align with existing UX rules first.

### Next action
Add a dedicated touch-based mobile E2E journey that reproduces diagonal READ → NEXT, verifies top/middle/end READ/NEXT/SAVE, mixed gestures, menu recovery, tutorial, and screenshot capture; fix confirmed regressions; rerun and persist PASS / FAIL / NOT TESTED evidence.
