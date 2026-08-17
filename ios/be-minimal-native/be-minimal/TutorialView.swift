import SwiftUI
import UIKit

struct TutorialExperienceView: View {
    let onFinish: () -> Void
    let onSkip: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var colorScheme

    @State private var step = 0
    @State private var completed = false
    @State private var shortHint: String?
    @State private var hintResetTask: Task<Void, Never>?

    private let images = TutorialPracticeImage.allCases

    var body: some View {
        ZStack {
            background.ignoresSafeArea()

            if completed {
                completionView
            } else {
                practiceView
            }
        }
        .onDisappear {
            hintResetTask?.cancel()
        }
    }

    private var practiceView: some View {
        VStack(spacing: 0) {
            HStack {
                Text("be minimal")
                    .font(.system(size: 17, weight: .semibold))
                    .tracking(-0.2)

                Spacer()

                Text("\(step + 1) / 3")
                    .font(.system(size: 13, weight: .regular, design: .monospaced))
                    .foregroundStyle(.secondary)

                Spacer()

                Button("スキップ", action: onSkip)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .frame(minWidth: 44, minHeight: 44)
                    .contentShape(Rectangle())
            }
            .padding(.horizontal, 16)
            .frame(height: 58)

            Text(shortHint ?? instruction)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .frame(minHeight: 44)
                .accessibilityAddTraits(.isHeader)

            GeometryReader { proxy in
                let width = min(proxy.size.width - 40, 430)
                let height = min(proxy.size.height - 42, 650)

                ZStack {
                    ForEach(upcomingIndices.reversed(), id: \.self) { index in
                        let depth = CGFloat(index - step)
                        let image = images[index]

                        if index == step {
                            SwipeCardMotion(
                                accepts: accepts,
                                onCommit: handleCommit,
                                onRejected: handleRejected
                            ) {
                                tutorialCard(image)
                            }
                            .frame(width: width, height: height)
                            .id(step)
                            .accessibilityElement(children: .ignore)
                            .accessibilityLabel("操作練習 \(step + 1)枚目")
                            .accessibilityHint(instruction)
                            .accessibilityAction(named: "残す") {
                                accessibilityCommit(.right)
                            }
                            .accessibilityAction(named: "削除") {
                                accessibilityCommit(.left)
                            }
                            .zIndex(10)
                        } else {
                            tutorialCard(image)
                                .frame(width: width, height: height)
                                .scaleEffect(1 - depth * 0.026)
                                .offset(y: depth * 10)
                                .opacity(1 - Double(depth) * 0.14)
                                .allowsHitTesting(false)
                                .accessibilityHidden(true)
                                .zIndex(Double(3 - Int(depth)))
                        }
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .padding(.bottom, 12)
        }
    }

    private var completionView: some View {
        VStack(spacing: 0) {
            Spacer()

            Text("できました。")
                .font(.title3.weight(.semibold))
                .accessibilityAddTraits(.isHeader)

            Button("写真を整理する", action: onFinish)
                .font(.body.weight(.semibold))
                .frame(maxWidth: 360, minHeight: 52)
                .foregroundStyle(colorScheme == .dark ? .black : .white)
                .background(colorScheme == .dark ? Color.white : Color.black)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .padding(.horizontal, 28)
                .padding(.top, 34)

            Spacer()
        }
        .transition(reduceMotion ? .opacity : .opacity.combined(with: .scale(scale: 0.985)))
    }

    private var upcomingIndices: [Int] {
        guard step < images.count else { return [] }
        return Array(step..<min(step + 3, images.count))
    }

    private var instruction: String {
        switch step {
        case 0: return "右へスワイプして残す"
        case 1: return "左へスワイプして削除"
        default: return "どっちにする？"
        }
    }

    private func accepts(_ direction: ReviewSwipeDirection) -> Bool {
        switch step {
        case 0: return direction == .right
        case 1: return direction == .left
        default: return true
        }
    }

    private func handleRejected(_ direction: ReviewSwipeDirection) {
        showShortHint(step == 0 ? "右へ" : "左へ")
    }

    private func handleCommit(_ direction: ReviewSwipeDirection) {
        shortHint = nil
        if step < 2 {
            withAnimation(reduceMotion ? .none : .easeOut(duration: 0.15)) {
                step += 1
            }
        } else {
            withAnimation(reduceMotion ? .none : .easeOut(duration: 0.18)) {
                completed = true
            }
        }
    }

    private func accessibilityCommit(_ direction: ReviewSwipeDirection) {
        guard accepts(direction) else {
            handleRejected(direction)
            return
        }

        if direction == .left {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } else {
            UISelectionFeedbackGenerator().selectionChanged()
        }
        handleCommit(direction)
    }

    private func showShortHint(_ text: String) {
        hintResetTask?.cancel()
        shortHint = text
        hintResetTask = Task {
            try? await Task.sleep(for: .milliseconds(800))
            guard !Task.isCancelled else { return }
            await MainActor.run { shortHint = nil }
        }
    }

    private func tutorialCard(_ item: TutorialPracticeImage) -> some View {
        ZStack {
            cardSurface

            Image(uiImage: item.image)
                .resizable()
                .scaledToFit()
        }
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .shadow(color: .black.opacity(colorScheme == .dark ? 0.20 : 0.07), radius: 20, y: 10)
        .overlay(alignment: .bottomTrailing) {
            TutorialSizeBadge(byteCount: item.byteCount)
                .padding(13)
        }
    }

    private var background: Color {
        colorScheme == .dark
            ? Color(red: 0.075, green: 0.073, blue: 0.070)
            : Color(red: 0.969, green: 0.961, blue: 0.941)
    }

    private var cardSurface: Color {
        colorScheme == .dark ? Color.white.opacity(0.055) : Color.black.opacity(0.03)
    }
}

private struct TutorialSizeBadge: View {
    let byteCount: Int64

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: "cellularbars")
                .font(.system(size: 12))
            Text(sizeText)
                .font(.system(size: 11, weight: .semibold, design: .rounded))
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 9)
        .frame(height: 29)
        .background(.black.opacity(0.42), in: Capsule())
        .accessibilityLabel("画像サイズ \(sizeText)")
    }

    private var sizeText: String {
        guard byteCount > 0 else { return "—" }
        return ByteCountFormatter.string(fromByteCount: byteCount, countStyle: .file)
    }
}

/// Ready to be presented later from Settings / Help as 「操作を練習する」.
struct TutorialReplayView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        TutorialExperienceView(
            onFinish: { dismiss() },
            onSkip: { dismiss() }
        )
    }
}
