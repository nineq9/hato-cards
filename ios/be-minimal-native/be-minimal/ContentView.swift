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

private struct PhotoDeckView: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    @State private var reviewPresented = false
    @State private var selectedAsset: SelectedAsset?
    @State private var detailsAsset: SelectedAsset?

    var body: some View {
        ZStack {
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
                    Button {
                        reviewPresented = true
                    } label: {
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

                if library.isLoading && library.candidates.isEmpty {
                    Spacer()
                    ProgressView()
                    Spacer()
                } else if library.visibleCandidates.isEmpty {
                    Spacer()
                    Image(systemName: "checkmark")
                        .font(.system(size: 28, weight: .light))
                        .foregroundStyle(.secondary)
                    Spacer()
                } else {
                    ScrollView(.horizontal) {
                        LazyHStack(spacing: 14) {
                            ForEach(library.visibleCandidates, id: \.localIdentifier) { asset in
                                ThrowCard(asset: asset) {
                                    library.queue(asset)
                                } onTap: {
                                    selectedAsset = SelectedAsset(asset: asset)
                                } onLongPress: {
                                    detailsAsset = SelectedAsset(asset: asset)
                                }
                                .containerRelativeFrame(.horizontal, count: 10, span: 8, spacing: 14)
                            }
                        }
                        .scrollTargetLayout()
                        .padding(.horizontal, 18)
                        .padding(.vertical, 12)
                    }
                    .scrollTargetBehavior(.viewAligned)
                    .scrollIndicators(.hidden)
                }
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

    private var counterText: String {
        let total = max(library.candidates.count, 1)
        let done = library.queuedIDs.count
        return "\(min(done + 1, total)) / \(total)"
    }
}
