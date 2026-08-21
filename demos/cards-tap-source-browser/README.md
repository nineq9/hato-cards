# CARDS Tap → Source Browser experiment

Isolated owner-review prototype. Production CARDS is not modified.

## Hypothesis

CARDS becomes a finite selection surface instead of a long-form reading surface:

- card tap → open the original source in a full-screen Source Browser shell
- right-to-left swipe → NEXT and dismiss left
- left-to-right swipe → SAVE + advance and dismiss right
- no vertical article reading inside the card
- back from Source Browser → return to the exact same card
- queue exhausted → `CLEAR!`

The card itself carries enough context to decide whether to open the source: headline, summary, and key points.

## Web prototype limitation

This demo attempts to load the publisher URL in an iframe so the interaction can be tested. Many publishers intentionally block iframe embedding with CSP / X-Frame-Options. When that happens, use the explicit `ORIGINAL ↗` action. This is a browser limitation of the web prototype, not a proposal to copy publisher article text into KAWASEMI.

A native iOS implementation can evaluate an in-app browser surface separately after the interaction hypothesis is accepted.

## Review questions

1. Is tap-to-source easier to understand than vertical READ inside CARDS?
2. Do horizontal NEXT / SAVE gestures feel materially easier when vertical READ is removed?
3. Does the card contain enough information to decide whether the original article is worth opening?
4. Does returning from the source feel immediate enough to keep triage momentum?

## Scope

Experiment only. Do not update canonical `UX_RULES.md` or production interaction until Owner compares this branch with the current CARDS model and explicitly chooses it.
