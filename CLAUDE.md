# CLAUDE.md — pension_simulator

このファイルは Claude Code がこのリポジトリで作業する際の指針です。

---

## プロジェクト概要

日本の年金繰上げ・繰下げ判断を支援するシミュレーター。
東京都の税金・社会保険料を考慮した手取りベースの損益分岐点を算出する。

- **フレームワーク**: Next.js（フロントエンドのみ、サーバーなし）
- **状態管理**: useState / useMemo
- **グラフ**: recharts
- **スタイル**: Tailwind CSS
- **言語**: TypeScript

設計の詳細は [`年金シミュレーター.md`](年金シミュレーター.md) を参照。

---

## ディレクトリ構成

```
src/
  app/            # Next.js App Router（page.tsx, layout.tsx）
  components/
    pension/      # UIコンポーネント群
  lib/
    calculations.ts   # 全計算ロジック（設計書に対応）
    format-yen.ts     # 金額フォーマット
docs/
  pull-request-guide.md  # PR運用ガイド
```

---

## コーディング規約

- 計算ロジックは `src/lib/calculations.ts` に集約する
- コンポーネントは `src/components/pension/` 以下に配置
- 日本語コメント可（設計書との対応を明示するため）
- `"use client"` は必要なコンポーネントのみに付ける

---

## PR本文の形式

`/pr` コマンドを使うこと（`.claude/commands/pr.md` 参照）。

PR本文は以下の4見出しで構成する（見出し名は固定）:

1. **概要** — 何を達成するか（短く）
2. **背景** — 動機・Issue 等
3. **変更内容** — 具体差分（パス・挙動）
4. **動作確認** — チェックリスト（`npm run dev` / `npm run build` 等）

**出さないもの（ユーザーが明示指定した場合を除く）:**
- `gh pr create` 等の GitHub CLI コマンド全文
- `git push` / `git commit` など手順一式
- PR タイトル案
- プレースホルダや `<!-- -->` コメント

GitHub の `.github/pull_request_template.md` は使わない。

---

## 動作確認コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド（エラー確認）
npm run lint   # 型チェック・lint
```
