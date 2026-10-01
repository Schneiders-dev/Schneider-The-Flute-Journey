// Página principal de The Flute Journey.
// renderIndex(ctx) é chamada pelo servidor a cada pedido (com o acesso do usuário) e pelo build estático (visitante).
import { content } from '../content.mjs';
import { LEVELS, FOCUS } from '../data/methods.mjs';
import { PERIODS, REP_LEVELS } from '../data/repertoire.mjs';
import { references } from '../data/references.mjs';
import { ROUTINE_LABELS } from '../data/practice.mjs';
import { ROLE_LABELS } from '../data/pedagogues.mjs';
import { QUIZ_RULES } from '../data/quizzes.mjs';
import { esc, kf, icon, photo, initials } from './helpers.mjs';
import { methodCard, repCard, problemBody, pillarBody, sourcesHTML } from './components.mjs';
import { visual, heroVisual } from './visuals.mjs';
import { head, topbar, footer, navChapters } from './layout.mjs';
import { fluteLineSVG, markSVG } from '../brand/flute-path.mjs';

const pad = (n) => String(n).padStart(2, '0');
/** Atributo de edição (o editor do administrador grava neste caminho). */
const ed = (path) => ` data-edit="${path}"`;

/** Imagem de um "slot" de mídia trocável. */
function mediaImg(key, sizes = '(min-width: 900px) 40vw, 92vw', alt) {
  const m = content.media[key] || {};
  if (m.hidden) return `<span class="media-empty" data-edit-img="media.${key}"></span>`;
  const img = m.src
    ? `<img src="${esc(m.src)}" alt="${esc(alt ?? m.alt ?? '')}" style="object-position:${esc(m.pos || '50% 50%')}" loading="lazy" decoding="async">`
    : photo(m.photo || 1, { sizes, alt }).replace(/style="object-position:[^"]*"/, m.pos ? `style="object-position:${esc(m.pos)}"` : '$&');
  return `<span class="media-slot" data-edit-img="media.${key}">${img}</span>`;
}

// Keyframes para frases que se sucedem em uma cena com passos (uma frase por passo).
function stepKf(i, n, holdLast = true) {
  const c = i / (n - 1);
  const w = 0.5 / (n - 1);
  const r = (v) => Math.min(1, Math.max(0, +v.toFixed(4)));
  const inn = i === 0 ? '0 o:1 y:0 s:1 b:0' : `${r(c - w)} o:0 y:4 s:.97 b:6; ${r(c - w * 0.25)} o:1 y:0 s:1 b:0`;
  if (i === n - 1 && holdLast) return `${inn}; 1 o:1 y:0`;
  return `${inn}; ${r(c + w * 0.25)} o:1 y:0 s:1 b:0; ${r(c + w)} o:0 y:-4 s:1.02 b:6`;
}

/* ───────────── HERO ───────────── */
const heroSection = () => {
  const h = content.hero;
  return `
<section id="inicio" class="hero" data-chapter="inicio" data-tone="night" aria-label="Abertura">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="hero__inner">
    <p class="eyebrow eyebrow--center hero__eyebrow"${ed('hero.eyebrow')}>${esc(h.eyebrow)}</p>
    <h1 class="hero__title"><span${ed('hero.title')}>${esc(h.title)}</span></h1>
    ${fluteLineSVG('fline hero__line')}
    <p class="hero__lead"${ed('hero.lead')}>${esc(h.lead)}</p>
    <p class="hero__by"${ed('hero.byline')}>${esc(h.byline)}</p>
    <div class="hero__ctas">
      <button class="btn btn--gold" type="button" data-start-journey data-track="hero-comecar">Começar minha jornada ${icon('arrow')}</button>
      <button class="btn btn--ghost" type="button" data-placement data-track="hero-nivel">Descubra seu nível</button>
    </div>
  </div>
  <a class="scroll-cue" href="#prologo" aria-label="Continuar"><span></span></a>
</section>`;
};

/* ───────────── PRÓLOGO (passos) ───────────── */
const prologueLines = [
  ['Todo flautista começa', 'em algum lugar.'],
  ['Antes das grandes obras,', 'existem os primeiros sons.'],
  ['Antes da velocidade,', 'existe o controle.'],
  ['Antes da interpretação,', 'existe a técnica.'],
  ['E antes de tudo isso,', 'existe o desejo de aprender.'],
];
const prologue = () => `
<section id="prologo" class="scene seq" data-scene data-steps="${prologueLines.length}" data-tone="night" data-chapter="inicio" style="--h:${prologueLines.length * 70 + 30}" aria-label="Prólogo">
  <div class="stage">
    <div class="seq__lines">
      ${prologueLines.map((l, i) => `<p class="seq__line display${i === prologueLines.length - 1 ? ' seq__line--gold' : ''}"${kf(stepKf(i, prologueLines.length))}>${esc(l[0])}<br><em>${esc(l[1])}</em></p>`).join('')}
    </div>
    <ol class="seq__dots" aria-hidden="true">${prologueLines.map(() => '<li></li>').join('')}</ol>
  </div>
</section>`;

/* ───────────── ESTADO DAS ETAPAS ───────────── */
const STATE_LABEL = { done: 'Concluída', open: 'Disponível', current: 'Você está aqui', guest: 'Bloqueada', prev: 'Bloqueada', premium: 'Com as aulas' };
const stateOf = (ctx, i) => (ctx.current === i && ['open', 'done'].includes(ctx.access[i]) ? 'current' : ctx.access[i]);
const isOpen = (st) => ['open', 'done', 'current'].includes(st);
const lockIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
const checkIcon = icon('check');

/* ───────────── MAPA ───────────── */
const map = (ctx) => `
<section id="mapa" class="map" data-chapter="mapa" data-tone="deep" aria-labelledby="mapa-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">O mapa da jornada</p>
    <h2 id="mapa-title" class="display">Um caminho.<br><em>Não uma corrida.</em></h2>
    <p class="lead">Dezessete etapas, do primeiro contato à formação artística. Cada flautista percorre o caminho no seu ritmo — este é um mapa de desenvolvimento, não uma competição.</p>
  </header>
  <div class="road container" data-road data-current="${ctx.current}">
    <div class="road__canvas">
      <svg class="road__svg" aria-hidden="true" preserveAspectRatio="none"><path class="road__base"/><path class="road__edge"/><path class="road__trail"/><circle class="road__traveler" r="7"/></svg>
      <ol class="road__stations">
        ${content.stations
          .map((s, i) => {
            const st = stateOf(ctx, i);
            const zone = content.zones.find((z) => z.id === s.zone);
            return `<li class="station station--${st}" data-i="${i}" data-zone="${s.zone}">
              <a href="#s-${s.id}">
                <span class="station__dot" aria-hidden="true">${isOpen(st) ? (st === 'done' ? checkIcon : '') : lockIcon}</span>
                <span class="station__label"><small><b>${pad(i + 1)}</b><i> · ${esc(zone.label)}</i></small>${esc(s.title)}</span>
                <span class="station__state">${STATE_LABEL[st]}</span>
              </a></li>`;
          })
          .join('')}
      </ol>
    </div>
  </div>
  <p class="map__note container" data-reveal>Toque em uma etapa para abrir. As etapas se desbloqueiam com as provas — e as avançadas, nas aulas com Natan.</p>
</section>`;

/* ───────────── ETAPAS ───────────── */
function topicCard(t, si, ti, heroKey) {
  const base = `stations.${si}.topics.${ti}`;
  return `<article class="tp" id="t-${t.id}" data-reveal>
    ${t.visual && t.visual !== heroKey ? `<div class="tp__visual">${visual(t.visual)}</div>` : ''}
    <div class="tp__body">
      <h4 class="tp__title"${ed(base + '.title')}>${esc(t.title)}</h4>
      <p class="tp__short"${ed(base + '.short')}>${esc(t.short)}</p>
      ${t.video ? videoButton(t.video, t.title) : ''}
      <span class="tp__video-slot" data-edit-video="${base}.video" data-value="${esc(t.video || '')}"></span>
      <details class="tp__more"><summary>Saiba mais</summary>
        <p${ed(base + '.text')}>${esc(t.text)}</p>
        <p class="tp__practice"><span>Como praticar</span><span${ed(base + '.practice')}>${esc(t.practice)}</span></p>
      </details>
    </div>
  </article>`;
}

function videoButton(url, title) {
  return `<button type="button" class="tp__play" data-video="${esc(url)}" data-track="video">${icon('play')}<span>Assistir ao vídeo</span><span class="sr-only">: ${esc(title)}</span></button>`;
}

function mediaGallery(s, si) {
  const items = (s.media || []).filter((m) => m && (m.src || m.video));
  if (!items.length) return '';
  return `<div class="st__media">${items
    .map((m) => (m.video ? `<div class="st__media-item">${videoButton(m.video, m.caption || s.title)}${m.caption ? `<p>${esc(m.caption)}</p>` : ''}</div>` : `<figure class="st__media-item"><img src="${esc(m.src)}" alt="${esc(m.caption || '')}" loading="lazy" style="object-position:${esc(m.pos || '50% 50%')}">${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}</figure>`))
    .join('')}</div>`;
}

const HORIZON_SIGNS = {
  intermediario: ['Som consistente na maior parte da extensão', 'Escalas e arpejos em construção', 'Köhler e Andersen (op. 33, op. 41)', 'Primeiras sonatas e peças de concerto'],
  avancado: ['Escalas e arpejos em todas as tonalidades', 'Andersen op. 15 / op. 60, Karg-Elert, Boehm', 'Concertos de Mozart, repertório francês e do século XX', 'Capacidade de planejar o próprio estudo'],
  performance: ['Experiência regular de palco', 'Excertos orquestrais e audições', 'Música de câmara', 'Rotina pensada para picos de performance'],
  formacao: ['Voz artística própria', 'Conhecimento histórico e estilístico', 'Capacidade de ensinar', 'Curiosidade permanente'],
};
const HORIZON_TEXT = {
  intermediario: 'O som já é estável nos três registros e os estudos começam a soar como música. É o momento de unir técnica e interpretação.',
  avancado: 'Técnica ampla e confiável, recursos como duplo e triplo golpe e vibrato controlados, e repertório exigente. As escolhas interpretativas ganham autonomia.',
  performance: 'Tocar para outras pessoas: recitais, música de câmara, orquestra, audições. A performance pede preparação específica.',
  formacao: 'Uma formação que vai além do instrumento: história, análise, estilo, pedagogia e uma voz própria. Um caminho que não termina.',
};

function lockedBody(st, s, ctx) {
  const msg = {
    guest: ['Crie sua conta gratuita para começar a jornada.', 'Faça a prova de nivelamento e desbloqueie as etapas no seu ritmo.', `<button class="btn btn--gold" type="button" data-start-journey data-track="lock-cadastro">Criar minha conta ${icon('arrow')}</button>`],
    prev: ['Conclua a prova da etapa anterior para desbloquear.', 'Cada etapa tem uma prova rápida: 5 perguntas, 15 segundos cada.', `<a class="btn btn--ghost" href="#s-${content.stations[Math.max(0, ctx.current)].id}">Ir para a etapa atual ${icon('arrow')}</a>`],
    premium: ['Esta etapa é desbloqueada nas aulas com Natan Schneider.', 'Daqui em diante, a jornada continua com acompanhamento individual.', `<a class="btn btn--gold" href="#aulas" data-track="lock-aulas">Quero desbloquear com aulas ${icon('arrow')}</a>`],
  }[st];
  return `<div class="st__locked">
    <div class="st__skeleton" aria-hidden="true">${'<span></span>'.repeat(6)}</div>
    <div class="st__lock">${lockIcon}<p class="st__lock-title">${msg[0]}</p><p>${msg[1]}</p>${msg[2]}</div>
  </div>`;
}

function stationBlock(s, i, ctx) {
  const st = stateOf(ctx, i);
  const open = isOpen(st);
  const zone = content.zones.find((z) => z.id === s.zone);
  const base = `stations.${i}`;
  return `
<section class="st st--${st}" id="s-${s.id}" data-station="${s.id}" data-i="${i}" aria-labelledby="s-${s.id}-t">
  <header class="st__head" data-reveal>
    <span class="st__n" aria-hidden="true">${pad(i + 1)}</span>
    <div class="st__titles">
      <p class="eyebrow">${esc(zone.label)}</p>
      <h3 id="s-${s.id}-t" class="st__title display"${ed(base + '.title')}>${esc(s.title)}</h3>
      <p class="st__phrase"${ed(base + '.phrase')}>${esc(s.phrase)}</p>
    </div>
    <span class="st__badge st__badge--${st}">${open ? (st === 'done' ? checkIcon : '') : lockIcon}${STATE_LABEL[st]}</span>
  </header>
  ${open
    ? `<div class="st__content">
        <div class="st__hero" data-reveal data-edit-hero="${base}.hero">${s.hero?.src ? heroVisual(s.hero) : heroVisual(s.hero)}</div>
        ${s.horizon ? `<div class="st__horizon" data-reveal><p${ed(base + '.horizonText')}>${esc(s.horizonText || HORIZON_TEXT[s.horizon])}</p><ul class="checks">${HORIZON_SIGNS[s.horizon].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        ${s.topics.length ? `<div class="st__topics">${s.topics.map((t, ti) => topicCard(t, i, ti, s.hero?.kind === 'staff' ? 'staff:' + s.hero.id : s.hero?.kind)).join('')}</div>` : ''}
        ${mediaGallery(s, i)}
        <div class="st__add" data-edit-media="${base}.media" data-value="${esc(JSON.stringify(s.media || []))}"></div>
        <footer class="st__foot" data-reveal>
          ${st === 'done' ? `<p class="st__done">${checkIcon} Prova concluída</p>` : ''}
          <button class="btn ${st === 'done' ? 'btn--ghost' : 'btn--gold'}" type="button" data-quiz-start="${s.id}" data-track="quiz-${s.id}">${st === 'done' ? 'Refazer a prova' : 'Fazer a prova desta etapa'} <small>${QUIZ_RULES.perStation} perguntas · ${QUIZ_RULES.secondsPerQuestion} s cada</small></button>
        </footer>
      </div>`
    : lockedBody(st, s, ctx)}
</section>`;
}

const journeySection = (ctx) => `
<section id="jornada" class="journey" data-chapter="jornada" data-tone="ink" aria-labelledby="jornada-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">As etapas da jornada</p>
    <h2 id="jornada-title" class="display">Um passo de cada vez.</h2>
    <p class="lead">Cada etapa traz o essencial, com imagens e exemplos. Ao final, uma prova rápida desbloqueia a próxima.</p>
    <div class="journey__me" data-journey-me></div>
  </header>
  <div class="container">${content.stations.map((s, i) => stationBlock(s, i, ctx)).join('')}</div>
</section>`;

/* ───────────── GRANDES NOMES ───────────── */
function pedCard(p, idx) {
  const base = `pedagogues.${idx}`;
  return `<details class="ped" id="p-${p.slug}" data-reveal>
    <summary>
      <span class="ped__mono" aria-hidden="true">${esc(initials(p.name))}</span>
      <span class="ped__txt"><strong${ed(base + '.name')}>${esc(p.name)}</strong><small>${esc(p.years)} · ${esc(p.nationality)}</small><em${ed(base + '.tagline')}>${esc(p.tagline)}</em></span>
      <span class="mcard__toggle" aria-hidden="true">${icon('plus')}</span>
    </summary>
    <div class="ped__body">
      <ul class="roles">${p.roles.map((r) => `<li>${ROLE_LABELS[r]}</li>`).join('')}</ul>
      <p${ed(base + '.bio')}>${esc(p.bio)}</p>
      <p class="ped__imp"${ed(base + '.importance')}>${esc(p.importance)}</p>
      <div class="ped__work">
        <p class="eyebrow">A obra</p>
        <p class="ped__work-title">${esc(p.work.title)}</p>
        <dl class="facts facts--2">
          <div><dt>Objetivo</dt><dd>${esc(p.work.objective)}</dd></div>
          <div><dt>Como usar</dt><dd>${esc(p.work.how)}</dd></div>
          <div><dt>Para quem</dt><dd>${esc(p.work.forWhom)}</dd></div>
          <div><dt>Erros comuns</dt><dd>${esc(p.work.mistakes)}</dd></div>
        </dl>
      </div>
      <p class="ped__journey"><strong>Na sua jornada:</strong> ${esc(p.journey)}</p>
      ${p.note ? `<p class="note"><strong>Nota histórica.</strong> ${esc(p.note)}</p>` : ''}
      ${sourcesHTML(p.sources)}
      <a class="link-more" href="guia/pedagogos/${p.slug}.html">Página completa ${icon('arrow')}</a>
    </div>
  </details>`;
}
const pedagoguesSection = () => `
<section id="pedagogos" class="chapter" data-chapter="pedagogos" data-tone="sepia" aria-labelledby="pedagogos-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Paradas históricas</p>
    <h2 id="pedagogos-title" class="display">Quem percorreu<br><em>o caminho antes de você.</em></h2>
    <p class="lead">Inventores, pedagogos e intérpretes que construíram a tradição da flauta. Toque em um nome para conhecer a história e a obra.</p>
  </header>
  <div class="container peds">${content.pedagogues.map(pedCard).join('')}</div>
</section>`;

/* ───────────── HISTÓRIA (passos horizontais) ───────────── */
const historySection = () => `
<section id="historia" class="chapter history" data-chapter="historia" data-tone="sepia" aria-labelledby="historia-title">
  <div class="scene hs" data-scene data-hook="hscroll" data-steps="auto">
    <div class="stage hs__stage">
      <header class="hs__head">
        <p class="eyebrow">A jornada histórica</p>
        <h2 id="historia-title" class="display">Você está entrando<br><em>em uma tradição.</em></h2>
      </header>
      <div class="hs__viewport">
        <ol class="hs__track timeline" data-track>
          ${content.history.map((h, i) => `<li class="tcard"><span class="tcard__era"${ed(`history.${i}.era`)}>${esc(h.era)}</span><span class="tcard__dot" aria-hidden="true"></span><h3${ed(`history.${i}.title`)}>${esc(h.title)}</h3><p${ed(`history.${i}.text`)}>${esc(h.text)}</p>${h.stop ? `<a class="link-more" href="#p-${h.stop}" data-open>Parada histórica ${icon('arrow')}</a>` : ''}</li>`).join('')}
        </ol>
      </div>
      <div class="hs__bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
  <div class="container">${sourcesHTML([...new Set(content.history.map((h) => h.source))], 'Fontes da jornada histórica')}</div>
</section>`;

/* ───────────── PILARES ───────────── */
const pillarsSection = () => `
<section id="pilares" class="chapter" data-chapter="pilares" data-tone="deep" aria-labelledby="pilares-title">
  <header class="section-head container section-head--center" data-reveal>
    <p class="eyebrow eyebrow--center">Os pilares do flautista</p>
    <h2 id="pilares-title" class="display">Oito pilares sustentam<br><em>todo o caminho.</em></h2>
  </header>
  <div class="colonnade container" data-reveal aria-hidden="true">
    ${content.pillars.map((p, i) => `<div class="col" style="--i:${i}"><span class="col__cap"></span><span class="col__shaft"></span><span class="col__name">${esc(p.title)}</span></div>`).join('')}
  </div>
  <div class="container pillars" data-tabs>
    <div class="tabs" role="tablist" aria-label="Pilares">
      ${content.pillars.map((p, i) => `<button role="tab" id="tab-pl-${p.id}" aria-controls="pl-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${pad(i + 1)} · ${esc(p.title)}</button>`).join('')}
    </div>
    ${content.pillars.map((p, i) => `<div class="tabpanel pillar" role="tabpanel" id="pl-${p.id}" aria-labelledby="tab-pl-${p.id}"${i ? ' hidden' : ''}><h3 class="display">${esc(p.title)} <em>— ${esc(p.short)}</em></h3>${pillarBody(p)}<a class="link-more" href="guia/pilares/${p.id}.html">Guia completo ${icon('arrow')}</a></div>`).join('')}
  </div>
</section>`;

/* ───────────── MÉTODOS e REPERTÓRIO ───────────── */
const chips = (name, map, label) => `
<div class="filter" role="group" aria-label="${label}" data-filter="${name}">
  <span class="filter__label">${label}</span>
  <button type="button" aria-pressed="true" data-value="">Todos</button>
  ${Object.entries(map).map(([k, v]) => `<button type="button" aria-pressed="false" data-value="${k}">${esc(v)}</button>`).join('')}
</div>`;

const methodsSection = () => `
<section id="metodos" class="chapter" data-chapter="metodos" data-tone="ink" aria-labelledby="metodos-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Biblioteca de métodos</p>
    <h2 id="metodos-title" class="display">Cada método é uma ferramenta.<br><em>Nenhum é obrigatório.</em></h2>
  </header>
  <div class="container" data-filterable="mcard">
    <div class="filters">${chips('level', LEVELS, 'Nível')}${chips('focus', FOCUS, 'Foco')}</div>
    <div class="mgrid">${content.methods.map((m) => methodCard(m)).join('')}</div>
    <p class="empty" hidden>Nenhum método com esses filtros.</p>
  </div>
</section>`;

const repSection = () => `
<section id="repertorio" class="chapter" data-chapter="repertorio" data-tone="dusk" aria-labelledby="repertorio-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Repertório</p>
    <h2 id="repertorio-title" class="display">Seus dedos já conhecem as notas.<br><em>Agora é hora de fazer música.</em></h2>
  </header>
  <div class="container" data-filterable="rcard">
    <div class="filters">${chips('level', REP_LEVELS, 'Nível')}${chips('period', PERIODS, 'Período')}</div>
    <div class="rgrid">${content.repertoire.map(repCard).join('')}</div>
    <p class="empty" hidden>Nenhuma obra com esses filtros.</p>
    <p class="note">Este site não disponibiliza partituras. Para obras em domínio público, consulte acervos como o <a href="https://imslp.org/" target="_blank" rel="noopener">IMSLP</a>; para obras protegidas, use edições autorizadas.</p>
  </div>
</section>`;

/* ───────────── COMO ESTUDAR ───────────── */
const TECH_ICONS = {
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  turtle: '<path d="M4 15c0-4 3.6-7 8-7s8 3 8 7H4Z"/><path d="M20 13h2M6 15v3M18 15v3"/>',
  ladder: '<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  blocks: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  reverse: '<path d="M20 12H5M10 6l-6 6 6 6"/>',
  rhythm: '<circle cx="7" cy="17" r="3"/><circle cx="17" cy="15" r="3"/><path d="M10 17V5l10-2v12"/>',
  shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  mind: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
};
const studySection = () => `
<section id="como-estudar" class="chapter" data-chapter="como-estudar" data-tone="deep" aria-labelledby="estudar-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Como estudar</p>
    <h2 id="estudar-title" class="display">Estudar mais não significa<br><em>estudar melhor.</em></h2>
    <p class="lead">Técnicas que aumentam a qualidade do estudo — e um cronômetro de ciclos para usar agora.</p>
  </header>
  <div class="container study">
    <ul class="techs">
      ${content.studyTechniques.map((t, i) => `<li class="tech" data-reveal style="--i:${i % 4}"><details><summary><svg class="tech__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TECH_ICONS[t.icon] || ''}</svg><strong${ed(`studyTechniques.${i}.title`)}>${esc(t.title)}</strong><span${ed(`studyTechniques.${i}.short`)}>${esc(t.short)}</span></summary><p${ed(`studyTechniques.${i}.how`)}>${esc(t.how)}</p></details></li>`).join('')}
    </ul>
    <div class="timer" data-timer data-reveal>
      <p class="eyebrow">Cronômetro de estudo</p>
      <div class="timer__ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="timer__fill" cx="60" cy="60" r="52"/></svg><div class="timer__read"><strong data-timer-time>25:00</strong><span data-timer-phase>Estudo</span></div></div>
      <div class="timer__cfg">
        <label>Estudo <select data-timer-work><option value="15">15 min</option><option value="25" selected>25 min</option><option value="45">45 min</option></select></label>
        <label>Pausa <select data-timer-rest><option value="3">3 min</option><option value="5" selected>5 min</option><option value="10">10 min</option></select></label>
      </div>
      <div class="timer__btns"><button class="btn btn--gold" type="button" data-timer-toggle>Iniciar</button><button class="btn btn--text" type="button" data-timer-reset>Zerar</button></div>
      <p class="timer__count" data-timer-count>Ciclos concluídos: 0</p>
    </div>
  </div>
  <div class="duo container">
    <figure data-reveal>${mediaImg('studyA', '(min-width: 700px) 45vw, 92vw')}<figcaption${ed('media.studyA.caption')}>${esc(content.media.studyA.caption || '')}</figcaption></figure>
    <figure data-reveal>${mediaImg('studyB', '(min-width: 700px) 45vw, 92vw')}<figcaption${ed('media.studyB.caption')}>${esc(content.media.studyB.caption || '')}</figcaption></figure>
  </div>
  <div class="container routines" data-tabs>
    <h3 class="display routines__title">Rotinas exemplificativas</h3>
    <div class="tabs tabs--pills" role="tablist" aria-label="Duração da rotina">
      ${content.routines.map((r, i) => `<button role="tab" id="tab-rt-${r.minutes}" aria-controls="rt-${r.minutes}" aria-selected="${i === 1}" tabindex="${i === 1 ? 0 : -1}">${r.minutes} min</button>`).join('')}
    </div>
    ${content.routines.map((r, i) => `<div class="tabpanel routine" role="tabpanel" id="rt-${r.minutes}" aria-labelledby="tab-rt-${r.minutes}"${i === 1 ? '' : ' hidden'}>
        <p class="routine__sub"><strong>${esc(r.title)}</strong> — ${esc(r.subtitle)}</p>
        <div class="routine__bar" aria-hidden="true">${r.blocks.map(([m, , t]) => `<span class="rb rb--${t}" style="flex:${m}"></span>`).join('')}</div>
        <ol class="routine__list">${r.blocks.map(([m, a, t]) => `<li><span class="rb-dot rb--${t}"></span><strong>${m} min</strong> ${esc(a)} <em>${ROUTINE_LABELS[t]}</em></li>`).join('')}</ol>
      </div>`).join('')}
  </div>
  <ol class="principles container">
    ${content.principles.map((p, i) => `<li class="principle" data-reveal style="--i:${i % 4}"><span>${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}
  </ol>
</section>`;

/* ───────────── COMO ESTUDAR UMA MÚSICA ───────────── */
const musicSection = () => `
<section id="estudar-musica" class="chapter" data-chapter="estudar-musica" data-tone="ink" aria-labelledby="musica-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Como estudar uma música</p>
    <h2 id="musica-title" class="display">Do primeiro contato<br><em>ao palco.</em></h2>
  </header>
  <ol class="msteps container">
    ${content.musicSteps.map((s, i) => `<li class="mstep" data-reveal style="--i:${i % 5}"><span class="mstep__n">${pad(i + 1)}</span><h3${ed(`musicSteps.${i}.title`)}>${esc(s.title)}</h3><p${ed(`musicSteps.${i}.text`)}>${esc(s.text)}</p></li>`).join('')}
  </ol>
</section>`;

/* ───────────── PROBLEMAS, FERRAMENTAS, PROFESSOR ───────────── */
const problemsSection = () => `
<section id="problemas" class="chapter" data-chapter="problemas" data-tone="dusk" aria-labelledby="problemas-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Problemas comuns</p>
    <h2 id="problemas-title" class="display">Todo flautista já disse<br><em>uma destas frases.</em></h2>
  </header>
  <div class="container problems">
    ${content.problems.map((p) => `<details class="problem" id="pr-${p.id}" data-reveal><summary><span class="problem__q">“${esc(p.title.replace(/\.$/, ''))}”</span><span class="mcard__toggle" aria-hidden="true">${icon('plus')}</span></summary>${problemBody(p)}<a class="link-more" href="guia/problemas/${p.id}.html">Abrir guia completo ${icon('arrow')}</a></details>`).join('')}
  </div>
</section>`;

const toolsSection = () => `
<section id="ferramentas" class="chapter" data-chapter="ferramentas" data-tone="ink" aria-labelledby="ferramentas-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Tecnologia</p>
    <h2 id="ferramentas-title" class="display">Ferramentas do flautista</h2>
    <p class="lead">Aplicativos mudam rápido: verifique disponibilidade, preços e recursos atuais antes de escolher.</p>
  </header>
  <ul class="tools container">${content.tools.map((t, i) => `<li class="tool" data-reveal style="--i:${i % 4}"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p><p class="tool__ex">${esc(t.examples)}</p></li>`).join('')}</ul>
</section>`;

const teacherSection = () => `
<section id="professor" class="chapter" data-chapter="professor" data-tone="deep" aria-labelledby="professor-title">
  <h2 id="professor-title" class="sr-only">A importância do professor</h2>
  <blockquote class="bridge bridge--big container"><p class="display" data-words${ed('teacher.philosophy')}>${esc(content.teacher.philosophy)}</p></blockquote>
  <ul class="tpoints container">${content.teacherPoints.map((t, i) => `<li data-reveal style="--i:${i % 4}"><span>${pad(i + 1)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join('')}</ul>
</section>`;

/* ───────────── TRILHAS, CHECKLIST, SEMINÁRIO ───────────── */
const goalsSection = () => `
<section id="trilhas" class="chapter" data-chapter="trilhas" data-tone="dusk" aria-labelledby="trilhas-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Trilhas de objetivo</p>
    <h2 id="trilhas-title" class="display">Escolha seu destino.<br><em>O caminho se desenha.</em></h2>
  </header>
  <div class="container goals" data-tabs>
    <div class="tabs tabs--pills tabs--wrap" role="tablist" aria-label="Objetivos">
      ${content.goals.map((g, i) => `<button role="tab" id="tab-g-${g.id}" aria-controls="g-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g.title)}</button>`).join('')}
    </div>
    ${content.goals.map((g, i) => `<div class="tabpanel goal" role="tabpanel" id="g-${g.id}" aria-labelledby="tab-g-${g.id}"${i ? ' hidden' : ''}><ol class="goal__path">${g.path.map((s, j) => `<li style="--i:${j}"><span>${pad(j + 1)}</span>${esc(s)}</li>`).join('')}</ol><p class="goal__focus"><strong>Foco:</strong> ${esc(g.focus)}</p><a class="btn btn--ghost" href="#aulas" data-goal="${esc(g.title)}" data-track="trilha-${g.id}">Quero um plano para este objetivo ${icon('arrow')}</a></div>`).join('')}
  </div>
</section>`;

const checklistSection = () => {
  let n = 0;
  return `
<section id="checklist" class="chapter" data-chapter="checklist" data-tone="deep" aria-labelledby="checklist-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Checklist</p>
    <h2 id="checklist-title" class="display">O que você já construiu.</h2>
  </header>
  <div class="container checklist" data-checklist>
    <div class="ring" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="ring__fill" cx="60" cy="60" r="52"/></svg><span data-ring-label>0%</span></div>
    <p class="sr-only" aria-live="polite" data-ring-sr></p>
    <div class="checklist__groups">
      ${content.checklist.map((g) => `<fieldset><legend>${esc(g.group)}</legend>${g.items.map((it) => { const id = `ck-${n++}`; return `<label class="check" for="${id}"><input type="checkbox" id="${id}" data-key="${esc(it)}"><span class="check__box" aria-hidden="true">${icon('check')}</span>${esc(it)}</label>`; }).join('')}</fieldset>`).join('')}
    </div>
    <button type="button" class="btn btn--text" data-checklist-reset>Recomeçar checklist</button>
  </div>
</section>`;
};

const typeIcon = { video: 'play', pdf: 'file', exercicio: 'note', link: 'link', material: 'book', anotacao: 'pencil', extra: 'star' };
const typeLabel = { video: 'Vídeo', pdf: 'PDF', exercicio: 'Exercício', link: 'Link', material: 'Material', anotacao: 'Anotações', extra: 'Extra' };
const seminarSection = () => `
<section id="seminario" class="chapter seminar" data-chapter="seminario" data-tone="night" aria-labelledby="seminario-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Material complementar</p>
    <h2 id="seminario-title" class="display">Seminário de Flauta</h2>
    <p class="lead">Tudo o que foi apresentado no seminário está disponível aqui para você continuar estudando.</p>
  </header>
  <div class="container">
    ${content.seminars.map((s, si) => `<article class="seminar__card" data-reveal>
        <figure class="seminar__photo">${mediaImg('seminar', '(min-width: 900px) 30vw, 92vw')}</figure>
        <header><h3${ed(`seminars.${si}.title`)}>${esc(s.title)}</h3>${s.date ? `<p class="seminar__date">${esc(s.date)}</p>` : ''}<p${ed(`seminars.${si}.description`)}>${esc(s.description)}</p></header>
        <ul class="materials">
          ${s.materials.map((m, mi) => {
            const soon = !m.url;
            const ext = m.url && /^https?:/.test(m.url);
            const inner = `${icon(typeIcon[m.type] || 'link')}<span><small>${typeLabel[m.type] || 'Material'}${soon ? ' · em breve' : ''}</small><strong${ed(`seminars.${si}.materials.${mi}.title`)}>${esc(m.title)}</strong><em>${esc(m.description)}</em></span>`;
            return `<li data-edit-link="seminars.${si}.materials.${mi}.url" data-value="${esc(m.url || '')}">${soon ? `<div class="material is-soon">${inner}</div>` : `<a class="material" href="${esc(m.url)}"${ext ? ' target="_blank" rel="noopener"' : ''} data-track="seminario">${inner}</a>`}</li>`;
          }).join('')}
        </ul>
      </article>`).join('')}
  </div>
</section>`;

/* ───────────── NATAN ───────────── */
const aboutSection = () => {
  const t = content.teacher;
  return `
<section id="schneider" class="chapter about" data-chapter="schneider" data-tone="deep" aria-labelledby="schneider-title">
  <div class="container about__grid">
    <div class="about__media" data-reveal><figure class="portrait">${mediaImg('aboutPortrait', '(min-width: 860px) 440px, 92vw', `${t.name} tocando flauta transversal`)}</figure></div>
    <div data-reveal>
      <p class="eyebrow">Idealizador e professor</p>
      <h2 id="schneider-title" class="display"${ed('teacher.name')}>${esc(t.name)}</h2>
      <p class="about__role"${ed('teacher.role')}>${esc(t.role)}</p>
      <p class="lead"${ed('teacher.intro')}>${esc(t.intro)}</p>
      <dl class="facts">
        ${t.experience.map((e, i) => `<div class="${e.placeholder ? 'is-placeholder' : ''}"><dt${ed(`teacher.experience.${i}.label`)}>${esc(e.label)}</dt><dd${ed(`teacher.experience.${i}.text`)}>${esc(e.text)}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
  <div class="container">
    <ul class="moments" aria-label="Momentos da jornada">
      ${['moment1', 'moment2', 'moment3', 'moment4'].map((k) => `<li data-reveal><figure>${mediaImg(k, '(min-width: 900px) 24vw, 46vw')}<figcaption${ed(`media.${k}.caption`)}>${esc(content.media[k].caption || '')}</figcaption></figure></li>`).join('')}
    </ul>
    <h3 class="display about__h">Metodologia</h3>
    <ol class="method-steps">
      ${t.methodology.map((m, i) => `<li data-reveal style="--i:${i}"><span>${pad(i + 1)}</span><h4${ed(`teacher.methodology.${i}.title`)}>${esc(m.title)}</h4><p${ed(`teacher.methodology.${i}.text`)}>${esc(m.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>`;
};

/* ───────────── FILOSOFIA (passos) ───────────── */
const finale = ['Descubra onde você está.', 'Entenda o que veio antes.', 'Conheça quem construiu essa tradição.', 'Escolha seu próximo passo.', 'Continue caminhando.'];
const philosophySection = () => {
  const n = content.philosophy.length + 1;
  return `
<section id="filosofia" class="scene seq seq--philo" data-scene data-steps="${n}" data-chapter="filosofia" data-tone="night" style="--h:${n * 60 + 40}" aria-labelledby="filosofia-title">
  <div class="stage">
    <div class="seq__bg" aria-hidden="true">${mediaImg('philosophy', '100vw', '')}</div>
    <h2 id="filosofia-title" class="eyebrow eyebrow--center seq__eyebrow">Filosofia</h2>
    <div class="seq__lines">
      ${content.philosophy.map((l, i) => `<p class="seq__line display"${kf(stepKf(i, n, false))}${ed(`philosophy.${i}`)}>${esc(l)}</p>`).join('')}
      <ul class="finale"${kf(stepKf(n - 1, n))}>${finale.map((f, i) => `<li style="--i:${i}">${esc(f)}</li>`).join('')}</ul>
    </div>
    <ol class="seq__dots" aria-hidden="true">${Array.from({ length: n }, () => '<li></li>').join('')}</ol>
  </div>
</section>`;
};

/* ───────────── AULAS ───────────── */
const lessonsSection = () => {
  const L = content.lessons;
  const c = content.contact;
  return `
<section id="aulas" class="chapter lessons" data-chapter="aulas" data-tone="dawn" aria-labelledby="aulas-title">
  <header class="section-head container" data-reveal>
    <p class="eyebrow">Aulas de flauta transversal</p>
    <h2 id="aulas-title" class="display">Continue sua jornada<br><em>com Natan Schneider.</em></h2>
    <p class="lead">Aulas individuais, com planejamento e acompanhamento, para cada ponto do caminho — e o desbloqueio de todas as etapas da jornada.</p>
  </header>
  <ul class="formats container">${L.formats.map((f, i) => `<li data-reveal style="--i:${i % 3}"><h3${ed(`lessons.formats.${i}.title`)}>${esc(f.title)}</h3><p${ed(`lessons.formats.${i}.text`)}>${esc(f.text)}</p></li>`).join('')}</ul>
  <div class="container contact" data-reveal>
    <figure class="contact__photo">${mediaImg('contact', '(min-width: 900px) 34vw, 92vw')}<figcaption${ed('media.contact.caption')}>${esc(content.media.contact.caption || '')}</figcaption></figure>
    <form class="contact__form" data-contact novalidate>
      <h3 class="display">Quero começar minha jornada</h3>
      <p class="contact__note"${ed('lessons.note')}>${esc(L.note)}</p>
      <div class="field"><label for="c-nome">Seu nome</label><input id="c-nome" name="nome" autocomplete="name" required></div>
      <div class="field"><label for="c-nivel">Onde você está na jornada?</label>
        <select id="c-nivel" name="nivel"><option>Ainda não comecei</option><option>Primeiros passos</option><option>Fundamental</option><option>Intermediário</option><option>Avançado</option><option>Não sei — quero descobrir</option></select></div>
      <div class="field"><label for="c-obj">Seu objetivo</label>
        <select id="c-obj" name="objetivo">${content.goals.map((g) => `<option>${esc(g.title)}</option>`).join('')}<option>Outro</option></select></div>
      <div class="field"><label for="c-msg">Mensagem (opcional)</label><textarea id="c-msg" name="mensagem" rows="3"></textarea></div>
      <div class="contact__actions">
        ${c.whatsapp ? `<button class="btn btn--gold" type="submit" data-channel="whatsapp" data-track="form-whatsapp">Enviar pelo WhatsApp ${icon('arrow')}</button>` : ''}
        ${c.email ? `<button class="btn btn--ghost" type="submit" data-channel="email" data-track="form-email">Enviar por e-mail ${icon('arrow')}</button>` : ''}
      </div>
      <p class="contact__status" role="status" data-contact-status></p>
    </form>
  </div>
</section>`;
};

/* ───────────── FONTES e PRIVACIDADE ───────────── */
const sourcesSection = () => `
<section id="fontes" class="chapter refs" data-chapter="fontes" data-tone="night" aria-labelledby="fontes-title">
  <div class="container">
    <p class="eyebrow">Fontes e referências</p>
    <h2 id="fontes-title" class="display">Uma tradição se constrói com fontes.</h2>
    <p class="lead">Nenhuma citação foi atribuída a flautistas sem fonte; quando há incerteza entre autores, isso é indicado no texto.</p>
    <details class="refs__more"><summary>Ver todas as referências</summary>
      <ol class="refs__list">${Object.values(references).map((r) => `<li><span class="tag">${esc(r.kind)}</span> ${esc(r.text)}${r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">${new URL(r.url).hostname}</a>` : ''}</li>`).join('')}</ol>
    </details>
    <details class="refs__more" id="privacidade"><summary>Privacidade e dados</summary>
      <div class="privacy">
        <p>Ao criar uma conta, você informa nome, e-mail, telefone e senha. Esses dados são usados apenas para acompanhar sua jornada (progresso e provas) e para que Natan Schneider possa entrar em contato com você sobre aulas, se você autorizar no cadastro.</p>
        <p>A senha é armazenada de forma criptografada. Para medir o uso do site (visitas, tempo médio e cliques), é usado um identificador anônimo próprio, sem serviços de terceiros.</p>
        <p>Você pode pedir a exclusão da sua conta e dos seus dados a qualquer momento pelo WhatsApp ou pela sua área "Minha jornada".</p>
      </div>
    </details>
  </div>
</section>`;

/* ───────────── MENU FLUTUANTE ───────────── */
const fabMenu = (ctx) => `
<nav class="fab" data-fab aria-label="Navegação rápida">
  <div class="fab__panel" id="fab-panel">
    <p class="fab__here"><small>Você está aqui</small><strong data-here-label>Início</strong></p>
    <div class="fab__cols">
      <div>
        <p class="fab__h">Sua jornada</p>
        <ol class="fab__stations">
          ${content.stations.map((s, i) => { const st = stateOf(ctx, i); return `<li class="fab__st fab__st--${st}"><a href="#s-${s.id}" data-fab-link><span class="fab__n">${isOpen(st) ? (st === 'done' ? '✓' : pad(i + 1)) : lockIcon}</span>${esc(s.title)}</a></li>`; }).join('')}
        </ol>
      </div>
      <div>
        <p class="fab__h">Explorar</p>
        <ul class="fab__sections">${navChapters.map((c) => `<li><a href="#${c.id}" data-fab-link data-sec="${c.id}">${esc(c.label)}</a></li>`).join('')}</ul>
      </div>
    </div>
  </div>
  <button class="fab__btn" type="button" aria-expanded="false" aria-controls="fab-panel" aria-label="Abrir menu da jornada">
    <svg class="fab__ring" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="27"/><circle class="fab__ring-fill" cx="30" cy="30" r="27"/></svg>
    ${markSVG('fab__mark')}
  </button>
</nav>`;

/* ───────────── DIÁLOGOS ───────────── */
const dialogs = () => `
<dialog class="dlg" id="dlg-account" aria-labelledby="acc-title">
  <form method="dialog" class="dlg__close-wrap"><button class="dlg__close" aria-label="Fechar">✕</button></form>
  <div class="dlg__body" data-account-body>
    <div class="acc-tabs" role="tablist">
      <button role="tab" aria-selected="true" data-acc-tab="register">Criar conta</button>
      <button role="tab" aria-selected="false" data-acc-tab="login">Entrar</button>
    </div>
    <form class="acc-form" data-acc-form="register" novalidate>
      <h2 id="acc-title" class="display">Comece sua jornada</h2>
      <p class="acc-sub">Gratuito. Depois do cadastro, uma prova rápida mostra em que etapa você começa.</p>
      <div class="field"><label for="r-name">Nome completo</label><input id="r-name" name="name" autocomplete="name" required maxlength="80"></div>
      <div class="field"><label for="r-email">E-mail</label><input id="r-email" name="email" type="email" autocomplete="email" required maxlength="120"></div>
      <div class="field"><label for="r-phone">WhatsApp (com DDD)</label><input id="r-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(27) 99999-9999" required maxlength="20"></div>
      <div class="field"><label for="r-pass">Senha (mínimo 8 caracteres)</label><input id="r-pass" name="password" type="password" autocomplete="new-password" required minlength="8" maxlength="128"></div>
      <label class="acc-consent"><input type="checkbox" name="consent" required> <span>Concordo com a <a href="#privacidade" data-close-dlg>política de privacidade</a> e autorizo Natan Schneider a entrar em contato comigo pelo WhatsApp ou e-mail sobre aulas.</span></label>
      <button class="btn btn--gold acc-submit" type="submit">Criar conta e fazer a prova ${icon('arrow')}</button>
      <p class="acc-msg" role="alert" data-acc-msg></p>
    </form>
    <form class="acc-form" data-acc-form="login" hidden novalidate>
      <h2 class="display">Bem-vindo de volta</h2>
      <div class="field"><label for="l-email">E-mail</label><input id="l-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="l-pass">Senha</label><input id="l-pass" name="password" type="password" autocomplete="current-password" required></div>
      <button class="btn btn--gold acc-submit" type="submit">Entrar ${icon('arrow')}</button>
      <p class="acc-help">Esqueceu a senha? Fale com Natan pelo WhatsApp para redefinir.</p>
      <p class="acc-msg" role="alert" data-acc-msg></p>
    </form>
  </div>
</dialog>
<dialog class="dlg dlg--wide" id="dlg-play" aria-label="Prova">
  <form method="dialog" class="dlg__close-wrap"><button class="dlg__close" aria-label="Fechar">✕</button></form>
  <div class="dlg__body" data-play-body></div>
</dialog>
<dialog class="dlg dlg--video" id="dlg-video" aria-label="Vídeo">
  <form method="dialog" class="dlg__close-wrap"><button class="dlg__close" aria-label="Fechar">✕</button></form>
  <div class="dlg__video" data-video-body></div>
</dialog>`;

/* ───────────── JSON-LD ───────────── */
function jsonld() {
  const s = content.site;
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'The Flute Journey', url: s.url + '/', inLanguage: 'pt-BR', description: s.description },
    { '@context': 'https://schema.org', '@type': 'Course', name: 'The Flute Journey — aulas de flauta transversal', description: s.description, inLanguage: 'pt-BR', provider: { '@type': 'Person', name: content.teacher.name, url: s.url + '/#schneider' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: content.problems.map((p) => ({ '@type': 'Question', name: p.title, acceptedAnswer: { '@type': 'Answer', text: `Possíveis causas: ${p.causes.join('; ')}. Estratégias: ${p.strategies.join('; ')}.` } })) },
  ];
}

/** ctx: { access:[17 estados], current, isAdmin, isStatic, appUrl } */
export function renderIndex(ctx = guestCtx()) {
  const boot = { contact: content.contact, stations: content.stations.map((s) => ({ id: s.id, title: s.title })), isStatic: !!ctx.isStatic, appUrl: ctx.appUrl || '', quiz: QUIZ_RULES };
  return `${head({
    title: 'The Flute Journey · Aulas e jornada de flauta transversal com Natan Schneider',
    description: content.site.description,
    jsonld: jsonld(),
  })}
<body class="no-js" data-tone="night">
<script>document.body.classList.replace('no-js','js')</script>
<div class="backdrop" aria-hidden="true"><div class="backdrop__glow"></div><div class="backdrop__grain"></div></div>
${topbar()}
<main id="conteudo">
${heroSection()}
${prologue()}
${map(ctx)}
${journeySection(ctx)}
${pedagoguesSection()}
${historySection()}
${pillarsSection()}
${methodsSection()}
${repSection()}
${studySection()}
${musicSection()}
${problemsSection()}
${toolsSection()}
${teacherSection()}
${goalsSection()}
${checklistSection()}
${seminarSection()}
${aboutSection()}
${philosophySection()}
${lessonsSection()}
${sourcesSection()}
</main>
${footer()}
${fabMenu(ctx)}
${dialogs()}
<script type="application/json" id="app-data">${JSON.stringify(boot).replace(/</g, '\\u003c')}</script>
<script src="assets/js/main.js" defer></script>
<script src="assets/js/app.js" defer></script>
${ctx.isAdmin ? '<script src="assets/js/editor.js" defer></script>' : ''}
</body>
</html>`;
}

export function guestCtx(extra = {}) {
  return { access: content.stations.map((_, i) => (i === 0 ? 'open' : 'guest')), current: 0, isAdmin: false, ...extra };
}
