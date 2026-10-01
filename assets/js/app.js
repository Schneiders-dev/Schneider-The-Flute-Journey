/*!
 * The Flute Journey — contas, prova de nivelamento, provas das etapas, perfil, vídeos e métricas.
 * Conversa com a API do servidor (/api/*). No site estático (sem servidor), as contas ficam ocultas.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  let boot = {};
  try { boot = JSON.parse($('#app-data')?.textContent || '{}'); } catch (e) { /* noop */ }
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function api(path, data, method) {
    const res = await fetch('/api/' + path, {
      method: method || (data ? 'POST' : 'GET'),
      headers: data ? { 'Content-Type': 'application/json', 'X-TFJ': '1' } : { 'X-TFJ': '1' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'same-origin',
    });
    let json = {};
    try { json = await res.json(); } catch (e) { /* noop */ }
    if (!res.ok) throw Object.assign(new Error(json.error || 'Erro de conexão'), { status: res.status, data: json });
    return json;
  }

  function toast(msg, ms = 3200) {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }
  window.TFJ = window.TFJ || {};
  TFJ.toast = toast; TFJ.api = api;

  const dlgAcc = $('#dlg-account');
  const dlgPlay = $('#dlg-play');
  const playBody = $('[data-play-body]');
  const accBtn = $('[data-account]');
  let me = null; // { user, current, access }
  let online = false;

  /* ───────────── Métricas (anônimas, próprias) ───────────── */
  function track(type, extra = {}) {
    if (!online) return;
    const payload = JSON.stringify({ type, path: location.pathname, ...extra });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon('/api/t', new Blob([payload], { type: 'text/plain' }));
      else fetch('/api/t', { method: 'POST', body: payload, keepalive: true });
    } catch (e) { /* noop */ }
  }
  TFJ.track = track;
  function startMetrics() {
    track('pv', { ref: document.referrer ? new URL(document.referrer).hostname : '' , mobile: innerWidth < 760 ? 1 : 0 });
    let active = 0;
    setInterval(() => { if (document.visibilityState === 'visible') { active += 15; track('hb', { value: 15 }); } }, 15000);
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-track], a[href^="https://wa.me"], a[href*="instagram.com"], a[href^="mailto:"]');
      if (!el) return;
      const label = el.dataset.track || (el.href.includes('wa.me') ? 'whatsapp' : el.href.includes('instagram') ? 'instagram' : 'email');
      track('click', { label });
    });
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      const id = en.target.dataset.station || en.target.dataset.chapter;
      if (en.isIntersecting && id && !seen.has(id)) { seen.add(id); track('sec', { label: id }); }
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('[data-chapter], [data-station]').forEach((s) => io.observe(s));
  }

  /* ───────────── Sessão ───────────── */
  async function loadMe() {
    try {
      me = await api('me');
      online = true;
    } catch (e) {
      online = false;
    }
    if (!online || boot.isStatic) {
      accBtn && (accBtn.hidden = true);
      return;
    }
    accBtn.hidden = false;
    if (me.user) {
      accBtn.classList.add('is-in');
      $('[data-account-label]').textContent = me.user.role === 'admin' ? 'Administrador' : me.user.name.split(' ')[0];
      renderMeCard();
    } else {
      accBtn.classList.remove('is-in');
      $('[data-account-label]').textContent = 'Entrar';
    }
    startMetrics();
  }

  function renderMeCard() {
    const box = $('[data-journey-me]');
    if (!box || !me?.user || me.user.role === 'admin') return;
    const total = boot.stations.length;
    const done = me.done || 0;
    const cur = boot.stations[me.current] || boot.stations[0];
    box.innerHTML = `<div class="me-card"><span>Olá, <strong>${esc(me.user.name.split(' ')[0])}</strong>. Você está em <strong>${me.current + 1} · ${esc(cur.title)}</strong></span>
      <span class="me-card__bar" aria-label="${done} de ${total} etapas concluídas"><span style="--w:${Math.round((done / total) * 100)}%"></span></span>
      <a class="btn btn--gold" href="#s-${cur.id}">Continuar de onde parei</a></div>`;
  }

  /* ───────────── Conta: cadastro / login ───────────── */
  function openAccount(tab = 'register', note) {
    if (!online) return offlineNotice();
    switchTab(tab);
    $$('[data-acc-msg]').forEach((m) => { m.textContent = note || ''; m.style.color = note ? 'var(--gold-2)' : ''; });
    dlgAcc.showModal();
    setTimeout(() => dlgAcc.querySelector(`[data-acc-form="${tab}"] input`)?.focus(), 60);
  }
  function switchTab(tab) {
    $$('[data-acc-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.accTab === tab)));
    $$('[data-acc-form]').forEach((f) => { f.hidden = f.dataset.accForm !== tab; });
  }
  $$('[data-acc-tab]').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.accTab)));
  $$('[data-close-dlg]').forEach((a) => a.addEventListener('click', () => a.closest('dialog')?.close()));

  const regForm = $('[data-acc-form="register"]');
  regForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = regForm.querySelector('[data-acc-msg]'); msg.style.color = '';
    const f = new FormData(regForm);
    const data = Object.fromEntries(f);
    data.consent = !!f.get('consent');
    if (!data.name?.trim() || !data.email?.trim() || !data.phone?.trim() || !data.password) { msg.textContent = 'Preencha todos os campos.'; return; }
    if (data.password.length < 8) { msg.textContent = 'A senha precisa ter pelo menos 8 caracteres.'; return; }
    if (!data.consent) { msg.textContent = 'Para criar a conta, é preciso concordar com a política de privacidade.'; return; }
    const pending = sessionStorage.getItem('tfj-placement');
    if (pending) data.placement = JSON.parse(pending);
    const btn = regForm.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      const r = await api('register', data);
      sessionStorage.removeItem('tfj-placement');
      track('signup');
      dlgAcc.close();
      if (r.placed) { location.href = '/#s-' + boot.stations[r.current].id; location.reload(); }
      else { await loadMe(); openPlacement(true); }
    } catch (err) { msg.textContent = err.message; } finally { btn.disabled = false; }
  });

  const logForm = $('[data-acc-form="login"]');
  logForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = logForm.querySelector('[data-acc-msg]'); msg.style.color = '';
    const btn = logForm.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      await api('login', Object.fromEntries(new FormData(logForm)));
      location.reload();
    } catch (err) { msg.textContent = err.message; } finally { btn.disabled = false; }
  });

  function offlineNotice() {
    if (boot.appUrl) toast('As contas estão disponíveis no site oficial: ' + boot.appUrl, 5000);
    else toast('As contas e provas estarão disponíveis em breve.');
  }

  /* ───────────── Perfil ───────────── */
  function openProfile() {
    const u = me.user;
    const access = me.access || [];
    playBody.innerHTML = `<div class="play__step">
      <p class="eyebrow">Minha jornada</p>
      <h2 class="display" style="font-size:clamp(2rem,6vw,2.8rem);margin:0">${esc(u.name)}</h2>
      <p class="acc-sub">${esc(u.email)}${u.isStudent ? ' · <strong style="color:var(--gold-2)">Aluno</strong>' : ''}</p>
      <ol class="prof__stations">${boot.stations.map((s, i) => `<li class="${access[i] === 'done' ? 'done' : access[i] === 'open' ? 'open' : ''}">${String(i + 1).padStart(2, '0')} · ${esc(s.title)}${access[i] === 'done' ? ' ✓' : ['guest', 'prev', 'premium'].includes(access[i]) ? ' 🔒' : ''}</li>`).join('')}</ol>
      <div class="play__actions" style="justify-content:flex-start">
        <a class="btn btn--gold" href="#s-${boot.stations[me.current].id}" data-close-dlg>Ir para minha etapa</a>
        ${u.role === 'admin' ? '<a class="btn btn--ghost" href="/admin">Painel do administrador</a>' : `<button class="btn btn--ghost" type="button" data-redo-placement>Refazer prova de nivelamento</button>`}
        <button class="btn btn--text" type="button" data-logout>Sair</button>
      </div>
    </div>`;
    dlgPlay.showModal();
    $('[data-logout]', playBody).addEventListener('click', async () => { await api('logout', {}); location.href = '/'; });
    $('[data-redo-placement]', playBody)?.addEventListener('click', () => openPlacement(false));
    $$('[data-close-dlg]', playBody).forEach((a) => a.addEventListener('click', () => dlgPlay.close()));
  }

  accBtn?.addEventListener('click', () => (me?.user ? openProfile() : openAccount('login')));
  $$('[data-start-journey]').forEach((b) => b.addEventListener('click', () => {
    if (!online) { TFJ.scrollToTarget?.($('#mapa')); return offlineNotice(); }
    if (me?.user) return TFJ.scrollToTarget?.($('#s-' + boot.stations[me.current].id));
    openAccount('register');
  }));
  $$('[data-placement]').forEach((b) => b.addEventListener('click', () => (online ? openPlacement(false) : offlineNotice())));

  /* ───────────── Motor de prova (nivelamento e etapas) ───────────── */
  function runQuiz({ title, intro, questions, seconds, onFinish }) {
    let i = 0; const answers = []; let timer = 0;
    const C = 2 * Math.PI * 22;
    const startScreen = () => {
      playBody.innerHTML = `<div class="play__step play__intro"><p class="eyebrow eyebrow--center">${esc(title)}</p><h2 class="display">${esc(intro.h)}</h2><p class="acc-sub">${esc(intro.p)}</p><div class="play__actions" style="margin-top:1.4rem"><button class="btn btn--gold" type="button" data-go>Começar</button></div></div>`;
      $('[data-go]', playBody).addEventListener('click', show);
    };
    const show = () => {
      const q = questions[i];
      let left = seconds;
      playBody.innerHTML = `<div class="play__step">
        <div class="play__meta"><span>${esc(title)} · ${i + 1} de ${questions.length}</span>
          <div class="play__timer" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22"/><circle class="play__timer-fill" cx="26" cy="26" r="22" style="stroke-dashoffset:0"/></svg><span data-left>${left}</span></div></div>
        <div class="play__bar"><span style="width:${(i / questions.length) * 100}%"></span></div>
        <h3 class="play__q" tabindex="-1">${esc(q.q)}</h3>
        ${q.visualHtml ? `<div class="play__visual">${q.visualHtml}</div>` : ''}
        <div class="play__opts">${q.options.map((o, k) => `<button type="button" class="play__opt" data-k="${k}"><b>${'ABCD'[k]}</b>${esc(o)}</button>`).join('')}</div>
      </div>`;
      $('.play__q', playBody).focus({ preventScroll: true });
      const fill = $('.play__timer-fill', playBody); fill.style.strokeDasharray = C.toFixed(1);
      const tEl = $('.play__timer', playBody);
      const pick = (k) => {
        clearInterval(timer);
        answers[i] = k;
        $$('.play__opt', playBody).forEach((b) => { b.disabled = true; if (+b.dataset.k === k) b.classList.add('is-picked'); });
        setTimeout(() => { i++; i < questions.length ? show() : onFinish(answers); }, RM ? 50 : 380);
      };
      $$('.play__opt', playBody).forEach((b) => b.addEventListener('click', () => pick(+b.dataset.k)));
      timer = setInterval(() => {
        left--;
        $('[data-left]', playBody).textContent = Math.max(0, left);
        fill.style.strokeDashoffset = (C * (1 - left / seconds)).toFixed(1);
        tEl.classList.toggle('is-low', left <= 5);
        if (left <= 0) pick(-1);
      }, 1000);
    };
    dlgPlay.addEventListener('close', () => clearInterval(timer), { once: true });
    startScreen();
    if (!dlgPlay.open) dlgPlay.showModal();
  }

  function confetti() {
    if (RM) return;
    const c = document.createElement('div'); c.className = 'confetti';
    c.innerHTML = Array.from({ length: 60 }, () => `<i style="left:${Math.random() * 100}%;--dx:${(Math.random() - 0.5) * 200}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * 0.4}s;background:${Math.random() > 0.5 ? '#e3cb94' : '#c8a96a'}"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 3200);
  }

  async function openPlacement(afterSignup) {
    let data;
    try { data = await api('placement'); } catch (e) { return toast(e.message); }
    runQuiz({
      title: 'Prova de nivelamento',
      intro: { h: afterSignup ? 'Vamos descobrir onde você começa.' : 'Descubra onde você está.', p: `${data.questions.length} perguntas sobre a flauta e sobre o que você já toca. ${data.seconds} segundos por pergunta. O resultado é uma orientação — não um julgamento.` },
      questions: data.questions,
      seconds: data.seconds,
      onFinish: async (answers) => {
        if (!me?.user) {
          sessionStorage.setItem('tfj-placement', JSON.stringify(answers));
          const r = await api('placement/preview', { answers }).catch(() => null);
          playBody.innerHTML = `<div class="play__step play__result"><p class="eyebrow eyebrow--center">Resultado</p><p class="acc-sub">Você começaria em</p><h3>${r ? esc(boot.stations[r.current].title) : 'sua etapa'}</h3><p>Crie sua conta gratuita para salvar o resultado e desbloquear as etapas até aqui.</p><div class="play__actions"><button class="btn btn--gold" type="button" data-signup>Criar minha conta</button></div></div>`;
          $('[data-signup]', playBody).addEventListener('click', () => { dlgPlay.close(); openAccount('register', 'Seu resultado será salvo ao criar a conta.'); });
          return;
        }
        try {
          const r = await api('placement', { answers });
          track('placement', { label: String(r.current + 1) });
          playBody.innerHTML = `<div class="play__step play__result"><p class="eyebrow eyebrow--center">Seu ponto de partida</p><p class="play__score">${String(r.current + 1).padStart(2, '0')}</p><h3>${esc(boot.stations[r.current].title)}</h3><p>${r.current > 0 ? 'As etapas anteriores ficam liberadas para revisão. ' : ''}Complete a prova de cada etapa para seguir em frente.</p><div class="play__actions"><a class="btn btn--gold" href="/#s-${boot.stations[r.current].id}" data-reload>Começar a jornada</a></div></div>`;
          confetti();
          $('[data-reload]', playBody).addEventListener('click', (e) => { e.preventDefault(); location.href = e.currentTarget.href; location.reload(); });
        } catch (e) { toast(e.message); }
      },
    });
  }

  async function startStationQuiz(stationId) {
    if (!online) return offlineNotice();
    if (!me?.user) return openAccount('register', 'Crie sua conta para fazer as provas e salvar seu progresso.');
    let data;
    try { data = await api('quiz/start', { station: stationId }); } catch (e) { return toast(e.message, 4200); }
    const st = boot.stations.find((s) => s.id === stationId);
    runQuiz({
      title: `Prova · ${st.title}`,
      intro: { h: st.title, p: `${data.questions.length} perguntas, ${data.seconds} segundos cada. Acerte pelo menos ${data.passMin} para desbloquear a próxima etapa.` },
      questions: data.questions,
      seconds: data.seconds,
      onFinish: async (answers) => {
        let r;
        try { r = await api('quiz/submit', { attempt: data.attempt, answers }); } catch (e) { return toast(e.message); }
        track('quiz', { label: stationId, value: r.score });
        const next = r.nextId ? boot.stations.find((s) => s.id === r.nextId) : null;
        playBody.innerHTML = `<div class="play__step play__result">
          <p class="eyebrow eyebrow--center">${r.passed ? 'Etapa concluída' : 'Quase lá'}</p>
          <p class="play__score">${r.score}/${r.total}</p>
          <h3>${r.passed ? (r.premium ? 'Você chegou ao limite da jornada gratuita.' : next ? `Desbloqueado: ${esc(next.title)}` : 'Parabéns!') : 'Revise a etapa e tente de novo.'}</h3>
          ${r.premium ? '<p>As próximas etapas são liberadas nas aulas com Natan Schneider — com acompanhamento individual.</p>' : ''}
          <ol class="play__review">${r.review.map((x) => `<li class="${x.ok ? 'ok' : 'ko'}">${esc(x.q)}<small>${x.ok ? 'Correto' : `Resposta: ${esc(x.correct)}`}</small></li>`).join('')}</ol>
          <div class="play__actions">
            ${r.passed && next && !r.premium ? `<a class="btn btn--gold" href="/#s-${next.id}" data-reload>Ir para a próxima etapa</a>` : ''}
            ${r.premium ? '<a class="btn btn--gold" href="#aulas" data-track="quiz-premium" data-close-dlg>Quero continuar com aulas</a>' : ''}
            ${!r.passed ? `<button class="btn btn--gold" type="button" data-retry>Tentar de novo</button>` : ''}
            <button class="btn btn--text" type="button" data-close>Fechar</button>
          </div></div>`;
        if (r.passed) confetti();
        $('[data-retry]', playBody)?.addEventListener('click', () => startStationQuiz(stationId));
        $('[data-close]', playBody).addEventListener('click', () => (r.passed ? location.reload() : dlgPlay.close()));
        $$('[data-close-dlg]', playBody).forEach((a) => a.addEventListener('click', () => dlgPlay.close()));
        $('[data-reload]', playBody)?.addEventListener('click', (e) => { e.preventDefault(); location.href = e.currentTarget.href; location.reload(); });
      },
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-quiz-start]');
    if (b) startStationQuiz(b.dataset.quizStart);
  });

  /* ───────────── Vídeos ───────────── */
  const dlgVideo = $('#dlg-video');
  function embed(url) {
    let m = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(url);
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0" title="Vídeo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    m = /vimeo\.com\/(\d+)/.exec(url);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" title="Vídeo" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    if (/^\/uploads\/[\w.-]+\.(mp4|webm|mov)$/i.test(url) || /^https:\/\/.+\.(mp4|webm)$/i.test(url)) return `<video src="${esc(url)}" controls autoplay playsinline></video>`;
    return '';
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-video]');
    if (!b || document.body.classList.contains('is-editing')) return;
    const html = embed(b.dataset.video);
    if (!html) return;
    $('[data-video-body]').innerHTML = html;
    dlgVideo.showModal();
  });
  dlgVideo?.addEventListener('close', () => { $('[data-video-body]').innerHTML = ''; });

  // Abre automaticamente se a URL pedir (ex.: /?entrar)
  loadMe().then(() => {
    const q = new URLSearchParams(location.search);
    if (q.has('entrar')) openAccount('login');
    if (q.has('cadastro')) openAccount('register');
  });
})();
