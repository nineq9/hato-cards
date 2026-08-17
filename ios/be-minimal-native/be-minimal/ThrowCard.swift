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
            .simultaneousGesture(horizontalCardGesture)
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

    private var horizontalCardGesture: some Gesture {
        DragGesture(minimumDistance: 6, coordinateSpace: .local)
            .onChanged { value in
                guard !isResolving else { return }

                let dx = value.translation.width
                let dy = value.translation.height
                guard abs(dx) > abs(dy) * 1.05 else { return }

                let resistedX = resistance(dx)
                offset = CGSize(width: resistedX, height: dy * 0.06)
                rotation = Double(max(-6, min(6, resistedX / 28)))
                scale = 1 - min(0.032, abs(resistedX) / 3200)
            }
            .onEnded { value in
                guard !isResolving else { return }

                let dx = value.translation.width
                let dy = value.translation.height
                guard abs(dx) > abs(dy) * 0.9 else {
                    restore()
                    return
                }

                let predictedX = value.predictedEndTranslation.width
                if dx < -82 || predictedX < -150 {
                    dismiss(to: .left)
                } else if dx > 82 || predictedX > 150 {
                    dismiss(to: .right)
                } else {
                    restore()
                }
            }
    }

    private enum Direction {
        case left
        case right
    }

    private func resistance(_ value: CGFloat) -> CGFloat {
        let sign: CGFloat = value < 0 ? -1 : 1
        let magnitude = abs(value)
        if magnitude < 180 { return value * 0.94 }
        return sign * (169.2 + (magnitude - 180) * 0.42)
    }

    private func restore() {
        withAnimation(.interactiveSpring(response: 0.28, dampingFraction: 0.86, blendDuration: 0.08)) {
            offset = .zero
            rotation = 0
            scale = 1
            opacity = 1
        }
    }

    private func dismiss(to direction: Direction) {
        isResolving = true

        let isDiscard = direction == .left
        if isDiscard {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } else {
            UISelectionFeedbackGenerator().selectionChanged()
        }

        let targetX: CGFloat = direction == .left ? -720 : 720
        let targetRotation: Double = direction == .left ? -7 : 7

        withAnimation(.easeOut(duration: 0.18)) {
            offset = CGSize(width: targetX, height: -8)
            rotation = targetRotation
            scale = 0.97
            opacity = 0.04
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) {
            if isDiscard {
                onDiscard()
            } else {
                onPass()
            }
        }
    }
}
