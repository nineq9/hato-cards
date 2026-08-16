import SwiftUI

struct ReviewView: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Label("SAFE BUILD — 写真は削除されません", systemImage: "shield.checkered")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(.thinMaterial, in: Capsule())

                Text(totalText)
                    .font(.system(size: 38, weight: .semibold, design: .rounded))
                    .tracking(-1)

                Text("削除候補として選んだ写真・動画 \(library.queuedAssets.count)枚")
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
                                .accessibilityLabel("候補から戻す")
                            }
                        }
                    }
                }

                Button {
                    library.clearQueueForTest()
                    dismiss()
                } label: {
                    Text("テストを完了")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.black)
                .controlSize(.large)
                .disabled(library.queuedAssets.isEmpty)

                Text("このビルドには写真を削除する処理が含まれていません。")
                    .font(.caption)
                    .foregroundStyle(.tertiary)
                    .multilineTextAlignment(.center)
            }
            .padding(20)
            .navigationTitle("削除候補の確認")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("戻る") { dismiss() }
                }
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
