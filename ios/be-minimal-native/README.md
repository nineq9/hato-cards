# be minimal — native iOS prototype

Safari prototypeから分離した、実際のiPhone写真ライブラリを扱うSwiftUI版です。

## 今できること

- PhotoKitの `readWrite` 権限を要求
- 写真・動画から最大100件の整理候補を生成
  - お気に入り・非表示は候補から除外
  - スクリーンショット、バースト、動画、古い項目を優先する簡易ヒューリスティック
- 横スクロールで候補を見る
- 上スワイプで削除候補へ
- 下に引いて離すと、反動で上へ飛んで削除候補へ
- タップで全画面
- 動画はApple標準プレイヤーで全編再生・シーク
- 長押しで日時・寸法・位置などの詳細
- 削除候補を最後に一覧確認して救出可能
- 最終確認後に `PHAssetChangeRequest.deleteAssets` で本当に削除

> 削除した項目はiPhoneの写真アプリの「最近削除した項目」に移動します。

## お金をかけずに自分のiPhoneで試す

1. Macでこのフォルダの `be-minimal.xcodeproj` を開く
2. Xcodeの `Signing & Capabilities` → `Team` で自分のApple Accountの **Personal Team** を選ぶ
3. iPhoneをMacにつなぐ（同じApple Accountならワイヤレス接続でも可）
4. Xcode上部の実行先を自分のiPhoneにする
5. ▶ Run
6. iPhoneで写真アクセスを許可

App Store公開やTestFlight配布は別途Apple Developer Programが必要ですが、自分の端末での開発テストはPersonal Teamで進められます。

## まだ入れていないもの

- 類似写真グループのAIランキング
- AIによるアルバム提案
- カスタム動画スクラバーのサムネイル（現状はApple標準プレイヤーを利用）
- 他社アプリの自動削除（iOS公開APIでは不可）

## QA状態

- ソース構成・plist/project構造: 作成済み
- PhotoKit API: Apple公式APIに合わせて実装
- Xcode実機ビルド: **未確認**（この実行環境にはXcodeがないため）
