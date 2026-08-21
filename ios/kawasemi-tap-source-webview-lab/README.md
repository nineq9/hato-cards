# KAWASEMI iOS Tap → Source WebView Lab

Status: **isolated experiment — not production CARDS**

This branch tests the Owner-requested alternate CARDS model without changing canonical production UX.

## Interaction hypothesis

- CARDS itself has no vertical article-reading scroll.
- Tap the card → open the real source page inside a native `WKWebView` popup over KAWASEMI.
- The popup is not an iframe and does not copy/re-host publisher article HTML.
- Tap the dimmed area outside the popup, or tap ×, to close and return to the same card.
- The source page itself remains scrollable and interactive inside the popup.
- Left swipe dismisses the card as NEXT.
- Right swipe dismisses the card as SAVE + advance.
- After the single lab card is processed, `CLEAR!` is shown.

## Test source

`https://news.yahoo.co.jp/pickup/6592556`

The source URL is loaded directly by `WKWebView`.

## Why native iOS

The earlier GitHub Pages prototypes attempted cross-site iframe embedding. Yahoo! News did not render in that context. A native `WKWebView` is a platform web view and does not have the same iframe embedding constraint.

Apple describes `WKWebView` as a native view for displaying interactive web content / in-app browsing. The SwiftUI wrapper uses `UIViewRepresentable` and `WKNavigationDelegate`.

## Run

1. Open `KAWASEMISourceLab.xcodeproj` in Xcode.
2. Select `KAWASEMISourceLab`.
3. Run on an iPhone simulator first.
4. Then run on a physical iPhone for the actual Owner interaction check.

## Owner check

Only judge the interaction hypothesis first:

1. Does tapping a card and seeing the real source page in-place feel natural?
2. Is the popup large enough to read and scroll the source normally?
3. Is tapping outside to close obvious and satisfying?
4. Does returning to the unchanged card preserve triage momentum?
5. Is this model preferable to reading long-form content by vertical scrolling inside CARDS?

## QA status

- Source URL wiring: code-reviewed
- Popup background-tap close: code-reviewed
- × close: code-reviewed
- WKWebView page interaction / scrolling: code-reviewed
- target=_blank links are redirected into the same WKWebView: code-reviewed
- Xcode build: **NOT TESTED in this environment**
- iPhone simulator: **NOT TESTED**
- physical iPhone: **NOT TESTED**
- Yahoo! News final rendering in WKWebView: **NOT TESTED until run on iOS**

Do not merge into production or update canonical `UX_RULES.md` based on this experiment until Owner explicitly chooses the alternate model.
