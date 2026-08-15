# KAWASEMI UI/UX Baseline

Status: **mandatory baseline for production UI/UX and QA**

This document defines the minimum interaction and accessibility quality KAWASEMI must meet before a screen can be treated as production-ready.

It does **not** define KAWASEMI's product identity. Product identity remains in `PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, and `docs/DESIGN_SYSTEM.md`.

The baseline translates established platform guidance into KAWASEMI-specific rules so we do not repeatedly rediscover basic mobile UI/UX constraints through bugs.

## Source priority

When sources disagree, use this order:

1. KAWASEMI canonical product rules (`PRODUCT_PRINCIPLES.md`, `UX_RULES.md`, `docs/DESIGN_SYSTEM.md`)
2. Official Apple Human Interface Guidelines and Apple Design Resources for iPhone behavior
3. WCAG / accessibility guidance as reflected in GitHub Primer's mobile checklist
4. Third-party AI-ready design-rule repositories only as review aids, never as the source of truth

Reference material:

- Apple Human Interface Guidelines — Accessibility, Gestures, Motion, Designing for iOS, Buttons
- Apple Design Resources — current iOS UI kits, symbols, typography references
- GitHub Primer — Mobile Accessibility Checklist
- `ehmo/platform-design-skills` — useful AI-readable index of platform rules; secondary only
- `dickwu/apple-design-skill` — useful UI review methodology; secondary only

---

## 1. The UI must never make the user fight the phone

KAWASEMI should feel native to the way people already use an iPhone even when the product interaction itself is distinctive.

Use familiar platform behavior for:

- tapping,
- scrolling,
- back / dismiss,
- sheets and overlays,
- focus,
- safe areas,
- text scaling,
- reduced motion,
- accessibility labels.

Create custom interaction only where it is part of KAWASEMI's product value.

Custom interaction must not break expected system behavior.

---

## 2. Touch targets

Every important tappable control must have a hit area of at least **44 × 44 pt** on iPhone, even if the visible icon is smaller.

For adjacent small controls, keep enough separation to reduce accidental taps. Use **8 pt as a preferred minimum spacing target** where the layout permits.

Apply this to:

- hamburger menu,
- close,
- back,
- source,
- LIKE heart,
- Bottom Navigation items,
- menu rows,
- settings controls,
- any icon-only button.

The visible glyph may remain visually restrained. The invisible hit target must still be comfortable.

Full menu rows should be tappable, not just their text or icon.

Every custom button must visibly respond to touch so the user never wonders whether it registered.

---

## 3. Gesture hierarchy

KAWASEMI keeps its canonical CARDS gestures:

- vertical = READ,
- right-to-left = NEXT,
- left-to-right = SAVE,
- article-end heart = LIKE.

But the gesture system must obey these platform-quality rules:

1. Do not commit an action on the first tiny movement.
2. Allow natural finger wobble before deciding direction.
3. Prefer vertical READ when the user's overall movement clearly represents reading.
4. Lock direction only after enough evidence exists.
5. After lock, do not change axes during the same gesture.
6. An incomplete horizontal gesture must cancel safely and settle back.
7. Trigger irreversible/committing gesture actions only after the commitment threshold, not on touch-down.
8. Repeated or interrupted gestures must never leave stale transforms, locks, or action state.

### Human imperfection is part of the specification

QA must include diagonal, hesitant, slow, fast, interrupted, and repeated gestures.

A gesture implementation that works only with mathematically clean swipes is broken.

---

## 4. Custom gestures must not trap accessibility users

The normal KAWASEMI reading screen remains gesture-first; we do **not** add permanent large NEXT/SAVE buttons merely to satisfy a generic checklist.

However, core outcomes must have an accessible non-gesture path for people who cannot reliably perform swipes.

Production implementation must expose equivalent actions through the appropriate accessibility layer and/or a clearly reachable alternative action surface, including:

- NEXT,
- SAVE,
- dismiss/back,
- any future drag-only DIVE action.

The alternative may be quieter than the primary interface, but it must exist and be operable without performing the custom gesture.

Do not count tutorial instruction as an accessibility alternative.

---

## 5. System edge gestures win

Do not create custom interactions that broadly occupy system gesture territory.

KAWASEMI-specific rule:

- menu edge-swipe may start only from a narrow intentional left-edge zone,
- SAVE must not steal the system/back edge interaction,
- the menu edge gesture must not make ordinary article SAVE unreliable,
- DIVE drag interactions must not block normal page scrolling or system navigation.

If a custom gesture and a system gesture repeatedly compete, redesign the custom gesture boundary instead of increasing sensitivity.

---

## 6. Back and dismiss must be obvious and consistent

No view may become a dead end.

For every screen, sheet, overlay, menu subview, LIVE detail, or DIVE node view, define before implementation:

- how to go deeper,
- how to go back one level,
- how to dismiss,
- what state is restored afterward.

Rules:

- familiar Back/Close symbols should behave conventionally,
- a shortcut swipe may supplement a Back control but should not silently replace every accessible path,
- closing a modal/sheet returns focus and context to a logical place,
- article reading position must be restored exactly where the product contract requires it,
- browser/system Back must not destroy state unexpectedly.

---

## 7. Reading position is product state

For CARDS, the current article and current scroll position are not disposable visual details; they are user state.

Opening and closing secondary UI must preserve reading context unless the user explicitly advances:

- source sheet,
- hamburger menu,
- settings/utilities where the product contract says return to article,
- theme changes,
- temporary overlays.

NEXT is the explicit operation that changes the active article and resets the new article to scroll position 0.

SAVE must not silently navigate away or reset reading position.

---

## 8. Safe areas and one-handed ergonomics

Important controls must not sit under or too close to:

- the iPhone home indicator,
- browser chrome,
- notches / Dynamic Island areas,
- screen corners where the target becomes difficult to reach or distinguish.

Primary frequent controls should favor comfortable thumb reach when this does not damage content hierarchy.

Bottom Navigation must include safe-area spacing and must never cover the end of an article.

Test small and large iPhone-like portrait sizes; do not optimize only for one viewport.

---

## 9. Typography must survive real user settings

KAWASEMI is text-first, so readable typography is a functional requirement.

Rules:

- body text must be comfortably readable without zooming,
- important content must wrap/reflow instead of being silently truncated,
- Japanese text must be tested with real line lengths and punctuation,
- increased text size must not overlap controls or make critical content unreachable,
- visual hierarchy must not depend only on font weight,
- icon-only controls need programmatic labels even when no visible label is shown.

For the current web/PWA implementation, do not disable user zoom or rely on a fixed viewport that breaks when the browser viewport changes.

---

## 10. Color and dark mode

Meaning must never depend on color alone.

This is especially important for:

- CONFIRMED,
- CLAIM,
- UNKNOWN,
- selected/current mode,
- errors,
- saved/liked states.

Use wording, structure, icon/state, or typography in addition to color.

Light and dark modes must both be checked for readable contrast. Gradients and photography must not cause text or controls to disappear.

KAWASEMI teal is an accent, not a universal status color.

---

## 11. Icons and labels

Use familiar symbols where possible.

Every icon-only interactive element must have an accessible name.

Do not remove a visible label merely because the screen looks cleaner.

For CARDS / LIVE / DIVE navigation, icon-only navigation remains unapproved until first-use comprehension and accessibility are demonstrated.

The same icon must not mean different things in different parts of KAWASEMI.

---

## 12. Motion must explain, not decorate

Motion is allowed when it explains:

- direct manipulation,
- commitment,
- state change,
- spatial relationship,
- success/failure feedback.

Motion must not be the only way information is communicated.

Respect reduced-motion preferences.

When reduced motion is requested:

- remove unnecessary zoom/scale travel,
- remove repeated/looping motion,
- reduce large spatial transitions,
- prefer restrained fades or immediate state changes where appropriate.

Do not use bounce, wobble, glow trails, or ornamental movement as a substitute for clarity.

---

## 13. Feedback must be immediate and quiet

A user action should produce a perceivable response.

Examples:

- button press state,
- card following the finger,
- SAVE commitment feedback,
- LIKE state change,
- selected navigation state,
- loading/status change.

Avoid feedback that is so subtle the user cannot tell whether the action worked.

Avoid feedback so loud it interrupts reading.

Async/loading changes must communicate status rather than showing a silent frozen screen.

---

## 14. Sheets, overlays, and focus

For source sheets, menus, dialogs, and future overlays:

- opening must not accidentally scroll the content behind it,
- closing must restore the previous context,
- there must be no keyboard/screen-reader focus trap,
- the new surface must be announced/identified meaningfully to assistive technology,
- repeated opening/closing must not duplicate overlays or listeners.

External-source actions should make it clear when the user is leaving KAWASEMI or opening browser content.

---

## 15. Content and controls must be semantically understandable

Every interactive control needs a clear purpose.

Avoid generic accessible labels like:

- `More`,
- `Open`,
- `Button`,
- `Icon`.

Prefer labels that identify the action in context, for example:

- `Open source: Reuters`,
- `Save article`,
- `Like article`,
- `Open menu`,
- `Close source`.

Plain language beats clever language for operations.

Brand copy may be poetic. Operation copy must be explicit.

---

## 16. Loading, empty, failure, and caught-up states are real screens

Do not design only the ideal loaded state.

Every major surface must define at least:

- loading,
- loaded,
- empty/caught-up where applicable,
- recoverable failure,
- offline/network interruption where relevant.

The user must understand what happened and what they can do next.

A spinner without explanation is not sufficient for a long or uncertain operation.

---

## 17. KAWASEMI-specific screen gate

Before a production screen is approved, confirm:

### Understandability
- What am I looking at?
- Where am I?
- What is the primary thing I can do?
- How do I go back?

### Touch
- Are important targets at least 44 × 44 pt?
- Can a normal thumb hit them without precision?
- Are adjacent controls separated enough to avoid mis-taps?

### Gesture
- Does normal imperfect vertical scrolling stay READ?
- Do NEXT/SAVE work at top, middle, and end?
- Can incomplete gestures cancel safely?
- Is there an accessibility alternative for gesture-only outcomes?

### State
- Is reading position preserved where required?
- Does selected/saved/liked state remain correct after repeated actions?
- Can the user recover from every subview without reload?

### Accessibility
- Do icon-only controls have names?
- Does meaning survive without color?
- Does larger text remain usable?
- Is reduced motion respected?
- Is focus/reading order logical?

### Visual
- Does UI stay subordinate to content?
- Do light and dark modes both remain readable?
- Are safe areas respected?
- Does the screen still work without a beautiful image?

If any critical answer is no, the screen is not DONE.

---

## 18. QA execution rule

Automated tests are necessary but not enough.

Production UI/UX QA must combine:

1. deterministic automated regression checks,
2. imperfect human-like touch sequences,
3. screenshots/visual inspection,
4. accessibility smoke checks,
5. state-recovery checks,
6. explicit PASS / FAIL / NOT TESTED reporting.

A clean CI run does not override an owner-visible usability failure.

If the owner can reproduce a serious failure in ordinary use, the product remains REWORKING until the behavior is understood and fixed or explicitly accepted.

---

## 19. How Build and Design should use this document

### Design
Use this baseline before proposing minimal UI. It is the guardrail that prevents `Less interface` from becoming `Less usability`.

### Build
Use this baseline before introducing custom event handling, hit areas, navigation behavior, modal behavior, or motion.

### QA
Use this baseline together with `QA_CHECKLIST.md`. The checklist verifies the current implementation; this document explains the platform-quality standard behind those checks.

### Product HQ
Treat violations of this baseline as implementation/quality problems by default, not as new owner decisions, unless fixing the violation would change an intentional KAWASEMI product principle.
