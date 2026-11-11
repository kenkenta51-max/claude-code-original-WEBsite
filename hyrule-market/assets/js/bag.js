/* HYRULE MARKET — ふくろ（カート）・注文（デモ） */
(function () {
  const HM = window.HM, $ = s => document.querySelector(s);
  const panels = { bag: $('#p-bag'), form: $('#p-form'), confirm: $('#p-confirm'), done: $('#p-done') };
  const order = ['bag', 'form', 'confirm', 'done'];
  let addr = null;

  function calc() {
    const sub = HM.bag.subtotal(), c = HM.coupon.get();
    const disc = c && sub > 0 ? Math.floor(sub * c.rate / 100) : 0;
    const ship = sub === 0 || sub - disc >= HM.FREE_SHIP ? 0 : HM.SHIP;
    return { sub, disc, ship, total: sub - disc + ship, c };
  }
  function sumHtml(withBtn) {
    const k = calc(), rest = Math.max(0, HM.FREE_SHIP - (k.sub - k.disc));
    return `<h2>お会計</h2>
      ${k.c ? `<div class="coupon"><img src="assets/img/items/slingshot.webp" alt="">射的屋のおまけ：<b>${k.c.rate}%引き</b>（${HM.esc(k.c.code)}）</div>` : ''}
      <dl><dt>小計</dt><dd>${HM.yen(k.sub)}</dd>${k.disc ? `<dt>射的屋のおまけ</dt><dd>−${HM.yen(k.disc)}</dd>` : ''}<dt>送料</dt><dd>${k.ship ? HM.yen(k.ship) : '無料'}</dd><dt class="total">合計</dt><dd class="total">${HM.yen(k.total)}<small> ルピー</small></dd></dl>
      <p class="note" style="margin:0">送料無料まで ${rest ? `あと <b>${HM.yen(rest)}</b> ルピー` : '<b style="color:#b6ff7a">達成！</b>'}</p>
      <div class="magic" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, (k.sub - k.disc) / HM.FREE_SHIP)})"></i></div>
      <p class="note">${HM.yen(HM.FREE_SHIP)}ルピー以上で送料無料（1ルピー＝1円の参考表示）</p>
      ${withBtn ? `<button class="rbtn rbtn--red" type="button" data-go="form" style="width:100%;margin-top:10px" ${k.sub ? '' : 'disabled'}><span class="shine"></span><span class="gem"></span>お届け先の入力へ</button>` : ''}`;
  }
  function renderBag() {
    const list = HM.bag.list();
    $('#lines').innerHTML = list.length ? list.map((l, i) => {
      const it = HM.item(l.id), s = HM.SHOPS[it.shop];
      return `<div class="bline" style="--c:${s.color};animation-delay:${i * .06}s" data-id="${it.id}">
        <img src="${it.art}" alt="">
        <div><small>${s.name}</small><h3><a href="item.html?id=${it.id}" style="text-decoration:none">${HM.esc(it.name)}</a></h3><small>${HM.esc(it.maker)}「${HM.esc(it.real)}」</small><button class="rm" type="button" data-rm>とりのぞく</button></div>
        <div class="qty"><button type="button" data-d="-1" aria-label="数を減らす">−</button><output>${l.qty}</output><button type="button" data-d="1" aria-label="数を増やす">＋</button></div>
        <b class="lp latin">${HM.yen(it.price * l.qty)}</b></div>`;
    }).join('') : `<div class="empty"><img src="assets/img/items/sack.webp" alt=""><p class="serif" style="font-size:1.2rem">ふくろは からっぽだ……</p><a class="rbtn" href="index.html#hub"><span class="shine"></span><span class="gem"></span>十字路の店をのぞく</a></div>`;
    $('#sum').innerHTML = sumHtml(true);
  }
  function renderSum2() { document.querySelectorAll('[data-sum2]').forEach(e => e.innerHTML = sumHtml(false)); }

  $('#lines').addEventListener('click', e => {
    const line = e.target.closest('.bline'); if (!line) return;
    const id = line.dataset.id, cur = HM.bag.list().find(l => l.id === id);
    const d = e.target.closest('[data-d]');
    if (d) { HM.bag.setQty(id, cur.qty + +d.dataset.d); HM.sfx[+d.dataset.d > 0 ? 'rupee' : 'select'](); renderBag(); }
    if (e.target.closest('[data-rm]')) { line.classList.add('out'); HM.sfx.miss(); setTimeout(() => { HM.bag.setQty(id, 0); renderBag(); }, 380); }
  });

  function go(step) {
    if (step !== 'bag' && step !== 'done' && !HM.bag.count()) step = 'bag';
    order.forEach(k => panels[k].hidden = k !== step);
    document.querySelectorAll('#steps li').forEach((li, i) => li.classList.toggle('on', i <= order.indexOf(step)));
    if (step === 'bag') renderBag(); else if (step !== 'done') renderSum2();
    if (step === 'confirm') {
      $('#clist').innerHTML = HM.bag.list().map(l => { const it = HM.item(l.id); return `<li><span>${HM.esc(it.name)}（${HM.esc(it.real)}）× ${l.qty}</span><b class="latin">${HM.yen(it.price * l.qty)}</b></li>`; }).join('');
      $('#caddr').innerHTML = `${HM.esc(addr.name)} 様<br>〒${HM.esc(addr.zip)} ${HM.esc(addr.addr)}<br>${HM.esc(addr.mail)}<br>お支払い：${HM.esc(addr.pay)}`;
    }
    HM.sfx.select();
    window.scrollTo({ top: 0, behavior: HM.reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b && !b.disabled) go(b.dataset.go); });

  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, bad = [...f.querySelectorAll('[required]')].filter(i => !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)));
    f.querySelectorAll('[required]').forEach(i => i.setAttribute('aria-invalid', bad.includes(i)));
    if (bad.length) { $('#form-err').textContent = '入力されていない項目があります：' + bad.map(i => f.querySelector(`label[for="${i.id}"]`).textContent).join('、'); bad[0].focus(); HM.sfx.miss(); return; }
    $('#form-err').textContent = '';
    addr = Object.fromEntries(new FormData(f)); go('confirm');
  });

  $('#order').addEventListener('click', () => {
    const no = 'HM-' + Date.now().toString(36).toUpperCase().slice(-6);
    HM.bag.clear(); HM.coupon.set(null);
    go('done');
    $('#orderno').textContent = '注文番号 ' + no;
    const chest = $('#chest');
    setTimeout(() => { chest.classList.add('open'); HM.sfx.open(); }, 500);
    setTimeout(() => HM.sfx.get(), 1500);
  });

  go('bag');
})();
