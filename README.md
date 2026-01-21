# pooApps

Webアプリの実験場兼ポートフォリオサイト「pooApps」です。

ジョークアプリ（クソアプリ）を作成し、アーカイブとして積み上げていくサイトです。

## 技術スタック

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui (Radix UI base)
- Icons: Lucide React
- Linter/Formatter: Biome
- State: React Hooks + LocalStorage
- Infrastructure: Docker (Multi-stage build)

## セットアップ

### Dockerを使用する場合（推奨）

#### 開発環境

```bash
docker-compose up dev
```

開発サーバーが `http://localhost:3000` で起動します。

#### 本番環境

```bash
docker-compose up app
```

本番サーバーが `http://localhost:3000` で起動します。

### ローカル環境で開発する場合

```bash
npm install
npm run dev
```

開発サーバーが `http://localhost:3000` で起動します。

## 実装済みアプリ

1. **無駄ボタン** (`/apps/useless-button`)
   - 押しても何も起こらないボタンです

2. **おみくじ地獄** (`/apps/omikuji-hell`)
   - 凶以上しか出ないおみくじです

3. **カラーフラッシャー** (`/apps/color-flasher`)
   - クリックで背景色が変わるアプリです

## コーディング規約

1. **変数宣言**: `let` は使用せず、すべて `const` を使用すること
2. **関数**: 即時実行関数 (IIFE) は禁止
3. **条件分岐**: 三項演算子のネストは禁止、`if` 文の `{}` は1行であっても省略禁止、早期リターンを積極的に使用
4. **型安全性**: `any` 型の使用は禁止
5. **コメント**: コード自体で意図が伝わる命名を心がけ、コメントは必要最低限に留める
6. **コンポーネント**: 責務に応じて可能な限り細かく分離、ページファイル以外はNamed Exportを使用
7. **Linter対応**: Biome のデフォルトルールに準拠

## プロジェクト構造

```
app/
  apps/
    [app-slug]/
      page.tsx          # アプリページ
  page.tsx              # トップページ
components/
  apps/                 # 各アプリのコンポーネント
  ui/                   # shadcn/uiコンポーネント
  AppLayout.tsx         # 共通レイアウト
lib/
  appsData.ts           # アプリ設定ファイル
```

## 新しいアプリの追加方法

1. `lib/appsData.ts` にアプリ情報を追加
2. `components/apps/` にアプリコンポーネントを作成
3. `app/apps/[app-slug]/page.tsx` にルーティングを追加
