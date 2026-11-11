/* HYRULE MARKET — データ（店舗・商品）
   価格は参考価格（税込・目安）。1ルピー = 1円として表示します。 */
window.HM = window.HM || {};

HM.SHOPS = {
  kokiri: {
    id: 'kokiri', name: 'コキリのショップ', en: 'KOKIRI SHOP', dir: 'north',
    clerk: 'リンク', clerkImg: 'assets/img/chara/link-normal.webp',
    tagline: '森の恵みと、妖精のひかり。',
    lead: 'デクの樹さまのお膝もと。森で冷やした緑のドリンクと木の実のおやつ、コキリのグッズを並べています。',
    color: '#5fae4a', deep: '#1d3a1f',
    greet: ['…！ いらっしゃい！ ここはコキリの森のお店だよ。', '森で冷やしたドリンクと木の実のおやつ、それにコキリのグッズもあるんだ。ゆっくり見ていって！'],
    bye: '気をつけてね。森の外は広いから！'
  },
  hyrule: {
    id: 'hyrule', name: 'ハイラルショップ', en: 'HYRULE SHOP', dir: 'west',
    clerk: '店主の親父', clerkImg: 'assets/img/chara/oyaji-normal.webp',
    tagline: '城下町いちばんの品ぞろえ。',
    lead: 'ハイラル城下町の老舗。ロンロン牧場のミルクに薬ビン、城下町の名物グッズまで。',
    color: '#c8623f', deep: '#3a1810',
    greet: ['なんでも屋へようこそ！ ゆっくりしてってくれ！', '牧場のミルクに薬ビン、城下町の名物グッズまでそろってるぜ。'],
    bye: 'まいど！ また来てくれよな！'
  },
  ghost: {
    id: 'ghost', name: 'ゴーストショップ', en: 'GHOST SHOP', dir: 'east',
    clerk: 'ゴースト商人', clerkImg: 'assets/img/chara/poe-normal.webp',
    tagline: '夜にしか会えない、紫の品。',
    lead: '墓地の奥、霧の向こう。魂の色をしたドリンクと真っ黒なおやつ、夜に光るグッズ。',
    color: '#9a6bff', deep: '#170f2b',
    greet: ['ヒッヒッヒ…よく来たな、旅人よ。', 'ビンに詰めた魂…いや、ドリンクを売ってやろう。'],
    bye: '…また夜に、会おう…'
  }
};

/* art: 画像パス / real: 実在の商品名 / maker: メーカー */
HM.ITEMS = [
  /* real: 実在の商品名 / maker: メーカー / label: 商品ラベルの日本語表記 / cat: drink・sweets・goods */
  // ---------- コキリのショップ（リンク） ----------
  { id: 'k-leaf', shop: 'kokiri', name: 'コキリの若葉ボトル', label: 'コキリの若葉', real: '三ツ矢サイダー 500ml', maker: 'アサヒ飲料', cat: 'drink', price: 160,
    art: 'assets/img/goods/mint-lime.webp', tag: 'おすすめ',
    text: '森の朝露みたいに、すっきり透明な炭酸。冒険の最初の一本に。', clerk: 'ぼくのいちばんのお気に入り！ 走ったあとに飲むと最高なんだ。' },
  { id: 'k-tea', shop: 'kokiri', name: 'デクの樹の緑茶', label: 'デクの樹の緑茶', real: 'お～いお茶 緑茶 525ml', maker: '伊藤園', cat: 'drink', price: 160,
    art: 'assets/img/goods/emerald-soda.webp',
    text: '大樹の葉のように深い緑。ほっと落ち着く、毎日の一本。', clerk: 'デクの樹サマも、きっとこういう味が好きだと思う。' },
  { id: 'k-fairy', shop: 'kokiri', name: '妖精のひかり水', label: '妖精のひかり水', real: 'カルピスソーダ 500ml', maker: 'アサヒ飲料', cat: 'drink', price: 160,
    art: 'assets/img/goods/fairy-bottle.webp', tag: '人気',
    text: 'ビンの中で妖精がまたたくような、やさしい甘さの乳性炭酸。', clerk: '妖精がいるみたいに光るんだ。ナビィには内緒だよ。' },
  { id: 'k-nut', shop: 'kokiri', name: 'デクナッツ・チョコ', label: 'デクナッツ', real: 'アーモンドチョコレート', maker: '明治', cat: 'sweets', price: 250,
    art: 'assets/img/items/deku-nut.webp',
    text: 'カリッと香ばしい木の実を、チョコでくるんだ森のおやつ。', clerk: 'デクナッツは投げるんじゃなくて、食べるのが正解！' },
  { id: 'k-stick', shop: 'kokiri', name: 'デクの棒プレッツェル', label: 'デクの棒', real: 'プリッツ', maker: '江崎グリコ', cat: 'sweets', price: 160,
    art: 'assets/img/items/stick.webp',
    text: '細くて軽い、ポキッと折れる棒。冒険のおともにぴったり。', clerk: '剣が見つかるまでは、これで戦ってたんだ…なんてね。' },
  { id: 'k-sword', shop: 'kokiri', name: 'コキリの剣 ペーパーナイフ', label: 'コキリの剣', real: 'ゼルダの伝説 コキリの剣 ペーパーナイフ', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 1980, tag: 'グッズ',
    art: 'assets/img/items/kokiri-sword.webp',
    text: '森の子どもたちの宝の剣を、手紙をひらくペーパーナイフに。', clerk: 'これは森の宝なんだ。…でも、きみにならいいよ！' },
  { id: 'k-navi', shop: 'kokiri', name: '妖精のビン ルームライト', label: '妖精のビン', real: 'ゼルダの伝説 妖精のビン ルームライト', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 3300, tag: 'グッズ',
    art: 'assets/img/goods/fairy-bottle.webp',
    text: 'ビンの中で妖精がふんわり光る、夜のおともの小さな灯り。', clerk: '夜、ひとりでも寂しくないように。妖精がそばにいてくれるよ。' },

  // ---------- ハイラルショップ（店主の親父） ----------
  { id: 'h-milk', shop: 'hyrule', name: 'ロンロン牧場のミルク', label: 'ロンロン牛乳', real: '明治おいしい牛乳 900ml', maker: '明治', cat: 'drink', price: 300,
    art: 'assets/img/goods/milk.webp', tag: '看板商品',
    text: '牧場の朝をそのままビンに。ごくごく飲める、まっすぐな牛乳。', clerk: 'こいつを飲めばハート3つは回復するってもんよ！' },
  { id: 'h-blue', shop: 'hyrule', name: '青いクスリ', label: '青いクスリ', real: 'ポカリスエット 500ml', maker: '大塚製薬', cat: 'drink', price: 160,
    art: 'assets/img/goods/sapphire.webp',
    text: 'サファイアのように澄んだ一本。体にしみわたる回復の青。', clerk: 'ダンジョン帰りの旅人がみんな買っていくぜ。' },
  { id: 'h-red', shop: 'hyrule', name: '赤いクスリ', label: '赤いクスリ', real: 'ウィルキンソン ジンジャエール 辛口', maker: 'アサヒ飲料', cat: 'drink', price: 120,
    art: 'assets/img/goods/ruby.webp', tag: '刺激的',
    text: 'ルビー色にきらめく、ピリッと辛口のジンジャー。目が覚める一撃。', clerk: 'ゴロンもびっくりの辛さだ。覚悟して飲みな！' },
  { id: 'h-tea', shop: 'hyrule', name: 'ハイラル城の紅茶', label: 'ハイラル城の紅茶', real: '午後の紅茶 ストレートティー', maker: 'キリンビバレッジ', cat: 'drink', price: 160,
    art: 'assets/img/goods/tea.webp',
    text: 'お城の中庭でいただく、午後のひととき。すっきり澄んだ香り。', clerk: 'お城の兵士もこっそり飲みに来る、上品な一本だ。' },
  { id: 'h-royal', shop: 'hyrule', name: '王家の贈りもの缶', label: '王家のクッキー', real: 'シガール（ギフト缶）', maker: 'ヨックモック', cat: 'sweets', price: 1296, tag: 'ギフト',
    art: 'assets/img/goods/giftcan.webp',
    text: '王家の青い缶に、くるりと巻いたバタークッキー。大切な人への贈りものに。', clerk: '城下町いちばんの手みやげだ。包み紙もサービスするぜ！' },
  { id: 'h-ocarina', shop: 'hyrule', name: '時のオカリナ', label: '時のオカリナ', real: 'ゼルダの伝説 時のオカリナ（陶器製オカリナ）', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 4400, tag: 'グッズ',
    art: 'assets/img/goods/ocarina.webp',
    text: '時を越えるメロディを、あなたの手で。吹いて遊べる陶器のオカリナ。', clerk: 'こいつは本当に吹けるんだ。ゼルダの子守歌、練習してみな！' },
  { id: 'h-shield', shop: 'hyrule', name: 'ハイリアの盾 クッション', label: 'ハイリアの盾', real: 'ゼルダの伝説 ハイリアの盾 クッション', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 3850, tag: 'グッズ',
    art: 'assets/img/items/mirror-shield.webp',
    text: '王国の紋章が入った盾を、ふかふかのクッションに。', clerk: '昼寝の守りはこれで完璧だ。がっはっは！' },

  // ---------- ゴーストショップ（ゴースト商人） ----------
  { id: 'g-soul', shop: 'ghost', name: 'ポウの魂', label: 'ポウの魂', real: 'Welch\'s グレープ100', maker: 'アサヒ飲料', cat: 'drink', price: 140, tag: '人気',
    art: 'assets/img/goods/poe-soul.webp',
    text: 'ビンの中でゆらめく紫。濃いぶどうの、夜のドリンク。', clerk: 'ヒッヒッ…魂は高く売れるのだ。だがこれは…安くしておこう。' },
  { id: 'g-blue', shop: 'ghost', name: '青い炎のビン', label: '青い炎', real: 'ファンタ グレープ 500ml', maker: 'コカ・コーラ', cat: 'drink', price: 160,
    art: 'assets/img/items/bottle-blue.webp',
    text: 'はじける泡が、青白い炎のように舌の上で踊る。', clerk: '氷も溶かす…いや、口の中をシュワッとさせるだけだ。' },
  { id: 'g-skull', shop: 'ghost', name: '黄金のスタルチュラ', label: '黄金のスタルチュラ', real: 'ブラックチョコレート', maker: '明治', cat: 'sweets', price: 150,
    art: 'assets/img/goods/choco.webp',
    text: '闇のようにビターな板チョコ。100枚集めると…何かが起こる？', clerk: '呪いを解く鍵は…カカオにある…' },
  { id: 'g-bomb', shop: 'ghost', name: 'バクダン', label: 'バクダン', real: 'ブラックブラック ガム', maker: 'ロッテ', cat: 'sweets', price: 130,
    art: 'assets/img/items/bomb.webp', tag: '要注意',
    text: '口に入れたとたん炸裂する、強烈ミント。眠気も吹き飛ぶ。', clerk: '火気厳禁…ではないが、心して噛むがいい…' },
  { id: 'g-chu', shop: 'ghost', name: 'ボムチュウ', label: 'ボムチュウ', real: 'シゲキックス', maker: 'UHA味覚糖', cat: 'sweets', price: 160,
    art: 'assets/img/items/bombchu.webp',
    text: '壁を走り回るように、すっぱさが口の中を駆けめぐる。', clerk: 'ヒヒッ…すっぱさで、顔がくしゃっとなるぞ…' },
  { id: 'g-lens', shop: 'ghost', name: 'まことのメガネ', label: 'まことのメガネ', real: 'ゼルダの伝説 まことのメガネ ルーペ', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 2750, tag: 'グッズ',
    art: 'assets/img/items/lens.webp',
    text: '見えないものが見える…かもしれない。机に置いても絵になるルーペ。', clerk: 'このレンズでのぞけば…隠れた魂も…ヒッヒッ…' },
  { id: 'g-lantern', shop: 'ghost', name: 'ポウのランタン', label: 'ポウのランタン', real: 'ゼルダの伝説 ポウのランタン LEDライト', maker: 'ゼルダの伝説 グッズ', cat: 'goods', price: 3080, tag: 'グッズ',
    art: 'assets/img/goods/poe-soul.webp',
    text: '紫の炎がゆらめく、手のひらサイズの灯り。夜の散歩に。', clerk: 'わたしと同じランタンだ…夜道で、きっと役に立つ…' }
];

/* 店員の表情差分 */
HM.FACES = {
  link: ['normal', 'smile', 'surprise', 'thumbs', 'bye'],
  zelda: ['normal', 'smile', 'present', 'happy', 'think', 'bye'],
  oyaji: ['normal', 'laugh', 'point', 'surprise', 'thumbs'],
  poe: ['normal', 'laugh', 'lantern', 'bow']
};
HM.faceSrc = (who, key) => `assets/img/chara/${who}-${HM.FACES[who].includes(key) ? key : 'normal'}.webp`;

HM.item = id => HM.ITEMS.find(i => i.id === id);
HM.itemsOf = shop => HM.ITEMS.filter(i => i.shop === shop);
HM.buyUrl = it => 'https://www.amazon.co.jp/s?k=' + encodeURIComponent(it.cat === 'goods' ? it.real : it.maker + ' ' + it.real);
HM.CATS = { drink: 'ドリンク', sweets: 'お菓子', goods: 'ゼルダグッズ' };
HM.FREE_SHIP = 3000;
HM.SHIP = 500;

/* ゴースト商人（SVGで描画） */
HM.poeSVG = `<svg class="poe" viewBox="0 0 220 300" role="img" aria-label="ゴースト商人">
  <defs>
    <radialGradient id="poeEye" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c0"/><stop offset=".35" stop-color="#ff3b2f"/><stop offset="1" stop-color="#ff3b2f" stop-opacity="0"/></radialGradient>
    <linearGradient id="poeCloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3fb4"/><stop offset=".7" stop-color="#3a1f6b"/><stop offset="1" stop-color="#3a1f6b" stop-opacity=".1"/></linearGradient>
    <radialGradient id="poeFlame" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#f3e3ff"/><stop offset=".4" stop-color="#b47cff"/><stop offset="1" stop-color="#6a2fd0" stop-opacity="0"/></radialGradient>
  </defs>
  <g class="poe__body">
    <path d="M110 18c-42 0-70 34-74 84-4 50-2 96-14 140 12-8 20 6 30-4 8 14 18 4 26 14 8-12 20 0 30-10 10 10 22-2 30 8 8-10 18 2 26-8 10 6 18-6 28 2-14-46-14-92-16-142C172 52 150 18 110 18z" fill="url(#poeCloak)"/>
    <path d="M110 34c-30 0-50 26-52 60 14 18 34 26 52 26s38-8 52-26c-2-34-22-60-52-60z" fill="#0b0614"/>
    <circle class="poe__eye" cx="122" cy="84" r="16" fill="url(#poeEye)"/>
    <path d="M60 150c-18 10-26 30-24 50" stroke="#4b2a86" stroke-width="16" stroke-linecap="round" fill="none"/>
    <path d="M160 150c18 12 26 26 28 44" stroke="#4b2a86" stroke-width="16" stroke-linecap="round" fill="none"/>
  </g>
  <g class="poe__lantern">
    <line x1="188" y1="196" x2="188" y2="214" stroke="#c9b27a" stroke-width="2"/>
    <rect x="174" y="214" width="28" height="36" rx="5" fill="rgba(200,170,255,.25)" stroke="#c9b27a" stroke-width="3"/>
    <ellipse class="poe__flame" cx="188" cy="234" rx="16" ry="22" fill="url(#poeFlame)"/>
  </g>
</svg>`;
