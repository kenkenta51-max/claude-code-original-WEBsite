/* HYRULE MARKET — 商品詳細 */
(function () {
  const HM = window.HM, $ = s => document.querySelector(s);
  const it = HM.item(new URLSearchParams(location.search).get('id')) || HM.ITEMS[0];
  const shop = HM.SHOPS[it.shop];
  document.body.dataset.page = it.shop;
  document.title = `${it.name}（${it.real}）｜HYRULE MARKET`;
  document.addEventListener('pointerdown', () => HM.bgm(it.shop), { once: true });

  $('#iimg').src = it.art; $('#iimg').alt = it.name;
  const zel = /（ゼルダ）/.test(it.clerk), whoF = zel ? 'zelda' : { kokiri: 'link', hyrule: 'oyaji', ghost: 'poe' }[it.shop];
  const face = `<img src="${HM.faceSrc(whoF, { zelda: 'present', link: 'smile', oyaji: 'laugh', poe: 'lantern' }[whoF])}" alt="">`;
  const who = /^（(.+?)）/.exec(it.clerk);
  const clerkName = who ? (who[1] === '親父' ? '店主の親父' : who[1]) : shop.clerk;
  $('#iinfo').innerHTML = `
    <p class="crumb"><a href="index.html">TOP</a> ／ <a href="shop.html?s=${shop.id}">${shop.name}</a> ／ ${HM.esc(it.name)}</p>
    ${it.tag ? `<span class="gcard__tag" style="position:static;display:inline-block;margin-bottom:8px">${it.tag}</span>` : ''}
    <h1>${HM.esc(it.name)}</h1>
    <p class="real">中身は <b>${HM.esc(it.maker)}「${HM.esc(it.real)}」</b></p>
    <div class="pricebig"><span class="plate"><img src="assets/img/items/rupee-green.webp" alt="ルピー" style="width:14px">${HM.yen(it.price)}</span><span class="note">参考価格（税込・目安）</span></div>
    <p class="desc">${HM.esc(it.text)}</p>
    <div class="buyrow">
      <div class="qty"><button type="button" data-q="-1" aria-label="数を減らす">−</button><output id="q" aria-live="polite">1</output><button type="button" data-q="1" aria-label="数を増やす">＋</button></div>
      <button class="rbtn rbtn--red" type="button" id="buy"><span class="gem"></span>ふくろに入れる</button>
    </div>
    <a class="rbtn rbtn--ghost rbtn--sm" href="${HM.buyUrl(it)}" target="_blank" rel="noopener">実際の販売先をさがす ↗</a>
    <div class="clerkcomment"><div class="face">${face}</div><div class="dialog done"><span class="dialog__name">${HM.esc(clerkName)}</span><span class="dialog__text">${HM.esc(it.clerk.replace(/^（.+?）/, ''))}</span></div></div>
    <dl class="spec"><dt>お店</dt><dd>${shop.name}</dd><dt>カテゴリ</dt><dd>${HM.CATS[it.cat]}</dd><dt>メーカー</dt><dd>${HM.esc(it.maker)}</dd><dt>商品名</dt><dd>${HM.esc(it.real)}</dd><dt>ご注意</dt><dd>このサイトの注文はデモです。容量・価格は時期や販売店によって変わります。</dd></dl>`;
  $('#iinfo').querySelectorAll('.rbtn').forEach(b => b.insertAdjacentHTML('afterbegin', '<span class="shine"></span>'));

  let q = 1;
  $('#iinfo').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    q = Math.max(1, Math.min(20, q + +b.dataset.q)); $('#q').textContent = q; HM.sfx.select();
  });
  $('#buy').addEventListener('click', e => HM.addToBag(it.id, q, e.currentTarget));

  /* 材料が集まる演出：光の粒が品物に吸いこまれる */
  const show = $('#ishow'), item = $('#iitem');
  if (!HM.reduce) {
    item.animate([{ transform: 'scale(0) rotateY(-540deg)', opacity: 0 }, { transform: 'scale(1.1) rotateY(20deg)', opacity: 1, offset: .8 }, { transform: 'scale(1) rotateY(0)' }], { duration: 1600, delay: 700, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'backwards' });
    for (let i = 0; i < 36; i++) {
      const m = document.createElement('i'); m.className = 'mote'; show.appendChild(m);
      const a = Math.random() * Math.PI * 2, r = 200 + Math.random() * 220;
      m.animate([{ transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) scale(1.4)`, opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translate(-4px,-4px) scale(.2)', opacity: 0 }], { duration: 900 + Math.random() * 600, delay: Math.random() * 500, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'both' }).onfinish = () => m.remove();
    }
    setTimeout(() => HM.sfx.get(), 900);
  }
  /* ドラッグ・マウスで回す */
  let rot = 0, drag = null;
  item.addEventListener('pointerdown', e => { drag = { x: e.clientX, r: rot }; item.setPointerCapture(e.pointerId); item.style.cursor = 'grabbing'; });
  item.addEventListener('pointermove', e => { if (!drag) return; rot = drag.r + (e.clientX - drag.x) * .8; item.style.transform = `rotateY(${rot}deg)`; });
  item.addEventListener('pointerup', () => { drag = null; item.style.cursor = ''; });
  show.addEventListener('pointermove', e => {
    if (drag || HM.reduce) return; const r = show.getBoundingClientRect();
    item.style.transform = `rotateY(${((e.clientX - r.left) / r.width - .5) * 40}deg) rotateX(${(.5 - (e.clientY - r.top) / r.height) * 24}deg)`;
  });
  show.addEventListener('pointerleave', () => { if (!drag) item.style.transform = ''; });

  $('#related').innerHTML = HM.itemsOf(it.shop).filter(x => x.id !== it.id).slice(0, 4).map((x, i) => HM.card(x, i)).join('');
  HM.reveal();
})();
