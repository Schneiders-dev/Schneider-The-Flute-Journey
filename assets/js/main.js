/*!
 * The Flute Journey — motor de experiência
 *  - [data-reveal]  elementos que aparecem sozinhos (animação por tempo) ao entrar na tela
 *  - [data-scene][data-steps]  cenas fixas em passos: um toque no scroll/swipe avança um passo inteiro,
 *                   com a transição tocando automaticamente (sem precisar "arrastar" a animação)
 *  - [data-kf]      keyframes declarativos das cenas (opacidade, posição, escala, blur)
 *  - [data-road]    o caminho da jornada, desenhado automaticamente até a etapa atual
 *  - menu flutuante, abas, filtros, checklist, cronômetro, contato
 * Respeita prefers-reduced-motion e funciona sem JavaScript (conteúdo sempre presente no HTML).
 */
(() => {
  'use strict';
  const doc = document.documentElement;
  const body = document.body;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) body.classList.add('static');
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } },
  };
  let appData = {};
  try { appData = JSON.parse(document.getElementById('app-data')?.textContent || '{}'); } catch (e) { /* noop */ }
  window.TFJ = window.TFJ || {};
  function absTop(el) { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }

  /* ───────────── Revelações por tempo ───────────── */
  const reveals = $$('[data-reveal]');
  if (!RM && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
    // elementos já acima da tela (ex.: ao abrir por um link interno) aparecem imediatamente
    TFJ.revealAll = () => reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
  // .v-assembly anima quando revelado
  $$('.v-assembly').forEach((el) => {
    if (RM || !('IntersectionObserver' in window)) return el.classList.add('is-in');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('is-in'), 300); io.disconnect(); } }), { threshold: 0.4 });
    io.observe(el);
  });

  /* ───────────── Keyframes ───────────── */
  const DEF = { o: 1, x: 0, y: 0, s: 1, r: 0, b: 0 };
  function parseKf(str) {
    const tracks = {};
    str.split(';').map((s) => s.trim()).filter(Boolean).forEach((seg) => {
      const parts = seg.split(/\s+/); const pos = parseFloat(parts[0]);
      parts.slice(1).forEach((pv) => { const [k, v] = pv.split(':'); (tracks[k] = tracks[k] || []).push([pos, parseFloat(v)]); });
    });
    Object.values(tracks).forEach((t) => t.sort((a, b) => a[0] - b[0]));
    return tracks;
  }
  function sample(t, p) {
    if (p <= t[0][0]) return t[0][1];
    for (let i = 1; i < t.length; i++) if (p <= t[i][0]) { const [p0, v0] = t[i - 1]; const [p1, v1] = t[i]; return v0 + (v1 - v0) * (p1 === p0 ? 1 : (p - p0) / (p1 - p0)); }
    return t[t.length - 1][1];
  }

  /* ───────────── Cenas ───────────── */
  let vw = innerWidth; let vh = innerHeight; let small = vw < 720;
  const scenes = RM ? [] : $$('[data-scene]').map((el) => ({
    el, stage: el.querySelector('.stage'), hook: el.dataset.hook, stepsAttr: el.dataset.steps,
    items: $$('[data-kf]', el).map((n) => ({ el: n, d: n.dataset.kf, sm: n.dataset.kfSm, tracks: null, last: '' })),
    dots: $$('.seq__dots li', el), top: 0, h: 0, steps: 2, p: -1, pinned: true,
  }));

  function setupH(s) {
    s.track = s.el.querySelector('[data-track]');
    s.viewport = s.el.querySelector('.hs__viewport');
    s.el.classList.remove('is-unpinned');
    s.el.style.height = '';
    s.track.style.transform = '';
    const room = s.stage.clientHeight - s.viewport.offsetTop - 24;
    const unpin = vh < 440 || s.track.offsetHeight > room;
    s.el.classList.toggle('is-unpinned', unpin);
    if (unpin) { s.dist = 0; s.steps = 0; return; }
    s.dist = Math.max(0, s.track.scrollWidth - s.viewport.clientWidth);
    const page = s.viewport.clientWidth * (small ? 0.86 : 0.7);
    s.steps = Math.max(2, Math.ceil(s.dist / page) + 1);
    s.el.style.height = Math.round((s.steps - 1) * vh * 0.9 + vh) + 'px';
  }
  function renderH(s, p) {
    if (!s.dist) return;
    s.track.style.transform = `translate3d(${(-p * s.dist).toFixed(1)}px,0,0)`;
  }

  function measure() {
    vw = innerWidth; vh = innerHeight; small = vw < 720;
    scenes.forEach((s) => {
      if (s.hook === 'hscroll') setupH(s);
      else s.steps = parseInt(s.stepsAttr, 10) || 2;
    });
    scenes.forEach((s) => {
      s.pinned = getComputedStyle(s.stage).position === 'sticky' && !s.el.classList.contains('is-unpinned');
      s.top = absTop(s.el); s.h = s.el.offsetHeight; s.p = -1;
      s.items.forEach((i) => { i.tracks = parseKf((small && i.sm) || i.d); i.last = ''; });
    });
    layoutRoad();
    frame();
  }

  function applyItem(it, p) {
    const t = it.tracks; const v = (k) => (t[k] ? sample(t[k], p) : DEF[k]);
    const o = v('o'); const x = v('x'); const y = v('y'); const s = v('s'); const b = small ? 0 : v('b');
    const key = `${o.toFixed(3)}|${x.toFixed(2)}|${y.toFixed(2)}|${s.toFixed(3)}|${b.toFixed(1)}`;
    if (key === it.last) return;
    it.last = key;
    it.el.style.opacity = o.toFixed(3);
    it.el.style.transform = `translate3d(${x.toFixed(2)}vw,${y.toFixed(2)}vh,0) scale(${s.toFixed(3)})`;
    it.el.style.filter = b > 0.1 ? `blur(${b.toFixed(1)}px)` : '';
    it.el.style.pointerEvents = o < 0.08 ? 'none' : '';
  }

  const range = (s) => Math.max(1, s.h - vh);
  let ticking = false;
  function frame() {
    ticking = false;
    const y = scrollY;
    for (const s of scenes) {
      if (!s.pinned) continue;
      if (y + vh < s.top - 200 || y > s.top + s.h + 200) continue;
      const p = clamp((y - s.top) / range(s));
      if (Math.abs(p - s.p) < 0.0005) continue;
      s.p = p;
      s.el.style.setProperty('--p', p.toFixed(4));
      s.items.forEach((it) => applyItem(it, p));
      if (s.hook === 'hscroll') renderH(s, p);
      if (s.dots.length) { const k = Math.round(p * (s.dots.length - 1)); s.dots.forEach((d, i) => d.classList.toggle('is-on', i === k)); }
    }
    const docP = clamp(y / Math.max(1, doc.scrollHeight - vh));
    doc.style.setProperty('--sp', docP.toFixed(4));
    doc.style.setProperty('--hp', docP.toFixed(4));
    topbar && topbar.classList.toggle('is-scrolled', y > 24);
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

  /* ───────────── Passos: um toque = uma tela ───────────── */
  let tween = null; let lockUntil = 0;
  function animateTo(target, dur = 950) {
    const from = scrollY; const dist = target - from;
    if (Math.abs(dist) < 2) return;
    const t0 = performance.now();
    cancelAnimationFrame(tween?.raf || 0);
    doc.style.scrollBehavior = 'auto';
    tween = { raf: 0 };
    const step = (now) => {
      const t = clamp((now - t0) / dur);
      window.scrollTo(0, from + dist * easeInOut(t));
      if (t < 1) tween.raf = requestAnimationFrame(step);
      else { tween = null; doc.style.scrollBehavior = ''; }
    };
    tween.raf = requestAnimationFrame(step);
    lockUntil = performance.now() + dur + 380;
  }
  const stepY = (s, k) => s.top + (k / (s.steps - 1)) * range(s);
  function sceneAt(y) {
    return scenes.find((s) => s.pinned && s.steps >= 2 && y >= s.top - 4 && y <= s.top + range(s) + 4);
  }
  /** Decide o próximo passo; retorna false se a cena deve liberar o scroll normal. */
  function stepScene(s, dir) {
    const f = (scrollY - s.top) / range(s) * (s.steps - 1);
    let k = dir > 0 ? Math.floor(f + 0.02) + 1 : Math.ceil(f - 0.02) - 1;
    if (k > s.steps - 1) { // saída para baixo
      animateTo(s.top + range(s) + Math.min(vh * 0.85, 700), 800);
      return true;
    }
    if (k < 0) { animateTo(Math.max(0, s.top - Math.min(vh * 0.85, 700)), 800); return true; }
    animateTo(stepY(s, k));
    return true;
  }
  if (!RM) {
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const s = sceneAt(scrollY);
      if (!s) return;
      e.preventDefault();
      if (tween || performance.now() < lockUntil || Math.abs(e.deltaY) < 3) return;
      stepScene(s, Math.sign(e.deltaY));
    }, { passive: false });

    let touchY = null; let touchScene = null;
    window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; touchScene = sceneAt(scrollY); }, { passive: true });
    window.addEventListener('touchmove', (e) => { if (touchScene) e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend', (e) => {
      if (touchY == null) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (touchScene && Math.abs(dy) > 18 && !tween) stepScene(touchScene, Math.sign(dy));
      touchY = null; touchScene = null;
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 };
      if (!(e.key in keys) || e.target.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
      const s = sceneAt(scrollY);
      if (!s) return;
      e.preventDefault();
      if (!tween && performance.now() >= lockUntil) stepScene(s, e.shiftKey && e.key === ' ' ? -1 : keys[e.key]);
    });

    // Rolagem "solta" (barra de rolagem, inércia no celular) termina sempre num passo inteiro.
    let idle = 0; let lastY = scrollY; let lastDir = 1;
    window.addEventListener('scroll', () => {
      lastDir = scrollY >= lastY ? 1 : -1; lastY = scrollY;
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (tween || touchY != null) return;
        const s = sceneAt(scrollY);
        if (!s) return;
        const f = (scrollY - s.top) / range(s) * (s.steps - 1);
        if (Math.abs(f - Math.round(f)) < 0.03) return;
        const k = clamp(lastDir > 0 ? Math.ceil(f) : Math.floor(f), 0, s.steps - 1);
        animateTo(stepY(s, k), 600);
      }, 140);
    }, { passive: true });
  }

  /* ───────────── O caminho da jornada (desenho automático) ───────────── */
  const road = {};
  function layoutRoad() {
    const wrap = document.querySelector('[data-road]');
    if (!wrap) return;
    const canvas = wrap.querySelector('.road__canvas');
    const svg = canvas.querySelector('svg');
    const stations = $$('.station', canvas);
    const n = stations.length;
    const W = canvas.clientWidth;
    const wide = vw >= 760;
    canvas.classList.add('is-laid');
    canvas.classList.toggle('is-wide', wide);
    let H; let pts; let d;
    if (wide) {
      const cols = vw >= 1100 ? 6 : 5; const rows = Math.ceil(n / cols);
      const padX = Math.min(110, W * 0.08); const rowGap = 150;
      H = (rows - 1) * rowGap + 110;
      pts = stations.map((_, i) => { const r = Math.floor(i / cols); let c = i % cols; if (r % 2) c = cols - 1 - c; return { x: padX + (c / (cols - 1)) * (W - padX * 2), y: 36 + r * rowGap, side: 'below' }; });
      d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < n; i++) {
        const A = pts[i - 1]; const B = pts[i];
        if (Math.abs(A.y - B.y) < 1) { const amp = (i % 2 ? 1 : -1) * 18; const mx = (A.x + B.x) / 2; d += ` C ${mx} ${A.y + amp}, ${mx} ${B.y - amp}, ${B.x} ${B.y}`; }
        else { const dir = Math.floor((i - 1) / cols) % 2 ? -1 : 1; const k = Math.min(padX * 0.95, rowGap * 0.6) * 1.3; d += ` C ${A.x + dir * k} ${A.y}, ${B.x + dir * k} ${B.y}, ${B.x} ${B.y}`; }
      }
    } else {
      const gap = 92; H = (n - 1) * gap + 70; const amp = W * 0.2;
      pts = stations.map((_, i) => { const x = W / 2 + amp * Math.sin(i * 0.95 + 0.4); return { x, y: 30 + i * gap, side: x < W / 2 ? 'right' : 'left' }; });
      d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < n - 1; i++) {
        const p0 = pts[i - 1] || pts[i]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[i + 2] || p2;
        d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
      }
    }
    canvas.style.height = H + 'px';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const [base, edge, trail] = ['.road__base', '.road__edge', '.road__trail'].map((q) => svg.querySelector(q));
    [base, edge, trail].forEach((p) => p.setAttribute('d', d));
    const L = trail.getTotalLength();
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.appendChild(probe);
    const segs = d.split(' C ');
    const lens = pts.map((_, i) => { if (!i) return 0; probe.setAttribute('d', segs.slice(0, i + 1).join(' C ')); return probe.getTotalLength(); });
    probe.remove();
    stations.forEach((st, i) => {
      st.style.setProperty('--x', ((pts[i].x / W) * 100).toFixed(3));
      st.style.setProperty('--y', ((pts[i].y / H) * 100).toFixed(3));
      st.dataset.side = pts[i].side;
      const a = st.querySelector('a');
      a.style.maxWidth = pts[i].side === 'left' ? `${Math.max(110, pts[i].x - 16)}px` : pts[i].side === 'right' ? `${Math.max(110, W - pts[i].x - 16)}px` : '';
    });
    Object.assign(road, { wrap, svg, trail, stations, L, lens, traveler: svg.querySelector('.road__traveler'), cur: +wrap.dataset.current || 0 });
    trail.style.strokeDasharray = `${L} ${L}`;
    if (road.played || RM) drawRoad(1, true); else { trail.style.strokeDashoffset = L; drawRoad(0, true); }
  }
  function drawRoad(t, instant) {
    const target = road.lens[road.cur] || 0;
    const len = target * t;
    road.trail.style.strokeDashoffset = (road.L - len).toFixed(1);
    const pt = road.trail.getPointAtLength(Math.max(0, len));
    road.traveler.setAttribute('cx', pt.x.toFixed(1)); road.traveler.setAttribute('cy', pt.y.toFixed(1));
    road.stations.forEach((st, i) => st.classList.toggle('is-reached', road.lens[i] <= len + 2));
    if (instant) return;
  }
  function playRoad() {
    if (road.played) return;
    road.played = true;
    const dur = 900 + 260 * (road.cur + 1); const t0 = performance.now();
    const step = (now) => { const t = clamp((now - t0) / dur); drawRoad(easeInOut(t)); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  TFJ.setRoadCurrent = (i) => { if (!road.wrap) return; road.wrap.dataset.current = i; road.cur = i; road.played = false; measure(); playRoad(); };
  const roadEl = document.querySelector('[data-road]');
  if (roadEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { playRoad(); } }), { threshold: 0.25 });
    io.observe(roadEl);
  }

  /* ───────────── Navegação ───────────── */
  const topbar = document.querySelector('.topbar');
  function scrollToTarget(target, smooth = true) {
    const det = target.matches('details') ? target : null;
    if (det) det.open = true;
    const hs = scenes.find((s) => s.hook === 'hscroll' && s.dist && s.track.contains(target));
    if (hs) {
      const t = clamp((target.offsetLeft - 24) / hs.dist);
      const k = Math.round(t * (hs.steps - 1));
      return animateTo(stepY(hs, k), smooth ? 1000 : 1);
    }
    const scene = scenes.find((s) => s.el === target && s.pinned);
    const y = scene ? scene.top + 2 : absTop(target) - (topbar ? topbar.offsetHeight : 0) - 10;
    // reveals entre a posição atual e o destino aparecem já prontos
    reveals.forEach((el) => { const t = absTop(el); if (t < y + vh) el.classList.add('is-in'); });
    if (smooth && !RM) animateTo(y, Math.min(1400, 500 + Math.abs(y - scrollY) / 12));
    else window.scrollTo(0, y);
  }
  TFJ.scrollToTarget = scrollToTarget;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    closeFab();
    if (a.dataset.goal) setContactGoal(a.dataset.goal);
    const dlg = a.closest('dialog'); if (dlg) dlg.close();
    history.pushState(null, '', url.hash);
    requestAnimationFrame(() => scrollToTarget(target));
  });

  /* ───────────── Menu flutuante ───────────── */
  const fab = document.querySelector('[data-fab]');
  const fabBtn = fab?.querySelector('.fab__btn');
  function closeFab() { if (!fab) return; fab.classList.remove('is-open'); fabBtn.setAttribute('aria-expanded', 'false'); }
  if (fab) {
    fabBtn.addEventListener('click', () => {
      const open = !fab.classList.contains('is-open');
      fab.classList.toggle('is-open', open);
      fabBtn.setAttribute('aria-expanded', String(open));
      if (open) fab.querySelector('.fab__st--current a, .fab__sections a.is-current, a')?.scrollIntoView({ block: 'nearest' });
    });
    document.addEventListener('click', (e) => { if (!fab.contains(e.target)) closeFab(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFab(); });
    const label = fab.querySelector('[data-here-label]');
    const secLinks = $$('[data-sec]', fab);
    const names = Object.fromEntries(secLinks.map((a) => [a.dataset.sec, a.textContent]));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.tone) body.dataset.tone = el.dataset.tone;
      const id = el.dataset.station ? null : el.dataset.chapter;
      if (el.dataset.station) { label.textContent = 'Etapa ' + (+el.dataset.i + 1) + ' · ' + el.querySelector('.st__title').textContent; return; }
      if (id && names[id]) { label.textContent = names[id]; secLinks.forEach((a) => a.classList.toggle('is-current', a.dataset.sec === id)); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-chapter], [data-station]').forEach((s) => io.observe(s));
  }

  /* ───────────── Frases palavra por palavra (por tempo) ───────────── */
  $$('[data-words]').forEach((el) => {
    if (RM) return;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="transition-delay:${i * 70}ms">${w}</span>`).join(' ');
    el.classList.add('words');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }), { threshold: 0.5 });
    io.observe(el);
  });

  /* ───────────── Abas ───────────── */
  $$('[data-tabs]').forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (tab, focus) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      requestRemeasure();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (map[e.key]) { e.preventDefault(); select(tabs[(i + map[e.key] + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ───────────── Filtros ───────────── */
  $$('[data-filterable]').forEach((wrap) => {
    const cards = $$('.' + wrap.dataset.filterable, wrap);
    const empty = wrap.querySelector('.empty');
    const state = {};
    $$('[data-filter]', wrap).forEach((g) => {
      const name = g.dataset.filter; state[name] = '';
      $$('button', g).forEach((b) => b.addEventListener('click', () => {
        state[name] = b.dataset.value;
        $$('button', g).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        let shown = 0;
        cards.forEach((c) => { const ok = Object.entries(state).every(([k, v]) => !v || (c.dataset[k] || '').split(' ').includes(v)); c.hidden = !ok; if (ok) shown++; });
        if (empty) empty.hidden = shown > 0;
        requestRemeasure();
      }));
    });
  });

  /* ───────────── Checklist ───────────── */
  const ck = document.querySelector('[data-checklist]');
  if (ck) {
    const inputs = $$('input[type="checkbox"]', ck);
    const fill = ck.querySelector('.ring__fill'); const label = ck.querySelector('[data-ring-label]'); const sr = ck.querySelector('[data-ring-sr]');
    const C = 2 * Math.PI * 52;
    const saved = store.get('tfj-checklist', {});
    inputs.forEach((i) => { i.checked = !!saved[i.dataset.key]; });
    const refresh = (announce) => {
      const done = inputs.filter((i) => i.checked).length;
      fill.style.strokeDasharray = C.toFixed(1);
      fill.style.strokeDashoffset = (C * (1 - done / inputs.length)).toFixed(1);
      label.textContent = Math.round((done / inputs.length) * 100) + '%';
      if (announce) sr.textContent = `${done} de ${inputs.length} itens concluídos`;
      store.set('tfj-checklist', Object.fromEntries(inputs.map((i) => [i.dataset.key, i.checked])));
    };
    inputs.forEach((i) => i.addEventListener('change', () => refresh(true)));
    ck.querySelector('[data-checklist-reset]')?.addEventListener('click', () => { inputs.forEach((i) => { i.checked = false; }); refresh(true); });
    refresh(false);
  }

  /* ───────────── Cronômetro de estudo ───────────── */
  const timer = document.querySelector('[data-timer]');
  if (timer) {
    const $ = (s) => timer.querySelector(s);
    const C = 2 * Math.PI * 52; const fill = $('.timer__fill'); fill.style.strokeDasharray = C.toFixed(1);
    let phase = 'work'; let left = 0; let total = 0; let int = 0; let cycles = 0;
    const mins = () => (phase === 'work' ? +$('[data-timer-work]').value : +$('[data-timer-rest]').value);
    const show = () => {
      $('[data-timer-time]').textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
      $('[data-timer-phase]').textContent = phase === 'work' ? 'Estudo' : 'Pausa';
      timer.dataset.phase = phase;
      fill.style.strokeDashoffset = (C * (1 - left / total)).toFixed(1);
    };
    const reset = () => { clearInterval(int); int = 0; phase = 'work'; total = left = mins() * 60; $('[data-timer-toggle]').textContent = 'Iniciar'; show(); };
    const beep = () => { try { const a = new (window.AudioContext || window.webkitAudioContext)(); [0, 0.25].forEach((d) => { const o = a.createOscillator(); const g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(0.0001, a.currentTime + d); g.gain.exponentialRampToValueAtTime(0.2, a.currentTime + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d + 0.4); o.start(a.currentTime + d); o.stop(a.currentTime + d + 0.45); }); } catch (e) { /* noop */ } };
    $('[data-timer-toggle]').addEventListener('click', () => {
      if (int) { clearInterval(int); int = 0; $('[data-timer-toggle]').textContent = 'Continuar'; return; }
      $('[data-timer-toggle]').textContent = 'Pausar';
      int = setInterval(() => {
        left--;
        if (left <= 0) {
          beep();
          if (phase === 'work') { cycles++; $('[data-timer-count]').textContent = `Ciclos concluídos: ${cycles}`; }
          phase = phase === 'work' ? 'rest' : 'work'; total = left = mins() * 60;
        }
        show();
      }, 1000);
    });
    $('[data-timer-reset]').addEventListener('click', reset);
    ['[data-timer-work]', '[data-timer-rest]'].forEach((s) => $(s).addEventListener('change', () => { if (!int) reset(); }));
    reset();
  }

  /* ───────────── Contato ───────────── */
  function setContactGoal(goal) { const sel = document.getElementById('c-obj'); if (sel) [...sel.options].forEach((o) => { if (o.text === goal) sel.value = o.value; }); }
  const form = document.querySelector('[data-contact]');
  if (form) {
    let channel = 'whatsapp';
    $$('[data-channel]', form).forEach((b) => b.addEventListener('click', () => { channel = b.dataset.channel; }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = appData.contact || {}; const status = form.querySelector('[data-contact-status]');
      const name = form.nome.value.trim();
      form.nome.setAttribute('aria-invalid', String(!name));
      if (!name) { status.textContent = 'Conte seu nome para começarmos.'; form.nome.focus(); return; }
      const msg = `Olá, Natan! Meu nome é ${name}.\nOnde estou na jornada: ${form.nivel.value}\nObjetivo: ${form.objetivo.value}${form.mensagem.value.trim() ? `\n\n${form.mensagem.value.trim()}` : ''}\n\n(Enviado pelo site The Flute Journey)`;
      if (channel === 'whatsapp' && c.whatsapp) window.open(`https://wa.me/${c.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      else if (c.email) location.href = `mailto:${c.email}?subject=${encodeURIComponent('Aulas de flauta — The Flute Journey')}&body=${encodeURIComponent(msg)}`;
      status.textContent = 'Abrindo sua mensagem… Até breve!';
    });
  }
  TFJ.setContactGoal = setContactGoal;

  /* ───────────── Ciclo de vida ───────────── */
  let rmTimer = 0; let lastH = 0;
  function requestRemeasure() { clearTimeout(rmTimer); rmTimer = setTimeout(measure, 150); }
  TFJ.remeasure = requestRemeasure;
  window.addEventListener('scroll', request, { passive: true });
  let lastW = vw; let lastVH = vh;
  window.addEventListener('resize', () => {
    if (innerWidth === lastW && Math.abs(innerHeight - lastVH) < 120) { vh = innerHeight; request(); return; }
    lastW = innerWidth; lastVH = innerHeight; requestRemeasure();
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => { if (Math.abs(doc.scrollHeight - lastH) > 4) { lastH = doc.scrollHeight; requestRemeasure(); } }).observe(document.getElementById('conteudo') || body);
  $$('details').forEach((d) => d.addEventListener('toggle', requestRemeasure));
  measure();
  if (document.fonts?.ready) document.fonts.ready.then(measure);
  window.addEventListener('load', () => {
    measure();
    if (location.hash.length > 1) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) scrollToTarget(t, false); }
  });
})();
