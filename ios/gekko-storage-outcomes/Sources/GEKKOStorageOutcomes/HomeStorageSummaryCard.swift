import SwiftUI

public struct HomeStorageSummaryCard: View {
    public let currentAvailableBytes: Int64
    public let cumulativeReclaimedBytes: Int64

    public init(currentAvailableBytes: Int64, cumulativeReclaimedBytes: Int64) {
        self.currentAvailableBytes = max(0, currentAvailableBytes)
        self.cumulativeReclaimedBytes = max(0, cumulativeReclaimedBytes)
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("\(StorageByteFormatter.string(currentAvailableBytes)) FREE")
                .font(.title3.weight(.semibold))
                .monospacedDigit()
                .minimumScaleFactor(0.75)
                .lineLimit(1)

            Text("GEKKOで \(StorageByteFormatter.string(cumulativeReclaimedBytes)) 取り戻しました")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Color(uiColor: .secondarySystemBackground), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("空き容量 \(StorageByteFormatter.string(currentAvailableBytes))。GEKKOで累計 \(StorageByteFormatter.string(cumulativeReclaimedBytes)) 取り戻しました")
    }
}

#Preview("Home card - small phone") {
    HomeStorageSummaryCard(
        currentAvailableBytes: 20_000_000_000,
        cumulativeReclaimedBytes: 12_600_000_000
    )
    .padding()
    .previewLayout(.sizeThatFits)
}
