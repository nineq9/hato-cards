# KAWASEMI Demo Quality Gate

Status: **owner-required review gate**

This applies to every KAWASEMI prototype/demo before it is presented as owner-reviewable or DONE.

Canonical product and visual references remain:

- `PRODUCT_PRINCIPLES.md`
- `UX_RULES.md`
- `QA_CHECKLIST.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UI_UX_BASELINE.md`

A demo is not allowed to invent a separate visual language merely because it is isolated from production.

## 1. Production visual baseline first

Before styling a demo, inspect the current production KAWASEMI implementation (`index.html`, `kingfisher.css`, and the rendered current product).

Unless the demo is explicitly testing a visual change, preserve the production baseline for:

- font family and Japanese typography behavior,
- headline/body/UI hierarchy,
- font weights,
- background and surface colors,
- kingfisher teal / restrained accent use,
- icon language,
- radius/depth treatment,
- spacing rhythm,
- topbar and navigation proportions,
- article image-to-body treatment.

Feature-specific layouts may differ where the feature genuinely requires it, but they must still feel like the same KAWASEMI product.

Do not substitute generic SaaS, dashboard, graph-demo, Dribbble, neon, serif-heavy, or unrelated design-system defaults.

## 2. Basic layout correctness is a release gate

The following are automatic FAIL conditions, not taste issues:

- text overlapping other text,
- text overlapping controls/icons,
- clipped labels that hide meaning,
- controls covering content,
- unreadable contrast,
- horizontal page overflow,
- content rendered outside its intended container,
- fixed UI hiding required content,
- broken safe-area layout,
- inaccessible or visually unreachable controls,
- accidental stacking caused by translated text or narrow viewports,
- layout breakage during state transitions.

A demo with any known FAIL above must not be described as owner-review-ready.

## 3. Required viewport matrix

At minimum, visually inspect and interaction-test relevant states at:

- 320×568 portrait,
- 375×667 portrait,
- 390×844 portrait,
- 430×932 portrait,
- 844×390 landscape,
- one wider tablet/desktop landscape viewport when the feature supports landscape.

Where browser chrome/safe-area behavior matters, keep physical iPhone/Safari as `NOT TESTED` until actually tested there.

## 4. Text stress

For every important state:

- test Japanese strings, not only short English labels,
- include at least one long headline,
- include long source/actor names,
- verify two-line and multi-line wrapping,
- verify no overlap at browser text enlargement / large-text stress where practical,
- do not solve overflow by making important text illegibly small.

## 5. State coverage

Do not visually QA only the default screen. Capture/check the states the user can actually reach, including where relevant:

- default,
- selected/active,
- modal/sheet/menu open,
- loading/empty/caught-up,
- long content,
- light mode,
- dark mode,
- portrait,
- landscape,
- reduced motion,
- keyboard/focus-visible state.

## 6. Screenshot review

Automated interaction PASS is not enough.

For owner-reviewable demos, generate screenshots of the required states and inspect them for:

- overlap,
- clipping,
- hierarchy,
- baseline font/color drift,
- inconsistent spacing,
- broken alignment,
- excessive UI chrome,
- accidental visual emphasis.

If screenshot inspection was not actually performed, report `NOT TESTED` rather than PASS.

## 7. Visual drift report

Before presenting a demo, state explicitly:

- what intentionally differs from production,
- why that difference is necessary for the feature,
- what production visual tokens/behaviors were preserved,
- any remaining visual mismatch.

Unintentional font/color/radius/spacing drift should be fixed, not rationalized as a prototype difference.

## 8. DONE / OWNER_REVIEW_READY rule

A demo can be `OWNER_REVIEW_READY` only when:

1. core interactions work,
2. required layout states have no known overlap/clipping/overflow failures,
3. production visual baseline consistency has been checked,
4. screenshot review has actually been performed,
5. remaining `NOT TESTED` items are explicitly listed.

`DONE` for an isolated demo does not mean production integration is approved.
