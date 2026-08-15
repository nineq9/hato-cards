# KAWASEMI UX Rules

These rules are the interaction contract for KAWASEMI. New features must not silently redefine them.

## 1. Core article interaction

The article card is not a preview that opens a separate detail page.

The card itself is the reading surface.

The article must remain visually and structurally inside the card while the user reads from beginning to end.

Core gestures:
- vertical scroll = READ
- right-to-left swipe = NEXT
- left-to-right swipe = SAVE
- heart at article end = LIKE

These meanings must remain consistent at the top, middle, and bottom of an article.

## 2. Gesture direction lock

Vertical reading and horizontal actions share the same touch surface, so gesture intent must be locked early and consistently.

Required behavior:
1. On gesture start, do not immediately trigger an action.
2. Wait for a small movement threshold.
3. If vertical movement clearly dominates, lock to vertical scroll.
4. If horizontal movement clearly dominates, lock to horizontal swipe.
5. Once locked, do not switch direction during the same gesture.

A vertical read must never wobble the card sideways.
A horizontal swipe must not cause the article to scroll vertically.

Use one shared gesture controller / decision path wherever possible rather than screen-specific competing handlers.

## 3. NEXT

Right-to-left swipe means NEXT.

NEXT must work:
- before the user starts reading
- in the middle of the article
- at the article end

The card follows the finger. If the threshold or velocity is sufficient, it exits with controlled inertia and reveals the next card.

The next article always starts at scroll position 0.

Do not inherit the previous article's scroll position.

## 4. SAVE

Left-to-right swipe means SAVE.

SAVE must work at any article scroll position.

Saving does not navigate away from the current article.

Expected motion:
- card follows finger
- subtle bookmark / save feedback appears
- threshold crossed
- save is committed
- card returns smoothly to its reading position

Do not use large confirmation text or disruptive transitions.

## 5. READ

Reading is normal vertical scrolling inside the same card.

Do not require:
- opening a detail view
- tapping READ
- navigating to another route
- closing an article to return

The initial view should work as a beautiful cover, but content continues naturally below it inside the same card.

The product is text-first. Photography supports understanding and atmosphere; it must not overpower the title and summary.

## 6. Article visual transition

The cover and article body should feel continuous.

Preferred visual flow:
image / cover
→ lower area gradually darkens
→ title and summary remain highly legible
→ dark gradient naturally becomes the reading background
→ long-form content continues below

The gradient is not merely decoration. It visually connects the cover to the reading space.

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
5. Let the user perform a real SAVE swipe.

Tutorial copy should be short, intelligent, and calm.

Avoid ambiguous copy such as "もういい→次へ" if the gesture itself is not obvious.

Suggested conceptual copy style:
- 世界を、取りこぼさない。
- 気になったら、そのまま読む。
- ひとつのニュースを、そこで終わらせない。
- もう十分なら、左へ。
- 残しておきたいなら、右へ。

The user should learn the interface through motion, not through paragraphs of instructions.

## 9. Menu navigation

The hamburger menu must never create a navigation dead end.

Menu behavior:
- menu can open from the button
- from eligible screens, a left-edge-to-right edge swipe can open or return toward the menu
- entering Settings / Saved / Likes / other menu subviews must provide a consistent way back to the menu list
- closing and reopening the menu should normally return to the top-level menu unless a deliberate product decision says otherwise

Edge swipe must only activate from a narrow left-edge zone so it does not conflict with SAVE on article cards.

## 10. Touch targets

Menu rows must use the entire row as the tappable target, not only the label or icon.

Important controls must have comfortable mobile touch areas even when visually minimal.

## 11. Source viewing

Opening a source should not unnecessarily destroy reading context.

Preferred behavior:
- source opens first in a modal / bottom sheet
- current article remains visible behind it
- source metadata is shown clearly
- external page opens only after explicit user action
- closing the sheet returns to the exact reading position

## 12. Card stack

The active card stays visually straight for readability.

Cards behind it may be offset / rotated very slightly to create physical depth.

Do not rotate the active reading card.

Keep the effect subtle, premium, and non-game-like.

## 13. Motion principles

Motion should feel:
- intentional
- physical
- smooth
- restrained
- premium

Avoid:
- excessive bounce
- rubber-band effects unless native scrolling requires them
- wobble
- abrupt route-like transitions
- decorative motion that delays reading

## 14. State consistency

Changing one interaction must not leave an old interaction active elsewhere.

When a gesture meaning changes, update all of:
- production interaction
- tutorial
- labels / icons
- state transitions
- automated tests
- QA checklist

Do not keep old behavior hidden behind CSS or unreachable UI if the underlying event handler still exists.

## 15. Responsive priority

Primary target is smartphone usage, especially iPhone / Safari-like touch behavior.

Desktop behavior may exist, but it must not dictate touch UX.

## 16. No implementation-by-patchwork

Before adding a new event handler, state variable, view, or gesture, check whether an existing shared implementation can be extended.

Prefer one canonical implementation over multiple nearly identical handlers.

When a bug reveals a systemic problem, fix the shared cause rather than patching only the visible symptom.
