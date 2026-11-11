/* HYRULE MARKET — 共通スクリプト（ヘッダー、ふくろ、効果音、妖精、遷移、演出） */
(function () {
  const HM = window.HM;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  HM.reduce = reduce;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('hm:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('hm:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  HM.store = store;
  HM.yen = n => n.toLocaleString('ja-JP');
  HM.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- ふくろ（カート） ---------- */
  const bag = {
    list() { return store.get('bag', []).filter(l => HM.item(l.id)); },
    save(l) { store.set('bag', l); bag.render(); },
    count() { return bag.list().reduce((a, l) => a + l.qty, 0); },
    add(id, qty = 1) { const l = bag.list(); const f = l.find(x => x.id === id); f ? f.qty = Math.min(f.qty + qty, 99) : l.push({ id, qty }); bag.save(l); },
    setQty(id, q) { let l = bag.list(); l = q <= 0 ? l.filter(x => x.id !== id) : l.map(x => x.id === id ? { id, qty: Math.min(q, 99) } : x); bag.save(l); },
    clear() { bag.save([]); },
    subtotal() { return bag.list().reduce((a, l) => a + HM.item(l.id).price * l.qty, 0); },
    render() {
      document.querySelectorAll('[data-bag-count]').forEach(el => { const c = bag.count(); el.textContent = c || ''; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    }
  };
  HM.bag = bag;
  HM.coupon = { get() { return store.get('coupon', null); }, set(c) { store.set('coupon', c); } };

  /* ---------- 効果音（Web Audio で合成したオリジナル） ---------- */
  let ctx = null, master = null;
  HM.sound = store.get('sound', true);
  function ac() {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); master = ctx.createGain(); master.gain.value = .35; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  HM.ac = () => (HM.sound ? ac() : null);
  HM.master = () => master;
  function tone(f, t, d, type = 'sine', v = .3, slide) {
    const c = HM.ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, c.currentTime + t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime + t + d);
    g.gain.setValueAtTime(0, c.currentTime + t); g.gain.linearRampToValueAtTime(v, c.currentTime + t + .012); g.gain.exponentialRampToValueAtTime(.0008, c.currentTime + t + d);
    o.connect(g); g.connect(master); o.start(c.currentTime + t); o.stop(c.currentTime + t + d + .05);
  }
  function noise(t, d, v = .2, from = 800, to = 4000) {
    const c = HM.ac(); if (!c) return;
    const b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), a = b.getChannelData(0);
    for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(from, c.currentTime + t); f.frequency.exponentialRampToValueAtTime(to, c.currentTime + t + d);
    g.gain.setValueAtTime(v, c.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + t + d);
    s.connect(f); f.connect(g); g.connect(master); s.start(c.currentTime + t);
  }
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  HM.sfx = {
    select() { tone(N(84), 0, .06, 'square', .08); tone(N(91), .05, .08, 'square', .06); },
    rupee() { tone(N(88), 0, .12, 'triangle', .25); tone(N(95), .07, .35, 'triangle', .22); },
    get() { [67, 72, 76, 79, 84].forEach((n, i) => tone(N(n), i * .09, .5, 'triangle', .22)); tone(N(88), .5, 1.1, 'sine', .18); },
    open() { [60, 64, 67, 71, 74, 77, 81, 84].forEach((n, i) => tone(N(n), i * .07, .4, 'triangle', .14)); noise(.55, .9, .08, 3000, 9000); },
    warp() { noise(0, 1.4, .22, 200, 6000); tone(N(48), 0, 1.4, 'sawtooth', .05, N(72)); },
    sword() { noise(0, .35, .25, 4000, 12000); tone(N(96), 0, .6, 'square', .05); tone(N(103), .02, .8, 'sine', .12); },
    hit() { tone(N(79), 0, .1, 'square', .12); tone(N(91), .06, .2, 'square', .1); },
    miss() { tone(N(55), 0, .18, 'sawtooth', .08, N(43)); },
    shoot() { noise(0, .12, .18, 600, 2400); },
    talk() { tone(N(76 + Math.floor(Math.random() * 5)), 0, .04, 'square', .035); }
  };

  /* やさしいBGM（オリジナルのアルペジオ） */
  let bgmTimer = null;
  const BGMS = {
    kokiri: { bpm: 132, wave: 'triangle', seq: [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 74] },
    hyrule: { bpm: 112, wave: 'triangle', seq: [67, 71, 74, 79, 76, 72, 67, 72, 69, 72, 76, 81, 79, 74, 71, 74] },
    ghost: { bpm: 84, wave: 'sine', seq: [57, 60, 63, 66, 63, 60, 58, 61, 57, 60, 64, 68, 66, 63, 60, 56] },
    temple: { bpm: 70, wave: 'sine', seq: [62, 69, 74, 69, 65, 72, 77, 72, 64, 71, 76, 71, 67, 74, 79, 81] }
  };
  HM.bgm = function (name) {
    HM._bgm = name; clearInterval(bgmTimer); if (!name || !HM.sound) return;
    const b = BGMS[name]; let i = 0;
    bgmTimer = setInterval(() => { if (!HM.sound || document.hidden) return; const n = b.seq[i++ % b.seq.length]; tone(N(n), 0, 60 / b.bpm * 1.8, b.wave, .05); if (i % 4 === 1) tone(N(n - 24), 0, 60 / b.bpm * 3.6, 'sine', .05); }, 60000 / b.bpm / 2);
  };

  /* ---------- ヘッダー・フッター ---------- */
  const page = document.body.dataset.page || '';
  const navItems = [['index.html', 'TOP', 'top'], ['shop.html?s=kokiri', 'コキリ', 'kokiri'], ['shop.html?s=hyrule', 'ハイラル', 'hyrule'], ['shop.html?s=ghost', 'ゴースト', 'ghost'], ['game.html', '射的屋', 'game'], ['guide.html', 'ガイド', 'guide']];
  const hdr = document.getElementById('hdr');
  if (hdr) {
    hdr.className = 'hdr';
    hdr.innerHTML = `
      <a class="hdr__logo" href="index.html" aria-label="HYRULE MARKET トップへ"><img src="assets/img/logo.webp" alt="" width="70" height="38"><span>HYRULE MARKET<small>時のオカリナ 三つの店</small></span></a>
      <nav class="hdr__nav" id="gnav" aria-label="メインメニュー">${navItems.map(n => `<a href="${n[0]}" ${page === n[2] ? 'aria-current="page"' : ''}>${n[1]}</a>`).join('')}<a href="bag.html" ${page === 'bag' ? 'aria-current="page"' : ''}>ふくろ</a></nav>
      <div class="hdr__tools">
        <button class="icon-btn snd" type="button" aria-label="音のオン・オフ" aria-pressed="${HM.sound}"><svg class="on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e3c06a" stroke-width="2"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/></svg><svg class="off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e3c06a" stroke-width="2"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg></button>
        <a class="icon-btn" href="bag.html" aria-label="ふくろ（カート）を見る"><img src="assets/img/items/sack.webp" alt="" width="24" height="24"><span class="bag-count" data-bag-count></span></a>
      </div>
      <button class="icon-btn hdr__burger" type="button" aria-label="メニュー" aria-controls="gnav" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" stroke="#e3c06a" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>`;
    const burger = hdr.querySelector('.hdr__burger'), nav = hdr.querySelector('.hdr__nav');
    burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    const snd = hdr.querySelector('.snd');
    snd.addEventListener('click', () => { HM.sound = !HM.sound; store.set('sound', HM.sound); snd.setAttribute('aria-pressed', HM.sound); if (HM.sound) { ac(); HM.sfx.select(); } HM.bgm(HM._bgm); });
    const onScroll = () => hdr.classList.toggle('solid', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  const ftr = document.getElementById('ftr');
  if (ftr) {
    ftr.className = 'ftr';
    ftr.innerHTML = `<div class="wrap">
      <svg class="ftr__tri" viewBox="0 0 100 87" aria-hidden="true"><g fill="url(#fg)"><path d="M50 0 75 43.5H25z"/><path d="M25 43.5 50 87H0z"/><path d="M75 43.5 100 87H50z"/></g><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a6"/><stop offset="1" stop-color="#a77e2c"/></linearGradient></defs></svg>
      <p class="latin" style="color:var(--gold);margin:0">HYRULE MARKET</p>
      <nav aria-label="フッターメニュー">${navItems.map(n => `<a href="${n[0]}">${n[1]}</a>`).join('')}<a href="bag.html">ふくろ</a></nav>
      <small>このサイトは「ゼルダの伝説 時のオカリナ」を記念した、個人が楽しむための非公式ファンサイトです。<br>任天堂株式会社とは関係ありません。キャラクター・ロゴ等の権利は各権利者に帰属します。<br>商品は実在の商品を紹介していますが、注文・決済はデモです。価格は参考価格（税込・目安）です。</small>
    </div>`;
  }

  /* ---------- 妖精カーソル ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    const f = document.createElement('div'); f.className = 'fairy'; f.innerHTML = '<img src="assets/img/fairy.webp" alt="">'; document.body.appendChild(f);
    let mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my, last = 0;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    (function loop(t) {
      x += (mx + 18 - x) * .12; y += (my - 26 - y) * .12;
      const bob = Math.sin(t / 220) * 4;
      f.style.transform = `translate(${x - 29}px,${y - 29 + bob}px)`;
      if (t - last > 70 && (Math.abs(mx - x) > 4 || Math.abs(my - y) > 4)) {
        last = t; const s = document.createElement('i'); s.className = 'spark';
        s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px'); s.style.setProperty('--dy', (Math.random() * 30 + 6) + 'px');
        document.body.appendChild(s); setTimeout(() => s.remove(), 800);
      }
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- 時空の渦 ページ遷移 ---------- */
  const warp = document.createElement('div'); warp.className = 'warp'; warp.innerHTML = '<div class="warp__swirl"></div>'; document.body.appendChild(warp);
  if (!reduce && sessionStorage.getItem('hm-warp')) { sessionStorage.removeItem('hm-warp'); warp.classList.add('out'); setTimeout(() => warp.classList.remove('out'), 900); }
  HM.go = function (url) {
    if (reduce) { location.href = url; return; }
    HM.sfx.warp(); warp.classList.remove('out'); warp.classList.add('in');
    try { sessionStorage.setItem('hm-warp', '1'); } catch (e) {}
    setTimeout(() => { location.href = url; }, 650);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href'); if (!href || href.startsWith('#') || /^(https?:|mailto:)/.test(href)) return;
    e.preventDefault(); HM.go(href);
  });
  addEventListener('pageshow', e => { if (e.persisted) warp.className = 'warp'; });

  /* ---------- ボタン効果音・きらめき ---------- */
  document.addEventListener('pointerdown', () => ac(), { once: true });
  document.addEventListener('mouseover', e => { if (e.target.closest('.rbtn,.gcard,.hdr__nav a')) { const el = e.target.closest('.rbtn,.gcard,.hdr__nav a'); if (el !== HM._hov) { HM._hov = el; HM.sfx.select(); } } });
  document.querySelectorAll('.rbtn').forEach(b => { if (!b.querySelector('.shine')) b.insertAdjacentHTML('afterbegin', '<span class="shine"></span>'); });

  /* ---------- スクロール出現 ---------- */
  HM.reveal = function (root = document) {
    const els = root.querySelectorAll('.rv,.rv-rise');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
    els.forEach(e => io.observe(e));
  };

  /* ---------- 会話ウィンドウ（文字送り） ---------- */
  HM.typer = function (el, lines, opt = {}) {
    let li = 0, timer = null;
    const box = el.querySelector('.dialog__text') || el;
    function show() {
      clearInterval(timer); el.classList.remove('done'); const s = opt.map ? opt.map(lines[li]) : lines[li]; let i = 0; box.textContent = '';
      if (reduce) { box.textContent = s; el.classList.add('done'); return; }
      timer = setInterval(() => { box.textContent = s.slice(0, ++i); if (i % 2) HM.sfx.talk(); if (i >= s.length) { clearInterval(timer); el.classList.add('done'); opt.onLine && opt.onLine(li); } }, 38);
    }
    function next() {
      if (!el.classList.contains('done')) { clearInterval(timer); box.textContent = opt.map ? opt.map(lines[li]) : lines[li]; el.classList.add('done'); return; }
      if (li < lines.length - 1) { li++; show(); } else opt.onEnd && opt.onEnd();
    }
    el.addEventListener('click', next); el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
    show();
    return { say(newLines) { lines = Array.isArray(newLines) ? newLines : [newLines]; li = 0; show(); } };
  };

  /* ---------- アイテム入手演出 ---------- */
  const get = document.createElement('div'); get.className = 'get'; get.setAttribute('aria-live', 'polite');
  get.innerHTML = '<div class="get__rays"></div><div class="get__box"><img class="get__item" alt=""><div class="dialog"><span class="dialog__text"></span></div></div>';
  document.body.appendChild(get);
  HM.getItem = function (it, from) {
    HM.sfx.get();
    get.querySelector('img').src = it.art; get.querySelector('img').alt = it.name;
    get.querySelector('.dialog__text').innerHTML = `<em>${HM.esc(it.name)}</em> をふくろに入れた！`;
    get.classList.remove('show'); void get.offsetWidth; get.classList.add('show');
    // ふくろへ飛ぶ光
    const target = document.querySelector('.hdr [data-bag-count]');
    if (from && target && !reduce) {
      const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
      const img = document.createElement('img'); img.src = it.art; img.alt = '';
      Object.assign(img.style, { position: 'fixed', zIndex: 190, width: '60px', height: '60px', objectFit: 'contain', left: a.left + a.width / 2 - 30 + 'px', top: a.top + a.height / 2 - 30 + 'px', pointerEvents: 'none', filter: 'drop-shadow(0 0 12px #fff8)' });
      document.body.appendChild(img);
      img.animate([{ transform: 'translate(0,0) scale(1) rotate(0)' }, { transform: `translate(${(b.left - a.left - a.width / 2) / 2}px,${(b.top - a.top) / 2 - 120}px) scale(1.3) rotate(180deg)`, offset: .5 }, { transform: `translate(${b.left - a.left - a.width / 2 + 10}px,${b.top - a.top - a.height / 2 + 10}px) scale(.2) rotate(360deg)`, opacity: .4 }], { duration: 900, easing: 'cubic-bezier(.5,0,.5,1)' }).onfinish = () => { img.remove(); HM.sfx.rupee(); };
    }
  };
  HM.addToBag = function (id, qty, from) { const it = HM.item(id); HM.bag.add(id, qty || 1); HM.getItem(it, from); };

  /* ---------- 商品カード ---------- */
  HM.card = function (it, i = 0) {
    const shop = HM.SHOPS[it.shop];
    return `<article class="gcard rv" style="--accent:${shop.color};transition-delay:${(i % 4) * .08}s">
      <a href="item.html?id=${it.id}" style="position:absolute;inset:0;z-index:2" aria-label="${HM.esc(it.name)}の詳細"></a>
      <div class="gcard__stage">${it.tag ? `<span class="gcard__tag">${it.tag}</span>` : ''}<img src="${it.art}" alt="" loading="lazy" style="animation-delay:${-i * .7}s"></div>
      <div class="gcard__body">
        <h3 class="gcard__name">${HM.esc(it.name)}</h3>
        <p class="gcard__real">${HM.esc(it.maker)}「${HM.esc(it.real)}」</p>
        <div class="gcard__foot"><span class="plate"><img src="assets/img/items/rupee-green.webp" alt="ルピー" width="10" height="17" style="width:10px">${HM.yen(it.price)}</span>
        <button class="gcard__add" type="button" data-add="${it.id}" aria-label="${HM.esc(it.name)}をふくろに入れる"><span>+</span></button></div>
      </div></article>`;
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (!b) return; e.preventDefault(); HM.addToBag(b.dataset.add, 1, b); });

  bag.render();
  document.addEventListener('DOMContentLoaded', () => HM.reveal());
  if (document.readyState !== 'loading') HM.reveal();
})();

/* 背景ループ映像（動きを減らす設定・画面外では止める） */
window.HM.bgVideo = function (parent, src) {
  const HM = window.HM;
  if (!parent || HM.reduce || navigator.connection?.saveData) return null;
  const v = document.createElement('video');
  v.className = 'bgvid'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
  v.src = src;
  v.addEventListener('playing', () => v.classList.add('on'), { once: true });
  parent.prepend(v);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); })).observe(parent);
  } else v.play().catch(() => {});
  return v;
};

/* 表情を切りかえる（先読み＋小さく跳ねる） */
(function () {
  const HM = window.HM;
  const cache = {};
  HM.preloadFaces = who => HM.FACES[who].forEach(k => { const src = HM.faceSrc(who, k); if (!cache[src]) { cache[src] = new Image(); cache[src].src = src; } });
  HM.face = function (img, who, key) {
    if (!img) return; const src = HM.faceSrc(who, key);
    if (img.getAttribute('src') === src) return;
    img.setAttribute('src', src); img.dataset.face = key;
    if (!HM.reduce) img.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-10px) scale(1.03,0.98)', offset: .35 }, { transform: 'translateY(0) scale(1)' }], { duration: 380, easing: 'cubic-bezier(.3,1.6,.5,1)', composite: 'add' });
  };
})();
