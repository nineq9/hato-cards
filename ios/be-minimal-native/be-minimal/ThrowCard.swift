import SwiftUI
import Photos
import UIKit

enum ReviewCardMedia {
    case asset(PHAsset)
    case tutorial(TutorialPracticeImage)
}

enum ReviewCardVisualStyle: Equatable {
    case front
    case stacked
}

struct ThrowCard: View {
    private let media: ReviewCardMedia
    private let onDiscard: () -> Void
    private let onPass: () -> Void
    private let onTap: (() -> Void)?
    private let onLongPress: (() -> Void)?

    init(
        asset: PHAsset,
        onDiscard: @escaping () -> Void,
        onPass: @escaping () -> Void,
        onTap: @escaping () -> Void,
        onLongPress: @escaping () -> Void
    ) {
        media = .asset(asset)
        self.onDiscard = onDiscard
        self.onPass = onPass
        self.onTap = onTap
        self.onLongPress = onLongPress
    }

    init(
        tutorialImage: TutorialPracticeImage,
        onDiscard: @escaping () -> Void,
        onPass: @escaping () -> Void
    ) {
        media = .tutorial(tutorialImage)
        self.onDiscard = onDiscard
        self.onPass = onPass
        onTap = nil
        onLongPress = nil
    }

    var body: some View {
        SwipeCardMotion(
            accepts: { direction in direction != .up },
            onCommit: { direction in
                switch direction {
                case .left:
                    onDiscard()
                case .right:
                    onPass()
                case .up:
                    break
                }
            },
            onTap: onTap,
            onLongPress: onLongPress
        ) {
            ReviewCardVisual(media: media, style: .front)
        }
        .accessibilityLabel(accessibilityLabel)
        .accessibilityHint("左右のスワイプ、またはアクションで整理できます")
        .accessibilityAction(named: "削除候補に入れる") { onDiscard() }
        .accessibilityAction(named: "残して次へ") { onPass() }
    }

    private var accessibilityLabel: String {
        switch media {
        case .asset(let asset):
            return asset.mediaType == .video ? "動画" : "写真"
        case .tutorial:
            return "練習用の写真"
        }
    }
}

struct ReviewCardVisual: View {
    let media: ReviewCardMedia
    let style: ReviewCardVisualStyle

    var body: some View {
        mediaContent
            .background(Color.black.opacity(style == .front ? 0.03 : 0.025))
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .shadow(
                color: .black.opacity(style == .front ? 0.07 : 0.035),
                radius: style == .front ? 20 : 12,
                y: style == .front ? 10 : 7
            )
            .overlay(alignment: .bottomTrailing) {
                if style == .front {
                    sizeBadge.padding(13)
                }
            }
    }

    @ViewBuilder
    private var mediaContent: some View {
        switch media {
        case .asset(let asset):
            AssetThumbnail(asset: asset)
        case .tutorial(let image):
            TutorialPracticeThumbnail(item: image)
        }
    }

    @ViewBuilder
    private var sizeBadge: some View {
        switch media {
        case .asset(let asset):
            AssetSizeBadge(asset: asset)
        case .tutorial(let image):
            TutorialSizeBadge(byteCount: image.byteCount)
        }
    }
}

private struct TutorialPracticeThumbnail: View {
    let item: TutorialPracticeImage

    var body: some View {
        GeometryReader { _ in
            ZStack {
                Color.black.opacity(0.035)
                Image(uiImage: item.image)
                    .resizable()
                    .scaledToFit()
            }
        }
        .aspectRatio(0.72, contentMode: .fit)
    }
}

private struct TutorialSizeBadge: View {
    let byteCount: Int64

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: "cellularbars")
                .font(.system(size: 12))
            Text(sizeText)
                .font(.system(size: 11, weight: .semibold, design: .rounded))
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 9)
        .frame(height: 29)
        .background(.black.opacity(0.42), in: Capsule())
    }

    private var sizeText: String {
        guard byteCount > 0 else { return "—" }
        return ByteCountFormatter.string(fromByteCount: byteCount, countStyle: .file)
    }
}
