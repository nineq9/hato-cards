import SwiftUI

public struct StorageOutcomeDemoView: View {
    @State private var liveSnapshot: StorageSnapshot?
    @State private var errorMessage: String?

    public init() {}

    public var body: some View {
        NavigationStack {
            List {
                Section("整理完了画面（モック）") {
                    NavigationLink("開く") {
                        StorageOutcomeView(outcome: .mock)
                            .navigationTitle("ストレージ成果")
                            .navigationBarTitleDisplayMode(.inline)
                    }
                }

                Section("ホーム用コンポーネント") {
                    HomeStorageSummaryCard(
                        currentAvailableBytes: liveSnapshot?.availableBytes ?? CleanupStorageOutcome.mock.after.availableBytes,
                        cumulativeReclaimedBytes: CleanupStorageOutcome.mock.cumulativeReclaimedBytes
                    )
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                }

                Section("実機ストレージ取得") {
                    Button("現在の値を取得") {
                        readLiveStorage()
                    }

                    if let liveSnapshot {
                        LabeledContent("端末全体") {
                            Text(StorageByteFormatter.string(liveSnapshot.totalBytes))
                                .monospacedDigit()
                        }
                        LabeledContent("現在の空き容量") {
                            Text(StorageByteFormatter.string(liveSnapshot.availableBytes))
                                .monospacedDigit()
                        }
                    }

                    if let errorMessage {
                        Text(errorMessage)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("GEKKO Storage Demo")
        }
    }

    private func readLiveStorage() {
        do {
            liveSnapshot = try DeviceStorageProvider().currentSnapshot()
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

#Preview {
    StorageOutcomeDemoView()
}
