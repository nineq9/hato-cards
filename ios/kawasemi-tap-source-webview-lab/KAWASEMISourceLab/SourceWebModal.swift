import SwiftUI
import WebKit

struct SourceWebModal: View {
    let url: URL
    let sourceName: String
    @Binding var isPresented: Bool

    @State private var isLoading = true
    @State private var errorMessage: String?

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                Color.black.opacity(0.42)
                    .ignoresSafeArea()
                    .contentShape(Rectangle())
                    .onTapGesture {
                        isPresented = false
                    }

                VStack(spacing: 0) {
                    HStack(spacing: 12) {
                        Button {
                            isPresented = false
                        } label: {
                            Image(systemName: "xmark")
                                .font(.system(size: 14, weight: .semibold))
                                .frame(width: 38, height: 38)
                                .background(Color.secondary.opacity(0.10), in: Circle())
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("閉じる")

                        VStack(alignment: .leading, spacing: 2) {
                            Text(sourceName)
                                .font(.system(size: 14, weight: .semibold))

                            Text(url.host ?? "参照元")
                                .font(.system(size: 10, weight: .regular))
                                .foregroundStyle(.secondary)
                                .lineLimit(1)
                        }

                        Spacer()

                        if isLoading {
                            ProgressView()
                                .controlSize(.small)
                        }
                    }
                    .padding(.horizontal, 12)
                    .frame(height: 56)
                    .background(Color(uiColor: .secondarySystemBackground))

                    Divider()

                    ZStack {
                        SourceWebView(
                            url: url,
                            isLoading: $isLoading,
                            errorMessage: $errorMessage
                        )

                        if let errorMessage {
                            VStack(spacing: 12) {
                                Image(systemName: "exclamationmark.triangle")
                                    .font(.system(size: 24, weight: .medium))

                                Text("ページを読み込めませんでした")
                                    .font(.system(size: 15, weight: .semibold))

                                Text(errorMessage)
                                    .font(.system(size: 12))
                                    .foregroundStyle(.secondary)
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal, 24)
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color(uiColor: .systemBackground))
                        }
                    }
                }
                .frame(
                    width: min(proxy.size.width - 22, 620),
                    height: min(proxy.size.height * 0.84, 780)
                )
                .background(Color(uiColor: .systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .stroke(Color.white.opacity(0.16), lineWidth: 0.5)
                }
                .shadow(color: .black.opacity(0.24), radius: 32, y: 16)
                .contentShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
                .onTapGesture {
                    // Intentionally consume taps inside the popup so only the
                    // dimmed background dismisses it.
                }
            }
        }
        .accessibilityAddTraits(.isModal)
    }
}

struct SourceWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var errorMessage: String?

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.keyboardDismissMode = .interactive
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        webView.backgroundColor = .systemBackground
        webView.isOpaque = true

        context.coordinator.load(url, in: webView)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if context.coordinator.requestedURL != url {
            context.coordinator.load(url, in: webView)
        }
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        var parent: SourceWebView
        var requestedURL: URL?

        init(parent: SourceWebView) {
            self.parent = parent
        }

        func load(_ url: URL, in webView: WKWebView) {
            requestedURL = url
            parent.errorMessage = nil
            parent.isLoading = true

            let request = URLRequest(
                url: url,
                cachePolicy: .reloadRevalidatingCacheData,
                timeoutInterval: 30
            )
            webView.load(request)
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.errorMessage = nil
            parent.isLoading = true
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }

        func webView(
            _ webView: WKWebView,
            didFailProvisionalNavigation navigation: WKNavigation!,
            withError error: Error
        ) {
            finishWithError(error)
        }

        func webView(
            _ webView: WKWebView,
            didFail navigation: WKNavigation!,
            withError error: Error
        ) {
            finishWithError(error)
        }

        private func finishWithError(_ error: Error) {
            let nsError = error as NSError
            if nsError.code == NSURLErrorCancelled {
                return
            }
            parent.isLoading = false
            parent.errorMessage = nsError.localizedDescription
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if navigationAction.targetFrame == nil,
               let requestURL = navigationAction.request.url {
                webView.load(URLRequest(url: requestURL))
            }
            return nil
        }
    }
}
