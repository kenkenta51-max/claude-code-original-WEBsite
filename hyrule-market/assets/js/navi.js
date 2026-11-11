/* HYRULE MARKET — ゼルダのナビゲーター（全ページ共通） */
(function () {
  const HM = window.HM, page = document.body.dataset.page || '';
  const esc = HM.esc;
  HM.preloadFaces('zelda');

  /* ページごとの案内 */
  const TIPS = {
    top: ['時のはざまの十字路へようこそ。わたしはゼルダ。', 'お店へご案内しますね。扉にふれると、店員さんが顔を出しますよ。'],
    kokiri: ['ここはリンクのお店。', '森のドリンクと木の実のおやつ、それにコキリのグッズがあります。'],
    hyrule: ['城下町の親父さんのお店です。', 'ロンロン牧場のミルクは、ここでしか買えませんよ。'],
    ghost: ['…少しこわいけれど、商人さんは悪いひとではありません。', 'たぶん……。夜に光るグッズは、ここだけの品です。'],
    item: ['気になったら「ふくろに入れる」を。', '実際の販売先も、このページから調べられます。'],
    bag: null,
    game: ['親父さんの射的屋です。', '300点をこえると、ふくろの品が安くなりますよ。'],
    guide: ['わからないことがあれば、ここを見てくださいね。']
  };
  const bagTip = () => HM.bag.count() ? ['お届け先を入れて、宝箱をひらけば完了です。', '（このサイトの注文はデモです）'] : ['ふくろはまだ空っぽです。', 'お店をのぞいてみませんか？'];

  const root = document.createElement('div');
  root.className = 'zn'; root.innerHTML = `
    <div class="zn__bubble" hidden><button class="zn__x" type="button" aria-label="吹き出しを閉じる">×</button><span class="zn__name">ゼルダ</span><p class="zn__say"></p></div>
    <section class="zn__panel" id="zn-panel" hidden aria-label="ゼルダの案内">
      <button class="zn__close" type="button" aria-label="案内を閉じる">×</button>
      <img class="zn__img" src="${HM.faceSrc('zelda', 'smile')}" alt="ゼルダ">
      <div class="dialog done zn__dlg"><span class="dialog__name">ゼルダ</span><span class="dialog__text"></span></div>
      <div class="zn__body"></div>
    </section>
    <button class="zn__btn" type="button" aria-expanded="false" aria-controls="zn-panel" aria-label="ゼルダの案内をひらく"><img src="${HM.faceSrc('zelda', 'smile')}" alt=""><span>案内</span></button>`;
  document.body.appendChild(root);
  const $ = s => root.querySelector(s);
  const bubble = $('.zn__bubble'), say = $('.zn__say'), btn = $('.zn__btn'), panel = $('#zn-panel'), img = $('.zn__img'), dlg = $('.zn__dlg .dialog__text'), body = $('.zn__body'), btnImg = btn.querySelector('img');
  const face = k => { HM.face(img, 'zelda', k); HM.face(btnImg, 'zelda', k === 'think' ? 'normal' : k); };

  /* 吹き出し（文字送り） */
  let tTimer = null, hideTimer = null;
  function speak(lines, k = 'smile', ms = 7000) {
    if (!lines) return;
    clearInterval(tTimer); clearTimeout(hideTimer);
    if (!panel.hidden) { dlg.textContent = lines.join(''); face(k); return; }
    HM.face(btnImg, 'zelda', k);
    bubble.hidden = false; bubble.classList.remove('out');
    const s = lines.join('\n'); let i = 0; say.textContent = '';
    if (HM.reduce) say.textContent = s;
    else tTimer = setInterval(() => { say.textContent = s.slice(0, ++i); if (i % 3 === 0) HM.sfx.talk(); if (i >= s.length) clearInterval(tTimer); }, 34);
    hideTimer = setTimeout(hideBubble, ms);
  }
  function hideBubble() { bubble.classList.add('out'); setTimeout(() => { bubble.hidden = true; HM.face(btnImg, 'zelda', 'smile'); }, 300); }
  $('.zn__x').addEventListener('click', e => { e.stopPropagation(); hideBubble(); });
  bubble.addEventListener('click', () => openPanel());

  /* パネル：メニューと贈りもの相談 */
  const MENU = [
    ['index.html#hub', '十字路にもどる', 'items/compass'],
    ['shop.html?s=kokiri', 'コキリのショップ', 'items/deku-nut'],
    ['shop.html?s=hyrule', 'ハイラルショップ', 'goods/milk'],
    ['shop.html?s=ghost', 'ゴーストショップ', 'goods/poe-soul'],
    ['game.html', '城下町の射的屋', 'items/slingshot'],
    ['bag.html', 'ふくろ', 'items/sack'],
    ['guide.html', 'ご利用ガイド', 'items/map']
  ];
  function menu() {
    face('smile');
    dlg.textContent = 'どちらへご案内しましょう？ 贈りものに迷ったら、わたしに相談してくださいね。';
    const n = HM.bag.count();
    body.innerHTML = `<nav class="zn__menu" aria-label="ゼルダの案内メニュー">${MENU.map(m => `<a href="${m[0]}"><img src="assets/img/${m[2]}.webp" alt="">${m[1]}${m[0] === 'bag.html' && n ? `<b>${n}</b>` : ''}</a>`).join('')}</nav>
      <button class="rbtn rbtn--purple rbtn--sm zn__gift" type="button"><span class="shine"></span>贈りもの相談をする</button>`;
    body.querySelector('.zn__gift').addEventListener('click', quiz);
  }
  const Q = [
    { q: 'どなたへの贈りものですか？', o: [['家族へ', 'fam'], ['友だちへ', 'fri'], ['自分へのごほうび', 'me']] },
    { q: 'どんな気持ちを届けたいですか？', o: [['ほっとしてほしい', 'calm'], ['元気になってほしい', 'power'], ['特別な日を祝いたい', 'special']] }
  ];
  function quiz() {
    const ans = [];
    const step = () => {
      HM.sfx.select();
      if (ans.length < Q.length) {
        face('think'); const q = Q[ans.length];
        dlg.textContent = `（${ans.length + 1}/${Q.length}）${q.q}`;
        body.innerHTML = `<div class="quiz__opts zn__opts">${q.o.map(o => `<button type="button" data-v="${o[1]}">${o[0]}</button>`).join('')}</div><button class="zn__back" type="button">メニューにもどる</button>`;
        body.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { ans.push(b.dataset.v); step(); }));
        body.querySelector('.zn__back').addEventListener('click', menu);
      } else {
        const [who, mood] = ans;
        const pick = mood === 'special' ? (who === 'me' ? 'k-navi' : 'h-ocarina') : mood === 'power' ? (who === 'me' ? 'h-red' : 'h-blue') : (who === 'fam' ? 'h-royal' : who === 'fri' ? 'k-fairy' : 'h-milk');
        const it = HM.item(pick), shop = HM.SHOPS[it.shop];
        face('present'); HM.sfx.get();
        dlg.textContent = `それなら……${shop.name}の「${it.name}」がいいと思います。`;
        body.innerHTML = `<div class="zn__pick"><img src="${it.art}" alt=""><div><b>${esc(it.name)}</b><small>${esc(it.maker)}「${esc(it.real)}」／${HM.yen(it.price)}ルピー</small></div></div>
          <div class="quiz__opts zn__opts"><button type="button" class="zn__add">ふくろに入れる</button><a href="item.html?id=${it.id}">くわしく見る</a><button type="button" class="zn__re">もう一度</button></div><button class="zn__back" type="button">メニューにもどる</button>`;
        body.querySelector('.zn__add').addEventListener('click', e => HM.addToBag(it.id, 1, e.currentTarget));
        body.querySelector('.zn__re').addEventListener('click', () => { ans.length = 0; step(); });
        body.querySelector('.zn__back').addEventListener('click', menu);
      }
    };
    step();
  }
  function openPanel() {
    clearTimeout(hideTimer); bubble.hidden = true;
    panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); root.classList.add('open');
    menu(); HM.sfx.open();
    panel.querySelector('.zn__close').focus({ preventScroll: true });
  }
  function closePanel() {
    face('bye'); root.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { panel.hidden = true; face('smile'); }, 260); btn.focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  $('.zn__close').addEventListener('click', closePanel);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });
  // ページ移動のときは手を振る
  root.addEventListener('click', e => { if (e.target.closest('a[href]')) face('bye'); });

  /* ふくろに入れたら喜ぶ */
  const add = HM.addToBag;
  HM.addToBag = function (id, qty, from) {
    add(id, qty, from);
    const it = HM.item(id);
    setTimeout(() => speak([`${it.name}、いい選択ですね！`], 'happy', 3500), 1200);
  };

  /* TOPではFVのあいだは隠す */
  const fv = document.getElementById('fv');
  const show = () => root.classList.add('on');
  if (fv) {
    let greeted = false;
    const check = () => {
      const past = fv.getBoundingClientRect().bottom < innerHeight * .6;
      root.classList.toggle('on', past);
      if (past && !greeted) { greeted = true; setTimeout(() => speak(TIPS.top), 600); }
    };
    addEventListener('scroll', check, { passive: true }); check();
  } else {
    show();
    setTimeout(() => speak(page === 'bag' ? bagTip() : TIPS[page]), 1400);
  }
})();
