import Foundation

public enum StorageOutcomeSessionError: Error, LocalizedError {
    case notStarted

    public var errorDescription: String? {
        "整理開始時のストレージ値が記録されていません。"
    }
}

/// Integration seam for GEKKO's future photo-cleanup flow.
///
/// Expected use:
/// 1. Call begin() when cleanup starts.
/// 2. Delete assets in GEKKO's existing flow.
/// 3. Call finish(...) after deletion completes.
/// 4. Present StorageOutcomeView with the returned model.
public final class StorageOutcomeSession {
    private let storageProvider: StorageReadingProviding
    private let cumulativeStore: ReclaimedCapacityStoring
    private var beforeSnapshot: StorageSnapshot?

    public init(
        storageProvider: StorageReadingProviding = DeviceStorageProvider(),
        cumulativeStore: ReclaimedCapacityStoring = UserDefaultsReclaimedCapacityStore()
    ) {
        self.storageProvider = storageProvider
        self.cumulativeStore = cumulativeStore
    }

    @discardableResult
    public func begin() throws -> StorageSnapshot {
        let snapshot = try storageProvider.currentSnapshot()
        beforeSnapshot = snapshot
        return snapshot
    }

    public func finish(
        reviewedCount: Int,
        deletedCount: Int,
        deletedBytes: Int64
    ) throws -> CleanupStorageOutcome {
        guard let beforeSnapshot else {
            throw StorageOutcomeSessionError.notStarted
        }

        let afterSnapshot = try storageProvider.currentSnapshot()
        cumulativeStore.addReclaimedBytes(deletedBytes)

        let outcome = CleanupStorageOutcome(
            reviewedCount: reviewedCount,
            deletedCount: deletedCount,
            deletedBytes: deletedBytes,
            before: beforeSnapshot,
            after: afterSnapshot,
            cumulativeReclaimedBytes: cumulativeStore.cumulativeBytes
        )

        self.beforeSnapshot = nil
        return outcome
    }

    public var cumulativeReclaimedBytes: Int64 {
        cumulativeStore.cumulativeBytes
    }
}
