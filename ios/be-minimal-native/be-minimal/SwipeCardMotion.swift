import SwiftUI
import UIKit

enum ReviewSwipeDirection: Equatable {
    case left
    case right
}

/// Shared motion layer for both the real photo deck and tutorial practice cards.
/// Keep gesture thresholds/animation/feedback here so practice never drifts from production behavior.
struct SwipeCardMotion<Content: View>: View {
    private let accepts: (ReviewSwipeDirection) -> Bool
    private let onCommit: (ReviewSwipeDirection) -> Void
    private let onRejected: ((ReviewSwipeDirection) -> Void)?
    private let onTap: (() -> Void)?
    private let onLongPress: (() -> Void)?
    private let content: Content

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    @State private var offset: CGSize = .zero
    @State private var rotation: Double = 0
    @State private var scale: CGFloat = 1
    @State private var opacity: Double = 1
    @State private var isResolving = false
    @State private var longPressTriggered = false

    init(
        accepts: @escaping (ReviewSwipeDirection) -> Bool,
        onCommit: @escaping (ReviewSwipeDirection) -> Void,
        onRejected: ((ReviewSwipeDirection) -> Void)? = nil,
        onTap: (() -> Void)? = nil,
        onLongPress: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.accepts = accepts
        self.onCommit = onCommit
        self.onRejected = onRejected
        self.onTap = onTap
        self.onLongPress = onLongPress
        self.content = content()
    }

    var body: some View {
        content
            .offset(offset)
            .rotationEffect(.degrees(rotation))
            .scaleEffect(scale)
            .opacity(opacity)
            .contentShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .simultaneousGesture(cardDragGesture)
            .onTapGesture {
                guard !isResolving, !longPressTriggered else { return }
                onTap?()
            }
            .onLongPressGesture(minimumDuration: 0.5) {
                guard !isResolving, let onLongPress else { return }
                longPressTriggered = true
                onLongPress()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    longPressTriggered = false
                }
            }
    }

    private var cardDragGesture: some Gesture {
        DragGesture(minimumDistance: 4, coordinateSpace: .local)
            .onChanged { value in
                guard !isResolving else { return }

                let dx = value.translation.width
                let dy = value.translation.height
                let resistedX = resistance(dx)

                offset = CGSize(
                    width: resistedX,
                    height: dy * verticalFollow(for: dx, dy: dy)
                )
                rotation = Double(max(-6.5, min(6.5, resistedX / 27)))
                scale = 1 - min(0.034, abs(resistedX) / 3000)
            }
            .onEnded { value in
                guard !isResolving else { return }

                let dx = value.translation.width
                let predictedX = value.predictedEndTranslation.width
                let velocityX = value.velocity.width

                let direction: ReviewSwipeDirection?
                if shouldCommitLeft(dx: dx, predictedX: predictedX, velocityX: velocityX) {
                    direction = .left
                } else if shouldCommitRight(dx: dx, predictedX: predictedX, velocityX: velocityX) {
                    direction = .right
                } else {
                    direction = nil
                }

                guard let direction else {
                    restore()
                    return
                }

                guard accepts(direction) else {
                    onRejected?(direction)
                    restore()
                    return
                }

                dismiss(to: direction, vertical: value.translation.height)
            }
    }

    private func shouldCommitLeft(dx: CGFloat, predictedX: CGFloat, velocityX: CGFloat) -> Bool {
        dx <= -64 || predictedX <= -118 || velocityX <= -620
    }

    private func shouldCommitRight(dx: CGFloat, predictedX: CGFloat, velocityX: CGFloat) -> Bool {
        dx >= 64 || predictedX >= 118 || velocityX >= 620
    }

    private func verticalFollow(for dx: CGFloat, dy: CGFloat) -> CGFloat {
        let horizontalIntent = min(1, abs(dx) / max(abs(dy), 1))
        return 0.08 + 0.22 * horizontalIntent
    }

    private func resistance(_ value: CGFloat) -> CGFloat {
        let sign: CGFloat = value < 0 ? -1 : 1
        let magnitude = abs(value)
        if magnitude < 190 { return value * 0.97 }
        return sign * (184.3 + (magnitude - 190) * 0.44)
    }

    private func restore() {
        let animation: Animation = reduceMotion
            ? .easeOut(duration: 0.08)
            : .interactiveSpring(response: 0.30, dampingFraction: 0.84, blendDuration: 0.08)

        withAnimation(animation) {
            offset = .zero
            rotation = 0
            scale = 1
            opacity = 1
        }
    }

    private func dismiss(to direction: ReviewSwipeDirection, vertical: CGFloat) {
        isResolving = true

        if direction == .left {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } else {
            UISelectionFeedbackGenerator().selectionChanged()
        }

        let targetX: CGFloat = reduceMotion
            ? (direction == .left ? -150 : 150)
            : (direction == .left ? -760 : 760)
        let targetRotation: Double = reduceMotion ? 0 : (direction == .left ? -7 : 7)
        let carriedY = reduceMotion ? 0 : max(-90, min(90, vertical * 0.20))
        let duration = reduceMotion ? 0.08 : 0.19

        withAnimation(.easeOut(duration: duration)) {
            offset = CGSize(width: targetX, height: carriedY)
            rotation = targetRotation
            scale = reduceMotion ? 1 : 0.97
            opacity = 0.03
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            onCommit(direction)
        }
    }
}
