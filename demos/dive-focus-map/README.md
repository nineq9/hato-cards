# KAWASEMI DIVE Focus Map Demo

Independent static prototype for DIVE UX. It intentionally does **not** import or modify production KAWASEMI code.

## Run

From repository root:

```bash
python3 -m http.server 4173
```

Open:

`http://127.0.0.1:4173/demos/dive-focus-map/`

## Scope

- CARDS-style article reading surface
- `vertical = READ`, `← = NEXT`, `→ = SAVE`, article-end heart = LIKE
- Editorial Dock: `CARDS / LIVE / DIVE / SAVED`
- DIVE tap → DIVE Home
- Article drag → Article-centered FOCUS MAP
- Dedicated grab-handle hold is default activation mode (B)
- Demo Controls can compare:
  - A: Article body long press (conflict-testing only; not recommended)
  - B: Dedicated grab handle hold (default)
  - C: DIVE dock hold
- Typed relationship labels and relation sheet
- Provenance/source metadata for factual nodes and edges
- DIVE TRAIL, one-step Back, direct trail navigation
- Article-origin return restores article id/index/scroll position
- Static demo data only

## Mandatory exploration path

`発電施設爆発 → EVIDENCE → 衛星画像 → HISTORY`

The `衛星画像 → HISTORY` edge is `historically_similar_to`. The relation sheet explicitly states that historical similarity is not evidence for the current incident.

## Production boundary

This demo must stay isolated from production. It does not change or import:

- root `index.html`
- `kingfisher.js`
- `kingfisher.css`
- production gesture controller
- production DIVE implementation
- LIVE backend/UI implementation
- API / database code

## Out of scope

- production integration
- real AI node generation
- backend / OpenAI API
- production database
- full knowledge graph
- personalization
- analytics
- final tutorial integration

All event/source content is synthetic demo data.
