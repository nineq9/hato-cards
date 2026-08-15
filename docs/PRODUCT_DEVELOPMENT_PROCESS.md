# KAWASEMI Product Development Process

This document defines how KAWASEMI is designed, prototyped, implemented, reviewed, and shipped.

The goal is to prevent three recurring problems:

1. design ideas being implemented before the experience is clear,
2. isolated fixes creating regressions elsewhere,
3. the product owner becoming the manual messenger between multiple AI workstreams.

## 1. Core operating model

Every meaningful feature follows this sequence:

**DESIGN → PROTOTYPE → BUILD → QA → DECISION LOG**

Do not skip stages unless the change is genuinely trivial.

### DESIGN

Purpose: decide what experience we actually want before code hardens the wrong idea.

Questions to answer:
- What user problem is this solving?
- What should the user understand or feel?
- How does this fit KAWASEMI's product principles?
- Does it conflict with existing gestures or navigation?
- What does success look like?

Output:
- UX direction
- information hierarchy
- interaction rules
- visual direction
- open decisions that genuinely require owner input

### PROTOTYPE

Purpose: make the idea touchable before integrating it into production.

A prototype is only complete when the owner can open a URL on a phone and interact with it.

Prototype completion means:
- direct URL opens the demo UI, not a GitHub code listing,
- no GitHub login is required,
- core interactions are touchable,
- production code is not unintentionally modified,
- the demo is clearly marked as non-production,
- known limitations are documented.

The purpose of the prototype is not code quality. It is to answer:
- Is this understandable?
- Is this pleasant to use?
- Is this the right direction?

### BUILD

Purpose: integrate an approved experience into the actual product.

Before implementation:
- read PRODUCT_PRINCIPLES.md,
- read UX_RULES.md,
- read QA_CHECKLIST.md,
- inspect the current implementation,
- identify shared code and regression risk.

Do not change an approved UX contract merely because another implementation is easier.

### QA

Purpose: confirm both technical correctness and human usability.

QA has two layers.

#### Mechanical QA

Automated checks for:
- state transitions,
- gesture thresholds,
- DOM structure,
- listener duplication,
- scroll restoration,
- responsive overflow,
- known regression cases.

#### Human-like QA

Browser automation and/or device review must follow the actual user journey.

It should include:
- realistic touch paths,
- imperfect diagonal gestures,
- top/middle/end article states,
- screenshots of important states,
- navigation recovery,
- tutorial comprehension,
- visual inspection,
- repeated actions.

A test suite saying PASS is not enough if the interface visibly feels broken or confusing.

### DECISION LOG

Once a meaningful product decision is accepted, document it in docs/DECISION_LOG.md.

This prevents future AI sessions from accidentally reversing approved decisions.

## 2. Definition of DONE

Do not say DONE merely because code was written.

For user-facing work, DONE requires:
- implementation exists,
- the intended path is reachable,
- relevant QA has run,
- failures are resolved or explicitly listed,
- the owner can access the result when owner review is required.

For prototypes, DONE specifically means there is a working preview URL that opens the actual demo.

## 3. Owner approval policy

Do not ask the owner to approve routine implementation choices.

Owner input is required mainly when:
- personal taste materially changes the result,
- a major product behavior is being fixed,
- cost is introduced,
- external publishing/sending/deletion is involved,
- the decision is hard to reverse,
- two options have meaningful tradeoffs with no clear winner.

Once the owner approves a direction, implementation details inside that direction should continue without repeated approval.

## 4. PM responsibility

Product HQ acts as product management.

Its job is to:
- maintain the current product picture,
- translate owner ideas into product decisions,
- protect product principles,
- sequence work,
- prevent premature implementation,
- reduce copy/paste coordination,
- determine when a specialist workstream is actually useful,
- keep GitHub documentation current,
- explain technical status in plain language,
- request owner decisions only when genuinely necessary.

The owner should not become the manual project manager for AI workstreams.

## 5. Workstream policy

Specialist workstreams such as Design, LIVE, DIVE, or AI/Data are optional work areas, not independent product owners.

They may explore or execute within their area, but important product decisions return to Product HQ.

Do not create additional workstreams unless separation clearly reduces complexity.

Default communication model:

**Owner ↔ Product HQ → Build / specialist only when useful**

## 6. Current priority rule

Do not integrate advanced features onto an unstable core.

Production priorities are:

1. stable CARDS reading and gestures,
2. coherent shared Design System,
3. production-quality Tutorial and Navigation,
4. source transparency / article information hierarchy,
5. real data / AI pipeline,
6. LIVE production integration,
7. DIVE production integration,
8. broader polish and source coverage.

LIVE and DIVE may be prototyped in parallel, but production integration waits until the interaction foundation is reliable.

## 7. Design workflow

Design is managed on two levels.

### Shared Design System

Define common product grammar first:
- typography,
- color roles,
- spacing,
- radius,
- surfaces,
- borders and lines,
- iconography,
- motion timing,
- source presentation,
- epistemic-state presentation,
- navigation language.

### Feature-specific design

Then design each experience using that shared grammar:
- CARDS,
- LIVE,
- DIVE,
- Tutorial / Opening,
- Menu / Saved / Likes / Settings.

Do not make each feature visually independent.

## 8. Status reporting

Product HQ should report status in plain language.

When useful, communicate:
- what is currently true,
- what is being worked on,
- what is blocked,
- what comes next,
- whether owner action is required.

Use these states accurately:
- RUNNING — work is genuinely executing,
- WAITING_EXTERNAL — waiting on an external system,
- REWORKING — a detected problem is actively being corrected,
- OWNER_ACTION_REQUIRED — owner input/action is genuinely necessary,
- BLOCKED — work cannot currently proceed,
- DONE — result and relevant verification are complete.

Do not use RUNNING or DONE aspirationally.

## 9. Current KAWASEMI track model

The product is managed through these tracks:

### Core / CARDS
Production foundation. Must become reliable first.

### Design System
Shared visual and motion language for the entire product.

### Navigation / Tutorial
Cross-product shell and first-run experience.

### LIVE
May prototype in parallel; production integration comes later.

### DIVE
May prototype in parallel; production integration comes later.

### AI / Data
Production pipeline follows stable product contracts; architecture may be explored earlier.

## 10. PM checkpoint before starting any substantial task

Before starting, answer internally:

1. Is this DESIGN, PROTOTYPE, BUILD, or QA?
2. What approved decision does it depend on?
3. What could it break?
4. Does the owner actually need to decide anything?
5. What observable output proves this stage is complete?

If those questions cannot be answered, the task is not ready to start.
