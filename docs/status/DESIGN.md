# Design / Motion Status

### Status
REWORKING — Day 2 concrete visual prototype was rejected by owner; return to the previously accepted KAWASEMI visual baseline before proposing new concrete screens

### Current goal
Do not iterate on the rejected Day 2 visual direction. Re-anchor concrete UI work in the previously accepted KAWASEMI look and feel: strong existing CARDS cover, restrained deep blue-green / off-white system, minimal geometric icons, reduced visible chrome, and `Less interface, more experience`.

`docs/DESIGN_SYSTEM.md` remains the source of truth for shared principles, but the rejected Day 2 prototype must **not** be treated as an approved interpretation of that system.

### Owner decision — 2026-08-15
- The concrete Day 2 prototype merged in PR #10 was explicitly rejected after visual review.
- Owner requested returning to the previous design point rather than polishing that direction.
- Therefore the Day 2 prototype's specific visual choices are **not approved** for Build handoff.
- Production CARDS was never replaced by the prototype, so the stabilized production experience remains the safe baseline.

### Reverted / removed
- Removed `demos/day2-shell/index.html` from `main`.
- Removed `demos/day2-shell/README.md` from `main`.
- Removed `tests/day2-design.mjs`, which only tested the rejected prototype.
- Restored `.github/workflows/smoke.yml` to the production QA suite without the rejected prototype test.
- No production CARDS gesture or article implementation was rolled back.

### Keep from earlier approved direction
- `Less interface, more experience`.
- CARDS content and cover should remain the visual priority over app chrome.
- Deep blue-green, off-white, restrained warm accent.
- Geometric kingfisher expression; no mascot treatment.
- Existing NEXT / SAVE / LIKE motion meanings.
- Source Sheet as contextual source access.
- CARDS / LIVE / DIVE are the three main experiences; SAVED / LIKES / HISTORY / SETTINGS are utilities.
- Avoid AI neon, game-like glow, SaaS template language, excessive pills, and generic news-app styling.
- Do not add a large persistent KAWASEMI wordmark to normal product screens.
- LIGHT and DARK remain required, but their exact concrete styling must be re-derived from the accepted baseline.

### Explicitly NOT approved from rejected Day 2 prototype
- The large rounded inset card/shell treatment as the default CARDS visual direction.
- The decorative editorial/serif-heavy treatment used in that prototype.
- The specific icon + label Bottom Navigation styling from that prototype.
- The specific Tutorial floating-guide styling.
- The specific Hamburger Menu density, spacing, and icon treatment.
- The prototype's exact radius, spacing, shadows, and chrome values.

### Evidence / history
- PR #10 remains in Git history as a rejected exploration, not an approved design.
- The rejected prototype files and its dedicated QA were removed from `main` after owner review.
- Production CARDS stabilization from Issue #4 remains intact and is not part of this visual rollback.

### QA status
- Previous production CARDS QA results remain the relevant functional baseline.
- The rejected prototype's former PASS results only proved its mechanics worked; they do **not** constitute design approval and should not be used as evidence for the visual direction.
- Physical iPhone / Safari design review is still required for the next concrete proposal.

### Next action
Reconstruct the next concrete Day 2 proposal from the previously accepted visual baseline, changing as little as possible. Prefer subtraction over redesign. Preserve working CARDS visual language first; then apply only necessary Navigation / Tutorial / Menu changes around it. Do not hand any new visual direction to Build until owner explicitly approves the concrete screens.
