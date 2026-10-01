/*!
 * SCHNEIDER — THE FLUTE JOURNEY
 * Motor de scrollytelling leve (sem dependências):
 *  - [data-scene]  cenas fixas cujo progresso (0→1) é controlado pelo scroll
 *  - [data-kf]     keyframes declarativos dentro das cenas (opacidade, posição, escala, rotação, blur)
 *  - [data-view]   revelações e parallax sincronizados com a posição do elemento na tela
 *  - [data-words]  frases que se "acendem" palavra por palavra conforme o scroll
 * Tudo é reversível ao rolar para cima e respeita prefers-reduced-motion.
 */
(() => {
  'use strict';

  const body = document.body;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) body.classList.add('static');

  let appData = {};
  try { appData = JSON.parse(document.getElementById('app-data')?.textContent || '{}'); } catch (e) { /* noop */ }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } },
  };

  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function absTop(el) {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  /* ───────────────────────── Keyframes ───────────────────────── */
  const DEFAULTS = { o: 1, x: 0, y: 0, s: 1, r: 0, b: 0 };
  function parseKf(str) {
    const tracks = {};
    str.split(';').map((s) => s.trim()).filter(Boolean).forEach((seg) => {
      const parts = seg.split(/\s+/);
      const pos = parseFloat(parts[0]);
      parts.slice(1).forEach((pv) => {
        const [k, v] = pv.split(':');
        (tracks[k] = tracks[k] || []).push([pos, parseFloat(v)]);
      });
    });
    Object.values(tracks).forEach((t) => t.sort((a, b) => a[0] - b[0]));
    return tracks;
  }
  function sample(track, p) {
    if (p <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [p1, v1] = track[i];
      if (p <= p1) {
        const [p0, v0] = track[i - 1];
        const t = p1 === p0 ? 1 : (p - p0) / (p1 - p0);
        return v0 + (v1 - v0) * easeInOut(t);
      }
    }
    return track[track.length - 1][1];
  }

  /* ───────────────────────── Estado ───────────────────────── */
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let small = vw < 720;
  let allowBlur = !small;
  let scrollY = window.scrollY;
  let ticking = false;
  let rmTimer = 0;

  const scenes = RM ? [] : $$('[data-scene]').map((el) => ({
    el,
    stage: el.querySelector('.stage'),
    hook: el.dataset.hook,
    items: $$('[data-kf]', el).map((n) => ({ el: n, d: n.dataset.kf, sm: n.dataset.kfSm, tracks: null, last: '' })),
    top: 0, h: 0, pinned: true, active: true, p: -1,
  }));

  const views = RM ? [] : $$('[data-view]').map((el) => ({ el, type: el.dataset.view, speed: parseFloat(el.dataset.speed || '0'), top: 0, h: 0, active: true, last: '' }));

  const wordBlocks = RM ? [] : $$('[data-words]').map((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    return { el, spans: $$('.w', el), top: 0, h: 0, active: true, last: -1 };
  });

  /* ───────────────────────── Cenas especiais ───────────────────────── */
  // Rolagem horizontal controlada pelo scroll vertical.
  function setupH(s) {
    s.track = s.el.querySelector('[data-track]');
    s.viewport = s.el.querySelector('.hs__viewport');
    s.el.classList.remove('is-unpinned');
    s.el.style.height = '';
    s.track.style.transform = '';
    // Se os painéis não cabem na tela fixa, vira rolagem horizontal nativa (swipe), sem cortar conteúdo.
    const room = s.stage.clientHeight - s.viewport.offsetTop - 24;
    const unpin = vh < 440 || vw < 340 || s.track.offsetHeight > room;
    s.el.classList.toggle('is-unpinned', unpin);
    if (unpin) { s.dist = 0; return; }
    s.dist = Math.max(0, s.track.scrollWidth - s.viewport.clientWidth);
    s.el.style.height = Math.round(s.dist / 0.82 + vh) + 'px';
    s.steps = $$('.step', s.track);
  }
  function renderH(s, p) {
    if (!s.dist) return;
    const t = easeInOut(clamp((p - 0.06) / 0.82));
    s.track.style.transform = `translate3d(${(-t * s.dist).toFixed(1)}px,0,0)`;
    if (s.steps && s.steps.length) {
      const edge = t * s.dist + s.viewport.clientWidth * 0.7;
      s.steps.forEach((st) => st.classList.toggle('is-reached', st.offsetLeft < edge));
    }
  }

  // O caminho da jornada (SVG desenhado pelo scroll).
  const road = {};
  function setupRoad(s) {
    const canvas = s.el.querySelector('[data-road]');
    if (!canvas) return;
    road.scene = s;
    road.canvas = canvas;
    road.stations = $$('.station', canvas);
    road.svg = canvas.querySelector('svg');
    road.base = canvas.querySelector('.road__base');
    road.edge = canvas.querySelector('.road__edge');
    road.trail = canvas.querySelector('.road__trail');
    road.traveler = canvas.querySelector('.road__traveler');
    road.meta = s.el.querySelector('[data-road-meta]');
    road.phrase = s.el.querySelector('[data-road-phrase]');
    const n = road.stations.length;
    const stageW = s.stage.clientWidth;
    const padInline = parseFloat(getComputedStyle(s.stage).paddingLeft) * 2;
    const wide = vw >= 760 && vh >= 600;
    s.el.classList.toggle('is-pinned', wide);
    canvas.classList.add('is-laid');
    canvas.classList.toggle('is-wide', wide);
    let W; let H; let pts; let d;

    if (wide) {
      W = Math.min(1240, stageW - padInline);
      H = Math.max(300, vh - 68 - 80 - 120);
      const cols = vw >= 1100 ? 6 : 5;
      const rows = Math.ceil(n / cols);
      const padX = Math.min(120, W * 0.085);
      const padY = 34;
      const rowGap = rows > 1 ? (H - padY - 70) / (rows - 1) : 0;
      pts = road.stations.map((_, i) => {
        const r = Math.floor(i / cols);
        let c = i % cols;
        if (r % 2) c = cols - 1 - c;
        return { x: padX + (c / (cols - 1)) * (W - padX * 2), y: padY + r * rowGap, side: 'below' };
      });
      d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < n; i++) {
        const A = pts[i - 1]; const B = pts[i];
        if (Math.abs(A.y - B.y) < 1) {
          const amp = (i % 2 ? 1 : -1) * Math.min(26, rowGap * 0.12);
          const mx = (A.x + B.x) / 2;
          d += ` C ${mx} ${A.y + amp}, ${mx} ${B.y - amp}, ${B.x} ${B.y}`;
        } else {
          const dir = Math.floor((i - 1) / cols) % 2 ? -1 : 1;
          const k = Math.min(padX * 0.95, rowGap * 0.62);
          d += ` C ${A.x + dir * k * 1.33} ${A.y}, ${B.x + dir * k * 1.33} ${B.y}, ${B.x} ${B.y}`;
        }
      }
    } else {
      W = stageW - padInline;
      const gap = 148;
      H = (n - 1) * gap + 90;
      const amp = W * 0.2;
      pts = road.stations.map((_, i) => {
        const x = W / 2 + amp * Math.sin(i * 0.95 + 0.4);
        return { x, y: 40 + i * gap, side: x < W / 2 ? 'right' : 'left' };
      });
      // Catmull-Rom → Bézier
      d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < n - 1; i++) {
        const p0 = pts[i - 1] || pts[i]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[i + 2] || p2;
        d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
      }
    }

    canvas.style.height = H + 'px';
    road.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    [road.base, road.edge, road.trail].forEach((p) => p.setAttribute('d', d));
    road.L = road.trail.getTotalLength();
    road.trail.style.strokeDasharray = `${road.L} ${road.L}`;

    // Comprimento do caminho até cada estação.
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    road.svg.appendChild(probe);
    const segs = d.split(' C ');
    road.lens = pts.map((_, i) => {
      if (i === 0) return 0;
      probe.setAttribute('d', segs.slice(0, i + 1).join(' C '));
      return probe.getTotalLength();
    });
    probe.remove();

    road.stations.forEach((st, i) => {
      const pt = pts[i];
      st.style.setProperty('--x', ((pt.x / W) * 100).toFixed(3));
      st.style.setProperty('--y', ((pt.y / H) * 100).toFixed(3));
      st.dataset.side = pt.side;
      const a = st.querySelector('a');
      a.style.maxWidth = pt.side === 'left' ? `${Math.max(120, pt.x - 16)}px` : pt.side === 'right' ? `${Math.max(120, W - pt.x - 16)}px` : '';
    });
    road.current = -1;
    road.wide = wide;
  }
  function renderRoad(p) {
    if (!road.L) return;
    let t;
    if (road.wide) {
      t = clamp((p - 0.04) / 0.86);
    } else {
      const top = absTop(road.canvas);
      t = clamp((scrollY + vh * 0.62 - top) / road.canvas.offsetHeight);
    }
    const len = t * road.L;
    road.trail.style.strokeDashoffset = (road.L - len).toFixed(1);
    const pt = road.trail.getPointAtLength(len);
    road.traveler.setAttribute('cx', pt.x.toFixed(1));
    road.traveler.setAttribute('cy', pt.y.toFixed(1));
    let cur = 0;
    road.stations.forEach((st, i) => {
      const reached = len >= road.lens[i] - 2;
      st.classList.toggle('is-reached', reached);
      if (reached) cur = i;
    });
    if (cur !== road.current) {
      road.current = cur;
      road.stations.forEach((st, i) => st.classList.toggle('is-current', i === cur));
      const st = road.stations[cur];
      if (road.meta) road.meta.textContent = st.querySelector('.station__label small').textContent;
      if (road.phrase) road.phrase.textContent = st.querySelector('.station__phrase').textContent;
    }
  }

  /* ───────────────────────── Medição ───────────────────────── */
  let lastMainH = 0;
  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    small = vw < 720;
    allowBlur = !small && !RM;
    scenes.forEach((s) => {
      if (s.hook === 'hscroll') setupH(s);
      if (s.hook === 'road') setupRoad(s);
    });
    scenes.forEach((s) => {
      s.pinned = getComputedStyle(s.stage).position === 'sticky';
      s.top = absTop(s.el);
      s.h = s.el.offsetHeight;
      s.p = -1;
      s.items.forEach((i) => { i.tracks = parseKf((small && i.sm) || i.d); i.last = ''; });
    });
    views.forEach((v) => { v.top = absTop(v.el); v.h = v.el.offsetHeight; v.last = ''; });
    wordBlocks.forEach((w) => { w.top = absTop(w.el); w.h = w.el.offsetHeight; w.last = -1; });
    lastMainH = document.documentElement.scrollHeight;
    update();
  }

  /* ───────────────────────── Quadro de animação ───────────────────────── */
  function applyItem(it, p) {
    const t = it.tracks;
    const v = (k) => (t[k] ? sample(t[k], p) : DEFAULTS[k]);
    const o = v('o'); const x = v('x'); const y = v('y'); const s = v('s'); const r = v('r'); const b = allowBlur ? v('b') : 0;
    const key = `${o.toFixed(3)}|${x.toFixed(2)}|${y.toFixed(2)}|${s.toFixed(4)}|${r.toFixed(2)}|${b.toFixed(1)}`;
    if (key === it.last) return;
    it.last = key;
    const st = it.el.style;
    st.opacity = o.toFixed(3);
    st.transform = `translate3d(${x.toFixed(2)}vw,${y.toFixed(2)}vh,0) scale(${s.toFixed(4)}) rotate(${r.toFixed(2)}deg)`;
    st.filter = b > 0.1 ? `blur(${b.toFixed(1)}px)` : '';
    st.pointerEvents = o < 0.08 ? 'none' : '';
  }

  function update() {
    ticking = false;
    scrollY = window.scrollY;

    let suppressHere = false;
    for (const s of scenes) {
      if (!s.active) continue;
      const p = s.pinned ? clamp((scrollY - s.top) / Math.max(1, s.h - vh)) : clamp((scrollY + vh - s.top) / (s.h + vh));
      if (s.hook === 'road') renderRoad(p);
      if (s.pinned && s.hook !== 'road' && p > 0.001 && p < 0.999) suppressHere = true;
      if (Math.abs(p - s.p) < 0.0004) continue;
      s.p = p;
      s.el.style.setProperty('--p', p.toFixed(4));
      for (const it of s.items) applyItem(it, p);
      if (s.hook === 'hscroll') renderH(s, p);
    }

    for (const v of views) {
      if (!v.active) continue;
      const rel = v.top - scrollY;
      let key; let tf; let op = '';
      if (v.type === 'parallax') {
        const lim = Math.min(80, v.h * 0.2);
        const off = clamp((rel + v.h / 2 - vh / 2) * v.speed * (small ? 0.5 : 1), -lim, lim);
        key = off.toFixed(1);
        tf = `translate3d(0,${key}px,0)`;
      } else {
        const t = easeOut(clamp((vh - rel) / (vh * 0.26)));
        key = t.toFixed(3);
        op = key;
        tf = `translate3d(0,${((1 - t) * 36).toFixed(1)}px,0)`;
      }
      if (key === v.last) continue;
      v.last = key;
      v.el.style.transform = tf;
      if (op !== '') v.el.style.opacity = op;
    }

    for (const w of wordBlocks) {
      if (!w.active) continue;
      const rel = w.top - scrollY;
      const p = clamp((vh * 0.9 - rel) / (vh * 0.55 + w.h * 0.5));
      const lit = p * (w.spans.length + 1);
      const key = Math.round(lit * 20);
      if (key === w.last) continue;
      w.last = key;
      w.spans.forEach((sp, i) => { sp.style.opacity = (0.16 + 0.84 * clamp(lit - i)).toFixed(2); });
    }

    // Barra de progresso global + "Você está aqui".
    const docP = clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - vh));
    document.documentElement.style.setProperty('--sp', docP.toFixed(4));
    if (here.el) {
      here.el.style.setProperty('--hp', docP.toFixed(4));
      here.el.classList.toggle('is-suppressed', suppressHere);
    }
    if (topbar) topbar.classList.toggle('is-scrolled', scrollY > 24);
  }

  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  // Processa apenas o que está perto da tela.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target.__fx) e.target.__fx.active = e.isIntersecting;
        (e.target.__fxList || []).forEach((o) => { o.active = e.isIntersecting; });
      });
      requestUpdate();
    }, { rootMargin: '25% 0px 25% 0px' });
    // Observa um alvo que não sofre transformação (o pai, no caso das revelações/parallax),
    // para que o deslocamento visual não tire o elemento da área observada.
    [...scenes, ...wordBlocks].forEach((o) => { o.el.__fx = o; io.observe(o.el); });
    views.forEach((o) => {
      const target = o.el.parentElement;
      (target.__fxList = target.__fxList || []).push(o);
      if (target.__fxList.length === 1) io.observe(target);
    });
  }

  /* ───────────────────────── Navegação e "Você está aqui" ───────────────────────── */
  const topbar = document.querySelector('.topbar');
  const here = { el: document.querySelector('[data-here]') };
  const index = document.getElementById('journey-index');
  const chapterLinks = index ? $$('.jindex__list a', index) : [];
  const chapterLabels = chapterLinks.map((a) => ({ id: a.getAttribute('href').split('#')[1], label: a.lastChild.textContent.trim(), a }));

  if (here.el && chapterLabels.length && document.getElementById('inicio')) {
    here.el.hidden = false;
    here.el.classList.add('is-hidden');
    here.label = here.el.querySelector('[data-here-label]');
    here.next = here.el.querySelector('[data-here-next]');
    const sections = $$('[data-chapter]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.tone) body.dataset.tone = el.dataset.tone;
        const id = el.dataset.chapter;
        const idx = chapterLabels.findIndex((c) => c.id === id);
        here.el.classList.toggle('is-hidden', id === 'inicio' || idx < 0);
        if (idx >= 0) {
          here.label.textContent = chapterLabels[idx].label;
          here.next.textContent = chapterLabels[idx + 1] ? chapterLabels[idx + 1].label : '—';
          chapterLinks.forEach((a, i) => a.classList.toggle('is-current', i === idx));
        }
      });
    }, { rootMargin: '-48% 0px -48% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Esconde o indicador quando o rodapé aparece (evita cobrir links).
  const footerEl = document.querySelector('.footer');
  if (footerEl && here.el) {
    new IntersectionObserver((es) => es.forEach((e) => here.el.classList.toggle('is-hidden', e.isIntersecting)), { threshold: 0.05 }).observe(footerEl);
  }

  // Índice da jornada (dialog).
  function openIndex() {
    if (!index) return;
    if (typeof index.showModal === 'function') index.showModal(); else index.setAttribute('open', '');
    const cur = index.querySelector('.is-current') || index.querySelector('a');
    cur && cur.focus({ preventScroll: true });
  }
  function closeIndex() {
    if (!index) return;
    if (typeof index.close === 'function' && index.open) index.close(); else index.removeAttribute('open');
  }
  $$('[data-open-index]').forEach((b) => b.addEventListener('click', openIndex));
  if (index) {
    index.addEventListener('click', (e) => {
      if (e.target === index || e.target.closest('[data-close-index]')) closeIndex();
    });
  }

  // Âncoras: suportam alvos dentro de trilhas horizontais e <details>.
  function scrollToTarget(target, smooth = true) {
    const behavior = smooth && !RM ? 'smooth' : 'auto';
    const det = target.matches('details') ? target : null;
    if (det) det.open = true;
    const hs = scenes.find((s) => s.hook === 'hscroll' && s.dist && s.track.contains(target));
    if (hs) {
      const t = clamp((target.offsetLeft - parseFloat(getComputedStyle(hs.track).paddingLeft)) / hs.dist);
      // inverso aproximado da curva de easing usada em renderH
      let lo = 0; let hi = 1;
      for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; if (easeInOut(mid) < t) lo = mid; else hi = mid; }
      const p = 0.06 + lo * 0.82;
      window.scrollTo({ top: hs.top + p * (hs.h - vh) + 2, behavior });
      return;
    }
    const scene = scenes.find((s) => s.el === target);
    if (scene && scene.pinned && scene.hook !== 'road') {
      window.scrollTo({ top: scene.top + 2, behavior });
      return;
    }
    const offset = (topbar ? topbar.offsetHeight : 0) + 12;
    window.scrollTo({ top: absTop(target) - offset, behavior });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    closeIndex();
    if (a.dataset.goal) setContactGoal(a.dataset.goal);
    history.pushState(null, '', url.hash);
    // aguarda o fechamento do dialog antes de rolar
    requestAnimationFrame(() => scrollToTarget(target));
  });

  /* ───────────────────────── Sumário (scrollspy) ───────────────────────── */
  $$('.chapter__body').forEach((bodyEl) => {
    const links = $$('.toc a', bodyEl);
    if (!links.length) return;
    const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          const l = map.get(e.target.id);
          l && l.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.topic', bodyEl).forEach((t) => io.observe(t));
  });

  /* ───────────────────────── Abas ───────────────────────── */
  $$('[data-tabs]').forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: RM ? 'auto' : 'smooth' });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        let j = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % tabs.length;
        if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
        if (k === 'Home') j = 0;
        if (k === 'End') j = tabs.length - 1;
        if (j >= 0) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  });

  /* ───────────────────────── Filtros ───────────────────────── */
  $$('[data-filterable]').forEach((wrap) => {
    const cls = wrap.dataset.filterable;
    const cards = $$('.' + cls, wrap);
    const empty = wrap.querySelector('.empty');
    const state = {};
    $$('[data-filter]', wrap).forEach((group) => {
      const name = group.dataset.filter;
      state[name] = '';
      $$('button', group).forEach((b) => b.addEventListener('click', () => {
        state[name] = b.dataset.value;
        $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        let shown = 0;
        cards.forEach((c) => {
          const ok = Object.entries(state).every(([k, v]) => !v || (c.dataset[k] || '').split(' ').includes(v));
          c.hidden = !ok;
          if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      }));
    });
  });

  /* ───────────────────────── Questionário ───────────────────────── */
  const quizEl = document.querySelector('[data-quiz]');
  if (quizEl && appData.quiz) {
    const Q = appData.quiz;
    const R = appData.quizResults;
    let answers = new Array(Q.length).fill(null);
    let step = 0;
    const saved = store.get('tfj-quiz', null);

    const renderQ = () => {
      const q = Q[step];
      quizEl.innerHTML = `
        <div class="quiz__step">
          <div class="quiz__meta"><span>Pergunta ${step + 1} de ${Q.length}</span><span>Descubra seu nível</span></div>
          <div class="quiz__bar"><span style="transform:scaleX(${(step / Q.length).toFixed(3)})"></span></div>
          <h3 class="quiz__q" tabindex="-1">${q.q}</h3>
          <div class="quiz__opts" role="group" aria-label="${q.q}">
            ${q.options.map((o, i) => `<button type="button" class="quiz__opt" data-v="${i}" aria-pressed="${answers[step] === i}"><span>${'ABCD'[i]}</span>${o}</button>`).join('')}
          </div>
          <div class="quiz__nav">
            <button type="button" class="btn btn--text" data-back ${step === 0 ? 'disabled' : ''}>← Voltar</button>
            ${answers[step] !== null && step < Q.length - 1 ? '<button type="button" class="btn btn--text" data-fwd>Avançar →</button>' : ''}
          </div>
        </div>`;
      $$('.quiz__opt', quizEl).forEach((b) => b.addEventListener('click', () => {
        answers[step] = +b.dataset.v;
        $$('.quiz__opt', quizEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        setTimeout(() => { step < Q.length - 1 ? (step++, renderQ(), focusQ()) : renderResult(true); }, RM ? 0 : 260);
      }));
      quizEl.querySelector('[data-back]')?.addEventListener('click', () => { step = Math.max(0, step - 1); renderQ(); focusQ(); });
      quizEl.querySelector('[data-fwd]')?.addEventListener('click', () => { step++; renderQ(); focusQ(); });
    };
    const focusQ = () => quizEl.querySelector('.quiz__q')?.focus({ preventScroll: true });

    const renderResult = (fresh) => {
      const score = answers.reduce((a, b) => a + (b || 0), 0);
      const idx = R.reduce((acc, r, i) => (score >= r.min ? i : acc), 0);
      const r = R[idx];
      if (fresh) store.set('tfj-quiz', { answers, idx });
      quizEl.innerHTML = `
        <div class="quiz__step quiz__result">
          <p class="eyebrow">Sua orientação</p>
          <p class="quiz__meta"><span>Você parece estar em</span></p>
          <h3 tabindex="-1">${r.title}</h3>
          <div class="quiz__scale" aria-hidden="true">${R.map((_, i) => `<span class="${i <= idx ? 'on' : ''}"></span>`).join('')}</div>
          <div class="quiz__scale-labels" aria-hidden="true">${R.map((x) => `<span>${x.title}</span>`).join('')}</div>
          <p>${r.text}</p>
          <p class="eyebrow">Próximos passos sugeridos</p>
          <ul class="quiz__next checks">${r.next.map((n) => `<li>${n}</li>`).join('')}</ul>
          <p class="note">Este resultado é uma orientação, não um diagnóstico. Flautistas costumam estar em níveis diferentes em cada área — por exemplo, avançados em técnica e ainda construindo o som.</p>
          <div class="quiz__actions">
            <a class="btn btn--gold" href="${r.href}">Ir para esta etapa</a>
            <a class="btn btn--ghost" href="#aulas" data-level="${r.title}">Quero um plano personalizado</a>
            <button type="button" class="btn btn--text" data-restart>Refazer</button>
          </div>
        </div>`;
      quizEl.querySelector('[data-restart]').addEventListener('click', () => { answers = new Array(Q.length).fill(null); step = 0; renderQ(); focusQ(); });
      quizEl.querySelector('[data-level]').addEventListener('click', (e) => {
        const sel = document.getElementById('c-nivel');
        if (sel) [...sel.options].forEach((o) => { if (o.text === e.currentTarget.dataset.level) sel.value = o.value; });
      });
      if (fresh) quizEl.querySelector('h3').focus({ preventScroll: true });
      requestRemeasure();
    };

    if (saved && Array.isArray(saved.answers) && saved.answers.length === Q.length && saved.answers.every((a) => a !== null)) {
      answers = saved.answers;
      renderResult(false);
    } else {
      renderQ();
    }
  }

  /* ───────────────────────── Checklist ───────────────────────── */
  const ck = document.querySelector('[data-checklist]');
  if (ck) {
    const inputs = $$('input[type="checkbox"]', ck);
    const fill = ck.querySelector('.ring__fill');
    const label = ck.querySelector('[data-ring-label]');
    const sr = ck.querySelector('[data-ring-sr]');
    const C = 2 * Math.PI * 52;
    const saved = store.get('tfj-checklist', {});
    inputs.forEach((i) => { i.checked = !!saved[i.dataset.key]; });
    const refresh = (announce) => {
      const done = inputs.filter((i) => i.checked).length;
      const pct = Math.round((done / inputs.length) * 100);
      fill.style.strokeDasharray = C.toFixed(1);
      fill.style.strokeDashoffset = (C * (1 - done / inputs.length)).toFixed(1);
      label.textContent = pct + '%';
      if (announce) sr.textContent = `${done} de ${inputs.length} itens concluídos`;
      store.set('tfj-checklist', Object.fromEntries(inputs.map((i) => [i.dataset.key, i.checked])));
    };
    inputs.forEach((i) => i.addEventListener('change', () => refresh(true)));
    ck.querySelector('[data-checklist-reset]')?.addEventListener('click', () => { inputs.forEach((i) => { i.checked = false; }); refresh(true); });
    refresh(false);
  }

  /* ───────────────────────── Contato ───────────────────────── */
  function setContactGoal(goal) {
    const sel = document.getElementById('c-obj');
    if (sel) [...sel.options].forEach((o) => { if (o.text === goal) sel.value = o.value; });
  }
  const form = document.querySelector('[data-contact]');
  if (form) {
    let channel = 'whatsapp';
    $$('[data-channel]', form).forEach((b) => b.addEventListener('click', () => { channel = b.dataset.channel; }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = appData.contact || {};
      const status = form.querySelector('[data-contact-status]');
      const name = form.nome.value.trim();
      form.nome.setAttribute('aria-invalid', String(!name));
      if (!name) { status.textContent = 'Conte seu nome para começarmos.'; form.nome.focus(); return; }
      const msg = `Olá, Natan! Meu nome é ${name}.\nOnde estou na jornada: ${form.nivel.value}\nObjetivo: ${form.objetivo.value}${form.mensagem.value.trim() ? `\n\n${form.mensagem.value.trim()}` : ''}\n\n(Enviado pelo site The Flute Journey)`;
      if (channel === 'whatsapp' && c.whatsapp) {
        window.open(`https://wa.me/${c.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      } else if (c.email) {
        location.href = `mailto:${c.email}?subject=${encodeURIComponent('Quero começar minha jornada — aulas de flauta')}&body=${encodeURIComponent(msg)}`;
      }
      status.textContent = 'Abrindo sua mensagem… Até breve!';
    });
  }

  /* ───────────────────────── Ciclo de vida ───────────────────────── */
  function requestRemeasure() {
    clearTimeout(rmTimer);
    rmTimer = setTimeout(measure, 120);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  let lastW = vw; let lastH = vh;
  window.addEventListener('resize', () => {
    const w = window.innerWidth; const h = window.innerHeight;
    // Ignora pequenas variações de altura causadas pela barra do navegador no celular.
    if (w === lastW && Math.abs(h - lastH) < 120) { vh = h; requestUpdate(); return; }
    lastW = w; lastH = h;
    requestRemeasure();
  });
  if ('ResizeObserver' in window) {
    const main = document.getElementById('conteudo');
    if (main) new ResizeObserver(() => { if (Math.abs(document.documentElement.scrollHeight - lastMainH) > 4) requestRemeasure(); }).observe(main);
  }
  $$('details').forEach((d) => d.addEventListener('toggle', requestRemeasure));

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('load', () => {
    measure();
    if (location.hash) {
      const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) scrollToTarget(t, false);
    }
  });
})();
