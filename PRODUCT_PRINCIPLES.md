# KAWASEMI Product Principles

KAWASEMI is not just a news reader. It is a tool for helping people observe the world, verify what they know, understand context, and make their own judgments without losing important information.

## 1. Do not decide what the user should believe

KAWASEMI must not present an AI-generated conclusion as "the truth" when the underlying evidence is uncertain, disputed, or incomplete.

Separate clearly:
- confirmed facts
- claims by specific actors
- interpretations
- predictions
- opinions / value judgments
- unknown or unverified information

If the evidence is insufficient, say that it is insufficient.

## 2. AI is an organizer, not a hidden gatekeeper

AI may help collect, deduplicate, group, summarize, label, and structure information, but it must not silently turn editorial judgment into fact.

Whenever AI selection affects what the user sees, the reason should be explainable.

Whenever practical, excluded or raw information should remain inspectable rather than disappearing permanently.

## 3. Personalize topics, not viewpoints

KAWASEMI may learn broad interests such as:
- Japanese politics
- Ukraine
- military technology
- energy prices
- natural disasters

Do not personalize toward a political or ideological viewpoint merely because the user repeatedly agrees with one side.

A skipped article must not automatically mean ideological disagreement.

## 4. Preserve important information outside the user's usual interests

A user does not always know in advance what they need to know.

The product should balance:
- topics the user explicitly follows
- information required by the user's role or monitoring goals
- significant developments outside those usual interests

Do not create a closed information bubble.

## 5. Relevance is not evidence

A historically similar event is not evidence that the current event happened in the same way.

DIVE and related-information features must distinguish relationship types, for example:
- evidence for this event
- claim by a party
- contradiction / counterevidence
- background context
- historical similarity
- technical context
- economic impact

Do not present all links as generic "related" recommendations.

## 6. Let the user choose the direction of deeper exploration

DIVE should not primarily say "AI recommends you read this next."

Instead, it should offer understandable directions such as:
- evidence
- claims
- what is confirmed
- what is unknown
- background
- history
- technology
- economic impact
- political context

The user chooses where to go next.

## 7. Sources must remain visible and reachable

The user should be able to understand where a claim came from.

Whenever possible, preserve:
- source name
- original title
- publication time
- original wording or a clearly labeled excerpt
- link to the original material

A summary must never hide the existence of conflicting sources.

## 8. Completion matters

CARDS exists partly to solve information overload.

The user should be able to reach a meaningful "caught up" state for the set of information they are expected to review.

Do not turn the core monitoring workflow into an endless feed.

DIVE can be open-ended; required review should be finite and auditable.

## 9. Reduce friction, not human judgment

KAWASEMI should remove repetitive work:
- duplicate checking
- source gathering
- formatting
- grouping
- remembering what was already seen

It should not remove the human responsibility to judge uncertain information.

## 10. Design should support calm, focused understanding

The interface should feel premium, quiet, direct, and deliberate.

Avoid:
- excessive explanation
- visual clutter
- gamification that overwhelms information
- manipulative engagement loops
- unnecessary page transitions

The goal is not to keep the user inside forever. The goal is to help the user understand what matters and then return to life or work.

## 11. When in doubt, expose uncertainty

Prefer:
- "unverified"
- "source A claims"
- "independently confirmed by ..."
- "not enough evidence yet"

over false certainty.

## 12. Product decisions must be explainable

Any future feature involving ranking, filtering, recommendation, clustering, or importance scoring must be checked against these principles before implementation.
