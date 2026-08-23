import SwiftUI

struct ContentView: View {
    private let sourceURL = URL(string: "https://news.yahoo.co.jp/pickup/6592556")!

    @State private var showSource = ProcessInfo.processInfo.arguments.contains("--qa-open-source")
    @State private var dragX: CGFloat = 0
    @State private var isProcessed = false
    @State private var wasSaved = false

    var body: some View {
        ZStack {
            Color(red: 0.95, green: 0.94, blue: 0.90)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                header

                Spacer(minLength: 18)

                if isProcessed {
                    clearState
                } else {
                    articleCard
                }

                Spacer(minLength: 22)
            }
            .padding(.horizontal, 18)
            // A presented source is a separate interaction surface. Do not let
            // WebView scrolling/taps leak through and drive the card gesture.
            .allowsHitTesting(!showSource)

            if showSource {
                SourceWebModal(
                    url: sourceURL,
                    sourceName: "Yahoo!ニュース",
                    isPresented: $showSource
                )
                .transition(.opacity.combined(with: .scale(scale: 0.985)))
                .zIndex(10)
            }
        }
        .animation(.easeOut(duration: 0.20), value: showSource)
    }

    private var header: some View {
        HStack {
            Text("KAWASEMI")
                .font(.system(size: 13, weight: .semibold, design: .rounded))
                .tracking(4.2)

            Spacer()

            Text("SOURCE WEBVIEW LAB")
                .font(.system(size: 10, weight: .medium))
                .tracking(1.8)
                .foregroundStyle(.secondary)
        }
        .frame(height: 52)
    }

    private var articleCard: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(
                colors: [
                    Color(red: 0.04, green: 0.15, blue: 0.16),
                    Color(red: 0.05, green: 0.10, blue: 0.11)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .firstTextBaseline) {
                    Text("YAHOO!ニュース")
                        .font(.system(size: 11, weight: .semibold))
                        .tracking(1.4)
                        .foregroundStyle(.white.opacity(0.76))

                    Spacer()

                    Text("TAP")
                        .font(.system(size: 10, weight: .semibold))
                        .tracking(1.6)
                        .foregroundStyle(.white.opacity(0.52))
                }

                Spacer()

                Text("カードを離れずに、\n参照元をそのまま読む")
                    .font(.system(size: 31, weight: .bold))
                    .tracking(-1.0)
                    .foregroundStyle(.white)
                    .fixedSize(horizontal: false, vertical: true)

                Text("カードをタップすると、KAWASEMIの上に元ページそのものを表示します。カード内の縦スクロールはありません。")
                    .font(.system(size: 16, weight: .regular))
                    .lineSpacing(5)
                    .foregroundStyle(.white.opacity(0.88))
                    .padding(.top, 18)

                Divider()
                    .overlay(.white.opacity(0.14))
                    .padding(.vertical, 20)

                HStack {
                    Label("タップして元記事", systemImage: "safari")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.88))

                    Spacer()

                    Image(systemName: "arrow.up.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.66))
                }
            }
            .padding(24)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 520)
        .clipShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 30, style: .continuous)
                .stroke(.white.opacity(0.10), lineWidth: 1)
        }
        .offset(x: dragX)
        .rotationEffect(.degrees(Double(dragX / 170)))
        .contentShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
        .onTapGesture {
            guard abs(dragX) < 4 else { return }
            showSource = true
        }
        .gesture(cardDragGesture)
        .accessibilityIdentifier("lab-article-card")
        .accessibilityLabel("ニュースカード。タップでYahoo!ニュースをポップアップ表示。左スワイプで次へ、右スワイプで保存。")
    }

    private var cardDragGesture: some Gesture {
        DragGesture(minimumDistance: 12, coordinateSpace: .local)
            .onChanged { value in
                guard !showSource else { return }
                let dx = value.translation.width
                let dy = value.translation.height
                guard abs(dx) > abs(dy) * 0.62 else { return }
                dragX = dx
            }
            .onEnded { value in
                guard !showSource else { return }
                let dx = value.translation.width
                let dy = value.translation.height
                let predicted = value.predictedEndTranslation.width
                let horizontalIntent = abs(dx) > abs(dy) * 0.62
                let shouldCommit = horizontalIntent && (abs(dx) >= 88 || abs(predicted) >= 150)

                guard shouldCommit else {
                    withAnimation(.easeOut(duration: 0.18)) {
                        dragX = 0
                    }
                    return
                }

                let direction: CGFloat = dx >= 0 ? 1 : -1
                if direction > 0 {
                    wasSaved = true
                }

                withAnimation(.easeOut(duration: 0.22)) {
                    dragX = direction * 520
                }

                DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
                    isProcessed = true
                    dragX = 0
                }
            }
    }

    private var clearState: some View {
        VStack(spacing: 14) {
            Text("CLEAR!")
                .font(.system(size: 44, weight: .bold))
                .tracking(1.2)
                .accessibilityIdentifier("lab-clear")

            Text(wasSaved ? "保存して処理しました。" : "このテストカードを処理しました。")
                .font(.system(size: 14))
                .foregroundStyle(.secondary)

            Button("もう一度試す") {
                wasSaved = false
                isProcessed = false
            }
            .font(.system(size: 14, weight: .semibold))
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: 520)
    }
}

#Preview {
    ContentView()
}
