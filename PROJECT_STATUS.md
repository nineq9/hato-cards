# PROJECT STATUS — hato-cards

Last synced: 2026-08-21
Project state: ACTIVE / OWNER_ACTION_REQUIRED for physical iPhone install
Source of truth: this repository + this file

## Current verified GitHub state
- GEKKO native tutorial/onboarding is implemented under `ios/be-minimal-native/`.
- The tutorial reuses the production photo deck scaffold, card visual, and swipe motion instead of a separate tutorial clone.
- The three tutorial JPEGs are included in the Xcode Resources build phase.
- Added `.github/workflows/gekko-ios-build.yml` so GEKKO can be compiled on a macOS GitHub runner and the built app bundle can be checked for all three tutorial images.
- Verification PR #36 ran `GEKKO iOS Build` successfully: Xcode build succeeded and the resource checks for `tutorialPractice01.jpg`, `tutorialPractice02.jpg`, and `tutorialPractice03.jpg` all passed. The temporary PR was closed without merge.

## Current focus
- Move from compile/resource verification to a physical-iPhone launch test.
- Required physical-device checks: all 3 leopard gecko tutorial images render, they use the same card/swipe behavior as production, and completion transitions into normal GEKKO.

## Open / needs verification
- Physical iPhone install/signing has not yet been completed from this environment because the device and Apple signing identity are user-side resources.
- Mac/Xcode availability and setup are not yet confirmed.
- After physical-device verification, decide whether GEKKO should be split into a correctly named repository; do not migrate during unrelated fixes.

## Next safe step
1. On the user's Mac, open `ios/be-minimal-native/be-minimal.xcodeproj` in Xcode.
2. Resolve Signing & Capabilities with the user's Apple Account / Personal Team if needed.
3. Connect the user's iPhone, select it as the run destination, and press Run.
4. Verify the 3-image tutorial and transition to normal GEKKO on-device.

## Working rule
Every future ChatGPT session touching this repository must read `PROJECT_STATUS.md` first. Update it with actual changes, verification results, blockers, and the next safe step.
