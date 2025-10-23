---
layout: ../../layouts/Layout.astro
title: "Astroを使ってMarkdownでブログを書く"
date: "2025-06-29"
lastModified: "2025-06-29"
---
# 概要
[願い](/readme#:~:text=%E6%9B%B8%E3%81%8D%E3%81%9F%E3%81%84%E3%81%A8%E3%81%84%E3%81%86-,%E9%A1%98%E3%81%84,-%E3%82%92%E5%8F%B6%E3%81%88%E3%82%8B%E3%81%9F%E3%82%81)
を叶えるまでの記録。
# 環境
- Windows 11
- Node.js v22.17.0
# 手順
[Astro公式のチュートリアル](https://docs.astro.build/ja/tutorial/0-introduction/) も参照のこと。
## プロジェクトの作成
好きなディレクトリで `npm create astro@latest` を実行する。いくつか質問されるので以下のように対応する。
- Where should we create your new project?
  - 好きな文字列を入力する。ここで入力した名前のディレクトリが作成され、その中に全てのコードが格納される。
- How would you like to start your new project?
  - テンプレートを使える。
  - 何でもよいが、以下の説明は `Use minimal (empty) template` を選択した場合に準拠する。
- Install dependencies?
  - `Yes`
- Initialize a new git repository?
  - `Yes`

少し待つとプロジェクトが作成される。以下、作成されたディレクトリで作業をする。
### 動作確認
`npm run dev` を実行し、適当なポート番号（デフォルトだと `http://localhost:4321`。以下デフォルトに準拠）に接続すると、以下のような画面が表示される。
![image](../../assets/001/image1.png)
## Markdownを配置
`src/pages` に `sample.md` なるファイルを作成し、好きな文字列を入力する。
```markdown
# 大見出し
## 中見出し
### 小見出し
本文
```
`http://localhost:4321/sample` にアクセスすると、願いが叶ったことが確認できる。
![image](../../assets/001/image2.png)
Next.js などで同じことをしようとするとかなりの手間がかかるが、Astro の場合 Markdown を適当な場所に配置するだけで事足りる。これが今回 Astro を採用した理由である。
## デプロイ
[公式のガイド](https://docs.astro.build/ja/guides/deploy/) に従って所望のサービスにデプロイする。

# 体裁を整える
以上の手順で Markdown でブログを書き、それを公開することはできたが、上図のようなものをブログだと言い張るのは少し無理があるように思われる。
ここではよりブログらしく体裁を整える方法をいくつか説明する。
## レイアウトの適用
`src` に `layouts` なるディレクトリを作成し、そこに `Layout.astro` なるファイルを作成する。
以下のように記述する。
```astro
---
const { frontmatter } = Astro.props;
---

<head>
  <meta charset="UTF-8" />
</head>
<slot />
```
`src/pages/sample.md` を以下のように編集する。
```markdown
---
layout: /src/layouts/Layout.astro
---

# 大見出し
## 中見出し
### 小見出し
本文
```
これで `src/pages/sample.md` にレイアウトを適用することができる。
`<slot />` に Markdown がパースされる。
ここにスタイルを適用することで見た目を変更することができる。
例えば、`src/layouts/Layout.astro` を以下のように編集すると大見出しがさらに大きくなる。
```astro
---
const { frontmatter } = Astro.props;
---

<head>
  <meta charset="UTF-8" />
</head>
<slot />
<style is:global>
  h1 {
    font-size: 12rem;
  }
</style>
```
`<style is:global>` としている点に注意されたい。
後述するが、 `<style>` の適用範囲は `<slot />` まで及ばないという性質があり、`<style is:global>` としないと Markdown で書いた記事にスタイルが適用されない。
外部の css ファイルを読み込むことも可能で、`---` で囲われた部分に例えば `import "/src/styles/global.css";` と書くと、`/src/styles/global.css` に記述されたスタイルを適用できる（この場合は `<style is:global>` などのような特別な設定は不要）。
## メタデータの埋め込み
Markdown には **Front Matter** というものが存在する。
これは Markdown にメタデータを埋め込めるというもので、`---` で囲まれた領域に記述する（`layout: /src/layouts/layout.astro` も Front Matter である）。
Astro はこの Front Matter を受け入れることができる。
`src/layouts/layout.astro` と `src/pages/sample.md` をそれぞれ以下のように編集する。
```astro
---
const { frontmatter } = Astro.props;
---

<head>
  <meta charset="UTF-8" />
  <title>{frontmatter.title}</title>
</head>
<h1>{frontmatter.title}</h1>
<slot />
```
```markdown
---
layout: /src/layouts/layout.astro
title: "タイトル"
---

# 大見出し
## 中見出し
### 小見出し
本文
```
`http://localhost:4321/sample` にアクセスすると、Front Matter である `title` が表示されていることが確認できる。
Front Matter に埋め込める情報はかなりの自由度があるようで、例えば投稿日を埋め込むこともできる。
## ナビゲーションの作成
一般的なブログには、サイトの上部や左右にナビゲーションメニューが存在する。
これを作成する。

`src` 以下に `components` なるディレクトリを作成し、そこに `Navigation.astro` なるファイルを作成する。
以下のように記述する。
```astro
<nav>
  <a class="nav-title" href="/">ブログのタイトル</a>
</nav>

<style>
  a {
    font-size: 2rem;
    font-weight: 600;
  }
</style>
```
`src/layouts/layout.astro` を以下のように編集する。
```astro
---
import Navigation from '../components/Navigation.astro';
const { frontmatter } = Astro.props;
---

<head>
  <meta charset="UTF-8" />
  <title>{frontmatter.title}</title>
</head>
<Navigation />
<h1>{frontmatter.title}</h1>
<slot />
```
`http://localhost:4321/sample` にアクセスすると、ナビゲーションメニューが描画されていることが確認できる。

### コンポーネント
ナビゲーションメニューを `components` というディレクトリに実装したことから分かるかもしれないが、Astro ではコンポーネントを定義し、部品として使いまわすことができる。

コンポーネントは引数をとることもできる。例えば、記事のタイトルと投稿日を受け取り、それを表示するコンポーネント `Title` は以下のように実装できる。
```astro
---
export interface Props {
  title: string;
  date: string;
}

const { title, date } = Astro.props;
---

<div>
  <div id="title">{title}</div>
  <div class="date">公開日: {date}</div>
</div>
```
このコンポーネントは以下のように使用できる。
```astro
---
import Title from "../components/Title.astro";

const { frontmatter } = Astro.props;
---
<Title
  title={frontmatter.title}
  date={frontmatter.date}
/>
```
`<style>` タグを用いてコンポーネントにスタイルを適用することもできるが、コンポーネントの内部で定義されたスタイルは**その他のコンポーネントには適用されない**という性質がある。
前述の `src/components/Navigation.astro` では `<a>` にスタイルを適用しているが、これにより全ての `<a>` が大きな文字にはなる、ということはない。

# 参考
- [公式のドキュメント（日本語）](https://docs.astro.build/ja/getting-started/)
- [公式のドキュメント（英語）](https://docs.astro.build/en/getting-started/)
  - 日本語より詳しい。