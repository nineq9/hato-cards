# KAWASEMI DIVE — FOCUS MAP interactive demo

Status: isolated prototype. Not integrated into production KAWASEMI.

## Purpose

Validate the approved DIVE direction as a touchable experience:

- FOCUS MAP
- QUESTION LABEL
- typed relations
- DIVE TRAIL
- Drag to DIVE
- exact return to the originating article scroll position
- Portrait and Landscape exploration

The demo intentionally uses static data. It does not call OpenAI or production APIs.

## Open

GitHub Pages (main branch):

`https://nineq9.github.io/hato-cards/demos/dive-focus-map/`

Local static server:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000/demos/dive-focus-map/`

## Required demo path

1. Read/scroll the CARDS article.
2. Hold the dedicated `HOLD · DIVE` grab affordance.
3. Drag the floating article to the Dock's DIVE target and drop.
4. Select `EVIDENCE`.
5. Select `衛星画像 / Satellite imagery`.
6. Select `HISTORY` to move sideways.
7. Tap `historically_similar_to` and verify the warning that similarity is not evidence.
8. Use BACK.
9. Use a DIVE TRAIL item to jump to an earlier visited node.
10. Use `ARTICLE` and confirm the previous article scroll position is restored.
11. Tap the Dock's DIVE normally and confirm it opens DIVE Home instead of directly diving the current article.
12. Repeat the same exploration in Portrait.
13. Repeat in Landscape. Landscape uses the left side for originating article/context and the right side for the FOCUS MAP.

## Drag activation decision used in this demo

Compared approaches:

- Article body long-press: rejected for the demo default because it competes with native text selection, READ and Safari callout behavior.
- Dedicated grab affordance: **selected**. Drag mode can only begin from this small, explicit surface. Once drag mode is committed, READ/NEXT/SAVE are suspended until drop/cancel.
- Article-end-only drag: rejected as the primary path because it makes DIVE less available at the moment curiosity occurs and weakens discoverability.

The article body never enters Drag Mode from long-press.

For accessibility, a non-gesture direct-DIVE action exists in the DOM for keyboard/assistive operation; production accessibility behavior still needs final platform review.

## Implemented

- Isolated CARDS-like article with vertical READ.
- Demo NEXT (left swipe) and SAVE (right swipe) gesture lock.
- Dedicated hold-to-drag DIVE affordance.
- DIVE Dock drop-zone feedback.
- Direct Article → FOCUS MAP entry.
- DIVE tap → DIVE Home semantic separation.
- FOCUS MAP with current node + at most 5–7 next nodes.
- Category + plain-language question labels.
- Typed relation labels are visible on each outward Node; the arrival Relation pill is tappable for explanation/provenance.
- `historically_similar_to` is explicitly separated from `supports`.
- Relation provenance sheet with demo source metadata.
- DIVE TRAIL and one-step BACK.
- Return to the originating article and scroll position.
- Responsive Portrait layout.
- Responsive Landscape two-pane layout with article/context left and FOCUS MAP right.
- Reduced-motion fallback.

## Not implemented

- Production CARDS integration.
- Real OpenAI/API node generation.
- Backend/persistence.
- Real source URLs or production provenance.
- Full graph pan/zoom.
- User personalization.
- Production analytics.
- Final VoiceOver/TalkBack interaction design.
- Production browser-history contract.

## QA status

Local Chromium browser automation passed the required Portrait and Landscape interaction path, including exact article scroll restoration. Gesture-conflict checks also passed for article-body long press, READ, SAVE, NEXT, Drag cancel, 44 pt targets, and the keyboard direct-DIVE fallback. GitHub Pages availability is verified separately and recorded in `docs/status/DIVE.md`.

## Production integration cautions

- Do not attach Drag Mode to article-body long press.
- Do not bypass the shared CARDS gesture decision layer.
- Drag must become an explicit interaction state; cancellation must never fall through into NEXT/SAVE.
- System edge gestures and normal text selection must keep priority outside the dedicated grab surface.
- Keep a non-drag accessibility path for direct Article → DIVE.
- Restore article identity and exact reading position on return.
- Preserve typed relations and provenance when static demo data is replaced with generated graph data.

## Portrait vs Landscape hypothesis

Portrait is better for focused, one-object-at-a-time exploration and one-handed use.

Browser QA supports the hypothesis that Landscape is stronger for investigative work: the two-pane layout keeps the originating article/context visible and independently scrollable while the FOCUS MAP remains usable on the right. Portrait remains better for focused, one-object-at-a-time exploration and one-handed use. This is an observation from the demo, not a final production orientation decision.
