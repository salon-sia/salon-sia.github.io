# Sia Total Beauty Salon - ホームページ

## 概要

茅野市の美容室「Sia Total Beauty Salon」の店舗情報を反映した静的ホームページです。
実際の画像、メニュー、スタッフ情報を元に作成されています。

## ファイル構成

```
salon_website/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── main.js         # JavaScriptファイル
├── data/
│   ├── menu.json       # メニュー・料金データ（JSONファイル）
│   ├── staff.json      # スタッフ情報データ（JSONファイル）
│   ├── salon.json      # 店舗基本情報
│   ├── story.json      # OUR STORY
│   ├── space.json      # RELAXING SPACE
│   ├── guide.json      # FOR FIRST-TIME GUESTS
│   └── total_beauty.json # TOTAL BEAUTY
└── README.md           # このファイル
```

## 使い方

### ローカルで表示する

JSONファイルを動的に読み込むため、ローカルサーバー経由で表示する必要があります。

**Pythonを使用する場合:**
```bash
cd salon_website
python3 -m http.server 8080
# ブラウザで http://localhost:8080 を開く
```

## 更新・カスタマイズ方法

### メニュー・料金の変更
`data/menu.json` を編集してください。

### スタッフ情報の変更
`data/staff.json` を編集してください。

### 画像について
本サイトでは公式画像のURLを直接参照しています。

## 店舗情報

| 項目 | 内容 |
|------|------|
| 店舗名 | Sia Total Beauty Salon |
| 住所 | 長野県茅野市仲町23番36-1号 |
| 電話 | 0266-00-0000 |
| 営業時間 | 平日 10:00〜20:00 / 土日祝 9:00〜19:00 |
| 定休日 | 年中無休（臨時休業あり） |
| アクセス | JR中央線 茅野駅より徒歩13分 または 中央道 茅野ICより車で7分 |

## サービス詳細の変更

サービスカードをクリックすると、`data/service-{menuid}.json` の詳細情報が表示されます。`service.json` の各アイテムに設定した `menuid` と同じ名前のファイルを作成してください。

例えば `menuid` が `cut` の場合は `data/service-cut.json` を読み込みます。`content` にはHTMLタグを含められます。詳細表示の本文をクリックすると通常のカード表示に戻り、本文が長い場合は自動的にスクロールします。下部の「メニューを見る」は常時表示され、対応する `menuid` のメニュータブへ移動します。

```json
{
  "title": "サービス詳細の見出し",
  "content": "<p>HTMLタグを含む詳細説明です。</p><ul><li>特徴1</li><li>特徴2</li></ul>"
}
```

## ギャラリーの変更

`data/gallery.json` の `images` 配列で、サムネイル画像の `url` または `thumbnail` に外部URL・相対パスを指定できます。`instagram` を設定した画像はクリック時に新しいウィンドウでInstagramを開きます。`instagram` を省略した画像はリンクなしで表示されます。

## FAQの変更

`data/faq.json` の `items` 配列にオブジェクトを追加・削除することで、FAQ項目を増減できます。各項目は `question` と `answer` で構成され、画面上では開閉式で表示されます。

## FINAL MESSAGEの変更

`data/final_message.json` の `title`、`subtitle`、`paragraphs` を編集すると、アクセス情報の後に表示されるメッセージを変更できます。

## Googleマップの変更

`data/access.json` の `map.googleMapUrl` にGoogleマップの共有URLを指定すると、アクセス欄のマップエリア全体が新しいウィンドウで開くリンクになります。

## 予約リンクボタンの変更

`data/reserve-link.json` は配列形式です。配列の順序がボタンの左から右への表示順になります。各項目には `color`（ボタン色）、`title`（ボタン表示名）、`url`（リンク先）を指定します。`url` には通常のWeb URL（`https://...`）またはサイト内識別子を指定できます。`CONCEPT01`〜`CONCEPT10` はすべて `index.html#concept` に統一され、実際にはページ内で最も先頭に存在する `CONCEPTXX` セクションへ移動します。`CONTACT` に続けて半角ハイフン（`-`）とサービス名（例: `CONTACT-hair`, `CONTACT-color`）を指定すると、お問い合わせセクションへジャンプすると同時に、ご希望のサービスのドロップダウンリストで該当する項目が自動的に選択されます（対応する値がない場合は「選択してください」になります）。`MENU` に続けて半角ハイフンとカテゴリーID（例: `MENU-hair`, `MENU-eyelash`, `MENU-nail`）を指定すると、メニュー・料金表へジャンプすると同時に、`menu.json` の該当カテゴリータブが選択状態になります（対応するIDがない場合は「おすすめクーポン」が選択されます）。`CONTACT-STAFF-スタッフID`（例: `CONTACT-STAFF-yamamoto`）を指定すると、お問い合わせフォームへジャンプし、`staff.json` のスタッフ名を使った指名希望テンプレートをメッセージ欄の冒頭へ自動入力します。その他のサイト内識別子は、同じページの該当セクションへ移動し、新しいウィンドウは開きません。例えば `CONTACT` は `#contact`、`OUR STORY` は `#our-story`、`FINAL MESSAGE` は `#final-message` として扱われます。Web URLは新しいウィンドウで開きます。

```json
[
  {
    "color": "#b39b7a",
    "title": "ホットペッパーで予約",
    "url": "https://beauty.hotpepper.jp/slnH000433368/"
  },
  {
    "color": "#4a5859",
    "title": "お問い合わせフォーム",
    "url": "CONTACT"
  }
]
```

## スタッフ指名問い合わせボタン

`data/staff.json` の各スタッフに `contactButton` を設定すると、STAFFセクションのカード内に指名問い合わせボタンを表示できます。ボタンを押すとCONTACTセクションへ移動し、メッセージ・ご要望欄の冒頭に次の形式で入力されます。

```text
【担当スタッフ 山本 シュンスケ 希望】
・ご希望の日時
・ご希望のスタイル
・その他のご要望事項。
```

ボタンの表示名と色はスタッフごとに変更できます。

```json
{
  "id": "yamamoto",
  "name": "山本 シュンスケ",
  "contactButton": {
    "title": "このスタッフを指名して相談",
    "color": "#8faec4"
  }
}
```

## Instagram欄に `FILMING` を指定する場合

`data/staff.json` のスタッフ情報または `data/gallery.json` の画像情報で、`instagram` の値に `FILMING` を指定できます。対象をクリックすると表示が「撮影中」に切り替わり、「撮影中」の画面を再度クリックすると元の表示に戻ります。キーボードではEnterキーまたはSpaceキーでも切り替え可能です。

```json
{
  "instagram": "FILMING"
}
```

`instagram` に通常のURLを指定した場合は、従来どおり新しいウィンドウでInstagramを開きます。この仕様はスタッフカードとギャラリーのサムネイルの両方に適用されます。

## site-design.jsonによるデザイン設定

`data/site-design.json` でサイト全体のデザインを変更できます。`colors` の各項目は `value` と `description` で定義し、カラー値と用途説明を管理します。`fonts` にはGoogle Fontsの `googleFont` クエリ値、CSSで使用する `family`、用途説明の `description` を指定します。ページ読み込み時にGoogle Fontsが動的に読み込まれ、CSS変数へ反映されます。

`filming` では、`FILMING` 指定時の画面について `fontFamily`、`color`、`backgroundColor`、`description` を設定できます。

```json
{
  "filming": {
    "fontFamily": "'Noto Serif JP', serif",
    "color": "#eae6e0",
    "backgroundColor": "#eae6e0",
    "description": "「撮影中」の画面の設定"
  }
}
```

スタッフ情報では、`id` が `nishio` のスタッフのみ通常のInstagram URLを維持し、それ以外は `FILMING` 指定になっています。

## 共通情報の管理場所

店名、住所、電話番号、営業時間、定休日、GoogleマップURLなど、複数箇所で使う情報は `data/salon.json` の `name` と `contact` に集約しています。`access.json` にはアクセス欄固有の見出しと、駐車場・支払方法などの補足項目だけを記載します。フッターとアクセス欄は `salon.json` を参照して表示するため、住所や電話番号を複数ファイルへ入力する必要はありません。

```text
salon.json
├── name                         店名
└── contact
    ├── address                  住所
    ├── phone                    電話番号
    ├── businessHours            営業時間・定休日
    ├── googleMapUrl             Googleマップの遷移先
    └── mapNote                  アクセス案内
```

## CONCEPT01〜10の反映箇所

`data/concept01.json` から `data/concept10.json` は、`index.html` の `<!-- ========== CONCEPT01 ========== -->` から `<!-- ========== CONCEPT10 ========== -->` に対応する各コンセプトセクションへ反映されます。`subtitle` と `title` はセクション見出し、`image` はイメージ画像のURL、`paragraphs` は本文、`features` は特徴カード、`links` は下部のリンクボタンとして表示されます。

## JSON変更がブラウザに反映されない場合

ブラウザ、開発用サーバー、プロキシなどがJSONレスポンスをキャッシュしていると、`concept01.json` などを編集しても古い内容が表示される場合があります。今回の対策として、JavaScriptのJSON読み込みに毎回異なる `?ts=現在時刻` クエリを付与し、Fetch APIの `cache: 'no-store'` も指定しています。これにより、通常はページを再読み込みするたびに最新のJSONが取得されます。

それでも反映されない場合は、次の点を確認してください。

| 確認項目 | 内容 |
|---|---|
| 編集対象 | 実際に配信しているプロジェクト内の `data/concept01.json`〜`data/concept10.json` を編集しているか確認します。 |
| 起動場所 | `python3 -m http.server 8080` を `salon_website` ディレクトリで実行します。 |
| URL | `file://` ではなく `http://localhost:8080/` で開きます。 |
| JSON構文 | 文字列内の生改行・TAB・末尾カンマがないことを確認します。 |
| 開発者ツール | Networkで `concept01.json?ts=...` などのStatusが200になっているか確認します。 |

ブラウザが別のポートや別ディレクトリのサーバーを表示している場合、強制リロードを行っても編集内容は反映されません。

## businessHoursの設定形式

営業時間は `data/salon.json` の `contact.businessHours` に文字列配列で定義します。配列の順序どおりにアクセス欄とフッターへ表示されるため、曜日や特別営業時間を自由に追加・削除できます。定休日は `contact.holiday` で別に定義します。

```json
{
  "contact": {
    "businessHours": [
      "平日：10:00〜20:00",
      "土日祝：9:00〜19:00",
      "年末年始：5:00〜19:00"
    ],
    "holiday": "年中無休（臨時休業あり）"
  }
}
```

## 複数CONCEPT / COSMETOLOGYセクションの管理

ページの `index.html` には `CONCEPT01`〜`10` および `COSMETOLOGY01`〜`20` までの枠を用意しています。各セクションの内容は、`data/` ディレクトリ内の対応するJSONファイル（例: `cosmetology01.json`）で管理します。表示したくないセクションは、`index.html` 内で該当する `<section>` をコメントアウトしてください。

### リンク識別子の指定方法

各JSONの `links` 配列で指定できる `url` の仕様は以下の通りです：

| 指定値 | 動作 |
|---|---|
| `CONCEPT01`〜`10` | すべて `index.html#concept` へ統一され、ページ内で最初に存在するCONCEPTセクションへジャンプします。 |
| `COSMETOLOGY01`〜`20` | 指定した番号のセクション（例: `#cosmetology05`）へ直接ジャンプします。 |
| `CONTACT` | `#contact` へジャンプします。`CONTACT-hair` のようにサービスIDを付けると、お問い合わせフォームのサービス選択も自動設定されます。 |
| `MENU` | `#menu` へジャンプします。`MENU-hair` のように `menu.json` のカテゴリーIDを付けると、該当タブを選択状態にします。 |
| `SERVICES` 等 | 対応するセクション（例: `#services`）へジャンプします。空白を含む識別子（`OUR STORY` 等）はハイフン繋ぎ（`#our-story`）に変換されます。 |
| `https://...` | 外部URLとして新しいウィンドウで開きます。 |

`COSMETOLOGY` セクションも `CONCEPT` と同様に、画像（`image`）や特徴（`features`）を空にすることで、テキストのみの左寄せレイアウトへ自動的に切り替わります。また、`paragraphs` 内での `\n` による改行も同様にサポートしています。

```json
"links": [
  {
    "color": "#4a5859",
    "title": "お問い合わせフォーム",
    "url": "CONTACT"
  },
  {
    "color": "#8faec4",
    "title": "公式サイト",
    "url": "https://example.com/"
  }
]
```

### CONCEPTの画像・特徴カードを非表示にする方法

各 `conceptXX.json` で `image` を空文字にすると画像が非表示になります。また、`features` を空配列にすると特徴カードが非表示になります。両方を非表示にした場合は、タイトルと本文を中心としたテキストのみのレイアウトへ自動的に切り替わります。

### paragraphs内で改行する方法

`paragraphs` の文字列内にJSONの改行エスケープ `\n` を記述すると、ブラウザ上では `<br>` に変換され、パラグラフ内で改行されます。JSON文字列へ実際の改行を直接入力するとJSON構文エラーになるため、必ず `\n` の2文字（バックスラッシュと `n`）で指定してください。改行位置やHTMLタグは安全のためエスケープされ、テキストとして表示されます。

```json
{
  "paragraphs": [
    "1行目の文章です。\n2行目の文章です。\n3行目の文章です。"
  ]
}
```

1つの段落を分けて表示したい場合は、`paragraphs` 配列の要素を分けてください。配列の要素ごとに別の `<p>` として描画されます。

```json
{
  "subtitle": "Concept 02",
  "title": "文章だけのコンセプト",
  "image": "",
  "paragraphs": [
    "タイトルと本文だけを表示したい場合の例です。"
  ],
  "features": [],
  "links": []
}
```
