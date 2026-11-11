/* HYRULE MARKET — ショップページ */
(function () {
  const HM = window.HM, id = document.body.dataset.page, shop = HM.SHOPS[id], items = HM.itemsOf(id);
  const $ = s => document.querySelector(s);
  document.title = `${shop.name}｜HYRULE MARKET`;
  $('#shop-en').textContent = shop.en;
  $('#shop-ttl').textContent = shop.name;
  $('#shop-lead').textContent = shop.lead;
  document.addEventListener('pointerdown', () => HM.bgm(id), { once: true });
  if (id !== 'hyrule') HM.bgVideo(document.querySelector('.stage__bg'), `assets/video/${id}.mp4`);

  /* ---- 店員 ---- */
  const clerk = $('#clerk');
  const main = { kokiri: 'link', hyrule: 'oyaji', ghost: 'poe' }[id];
  clerk.innerHTML = `<img class="clerk__img" src="${HM.faceSrc(main, 'normal')}" alt="店員 ${HM.esc(shop.clerk)}">` + (shop.subImg ? `<img class="clerk__sub" src="${HM.faceSrc('zelda', 'normal')}" alt="ゼルダ">` : '');
  const clerkImg = clerk.querySelector('.clerk__img'), subImg = clerk.querySelector('.clerk__sub');
  HM.preloadFaces(main); if (subImg) HM.preloadFaces('zelda');
  /* 場面ごとの表情 */
  const MOODS = {
    greet: { kokiri: 'smile', hyrule: 'laugh', ghost: 'laugh' },
    item: { kokiri: 'surprise', hyrule: 'point', ghost: 'lantern' },
    buy: { kokiri: 'thumbs', hyrule: 'thumbs', ghost: 'bow' },
    no: { kokiri: 'smile', hyrule: 'normal', ghost: 'laugh' },
    bye: { kokiri: 'bye', hyrule: 'thumbs', ghost: 'bow' }
  };
  let mood = 'greet', zTalk = 'smile', zIdle = 'normal';
  const M = k => HM.face(clerkImg, main, k), Z = k => subImg && HM.face(subImg, 'zelda', k);
  // ページを出るときは見送りの表情
  document.addEventListener('click', e => { const a = e.target.closest('a[href]'); if (a && !a.target && !a.getAttribute('href').startsWith('#')) { M(MOODS.bye[id]); Z('bye'); } }, true);
  const nod = () => { if (!clerkImg) return; clerkImg.classList.remove('talk'); void clerkImg.offsetWidth; clerkImg.classList.add('talk'); };

  /* ---- 棚 ---- */
  const rows = [[], [], [], []]; // L0, R0, L1, R1
  items.forEach((it, i) => rows[i % 4].push(it));
  const rowHtml = r => `<div class="shelf__row">${r.map(it => `<button class="sitem" type="button" data-id="${it.id}" aria-label="${HM.esc(it.name)}（${it.price}ルピー）を見る"><img src="${it.art}" alt="" style="animation-delay:${-Math.random() * 4}s"><span class="plate">×${HM.yen(it.price)}</span></button>`).join('')}</div>`;
  $('#shelf-l').innerHTML = rowHtml(rows[0]) + rowHtml(rows[2]);
  $('#shelf-r').innerHTML = rowHtml(rows[1]) + rowHtml(rows[3]);

  /* ---- 会話 ---- */
  const nameEl = $('#talk-name'), acts = $('#acts');
  const baseName = id === 'hyrule' ? '店主の親父' : shop.clerk;
  nameEl.textContent = baseName;
  const opt = {
    map(line) {
      const m = line.match(/^（(.+?)）(.*)$/);
      const who = m ? m[1] : null;
      if (who === 'ゼルダ') { Z(zTalk); M(mood === 'buy' ? MOODS.buy[id] : 'normal'); }
      else { M(MOODS[mood][id]); Z(zIdle); }
      if (m) { nameEl.textContent = m[1] === '親父' ? '店主の親父' : m[1]; return m[2]; }
      nameEl.textContent = baseName; return line;
    },
    onEnd() { showActs(null); setTimeout(() => { if (mood === 'greet') { M('normal'); Z('normal'); } }, 1500); }
  };
  const talk = HM.typer($('#talk'), shop.greet, opt);
  setTimeout(nod, 1600);
  function showActs(it) {
    acts.hidden = false;
    if (!it) { acts.innerHTML = `<p class="note" style="margin:0">棚の品をえらぶと、店員がおしえてくれます。</p>`; return; }
    acts.innerHTML = `<button class="rbtn rbtn--red" type="button" data-act="buy"><span class="gem"></span>ふくろに入れる（${HM.yen(it.price)}ルピー）</button>
      <a class="rbtn rbtn--blue rbtn--sm" href="item.html?id=${it.id}">くわしく見る</a>
      <button class="rbtn rbtn--ghost rbtn--sm" type="button" data-act="no">やめておく</button>`;
    acts.querySelectorAll('.rbtn').forEach(b => b.insertAdjacentHTML('afterbegin', '<span class="shine"></span>'));
    acts.querySelector('[data-act="buy"]').addEventListener('click', e => { mood = 'buy'; zIdle = 'happy'; zTalk = 'happy'; HM.addToBag(it.id, 1, e.currentTarget); opt.onEnd = () => {}; talk.say([id === 'ghost' ? 'ヒッヒッ…毎度あり…' : id === 'hyrule' ? '（親父）まいど！ ほかにも見ていきな！' : 'ありがとう！ ほかにも見ていってね！']); nod(); });
    acts.querySelector('[data-act="no"]').addEventListener('click', () => { mood = 'no'; zIdle = 'normal'; zTalk = 'smile'; select(null); opt.onEnd = () => showActs(null); talk.say([id === 'ghost' ? '…そうか。ゆっくり選ぶがいい…' : id === 'hyrule' ? '（親父）おう、ゆっくり見てってくれ！' : 'うん、ほかのも見てみて！']); });
  }
  let current = null;
  function select(it) {
    document.querySelectorAll('.sitem').forEach(b => b.classList.toggle('on', !!it && b.dataset.id === it.id));
    current = it;
  }
  document.querySelectorAll('.sitem').forEach(b => b.addEventListener('click', () => {
    const it = HM.item(b.dataset.id); mood = 'item'; zTalk = 'present'; zIdle = 'normal'; select(it); HM.sfx.select(); nod();
    acts.hidden = true;
    opt.onEnd = () => showActs(it);
    talk.say([`${it.name}――${HM.yen(it.price)}ルピー。中身は${it.maker}の「${it.real}」。`, it.clerk]);
    // 少し待ってから選択肢を出す（読み飛ばし可）
    setTimeout(() => { if (current === it) showActs(it); }, 1800);
  }));

  /* ---- 演出の粒 ---- */
  const fx = $('#fx');
  if (!HM.reduce) {
    const n = innerWidth < 760 ? 14 : 26;
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i'), r = Math.random;
      if (id === 'kokiri') {
        e.className = i % 2 ? 'fx fx--leaf' : 'fx fx--fly';
        if (i % 2) Object.assign(e.style, { left: r() * 100 + '%', animationDuration: 8 + r() * 10 + 's', animationDelay: -r() * 18 + 's', '--dx': (r() * 200 - 100) + 'px' });
        else Object.assign(e.style, { left: r() * 100 + '%', bottom: r() * 90 + '%', animationDuration: 2 + r() * 3 + 's' });
      } else if (id === 'hyrule') {
        e.className = 'fx fx--dust'; Object.assign(e.style, { left: r() * 100 + '%', bottom: r() * 100 + '%', animationDuration: 3 + r() * 5 + 's' });
      } else {
        e.className = 'fx fx--wisp'; Object.assign(e.style, { left: r() * 100 + '%', bottom: r() * 80 + '%', animationDuration: 4 + r() * 5 + 's' });
      }
      e.style.setProperty('--dx', (r() * 160 - 80) + 'px'); e.style.setProperty('--dy', (r() * -160) + 'px');
      fx.appendChild(e);
    }
    if (id === 'ghost') fx.insertAdjacentHTML('beforeend', '<div class="fog"></div>');
  }

  /* ---- 品ぞろえ ---- */
  const lineup = $('#lineup');
  function renderLineup(cat) {
    const list = items.filter(it => cat === 'all' || it.cat === cat);
    lineup.innerHTML = list.length ? list.map((it, i) => HM.card(it, i)).join('') : '<p class="note" style="grid-column:1/-1;text-align:center">この店には、まだ並んでいません。</p>';
    lineup.classList.remove('is-sorting'); void lineup.offsetWidth; lineup.classList.add('is-sorting');
    lineup.querySelectorAll('.rv').forEach(e => e.classList.add('in'));
  }
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderLineup(b.dataset.cat); HM.sfx.select();
  }));
  renderLineup('all');
  // 品のないカテゴリのタブはかくす
  document.querySelectorAll('.tabs button[data-cat]').forEach(b => { if (b.dataset.cat !== 'all' && !items.some(it => it.cat === b.dataset.cat)) b.hidden = true; });

  /* ---- ミニ体験 ---- */
  const mini = $('#mini .wrap');
  if (id === 'kokiri') {
    mini.innerHTML = `<div class="mini__box rv"><img id="lq" src="${HM.faceSrc('link', 'smile')}" alt="リンク">
      <div><span class="latin" style="color:var(--accent);font-size:.75rem">FAIRY FORTUNE</span><h2>妖精のおすすめ占い</h2>
      <p>「妖精をつかまえると、きょうのおすすめを教えてくれるんだって！」<br>飛んでいる妖精をひとつ、タップしてみよう。</p>
      <div class="bottles" id="fairies">${[0, 1, 2].map(i => `<button type="button" aria-label="${i + 1}ぴきめの妖精" style="animation:float ${3 + i * .6}s ease-in-out infinite"><img src="assets/img/fairy.webp" alt="" style="mix-blend-mode:screen"></button>`).join('')}</div>
      <div id="fortune" style="margin-top:16px"></div></div></div>`;
    document.querySelectorAll('#fairies button').forEach(b => b.addEventListener('click', () => {
      b.classList.add('shake'); HM.sfx.get(); HM.face($('#lq'), 'link', 'surprise');
      setTimeout(() => {
        b.classList.remove('shake');
        const it = items[Math.floor(Math.random() * items.length)];
        HM.face($('#lq'), 'link', 'thumbs');
        $('#fortune').innerHTML = `<div class="quiz__result"><img src="${it.art}" alt=""><div><b class="serif" style="font-size:1.15rem">${HM.esc(it.name)}</b> がおすすめ！<br><small class="note">${HM.esc(it.maker)}「${HM.esc(it.real)}」／${HM.yen(it.price)}ルピー</small><div class="quiz__opts" style="margin-top:8px"><button type="button" data-add="${it.id}">ふくろに入れる</button><a class="rbtn rbtn--sm" href="item.html?id=${it.id}"><span class="shine"></span>くわしく見る</a></div></div></div>`;
      }, 900);
    }));
  } else if (id === 'hyrule') {
    mini.innerHTML = `<div class="mini__box rv"><img id="oq" src="${HM.faceSrc('oyaji', 'point')}" alt="店主の親父">
      <div><span class="latin" style="color:var(--accent);font-size:.75rem">SHOOTING GALLERY</span><h2>となりの射的屋で腕だめし</h2>
      <p>「となりの射的屋もおれの店だ！ タネは10発。300点をこえたら、ふくろの品をまけてやるぜ！」</p>
      <a class="rbtn rbtn--gold" href="game.html"><span class="gem"></span>射的屋へ行く</a></div></div>`;
  } else {
    mini.innerHTML = `<div class="mini__box rv"><img id="pq" src="${HM.faceSrc('poe', 'laugh')}" alt="ゴースト商人">
      <div><span class="latin" style="color:var(--accent);font-size:.75rem">SOUL LOTTERY</span><h2>魂のビンくじ</h2>
      <p>「どのビンに…何が入っているか…ヒッヒッ…」<br>ビンをひとつ選ぶと、今夜のおすすめが姿をあらわす。</p>
      <div class="bottles" id="bottles">${['goods/poe-soul', 'items/bottle-blue', 'goods/fairy-bottle'].map((p, i) => `<button type="button" aria-label="${i + 1}本目のビン"><img src="assets/img/${p}.webp" alt=""></button>`).join('')}</div>
      <div id="lot" style="margin-top:16px"></div></div></div>`;
    document.querySelectorAll('#bottles button').forEach(b => b.addEventListener('click', () => {
      b.classList.add('shake'); HM.sfx.warp(); HM.face($('#pq'), 'poe', 'lantern');
      setTimeout(() => {
        b.classList.remove('shake'); HM.face($('#pq'), 'poe', 'laugh');
        const it = items[Math.floor(Math.random() * items.length)];
        HM.sfx.get();
        $('#lot').innerHTML = `<div class="quiz__result" style="justify-content:center"><img src="${it.art}" alt=""><div style="text-align:left"><b class="serif" style="font-size:1.15rem">${HM.esc(it.name)}</b> が出た！<br><small class="note">${HM.esc(it.maker)}「${HM.esc(it.real)}」／${HM.yen(it.price)}ルピー</small><div class="quiz__opts" style="margin-top:8px"><button type="button" data-add="${it.id}">ふくろに入れる</button><a class="rbtn rbtn--sm rbtn--purple" href="item.html?id=${it.id}"><span class="shine"></span>くわしく見る</a></div></div></div>`;
      }, 1000);
    }));
  }

  /* ---- ほかの店 ---- */
  $('#others').innerHTML = Object.values(HM.SHOPS).filter(x => x.id !== id).map(x => `<a class="ocard rv" href="shop.html?s=${x.id}" style="--c:${x.color}">
    <img src="${x.clerkImg}" alt=""><span><small class="latin">${x.en}</small><b>${x.name}</b><small>${x.tagline}</small></span></a>`).join('');

  HM.reveal();
})();
