# HYRULE MARKET — 時のオカリナ 三つの店（個人用ファンサイト）

「ゼルダの伝説 時のオカリナ」を記念した、個人で楽しむための非公式ファンサイトです。公開を目的としていません。

## 開き方
3D表現（Three.js）が画像を読み込むため、**ローカルサーバー経由**で開いてください。

- Mac：`start-mac.command` をダブルクリック（初回は右クリック →「開く」）
- Windows：`start-windows.bat` をダブルクリック
- 手動：このフォルダで `python3 -m http.server 8080` を実行し、http://localhost:8080/ を開く

`index.html` を直接ダブルクリックしても動きますが、時空の渦の中を飛ぶアイテム画像は表示されません。
フォントはGoogle Fontsから読み込みます（オフライン時は代わりのフォントで表示）。

## ページ
| ファイル | 内容 |
| --- | --- |
| index.html | TOP。時の神殿（3D）→ マスターソードを抜く → 時空の渦 → 十字路ハブ、おすすめ、射的屋の案内、買いものの流れ |
| shop.html?s=kokiri / hyrule / ghost | 3つの店。店員との会話、棚から選ぶ、品ぞろえの絞り込み、店ごとのミニ体験 |
| item.html?id=… | 商品詳細。光の粒が集まる登場演出、ドラッグで回転、店員のひとこと、実際の販売先検索 |
| bag.html | ふくろ（カート）→ お届け先 → 確認 → 宝箱が開いて完了（デモ） |
| game.html | 城下町の射的屋（10発、的・ルピー・黄金のスタルチュラ）。得点で割引クーポン |
| guide.html | ご利用ガイド・FAQ・このサイトについて |

## 構成
- `assets/css/` main.css（共通デザイン）・top.css・lower.css
- `assets/js/` data.js（店・商品データ）・common.js（ヘッダー、ふくろ、効果音、妖精カーソル、遷移）・fv.js（3D）・top.js・shop.js・item.js・bag.js・game.js
- `assets/vendor/` three.js r149（ローカル同梱）
- `assets/img/` 画像（提供素材の切り抜き・アイテム一覧からの切り出し）

商品を追加・変更するときは `assets/js/data.js` の `HM.ITEMS` を編集します。価格は参考価格（税込・目安）、1ルピー＝1円の表示です。
注文・決済はデモで、ふくろの中身はブラウザ（localStorage）にだけ保存されます。BGM・効果音はWeb Audioで合成したオリジナルです。
