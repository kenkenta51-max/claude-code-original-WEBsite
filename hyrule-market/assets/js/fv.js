/* HYRULE MARKET — FV：時の神殿 → マスターソードを抜く → 時空の渦（Three.js） */
(function () {
  const HM = window.HM, T = window.THREE;
  const sec = document.getElementById('fv'), canvas = document.getElementById('fv-canvas');
  if (!sec || !canvas) return;
  const ui = {
    a: document.querySelector('[data-stage="a"]'), b: document.querySelector('[data-stage="b"]'),
    c: document.querySelector('[data-stage="c"]'), flash: document.querySelector('.fv-flash'),
    meter: document.querySelector('.fv-meter i'), say: document.querySelector('.fv-say .dialog__text'), sayBox: document.querySelector('.fv-say'),
    hint: document.querySelector('.fv-hint')
  };
  if (!T) { sec.classList.add('no-webgl'); return; }

  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { sec.classList.add('no-webgl'); return; }
  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

  const cam = new T.PerspectiveCamera(48, 1, .05, 200);
  const clock = new T.Clock();
  const tex = (draw, w = 512, h = 512) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t; };
  const glowTex = tex((g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(190,220,255,.6)'); r.addColorStop(1, 'rgba(120,160,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); }, 128, 128);
  const triPath = (g, cx, cy, s) => { const h = s * Math.sqrt(3) / 2; const tri = (x, y) => { g.beginPath(); g.moveTo(x, y - h / 2); g.lineTo(x + s / 2, y + h / 2); g.lineTo(x - s / 2, y + h / 2); g.closePath(); g.fill(); }; tri(cx, cy - h / 2, s); tri(cx - s / 2, cy + h / 2, s); tri(cx + s / 2, cy + h / 2, s); };

  /* =================== 時の神殿 =================== */
  const temple = new T.Scene();
  const fogCol = new T.Color('#cbc5e2');
  temple.background = fogCol; temple.fog = new T.FogExp2(fogCol, .052);
  temple.add(new T.HemisphereLight('#ffffff', '#8b84b0', .95));
  const sun = new T.DirectionalLight('#fff4dc', 1.1); sun.position.set(-3, 12, -6); temple.add(sun);

  const floorTex = tex((g, w) => {
    g.fillStyle = '#e9e6f0'; g.fillRect(0, 0, w, w);
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(${150 + Math.random() * 60},${150 + Math.random() * 60},${180 + Math.random() * 50},${Math.random() * .08})`; g.fillRect(Math.random() * w, Math.random() * w, Math.random() * 40, 1 + Math.random() * 2); }
    g.strokeStyle = 'rgba(120,115,150,.35)'; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, w); g.stroke(); g.beginPath(); g.moveTo(0, i * w / 4); g.lineTo(w, i * w / 4); g.stroke(); }
  }, 512, 512);
  floorTex.wrapS = floorTex.wrapT = T.RepeatWrapping; floorTex.repeat.set(10, 10);
  const stone = new T.MeshStandardMaterial({ color: '#efedf5', roughness: .82, map: floorTex });
  const floor = new T.Mesh(new T.PlaneGeometry(80, 80), stone); floor.rotation.x = -Math.PI / 2; temple.add(floor);

  // 床の紋章（円とトライフォース）
  const emblemTex = tex((g, w) => {
    g.clearRect(0, 0, w, w); g.strokeStyle = 'rgba(120,105,160,.55)'; g.lineWidth = 10;
    g.beginPath(); g.arc(w / 2, w / 2, w * .46, 0, 7); g.stroke(); g.lineWidth = 4; g.beginPath(); g.arc(w / 2, w / 2, w * .4, 0, 7); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * w * .4, w / 2 + Math.sin(a) * w * .4); g.lineTo(w / 2 + Math.cos(a) * w * .46, w / 2 + Math.sin(a) * w * .46); g.stroke(); }
    g.fillStyle = 'rgba(150,130,190,.35)'; triPath(g, w / 2, w / 2 + 20, w * .3);
  }, 1024, 1024);
  const emblem = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshBasicMaterial({ map: emblemTex, transparent: true, depthWrite: false }));
  emblem.rotation.x = -Math.PI / 2; emblem.position.y = .012; temple.add(emblem);

  // 段（台座の土台）
  const stepMat = new T.MeshStandardMaterial({ color: '#f4f2fa', roughness: .7 });
  [[5.2, .22, 5.2, .11], [3.6, .22, 3.6, .33]].forEach(([w, h, d, y]) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), stepMat); m.position.y = y; temple.add(m); });
  // 台座（四角錐台）
  const ped = new T.Mesh(new T.CylinderGeometry(.62, 1.05, .78, 4, 1), new T.MeshStandardMaterial({ color: '#dcd8e8', roughness: .65, flatShading: true }));
  ped.rotation.y = Math.PI / 4; ped.position.y = .44 + .39; temple.add(ped);
  const pedTop = .44 + .78;
  // 台座正面のトライフォース
  const triTex = tex((g, w) => { g.clearRect(0, 0, w, w); g.fillStyle = '#8a7fb0'; triPath(g, w / 2, w / 2 + 10, w * .42); }, 256, 256);
  const triFace = new T.Mesh(new T.PlaneGeometry(.62, .62), new T.MeshBasicMaterial({ map: triTex, transparent: true, depthWrite: false }));
  triFace.position.set(0, .82, .84); triFace.rotation.x = -.5; temple.add(triFace);

  // 柱
  const colMat = new T.MeshStandardMaterial({ color: '#e4e1ee', roughness: .75 });
  const colGeo = new T.CylinderGeometry(.55, .6, 10, 20), baseGeo = new T.BoxGeometry(1.5, .6, 1.5);
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) {
    const z = 4 - i * 4.4, x = s * 6.2;
    const c = new T.Mesh(colGeo, colMat); c.position.set(x, 5, z); temple.add(c);
    const b = new T.Mesh(baseGeo, colMat); b.position.set(x, .3, z); temple.add(b);
    const t = new T.Mesh(baseGeo, colMat); t.position.set(x, 9.8, z); temple.add(t);
  }
  // 奥の壁と窓
  const wall = new T.Mesh(new T.PlaneGeometry(40, 24), new T.MeshStandardMaterial({ color: '#d9d4e8', roughness: 1 })); wall.position.set(0, 12, -18); temple.add(wall);
  const winMat = new T.MeshBasicMaterial({ color: '#fffaf0' });
  [-3.4, 0, 3.4].forEach((x, i) => { const w = new T.Mesh(new T.PlaneGeometry(1.4, i === 1 ? 6 : 4.6), winMat); w.position.set(x, i === 1 ? 13 : 12.4, -17.9); temple.add(w); });

  // 光の柱（加算合成のコーン）
  const shaftMat = new T.MeshBasicMaterial({ color: '#fff3d6', transparent: true, opacity: .06, blending: T.AdditiveBlending, depthWrite: false, side: T.FrontSide, fog: false });
  const shafts = [];
  [[-3.4, .7], [0, 1.1], [3.4, .7]].forEach(([x, r]) => {
    const g = new T.ConeGeometry(r * 1.5, 22, 24, 1, true); g.translate(0, -11, 0);
    const m = new T.Mesh(g, shaftMat.clone()); m.position.set(x, 13, -17.5);
    const d = new T.Vector3(x * .15, 0, 0).sub(m.position).normalize(); m.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), d); temple.add(m); shafts.push(m);
  });

  // 漂う光の粒
  const dustN = small ? 260 : 600, dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) { dustPos[i * 3] = (Math.random() - .5) * 14; dustPos[i * 3 + 1] = Math.random() * 9; dustPos[i * 3 + 2] = (Math.random() - .5) * 18; }
  const dustGeo = new T.BufferGeometry(); dustGeo.setAttribute('position', new T.BufferAttribute(dustPos, 3));
  const dust = new T.Points(dustGeo, new T.PointsMaterial({ size: .07, map: glowTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: '#ffffff' }));
  temple.add(dust);

  /* ---------- マスターソード ---------- */
  const sword = new T.Group();
  const bladeShape = new T.Shape(); bladeShape.moveTo(0, 0); bladeShape.lineTo(.092, .3); bladeShape.lineTo(.092, 2.2); bladeShape.lineTo(-.092, 2.2); bladeShape.lineTo(-.092, .3); bladeShape.closePath();
  const bladeGeo = new T.ExtrudeGeometry(bladeShape, { depth: .022, bevelEnabled: true, bevelThickness: .014, bevelSize: .014, bevelSegments: 2 }); bladeGeo.translate(0, 0, -.011);
  const bladeMat = new T.MeshStandardMaterial({ color: '#e6eeff', metalness: .85, roughness: .18, emissive: '#5f7dff', emissiveIntensity: .22 });
  sword.add(new T.Mesh(bladeGeo, bladeMat));
  const fuller = new T.Mesh(new T.PlaneGeometry(.035, 1.7), new T.MeshStandardMaterial({ color: '#8fa3d8', metalness: .9, roughness: .3 }));
  fuller.position.set(0, 1.28, .027); sword.add(fuller); const f2 = fuller.clone(); f2.position.z = -.027; f2.rotation.y = Math.PI; sword.add(f2);
  // 翼のつば
  const gs = new T.Shape();
  gs.moveTo(0, -.06); gs.quadraticCurveTo(.18, -.03, .3, .1); gs.quadraticCurveTo(.4, .21, .5, .36); gs.quadraticCurveTo(.36, .3, .25, .2); gs.quadraticCurveTo(.15, .13, .06, .17); gs.lineTo(-.06, .17);
  gs.quadraticCurveTo(-.15, .13, -.25, .2); gs.quadraticCurveTo(-.36, .3, -.5, .36); gs.quadraticCurveTo(-.4, .21, -.3, .1); gs.quadraticCurveTo(-.18, -.03, 0, -.06);
  const guardGeo = new T.ExtrudeGeometry(gs, { depth: .07, bevelEnabled: true, bevelThickness: .02, bevelSize: .015, bevelSegments: 3, curveSegments: 18 }); guardGeo.translate(0, 0, -.035);
  const hiltMat = new T.MeshStandardMaterial({ color: '#3a3fc4', metalness: .65, roughness: .3, emissive: '#1a1460', emissiveIntensity: .35 });
  const guard = new T.Mesh(guardGeo, hiltMat); guard.position.y = 2.23; sword.add(guard);
  const gem = new T.Mesh(new T.OctahedronGeometry(.045), new T.MeshStandardMaterial({ color: '#ffd84a', emissive: '#ffb000', emissiveIntensity: .8, metalness: .3, roughness: .2 }));
  gem.position.set(0, 2.27, .07); gem.scale.set(1, 1.3, .6); sword.add(gem);
  const grip = new T.Mesh(new T.CylinderGeometry(.042, .046, .5, 16), new T.MeshStandardMaterial({ color: '#5244b0', roughness: .6, metalness: .2 })); grip.position.y = 2.6; sword.add(grip);
  const wrapMat = new T.MeshStandardMaterial({ color: '#7b70e0', roughness: .5 });
  for (let i = 0; i < 6; i++) { const r = new T.Mesh(new T.TorusGeometry(.048, .012, 6, 16), wrapMat); r.position.y = 2.39 + i * .08; r.rotation.x = Math.PI / 2 + .35; sword.add(r); }
  const pommel = new T.Mesh(new T.SphereGeometry(.075, 16, 12), hiltMat); pommel.scale.set(1, .8, .8); pommel.position.y = 2.9; sword.add(pommel);
  const cap = new T.Mesh(new T.ConeGeometry(.04, .12, 12), hiltMat); cap.position.y = 3.0; sword.add(cap);
  const baseY = pedTop - .32;
  sword.position.set(0, baseY, 0); temple.add(sword);
  // 根元の青い光
  const swordLight = new T.PointLight('#5c7bff', 2.2, 5, 2); swordLight.position.set(0, pedTop + .2, .3); temple.add(swordLight);
  const glow = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: '#86a2ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false })); glow.scale.set(1.4, 1.4, 1); glow.position.set(0, pedTop + .05, 0); temple.add(glow);
  const bladeGlow = new T.Sprite(glow.material.clone()); bladeGlow.material.opacity = 0; bladeGlow.scale.set(1.2, 4, 1); temple.add(bladeGlow);

  /* =================== 時空の渦 =================== */
  const vortex = new T.Scene(); vortex.background = new T.Color('#02030c');
  const tunnelMat = new T.ShaderMaterial({
    side: T.BackSide, transparent: false,
    uniforms: { uTime: { value: 0 }, uSpeed: { value: 1 }, uFade: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uSpeed; uniform float uFade;
      void main(){
        float a = vUv.x*6.2831853; float z = vUv.y;
        float depth = z;
        float s1 = sin(a*4.0 + z*60.0 - uTime*4.0*uSpeed);
        float band = smoothstep(.55,1.0,s1);
        float gl = smoothstep(.93,1.0,sin(a*6.0 - z*80.0 + uTime*3.0));
        float streak = pow(max(0.0, sin(a*20.0 + z*140.0 - uTime*14.0*uSpeed)), 24.0);
        vec3 white = vec3(.9,.97,1.0);
        vec3 col = vec3(.02,.03,.12);
        col += vec3(.18,.38,1.0)*band*1.3;
        col += vec3(.55,.22,1.0)*smoothstep(.2,1.0,sin(a*2.0 + z*30.0 + uTime*1.5))*.4;
        col += vec3(1.0,.8,.35)*gl;
        col += white*streak*.35;
        col *= mix(.45,1.35,depth);
        col = mix(col, white, smoothstep(.9,1.0,z));
        gl_FragColor = vec4(col*(.75+uFade*.45), 1.0);
      }`
  });
  const tunnel = new T.Mesh(new T.CylinderGeometry(5, 5, 60, 96, 40, true), tunnelMat);
  tunnel.rotation.x = Math.PI / 2; tunnel.position.z = -30; vortex.add(tunnel);
  // 吸いこまれるアイテム
  const flyers = new T.Group(); vortex.add(flyers);
  const loader = new T.TextureLoader();
  const pics = ['goods/emerald-soda', 'goods/ruby', 'goods/sapphire', 'goods/poe-soul', 'goods/fairy-bottle', 'goods/mint-lime', 'goods/ocarina', 'items/rupee-green', 'items/rupee-blue', 'items/rupee-red', 'items/rupee-gold', 'items/deku-nut', 'items/heart-full', 'items/bomb', 'goods/giftcan', 'goods/choco', 'items/stick', 'goods/milk', 'goods/tea', 'items/heart-container', 'items/lens'];
  const flyN = small ? 40 : 70;
  for (let i = 0; i < flyN; i++) {
    let s; const t = loader.load('assets/img/' + pics[i % pics.length] + '.webp', undefined, undefined, () => { if (s) s.visible = false; }); t.encoding = T.sRGBEncoding;
    s = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
    const ang = Math.random() * Math.PI * 2, rad = 1.4 + Math.random() * 2.8;
    s.userData = { ang, rad, z: -Math.random() * 46 + 2, spin: (Math.random() - .5) * 3, sc: .6 + Math.random() * .8 };
    flyers.add(s);
  }
  // 金の時計リング
  const rings = [];
  for (let i = 0; i < 7; i++) {
    const r = new T.Mesh(new T.TorusGeometry(3.2 + Math.random() * .8, .03, 6, 80), new T.MeshBasicMaterial({ color: '#ffd77a', transparent: true, opacity: .55, blending: T.AdditiveBlending, depthWrite: false }));
    r.userData.z = -i * 8 - 4; vortex.add(r); rings.push(r);
    for (let k = 0; k < 12; k++) { const tick = new T.Mesh(new T.BoxGeometry(.05, .35, .05), r.material); const a = k / 12 * Math.PI * 2; tick.position.set(Math.cos(a) * 3.2, Math.sin(a) * 3.2, 0); tick.rotation.z = a + Math.PI / 2; r.add(tick); }
  }
  const core = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: '#ffffff', transparent: true, blending: T.AdditiveBlending, depthWrite: false })); core.position.z = -58; core.scale.set(22, 22, 1); vortex.add(core);
  const vcam = new T.PerspectiveCamera(70, 1, .05, 200);

  /* =================== 進行 =================== */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  let W = 0, H = 0;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; renderer.setSize(W, H, false);
    cam.aspect = vcam.aspect = W / H; cam.fov = W < H ? 62 : 46; cam.updateProjectionMatrix(); vcam.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();
  const mouse = { x: 0, y: 0 }; addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; });

  let progress = 0, fired = {}, visible = true;
  function readProgress() { const r = sec.getBoundingClientRect(); progress = clamp(-r.top / (r.height - innerHeight)); visible = r.bottom > 0; }
  addEventListener('scroll', readProgress, { passive: true }); readProgress();
  const lines = { pre: '台座に眠る、伝説の剣。…手をかけてみよう。', pull: '剣が…動いた！', got: 'マスターソードを抜いた！ ――時が、動きだす。' };
  let lastLine = '';
  function say(t) { if (t === lastLine) return; lastLine = t; ui.say.textContent = t; ui.sayBox.classList.add('done'); }
  const look = new T.Vector3();

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime(), p = progress;
    // UI の出し入れ
    const aOp = 1 - seg(p, .06, .16), bOp = seg(p, .16, .22) * (1 - seg(p, .44, .48)), cOp = seg(p, .52, .58) * (1 - seg(p, .86, .9));
    ui.a.style.opacity = aOp; ui.a.style.transform = `translateY(${-seg(p, .04, .16) * 60}px)`; ui.a.style.visibility = aOp < .01 ? 'hidden' : 'visible';
    ui.b.style.opacity = bOp; ui.b.style.visibility = bOp < .01 ? 'hidden' : 'visible';
    ui.c.style.opacity = cOp; ui.c.style.visibility = cOp < .01 ? 'hidden' : 'visible';
    ui.c.style.transform = `scale(${.8 + seg(p, .52, .9) * (small ? .25 : .5)})`; ui.c.style.letterSpacing = (.1 + seg(p, .52, .9) * (small ? .12 : .5)) + 'em';
    ui.meter.parentNode.style.opacity = bOp;
    ui.hint.style.opacity = 1 - seg(p, .01, .05);
    const pull = seg(p, .24, .42);
    ui.meter.style.transform = `scaleY(${pull})`;
    say(pull <= 0 ? lines.pre : pull < 1 ? lines.pull : lines.got);
    const flash = Math.max(seg(p, .44, .49) * (1 - seg(p, .49, .55)), seg(p, .9, .97));
    ui.flash.style.opacity = flash;
    sec.classList.toggle('done', p > .985);

    if (pull > .02 && !fired.sword) { fired.sword = 1; HM.sfx.sword(); }
    if (p > .46 && !fired.warp) { fired.warp = 1; HM.sfx.warp(); }
    if (p < .2) { fired.sword = 0; } if (p < .4) fired.warp = 0;

    if (p < .49) {
      // ---- 神殿 ----
      const ap = ease(seg(p, 0, .24));
      const shake = pull > 0 && pull < 1 ? (Math.random() - .5) * .03 * pull : 0;
      cam.position.set(lerp(0, 1.25, ap) + mouse.x * .5 + shake, lerp(3.4, pedTop + 1.2, ap) - mouse.y * .3 + Math.sin(t * .5) * .05 + pull * .5, lerp(14, 5.4, ap) + pull * .9);
      look.set(0, lerp(2.3, pedTop + .9, ap) + pull * 1.1, 0); cam.lookAt(look);
      const ep = ease(pull);
      sword.position.y = baseY + ep * 1.9; sword.rotation.y = Math.sin(t * .6) * .05 + ep * Math.PI * 2;
      swordLight.intensity = 2.2 + ep * 7 + Math.sin(t * 3) * .4; swordLight.position.y = sword.position.y + .5;
      glow.scale.setScalar(1.1 + ep * 1.4 + Math.sin(t * 2) * .1); glow.position.y = pedTop + .05 + ep * .4;
      bladeGlow.material.opacity = ep * .9; bladeGlow.position.set(0, sword.position.y + 1.2, 0); bladeGlow.scale.set(1.2 + ep, 4 + ep * 2, 1);
      shafts.forEach((s, i) => s.material.opacity = (.06 + Math.sin(t * .7 + i) * .015 + ep * .06) * (1 - ap * .6));
      renderer.toneMappingExposure = .95 + seg(p, .42, .49) * 1.4;
      const pos = dustGeo.attributes.position.array;
      for (let i = 0; i < dustN; i++) { pos[i * 3 + 1] += .004 + ep * .02; if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = 0; }
      dustGeo.attributes.position.needsUpdate = true;
      renderer.render(temple, cam);
    } else {
      // ---- 時空の渦 ----
      const vp = seg(p, .49, .95);
      renderer.toneMappingExposure = 1;
      tunnelMat.uniforms.uTime.value = t; tunnelMat.uniforms.uSpeed.value = .6 + vp * 2.2; tunnelMat.uniforms.uFade.value = vp;
      vcam.position.set(Math.sin(t * .8) * .2, Math.cos(t * .7) * .2, 0); vcam.rotation.z = t * .4 + vp * 4;
      const speed = .12 + vp * .7;
      flyers.children.forEach(s => {
        const u = s.userData; u.z += speed; u.ang += .01 + vp * .03; if (u.z > 2) { u.z = -46 - Math.random() * 6; }
        s.position.set(Math.cos(u.ang) * u.rad, Math.sin(u.ang) * u.rad, u.z); s.material.rotation += u.spin * .02; s.scale.setScalar(u.sc);
      });
      rings.forEach((r, i) => { r.userData.z += speed * .9; if (r.userData.z > 3) r.userData.z = -54; r.position.z = r.userData.z; r.rotation.z = t * (i % 2 ? .6 : -.5); });
      renderer.render(vortex, vcam);
    }
  }
  frame();

  /* 自動で進む（剣を抜く） */
  HM.fvAuto = function () {
    const start = scrollY, r = sec.getBoundingClientRect(), end = scrollY + r.top + r.height - innerHeight + 2, dur = 7000, t0 = performance.now();
    let stop = false; const cancel = () => { stop = true; }; addEventListener('wheel', cancel, { once: true }); addEventListener('touchstart', cancel, { once: true });
    (function step(now) { if (stop) return; const k = clamp((now - t0) / dur); window.scrollTo(0, start + (end - start) * (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)); if (k < 1) requestAnimationFrame(step); })(t0);
  };
})();
