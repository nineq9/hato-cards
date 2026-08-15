# KAWASEMI Workstream Handoff Protocol

This document exists so the product owner does not have to read and manually relay long ChatGPT thread outputs.

## Core rule

**Important workstream results must be persisted to GitHub.**

Chat-only conclusions are not considered durable project state.

Product HQ cannot assume it can open or read another ChatGPT thread. Therefore, specialist workstreams must leave a GitHub-visible handoff whenever they produce information that Product HQ will need later.

## Applies to

- Build
- Design / Motion
- LIVE
- DIVE
- AI / Data
- any future specialist workstream

## Required end-of-task behavior

Before a specialist workstream reports a meaningful task as complete, it must do one of the following:

1. update its workstream status file under `docs/status/`, and/or
2. commit the actual implementation / prototype / design documentation to GitHub, and
3. include concrete evidence such as commit SHA, branch, preview path, test result, or known limitation.

A long answer that exists only inside a ChatGPT thread is not a complete handoff.

## Workstream status files

Use these files:

- `docs/status/CORE_CARDS.md`
- `docs/status/DESIGN.md`
- `docs/status/LIVE.md`
- `docs/status/DIVE.md`
- `docs/status/AI_DATA.md`

Each workstream owns its own file to reduce edit conflicts.

## Required status format

Every status file should keep these headings:

### Status
Use only:
- RUNNING
- WAITING_EXTERNAL
- REWORKING
- OWNER_ACTION_REQUIRED
- BLOCKED
- DONE

Do not use RUNNING unless work is genuinely executing. Do not use DONE unless the result and relevant verification exist.

### Current goal
One short description of what the workstream is trying to achieve.

### Completed
What is actually finished.

### Evidence
Concrete GitHub-visible proof, for example:
- commit SHA
- branch name
- preview/demo path
- PR / issue
- test output
- screenshots/artifacts when available

### Known issues / limitations
Anything still broken, unverified, or intentionally incomplete.

### Product decisions needed
Only decisions that genuinely require Product HQ / owner judgment.

If none, write `None`.

### Next action
The next executable step, not a vague future idea.

## Prototype rule

A prototype is not DONE because files exist in GitHub.

For owner review, DONE requires a browser-accessible preview that opens the actual interactive demo, not a GitHub code listing.

If a public preview cannot be provided, status must not be reported as DONE for owner review.

## Design-work rule

Design exploration that affects product direction must be persisted in either:

- a relevant product/design document, or
- the Design status file with the chosen direction, rejected alternatives, and open questions.

The owner should not be required to copy a design-thread response into Product HQ just so Product HQ can understand what happened.

## Build-work rule

Implementation work must leave:

- code committed to GitHub,
- changed-file / component evidence,
- QA result,
- NOT TESTED items,
- known regressions or unresolved issues.

"Implemented" without verification is not DONE.

## Product HQ behavior

Product HQ should reconstruct project state from:

1. GitHub source and docs,
2. `docs/PROJECT_STATUS.md`,
3. workstream status files,
4. commits / branches / PRs / issues / test evidence.

Product HQ must not claim it read another ChatGPT thread unless that content was explicitly brought into the current conversation.

When GitHub contains enough evidence, Product HQ should not ask the owner to paste the specialist thread response.

## Fallback when a specialist cannot write GitHub

If a workstream genuinely cannot persist its result to GitHub, it must return one compact `HANDOFF` block containing:

- status
- result
- evidence available
- open decisions
- next action

Only in this fallback case should the owner need to copy that block back to Product HQ.

## Goal

The normal operating loop should be:

**Owner ↔ Product HQ → specialist executes → result is persisted to GitHub → Product HQ reads GitHub and continues.**

The owner should not become the manual message bus between AI workstreams.
