import Foundation

public struct StorageSnapshot: Equatable, Sendable {
    public let totalBytes: Int64
    public let availableBytes: Int64
    public let capturedAt: Date

    public init(totalBytes: Int64, availableBytes: Int64, capturedAt: Date = .now) {
        self.totalBytes = max(0, totalBytes)
        self.availableBytes = max(0, availableBytes)
        self.capturedAt = capturedAt
    }

    public var usedBytes: Int64 {
        max(0, totalBytes - availableBytes)
    }
}

public struct CleanupStorageOutcome: Equatable, Sendable {
    public let reviewedCount: Int
    public let deletedCount: Int
    public let deletedBytes: Int64
    public let before: StorageSnapshot
    public let after: StorageSnapshot
    public let cumulativeReclaimedBytes: Int64

    public init(
        reviewedCount: Int,
        deletedCount: Int,
        deletedBytes: Int64,
        before: StorageSnapshot,
        after: StorageSnapshot,
        cumulativeReclaimedBytes: Int64
    ) {
        self.reviewedCount = max(0, reviewedCount)
        self.deletedCount = max(0, deletedCount)
        self.deletedBytes = max(0, deletedBytes)
        self.before = before
        self.after = after
        self.cumulativeReclaimedBytes = max(0, cumulativeReclaimedBytes)
    }

    /// Actual change observed in device free space. This can differ from deletedBytes
    /// because iOS may reclaim/cache storage asynchronously.
    public var freeSpaceIncreaseBytes: Int64 {
        max(0, after.availableBytes - before.availableBytes)
    }
}

public enum StorageByteFormatter {
    public static func string(_ bytes: Int64) -> String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useMB, .useGB, .useTB]
        formatter.countStyle = .file
        formatter.includesUnit = true
        formatter.isAdaptive = true
        return formatter.string(fromByteCount: max(0, bytes))
    }
}

public extension CleanupStorageOutcome {
    static let mock = CleanupStorageOutcome(
        reviewedCount: 127,
        deletedCount: 73,
        deletedBytes: 1_800_000_000,
        before: StorageSnapshot(
            totalBytes: 128_000_000_000,
            availableBytes: 18_200_000_000
        ),
        after: StorageSnapshot(
            totalBytes: 128_000_000_000,
            availableBytes: 20_000_000_000
        ),
        cumulativeReclaimedBytes: 12_600_000_000
    )
}
