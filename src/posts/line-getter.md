---
title: "VSCode の拡張機能の作成と公開"
date: "2025-11-01"
lastModified: "2025-11-01"
---
# 概要
VSCode において、ファイル名と行番号をスムーズにコピーする拡張機能を作成し、公開した。
- [拡張機能](https://marketplace.visualstudio.com/items?itemName=lev635.line-getter)
- [レポジトリ](https://github.com/lev635/line-getter)

# 経緯
Python のデバッガ pdb では、ブレークポイントを設定する際に `(ファイル名):(行番号)` という形式で指定する必要がある。
これを行うには、
1. エクスプローラーから現在開いているファイル名をコピー
2. ターミナルにペースト
3. ブレークポイントを設定したい行番号を探し、ターミナルに入力

という手順を踏む必要がある。
デバッグをしていた際にこの手順が煩雑に感じたため、エディタの行番号を右クリックするだけで `(ファイル名):(行番号)` の形式でコピーできる拡張機能を作成した。

# 拡張機能の作成
## 環境構築
最初に必要なパッケージをインストールする。
```bash
npm install -g yo generator-code
```

インストールが完了したら
```bash
yo code
```

を実行し、ひな形を作成する。
色々聞かれるので以下のように対応する。
- What type of extension do you want to create?: **New Extension (TypeScript)**
- What's the name of your extension?: 好きな名前を入力
- What's the identifier of your extension?: 好きな文字列を入力
- What's the description of your extension?: Enter でスキップ
- Initialize a git repository?: どちらもでも良いが、リリースすることを考えて Yes
- Which bundler to use?: **unbundled**
- Which package manager to use?: **npm**

全てに回答すると indentifier の名前のディレクトリが生成される。
以降はこのディレクトリで作業する。

## 動作確認
生成されたばかりのひな形には簡単な拡張機能が実装されているので動作を確認する。
プロジェクトのルートディレクトリで `F5` キーを押すと新しいウィンドウが開かれる。
このウィンドウで動作を確認できる。
`ctrl + shift + P` でコマンドパレットを開き、`Hello World` を実行すると右下にメッセージが表示される。

## 実装
実装の詳細はレポジトリを参照。

実装の大まかな流れは以下の通り。
- `package.json` でコマンドを登録
- コマンドの内容を `src` ディレクトリ以下に実装

# 拡張機能の公開
拡張機能を Marketplace に公開する。

## Personal Access Token の取得
最初に [Microsoft Azure](https://portal.azure.com/#home) に登録する。
登録が完了したら [Azure DevOps Organization](https://portal.azure.com/#blade/AzureTfsExtension/OrganizationsTemplateBlade) に移動。
`Create new organization` をクリックし、組織を作成する。
![image](/assets/line-getter/image2.png)
作成が完了すると組織の画面に遷移するので、右上のメニューから `Personal access tokens` をクリックする。
![image](/assets/line-getter/image3.png)
下部の `Show all scopes` をクリックし、 `Marketplace` の `Acquire` と `Manage` にチェックを入れる。
`Create` をクリックするとPersonal Access Token が生成される。
**ここで生成された Token は二度と表示されない**のでどこかにメモを取る。

## publisher の登録
右上のメニューから `Brouse marketplace` をクリックし、[marketplace](https://marketplace.visualstudio.com/) に移動する。
![image](/assets/line-getter/image4.png)
右上の `Publish extensions` をクリックすると、拡張機能の管理画面に移動する。

`Create publisher` をクリックし、publisher を登録する。
名前（`Name`）を設定する必要があるが、これが発行者として marketplace に表示される。
![image](/assets/line-getter/image1.png)

## 公開
公開のための準備を行う。

まず `README.md` と `CHANGELOG.md` を編集する。
これらは marketplace に表示されるため、拡張機能の説明や更新履歴を書く。

次に `package.json` を編集する。
`publisher` というプロパティを作成し、先ほど作成した publisher の id を書く。

以上の手順で公開の準備は整った。
ここからコマンドを叩いて公開する。

まず公開に必要なパッケージをインストールする。
```bash
npm install -g vsce
```
次に vsce にログインする。
```bash
vsce login {publisher id}
```
Personal Access Token を求められるので入力する。

完了したら
```bash
vsce publish
```
を実行すると公開される。
![image](/assets/line-getter/image5.png)

# 感想
- 拡張機能開発特有の難しさはほとんどなく、非常に簡単に作ることができた。使いやすい API が公開されていると便利。
- アップロードしてから公開されるまでの時間から考えると、VSCode 側で拡張機能の内容のチェックはなされていないように思われた。
