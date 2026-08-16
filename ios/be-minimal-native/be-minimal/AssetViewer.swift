import SwiftUI
import Photos
import AVKit
import UIKit

struct AssetViewer: View {
    @EnvironmentObject private var library: PhotoLibraryStore
    @Environment(\.dismiss) private var dismiss
    let asset: PHAsset
    @State private var image: UIImage?
    @State private var player: AVPlayer?

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            if asset.mediaType == .video {
                if let player {
                    NativePlayer(player: player)
                        .ignoresSafeArea()
                } else {
                    ProgressView().tint(.white)
                }
            } else if let image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .ignoresSafeArea()
            } else {
                ProgressView().tint(.white)
            }
        }
        .overlay(alignment: .topLeading) {
            Button { dismiss() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 44, height: 44)
                    .background(.black.opacity(0.38), in: Circle())
            }
            .padding(.top, 8)
            .padding(.leading, 12)
        }
        .task {
            if asset.mediaType == .video {
                library.requestPlayerItem(for: asset) { item in
                    Task { @MainActor in
                        if let item { player = AVPlayer(playerItem: item) }
                    }
                }
            } else {
                library.requestFullImage(for: asset) { result in
                    Task { @MainActor in image = result }
                }
            }
        }
    }
}

struct NativePlayer: UIViewControllerRepresentable {
    let player: AVPlayer

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = player
        controller.showsPlaybackControls = true
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        uiViewController.player = player
    }
}

struct AssetDetails: View {
    @Environment(\.dismiss) private var dismiss
    let asset: PHAsset

    var body: some View {
        NavigationStack {
            List {
                if let date = asset.creationDate {
                    LabeledContent("撮影日時", value: date.formatted(date: .abbreviated, time: .shortened))
                }
                LabeledContent("種類", value: asset.mediaType == .video ? "動画" : "写真")
                LabeledContent("サイズ", value: "\(asset.pixelWidth) × \(asset.pixelHeight)")
                if asset.mediaType == .video {
                    LabeledContent("長さ", value: durationText)
                }
                if let location = asset.location {
                    LabeledContent("位置", value: String(format: "%.5f, %.5f", location.coordinate.latitude, location.coordinate.longitude))
                }
            }
            .navigationTitle("詳細")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("閉じる") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium])
    }

    private var durationText: String {
        let total = Int(asset.duration.rounded())
        return String(format: "%d:%02d", total / 60, total % 60)
    }
}
