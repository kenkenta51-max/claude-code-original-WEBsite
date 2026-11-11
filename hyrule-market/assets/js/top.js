/* HYRULE MARKET — TOP（タイトル、十字路ハブ、おすすめ） */
(function () {
  const HM = window.HM;
  // タイトルを1文字ずつ
  document.querySelectorAll('[data-split]').forEach(h => {
    const s = h.textContent; h.setAttribute('aria-label', s);
    h.innerHTML = [...s].map((c, i) => `<span aria-hidden="true" style="animation-delay:${.6 + i * .07}s">${c}</span>`).join('');
  });
  document.getElementById('fv-auto')?.addEventListener('click', () => { HM.sfx.select(); HM.fvAuto ? HM.fvAuto() : location.hash = 'hub'; });
  document.querySelectorAll('[data-skip]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById('hub').scrollIntoView({ behavior: HM.reduce ? 'auto' : 'smooth' }); }));
  document.addEventListener('pointerdown', () => HM.bgm('temple'), { once: true });

  // 十字路の背景映像
  const hub = document.getElementById('hub');
  if (hub) { hub.insertAdjacentHTML('afterbegin', '<div class="hub__shade" aria-hidden="true"></div>'); HM.bgVideo(hub, 'assets/video/crossroads.mp4'); }

  // ゴースト商人
  // 扉にふれると店員の表情が変わる
  ['link', 'oyaji', 'zelda', 'poe'].forEach(w => HM.preloadFaces(w));
  document.querySelectorAll('.door').forEach(d => {
    const faces = d.querySelectorAll('[data-who]');
    d.addEventListener('pointerenter', () => faces.forEach(f => HM.face(f, f.dataset.who, f.dataset.hover)));
    d.addEventListener('pointerleave', () => faces.forEach(f => HM.face(f, f.dataset.who, 'normal')));
    d.addEventListener('focus', () => faces.forEach(f => HM.face(f, f.dataset.who, f.dataset.hover)));
    d.addEventListener('blur', () => faces.forEach(f => HM.face(f, f.dataset.who, 'normal')));
  });

  // 十字路：扉がせり上がる
  const doors = document.querySelectorAll('.door');
  const cross = document.getElementById('cross');
  const play = () => { cross.classList.add('on'); setTimeout(() => doors.forEach(d => d.classList.add('ready')), 2200); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: .2 });
    io.observe(document.getElementById('cross'));
  } else play();

  // 扉の光とかたむき
  document.querySelectorAll('.door').forEach(d => {
    d.addEventListener('pointermove', e => {
      const r = d.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      d.style.setProperty('--mx', x * 100 + '%'); d.style.setProperty('--my', y * 100 + '%');
      if (!HM.reduce) d.style.transform = `translateY(-10px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 8}deg)`;
    });
    d.addEventListener('pointerleave', () => d.style.transform = '');
    d.addEventListener('pointerenter', () => HM.sfx.rupee());
  });

  // おすすめ
  const picks = ['k-fairy', 'h-milk', 'g-soul', 'k-sword', 'h-ocarina', 'g-lantern', 'h-royal', 'g-skull'];
  const pick = document.getElementById('pick');
  if (pick) { pick.innerHTML = picks.map((id, i) => HM.card(HM.item(id), i)).join(''); HM.reveal(pick); }
})();
