# KAWASEMI QA Checklist

Run this checklist after any change that touches cards, gestures, navigation, tutorial, menu, save, like, article rendering, or responsive layout.

Do not report "done" without stating which checks were actually performed.

## A. Tutorial

- [ ] Tutorial loads without layout breakage.
- [ ] Tutorial uses the same real card interaction logic as production wherever possible.
- [ ] First tutorial article can actually scroll vertically.
- [ ] Tutorial content stays inside the card while scrolling.
- [ ] Tutorial copy explains the value of KAWASEMI, not only controls.
- [ ] User can reach the real article end.
- [ ] LIKE heart appears at the intended point.
- [ ] LIKE interaction animates correctly and does not shift layout unexpectedly.
- [ ] User can perform a real right-to-left NEXT swipe.
- [ ] User can perform a real left-to-right SAVE swipe.
- [ ] Tutorial instructions match current production gestures exactly.
- [ ] No obsolete gesture instruction remains.

## B. Article cover / card

- [ ] Active card is straight, not rotated.
- [ ] Background cards may be subtly offset / rotated without harming readability.
- [ ] Title is readable and not unnecessarily constrained by stock-count UI.
- [ ] Summary text is readable at smartphone size.
- [ ] Image does not dominate text.
- [ ] Bottom gradient transitions naturally into the reading area.
- [ ] No text unexpectedly renders outside the card.
- [ ] No duplicate title, summary, separator, or metadata appears.

## C. Vertical READ

Test from a clean reload.

- [ ] Vertical scroll works from the article cover.
- [ ] Card does not move sideways during a clear vertical gesture.
- [ ] Article body remains inside the card.
- [ ] User can scroll through the complete article.
- [ ] Scrolling upward to revisit earlier text works normally.
- [ ] No accidental NEXT occurs during normal reading.
- [ ] No accidental SAVE occurs during normal reading.
- [ ] Article end stops normally and does not auto-advance to the next card.

## D. NEXT (right-to-left)

Test separately from each position:

- [ ] NEXT works at article top.
- [ ] NEXT works in article middle.
- [ ] NEXT works at article end.
- [ ] Card visibly follows the finger.
- [ ] Insufficient swipe distance returns the card to place.
- [ ] Sufficient distance / velocity advances to next card.
- [ ] Next card begins at scroll position 0.
- [ ] Previous card's scroll position does not leak into the next card.
- [ ] NEXT does not accidentally trigger while vertically scrolling.
- [ ] Stock / unread count updates correctly if applicable.

## E. SAVE (left-to-right)

Test separately from each position:

- [ ] SAVE works at article top.
- [ ] SAVE works in article middle.
- [ ] SAVE works at article end.
- [ ] Card visibly follows the finger.
- [ ] Save feedback is subtle and understandable.
- [ ] Sufficient swipe saves the article.
- [ ] Article does not navigate away after save.
- [ ] Card returns smoothly to reading position.
- [ ] Current scroll position is preserved after saving.
- [ ] Saved state is reflected correctly in the saved-items UI.
- [ ] SAVE does not accidentally trigger while vertically scrolling.

## F. Gesture lock / conflict testing

- [ ] Small ambiguous movement does not trigger an action immediately.
- [ ] Clear vertical movement locks to READ.
- [ ] Clear horizontal movement locks to NEXT or SAVE.
- [ ] Direction does not change mid-gesture after lock.
- [ ] Diagonal up-left gesture behaves predictably.
- [ ] Diagonal up-right gesture behaves predictably.
- [ ] Slow horizontal swipe behaves predictably.
- [ ] Fast flick behaves predictably.
- [ ] Repeated rapid gestures do not leave the card in a stuck transform state.
- [ ] No duplicate touch / pointer handlers cause double actions.

## G. LIKE

- [ ] LIKE appears at article end.
- [ ] Heart is tappable with a comfortable touch target.
- [ ] LIKE changes state once per intended tap.
- [ ] LIKE animation is smooth and restrained.
- [ ] Repeated taps do not corrupt state.
- [ ] LIKE remains distinct from SAVE.
- [ ] LIKE state persists according to product requirements.

## H. Menu

- [ ] Hamburger button opens the menu.
- [ ] Full menu rows are tappable, including whitespace to the right of labels.
- [ ] Settings opens correctly.
- [ ] Saved opens correctly.
- [ ] Likes opens correctly.
- [ ] Saved icon is a recognizable bookmark icon.
- [ ] Subviews have a clear path back to menu list.
- [ ] Left-edge-to-right swipe returns from Settings to menu list if this gesture is enabled there.
- [ ] Left-edge-to-right swipe returns from other menu subviews consistently.
- [ ] Closing and reopening the menu starts at the top-level menu unless intentionally specified otherwise.
- [ ] Menu state does not remain trapped in a previously opened subview.

## I. Menu edge swipe vs SAVE conflict

- [ ] Edge swipe activates only from the defined narrow left-edge zone.
- [ ] Starting a right swipe away from the edge triggers SAVE, not menu.
- [ ] Starting at the edge opens / returns toward menu, not SAVE.
- [ ] Threshold feels usable on iPhone-sized screens.
- [ ] User is not frequently forced to repeat gestures because of ambiguous detection.

## J. Source view

- [ ] Source control opens source information without losing article position.
- [ ] Modal / bottom sheet renders correctly.
- [ ] Source name / original title are readable.
- [ ] External source action is explicit.
- [ ] Closing source view returns to the exact previous scroll position.
- [ ] Opening / closing repeatedly does not duplicate overlays.

## K. Navigation / state

- [ ] There is no screen from which the user cannot recover without reloading.
- [ ] Browser back behavior does not unexpectedly destroy app state.
- [ ] Old detail-view state does not reappear if detail navigation has been removed.
- [ ] Old gesture meanings are not still active in hidden code paths.
- [ ] No duplicated event listeners appear after rerenders / repeated opening.

## L. Card progression

- [ ] Current card count is visually balanced and readable.
- [ ] Progress changes correctly after NEXT.
- [ ] SAVE does not incorrectly consume a card unless explicitly intended.
- [ ] LIKE does not incorrectly consume a card.
- [ ] Reaching zero produces the intended caught-up state.

## M. Mobile visual QA

Check at minimum on an iPhone-like portrait viewport.

- [ ] No horizontal page overflow.
- [ ] No content is hidden behind browser chrome unexpectedly.
- [ ] Safe-area spacing is acceptable.
- [ ] Text is readable without zooming.
- [ ] Card fits the intended viewport proportions.
- [ ] Card body can still scroll to completion.
- [ ] Fixed navigation does not cover important article content.
- [ ] Tap targets are not too small.

## N. Regression report format

After implementation, report each relevant item as:
- PASS — actually tested and worked
- FAIL — tested and failed
- NOT TESTED — not verified

Do not use "PASS" for code inspection alone if the item requires interaction testing.

When a failure is found, report:
1. exact interaction sequence
2. expected behavior
3. actual behavior
4. likely root cause if known
5. file(s) changed to fix it

## O. Before merging / declaring completion

- [ ] Read PRODUCT_PRINCIPLES.md.
- [ ] Read UX_RULES.md.
- [ ] Run the relevant sections of this QA checklist.
- [ ] Confirm no old interaction remains that contradicts UX_RULES.md.
- [ ] Confirm no requested item was silently skipped.
- [ ] Clearly list any remaining known issues.
