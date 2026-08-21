import UIKit

enum TutorialPracticeImage: String, CaseIterable, Identifiable {
    case tutorialPractice03
    case tutorialPractice02
    case tutorialPractice01

    var id: String { rawValue }

    private var resourceURL: URL {
        Bundle.main.url(forResource: rawValue, withExtension: "jpg")!
    }

    var image: UIImage {
        UIImage(contentsOfFile: resourceURL.path)!
    }

    var byteCount: Int64 {
        guard let values = try? resourceURL.resourceValues(forKeys: [.fileSizeKey]),
              let size = values.fileSize else { return 0 }
        return Int64(size)
    }
}
