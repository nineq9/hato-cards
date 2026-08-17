import UIKit

enum TutorialPracticeImage: String, CaseIterable, Identifiable {
    case tutorialPractice01
    case tutorialPractice02
    case tutorialPractice03

    var id: String { rawValue }

    var image: UIImage {
        UIImage(named: rawValue) ?? UIImage()
    }

    var byteCount: Int64 {
        guard let url = Bundle.main.url(forResource: rawValue, withExtension: "jpg"),
              let values = try? url.resourceValues(forKeys: [.fileSizeKey]),
              let size = values.fileSize else { return 0 }
        return Int64(size)
    }
}
