import Foundation
import Photos
import UIKit
import AVFoundation

@MainActor
final class PhotoLibraryStore: NSObject, ObservableObject, PHPhotoLibraryChangeObserver {
    @Published private(set) var authorizationStatus: PHAuthorizationStatus = PHPhotoLibrary.authorizationStatus(for: .readWrite)
    @Published private(set) var candidates: [PHAsset] = []
    @Published private(set) var queuedIDs: Set<String> = []
    @Published private(set) var byteCounts: [String: Int64] = [:]
    @Published private(set) var isLoading = false
    @Published var lastError: String?

    private let imageManager = PHCachingImageManager()
    private let resourceManager = PHAssetResourceManager.default()

    override init() {
        super.init()
        PHPhotoLibrary.shared().register(self)
        if authorizationStatus == .authorized || authorizationStatus == .limited {
            Task { await reloadCandidates() }
        }
    }

    deinit {
        PHPhotoLibrary.shared().unregisterChangeObserver(self)
    }

    var visibleCandidates: [PHAsset] {
        candidates.filter { !queuedIDs.contains($0.localIdentifier) }
    }

    var queuedAssets: [PHAsset] {
        candidates.filter { queuedIDs.contains($0.localIdentifier) }
    }

    var knownQueuedBytes: Int64 {
        queuedAssets.reduce(0) { $0 + (byteCounts[$1.localIdentifier] ?? 0) }
    }

    func requestAccess() async {
        let status = await PHPhotoLibrary.requestAuthorization(for: .readWrite)
        authorizationStatus = status
        if status == .authorized || status == .limited {
            await reloadCandidates()
        }
    }

    func reloadCandidates() async {
        guard authorizationStatus == .authorized || authorizationStatus == .limited else { return }
        isLoading = true
        lastError = nil

        let recent = fetchAssets(ascending: false, limit: 400)
        let old = fetchAssets(ascending: true, limit: 400)
        var unique: [String: PHAsset] = [:]
        for asset in recent + old {
            unique[asset.localIdentifier] = asset
        }

        let now = Date()
        let ranked = unique.values
            .filter { !$0.isFavorite && !$0.isHidden }
            .sorted { score($0, now: now) > score($1, now: now) }

        candidates = Array(ranked.prefix(100))
        queuedIDs = queuedIDs.intersection(Set(candidates.map(\.localIdentifier)))
        isLoading = false

        for asset in candidates.prefix(8) {
            requestLocalByteCount(for: asset)
        }
    }

    private func fetchAssets(ascending: Bool, limit: Int) -> [PHAsset] {
        let options = PHFetchOptions()
        options.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: ascending)]
        options.fetchLimit = limit
        let result = PHAsset.fetchAssets(with: options)
        var assets: [PHAsset] = []
        assets.reserveCapacity(result.count)
        result.enumerateObjects { asset, _, _ in assets.append(asset) }
        return assets
    }

    private func score(_ asset: PHAsset, now: Date) -> Double {
        var value = 0.0
        if asset.mediaSubtypes.contains(.photoScreenshot) { value += 120 }
        if asset.representsBurst { value += 45 }
        if asset.mediaType == .video {
            value += 18
            value += min(asset.duration / 30.0, 40)
        }
        if let date = asset.creationDate {
            let days = max(0, now.timeIntervalSince(date) / 86_400)
            value += min(days / 45.0, 80)
        }
        return value
    }

    func queue(_ asset: PHAsset) {
        queuedIDs.insert(asset.localIdentifier)
        requestLocalByteCount(for: asset)
    }

    func restore(_ asset: PHAsset) {
        queuedIDs.remove(asset.localIdentifier)
    }

    func requestThumbnail(for asset: PHAsset, targetSize: CGSize, completion: @escaping (UIImage?) -> Void) -> PHImageRequestID {
        let options = PHImageRequestOptions()
        options.deliveryMode = .opportunistic
        options.resizeMode = .fast
        options.isNetworkAccessAllowed = true
        return imageManager.requestImage(
            for: asset,
            targetSize: targetSize,
            contentMode: .aspectFit,
            options: options
        ) { image, _ in completion(image) }
    }

    func requestFullImage(for asset: PHAsset, completion: @escaping (UIImage?) -> Void) {
        let options = PHImageRequestOptions()
        options.deliveryMode = .highQualityFormat
        options.resizeMode = .none
        options.isNetworkAccessAllowed = true
        imageManager.requestImageDataAndOrientation(for: asset, options: options) { data, _, _, _ in
            completion(data.flatMap(UIImage.init(data:)))
        }
    }

    func requestPlayerItem(for asset: PHAsset, completion: @escaping (AVPlayerItem?) -> Void) {
        let options = PHVideoRequestOptions()
        options.deliveryMode = .automatic
        options.isNetworkAccessAllowed = true
        imageManager.requestPlayerItem(forVideo: asset, options: options) { item, _ in completion(item) }
    }

    func requestLocalByteCount(for asset: PHAsset) {
        let id = asset.localIdentifier
        guard byteCounts[id] == nil else { return }
        guard let resource = PHAssetResource.assetResources(for: asset).first else { return }
        let options = PHAssetResourceRequestOptions()
        options.isNetworkAccessAllowed = false
        var total: Int64 = 0
        resourceManager.requestData(for: resource, options: options) { data in
            total += Int64(data.count)
        } completionHandler: { [weak self] error in
            guard error == nil, total > 0 else { return }
            Task { @MainActor in self?.byteCounts[id] = total }
        }
    }

    func deleteQueued() async -> Bool {
        let assets = queuedAssets
        guard !assets.isEmpty else { return true }
        do {
            try await PHPhotoLibrary.shared().performChanges {
                PHAssetChangeRequest.deleteAssets(assets as NSArray)
            }
            queuedIDs.removeAll()
            await reloadCandidates()
            return true
        } catch {
            lastError = error.localizedDescription
            return false
        }
    }

    nonisolated func photoLibraryDidChange(_ changeInstance: PHChange) {
        Task { @MainActor [weak self] in
            await self?.reloadCandidates()
        }
    }
}
