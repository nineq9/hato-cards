import SwiftUI
import Photos
import UIKit

struct AssetThumbnail: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    let asset: PHAsset
    @State private var image: UIImage?
    @State private var requestID: PHImageRequestID = PHInvalidImageRequestID

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                Color.black.opacity(0.035)
                if let image {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                } else {
                    ProgressView()
                }
            }
            .task(id: proxy.size) {
                let scale = UIScreen.main.scale
                requestID = library.requestThumbnail(
                    for: asset,
                    targetSize: CGSize(width: proxy.size.width * scale, height: proxy.size.height * scale)
                ) { result in
                    Task { @MainActor in image = result }
                }
                library.requestLocalByteCount(for: asset)
            }
        }
        .aspectRatio(0.72, contentMode: .fit)
    }
}

struct AssetSizeBadge: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    let asset: PHAsset

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
        guard let bytes = library.byteCounts[asset.localIdentifier], bytes > 0 else { return "—" }
        return ByteCountFormatter.string(fromByteCount: bytes, countStyle: .file)
    }
}
