# Day 2 concrete UI prototype

Purpose: owner-reviewable concrete screens for Issue #9, using `docs/DESIGN_SYSTEM.md` as the canonical visual grammar.

## What is interactive

- Light / Dark comparison using the same hierarchy and interaction grammar.
- Normal CARDS screen using one continuous article surface.
- Real vertical READ with native scrolling.
- Real horizontal NEXT (swipe left) and SAVE (swipe right) on the same CARDS surface.
- Article-end LIKE.
- Tutorial using the real article and the real READ → LIKE → NEXT → SAVE actions.
- Bottom Navigation with CARDS / LIVE / DIVE current-location states.
- Hamburger Menu with SAVED / LIKES / HISTORY / SETTINGS utilities.
- Menu close via close button, backdrop, or Escape, preserving CARDS scroll position.
- Source Sheet open/close preserving CARDS scroll position.
- Full Opening and Micro Opening comparison controls; in-app mode returns do not invoke either opening.

## Deliberate decisions in this prototype

- No persistent large KAWASEMI wordmark on ordinary screens.
- Bottom Navigation keeps short text labels with minimal icons. Icon-only is not advanced as a candidate yet because first-use comprehension has not been demonstrated.
- The normal CARDS screen has no persistent NEXT/SAVE arrows or explanatory gesture labels.
- Tutorial copy is operational and explicit, not poetic or ambiguous.
- Tutorial uses neutral civic/culture content rather than war/death-heavy content.
- Menu utilities stay outside the three primary modes.
- Light and dark are one system, not separate layouts.

## Not a production integration

This is an isolated design/prototype artifact. It does not replace the stabilized production CARDS gesture implementation. Build should integrate approved choices after owner review.
