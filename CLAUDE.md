# バンド管理アプリ (React Native)

## 基本ルール

- **必ず日本語で回答すること**

## 概要
バンド活動を管理するためのモバイルアプリ。曲管理、練習スケジュール、ライブイベント、練習ログを記録・管理できる。

## 技術スタック
- **フレームワーク**: Expo SDK 54 + React Native (New Architecture 有効)
- **言語**: TypeScript (strict mode)
- **ナビゲーション**: React Navigation v7 (native-stack, bottom-tabs)
- **状態管理**: React Context API
- **データ永続化**: @react-native-async-storage/async-storage
- **アイコン**: @expo/vector-icons (Feather)
- **日付処理**: date-fns
- **UI部品**: @react-native-community/datetimepicker, @react-native-community/slider
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
│   ├── SongAddScreen.tsx        # 曲追加
│   ├── ScheduleScreen.tsx       # カレンダー+予定
│   ├── PracticeDetailScreen.tsx # 練習詳細
│   ├── PracticeAddScreen.tsx    # 練習追加
│   ├── LiveEventsScreen.tsx     # ライブ一覧
│   ├── LiveDetailScreen.tsx     # ライブ詳細
│   ├── LiveAddScreen.tsx        # ライブ追加
│   ├── SetlistEditScreen.tsx    # セットリスト編集
│   ├── PracticeLogsScreen.tsx   # ログ一覧
│   ├── LogDetailScreen.tsx      # ログ詳細
│   ├── LogAddScreen.tsx         # ログ追加
│   ├── ChecklistTemplatesScreen.tsx  # チェックリストテンプレート
│   └── PlaceholderScreen.tsx
├── components/
│   ├── Card.tsx
│   ├── FAB.tsx
│   ├── Chip.tsx
│   ├── EmptyState.tsx
│   └── IconButton.tsx
├── contexts/
│   ├── ThemeContext.tsx    # ダークモード管理
│   ├── SongContext.tsx     # 曲データ管理
│   ├── PracticeContext.tsx # 練習スケジュール管理
│   ├── LiveContext.tsx     # ライブイベント管理
│   └── LogContext.tsx      # 練習ログ管理
├── theme/
│   └── colors.ts          # カラーパレット
└── data/
    ├── types.ts           # データ型定義
    ├── mockData.ts        # モックデータ（初期データ）
    └── storage.ts         # AsyncStorage永続化ユーティリティ
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

# Web ブラウザ
npx expo start --web

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

## 状態管理・データフロー
- 各ドメインデータは対応するContext（Song/Practice/Live/Log）で管理
- 初回起動時にAsyncStorageからデータを読み込み、データがなければmockDataで初期化
- データ変更時はContextのdispatch経由で更新し、AsyncStorageにも保存
- App.tsxでProviderをネストして全画面にデータを提供:
  `ThemeProvider → SongProvider → PracticeProvider → LiveProvider → LogProvider`

## 既知の問題
- Expo SDK 54 + New Architecture では `fontWeight` に型アサーション必須
