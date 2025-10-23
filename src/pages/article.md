---
layout: ../../layouts/Layout.astro
title: "記事一覧ページの作成"
date: "2025-07-09"
lastModified: "2025-07-09"
---
# 概要
Astro に React を導入し、[記事一覧ページ](/article)を作成した。
# 欲しい機能
現時点で記事一覧ページに必要だと考えた機能は以下の通り。
- ソート
- 検索

今は必要ないが、将来必要になると考えられる機能は以下の通り。
- ページネーション
- タグによる検索

これらの機能を実装するには状態管理が欲しい（なくても実装はできるが、かなり無理がある）。
Astro は React をサポートしているため、それを用いて実装することにした。

# 実装
## React の導入
[公式のドキュメント](https://docs.astro.build/ja/guides/integrations-guide/react/)に従い、以下のコマンドを実行。
```bash
npx astro add react
```
## コンポーネントの実装
記事の一覧を表示するコンポーネントを作成する。
ソースコードはレポジトリを確認されたい（`src/components/ArticleCard.tsx`、`src/components/ArticleList.tsx`）。

## Astro ファイルへのインポート
作った React コンポーネントは Astro ファイルに直接使用することができる。
```astro
---
import ArticleList from "../components/ArticleList";
---
<article>
  <h1>記事一覧</h1>
  <ArticleList articles={sortedarticles} displayButton client:load />
</article>
```
重要なのは **`client:load`** の部分。
これがないと状態管理が機能しない。
Astro ではビルド時に Javascript を全て除去するため、状態管理が機能しない。
しかし、`client:load` を付けることでそれを回避することができる。

また、`ArticleList` コンポーネント一つに機能を集中させている点にも注意されたい。
Astro ファイルでは React コンポーネント間の状態の受け渡しができないからである。
例えば、記事のソートをする部分と記事を表示する部分を別々のコンポーネントとして実装し、Astro ファイルにそれぞれインポートして状態を共有することはできない（本当は出来るのかもしれないが、そのような文献は見つからなかった）。

# 参考
- [アイランドアーキテクチャ](https://docs.astro.build/ja/concepts/islands/)
  - 公式のドキュメント。`client:load` の説明が書いてある。