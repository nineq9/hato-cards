// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "GEKKOStorageOutcomes",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "GEKKOStorageOutcomes",
            targets: ["GEKKOStorageOutcomes"]
        )
    ],
    targets: [
        .target(
            name: "GEKKOStorageOutcomes",
            resources: [
                .process("PrivacyInfo.xcprivacy")
            ]
        ),
        .testTarget(
            name: "GEKKOStorageOutcomesTests",
            dependencies: ["GEKKOStorageOutcomes"]
        )
    ]
)
