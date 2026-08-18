# KAWASEMI UX Rules

These rules are the interaction contract for KAWASEMI. New features must not silently redefine them.

## 1. Core article interaction

The article card is not a preview that opens a separate detail page.

The card itself is the reading surface.

The article must remain visually and structurally inside the card while the user reads from beginning to end.

Core gestures:
- vertical scroll = READ
- right-to-left swipe = NEXT; current card exits left and the next card appears
- left-to-right swipe = SAVE + ADVANCE; current card is saved, exits right, and the next card appears
- heart at article end = LIKE

Both committed horizontal actions dismiss the current card in the direction of the gesture. Do not make SAVE commit and then wobble, bounce, or snap the current card back into place.

These meanings must remain consistent at the top, middle, and bottom of an article.

## 2. Gesture intent and direct manipulation

Vertical reading and horizontal actions share the same touch surface. Gesture handling must distinguish READ intent from card-dismiss intent without requiring an unnaturally perfect horizontal line.

Required behavior:
1. On gesture start, do not immediately trigger an action.
2. Allow a small neutral movement region.
3. Preserve native vertical reading when the path is predominantly read-like, including normal thumb wobble.
4. Recognize deliberate NEXT / SAVE intent from realistic one-handed thumb trajectories, including diagonal and slightly curved paths.
5. Once horizontal intent is clear, the card should follow the finger directly and predictably.
6. A short or ambiguous gesture cancels cleanly without committing.
7. A committed gesture exits with controlled inertia in the same direction as the user's movement.

A vertical read must never wobble the card sideways.
A horizontal swipe must not cause the article to scroll vertically.
Do not require a mathematically horizontal swipe for NEXT / SAVE.
Avoid rubber-band wobble, repeated bounce, or a visible vibration-like response.

Use one shared gesture controller / decision path wherever possible rather than screen-specific competing handlers.

## 3. NEXT

Right-to-left swipe means NEXT.

NEXT must work:
- before the user starts reading
- in the middle of the article
- at the article end

The card follows the finger. If intent is committed, it exits left with controlled inertia and reveals the next card.

The next article always starts at scroll position 0.
Do not inherit the previous article's scroll position.

## 4. SAVE

Left-to-right swipe means SAVE + ADVANCE.

SAVE must work at any article scroll position.

Expected motion:
- card follows finger
- restrained save feedback may appear while dragging
- save is committed
- current card continues out to the right instead of returning to its reading position
- the next article is revealed and starts at scroll position 0

The saved article remains available from SAVED.
SAVE and LIKE remain separate signals.
Do not use large confirmation text or disruptive transitions.
Do not use a bounce-back animation after a successful SAVE.

## 5. READ

Reading is normal vertical scrolling inside the same card.

Do not require:
- opening a detail view
- tapping READ
- navigating to another route
- closing an article to return

The initial view should work as a beautiful cover, but content continues naturally below it inside the same card.

The product is text-first. Photography supports understanding and atmosphere; it must not overpower the title, summary, and useful key points.

## 6. Article visual transition

The cover and article body should feel continuous.

Preferred visual flow:
image / cover
→ lower area gradually transitions toward the theme reading surface
→ title, summary, and key points remain highly legible
→ the gradient naturally becomes the reading background
→ long-form content continues below

The gradient is not merely decoration. It visually connects the cover to the reading space.
Do not use abrupt dark-to-light bands or smoke-like transitions.

## 7. LIKE

LIKE is different from SAVE.

SAVE = keep for later / useful.
LIKE = this information was good / I want more content of this broad topic or quality.

The LIKE heart appears at the end of the article, after the user has had the opportunity to read it.

The interaction should be restrained and satisfying:
- outline heart responds
- fills or transforms smoothly
- a small scale / pulse may occur
- no confetti or loud social-media animation

## 8. Tutorial = real product interaction

Do not build a fake tutorial that visually describes gestures without actually using them.

Reuse the same components and gesture logic as the real product whenever possible.

Tutorial sequence should teach by doing:
1. Show why KAWASEMI exists, not just what button to press.
2. Let the user actually scroll the first article.
3. Let the user reach the actual end and press LIKE.
4. Let the user perform a real NEXT swipe.
5. Let the user perform a real SAVE swipe and see that the saved card exits right to the next article.

Tutorial copy should be short, intelligent, and calm.
Avoid ambiguous copy if the gesture itself is not obvious.
The user should learn the interface through motion, not through paragraphs of instructions.

## 9. Menu navigation

The hamburger menu must never create a navigation dead end.

Menu behavior:
- menu can open from the button
- entering Settings / Saved / Likes / other menu subviews must provide a consistent way back to the menu list
- closing and reopening the menu should normally return to the top-level menu unless a deliberate product decision says otherwise
- LIKE / SAVE utility rows may remain fixed above a separately scrollable HISTORY region
- SETTINGS should remain reachable without scrolling through the entire history

If swipe-to-close is supported, the drawer should follow the finger and dismiss predictably without conflicting with system navigation gestures or article gestures.

## 10. Touch targets

Menu rows must use the entire row as the tappable target, not only the label or icon.

Important controls must have comfortable mobile touch areas even when visually minimal.

## 11. Source viewing

Opening a source should not unnecessarily destroy reading context.

Preferred behavior:
- source opens in a dedicated KAWASEMI source-reading surface
- source identity, original headline, publication time, available excerpt/content, provenance, and an explicit original-source action are shown clearly
- external page opens only after explicit user action
- returning restores the exact article and reading position
- do not reproduce full source text when licensing/storage rules do not allow it

## 12. Card stack

The active card stays visually straight for readability while reading.

During a committed horizontal gesture, the active card may translate and rotate slightly as part of direct manipulation.
Cards behind it may be offset / rotated very slightly to create physical depth.

Keep the effect subtle, premium, and non-game-like.

## 13. Motion principles

Motion should feel:
- intentional
- physical
- smooth
- restrained
- premium
- responsive to direct touch

Avoid:
- excessive bounce
- rubber-band effects unless native scrolling requires them
- wobble
- vibration-like visual shaking
- abrupt route-like transitions
- decorative motion that delays reading

The direction of the completion animation must match the direction of the user's gesture.

## 14. Undo control

Do not show a persistent UNDO mark/control on the normal article surface.
The primary review flow should stay visually quiet and forward-moving.

If reversible recovery is later required, design it as a separate, deliberate recovery mechanism rather than restoring the old persistent undo mark without Owner approval.

## 15. Caught-up state

CARDS is finite.

When the user has processed every article in the current required queue, replace the article stack with a clear caught-up state that visibly says:

`CLEAR!`

Do not loop back to already processed articles merely to avoid an empty state.
The caught-up state should feel calm and complete, not like an error or dead end.

## 16. State consistency

Changing one interaction must not leave an old interaction active elsewhere.

When a gesture meaning changes, update all of:
- production interaction
- tutorial
- labels / icons
- state transitions
- automated tests
- QA checklist

Do not keep old behavior hidden behind CSS or unreachable UI if the underlying event handler still exists.

## 17. Responsive priority

Primary target is smartphone usage, especially iPhone / Safari-like touch behavior.

Desktop behavior may exist, but it must not dictate touch UX.

## 18. No implementation-by-patchwork

Before adding a new event handler, state variable, view, or gesture, check whether an existing shared implementation can be extended.

Prefer one canonical implementation over multiple nearly identical handlers.

When a bug reveals a systemic problem, fix the shared cause rather than patching only the visible symptom.
