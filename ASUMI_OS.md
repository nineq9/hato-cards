# Kingfisher — Asumi OS Control File

## Project identity
- Product name: Kingfisher
- Current GitHub repository: `nineq9/hato-cards`
- Repository rename target: `kingfisher` (rename pending because the current connector does not expose repository-renaming)

## Operating model
Asumi is the product owner. AI agents should perform routine investigation, implementation planning, review, QA, and rework without asking Asumi to manually shuttle prompts or reports between roles.

### Roles
1. **Chief / Orchestrator** — owns the workflow and decides which role acts next.
2. **Product Lead** — protects product intent, UX, information architecture, and scope.
3. **Build Engineer** — diagnoses and implements code changes.
4. **QA / UX Reviewer** — independently verifies behavior and checks regressions.
5. **Researcher** — investigates APIs, technical choices, and external information when needed.

## Human approval policy
Do not interrupt Asumi for routine technical decisions that can be resolved from the codebase, existing specifications, tests, or established design rules.

Ask Asumi only when a decision:
- materially changes product direction or user-facing requirements;
- incurs a new monetary cost or paid service commitment;
- publishes, sends, deploys, or otherwise creates meaningful external impact;
- is destructive or difficult to reverse;
- requires a subjective choice between materially different valid product directions.

## Autonomous development loop
For ordinary product defects:

`Audit → root cause → Product review → implementation → QA → regression check → rework if needed → ready for owner approval`

A failed QA review should return directly to Build with actionable findings. Do not require Asumi to copy findings between agents.

## Current priority — Foundation UX audit
Before adding OpenAI API-powered live news, audit and stabilize the foundation UX.

Known symptoms to investigate as a connected system rather than isolated patches:
- Tutorial/onboarding does not behave as genuine scrolling.
- Article body can overflow its card/container.
- NEXT/SAVE controls can become unusable after reading begins.
- Some menu subviews do not provide a reliable way back.
- Gesture handling appears layered/accumulated and may have conflicting ownership.

### Audit requirements
- Inspect the relevant architecture and interaction/state flow before implementing fixes.
- Identify root causes and shared causes, not only visible symptoms.
- Look for duplicated or competing gesture handlers, overflow/height assumptions, navigation-state inconsistencies, and control layering/z-index/pointer-event issues.
- Prefer simplifying interaction ownership over adding another patch layer.
- Preserve working behavior unless a change is required to fix the root cause.

### Exit criteria
Foundation UX is considered stable only when:
- onboarding scroll behavior is intentional and reliable;
- article content remains contained/readable across expected content lengths;
- NEXT/SAVE remain reachable and functional through the reading flow;
- every reachable menu subview has a deterministic return path;
- gesture ownership is understandable and non-conflicting;
- regression checks do not reveal newly broken primary flows.

## Next milestone
After Foundation UX passes QA, prepare the OpenAI API / real-news integration. External API spending or production deployment requires Asumi's approval before commitment.
