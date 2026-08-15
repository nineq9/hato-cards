# KAWASEMI Shared Design System

Status: v0.1 design grammar for the 5-day sprint

This document defines the shared visual and motion grammar for KAWASEMI before CARDS, LIVE, DIVE, Tutorial, and Menu are polished independently.

It is intentionally a system document, not a screen-redesign brief.

Canonical product constraints remain in `PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, `QA_CHECKLIST.md`, and the project docs. If a visual choice conflicts with those rules, the product/UX rule wins.

---

## 1. Design character

KAWASEMI should feel:

- intellectual,
- quiet,
- sharp,
- premium,
- editorial,
- minimal.

The interface should not advertise itself. Information is the protagonist.

Working principle:

> Quiet by default. Sharp on action.

A second useful test:

> The interface should look strongest while still, and motion should exist because something meaningful changed.

Preserve the current strengths:

- deep blue-green foundation,
- off-white text,
- restrained warm accent,
- text-first editorial hierarchy,
- continuous CARDS cover → reading flow,
- geometric kingfisher mark,
- restrained physical motion,
- source inspection without destroying context.

---

## 2. Typography hierarchy

### Typeface policy

For v0.1, prefer the native/system sans stack for reliability and Japanese legibility:

`-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Noto Sans JP", sans-serif`

Do not add a decorative display font merely to make KAWASEMI look editorial. Editorial character should first come from hierarchy, measure, spacing, weight, and rhythm.

Final branded typeface selection is an owner-taste decision and is not required to unblock the sprint.

### Roles

#### Display / story title
- Smartphone target: 28–36px depending on available width.
- Line-height: approximately 1.10–1.18.
- Weight: strong, but avoid ultra-black poster styling.
- Tight tracking is acceptable for large headlines.
- Prefer 2–4 strong lines over shrinking titles excessively.

#### Mode title
Examples: `LIVE TRACE`, `DIVE`.
- 26–34px.
- Used sparingly.
- Should identify the space, not dominate the information inside it.

#### Section heading
- 18–22px.
- Line-height approximately 1.25–1.4.
- Clear separation from body without needing a box.

#### Body
- 16–17px smartphone default.
- Line-height approximately 1.75–1.95 for long reading.
- Normal or medium weight.
- Comfortable text measure: roughly 34–42 Japanese/Latin-equivalent characters where layout permits.

#### Label / epistemic label / source label
Examples: `CONFIRMED`, `CLAIM`, `UNKNOWN`, `SOURCE`.
- 8.5–10px.
- Uppercase where appropriate.
- Letter-spacing approximately .10–.16em.
- Labels are structural signposts, not decorative badges.

#### Metadata
Examples: publication time, source type, signal time.
- 9–12px.
- Lower contrast than content, but still readable.
- Tabular numerals for times/counts where useful.

### Typography rules

- Do not use all caps for long sentences.
- Do not use bold everywhere to create hierarchy.
- Prefer whitespace before introducing extra colors or containers.
- Information category labels may be small; important uncertainty or attribution text must never be visually tiny.

---

## 3. Spacing scale

Use a 4px base rhythm.

Preferred scale:

- 4 — micro separation,
- 8 — close relationship,
- 12 — compact control/content spacing,
- 16 — default inner spacing,
- 20 — mobile side spacing where needed,
- 24 — section separation,
- 32 — strong section separation,
- 40 — major editorial pause,
- 48 — large transition,
- 64 — article-end / major breathing room.

Rules:

- Default smartphone page inset: 14–20px.
- Reading body should have more breathing room than dense utility lists.
- Prefer fewer large spacing decisions to many arbitrary margins.
- Touch targets may be visually minimal while maintaining at least a 44px interactive area.

---

## 4. Color roles

Current palette is the reference direction, not a requirement that every value remain forever unchanged.

### Foundation tokens

- `bg-deep`: `#081113` — main reading/app background.
- `bg-secondary`: around `#0c1719` — subtle depth change.
- `surface-1`: around `#111f22` — sheets / restrained raised surfaces.
- `surface-2`: around `#15272a` — limited secondary surface use.
- `text-primary`: `#f3f1ec` — warm off-white, not pure white.
- `text-secondary`: around `#c7cdca`.
- `text-muted`: around `#85918f`.
- `kingfisher-teal`: around `#118995` — brand/action identity.
- `kingfisher-teal-deep`: around `#0b5961`.
- `warm-neutral`: around `#bca98e` — editorial accent / fine rule / selected detail.
- `warm-alert`: around `#b87950` — highly restrained new/change signal.

### Color rules

- Deep teal/charcoal is atmosphere, not a neon effect.
- Warm accent should be rare enough that its appearance has meaning.
- Pure white should generally be avoided for large surfaces.
- Avoid gradients that exist only to make a control look expensive.
- The cover gradient is allowed because it connects image → readable title → reading background.

### Color is not truth

Never encode:

- green = true,
- red = false,
- blue = neutral.

Epistemic status must remain understandable in monochrome through wording and structure.

Color may add secondary emphasis but must not be the only carrier of meaning.

---

## 5. Surface and background roles

KAWASEMI should use a small number of surfaces.

### Base canvas
The deep background behind the primary experience.

### Reading surface
CARDS content should feel continuous rather than assembled from many nested cards. The cover can be a strong bounded object; the article body should become a calm reading plane.

### Raised utility surface
Use for:

- Source Sheet,
- menu drawer,
- focused contextual overlays.

Raised surfaces should be slightly separated by tone, border, and shadow; avoid frosted-glass SaaS styling as the default visual language.

### Scrim
Use a dark neutral scrim for modal context. The background remains perceptible enough that the user understands where they will return.

### Rule
Do not put every information unit inside a rounded rectangle. Use typography, rules, columns, indentation, and whitespace first.

---

## 6. Borders and lines

Lines should feel editorial rather than component-library-like.

- Standard divider: 1px at approximately 10–14% light contrast on dark backgrounds.
- Strong divider: approximately 16–20% contrast.
- Use borders to clarify structure, not to decorate every container.
- Prefer a single vertical or horizontal rule to a full outline where possible.
- DIVE relationship lines must be visually subordinate to node labels and must communicate typed relationships through labels or adjacent text, not line color alone.

---

## 7. Radius policy

Radius is allowed, but must not become the visual identity.

### Large brand surfaces
- CARDS cover: approximately 26–30px.
- Source Sheet top corners: approximately 24–28px.

### Standard utility surfaces
- approximately 12–18px.

### Compact controls
- approximately 8–14px where a container is necessary.

### Pills
Pills are reserved for genuinely categorical compact objects, such as optional tags or filters.

Do not use pills for:

- primary navigation,
- ordinary menu rows,
- every state label,
- every button.

If a screen starts to resemble a collection of SaaS chips, reduce containers.

---

## 8. Iconography and kingfisher mark

### Icons

- Simple geometric line icons.
- Approximate stroke weight: 1.25–1.6px at typical mobile sizes.
- Avoid mixed icon families.
- Avoid emoji as product UI icons.
- Avoid large colored icon circles for ordinary utilities.
- Important controls must retain a 44px+ target even if the visible icon is small.

### Kingfisher

The kingfisher is a brand symbol, not a mascot.

It should be:

- geometric,
- angular,
- simplified,
- fast/sharp in motion,
- emotionally restrained.

Avoid:

- eyes/facial expressions,
- cute poses,
- bouncing character behavior,
- speech-bubble mascot guidance,
- decorative birds repeated across ordinary screens.

The mark is most effective when used sparingly in opening, app identity, or subtle structural moments.

---

## 9. Image treatment

KAWASEMI is text-first. Photography supports understanding and atmosphere.

### CARDS cover

- Full-bleed image is acceptable.
- Slightly restrained saturation/contrast is preferred over vivid social-feed treatment.
- A deliberate dark gradient should carry the image into the article reading background.
- Title and summary must remain dominant.

### Editorial integrity

- Do not use an image that implies an unconfirmed claim is visually established fact.
- When a suitable image is unavailable, a restrained abstract/fallback surface is better than a misleading image.
- Avoid generic AI-generated “news illustration” aesthetics unless explicitly labeled and justified.

### LIVE / DIVE

Images are secondary unless they are themselves evidence/source material. LIVE should not become a thumbnail feed. DIVE should not use images merely to make nodes visually richer.

---

## 10. Source presentation

Source transparency is part of the core visual system, not footer metadata.

### Required source information where available

- source name,
- original title,
- publication time,
- source/claim attribution,
- original wording or clearly labeled excerpt when useful,
- explicit action to open the original material.

### Source Sheet grammar

- Open as a sheet/modal first.
- Preserve the current CARDS/LIVE/DIVE context behind it.
- Label `SOURCE` clearly.
- Source identity should appear before explanatory summary.
- External navigation must be explicit.
- Closing returns to the exact previous context/reading position.

Do not make source access look like a secondary legal footnote.

---

## 11. Epistemic-state presentation

KAWASEMI must visually separate what is confirmed, what someone claims, and what remains unknown without pretending that color can determine truth.

### CONFIRMED

Use:

- explicit `CONFIRMED` label,
- direct declarative wording,
- source/provenance where relevant,
- calm standard typography,
- optional solid fine rule.

Do not add celebratory green or checkmark-heavy treatment.

### CLAIM

Use:

- explicit `CLAIM` label,
- claimant/actor visible near the statement,
- phrasing such as “X says/claims…” rather than silently converting the statement into a fact,
- source access,
- optional attribution indentation or side rule.

The visual structure should make the speaker inseparable from the claim.

### UNKNOWN / UNVERIFIED

Use:

- explicit `UNKNOWN`, `UNVERIFIED`, or more precise wording,
- what is missing or what would confirm it,
- quieter but fully readable typography,
- optional open/segmented rule treatment.

Do not use warning-red by default.

### CONTRADICTION / competing claims

Do not merge conflicting claims into a single compromise sentence.

Present the actors/sources separately and explain the nature of the disagreement. Symmetry should reflect the information structure, not artificial “both sides” balance.

---

## 12. Motion system

Motion should feel intentional, physical, smooth, restrained, and fast enough not to delay reading.

### Timing bands

- Micro feedback: 120–180ms.
- Local state settle: 180–240ms.
- Sheet / drawer: 240–320ms.
- Main-mode transition: approximately 280–320ms.
- Opening/brand motion: exception; may be longer only on first run.

### Easing

Preferred family for physical settling:

`cubic-bezier(.2,.72,.18,1)`

A slightly sharper variant such as `cubic-bezier(.18,.78,.18,1)` is acceptable for sheets/actions.

Opacity changes should usually be linear or very gently eased.

Do not use spring/bounce libraries as the default motion language.

### Motion grammar

Use:

1. Observe — the interface follows the user's intent/finger.
2. Commit — threshold or action becomes clear.
3. Settle — the interface returns to a stable, quiet state.

Examples:

- NEXT: card follows finger → commits left → controlled exit → next card settles at top.
- SAVE: card follows finger right → save cue appears → commit → card returns to exact reading position.
- LIKE: small fill/scale response only.
- Source Sheet: rises as contextual layer; underlying reading position is preserved.
- Mode switch: content layer changes quietly while navigation remains stable.

### Avoid

- bounce,
- rubber-band theatrics,
- wobble,
- repeated pulse loops,
- glowing trails,
- decorative parallax that delays understanding,
- large route transitions for ordinary state changes.

### Reduced motion

Support `prefers-reduced-motion`. Reduced motion should preserve state clarity while removing large transforms/zoom/flight effects.

---

## 13. Editorial Dock grammar

Editorial Dock is the approved first-choice navigation direction for the current prototype.

### Main modes

Only:

- `CARDS`
- `LIVE`
- `DIVE`

SAVED, LIKES, HISTORY, and SETTINGS are utilities inside the hamburger menu, not main tabs.

### Visual grammar

- Persistent at the bottom of the three main modes.
- Text only by default.
- No icon + label pairing.
- No pill selection background.
- No floating rounded navigation capsule.
- No glow.
- Selected mode uses primary text plus a fine rule / subtle typographic emphasis.
- Unselected modes remain clearly readable but muted.
- Target height should support comfortable one-handed use; visual minimalism must not reduce the hit area below approximately 44px.
- Dock must never cover the article/source/content end; content layout reserves the necessary safe area.

### Transition grammar

Switching CARDS / LIVE / DIVE should feel like changing observation mode, not navigating to unrelated apps.

- approximately 300ms,
- no large lateral page-slide by default,
- navigation remains stationary,
- content can shift/fade by a few pixels only,
- preserve per-mode state where practical.

State to preserve includes:

- CARDS reading position,
- LIVE trace/cluster position,
- DIVE focus/visited node context.

### Hamburger menu

- Remains top-left.
- Menu utilities: SAVED / LIKES / HISTORY / SETTINGS.
- SAVED should evolve toward a Personal Archive, not a generic bookmark feed.
- Menu subviews retain a visible back affordance and the narrow left-edge → right return gesture where enabled.
- Edge gesture must not conflict with CARDS SAVE.

---

## 14. Shared grammar across CARDS / LIVE / DIVE

The three modes should not look identical. They should share a language.

### Shared across all three

- typography system,
- palette roles,
- source presentation,
- epistemic-state vocabulary,
- line/border language,
- icon family,
- motion easing/timing,
- Editorial Dock,
- safe-area/touch-target rules,
- uncertainty/provenance principles.

### CARDS — read

Character: edited, finite, calm.

- Article is the card/reading surface.
- Cover may be visually rich; body becomes text-first.
- Remaining count is visible but must not dominate the title.
- READ / NEXT / SAVE / LIKE interaction contract remains unchanged.
- Avoid turning article sections into a dashboard of status chips.

### LIVE — observe

Character: chronological, immediate, source-visible.

- Time and incoming change are structural elements.
- Signals/clusters should not become another card feed.
- Warm accent may indicate “new since last review” or live arrival, but not truth/confidence.
- Conflicting claims remain distinct.
- Raw/non-promoted signals remain inspectable.
- Motion is limited to meaningful arrival/change, not constant radar theatrics.

### DIVE — explore

Character: spatial, directional, user-controlled.

- Current focus is obvious.
- Show only a manageable number of next directions at once.
- Relationships are typed: evidence, claim, contradiction, context, history, technology, impact, etc.
- A historical similarity must never visually resemble evidence for the current event.
- Avoid a game skill-tree aesthetic, glowing network, or giant spider-web graph.
- Navigation trail/back and provenance remain available.

---

## 15. Tutorial and opening inheritance

### Tutorial

Tutorial uses the same interaction components/gesture logic as production where practical.

Design rules:

- short calm copy,
- real article interaction,
- no cartoon arrows covering the interface for long periods,
- no fake card that teaches gestures differently from production,
- teach value and motion together.

### Opening

Current direction:

- first run: Full Opening,
- normal app launch: Micro Opening,
- in-app return: no Opening.

Opening may be more expressive than ordinary product motion, but it must still avoid cute mascot behavior and must not make routine access feel slow.

---

## 16. Accessibility and mobile rules

- Primary design target: smartphone, especially iPhone/Safari-like touch behavior.
- Respect safe-area insets.
- Minimum important touch target: approximately 44×44px.
- Do not depend on hover.
- Do not depend on color alone for meaning.
- Text must remain readable without zoom.
- Fixed Dock/header must not obscure content.
- Support reduced motion.
- Modal/source states require clear dismiss and recoverable context.

---

## 17. Explicit anti-patterns

Do not drift toward:

- AI neon / cyan-purple glow,
- game HUD / skill-tree styling,
- glassmorphism as a default surface language,
- cute kingfisher mascot treatment,
- bouncy/rubbery motion,
- confetti or social-media reward effects,
- excessive pill/chip UI,
- giant icon buttons with colored circles,
- SaaS dashboard templates,
- generic news-app tab/feed visual language,
- endless-feed engagement cues,
- color-coded “truth scores”,
- unexplained AI certainty,
- excessive instructional copy.

---

## 18. Routine decisions fixed for v0.1

These do not require further owner approval before prototype implementation:

- shared deep blue-green / warm off-white palette roles,
- restrained warm accent,
- system sans stack for v0.1,
- 4px spacing rhythm,
- text-first hierarchy,
- limited radius policy,
- line-based editorial separation,
- source-sheet grammar,
- non-color-dependent epistemic presentation,
- restrained 120–320ms motion bands for ordinary UI,
- Editorial Dock with text-only CARDS / LIVE / DIVE,
- utilities inside hamburger menu,
- shared visual grammar but distinct mode layouts.

---

## 19. Owner-taste decisions still open

These should be reviewed through concrete touchable prototypes rather than abstract discussion:

1. Final branded typeface, if KAWASEMI moves beyond the system stack.
2. Exact headline weight/tracking personality.
3. Exact card/sheet corner-radius character within the approved restrained policy.
4. Exact teal/warm-accent saturation after real-phone visual review.
5. Final geometric kingfisher mark proportions and opening choreography.
6. Final degree of photographic darkness/texture on CARDS covers.
7. Exact Editorial Dock proportions (height, rule length, letter spacing) after one-handed testing.

These are taste refinements, not blockers for Day 1 design-system completion.

---

## 20. Implementation discipline

When implementing from this design system:

1. reuse shared tokens/components rather than screen-specific approximations,
2. preserve the existing READ / NEXT / SAVE / LIKE contract,
3. verify menu edge-swipe conflict with SAVE,
4. keep factual/claim/unknown distinctions intact,
5. test at iPhone-like portrait width,
6. report interaction QA as PASS / FAIL / NOT TESTED using `QA_CHECKLIST.md`,
7. do not claim visual polish is finished merely because the tokens exist.

This document is the baseline grammar for subsequent sprint design work. Screen-specific decisions may extend it, but should not silently contradict it.
