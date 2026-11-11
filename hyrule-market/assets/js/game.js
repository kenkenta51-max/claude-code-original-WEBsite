/* HYRULE MARKET — 城下町の射的屋（Canvas） */
(function () {
  const HM = window.HM, $ = s => document.querySelector(s);
  const frame = $('#gframe'), cv = $('#gc'), ctx = cv.getContext('2d');
  const img = n => { const i = new Image(); i.src = 'assets/img/items/' + n + '.webp'; return i; };
  const IM = { green: img('rupee-green'), blue: img('rupee-blue'), red: img('rupee-red'), skull: img('skulltula'), sling: img('slingshot') };
  let W = 1280, H = 720, S = 1, bg = null;
  const L = { r1: 0, r2: 0, mx: 0, Mx: 0, counter: 0 };
  const photo = new Image(); photo.src = 'assets/img/bg/gallery.webp'; photo.onload = () => resize();

  /* ---------- 背景（射的屋の店内）を描いておく ---------- */
  function paintBg() {
    bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
    const g = bg.getContext('2d'); g.scale(S, S);
    if (photo.complete && photo.naturalWidth) {
      // 生成背景（射的屋）をカバー表示し、壁画・レール・カウンターの位置を合わせる
      const iw = photo.naturalWidth, ih = photo.naturalHeight, k = Math.max(W / iw, H / ih), ox = (W - iw * k) / 2, oy = (H - ih * k) / 2;
      const P = (u, v) => [ox + u * iw * k, oy + v * ih * k];
      g.drawImage(photo, ox, oy, iw * k, ih * k);
      L.r1 = P(0, .456)[1]; L.r2 = P(0, .664)[1]; L.counter = P(0, .9)[1];
      L.mx = Math.max(20, P(.225, 0)[0]); L.Mx = Math.min(W - 20, P(.775, 0)[0]);
      const v = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
      return;
    }
    L.r1 = H * .33 + 5; L.r2 = H * .53 + 5; L.counter = H * .8; L.mx = W * .14; L.Mx = W * .86;
    const mx = W * .14, mw = W - mx * 2, my = H * .15, mh = H * .58;
    // 壁（レンガ）
    g.fillStyle = '#8f3f22'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(40,12,4,.55)'; g.lineWidth = 2;
    for (let y = 0; y < H; y += 22) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = (y / 22 % 2) * 24; x < W; x += 48) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 22); g.stroke(); } }
    // 壁画（砂漠の峡谷と夕日）
    const sky = g.createLinearGradient(0, my, 0, my + mh); sky.addColorStop(0, '#f7c27a'); sky.addColorStop(.55, '#ec8a45'); sky.addColorStop(1, '#c9592c');
    g.fillStyle = sky; g.fillRect(mx, my, mw, mh);
    g.fillStyle = '#ffe2a0'; g.beginPath(); g.arc(mx + mw * .72, my + mh * .38, mh * .12, 0, 7); g.fill();
    g.fillStyle = '#a8462a'; g.beginPath(); g.moveTo(mx, my + mh * .72);
    [[.06, .5], [.12, .5], [.15, .62], [.3, .62], [.33, .44], [.46, .44], [.49, .64], [.62, .64], [.66, .52], [.78, .52], [.8, .66], [1, .66]].forEach(([x, y]) => g.lineTo(mx + mw * x, my + mh * y));
    g.lineTo(mx + mw, my + mh); g.lineTo(mx, my + mh); g.fill();
    g.fillStyle = '#d99a52'; g.fillRect(mx, my + mh * .8, mw, mh * .2);
    g.fillStyle = 'rgba(60,90,30,.8)';
    [.1, .38, .58, .9].forEach(x => { const cx = mx + mw * x, cy = my + mh * .86; g.fillRect(cx - 4, cy - 30, 8, 34); g.fillRect(cx - 16, cy - 20, 6, 14); g.fillRect(cx - 16, cy - 10, 14, 5); g.fillRect(cx + 10, cy - 26, 6, 14); g.fillRect(cx + 2, cy - 16, 14, 5); });
    // 板の継ぎ目
    g.strokeStyle = 'rgba(90,40,15,.25)'; g.lineWidth = 2; for (let x = mx; x < mx + mw; x += 36) { g.beginPath(); g.moveTo(x, my); g.lineTo(x, my + mh); g.stroke(); }
    // 額縁と彫刻のアーチ
    g.strokeStyle = '#4a2a10'; g.lineWidth = 14; g.strokeRect(mx, my, mw, mh);
    g.fillStyle = '#5a3416'; g.beginPath(); g.moveTo(mx - 10, my); g.quadraticCurveTo(W / 2, my - H * .12, mx + mw + 10, my); g.lineTo(mx + mw + 10, my - 18); g.quadraticCurveTo(W / 2, my - H * .16, mx - 10, my - 18); g.fill();
    // 横の壁のサボテン
    g.fillStyle = '#2f4f20';
    [[mx * .5, H * .3], [W - mx * .5, H * .3]].forEach(([cx, cy]) => { g.beginPath(); g.roundRect(cx - 14, cy, 28, H * .36, 14); g.fill(); g.beginPath(); g.roundRect(cx - 40, cy + 50, 16, 70, 8); g.fill(); g.fillRect(cx - 40, cy + 104, 30, 14); g.beginPath(); g.roundRect(cx + 24, cy + 30, 16, 60, 8); g.fill(); g.fillRect(cx + 10, cy + 76, 30, 14); });
    // 天井の梁と灯り
    g.fillStyle = '#3a200c'; g.fillRect(0, 0, W, H * .07);
    for (let i = 0; i < 6; i++) { g.fillStyle = '#4a2a10'; g.fillRect(i * W / 5 - 20, 0, 40, H * .1); }
    [W * .12, W * .88].forEach(x => { const r = g.createRadialGradient(x, H * .12, 0, x, H * .12, 80); r.addColorStop(0, 'rgba(255,220,140,.9)'); r.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = r; g.fillRect(x - 80, H * .12 - 80, 160, 160); g.fillStyle = '#ffe6a8'; g.fillRect(x - 8, H * .1, 16, 20); });
    // レール
    g.fillStyle = '#5d5145'; [.33, .53].forEach(y => g.fillRect(mx, H * y + 2, mw, 6));
    // カウンター
    const cy = H * .8; const wood = g.createLinearGradient(0, cy, 0, H); wood.addColorStop(0, '#9a6232'); wood.addColorStop(1, '#4a2a10');
    g.fillStyle = wood; g.fillRect(0, cy, W, H - cy); g.fillStyle = '#c08a4a'; g.fillRect(0, cy, W, 8);
    g.strokeStyle = 'rgba(0,0,0,.2)'; for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, cy + 8); g.lineTo(x, H); g.stroke(); }
    // 周辺減光
    const v = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  function resize() {
    const r = frame.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = 1280; H = Math.round(W * r.height / r.width);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); S = cv.width / W;
    paintBg();
  }
  addEventListener('resize', resize); resize();

  /* ---------- ゲームの状態 ---------- */
  let st = null, aim = { x: W / 2, y: H * .45 }, pull = 0;
  const RAIL = () => [L.r1, L.r2];
  function newGame() {
    st = { seeds: 10, score: 0, hits: 0, shots: [], fx: [], targets: [], t: 0, over: false, skullDone: false, nextPop: 1.2 };
    const [ra, rb] = RAIL(), R = Math.min(W, H) * .058, r1 = ra + R + 22, r2 = rb + R * .85 + 22;
    st.targets.push({ k: 'bull', x: W * .3, y: r1, r: R, v: 210, alive: true });
    st.targets.push({ k: 'bull', x: W * .7, y: r2, r: R * .85, v: -280, alive: true });
    st.targets.push({ k: 'bull', x: W * .5, y: ra + R * .7 + 22, r: R * .7, v: 320, alive: true, phase: 1 });
    updHud();
  }
  const updHud = () => { $('#seeds').textContent = st.seeds; $('#score').textContent = st.score; };

  function popRupee() {
    const k = Math.random() < .2 ? 'red' : Math.random() < .5 ? 'blue' : 'green';
    st.targets.push({ k: 'rupee', c: k, x: W * (.2 + Math.random() * .6), y: L.counter, vy: -(H * (k === 'red' ? 1.25 : 1.05)), g: H * (k === 'red' ? 1.6 : 1.3), r: H * .045, alive: true, pts: { green: 30, blue: 50, red: 100 }[k], spin: Math.random() * 6 });
  }
  function dropSkull() { st.targets.push({ k: 'skull', x: W * (.3 + Math.random() * .4), y: -60, ty: H * (.3 + Math.random() * .15), r: H * .06, alive: true, a: 0, life: 4.5 }); }

  function shoot() {
    if (!st || st.over || st.seeds <= 0) return;
    st.seeds--; updHud(); HM.sfx.shoot();
    st.shots.push({ x0: W / 2, y0: H * .95, x: aim.x, y: aim.y, t: 0, d: .18 });
    pull = 1;
  }
  function hitTest(s) {
    let best = null;
    for (const t of st.targets) {
      if (!t.alive) continue;
      const d = Math.hypot(s.x - t.x, s.y - t.y);
      if (d < t.r * 1.05 && (!best || d / t.r < best.d)) best = { t, d: d / t.r };
    }
    if (!best) { st.fx.push({ k: 'puff', x: s.x, y: s.y, t: 0 }); HM.sfx.miss(); return; }
    const t = best.t; let pts, label;
    if (t.k === 'bull') { pts = best.d < .25 ? 100 : best.d < .6 ? 50 : 20; label = pts === 100 ? 'PERFECT!' : pts === 50 ? 'GOOD' : 'HIT'; t.alive = false; t.dead = 0; }
    else if (t.k === 'rupee') { pts = t.pts; label = '+' + pts; t.alive = false; t.dead = 0; }
    else { pts = 150; label = 'SKULLTULA!'; t.alive = false; t.dead = 0; }
    st.score += pts; st.hits++; updHud(); HM.sfx.hit(); if (pts >= 100) HM.sfx.rupee();
    st.fx.push({ k: 'pop', x: t.x, y: t.y, t: 0, label: label + (t.k === 'bull' ? ' +' + pts : '') });
    $('#g-live').textContent = `${label} ${pts}点`;
  }

  /* ---------- ループ ---------- */
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (st && !st.over) update(dt);
    draw();
  }
  function update(dt) {
    st.t += dt; pull = Math.max(0, pull - dt * 4);
    const mx = L.mx + 50, Mx = L.Mx - 50;
    st.targets.forEach(t => {
      if (t.k === 'bull') {
        if (t.alive) { t.x += t.v * dt * (1 + st.t * .02); if (t.x < mx || t.x > Mx) { t.v *= -1; t.x = Math.max(mx, Math.min(Mx, t.x)); } }
        else { t.dead += dt; if (t.dead > 1.4) { t.alive = true; t.x = t.v > 0 ? mx : Mx; } }
      } else if (t.k === 'rupee') {
        if (t.alive) { t.vy += t.g * dt; t.y += t.vy * dt; t.spin += dt * 4; if (t.y > L.counter + 10 && t.vy > 0) t.gone = true; }
        else { t.dead += dt; if (t.dead > .5) t.gone = true; }
      } else {
        t.a += dt; t.life -= dt;
        if (t.alive) { t.y += (t.ty - t.y) * dt * 3; if (t.life < 0) t.ty = -120, t.y < -80 && (t.gone = true); }
        else { t.dead += dt; t.y += dt * 400; if (t.dead > 1) t.gone = true; }
      }
    });
    st.targets = st.targets.filter(t => !t.gone);
    st.nextPop -= dt; if (st.nextPop <= 0) { popRupee(); st.nextPop = 1.4 + Math.random() * 1.6; }
    if (!st.skullDone && st.seeds <= 6) { st.skullDone = true; dropSkull(); }
    st.shots.forEach(s => { s.t += dt; if (s.t >= s.d && !s.done) { s.done = true; hitTest(s); } });
    st.shots = st.shots.filter(s => s.t < s.d + .05);
    st.fx.forEach(f => f.t += dt); st.fx = st.fx.filter(f => f.t < 1);
    if (st.seeds === 0 && !st.shots.length && !st.endT) st.endT = st.t;
    if (st.endT && st.t - st.endT > .9) finish();
  }
  function drawBull(t) {
    const r = t.r, k = t.alive ? 1 : Math.max(0, 1 - t.dead * 2.5);
    ctx.save(); ctx.translate(t.x, t.y); ctx.scale(Math.cos(t.alive ? 0 : t.dead * 12) * k || .01, k);
    ctx.fillStyle = '#3a2410'; ctx.fillRect(-4, -r - 24, 8, 24);
    [[1, '#7a3a12'], [.92, '#e8b030'], [.74, '#fff6e0'], [.56, '#2f6bff'], [.4, '#fff6e0'], [.24, '#e23b3b']].forEach(([f, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, r * f, 0, 7); ctx.fill(); });
    ctx.restore();
  }
  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (bg) ctx.drawImage(bg, 0, 0);
    ctx.setTransform(S, 0, 0, S, 0, 0);
    if (st) {
      st.targets.forEach(t => {
        if (t.k === 'bull') drawBull(t);
        else if (t.k === 'rupee') { const im = IM[t.c], h = t.r * 2.2, w = h * (im.naturalWidth / im.naturalHeight || .55); ctx.save(); ctx.translate(t.x, t.y); ctx.scale(Math.cos(t.spin), 1); ctx.globalAlpha = t.alive ? 1 : 1 - t.dead * 2; if (im.complete) ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); }
        else { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(t.x, 0); ctx.lineTo(t.x, t.y - t.r); ctx.stroke(); ctx.save(); ctx.translate(t.x + Math.sin(t.a * 2) * 6, t.y); ctx.rotate(Math.sin(t.a * 3) * .15 + (t.alive ? 0 : t.dead * 10)); const s = t.r * 2.2; if (IM.skull.complete) ctx.drawImage(IM.skull, -s / 2, -s / 2, s, s); ctx.restore(); }
      });
      // 飛んでいくタネ
      st.shots.forEach(s => { const k = Math.min(1, s.t / s.d), x = s.x0 + (s.x - s.x0) * k, y = s.y0 + (s.y - s.y0) * k - Math.sin(k * Math.PI) * 40; ctx.fillStyle = '#6b3d14'; ctx.beginPath(); ctx.arc(x, y, 12 * (1 - k * .7), 0, 7); ctx.fill(); ctx.fillStyle = '#c98a3a'; ctx.beginPath(); ctx.arc(x - 3, y - 3, 4 * (1 - k * .7), 0, 7); ctx.fill(); });
      // 演出
      st.fx.forEach(f => {
        if (f.k === 'puff') { ctx.fillStyle = `rgba(230,200,150,${.7 - f.t})`; for (let i = 0; i < 6; i++) { const a = i / 6 * 7; ctx.beginPath(); ctx.arc(f.x + Math.cos(a) * f.t * 50, f.y + Math.sin(a) * f.t * 50, 8 * (1 - f.t), 0, 7); ctx.fill(); } }
        else {
          ctx.strokeStyle = `rgba(255,240,170,${1 - f.t})`; ctx.lineWidth = 4; for (let i = 0; i < 10; i++) { const a = i / 10 * 7, r1 = f.t * 60, r2 = f.t * 110; ctx.beginPath(); ctx.moveTo(f.x + Math.cos(a) * r1, f.y + Math.sin(a) * r1); ctx.lineTo(f.x + Math.cos(a) * r2, f.y + Math.sin(a) * r2); ctx.stroke(); }
          ctx.font = '700 34px Cinzel, serif'; ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = `rgba(40,10,0,${1 - f.t})`; ctx.fillStyle = `rgba(255,230,120,${1 - f.t})`;
          ctx.strokeText(f.label, f.x, f.y - 40 - f.t * 40); ctx.fillText(f.label, f.x, f.y - 40 - f.t * 40);
        }
      });
    }
    // パチンコ
    const sx = W / 2, sy = H * .97, ang = Math.atan2(aim.y - sy, aim.x - sx) + Math.PI / 2;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang * .6);
    const sh = H * .3; if (IM.sling.complete) ctx.drawImage(IM.sling, -sh * .45, -sh * .8 + pull * 20, sh * .9, sh * .9);
    ctx.restore();
    // 照準
    ctx.save(); ctx.translate(aim.x, aim.y); ctx.strokeStyle = '#ff3b3b'; ctx.lineWidth = 3; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.stroke(); [[0, -34, 0, -12], [0, 12, 0, 34], [-34, 0, -12, 0], [12, 0, 34, 0]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); });
    ctx.fillStyle = '#ff3b3b'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, 7); ctx.fill(); ctx.restore();
  }
  requestAnimationFrame(loop);

  /* ---------- 操作 ---------- */
  const toLocal = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
  cv.addEventListener('pointermove', e => { aim = toLocal(e); });
  cv.addEventListener('pointerdown', e => { aim = toLocal(e); shoot(); });
  addEventListener('keydown', e => {
    if (!st || st.over || $('#g-start').hidden === false) return;
    const k = { ArrowLeft: [-30, 0], ArrowRight: [30, 0], ArrowUp: [0, -30], ArrowDown: [0, 30] }[e.key];
    if (k) { e.preventDefault(); aim.x = Math.max(0, Math.min(W, aim.x + k[0])); aim.y = Math.max(0, Math.min(L.counter, aim.y + k[1])); }
    if (e.key === ' ') { e.preventDefault(); shoot(); }
  });

  function start() { $('#g-start').hidden = true; $('#g-end').hidden = true; newGame(); HM.sfx.select(); HM.bgm('hyrule'); cv.focus?.(); }
  $('#g-go').addEventListener('click', start);
  $('#g-again').addEventListener('click', start);

  function finish() {
    st.over = true;
    const sc = st.score, best = Math.max(sc, HM.store.get('best', 0)); HM.store.set('best', best);
    const tier = sc >= 900 ? 15 : sc >= 600 ? 10 : sc >= 300 ? 5 : 0;
    let say;
    if (tier) {
      const cur = HM.coupon.get();
      if (!cur || cur.rate < tier) HM.coupon.set({ code: 'SEED' + String(tier).padStart(2, '0'), rate: tier });
      say = { 15: 'おみごと！ あんたは名人だ！ ふくろの品を15%まけてやるよ！', 10: 'やるじゃないか！ ふくろの品を10%まけてやろう！', 5: 'なかなかの腕だ！ おまけに5%まけておくぜ。' }[tier];
      HM.sfx.get();
    } else { say = 'おしい！ 300点をこえたら、おまけをやるぜ。もう一回どうだい？'; HM.sfx.miss(); }
    $('#r-score').textContent = sc;
    $('#r-best').textContent = `命中 ${st.hits}/10 ・ ベスト ${best}点` + (HM.coupon.get() ? ` ・ ふくろの割引 ${HM.coupon.get().rate}%` : '');
    $('#r-say').textContent = say;
    HM.face($('#r-face'), 'oyaji', tier >= 10 ? 'surprise' : tier ? 'thumbs' : 'laugh');
    $('#g-end').hidden = false;
  }
})();
