import SwiftUI
import Photos

struct ReviewView: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    @Environment(\.dismiss) private var dismiss
    @State private var deleting = false
    @State private var showConfirm = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text(totalText)
                    .font(.system(size: 38, weight: .semibold, design: .rounded))
                    .tracking(-1)
                Text("写真・動画 \(library.queuedAssets.count)枚")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                ScrollView {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 82), spacing: 8)], spacing: 8) {
                        ForEach(library.queuedAssets, id: \.localIdentifier) { asset in
                            ZStack(alignment: .topTrailing) {
                                AssetThumbnail(asset: asset)
                                    .frame(height: 112)
                                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                                Button {
                                    library.restore(asset)
                                } label: {
                                    Image(systemName: "xmark.circle.fill")
                                        .symbolRenderingMode(.palette)
                                        .foregroundStyle(.white, .black.opacity(0.55))
                                        .font(.system(size: 22))
                                }
                                .padding(5)
                            }
                        }
                    }
                }

                Button {
                    showConfirm = true
                } label: {
                    if deleting {
                        ProgressView().tint(.white)
                    } else {
                        Text("削除する")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(.black)
                .controlSize(.large)
                .disabled(library.queuedAssets.isEmpty || deleting)
            }
            .padding(20)
            .navigationTitle("これらを削除しますか？")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("戻る") { dismiss() }
                }
            }
            .confirmationDialog(
                "写真アプリから削除します",
                isPresented: $showConfirm,
                titleVisibility: .visible
            ) {
                Button("\(library.queuedAssets.count)枚を削除", role: .destructive) {
                    deleting = true
                    Task {
                        let success = await library.deleteQueued()
                        deleting = false
                        if success { dismiss() }
                    }
                }
                Button("キャンセル", role: .cancel) {}
            } message: {
                Text("削除した写真・動画は、iPhoneの写真アプリの「最近削除した項目」に移動します。")
            }
        }
        .presentationDetents([.large])
    }

    private var totalText: String {
        let bytes = library.knownQueuedBytes
        if bytes == 0 { return "\(library.queuedAssets.count)枚" }
        return ByteCountFormatter.string(fromByteCount: bytes, countStyle: .file)
    }
}
