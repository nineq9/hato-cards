# Apple HIG research note — CARDS horizontal dismiss

Date: 2026-08-18
Scope: KAWASEMI CARDS / Menu interaction quality for Issue #25.

## Official Apple references

- Gestures — https://developer.apple.com/design/human-interface-guidelines/gestures/
- Motion — https://developer.apple.com/design/human-interface-guidelines/motion
- Feedback — https://developer.apple.com/design/human-interface-guidelines/feedback
- Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility/

## Interaction principles applied to KAWASEMI

1. **Direct manipulation must feel direct.** Apple describes gestures as physical motions that directly affect objects and recommends responsive feedback that helps people predict the result. In CARDS, the article card therefore stays still during the neutral/read-intent region, then follows the finger once horizontal dismiss intent is established.

2. **Completion motion should agree with the gesture and expectation.** Apple recommends realistic feedback motion that follows gestures and expectations. KAWASEMI therefore uses one physical rule after commit: LEFT continues out left; RIGHT continues out right. A successful SAVE must not reverse direction and snap back.

3. **Cancellation is different from completion.** A short or ambiguous motion may return the card to its reading position. A committed action does not. This makes the visual result explain whether the system accepted the action.

4. **Preserve familiar mobile behavior and native reading.** Apple recommends supporting familiar standard gestures and avoiding conflicts with system interactions. CARDS keeps vertical reading on native `pan-y` wherever possible and only claims a horizontal gesture after credible dismiss intent.

5. **Feedback should be continuous but proportionate.** Apple recommends clear, consistent feedback and purposeful motion. SAVE can show restrained bookmark feedback during the drag, but no decorative bounce, repeated vibration, or delayed confirmation motion is added.

6. **Do not depend on perfect straight-line input.** The gesture is interpreted by intent rather than requiring a mathematically horizontal trajectory. Human-like QA includes diagonal / curved thumb arcs, READ wobble, slow deliberate dismissals, fast flicks, and ambiguous cancellation.

7. **Keep an explicit alternative where the product already has one.** Menu retains the close button and backdrop tap while adding swipe-to-close. This follows Apple accessibility guidance that gesture-only functionality benefits from alternative controls.

## KAWASEMI-specific boundary

These references inform interaction behavior only. The implementation does not copy Apple visual styling. KAWASEMI keeps its own typography, color, card geometry, and editorial visual language.

Physical iPhone / Safari tactile quality remains a separate Owner device-review gate; Chromium touch automation is not a substitute for that judgment.
