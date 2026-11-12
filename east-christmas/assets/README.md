# 画像素材（assets）

このフォルダに **同じファイル名の WebP または PNG** を入れると、サイトの仮素材が実画像に差し替わります（WebP → PNG → 仮素材の順に探します）。
入っていないものは、コードで描いた仮素材が表示されます。

現在は、生成していただいた素材（2026年11月受け取り分）を WebP に変換して入れています。元の PNG は合計約70MBあったため、表示サイズに合わせて圧縮・縮小し、透過の余白も一部切り詰めています。サイト下部の「素材の読み込み状況」で、どれが仮素材のままか確認できます。

- 透過が必要なものは透過 PNG にしてください。
- テクスチャ3点（`tex_*`）は CSS の背景として使います。

## ファイル一覧

| ファイル名 | サイズ | 角度 | 透過 | 使う場所 |
| --- | --- | --- | --- | --- |
| bg_table_pc.png | 1536×1024 | 45° | なし | ファーストビュー背景（PC） |
| bg_table_sp.png | 1024×1536 | 45° | なし | ファーストビュー背景（スマホ） |
| tex_red_paper.png | 1024×1024 | 真上 | なし | 赤いセクションの紙 |
| tex_green_paper.png | 1024×1024 | 真上 | なし | 緑のセクションの紙 |
| tex_gold_foil.png | 1024×1024 | 真上 | なし | （予備） |
| ribbon_gold.png | 1536×1024 | 正面 | あり | タイトルのリボン |
| holly.png | 1024×1024 | 45° | あり | 浮遊装飾 |
| garland_pine.png | 1536×1024 | 正面 | あり | セクション上部のガーランド |
| ornament_1.png 〜 ornament_6.png | 512×512 | 正面 | あり | 金のボール／赤のボール／ガラスのボール／金の星／赤いベル／松ぼっくり |
| gift_closed.png / gift_open.png / gift_green.png | 1024×1024 | 45° | あり | プレゼント箱 |
| sweet_gingerbread.png / sweet_candycane.png / sweet_star.png / sweet_snow.png | 1024×1024 | 45° | あり | 焼き菓子 |
| oven_closed.png / oven_open.png | 1024×1024 | 正面 | あり | オーブン |
| chicken_raw.png / chicken_mid.png / chicken_done.png | 1024×1024 | 45° | あり | 焼き上がりの3段階 |
| steam.png | 1024×1536 | 正面 | なし（黒背景） | 湯気（スクリーン合成） |
| showcase.png | 1536×1024 | 正面 | なし | ケーキのショーケース |
| cake_naked.png | 1024×1024 | 45° | あり | デコレーション前のケーキ |
| cake_short.png / cake_fruit.png / cake_cheese.png / cake_choco.png | 1024×1024 | 45° | あり | 4種のケーキ |
| cake_cut.png | 1024×1024 | 45° | あり | 1/6を切り取ったケーキ |
| cake_slice.png | 1024×1024 | 45° | あり | 切り取った1ピース |
| strawberry_1.png 〜 strawberry_4.png | 512×512 | 45° | あり | 丸ごとの苺（向き違い） |
| strawberry_half_1.png / strawberry_half_2.png | 512×512 | 45° | あり | 半分にカットした苺 |
| rosette_1.png 〜 rosette_4.png | 512×512 | 45° | あり | ホイップのロゼット（cream_rosettes を分割） |
| dish_*.png（18点） | 1024×1024 | 真上 | あり | オードブル単品（下記） |
| tray_wood.png | 1536×1024 | 真上 | あり | オードブルトレー |
| table_top.png | 1536×1024 | 真上 | なし | 食卓（テーブルランナーは横向き） |
| plate.png / glass_wine.png / glass_juice.png / candle.png | 1024×1024 | 真上 | あり | 食器 |
| fork.png / knife.png | 256×1024 | 真上 | あり | カトラリー（縦向き） |
| chicken_platter.png | 1024×1024 | 真上 | あり | 丸鶏の大皿 |
| top_short.png / top_fruit.png / top_cheese.png / top_choco.png | 1024×1024 | 真上 | あり | ケーキを真上から |
| dome.png | 1024×1536 | 正面 | あり | 空のスノードーム |
| storefront_pc.png / storefront_sp.png | 1536×1024 / 1024×1536 | 正面 | なし | アドベントカレンダーの背景 |

オードブル単品のファイル名：
`dish_chicken_cut` `dish_chicken_leg` `dish_salmon` `dish_ratatouille` `dish_gratin` `dish_salad` `dish_pork` `dish_shrimp` `dish_quiche` `dish_caprese` `dish_fry` `dish_beef` `dish_scallop` `dish_cheese` `dish_lasagna` `dish_meatball` `dish_terrine` `dish_penne`

## 生成依頼文からの変更点

- **cake_cut / cake_slice**：上面に飾りのないケーキ（cake_naked と同じ状態）を切ったものにしてください。サイトでは、お客さまが絞ったホイップといちごを上に重ねるためです。
- **分割素材は1点ずつに切り分け**：ornaments → `ornament_1〜6`、gift_boxes → `gift_closed / gift_open / gift_green`、sweets → `sweet_*`、strawberries → `strawberry_1〜4` と `strawberry_half_1〜2`、cutlery → `fork` と `knife`。シートのまま渡してもらえれば、こちらで切り分けます。
- **使わない素材**：cake_sponge（C02）、garnish（D19）。cream_rosettes（C08）はタップ・おまかせのホイップに使っています。

## 位置合わせ（実画像に差し替えたあとに調整する箇所）

`index.html` の次の数値は、仮素材の形に合わせてあります。実画像で位置がずれたら調整します。

- ケーキ上面の楕円：`GEO.cakeTop`（cake_naked / cake_cut の上面。ホイップといちごを置ける範囲）
- オーブンの窓：CSS `.oven-window`（oven_closed の窓の位置）
- スノードームの内側：CSS `.dome-inner`（dome のガラス球の位置）
- ショーケースの棚：各 `.sc-cake` の `top`（46% と 80%）
