import Foundation

public protocol ReclaimedCapacityStoring: AnyObject {
    var cumulativeBytes: Int64 { get }
    func addReclaimedBytes(_ bytes: Int64)
    func reset()
}

public final class UserDefaultsReclaimedCapacityStore: ReclaimedCapacityStoring {
    private let defaults: UserDefaults
    private let key: String

    public init(
        defaults: UserDefaults = .standard,
        key: String = "gekko.storage.cumulativeReclaimedBytes"
    ) {
        self.defaults = defaults
        self.key = key
    }

    public var cumulativeBytes: Int64 {
        (defaults.object(forKey: key) as? NSNumber)?.int64Value ?? 0
    }

    public func addReclaimedBytes(_ bytes: Int64) {
        let amount = max(0, bytes)
        guard amount > 0 else { return }
        defaults.set(NSNumber(value: cumulativeBytes + amount), forKey: key)
    }

    public func reset() {
        defaults.removeObject(forKey: key)
    }
}

public final class InMemoryReclaimedCapacityStore: ReclaimedCapacityStoring {
    public private(set) var cumulativeBytes: Int64

    public init(initialBytes: Int64 = 0) {
        self.cumulativeBytes = max(0, initialBytes)
    }

    public func addReclaimedBytes(_ bytes: Int64) {
        cumulativeBytes += max(0, bytes)
    }

    public func reset() {
        cumulativeBytes = 0
    }
}
