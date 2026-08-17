import XCTest
@testable import GEKKOStorageOutcomes

final class StorageOutcomeSessionTests: XCTestCase {
    func testBeforeAfterAndCumulativeValues() throws {
        let provider = SequenceStorageProvider(snapshots: [
            StorageSnapshot(totalBytes: 128_000_000_000, availableBytes: 18_200_000_000),
            StorageSnapshot(totalBytes: 128_000_000_000, availableBytes: 20_000_000_000)
        ])
        let store = InMemoryReclaimedCapacityStore(initialBytes: 10_800_000_000)
        let session = StorageOutcomeSession(storageProvider: provider, cumulativeStore: store)

        let before = try session.begin()
        XCTAssertEqual(before.availableBytes, 18_200_000_000)

        let outcome = try session.finish(
            reviewedCount: 127,
            deletedCount: 73,
            deletedBytes: 1_800_000_000
        )

        XCTAssertEqual(outcome.reviewedCount, 127)
        XCTAssertEqual(outcome.deletedCount, 73)
        XCTAssertEqual(outcome.deletedBytes, 1_800_000_000)
        XCTAssertEqual(outcome.before.availableBytes, 18_200_000_000)
        XCTAssertEqual(outcome.after.availableBytes, 20_000_000_000)
        XCTAssertEqual(outcome.freeSpaceIncreaseBytes, 1_800_000_000)
        XCTAssertEqual(outcome.cumulativeReclaimedBytes, 12_600_000_000)
    }

    func testFinishRequiresBegin() {
        let provider = SequenceStorageProvider(snapshots: [
            StorageSnapshot(totalBytes: 128_000_000_000, availableBytes: 20_000_000_000)
        ])
        let session = StorageOutcomeSession(
            storageProvider: provider,
            cumulativeStore: InMemoryReclaimedCapacityStore()
        )

        XCTAssertThrowsError(
            try session.finish(reviewedCount: 1, deletedCount: 1, deletedBytes: 100)
        )
    }
}

private final class SequenceStorageProvider: StorageReadingProviding {
    private var snapshots: [StorageSnapshot]
    private var index = 0

    init(snapshots: [StorageSnapshot]) {
        self.snapshots = snapshots
    }

    func currentSnapshot() throws -> StorageSnapshot {
        defer { index = min(index + 1, max(0, snapshots.count - 1)) }
        return snapshots[index]
    }
}
