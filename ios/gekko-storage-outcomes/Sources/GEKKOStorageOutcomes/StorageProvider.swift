import Foundation

public protocol StorageReadingProviding {
    func currentSnapshot() throws -> StorageSnapshot
}

public enum DeviceStorageError: Error, LocalizedError {
    case volumeURLUnavailable
    case capacityUnavailable

    public var errorDescription: String? {
        switch self {
        case .volumeURLUnavailable:
            return "端末ストレージの参照先を取得できませんでした。"
        case .capacityUnavailable:
            return "端末ストレージ容量を取得できませんでした。"
        }
    }
}

public struct DeviceStorageProvider: StorageReadingProviding {
    public init() {}

    public func currentSnapshot() throws -> StorageSnapshot {
        let fileManager = FileManager.default
        guard let volumeURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            throw DeviceStorageError.volumeURLUnavailable
        }

        let values = try volumeURL.resourceValues(forKeys: [
            .volumeTotalCapacityKey,
            .volumeAvailableCapacityKey
        ])

        guard let total = values.volumeTotalCapacity,
              let available = values.volumeAvailableCapacity else {
            throw DeviceStorageError.capacityUnavailable
        }

        return StorageSnapshot(
            totalBytes: Int64(total),
            availableBytes: Int64(available)
        )
    }
}
