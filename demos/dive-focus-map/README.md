# KAWASEMI DIVE Focus Map Demo

This directory is an isolated interaction prototype. It does not import or modify the production CARDS implementation.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173
```

Then open:

`http://127.0.0.1:4173/demos/dive-focus-map/`

## What this prototype includes

- CARDS-like article with vertical READ, left NEXT, right SAVE semantics
- Explicit `HOLD · DIVE` long-press handle to enter drag mode without redefining normal CARDS gestures
- Editorial Dock: `CARDS / LIVE / DIVE`
- Tapping DIVE opens DIVE Home
- Dragging the article to DIVE opens the article directly as the FOCUS MAP center
- FOCUS MAP with up to seven surrounding nodes and question labels
- Typed relationships: `supports`, `contradicts`, `claims`, `confirms`, `context_for`, `historically_similar_to`, `affects`, `explains`
- Node-to-center transition
- DIVE TRAIL with clickable history
- Back navigation
- Relationship inspection
- Returning from article-origin DIVE restores the article scroll position
- LIVE is intentionally a placeholder

## Demo data

All content in this prototype is synthetic. The example event is not presented as a real-world report.

## Production boundary

This prototype does not change:

- root `index.html`
- `kingfisher.js`
- `kingfisher.css`
- production gesture controller
- production DIVE implementation
- LIVE / API code

No Product HQ decision should be inferred from this prototype unless it is explicitly approved later.
