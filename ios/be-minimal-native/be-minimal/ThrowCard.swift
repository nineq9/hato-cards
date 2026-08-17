import SwiftUI
import Photos

struct ThrowCard: View {
    let asset: PHAsset
    let onDiscard: () -> Void
    let onPass: () -> Void
    let onTap: () -> Void
    let onLongPress: () -> Void

    var body: some View {
        SwipeCardMotion(
            accepts: { _ in true },
            onCommit: { direction in
                if direction == .left {
                    onDiscard()
                } else {
                    onPass()
                }
            },
            onTap: onTap,
            onLongPress: onLongPress
        ) {
            AssetThumbnail(asset: asset)
                .background(Color.black.opacity(0.03))
                .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
                .shadow(color: .black.opacity(0.07), radius: 20, y: 10)
                .overlay(alignment: .bottomTrailing) {
                    AssetSizeBadge(asset: asset)
                        .padding(13)
                }
        }
        .accessibilityLabel(asset.mediaType == .video ? "動画" : "写真")
        .accessibilityHint("左右のスワイプ、またはアクションで整理できます")
        .accessibilityAction(named: "削除候補に入れる") { onDiscard() }
        .accessibilityAction(named: "残して次へ") { onPass() }
    }
}
