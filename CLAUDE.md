# バンド管理アプリ (React Native)

## 基本ルール

- **必ず日本語で回答すること**

## 概要
バンド活動を管理するためのモバイルアプリ。曲管理、練習スケジュール、ライブイベント、練習ログを記録・管理できる。

## 技術スタック
- **フレームワーク**: Expo SDK 54 + React Native
- **言語**: TypeScript
- **ナビゲーション**: React Navigation v7 (native-stack, bottom-tabs)
- **アイコン**: @expo/vector-icons (Feather)
- **日付処理**: date-fns
- **スタイリング**: React Native StyleSheet

## ディレクトリ構造
```
src/
├── navigation/
│   ├── types.ts          # ナビゲーション型定義
│   ├── AppNavigator.tsx  # Stack Navigator
│   └── TabNavigator.tsx  # Bottom Tab Navigator
├── screens/
│   ├── HomeScreen.tsx           # ダッシュボード
│   ├── SongsScreen.tsx          # 曲一覧
│   ├── SongDetailScreen.tsx     # 曲詳細
│   ├── ScheduleScreen.tsx       # カレンダー+予定
│   ├── PracticeDetailScreen.tsx # 練習詳細
│   ├── LiveEventsScreen.tsx     # ライブ一覧
│   ├── LiveDetailScreen.tsx     # ライブ詳細
│   ├── SetlistEditScreen.tsx    # セットリスト編集
│   ├── PracticeLogsScreen.tsx   # ログ一覧
│   ├── LogDetailScreen.tsx      # ログ詳細
│   ├── LogAddScreen.tsx         # ログ追加
│   ├── ChecklistTemplatesScreen.tsx
│   └── PlaceholderScreen.tsx
├── components/
│   ├── Card.tsx
│   ├── FAB.tsx
│   ├── Chip.tsx
│   ├── EmptyState.tsx
│   └── IconButton.tsx
├── theme/
│   └── colors.ts         # カラーパレット
└── data/
    ├── types.ts          # データ型定義
    └── mockData.ts       # モックデータ
```

## コマンド
```bash
# 開発サーバー起動
npx expo start

# キャッシュクリアして起動
npx expo start --clear

# iOS シミュレーター
npx expo start --ios

# Android エミュレーター
npx expo start --android

# TypeScript 型チェック
npx tsc --noEmit
```

## スタイリング規約
- `fontWeight`は必ず`'600' as const`のように型アサーションを付ける
- カラーは`src/theme/colors.ts`から参照
- スペーシング: 8, 12, 16, 24px
- ボーダー半径: 8, 12, 16px

## ナビゲーション構造
- **Main (Tab Navigator)**
  - Home → PracticeDetail, LiveDetail
  - Songs → SongDetail, SongAdd
  - Schedule → PracticeDetail, PracticeAdd
  - Live → LiveDetail, LiveAdd, SetlistEdit
  - Log → LogDetail, LogAdd

## 既知の問題
- Expo SDK 54 + New Architecture では `fontWeight` に型アサーション必須
- データは現在モックデータのみ（永続化未実装）
