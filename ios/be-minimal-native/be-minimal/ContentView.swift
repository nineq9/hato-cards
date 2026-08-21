import SwiftUI
import Photos
import UIKit

private struct SelectedAsset: Identifiable {
    let asset: PHAsset
    var id: String { asset.localIdentifier }
}

struct ContentView: View {
    @EnvironmentObject private var library: PhotoLibraryStore

    var body: some View {
        Group {
            switch library.authorizationStatus {
            case .authorized, .limited:
                PhotoDeckView()
            case .notDetermined:
                PermissionView()
            default:
                AccessDeniedView()
            }
        }
        .background(Color(red: 0.969, green: 0.961, blue: 0.941).ignoresSafeArea())
    }
}

private struct PermissionView: View {
    @EnvironmentObject private var library: PhotoLibraryStore

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("be minimal")
                .font(.system(size: 28, weight: .semibold, design: .rounded))
                .tracking(-0.4)
            Button("写真を開く") {
                Task { await library.requestAccess() }
            }
            .buttonStyle(.borderedProminent)
            .tint(.black)
            .controlSize(.large)
            Spacer()
        }
        .padding(24)
    }
}

private struct AccessDeniedView: View {
    var body: some View {
        VStack(spacing: 18) {
            Spacer()
            Text("写真へのアクセスが必要です")
                .font(.headline)
            Button("設定を開く") {
                guard let url = URL(string: UIApplication.openSettingsURLString) else { return }
                UIApplication.shared.open(url)
            }
            .buttonStyle(.borderedProminent)
            .tint(.black)
            Spacer()
        }
        .padding(24)
    }
}

struct PhotoDeckScaffold<DeckContent: View>: View {
    let counterText: String
    let onReview: () -> Void
    let canUndo: Bool
    let onUndo: () -> Void
    private let deckContent: DeckContent

    init(
        counterText: String,
        onReview: @escaping () -> Void,
        canUndo: Bool,
        onUndo: @escaping () -> Void,
        @ViewBuilder deckContent: () -> DeckContent
    ) {
        self.counterText = counterText
        self.onReview = onReview
        self.canUndo = canUndo
        self.onUndo = onUndo
        self.deckContent = deckContent()
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("be minimal")
                    .font(.system(size: 17, weight: .semibold))
                    .tracking(-0.2)
                Spacer()
                Text(counterText)
                    .font(.system(size: 13, weight: .regular, design: .monospaced))
                    .foregroundStyle(.secondary)
                Spacer()
                Button(action: onReview) {
                    Image(systemName: "trash")
                        .frame(width: 44, height: 44)
                        .foregroundStyle(.secondary)
                }
                .accessibilityLabel("削除候補を確認")
            }
            .padding(.horizontal, 16)
            .frame(height: 58)

            Image(systemName: "trash")
                .font(.system(size: 20, weight: .regular))
                .foregroundStyle(.secondary)
                .frame(height: 36)

            deckContent

            Button(action: onUndo) {
                Image(systemName: "arrow.uturn.backward")
                    .font(.system(size: 17, weight: .medium))
                    .frame(width: 44, height: 44)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .foregroundStyle(canUndo ? .primary : .tertiary)
            .disabled(!canUndo)
            .accessibilityLabel("ひとつ戻す")
            .padding(.bottom, 8)
        }
    }
}

private struct PhotoDeckView: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    @State private var reviewPresented = false
    @State private var selectedAsset: SelectedAsset?
    @State private var detailsAsset: SelectedAsset?

    var body: some View {
        PhotoDeckScaffold(
            counterText: counterText,
            onReview: { reviewPresented = true },
            canUndo: library.canUndoReview,
            onUndo: { library.undoLastReview() }
        ) {
            if library.isLoading && library.candidates.isEmpty {
                Spacer()
                ProgressView()
                Spacer()
            } else {
                deckStage
            }
        }
        .sheet(isPresented: $reviewPresented) {
            ReviewView()
                .environmentObject(library)
        }
        .fullScreenCover(item: $selectedAsset) { selected in
            AssetViewer(asset: selected.asset)
                .environmentObject(library)
        }
        .sheet(item: $detailsAsset) { selected in
            AssetDetails(asset: selected.asset)
        }
    }

    @ViewBuilder
    private var deckStage: some View {
        GeometryReader { proxy in
            let visible = Array(library.visibleCandidates.prefix(3))

            if visible.isEmpty {
                VStack(spacing: 12) {
                    Spacer()
                    Image(systemName: "checkmark")
                        .font(.system(size: 28, weight: .light))
                        .foregroundStyle(.secondary)
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ZStack {
                    ForEach(visible.indices.reversed(), id: \.self) { index in
                        let asset = visible[index]
                        let depth = CGFloat(index)
                        let width = min(proxy.size.width - 40, 430)
                        let height = min(proxy.size.height - 42, 650)

                        if index == 0 {
                            ThrowCard(
                                asset: asset,
                                onDiscard: { library.queue(asset) },
                                onPass: { library.pass(asset) },
                                onTap: { selectedAsset = SelectedAsset(asset: asset) },
                                onLongPress: { detailsAsset = SelectedAsset(asset: asset) }
                            )
                            .frame(width: width, height: height)
                            .zIndex(10)
                        } else {
                            ReviewCardVisual(media: .asset(asset), style: .stacked)
                                .frame(width: width, height: height)
                                .scaleEffect(1 - depth * 0.026)
                                .offset(y: depth * 10)
                                .opacity(1 - Double(depth) * 0.14)
                                .allowsHitTesting(false)
                                .zIndex(Double(3 - index))
                        }
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }

    private var counterText: String {
        let total = max(library.candidates.count, 1)
        let done = library.reviewedCount
        if done >= total { return "\(total) / \(total)" }
        return "\(done + 1) / \(total)"
    }
}
