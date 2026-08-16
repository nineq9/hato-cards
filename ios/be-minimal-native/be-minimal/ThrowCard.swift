import SwiftUI
import Photos
import UIKit

struct ThrowCard: View {
    let asset: PHAsset
    let onThrow: () -> Void
    let onTap: () -> Void
    let onLongPress: () -> Void

    @State private var offset: CGSize = .zero
    @State private var scale: CGFloat = 1
    @State private var opacity: Double = 1
    @State private var isThrowing = false
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
            .scaleEffect(scale)
            .opacity(opacity)
            .simultaneousGesture(verticalGesture)
            .onTapGesture {
                guard !isThrowing && !longPressTriggered else { return }
                onTap()
            }
            .onLongPressGesture(minimumDuration: 0.5) {
                longPressTriggered = true
                onLongPress()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { longPressTriggered = false }
            }
            .accessibilityLabel(asset.mediaType == .video ? "動画" : "写真")
    }

    private var verticalGesture: some Gesture {
        DragGesture(minimumDistance: 8, coordinateSpace: .local)
            .onChanged { value in
                guard !isThrowing else { return }
                let dx = value.translation.width
                let dy = value.translation.height
                guard abs(dy) > abs(dx) * 1.05 else { return }

                if dy > 0 {
                    let resistedY = resistance(dy)
                    offset = CGSize(width: dx * 0.12, height: resistedY)
                    scale = 1 + min(0.035, resistedY / 6000)
                } else {
                    offset = CGSize(width: dx * 0.05, height: dy * 0.92)
                    scale = 1
                }
            }
            .onEnded { value in
                guard !isThrowing else { return }
                let dx = value.translation.width
                let dy = value.translation.height
                guard abs(dy) > abs(dx) * 0.9 else {
                    restore()
                    return
                }

                let predictedY = value.predictedEndTranslation.height
                if dy > 42 {
                    slingshot(from: CGSize(width: dx * 0.12, height: resistance(dy)))
                } else if dy < -42 || predictedY < -120 {
                    directThrow(horizontal: dx)
                } else {
                    restore()
                }
            }
    }

    private func resistance(_ value: CGFloat) -> CGFloat {
        if value < 180 { return value * 0.82 }
        return 147.6 + (value - 180) * 0.35
    }

    private func restore() {
        withAnimation(.interpolatingSpring(mass: 0.55, stiffness: 320, damping: 23, initialVelocity: 0)) {
            offset = .zero
            scale = 1
            opacity = 1
        }
    }

    private func directThrow(horizontal: CGFloat) {
        isThrowing = true
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        withAnimation(.easeOut(duration: 0.10)) {
            offset = CGSize(width: horizontal * 0.12, height: -900)
            scale = 0.96
            opacity = 0.02
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.11) { onThrow() }
    }

    private func slingshot(from pulled: CGSize) {
        isThrowing = true
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        withAnimation(.interpolatingSpring(mass: 0.45, stiffness: 560, damping: 18, initialVelocity: 0)) {
            offset = .zero
            scale = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.055) {
            withAnimation(.easeOut(duration: 0.115)) {
                offset = CGSize(width: -pulled.width * 0.35, height: -980)
                scale = 0.95
                opacity = 0.01
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) { onThrow() }
    }
}
