# GEKKO Storage Outcomes

GEKKO本体とは切り離した、ストレージ成果表示専用のSwift Packageです。

## 含まれるもの

- `StorageOutcomeView`
  - 今回確認した写真・動画枚数
  - 今回削除した枚数
  - 今回削除対象として記録した容量
  - 整理前／整理後の空き容量
  - 実際に増えた空き容量
  - GEKKO累計の削除容量
  - シンプルなストレージ使用バー
- `HomeStorageSummaryCard`
  - ホーム画面に埋め込める小型の再利用可能コンポーネント
- `DeviceStorageProvider`
  - iOSから端末全体容量と現在の空き容量を取得
- `UserDefaultsReclaimedCapacityStore`
  - GEKKOで削除した容量の累計保存
- `StorageOutcomeSession`
  - 本体へ後から接続するための begin → finish の境界
- `StorageOutcomeDemoView`
  - モック完了画面と実機値取得を単独確認する画面

## 想定する本体接続

```swift
let session = StorageOutcomeSession()

// 写真整理開始時
try session.begin()

// 既存の写真削除処理を実行

// 写真削除完了後
let outcome = try session.finish(
    reviewedCount: reviewedCount,
    deletedCount: deletedCount,
    deletedBytes: deletedBytes
)

// StorageOutcomeView(outcome: outcome) を表示
```

このパッケージは写真を削除しません。削除処理とは独立しています。

## 数値の扱い

`deletedBytes` はGEKKOが削除対象として記録した写真・動画の容量です。

`freeSpaceIncreaseBytes` は整理前と整理後にiOSから取得した空き容量の差分です。iOSのキャッシュや非同期のストレージ解放により、この2つは一致しない場合があります。取得できない値を推測して埋める処理はありません。

Appleの「設定 → 一般 → iPhoneストレージ」にある「写真 / アプリ / iOS / システムデータ」などのカテゴリ内訳は再現しません。

## Privacy manifest

端末のストレージ容量APIとUserDefaultsはRequired Reason APIです。このパッケージには `PrivacyInfo.xcprivacy` を含めています。

- Disk Space: `85F4.1` — ユーザー本人へディスク容量を表示する用途
- User Defaults: `CA92.1` — アプリ自身だけがアクセスする累計値保存

ストレージ値やその派生値を外部サーバーへ送信する設計は含めていません。

## UI方針

- SwiftUIのDynamic Typeを使用
- VoiceOver用ラベルを付与
- ライト／ダークモードはシステムカラーへ追従
- 独自アニメーションを使わずReduce Motionでも同じ情報を取得可能
- ScrollViewを使い、小さいiPhoneや大きな文字サイズでも内容へアクセス可能

## モック確認

`CleanupStorageOutcome.mock` は以下の例を使います。

- 127枚 整理
- 73枚 削除
- 1.8 GB 取り戻し
- 18.2 GB FREE → 20.0 GB FREE
- GEKKO累計 12.6 GB

`StorageOutcomeDemoView()` を一時的なホスト画面から表示すると、モックUIと実機ストレージ取得を確認できます。

## 現在の分離状態

既存のGEKKO / be minimal写真スワイプ処理からはimportも呼び出しもしていません。後からパッケージ依存を追加して接続する前提です。
