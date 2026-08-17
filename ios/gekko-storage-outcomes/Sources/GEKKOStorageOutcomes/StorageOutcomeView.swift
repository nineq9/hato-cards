import SwiftUI

public struct StorageOutcomeView: View {
    public let outcome: CleanupStorageOutcome

    public init(outcome: CleanupStorageOutcome) {
        self.outcome = outcome
    }

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                header
                reclaimedHero
                storageBeforeAfter
                cumulative
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 28)
            .frame(maxWidth: 560, alignment: .leading)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemBackground))
        .foregroundStyle(.primary)
        .accessibilityElement(children: .contain)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("今日もすっきり。")
                .font(.title2.weight(.semibold))

            HStack(spacing: 18) {
                Label("\(outcome.reviewedCount)枚 整理", systemImage: "photo.on.rectangle.angled")
                Label("\(outcome.deletedCount)枚 削除", systemImage: "trash")
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)
            .accessibilityElement(children: .combine)
        }
    }

    private var reclaimedHero: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(StorageByteFormatter.string(outcome.deletedBytes))
                .font(.system(.largeTitle, design: .rounded, weight: .semibold))
                .monospacedDigit()
                .minimumScaleFactor(0.75)
                .lineLimit(1)

            Text("取り戻しました")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("今回取り戻した容量 \(StorageByteFormatter.string(outcome.deletedBytes))")
    }

    private var storageBeforeAfter: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("iPhoneストレージ")
                .font(.headline)

            StorageUsageBar(snapshot: outcome.after)

            HStack(alignment: .center, spacing: 12) {
                freeSpaceValue(title: "整理前", bytes: outcome.before.availableBytes)

                Image(systemName: "arrow.right")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.tertiary)
                    .accessibilityHidden(true)

                freeSpaceValue(title: "整理後", bytes: outcome.after.availableBytes)
            }

            Text("+\(StorageByteFormatter.string(outcome.freeSpaceIncreaseBytes))")
                .font(.title3.weight(.semibold))
                .monospacedDigit()
                .accessibilityLabel("今回増えた空き容量 \(StorageByteFormatter.string(outcome.freeSpaceIncreaseBytes))")
        }
        .padding(20)
        .background(Color(uiColor: .secondarySystemBackground), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
    }

    private func freeSpaceValue(title: String, bytes: Int64) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text("\(StorageByteFormatter.string(bytes)) FREE")
                .font(.headline)
                .monospacedDigit()
                .minimumScaleFactor(0.72)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var cumulative: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("GEKKO累計")
                .font(.caption)
                .foregroundStyle(.secondary)

            Text("\(StorageByteFormatter.string(outcome.cumulativeReclaimedBytes)) reclaimed")
                .font(.title3.weight(.medium))
                .monospacedDigit()
                .minimumScaleFactor(0.72)
                .lineLimit(1)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("GEKKOでこれまで取り戻した累計容量 \(StorageByteFormatter.string(outcome.cumulativeReclaimedBytes))")
    }
}

private struct StorageUsageBar: View {
    let snapshot: StorageSnapshot

    private var usedFraction: Double {
        guard snapshot.totalBytes > 0 else { return 0 }
        return min(1, max(0, Double(snapshot.usedBytes) / Double(snapshot.totalBytes)))
    }

    var body: some View {
        ProgressView(value: usedFraction)
            .progressViewStyle(.linear)
            .tint(Color.primary.opacity(0.68))
            .accessibilityLabel("iPhoneストレージ使用状況")
            .accessibilityValue("使用済み \(Int((usedFraction * 100).rounded()))パーセント")
    }
}

#Preview("Storage outcome - Light") {
    StorageOutcomeView(outcome: .mock)
        .preferredColorScheme(.light)
}

#Preview("Storage outcome - Dark") {
    StorageOutcomeView(outcome: .mock)
        .preferredColorScheme(.dark)
}
