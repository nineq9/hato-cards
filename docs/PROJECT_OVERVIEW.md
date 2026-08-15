# KAWASEMI Project Overview

## 1. What KAWASEMI is

KAWASEMI is an information-monitoring and understanding tool designed first around the needs of a journalist who must track a large volume of information without missing important developments.

The project began from a concrete problem:

- important information is scattered across many sources,
- the same event may be reported repeatedly,
- different actors may describe the same event differently,
- a human cannot manually read everything,
- ordinary recommendation systems can create information bubbles,
- AI summaries can sound more certain or neutral than the underlying evidence justifies.

KAWASEMI aims to reduce the repetitive work of information monitoring while preserving human judgment.

## 2. Product promise

KAWASEMI should help the user answer four different questions:

### CARDS — What do I need to check?
A finite queue of information the user needs to review.

### LIVE — What is happening right now?
A more immediate observation layer showing new incoming information and source activity.

### DIVE — What does this connect to?
A user-directed knowledge exploration space for evidence, claims, context, history, technology, economics, politics, and related concepts.

### SAVED — What do I want to keep?
A deliberate personal archive.

## 3. Core philosophy

KAWASEMI should not tell the user what to believe.

It should help the user see:

- what is directly observed or strongly confirmed,
- who is making a claim,
- what evidence is being used,
- what contradicts or complicates that claim,
- what is background rather than evidence,
- what remains unknown.

The product should expose uncertainty instead of hiding it behind a confident AI answer.

## 4. Personalization philosophy

Personalization should primarily learn broad topics and practical monitoring needs, not ideological alignment.

Good examples:
- Ukraine military developments
- Japanese politics
- energy prices
- natural disasters
- military technology

Avoid:
- inferring that a user is pro- or anti- a political side and then feeding confirming material,
- interpreting every skip as ideological rejection,
- optimizing only for engagement.

A user may not know in advance what information they need, so KAWASEMI should also preserve exposure to important developments outside habitual interests.

## 5. AI's role

AI may:
- collect,
- extract structured information,
- deduplicate,
- cluster likely reports of the same event,
- separate claims by source,
- summarize source material,
- identify what changed since the user's previous review,
- generate navigable knowledge structure for DIVE.

AI should not silently:
- decide that one disputed narrative is the truth,
- merge conflicting claims into a single factual statement,
- hide excluded information permanently,
- use related historical events as evidence for a current event,
- optimize the information environment around the user's ideology.

## 6. UX philosophy

The interface should reduce friction and explanation.

The core reading model is:

- vertical scroll = READ
- right-to-left swipe = NEXT
- left-to-right swipe = SAVE
- heart at the end = LIKE

The article card is the reading surface itself. There should be no awkward transition into a separate detail page just to continue reading.

The visual language should be:
- premium
- editorial
- dark / deep teal based
- text-first
- high contrast
- minimal
- restrained motion
- kingfisher-inspired but not cute or mascot-like

## 7. Brand direction

The kingfisher represents:
- sharp observation,
- speed,
- selective attention,
- diving beneath the surface,
- finding something valuable in a large information environment.

The visual mark should be geometric, angular, simplified, and not character-like.

Primary color direction:
- vivid kingfisher blue / turquoise / teal
- deep blue-green charcoal backgrounds
- orange only as a very limited accent

## 8. What KAWASEMI is not

KAWASEMI is not intended to be:
- an endless generic news feed,
- a social network,
- an ideological recommendation engine,
- an AI that declares truth without showing how it knows,
- a collection of disconnected experimental features.

Every feature should support monitoring, understanding, source inspection, exploration, or deliberate saving.

## 9. Near-term target

Build a working product where a real user can:

1. receive real information,
2. review a finite queue,
3. read the full article continuously inside a card,
4. NEXT / SAVE / LIKE reliably,
5. inspect sources,
6. see incoming information in LIVE,
7. enter DIVE from a real topic and explore multiple directions,
8. understand why information was surfaced,
9. reach a caught-up state without losing access to raw information.

## 10. Future ideas not required for the current core

Potential future products or extensions include:
- personal value / worldview mapping,
- historical figures and source-grounded simulated dialogue,
- linking personal value logs to historical ideas and outcomes,
- broader personal knowledge maps.

These ideas should not be added to the main product until the core KAWASEMI workflow is coherent and stable.
