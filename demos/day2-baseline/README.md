# Day 2 baseline-preserving UI / Motion prototype

This is the replacement Day 2 design artifact after the previous full visual redesign was rejected by the Owner.

The rule for this pass is:

> **Current KAWASEMI first. REMOVE > ADJUST > ADD > REDESIGN.**

This prototype intentionally does **not** load or modify production CARDS gesture code. It is an isolated review surface for Navigation / Menu / Tutorial / Opening / Motion around the current production visual baseline.

## Preview

After merge to `main`, GitHub Pages:

`https://nineq9.github.io/hato-cards/demos/day2-baseline/`

Useful review URLs:

- fresh first-launch + Full Opening + Tutorial: `https://nineq9.github.io/hato-cards/demos/day2-baseline/?reset=1`
- restart Tutorial without clearing the remembered launch state: `https://nineq9.github.io/hato-cards/demos/day2-baseline/?tutorial=1`
- ordinary reload after first launch demonstrates Micro Opening automatically

The prototype also exposes `SETTINGS > THEME` for DARK / LIGHT comparison.

## What to review — one best direction, not A/B/C

1. First launch shows a short Full Opening, then enters the real CARDS-shaped Tutorial.
2. Tutorial teaches in this order:
   - READ — `記事を読む / 縦にスクロールして、下まで読む。`
   - SOURCE — `根拠を確認する / SOURCEをタップ。閉じると同じ位置に戻る。`
   - LIKE — `役に立った記事を伝える / 記事末尾の♡をタップ。`
   - NEXT — `次の記事を見る / カードを左へ。`
   - SAVE — `あとで読み返す / カードを右へ。`
3. After Tutorial, continue using CARDS normally.
4. Use Bottom Navigation to switch `CARDS / LIVE / DIVE` and return to CARDS.
   - switching modes does not replay Opening.
   - LIVE / DIVE internals are only boundary placeholders; their actual experience remains owned by their workstreams.
5. Open Hamburger Menu and inspect `SAVED / LIKES / HISTORY / SETTINGS`.
6. Close Menu and confirm the same article and same scroll position remain.
7. Open Source, close it, and confirm the same reading position remains.
8. Reload after the first launch to see the Micro Opening (~0.55 s candidate).
9. Check Landscape. The CARDS shell stays usable without attempting to redesign DIVE for landscape.

## Current production elements deliberately preserved

The prototype is based on the current production `index.html` / `kingfisher.css` look rather than the rejected Day 2 redesign.

Kept intentionally:

- deep blue-green `#081113` foundation,
- current off-white text / warm muted beige accent,
- current geometric kingfisher mark,
- current topbar proportions,
- current full-height CARDS cover hierarchy,
- heavy dark image-to-body gradient,
- strong sans-serif article headline rather than serif-heavy editorial styling,
- current article-as-card structure and approximately current radius/depth,
- current source button + Source Sheet relationship,
- current NEXT preview / SAVE reveal / LIKE meanings,
- current text-first body density,
- current light-theme palette family.

## Before / after — only what changed

### Main Navigation

Before production shell:

`FOR YOU / HOT / DIVE`

This prototype:

`CARDS / LIVE / DIVE`

The location, height, typography scale, three-column structure, fine selected rule, and quiet unread dot stay close to the existing shell. The selected pill-like background is removed rather than replacing the whole Navigation with a new component.

**Decision for this pass:** text-only canonical names are the best baseline-preserving solution. Icon-only is not advanced because first-use comprehension has not been demonstrated, and adding new icons would be more change than necessary.

### Hamburger Menu

Kept as the existing left overlay pattern rather than a full-screen destination.

Top-level utilities:

- SAVED
- LIKES
- HISTORY
- SETTINGS

The large persistent wordmark is not added. A small geometric kingfisher mark is enough identity.

Menu subviews have an explicit Back control. Closing/reopening returns to the top-level utility list. The article stays behind the overlay and its scroll state is not reset.

### Tutorial

The current production tutorial already sits over the real CARDS reader, so this pass keeps that concept and fixes the unclear part: wording / sequence / information value.

Removed:

- abstract action language such as `静かに前へ`,
- poetic copy that hides the required operation,
- war / death / disaster as first-run teaching material.

Added:

- explicit READ / SOURCE / LIKE / NEXT / SAVE language,
- SOURCE as part of first-use learning,
- a neutral civic/science teaching story,
- visible `CONFIRMED / CLAIM / UNKNOWN` structure so KAWASEMI's value is learned through the article itself rather than a long explanation.

The guidance layer is a narrow strip attached to the existing shell instead of a new decorative tutorial card.

### Opening

- First launch: **Full Opening** — short geometric kingfisher + small `KAWASEMI` identity moment (~1.15 s prototype candidate).
- Ordinary launch: **Micro Opening** — mark only (~0.55 s candidate; within the requested ~0.4–0.7 s range).
- In-app return to CARDS: **no Opening**.

No confetti, glow, bounce, looping animation, or decorative logo sequence.

## Tutorial content

The first story is a fictional neutral sample about a city/university trial that dims night lighting during migratory-bird seasons.

It demonstrates KAWASEMI's information model naturally:

- `CONFIRMED` — what the announced trial actually includes,
- `CLAIM` — what researchers say the lighting may affect,
- `UNKNOWN` — what the trial has not established yet,
- `SOURCE` — where the information came from.

The prototype content is intentionally fictional and should not be interpreted as a real news report.

## Motion grammar used

Motion exists only to explain state:

- NEXT — current card follows left drag, next card is exposed, then article changes.
- SAVE — current card follows right drag, bookmark layer appears, current article settles back.
- LIKE — restrained fill + small scale response.
- Source — bottom sheet enters / exits while article stays behind.
- Menu — left overlay enters / exits while article stays behind.
- Navigation — no Opening and no dramatic mode transition.
- Opening — short identity transition only.

`prefers-reduced-motion: reduce` collapses decorative travel / transition duration.

**Important:** horizontal commitment distances in the isolated demo are implementation scaffolding for review only. They are **not** a gesture-threshold specification and must not be copied into production Build. Production gesture recognition remains owned by the shared CARDS gesture controller work.

## Accessibility considerations

Kept quiet visually, but not gesture-only structurally:

- hamburger, Source, LIKE, Menu rows, Back, Close, and Navigation are real buttons / links with accessible names,
- important visible controls maintain approximately 44 px hit areas,
- `aria-current="page"` identifies the active main mode,
- Source uses a dialog surface and returns focus to the control that opened it,
- Menu close returns focus to the hamburger control,
- NEXT and SAVE have keyboard / assistive-technology reachable alternative buttons that become visible on keyboard focus rather than occupying the normal reading UI,
- meaning of `CONFIRMED / CLAIM / UNKNOWN` is textual, not color-only,
- focus-visible treatment is provided,
- Escape dismisses Source / Menu,
- Reduced Motion is respected.

This prototype does not claim full VoiceOver production readiness; see NOT TESTED below.

## Landscape behavior

Scope here is only the CARDS shell / Navigation / Menu / Tutorial.

In landscape:

- topbar and Bottom Navigation become slightly shorter,
- cover headline / summary scale down,
- summary line count is limited to keep the reading entry usable,
- Menu width is constrained,
- Tutorial strip remains attached below the topbar,
- CARDS remains the primary experience rather than becoming a new two-column layout.

DIVE's internal landscape design is intentionally untouched.

## Isolation / workstream safety

This prototype does not change:

- production `index.html`,
- production `kingfisher.css`,
- production `kingfisher.js`,
- production gesture recognizer,
- LIVE TRACE implementation,
- DIVE FOCUS MAP implementation,
- AI/Data foundation.

It only defines the UI / Motion shell around their boundaries for Owner review.

## Automated QA target

Dedicated prototype QA should verify at minimum:

- production baseline screenshot remains available for comparison,
- DARK / LIGHT rendering,
- canonical `CARDS / LIVE / DIVE` Navigation and current state,
- Full Opening on fresh state,
- Micro Opening on ordinary reload,
- no Opening on in-app CARDS return,
- Tutorial READ → SOURCE → LIKE → NEXT → SAVE mechanical flow,
- Source reading-position preservation,
- Menu reading-position preservation and subview Back,
- keyboard-accessible NEXT / SAVE alternatives,
- portrait and landscape no obvious shell overflow,
- reduced-motion rendering does not depend on large travel.

## NOT TESTED / Owner review still required

Do **not** treat implementation or green CI as visual approval.

Still NOT TESTED until separately performed:

- Owner visual approval: `これならKAWASEMIっぽい / 安っぽくない / 使い方が分かる`,
- physical iPhone Safari touch feel for this specific isolated prototype,
- VoiceOver end-to-end flow,
- large browser text / Dynamic Type-like enlargement across every state,
- production integration with the Build workstream's final gesture recognizer,
- real LIVE / DIVE internal screens inside this shell,
- real source-site behavior; prototype external source action uses `example.com`,
- offline / network failure states (prototype is static),
- final opening duration on physical hardware.

## Known issues / boundaries

- Prototype article data is fictional and stored in memory.
- Saved / liked data is not intended as production persistence.
- LIVE and DIVE pages are explicit placeholders only so Main Navigation can be evaluated without colliding with parallel workstreams.
- The demo's source is an isolated bottom sheet; production Source semantics remain governed by `UX_RULES.md` and the final Build integration.
- This artifact is for Owner review and Build handoff after approval; it is not production completion.
