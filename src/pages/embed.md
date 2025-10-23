---
layout: ../../layouts/Layout.astro
title: "rehypeプラグインによるリンクの自動展開"
date: "2025-07-07"
lastModified: "2025-07-07"
---
# 概要
世に出回っているブログや SNS では、リンクを添付すると埋め込みに置換される。
この機能（の一部）を rehype を用いて実装した。

# rehypeとは
[rehype](https://github.com/rehypejs/rehype) とは、HTML を操作するツールである。
HTML を AST（Abstruct Syntax Tree: 抽象構文木）に変換することで操作を容易にしている。
プラグインを導入することで独自の置換ルールを定義することができる。

類似のツールに [remark](https://github.com/remarkjs/remark) がある。
これは Markdown を操作するツールで、こちらも AST を介して操作する。
Astro では remark と rehype を組み合わせて Markdown を HTML に変換している。

# 実装
一例として Spotify のリンクを埋め込みに変換するプラグインを実装する。

## 方針
機能は以下の通り。
- リンクを置換する
- `[タイトル](リンク)` の形式のリンクは置換しない

これを踏まえて、以下の方針で実装する。
- リンクを正規表現で検出
- 検出したら Spotify の埋め込みで置換

## 事前調査
### リンクの性質
例えば、以下の二つのリンクは次のようにパースされる。

https://example.com

[例](https://example.com)

```html
<p>
  <a href="https://example.com">https://example.com</a>
</p>
<p>
  <a href="https://example.com">例</a>
</p>
```

Astro ではリンクは `<a>` タグに置換されることがわかる。
`[タイトル](リンク)` の形式のリンクは `<a>` タグの中身と `href` 属性が異なるという性質がある。
タイトルにリンクと同じ文字列を入れるとこの性質は成り立たなくなるが、リンクの文字列を直接貼りたいケースは稀なので、ここでは無視する。
### Spotify の埋め込みの性質
Spotify の埋め込みは以下の形式になっている。
```html
<iframe style="border-radius:12px" src="" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
```
`src` 属性には埋め込み用の URL が入る。これは音楽の URL から導出できる。

## 実装
### パッケージのインストール
```bash
npm install remark-rehype unist-util-visit
```
`unist-util-visit` は、AST 上を探索するツールを提供するパッケージである。
### プラグインの実装
方針に従い、Typescript で以下のように実装した。好きなディレクトリに配置する（今回は `src/utils/spotifyEmbed.ts`）。
```typescript
import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

const spotifyRegex = /^https:\/\/open\.spotify\.com(?:\/[a-z\-]+)*\/track\/([A-Za-z0-9]+)/;

export default function rehypeSpotifyEmbed() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'a') return;
      const href = node.properties.href;
      if (typeof href !== 'string') return;

      if (
        !node.children ||
        node.children.length !== 1 ||
        node.children[0].type !== 'text' ||
        node.children[0].value !== href
      ) {
        return;
      }

      const spotifyMatch = spotifyRegex.exec(href);
      if (spotifyMatch) {
        const trackId = spotifyMatch[1];
        const src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
        const iframe: ElementContent = {
          type: 'element',
          tagName: 'iframe',
          properties: {
            style: 'border-radius:12px',
            src,
            width: '100%',
            height: '152',
            frameBorder: '0',
            allowFullScreen: true,
            allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
            loading: 'lazy',
          },
          children: [],
        };
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, iframe);
        }
        return;
      }
    });
  };
}
```

### プラグインの導入
作成したプラグインは、`astro.config.mjs` で追加する。
```mjs
import { defineConfig } from 'astro/config';
import rehypeSpotifyEmbed from './src/utils/spotifyEmbed';

export default defineConfig({
  markdown: {
    remarkRehype: {
      footnoteLabel: "脚注"
    },
    rehypePlugins: [rehypeSpotifyEmbed],
  },
});
```

### 動作確認
```markdown
https://open.spotify.com/intl-ja/track/0SXaUUfUs23HkglF8JsvHM?si=ada69362dce74526

[Soleil - Powerless](https://open.spotify.com/intl-ja/track/20GIfRzRqIIz9iU9eopWKP?si=ada3f150c51e44a6)
```

https://open.spotify.com/intl-ja/track/0SXaUUfUs23HkglF8JsvHM?si=ada69362dce74526

[Soleil - Powerless](https://open.spotify.com/intl-ja/track/20GIfRzRqIIz9iU9eopWKP?si=ada3f150c51e44a6)

動作していることが確認できる。

# まとめ
リンクを埋め込みに自動で展開する方法を説明し、一例として Spotify のリンクを埋め込みに変換する方法を紹介した。
これを応用すれば、例えば任意のリンクを自分で作ったカードに置換することも可能だと考えられる。

# 参考
- [公式のドキュメント](https://docs.astro.build/ja/guides/markdown-content/#markdown%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3)
- [【Astro】rehype (remark) プラグインを自作してMarkdown内の内部リンクをカードに変換する](https://pote-chil.com/posts/astro-rehype-plugin)
  - プラグインの実装は、こちらの記事の実装をたたき台とした
