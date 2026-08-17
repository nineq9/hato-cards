import SwiftUI
import Photos
import UIKit

struct ThrowCard: View {
    let asset: PHAsset
    let onDiscard: () -> Void
    let onPass: () -> Void
    let onTap: () -> Void
    let onLongPress: () -> Void

    @State private var offset: CGSize = .zero
    @State private var rotation: Double = 0
    @State private var scale: CGFloat = 1
    @State private var opacity: Double = 1
    @State private var isResolving = false
    @State private var longPressTriggered = false

    var body: some View {
        AssetThumbnail(asset: asset)
            .background(Color.black.opacity(0.03))
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .shadow(color: .black.opacity(0.07), radius: 20, y: 10)
            .overlay(alignment: .bottomTrailing) {
                AssetSizeBadge(asset: asset)
                    .padding(13)
            }
            .offset(offset)
            .rotationEffect(.degrees(rotation))
            .scaleEffect(scale)
            .opacity(opacity)
            .contentShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .simultaneousGesture(cardDragGesture)
            .onTapGesture {
                guard !isResolving && !longPressTriggered else { return }
                onTap()
            }
            .onLongPressGesture(minimumDuration: 0.5) {
                guard !isResolving else { return }
                longPressTriggered = true
                onLongPress()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    longPressTriggered = false
                }
            }
            .accessibilityLabel(asset.mediaType == .video ? "動画" : "写真")
            .accessibilityAction(named: "削除候補に入れる") { onDiscard() }
            .accessibilityAction(named: "残して次へ") { onPass() }
    }

    // Apple-like direct manipulation: the card starts following the finger immediately.
    // We deliberately do NOT reject diagonal drags by comparing x/y angles.
    // The action is resolved from horizontal distance, predicted end position, and velocity.
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

                if shouldCommitLeft(dx: dx, predictedX: predictedX, velocityX: velocityX) {
                    dismiss(to: .left, vertical: value.translation.height)
                } else if shouldCommitRight(dx: dx, predictedX: predictedX, velocityX: velocityX) {
                    dismiss(to: .right, vertical: value.translation.height)
                } else {
                    restore()
                }
            }
    }

    private enum Direction {
        case left
        case right
    }

    private func shouldCommitLeft(dx: CGFloat, predictedX: CGFloat, velocityX: CGFloat) -> Bool {
        dx <= -64 || predictedX <= -118 || velocityX <= -620
    }

    private func shouldCommitRight(dx: CGFloat, predictedX: CGFloat, velocityX: CGFloat) -> Bool {
        dx >= 64 || predictedX >= 118 || velocityX >= 620
    }

    private func verticalFollow(for dx: CGFloat, dy: CGFloat) -> CGFloat {
        // Follow diagonal finger movement enough to feel direct, but keep the card's semantic axis horizontal.
        // A nearly vertical drag therefore moves only a little and springs back instead of firing accidentally.
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
        withAnimation(.interactiveSpring(response: 0.30, dampingFraction: 0.84, blendDuration: 0.08)) {
            offset = .zero
            rotation = 0
            scale = 1
            opacity = 1
        }
    }

    private func dismiss(to direction: Direction, vertical: CGFloat) {
        isResolving = true

        let isDiscard = direction == .left
        if isDiscard {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } else {
            UISelectionFeedbackGenerator().selectionChanged()
        }

        let targetX: CGFloat = direction == .left ? -760 : 760
        let targetRotation: Double = direction == .left ? -7 : 7
        let carriedY = max(-90, min(90, vertical * 0.20))

        withAnimation(.easeOut(duration: 0.19)) {
            offset = CGSize(width: targetX, height: carriedY)
            rotation = targetRotation
            scale = 0.97
            opacity = 0.03
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.19) {
            if isDiscard {
                onDiscard()
            } else {
                onPass()
            }
        }
    }
}
