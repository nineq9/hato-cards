# KAWASEMI Design System

Status: **v1 owner-confirmed direction**

This document defines the visual design baseline for KAWASEMI. It supersedes the earlier dark-first v0.1 grammar where there is a conflict.

Canonical product/UX constraints remain in `PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, `QA_CHECKLIST.md`, and the project docs. If a visual choice conflicts with those rules, product/UX rules win.

---

## 1. Overall character

Prioritize:

- quiet,
- intellectual,
- premium,
- trustworthy.

Do not aim for:

- futuristic,
- obviously AI-styled,
- flashy/cool for its own sake.

A slightly orthodox interface is acceptable if the details are highly finished.

KAWASEMI's distinctiveness should come from the CARDS / LIVE / DIVE experiences, not from strange UI conventions.

Working principle:

> Information first. Quiet interface. High finish.

---

## 2. Color

### Base

Use primarily:

- white,
- off-white,
- very light gray.

Use black through charcoal for:

- text,
- image overlays,
- natural image-to-text gradients.

### Brand color

Use one strong kingfisher blue-green / teal as the principal brand color.

Use color to communicate:

- current location,
- selected state,
- important action.

Do not fill a screen with many accent colors.

### Gradients

Gradients are allowed when they serve structure, especially to connect photography and readable text.

Do not use gradients merely to make controls look impressive.

### Epistemic rule

Color is not truth.

Do not encode confirmed/claim/unknown using green=true or red=false. Wording, attribution, and structure must carry the meaning even in monochrome.

---

## 3. Typography

Typography is a primary visual element.

### Headline

Large headlines may use a refined serif family where it improves the editorial character.

The headline should feel elegant, not like advertising copy shouting for attention.

### UI / metadata

Use a highly readable sans-serif for:

- UI,
- categories,
- timestamps,
- metadata,
- utility labels.

### Hierarchy

The user should understand this hierarchy at a glance:

1. headline,
2. summary,
3. source / time / metadata.

Do not rely on bold weight alone. Use size, spacing, tone, and contrast.

Avoid excessive bold.

### Implementation note

Typeface selection must preserve Japanese legibility and performance. A branded serif/sans pairing should be validated on real target screens before being locked.

---

## 4. Photography

Large photography is allowed.

But the screen must not depend on photography alone to look good.

Rules:

- avoid over-saturated imagery,
- use a natural dark gradient near the title when needed for legibility,
- make image → headline → article body feel like one continuous article,
- do not use misleading imagery that visually implies an unconfirmed claim is established fact.

When no suitable image exists, a restrained fallback surface is preferable to a generic or misleading image.

---

## 5. Icons

Use conventional symbols for common actions such as:

- back,
- save,
- like,
- search.

Do not invent custom symbols when they make the meaning less obvious.

Style:

- slightly thin strokes,
- not so thin that legibility suffers,
- consistent icon family.

Avoid:

- many colored circular icons,
- thick/pop icon styles,
- unnecessary circular icon backgrounds.

Visible icons may be visually light while keeping comfortable touch targets.

---

## 6. Radius and cards

Rounded corners are part of KAWASEMI's visual grammar.

But:

- not excessively rounded,
- not overly soft/cute,
- do not nest rounded box inside rounded box repeatedly.

Prefer card separation through:

- whitespace,
- subtle background difference,
- very light rules.

Use shadows sparingly and weakly.

Radius is a supporting detail, not the product identity.

---

## 7. Buttons and controls

A button should look like a button only when it is genuinely actionable.

Rules:

- do not add meaningless arrows,
- if text alone is clear, do not add an icon,
- no flashy gradient CTAs,
- a primary action does not automatically require a giant colored button,
- avoid turning every interaction into a pill.

---

## 8. Information density

Do not reduce information too aggressively.

`Minimal` must not mean empty or sparse.

A news/information product must expose enough useful context while making one current priority obvious.

Use:

- typography,
- spacing,
- alignment,
- restrained rules,

before adding extra containers or decoration.

---

## 9. KAWASEMI-specific application

### Navigation

Do not copy news-site category tabs such as `TOP STORIES / LATEST / JAPAN...` into the main product shell.

Main navigation is:

- `CARDS`
- `LIVE`
- `DIVE`

The bottom navigation should remain visually quiet, inspired by refined editorial products rather than generic mobile-tab chrome.

`SAVED / LIKES / HISTORY / SETTINGS` are utilities, not main modes.

### CARDS

CARDS focuses on one article at a time.

The article card is not merely a cover that opens a separate detail screen. The user continues vertically from the cover into the article body.

Interaction contract:

- vertical = READ,
- left = NEXT,
- right = SAVE,
- article-end heart = LIKE.

The design should subtly suggest horizontal card movement without instruction-heavy UI.

Allowed cues include:

- a very small glimpse of the next card behind,
- tiny physical response during touch/drag.

Do not use:

- large swipe arrows,
- `SWIPE` labels,
- tutorial-like controls permanently on the reading screen.

### LIVE

LIVE should share KAWASEMI typography, color, icon and information language, but must not become a generic vertical `LATEST NEWS` feed.

Chronology, source identity, incoming change and event grouping are its core structure.

### DIVE

DIVE should share the same design language while remaining spatial and exploratory.

Avoid neon knowledge graphs, game skill trees, glowing nodes or visual effects that make the interface look like an AI demo.

---

## 10. Motion

Motion should support meaning rather than decorate the interface.

Working grammar:

1. Observe — UI follows user intent,
2. Commit — action threshold becomes clear,
3. Settle — UI returns to a stable state.

Use short, restrained transitions for normal UI.

Avoid:

- bounce,
- rubber-band theatrics,
- wobble,
- looping pulse,
- neon/glowing trails,
- dramatic transition for routine navigation.

LIKE may use a small fill / scale response. SAVE and NEXT may use physical card movement because that movement explains the action.

Support reduced-motion behavior.

---

## 11. Source and truth-state presentation

Source transparency is a primary information element, not a legal footer.

Where available, expose:

- source name,
- original title,
- publication time,
- claimant / attribution,
- original source action.

For information states, use explicit language such as:

- `CONFIRMED`,
- `CLAIM`,
- `UNKNOWN` / `UNVERIFIED`.

Competing claims should remain separately attributed instead of being collapsed into one artificial compromise sentence.

---

## 12. Explicit anti-patterns

Avoid:

- colorful category-button rows,
- many colored circular icons,
- neon,
- vivid blue-purple gradients,
- every element being a rounded card,
- unnecessary shadows,
- lines so thin they lose legibility,
- thick/pop icons,
- Dribbble-first fictional-app styling,
- generic “AI-generated SaaS” styling,
- strange operations whose meaning is unclear,
- screens that succeed only because the photography is attractive,
- glass-heavy SaaS surfaces,
- cute/mascot kingfisher treatment,
- game-like DIVE graphs.

---

## 13. What changed from the earlier v0.1 grammar

The following owner-confirmed direction overrides earlier assumptions:

- default foundation shifts from dark/deep-teal-first toward white / off-white / light-gray-first,
- a refined serif headline treatment is now explicitly welcomed,
- photography may be larger while remaining subordinate to information hierarchy,
- conventional UI symbols are preferred over custom icon invention,
- overall target is more classic/editorial and less visibly digital/AI-styled.

Dark/charcoal may still be used for text, overlays, article image gradients, selected contextual surfaces, or future dark-theme work; it is no longer the default visual identity for v1.

---

## 14. Validation rule

This document defines the design grammar, not final screen-by-screen approval.

Feature work should now produce concrete, touchable screens using this system. Owner feedback should be captured from real prototypes/screens rather than abstract token discussions wherever possible.
