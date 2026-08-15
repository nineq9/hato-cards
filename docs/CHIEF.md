# KINGFISHER Chief

Chief is the GitHub-centered orchestration layer for Asumi OS.

## What Chief v1 does now

- treats GitHub as the canonical project state instead of ChatGPT thread state;
- keeps one control issue (`#1 Chief Control — KINGFISHER`) as the operational status surface;
- starts smoke/regression QA automatically when a pull request is opened or updated;
- reacts to QA completion immediately through GitHub Actions rather than waiting for the hourly Scheduled Task;
- writes the current state and next step back to GitHub;
- keeps Codex and Work optional rather than making the project depend on their quotas;
- reserves human interruption for the approval conditions defined in `ASUMI_OS.md`.

## State machine

Typical path:

`WORK_CREATED → QA_QUEUED → AUTOMATED_QA_PASS → PRODUCT_REVIEW → IMPLEMENT/REWORK → QA_QUEUED → ... → OWNER_ACTION_REQUIRED (only when policy requires it) → DONE`

A failed automated test becomes:

`REWORK_REQUIRED`

and should route to Build rather than to Asumi.

## Event path

GitHub event
→ `KINGFISHER smoke`
→ browser/syntax/regression checks
→ `KINGFISHER chief`
→ PR status + Chief Control issue updated
→ AI worker/reviewer (when configured)
→ owner only for policy-gated decisions

The existing hourly Asumi OS Scheduled Task is a safety net for missed owner-action states. It is not the development clock.

## Quality policy

Chief optimizes for output quality, not the cheapest model.

Model/capability selection rules:

1. Mechanical, easily verified tasks may use a lower-cost capability only if the result is independently testable.
2. Product reasoning, ambiguous debugging, architecture, important code review, multi-source synthesis, and final quality gates should prefer the strongest appropriate available capability.
3. The agent that produced a change must not be the only source of confidence in that change. Use tests and, where appropriate, an independent review pass.
4. Model substitutions caused by quota or availability must not silently lower the acceptance bar.
5. If no available model can meet the required quality, stop that AI-dependent stage rather than pretend it passed.

## Quota / availability policy

Baseline control plane:
- GitHub repository state
- GitHub Issues / PRs
- GitHub Actions
- ordinary ChatGPT interactions
- Asumi OS Scheduled Task as notification fallback

Optional accelerators:
- Codex
- Work
- external AI APIs
- other coding agents

If Codex or Work quota is exhausted, Chief must continue state tracking and deterministic QA. AI-dependent implementation/review may switch to another quality-approved provider or wait, but the project must not lose its state.

## Paid provider boundary

Chief v1 intentionally does **not** activate a paid AI API or coding agent automatically.

Before a paid provider is enabled, Asumi must approve the cost/commitment. Provider integration should be behind an abstraction so the orchestration flow does not depend on one vendor.

## Honest automation boundary of v1

Chief v1 is a real event-driven control plane, but it is not yet a fully autonomous code-authoring employee.

It can immediately detect work and QA results and route project state. Automatic code diagnosis/rewrite and independent AI Product review require a configured AI worker. Until that is configured, Chief must mark that boundary explicitly rather than claim background work is happening.

## Next implementation slice

1. validate Chief v1 on a real PR;
2. inspect the current Phase 0 UX implementation and produce a root-cause audit;
3. add the AI-worker adapter with a quality-first model policy;
4. only after owner approval, configure a provider/secret if the chosen path costs money;
5. route failed QA directly back to the worker and repeat until acceptance criteria pass.
