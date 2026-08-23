import XCTest

final class KAWASEMISourceLabUITests: XCTestCase {
    private let originalURL = "https://news.yahoo.co.jp/pickup/6592556"

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testYahooSourcePopupJourney() throws {
        let app = XCUIApplication()
        app.launch()

        // The SwiftUI card intentionally exposes one combined accessibility
        // element, so its child headline is not guaranteed to remain a
        // standalone StaticText in the accessibility tree. Target the stable
        // production-facing accessibility identifier instead of rendered copy.
        let card = app.descendants(matching: .any)
            .matching(identifier: "lab-article-card")
            .firstMatch
        XCTAssertTrue(card.waitForExistence(timeout: 6), "Lab card did not appear")

        card.tap()

        let webView = app.webViews.firstMatch
        XCTAssertTrue(webView.waitForExistence(timeout: 10), "WKWebView popup did not appear after card tap")
        let probe = app.staticTexts["source-probe"]
        XCTAssertTrue(probe.waitForExistence(timeout: 4), "Source runtime probe is missing")

        let loaded = waitUntil(timeout: 20) {
            let state = self.probeState(probe)
            return state.status == "loaded" && state.length >= 200 && state.url.contains("news.yahoo.co.jp")
        }
        XCTAssertTrue(loaded, "Yahoo page did not expose meaningful rendered text. Probe: \(probe.value ?? "nil")")
        XCTAssertFalse(app.staticTexts["source-error"].exists, "Source view showed a load error")
        attachScreenshot(name: "01-yahoo-loaded")

        let beforeScroll = probeState(probe).scrollY
        webView.swipeUp()
        let scrolled = waitUntil(timeout: 6) {
            self.probeState(probe).scrollY > beforeScroll + 12
        }
        XCTAssertTrue(scrolled, "WKWebView did not vertically scroll. Probe: \(probe.value ?? "nil")")
        XCTAssertFalse(app.staticTexts["lab-clear"].exists, "WebView vertical interaction leaked through and processed the card")
        attachScreenshot(name: "02-yahoo-scrolled")

        // Horizontal interaction belongs to WKWebView while the popup is open.
        // It must never dismiss/process the KAWASEMI card behind the modal.
        webView.swipeLeft()
        XCTAssertTrue(webView.exists, "Horizontal WebView interaction unexpectedly dismissed the source popup")
        XCTAssertFalse(app.staticTexts["lab-clear"].exists, "WebView horizontal interaction leaked into CARDS swipe")

        let urlBeforeLink = probeState(probe).url
        if let link = firstHittableLink(in: webView) {
            link.tap()
            let navigated = waitUntil(timeout: 12) {
                let state = self.probeState(probe)
                return state.status == "loaded" && !state.url.isEmpty && state.url != urlBeforeLink
            }
            XCTAssertTrue(navigated, "A visible Yahoo link did not navigate inside WKWebView. Before: \(urlBeforeLink), after: \(probeState(probe).url)")
            XCTAssertTrue(webView.exists, "Link navigation escaped the in-app WKWebView")
            XCTAssertFalse(app.staticTexts["lab-clear"].exists, "Link tap leaked into the card gesture")
            attachScreenshot(name: "03-link-navigation")
        } else {
            XCTFail("No visible/hittable Yahoo link was exposed in the WKWebView accessibility tree")
        }

        let close = app.buttons["source-close"]
        XCTAssertTrue(close.exists, "× close control is missing")
        close.tap()
        XCTAssertTrue(waitUntil(timeout: 4) { !webView.exists }, "× did not close the popup")
        XCTAssertTrue(card.exists, "× close did not return to the same card")
        XCTAssertFalse(app.staticTexts["lab-clear"].exists, "× close changed card state")

        card.tap()
        XCTAssertTrue(webView.waitForExistence(timeout: 10), "Popup did not reopen")
        XCTAssertTrue(waitUntil(timeout: 20) {
            let state = self.probeState(probe)
            return state.status == "loaded" && state.length >= 200 && state.url.contains("news.yahoo.co.jp")
        }, "Yahoo page did not reload on second open")

        // Modal width is screen width - 22pt, centered. A point at the extreme
        // left remains in the dimmed backdrop and exercises the actual tap path.
        app.coordinate(withNormalizedOffset: CGVector(dx: 0.005, dy: 0.52)).tap()
        XCTAssertTrue(waitUntil(timeout: 4) { !webView.exists }, "Dimmed background tap did not close the popup")
        XCTAssertTrue(card.exists, "Background close did not return to the same card")
        XCTAssertFalse(app.staticTexts["lab-clear"].exists, "Background close changed card state")
        attachScreenshot(name: "04-returned-same-card")
    }

    private func firstHittableLink(in webView: XCUIElement) -> XCUIElement? {
        let yahooLink = webView.links.matching(NSPredicate(format: "label CONTAINS[c] %@", "Yahoo")).firstMatch
        if yahooLink.exists && yahooLink.isHittable {
            return yahooLink
        }

        let count = min(webView.links.count, 24)
        for index in 0..<count {
            let candidate = webView.links.element(boundBy: index)
            if candidate.exists && candidate.isHittable {
                return candidate
            }
        }
        return nil
    }

    private func waitUntil(timeout: TimeInterval, poll: TimeInterval = 0.25, condition: () -> Bool) -> Bool {
        let deadline = Date().addingTimeInterval(timeout)
        while Date() < deadline {
            if condition() { return true }
            RunLoop.current.run(until: Date().addingTimeInterval(poll))
        }
        return condition()
    }

    private func probeState(_ probe: XCUIElement) -> (status: String, length: Int, scrollY: Int, url: String) {
        let raw = (probe.value as? String) ?? ""
        var values: [String: String] = [:]
        for part in raw.split(separator: ";", omittingEmptySubsequences: false) {
            let pair = part.split(separator: "=", maxSplits: 1, omittingEmptySubsequences: false)
            guard pair.count == 2 else { continue }
            values[String(pair[0])] = String(pair[1])
        }
        return (
            values["status"] ?? "",
            Int(values["length"] ?? "0") ?? 0,
            Int(values["scrollY"] ?? "0") ?? 0,
            values["url"] ?? originalURL
        )
    }

    private func attachScreenshot(name: String) {
        let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
