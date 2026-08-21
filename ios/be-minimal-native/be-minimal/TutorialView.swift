import SwiftUI

struct TutorialExperienceView: View {
    let onFinish: () -> Void

    @State private var step = 0
    private let images = TutorialPracticeImage.allCases

    var body: some View {
        PhotoDeckScaffold(
            counterText: "\(step + 1) / \(images.count)",
            onReview: {},
            canUndo: step > 0,
            onUndo: undo
        ) {
            deckStage
        }
        .background(Color(red: 0.969, green: 0.961, blue: 0.941).ignoresSafeArea())
    }

    private var deckStage: some View {
        GeometryReader { proxy in
            let visible = Array(images.dropFirst(step).prefix(3))

            ZStack {
                ForEach(visible.indices.reversed(), id: \.self) { index in
                    let item = visible[index]
                    let depth = CGFloat(index)
                    let width = min(proxy.size.width - 40, 430)
                    let height = min(proxy.size.height - 42, 650)

                    if index == 0 {
                        ThrowCard(
                            tutorialImage: item,
                            onDiscard: advance,
                            onPass: advance
                        )
                        .frame(width: width, height: height)
                        .zIndex(10)
                    } else {
                        ReviewCardVisual(media: .tutorial(item), style: .stacked)
                            .frame(width: width, height: height)
                            .scaleEffect(1 - depth * 0.026)
                            .offset(y: depth * 10)
                            .opacity(1 - Double(depth) * 0.14)
                            .allowsHitTesting(false)
                            .zIndex(Double(3 - index))
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    private func advance() {
        if step + 1 >= images.count {
            onFinish()
        } else {
            step += 1
        }
    }

    private func undo() {
        guard step > 0 else { return }
        step -= 1
    }
}

struct TutorialReplayView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        TutorialExperienceView(onFinish: { dismiss() })
    }
}
