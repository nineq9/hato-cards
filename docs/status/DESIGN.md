# Design / Motion Status

### Status
REVIEW — baseline-preserving Day 2 UI / Motion prototype is implemented and QA-verified; Owner visual approval is still pending

### Current goal
Have the Owner review one concrete best-direction prototype that completes unclear UI / Motion around the **current production KAWASEMI visual baseline** without redesigning CARDS.

This pass follows:

> **REMOVE > ADJUST > ADD > REDESIGN**

`docs/DESIGN_SYSTEM.md` and `docs/UI_UX_BASELINE.md` remain the shared design / accessibility sources of truth. The rejected PR #10 visual direction remains rejected and must not be treated as precedent.

### Canonical references re-read for this pass
- `README.md`
- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`
- this status document
- Issue #9

Main was also rechecked while parallel workstreams were advancing. Core production `index.html`, `kingfisher.css`, and `kingfisher.js` remained the visual baseline used here; unrelated LIVE / HATO work advanced `main` during the pass.

### Owner decision carried forward
- The full Day 2 visual redesign from PR #10 was rejected.
- Do not revive its large rounded inset shell, serif-heavy editorial treatment, generic minimal-app feel, or its specific Navigation / Menu / Tutorial styling.
- The safe baseline is the current production KAWASEMI CARDS experience.
- Implementation / green CI is not visual approval.

### New review artifact
- PR #12: `Day 2: complete UI/Motion from current KAWASEMI baseline`
- Isolated prototype: `demos/day2-baseline/index.html`
- Review / run guide: `demos/day2-baseline/README.md`
- Dedicated QA: `tests/day2-baseline-design.mjs`
- Dedicated workflow: `.github/workflows/day2-baseline-prototype.yml`

This artifact does **not** load or modify production CARDS gesture code.

### Current production baseline actually inspected
The production CARDS shell was opened in automated mobile-browser QA and captured as a read-only comparison image before evaluating the new prototype.

Deliberately preserved:
- deep blue-green `#081113` foundation,
- current off-white typography and restrained warm beige / orange accents,
- small geometric kingfisher in the topbar,
- current topbar proportions,
- strong full-height CARDS cover,
- dark cover gradient flowing into the reading surface,
- strong sans-serif headline rather than a serif-led redesign,
- article-is-the-card structure,
- approximately current card radius / depth rather than a new rounded-shell system,
- current Source Sheet relationship,
- current NEXT / SAVE / LIKE meanings,
- current text-first article body density,
- current light-theme palette family.

### Minimal changes in the prototype

#### 1. Main Navigation
Production currently exposes `FOR YOU / HOT / DIVE`.

Prototype changes only the canonical mode names and the minimum selection treatment:

`CARDS / LIVE / DIVE`

Kept close to the existing shell:
- same bottom location,
- same three-column structure,
- same compact height / typography scale,
- fine selected rule,
- quiet unread dot.

Removed rather than redesigned:
- the selected pill-like background.

**Current best direction:** text-only `CARDS / LIVE / DIVE` for this baseline-preserving pass. Icon-only is not advanced because first-use comprehension has not been demonstrated, and adding three new icons would be a larger change than needed.

LIVE and DIVE inside this prototype are boundary placeholders only. Their internal experience remains owned by LIVE TRACE and DIVE FOCUS MAP workstreams.

#### 2. Hamburger Menu
Kept as a left overlay over the article rather than a large separate destination.

Top-level utilities:
- SAVED
- LIKES
- HISTORY
- SETTINGS

Behavior:
- explicit close control,
- explicit Back from subviews,
- close/reopen returns to the utility root,
- closing returns to the same article and same scroll position,
- production-shaped article remains behind the overlay.

A small geometric kingfisher mark is used instead of adding a large persistent wordmark.

#### 3. Tutorial
The current production idea of a guidance layer over the actual ARTICLE CARD is preserved. What changed is the unclear copy / sequence, not the underlying interaction metaphor.

Tutorial sequence:
1. **READ** — `記事を読む` / `縦にスクロールして、下まで読む。`
2. **SOURCE** — `根拠を確認する` / `SOURCEをタップ。閉じると同じ位置に戻る。`
3. **LIKE** — `役に立った記事を伝える` / `記事末尾の♡をタップ。`
4. **NEXT** — `次の記事を見る` / `カードを左へ。`
5. **SAVE** — `あとで読み返す` / `カードを右へ。`

Removed:
- poetic / ambiguous operation copy such as `静かに前へ`,
- fake Tutorial-only interaction,
- war / death / disaster as first-run teaching content.

The guidance surface is a narrow restrained strip attached to the existing shell rather than a new floating design language.

#### 4. Tutorial content
The first article is fictional neutral civic/science content about a city / university trial that dims night lighting during migratory-bird seasons.

The article itself demonstrates KAWASEMI's value through:
- `CONFIRMED`,
- `CLAIM`,
- `UNKNOWN`,
- `SOURCE`.

This teaches that KAWASEMI separates what is known, what is claimed, and what remains unknown without a long product explanation.

The demo content is fictional and is not a real news report.

#### 5. Source
Source remains a contextual bottom sheet.

Prototype behavior verified:
- open Source from the real article surface,
- article remains behind,
- close returns to the exact reading position,
- keyboard focus returns to the source control that opened it.

#### 6. Opening
One direction, three contexts:
- First launch: **Full Opening** — brief geometric kingfisher + small identity moment; prototype candidate ~1.15 s.
- Ordinary launch: **Micro Opening** — mark only; prototype candidate ~0.55 s.
- In-app return / mode switch to CARDS: **no Opening**.

No confetti, glow, bounce, looping flourish, or dramatic logo animation.

#### 7. Motion
Motion is used only to explain state:
- NEXT — current card follows left intent and exposes the next card,
- SAVE — current card follows right intent and exposes bookmark feedback, then returns,
- LIKE — restrained fill / small scale response,
- Source — bottom sheet,
- Menu — left overlay,
- Navigation — immediate quiet mode change; no Opening replay,
- Opening — short identity transition only.

`prefers-reduced-motion: reduce` is supported.

**Important boundary:** horizontal commitment values inside the isolated demo are scaffolding for interaction review only. They are not a gesture-threshold specification and must not be copied into the Build workstream. Production gesture recognition remains owned by the shared CARDS gesture controller.

### Accessibility considerations implemented in the prototype
- semantic named buttons / links for Menu, Source, LIKE, Navigation, Back, Close,
- approximately 44 px minimum targets for important controls,
- `aria-current="page"` for current main mode,
- Source dialog semantics and focus return,
- Menu close focus return,
- visible keyboard focus styling,
- text labels for `CONFIRMED / CLAIM / UNKNOWN`; meaning does not depend on color,
- Escape dismissal for Source / Menu,
- Reduced Motion,
- quiet keyboard / assistive-technology reachable alternatives for NEXT and SAVE that do not occupy the normal reading surface unless focused.

This is not a claim of full VoiceOver production readiness.

### Landscape behavior checked
Scope is CARDS shell / Navigation / Menu / Tutorial only.

Prototype behavior:
- shorter topbar and Bottom Navigation,
- cover title / summary scale down,
- summary is line-limited so the entry screen remains usable,
- Menu width is constrained,
- Tutorial strip remains attached below topbar,
- no horizontal page overflow in the tested 844×390 viewport,
- CARDS remains a single primary reading surface rather than becoming a new desktop layout.

DIVE internal landscape design is intentionally untouched.

### QA — actually verified
Dedicated Day 2 prototype CI run `31913630853`: **PASS**.

Verified in Playwright Chromium mobile emulation:
- read-only capture of current production CARDS baseline,
- fresh launch uses Full Opening,
- Tutorial starts on CARDS and proceeds READ → SOURCE → LIKE → NEXT → SAVE,
- Source closes to the same scroll position,
- NEXT changes article and resets scroll to top,
- SAVE stays on the same article,
- Tutorial completes after real SAVE interaction,
- Menu contains SAVED / LIKES / HISTORY / SETTINGS,
- Menu subview has explicit Back,
- Menu close preserves article scroll position,
- CARDS → LIVE → DIVE → CARDS does not replay Opening,
- CARDS article + scroll position survive mode switching,
- keyboard-visible non-gesture NEXT alternative exists,
- LIGHT uses the same structure,
- ordinary launch uses Micro Opening and does not restart Tutorial,
- Landscape 844×390 has no horizontal shell overflow and key controls remain reachable,
- Reduced Motion still reaches a usable CARDS / Tutorial state.

Final dedicated screenshot artifact:
- `day2-baseline-review`
- artifact ID `9254336720`

Captured states include:
- current production CARDS baseline,
- Full Opening,
- Tutorial READ,
- Tutorial SOURCE,
- Source Sheet,
- Tutorial LIKE,
- Tutorial NEXT / SAVE state,
- Tutorial complete,
- Hamburger Menu DARK,
- CARDS LIGHT,
- Micro Opening,
- Landscape.

Design-side visual inspection was also performed on the generated production comparison, Tutorial, Source, Menu, LIGHT, Full / Micro Opening transition frames, and Landscape images. This is **not** Owner approval.

### Regression / workstream safety QA
Existing PR-head `KINGFISHER smoke` run `31913630893`: **PASS**.

Verified:
- production Browser smoke — PASS,
- production human-like mobile E2E — PASS,
- production untouched regression — PASS,
- parallel LIVE TRACE demo E2E — PASS.

The isolated UI / Motion artifact did not require changes to production `index.html`, `kingfisher.css`, `kingfisher.js`, or the production CARDS gesture recognizer.

### NOT TESTED / not approved
Do not convert these to PASS without separate evidence:
- **Owner visual approval**: `これならKAWASEMIっぽい / 安っぽくない / 使い方が分かる`,
- physical iPhone Safari touch feel for this specific prototype,
- VoiceOver end-to-end flow,
- large Dynamic Type / browser text enlargement across every state,
- production integration with Build's final gesture recognizer,
- real LIVE TRACE screen integrated into this exact shell,
- real DIVE FOCUS MAP screen integrated into this exact shell,
- production Saved / Likes / History data behavior in the new shell,
- real external source-site behavior; demo external action uses `example.com`,
- offline / network-failure behavior,
- final Opening durations on physical hardware.

### Known issues / boundaries
- The prototype article set is fictional and in-memory.
- LIVE / DIVE internal pages are placeholders by design to avoid collisions with parallel workstreams.
- The demo's horizontal gesture thresholds are review scaffolding, not product specs.
- Some review screenshots intentionally capture an Opening transition frame; the actual live review is authoritative for timing / feel.
- A clean CI result proves mechanical behavior only, not visual quality.

### Product decision needed from Owner
No A/B/C choice.

Review the one baseline-preserving prototype and decide only:

> **Does this still feel like KAWASEMI, does it avoid looking cheap, and is the interaction understandable?**

If yes, only the explicitly approved shell / copy / motion choices should be handed to Build. If not, revise locally from the current production baseline rather than starting another visual redesign.

### Next action
Merge the isolated review artifact after final branch checks, publish it through the existing GitHub Pages path, and keep Issue #9 open for Owner visual review. Do **not** mark Day 2 design DONE or begin production UI integration until Owner approval is recorded.
