# KAWASEMI Design System

Status: **v1 owner-confirmed direction — light + dark modes**

This document defines the visual design baseline for KAWASEMI across light and dark modes.

Canonical product/UX constraints remain in `PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, `QA_CHECKLIST.md`, and the project docs. If a visual choice conflicts with those rules, product/UX rules win.

---

## 1. Core design principle

> **Less interface, more experience.**

Primary rule:

> Remove what can be removed, but never remove usability.

KAWASEMI should feel:

- quiet,
- intellectual,
- precise,
- premium,
- trustworthy,
- intuitive.

Do not pursue minimalism as an aesthetic target by itself. The purpose is to let the user focus on:

- reading an article,
- seeing the next article,
- saving,
- observing LIVE,
- going deeper through DIVE.

Use these principles:

- clarity — the next action is understandable,
- simplicity — unnecessary UI is absent,
- consistency — the same kind of action behaves the same way,
- familiarity — use known symbols where possible,
- hierarchy — important information naturally wins attention,
- restraint — UI does not compete with content.

A useful design test for every element:

> If this disappears, will the user lose understanding, control, accessibility, location, feedback, or a way back?

If not, remove it.

KAWASEMI's distinctiveness should come from the CARDS / LIVE / DIVE experiences, not from strange UI conventions or loud branding.

---

## 2. Theme model

KAWASEMI supports both a light and dark visual direction using the same information hierarchy, interaction grammar, icon system, spacing, typography logic, and motion language.

The modes should feel like the same product, not two separate designs.

### Light mode

Base direction:

- white,
- off-white,
- very light gray,
- black through charcoal typography,
- one strong kingfisher blue-green accent.

### Dark mode

Base direction:

- deep charcoal / blue-black background,
- soft white typography,
- restrained kingfisher teal accent,
- subtle tonal surface differences rather than obvious boxes,
- photography fading naturally into the reading surface.

Dark mode must not become:

- neon,
- cyberpunk,
- blue-purple AI styling,
- glowing HUD/network UI.

### Shared color rule

Color exists to communicate:

- current location,
- selection,
- meaningful action,
- limited state feedback.

Do not use many accent colors in one screen.

Color is not truth. Confirmed / claim / unknown must remain understandable in monochrome through wording, attribution, and structure.

---

## 3. Content-first hierarchy

The visual priority should be:

1. article / information itself,
2. headline,
3. summary / body,
4. necessary metadata and source information,
5. UI.

KAWASEMI branding and navigation must not visually outrank the article.

Do not create large areas whose primary purpose is to display the app name.

---

## 4. KAWASEMI logotype and brand presence

Do not display a large `KAWASEMI` wordmark at the top of ordinary product screens.

The user already knows which app is open.

The wordmark may appear in:

- launch / opening contexts,
- product identity contexts,
- rare brand moments.

A small kingfisher symbol may be used where it earns its place, but it is optional.

Brand should primarily be felt through:

- typography,
- kingfisher teal,
- spacing,
- motion,
- card behavior,
- image treatment,
- interaction quality.

The kingfisher remains a geometric brand mark, not a mascot.

---

## 5. Typography

Typography is a primary visual element.

### Headline

Large headlines may use a refined serif where it improves editorial character.

Headlines should feel elegant rather than promotional or loud.

### UI / metadata

Use a highly readable sans-serif for:

- UI,
- timestamps,
- metadata,
- utility labels,
- source information.

### Hierarchy

At a glance, the user should understand:

1. headline,
2. summary,
3. source / time / metadata.

Do not rely on bold alone. Use:

- size,
- spacing,
- contrast,
- tone,
- line length.

Avoid excessive bold.

Typeface selection must preserve Japanese legibility and performance on target iPhones.

---

## 6. Photography

Large photography is allowed, but the UI must still work without a beautiful image.

Rules:

- avoid over-saturated photography,
- use a natural dark gradient when needed for title legibility,
- make image → headline → body feel like one continuous article,
- do not use misleading imagery that implies an unconfirmed claim is established fact.

When no suitable image exists, prefer a restrained fallback surface over generic or misleading imagery.

Dark mode may use a deeper image-to-charcoal fade; the purpose is continuity and readability, not spectacle.

---

## 7. Icon system

Icons should communicate using the minimum necessary geometry.

Required qualities:

- thin but confident,
- simple,
- familiar,
- monochrome by default,
- consistent stroke width,
- no decorative detail,
- no unnecessary circular containers,
- no playful styling,
- no custom symbol when a familiar symbol already exists.

Do not confuse “simpler” with “extremely thin”. Icons must remain readable and modern.

Use conventional symbols where possible for:

- back,
- save,
- like,
- search,
- menu,
- close.

Visible glyphs can be visually small while maintaining comfortable touch targets.

---

## 8. Text labels and discoverability

Remove labels when the icon or structure is already unambiguous.

But do not remove text merely because an icon-only layout looks cleaner.

Before removing a label, verify:

- a first-time user can understand the action,
- accessibility remains acceptable,
- the user can identify current location,
- the system provides adequate feedback.

Onboarding or first-use guidance may temporarily explain unfamiliar interactions; routine use should become quieter after the interaction is learned.

### Main navigation labels

`CARDS / LIVE / DIVE` remain the canonical mode names.

An icon-only bottom-navigation variant may be prototyped, but it is **not automatically approved** simply because it is more minimal.

It may replace persistent text only if prototype testing shows that:

- each icon is understandable without guesswork,
- the current mode remains obvious,
- accessibility remains sound,
- the design does not create a learning burden.

Until that is demonstrated, text labels remain a valid and safer implementation.

---

## 9. Bottom navigation

Main modes only:

- CARDS,
- LIVE,
- DIVE.

Utilities such as SAVED / LIKES / HISTORY / SETTINGS remain outside the main navigation.

The bottom navigation should be quiet and structurally simple.

Avoid:

- large selected backgrounds,
- colorful pills,
- floating rounded capsules,
- glow,
- decorative motion,
- oversized branding.

Selected state should use minimal emphasis such as:

- a restrained kingfisher-teal shift,
- subtle typographic emphasis,
- a fine rule when useful.

If an icon system is prototyped:

- CARDS should suggest one article/card using minimal geometry,
- LIVE should suggest current/incoming activity using minimal familiar geometry,
- DIVE should suggest depth/exploration without becoming a custom puzzle icon.

Do not make these symbols complex merely to make them unique.

---

## 10. Radius, cards, surfaces, and lines

Rounded corners are allowed and should feel elegant rather than soft or cute.

Rules:

- avoid excessive radius,
- avoid rounded box inside rounded box repeatedly,
- prefer whitespace, tone differences, and very light rules over shadows,
- keep shadows very weak when used,
- avoid unnecessary borders and dividers.

Every visible line must have a structural reason.

Dark mode should use subtle tonal separation rather than obvious card outlines.

---

## 11. Buttons and controls

A button should look like a button only when it genuinely needs to read as an explicit action.

Rules:

- no meaningless arrows,
- no icon if text alone is clearer,
- no flashy gradient CTA,
- no giant colored button by default,
- no excessive pill controls,
- no redundant action controls when the gesture already owns the interaction.

---

## 12. Gesture-first CARDS experience

Core interaction contract:

- vertical scroll = READ,
- right-to-left swipe = NEXT,
- left-to-right swipe = SAVE,
- article-end heart = LIKE.

Do not permanently display large NEXT or SAVE controls just to make gestures visible.

But do not make gestures undiscoverable.

The first-run experience should teach these operations through real interaction. Once learned, instruction UI should disappear or become non-intrusive.

Subtle physical cues are allowed, including:

- slight visibility of a background card,
- restrained drag-follow movement,
- action feedback at commitment threshold.

Do not use:

- large directional arrows,
- persistent `SWIPE` labels,
- decorative gesture diagrams on the normal reading screen.

---

## 13. Information density

Do not reduce information too aggressively.

`Minimal` must not mean empty or sparse.

A serious news product should expose enough useful context while making the current priority obvious.

Use:

- hierarchy,
- spacing,
- alignment,
- typography,
- restrained rules,

before adding another container or visual element.

---

## 14. CARDS / LIVE / DIVE application

### CARDS — read

- one article at a time,
- continuous cover → body reading,
- article and headline dominate the screen,
- UI remains subordinate,
- READ / NEXT / SAVE / LIKE interaction contract remains stable.

### LIVE — observe

- chronological and source-visible,
- current change is structural,
- not another generic vertical news feed,
- conflicting claims remain separate,
- raw/non-promoted material remains inspectable.

Avoid making LIVE look like a dashboard just because it handles many signals.

### DIVE — explore

- spatial, directional, user-controlled,
- current focus is obvious,
- typed relationships remain understandable,
- avoid game-tree/network-demo aesthetics,
- no neon nodes or glowing graph effects.

DIVE can feel distinct without abandoning the shared KAWASEMI visual grammar.

---

## 15. Motion

Motion should explain state change, not decorate the interface.

Working grammar:

1. Observe — UI follows intent,
2. Commit — action threshold becomes clear,
3. Settle — UI becomes quiet again.

Use short, restrained transitions for normal UI.

Avoid:

- bounce,
- rubber-band theatrics,
- wobble,
- looping pulse,
- glowing trails,
- dramatic transitions for routine navigation.

LIKE may use a small fill / scale response. SAVE and NEXT may use physical card movement because the movement explains the result.

Support reduced motion.

---

## 16. Source and truth-state presentation

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

Competing claims should remain separately attributed rather than collapsed into one artificial compromise sentence.

Use words and structure before color.

---

## 17. Explicit anti-patterns

Avoid:

- large app-name branding,
- unnecessary labels,
- decorative icons,
- redundant arrows,
- unnecessary borders,
- excessive dividers,
- unnecessary buttons,
- colored icon containers,
- excessive rounded boxes,
- thick/playful icons,
- lines so thin they lose legibility,
- flashy gradients,
- neon,
- vivid blue-purple AI styling,
- generic AI-template UI,
- Dribbble-first fictional-app styling,
- glass-heavy SaaS surfaces,
- cute/mascot kingfisher treatment,
- game-like DIVE graphs,
- strange interactions whose meaning is unclear,
- screens that succeed only because the photography is attractive,
- minimalism that makes navigation harder.

---

## 18. Theme-specific visual direction

### Light mode

- white / off-white / light-gray foundation,
- refined editorial tone,
- strong black/charcoal typography,
- kingfisher teal used sparingly,
- larger photography permitted,
- classic and calm rather than visibly digital/AI-styled.

### Dark mode

Maintain:

- deep charcoal / blue-black background,
- soft white typography,
- restrained kingfisher teal accent,
- editorial type,
- generous spacing,
- one main article card,
- subtle image gradient,
- elegant rounded corners,
- clear information hierarchy.

Dark mode refinement priority:

> Remove every visible element that cannot explain why it exists, while preserving discoverability, accessibility, feedback, current location, and a clear way back.

Target feeling:

- the user barely notices the interface,
- attention stays on the news,
- operations feel natural rather than learned through labels,
- the product feels quiet, precise, and premium.

---

## 19. Validation rule

This document defines the shared grammar, not final approval of each screen.

Feature work should produce concrete, touchable screens using both theme directions where relevant.

Owner review should happen against real screens and real interactions rather than abstract token discussions wherever possible.

For any proposed removal of text, navigation cues, or controls, validate comprehension and usability before considering the removal final.
