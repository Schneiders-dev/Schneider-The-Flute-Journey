import { site, contact, teacher, lessons, seminars } from '../data/site.mjs';
import { zones, stations, chapters, horizon, history } from '../data/journey.mjs';
import { pedagogueBySlug } from '../data/pedagogues.mjs';
import { methods, LEVELS, FOCUS } from '../data/methods.mjs';
import { repertoire, PERIODS, REP_LEVELS } from '../data/repertoire.mjs';
import { references } from '../data/references.mjs';
import {
  pillars, problems, principles, routines, ROUTINE_LABELS, musicSteps, tools, teacherPoints,
  philosophy, quiz, quizResults, goals, checklist,
} from '../data/practice.mjs';
import { esc, kf, icon, list, photo } from './helpers.mjs';
import {
  fluteSVG, staffSVG, ribbonHTML, stopHTML, methodCard, repCard, problemBody, pillarBody, softCTA, sourcesHTML,
} from './components.mjs';
import { head, topbar, journeyIndex, hereBar, footer } from './layout.mjs';

const pad = (n) => String(n).padStart(2, '0');

// Gera keyframes para uma sequência de frases que se sucedem dentro de uma cena fixa.
function seqKf(i, n, { holdLast = true, start = 0, end = 1 } = {}) {
  const span = (end - start) / n;
  const a = start + i * span;
  const r = (v) => Math.min(1, Math.max(0, +v.toFixed(3)));
  // A primeira frase já está visível quando a cena se fixa (evita uma tela vazia).
  const inn = i === 0 ? `0 o:1 y:0 s:1 b:0` : `${r(a)} o:0 y:5 s:.97 b:6; ${r(a + span * 0.3)} o:1 y:0 s:1 b:0`;
  if (i === n - 1 && holdLast) return `${inn}; 1 o:1 y:0`;
  return `${inn}; ${r(a + span * 0.72)} o:1 y:0 s:1 b:0; ${r(a + span)} o:0 y:-5 s:1.02 b:6`;
}

/* ───────────── HERO ───────────── */
const hero = () => `
<section id="inicio" class="scene hero" data-scene data-chapter="inicio" data-tone="night" style="--h:230" aria-label="Abertura">
  <div class="stage">
    <div class="hero__glow"${kf('0 o:.9 s:1; .6 o:1 s:1.35; 1 o:.4 s:1.6')}></div>
    <div class="hero__staff"${kf('0 y:0 s:1 o:.9; 1 y:-14 s:1.3 o:.35', '0 y:0 s:1.6 o:.9; 1 y:-10 s:2 o:.35')}>${staffSVG()}</div>
    <div class="hero__flute"${kf('0 x:8 y:20 r:-11 o:0 s:.92; .2 o:1; .5 x:-4 y:12 r:-2 s:1.06; .78 o:.9 x:-12 r:0 s:1.16; 1 o:0 x:-26 s:1.2', '0 x:0 y:30 r:-14 o:1 s:1.5; .4 x:-6 y:12 r:-6 s:1.6; .8 o:.9 x:-20 y:12 r:0 s:1.7; 1 o:0 x:-40 s:1.8')}>${fluteSVG()}</div>
    <div class="hero__content"${kf('0 o:1 y:0 s:1 b:0; .32 o:0 y:-6 s:.94 b:10')}>
      <p class="eyebrow eyebrow--center">Uma jornada pela flauta transversal</p>
      <h1 class="hero__title">
        <span class="hero__name">SCHNEIDER</span>
        <span class="hero__sub">The Flute Journey</span>
      </h1>
      <p class="hero__lead">${esc(site.tagline)}</p>
      <div class="hero__ctas">
        <a class="btn btn--gold" href="#prologo">Começar a jornada ${icon('arrow')}</a>
        <a class="btn btn--ghost" href="#nivel">Descubra onde você está</a>
      </div>
    </div>
    <p class="hero__after display"${kf('0 o:0; .42 o:0 y:4 b:8; .62 o:1 y:0 b:0; 1 o:1 y:-3')}>Todo flautista começa<br><em>em algum lugar.</em></p>
    <div class="scroll-cue"${kf('0 o:1; .12 o:0')} aria-hidden="true"><span></span>Role para começar</div>
  </div>
</section>`;

/* ───────────── PRÓLOGO ───────────── */
const prologueLines = [
  ['Antes das grandes obras,', 'existem os primeiros sons.'],
  ['Antes da velocidade,', 'existe o controle.'],
  ['Antes da interpretação,', 'existe a técnica.'],
  ['E antes de tudo isso,', 'existe o desejo de aprender.'],
];
const prologue = () => `
<section id="prologo" class="scene seq" data-scene data-tone="night" data-chapter="inicio" style="--h:${prologueLines.length * 85 + 60}" aria-label="Prólogo">
  <div class="stage">
    <div class="seq__lines">
      ${prologueLines
        .map((l, i) => `<p class="seq__line display${i === prologueLines.length - 1 ? ' seq__line--gold' : ''}"${kf(seqKf(i, prologueLines.length, { end: 0.92 }))}>${esc(l[0])}<br><em>${esc(l[1])}</em></p>`)
        .join('')}
    </div>
    <div class="seq__meter" aria-hidden="true"><span></span></div>
  </div>
</section>`;

/* ───────────── MAPA ───────────── */
const map = () => `
<section id="mapa" class="map" data-chapter="mapa" data-tone="deep" aria-labelledby="mapa-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">O mapa da jornada</p>
    <h2 id="mapa-title" class="display">Um caminho.<br><em>Não uma corrida.</em></h2>
    <p class="lead">Dezessete estações, do primeiro contato à formação artística. Cada flautista percorre partes do caminho em velocidades diferentes — volta a trechos antigos, acelera em outros, faz pausas. Este é um mapa de desenvolvimento, não uma competição.</p>
  </header>
  <ul class="zones container" aria-label="Regiões da jornada" data-view="rise">
    ${zones
      .map((z) => {
        const first = stations.find((s) => s.zone === z.id);
        return `<li><a class="zone" href="${first.href}" data-zone="${z.id}">${icon(z.icon)}<span>${esc(z.label)}</span></a></li>`;
      })
      .join('')}
  </ul>
  <div class="scene road" data-scene data-hook="road" style="--h:330">
    <div class="stage road__stage">
      <div class="road__canvas" data-road>
        <svg class="road__svg" aria-hidden="true" preserveAspectRatio="none">
          <path class="road__base"/><path class="road__edge"/><path class="road__trail"/>
          <circle class="road__traveler" r="7"/>
        </svg>
        <ol class="road__stations">
          ${stations
            .map(
              (s, i) => `<li class="station" data-zone="${s.zone}" data-i="${i}">
              <a href="${s.href}">
                <span class="station__dot" aria-hidden="true"></span>
                <span class="station__label"><small><b>${pad(i + 1)}</b><i> · ${esc(zones.find((z) => z.id === s.zone).label)}</i></small>${esc(s.title)}</span>
                <span class="station__phrase">${esc(s.phrase)}</span>
              </a></li>`
            )
            .join('')}
        </ol>
      </div>
      <div class="road__caption" aria-hidden="true">
        <small data-road-meta>Estação 01</small>
        <p data-road-phrase>${esc(stations[0].phrase)}</p>
      </div>
    </div>
  </div>
  <p class="map__note container" data-view="rise">Toque em qualquer estação para abrir a etapa correspondente.</p>
</section>`;

/* ───────────── CAPÍTULOS ───────────── */
const tones = { 'primeiros-passos': 'dawn', fundamentos: 'deep', tecnica: 'ink', musical: 'dusk' };
const chapterPhotos = { 'primeiros-passos': 3, fundamentos: 1, tecnica: 16, musical: 8 };

const chapter = (c) => `
<section id="${c.id}" class="chapter" data-chapter="${c.id}" data-tone="${tones[c.id]}" aria-labelledby="${c.id}-title">
  <div class="scene chapter__intro has-photo" data-scene style="--h:190">
    <div class="stage">
      <figure class="chapter__photo"${kf('0 o:.85 y:6 s:1.06; .45 o:1 y:0 s:1; .82 o:1 s:1; 1 o:0 y:-4 s:.96', '0 o:.3 s:1.12; .5 o:.34 s:1.04; .85 o:.3; 1 o:0 s:1')}>${photo(chapterPhotos[c.id], { sizes: '(min-width: 900px) 32vw, 100vw' })}</figure>
      <span class="chapter__num" aria-hidden="true"${kf('0 o:.35 s:1.35 b:6; .4 o:1 s:1 b:0; .8 o:1 s:.96; 1 o:0 s:.9 y:-6', '0 o:.35 s:1.25; .4 o:1 s:1; 1 o:0 y:-6')}>${c.number}</span>
      <div class="chapter__introtext"${kf('0 o:1 x:0 s:1 b:0; .8 o:1 x:0 s:1 b:0; 1 o:0 x:-8 s:.94 b:6', '0 o:1 y:0; .82 o:1 y:0; 1 o:0 y:-8')}>
        <p class="eyebrow">Capítulo ${c.number} · ${esc(c.kicker)}</p>
        <h2 id="${c.id}-title" class="chapter__title display">${esc(c.title)}</h2>
        <p class="chapter__lead">${esc(c.lead)}</p>
        <div class="chapter__ribbon">${ribbonHTML(c.ribbonIndex)}</div>
      </div>
    </div>
  </div>
  <div class="chapter__body container">
    <aside class="chapter__aside">
      <div class="chapter__aside-inner">
        <p class="eyebrow">${esc(c.kicker)}</p>
        <ol class="toc">${c.topics.map((t) => `<li><a href="#t-${t.id}">${esc(t.title)}</a></li>`).join('')}</ol>
      </div>
    </aside>
    <div class="topics">
      ${c.topics
        .map(
          (t, i) => `<article class="topic" id="t-${t.id}" data-view="rise">
          <span class="topic__n" aria-hidden="true">${pad(i + 1)}</span>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.text)}</p>
          <p class="topic__practice"><span>Como praticar</span>${esc(t.practice)}</p>
        </article>`
        )
        .join('')}
    </div>
  </div>
  ${c.stops.length ? `<div class="stops container">${c.stops.map((s) => stopHTML(pedagogueBySlug[s])).join('')}</div>` : ''}
  <blockquote class="bridge container"><p class="display" data-words>${esc(c.bridge)}</p></blockquote>
  ${softCTA(
    { 'primeiros-passos': 'Está com dificuldade nesta etapa?', fundamentos: 'Quer descobrir como aplicar isso ao seu estudo?', tecnica: 'Quer um plano personalizado?', musical: 'Quer acompanhamento individual?' }[c.id],
    'Um olhar atento no começo evita anos de correções depois.'
  )}
</section>`;

/* ───────────── HORIZONTE ───────────── */
const horizonPhotos = [13, 9, 10, 18];
const horizonSection = () => `
<section id="horizonte" class="chapter" data-chapter="horizonte" data-tone="ink" aria-labelledby="horizonte-title">
  <div class="scene hs" data-scene data-hook="hscroll">
    <div class="stage hs__stage">
      <header class="hs__head">
        <p class="eyebrow">Capítulo 05 · Horizonte</p>
        <h2 id="horizonte-title" class="display">O caminho continua.</h2>
        ${ribbonHTML(4)}
      </header>
      <div class="hs__viewport">
        <div class="hs__track" data-track>
          ${horizon
            .map(
              (h, i) => `<article class="hpanel" id="h-${h.id}">
              <figure class="hpanel__photo">${photo(horizonPhotos[i], { sizes: '(min-width: 700px) 520px, 84vw' })}</figure>
              <span class="hpanel__n">${pad(14 + i)}</span>
              <h3 class="display">${esc(h.title)}</h3>
              <p>${esc(h.text)}</p>
              <p class="eyebrow">Sinais desta etapa</p>
              ${list(h.signs, 'checks')}
            </article>`
            )
            .join('')}
          <article class="hpanel hpanel--end"><p class="display">Não existe linha de chegada.<br><em>Existe caminho.</em></p></article>
        </div>
      </div>
      <div class="hs__bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
  <div class="stops container">${['rampal', 'galway'].map((s) => stopHTML(pedagogueBySlug[s])).join('')}</div>
</section>`;

/* ───────────── HISTÓRIA ───────────── */
const historySection = () => `
<section id="historia" class="chapter history" data-chapter="historia" data-tone="sepia" aria-labelledby="historia-title">
  <div class="scene hs" data-scene data-hook="hscroll">
    <div class="stage hs__stage">
      <header class="hs__head">
        <p class="eyebrow">A jornada histórica</p>
        <h2 id="historia-title" class="display">Você não está apenas aprendendo um instrumento.<br><em>Está entrando em uma tradição.</em></h2>
      </header>
      <div class="hs__viewport">
        <ol class="hs__track timeline" data-track>
          ${history
            .map(
              (h, i) => `<li class="tcard">
              <span class="tcard__era">${esc(h.era)}</span>
              <span class="tcard__dot" aria-hidden="true"></span>
              <h3>${esc(h.title)}</h3>
              <p>${esc(h.text)}</p>
              ${h.stop ? `<a class="link-more" href="#p-${h.stop}">Parada histórica ${icon('arrow')}</a>` : ''}
            </li>`
            )
            .join('')}
        </ol>
      </div>
      <div class="hs__bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
  <div class="stops container">${stopHTML(pedagogueBySlug.boehm)}</div>
  <div class="container">${sourcesHTML([...new Set(history.map((h) => h.source))], 'Fontes da jornada histórica')}</div>
</section>`;

/* ───────────── PILARES ───────────── */
const pillarsSection = () => `
<section id="pilares" class="chapter" data-chapter="pilares" data-tone="deep" aria-labelledby="pilares-title">
  <div class="scene colonnade-scene" data-scene style="--h:200">
    <div class="stage">
      <div class="colonnade__head"${kf('0 o:1 y:0; .85 o:1; 1 o:0 y:-6')}>
        <p class="eyebrow eyebrow--center">Os pilares do flautista</p>
        <h2 id="pilares-title" class="display">Oito pilares sustentam<br><em>todo o caminho.</em></h2>
      </div>
      <div class="colonnade" aria-hidden="true">
        ${pillars
          .map(
            (p, i) => `<div class="col"${kf(`0 o:0 y:30; ${(0.1 + i * 0.05).toFixed(2)} o:0 y:30; ${(0.32 + i * 0.05).toFixed(2)} o:1 y:0; .88 o:1 y:0; 1 o:0 y:-10`)}><span class="col__cap"></span><span class="col__shaft"></span><span class="col__name">${esc(p.title)}</span></div>`
          )
          .join('')}
      </div>
    </div>
  </div>
  <div class="container pillars" data-tabs>
    <div class="tabs" role="tablist" aria-label="Pilares">
      ${pillars.map((p, i) => `<button role="tab" id="tab-pl-${p.id}" aria-controls="pl-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${pad(i + 1)} · ${esc(p.title)}</button>`).join('')}
    </div>
    ${pillars
      .map(
        (p, i) => `<div class="tabpanel pillar" role="tabpanel" id="pl-${p.id}" aria-labelledby="tab-pl-${p.id}"${i ? ' hidden' : ''}>
        <h3 class="display">${esc(p.title)} <em>— ${esc(p.short)}</em></h3>
        ${pillarBody(p)}
        <a class="link-more" href="guia/pilares/${p.id}.html">Guia completo: ${esc(p.title)} ${icon('arrow')}</a>
      </div>`
      )
      .join('')}
  </div>
</section>`;

/* ───────────── MÉTODOS ───────────── */
const chips = (name, map, label) => `
<div class="filter" role="group" aria-label="${label}" data-filter="${name}">
  <span class="filter__label">${label}</span>
  <button type="button" aria-pressed="true" data-value="">Todos</button>
  ${Object.entries(map).map(([k, v]) => `<button type="button" aria-pressed="false" data-value="${k}">${esc(v)}</button>`).join('')}
</div>`;

const methodsSection = () => `
<section id="metodos" class="chapter" data-chapter="metodos" data-tone="ink" aria-labelledby="metodos-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Biblioteca de métodos</p>
    <h2 id="metodos-title" class="display">Cada método é uma ferramenta.<br><em>Nenhum é obrigatório.</em></h2>
    <p class="lead">Métodos, estudos e livros que fazem parte da formação de muitos flautistas. Use os filtros para encontrar o que faz sentido para o seu momento — e converse com seu professor antes de escolher.</p>
  </header>
  <div class="container" data-filterable="mcard">
    <div class="filters">
      ${chips('level', LEVELS, 'Nível')}
      ${chips('focus', FOCUS, 'Foco')}
    </div>
    <div class="mgrid">${methods.map((m) => methodCard(m)).join('')}</div>
    <p class="empty" hidden>Nenhum método com esses filtros.</p>
  </div>
</section>`;

/* ───────────── REPERTÓRIO ───────────── */
const repSection = () => `
<section id="repertorio" class="chapter" data-chapter="repertorio" data-tone="dusk" aria-labelledby="repertorio-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Repertório</p>
    <h2 id="repertorio-title" class="display">Seus dedos já conhecem as notas.<br><em>Agora é hora de fazer música com elas.</em></h2>
    <p class="lead">Uma jornada progressiva de obras — do iniciante ao avançado, do Barroco ao choro. Níveis são aproximados: uma mesma obra pode ser estudada em momentos diferentes, com objetivos diferentes.</p>
  </header>
  <div class="container" data-filterable="rcard">
    <div class="filters">
      ${chips('level', REP_LEVELS, 'Nível')}
      ${chips('period', PERIODS, 'Período')}
    </div>
    <div class="rgrid">${repertoire.map(repCard).join('')}</div>
    <p class="empty" hidden>Nenhuma obra com esses filtros.</p>
    <p class="note">Este site não disponibiliza partituras. Para obras em domínio público, consulte acervos como o <a href="https://imslp.org/" target="_blank" rel="noopener">IMSLP</a> (verifique a situação de direitos no seu país); para obras protegidas, utilize edições autorizadas.</p>
  </div>
</section>`;

/* ───────────── COMO ESTUDAR ───────────── */
const studySection = () => `
<section id="como-estudar" class="chapter" data-chapter="como-estudar" data-tone="deep" aria-labelledby="estudar-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Como estudar</p>
    <h2 id="estudar-title" class="display">Estudar mais não significa<br><em>necessariamente estudar melhor.</em></h2>
  </header>
  <div class="duo container">
    <figure data-view="parallax" data-speed="-0.05">${photo(4, { sizes: '(min-width: 700px) 45vw, 92vw' })}<figcaption>Partitura, estante e flauta: o estudo começa na organização.</figcaption></figure>
    <figure data-view="parallax" data-speed="0.05">${photo(7, { sizes: '(min-width: 700px) 45vw, 92vw' })}<figcaption>A sala de ensaio é onde o plano vira hábito.</figcaption></figure>
  </div>
  <ol class="principles container">
    ${principles.map((p, i) => `<li class="principle" data-view="rise"><span>${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}
  </ol>
  <div class="container routines" data-tabs>
    <h3 class="display routines__title">Rotinas exemplificativas</h3>
    <p class="lead">Modelos para adaptar — não regras. O mais importante é a consistência.</p>
    <div class="tabs tabs--pills" role="tablist" aria-label="Duração da rotina">
      ${routines.map((r, i) => `<button role="tab" id="tab-rt-${r.minutes}" aria-controls="rt-${r.minutes}" aria-selected="${i === 1}" tabindex="${i === 1 ? 0 : -1}">${r.minutes} min</button>`).join('')}
    </div>
    ${routines
      .map(
        (r, i) => `<div class="tabpanel routine" role="tabpanel" id="rt-${r.minutes}" aria-labelledby="tab-rt-${r.minutes}"${i === 1 ? '' : ' hidden'}>
        <p class="routine__sub"><strong>${esc(r.title)}</strong> — ${esc(r.subtitle)}</p>
        <div class="routine__bar" aria-hidden="true">${r.blocks.map(([m, , t]) => `<span class="rb rb--${t}" style="flex:${m}"></span>`).join('')}</div>
        <ol class="routine__list">${r.blocks.map(([m, a, t]) => `<li><span class="rb-dot rb--${t}"></span><strong>${m} min</strong> ${esc(a)} <em>${ROUTINE_LABELS[t]}</em></li>`).join('')}</ol>
      </div>`
      )
      .join('')}
  </div>
  <div class="stops container">${stopHTML(pedagogueBySlug.debost)}</div>
</section>`;

/* ───────────── COMO ESTUDAR UMA MÚSICA ───────────── */
const musicSection = () => `
<section id="estudar-musica" class="chapter" data-chapter="estudar-musica" data-tone="ink" aria-labelledby="musica-title">
  <div class="scene hs hs--steps" data-scene data-hook="hscroll">
    <div class="stage hs__stage">
      <header class="hs__head">
        <p class="eyebrow">Como estudar uma música</p>
        <h2 id="musica-title" class="display">Do primeiro contato<br><em>ao palco.</em></h2>
      </header>
      <div class="hs__viewport">
        <ol class="hs__track steps" data-track>
          ${musicSteps.map((s, i) => `<li class="step"><span class="step__n">${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
        </ol>
      </div>
      <div class="hs__bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
</section>`;

/* ───────────── PROBLEMAS ───────────── */
const problemsSection = () => `
<section id="problemas" class="chapter" data-chapter="problemas" data-tone="dusk" aria-labelledby="problemas-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Problemas comuns</p>
    <h2 id="problemas-title" class="display">Todo flautista já disse<br><em>uma destas frases.</em></h2>
    <p class="lead">Possíveis causas, o que observar e estratégias de estudo. São orientações gerais: cada caso é único, e um olhar individual faz diferença.</p>
  </header>
  <div class="container problems">
    ${problems
      .map(
        (p) => `<details class="problem" id="pr-${p.id}" data-view="rise">
        <summary><span class="problem__q">“${esc(p.title.replace(/\.$/, ''))}”</span><span class="mcard__toggle" aria-hidden="true">${icon('plus')}</span></summary>
        ${problemBody(p)}
        <a class="link-more" href="guia/problemas/${p.id}.html">Abrir guia completo ${icon('arrow')}</a>
      </details>`
      )
      .join('')}
  </div>
</section>`;

/* ───────────── FERRAMENTAS ───────────── */
const toolsSection = () => `
<section id="ferramentas" class="chapter" data-chapter="ferramentas" data-tone="ink" aria-labelledby="ferramentas-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Tecnologia</p>
    <h2 id="ferramentas-title" class="display">Ferramentas do flautista</h2>
    <p class="lead">Categorias de ferramentas que ajudam no estudo. Aplicativos mudam rápido: verifique disponibilidade, preços e recursos atuais antes de escolher.</p>
  </header>
  <ul class="tools container">
    ${tools.map((t) => `<li class="tool" data-view="rise"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p><p class="tool__ex">${esc(t.examples)}</p></li>`).join('')}
  </ul>
</section>`;

/* ───────────── PROFESSOR ───────────── */
const teacherSection = () => `
<section id="professor" class="chapter" data-chapter="professor" data-tone="deep" aria-labelledby="professor-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">A importância do professor</p>
    <h2 id="professor-title" class="sr-only">A importância do professor</h2>
  </header>
  <blockquote class="bridge bridge--big container"><p class="display" data-words>${esc(teacher.philosophy)}</p></blockquote>
  <ul class="tpoints container">
    ${teacherPoints.map((t, i) => `<li data-view="rise"><span>${pad(i + 1)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join('')}
  </ul>
</section>`;

/* ───────────── NÍVEL ───────────── */
const levelSection = () => `
<section id="nivel" class="chapter" data-chapter="nivel" data-tone="dawn" aria-labelledby="nivel-title">
  <header class="section-head section-head--photo container">
    <div data-view="rise">
      <p class="eyebrow">Descubra seu nível</p>
      <h2 id="nivel-title" class="display">Descubra onde você está.</h2>
      <p class="lead">Oito perguntas rápidas. O resultado é uma orientação para encontrar seu ponto no mapa — não um diagnóstico absoluto.</p>
    </div>
    <figure class="head-photo" data-view="parallax" data-speed="-0.06">${photo(14, { sizes: '(min-width: 900px) 26vw, 60vw' })}</figure>
  </header>
  <div class="container">
    <div class="quiz" data-quiz aria-live="polite">
      <noscript><p class="note">Ative o JavaScript para usar o questionário. Enquanto isso, explore o <a href="#mapa">mapa da jornada</a>.</p></noscript>
    </div>
  </div>
</section>`;

/* ───────────── TRILHAS ───────────── */
const goalsSection = () => `
<section id="trilhas" class="chapter" data-chapter="trilhas" data-tone="dusk" aria-labelledby="trilhas-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Trilhas de objetivo</p>
    <h2 id="trilhas-title" class="display">Escolha seu destino.<br><em>O caminho se desenha.</em></h2>
  </header>
  <div class="container goals" data-tabs>
    <div class="tabs tabs--pills tabs--wrap" role="tablist" aria-label="Objetivos">
      ${goals.map((g, i) => `<button role="tab" id="tab-g-${g.id}" aria-controls="g-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g.title)}</button>`).join('')}
    </div>
    ${goals
      .map(
        (g, i) => `<div class="tabpanel goal" role="tabpanel" id="g-${g.id}" aria-labelledby="tab-g-${g.id}"${i ? ' hidden' : ''}>
        <ol class="goal__path">${g.path.map((s, j) => `<li style="--i:${j}"><span>${pad(j + 1)}</span>${esc(s)}</li>`).join('')}</ol>
        <p class="goal__focus"><strong>Foco:</strong> ${esc(g.focus)}</p>
        <a class="btn btn--ghost" href="#aulas" data-goal="${esc(g.title)}">Quero um plano para este objetivo ${icon('arrow')}</a>
      </div>`
      )
      .join('')}
  </div>
</section>`;

/* ───────────── CHECKLIST ───────────── */
const checklistSection = () => {
  let n = 0;
  return `
<section id="checklist" class="chapter" data-chapter="checklist" data-tone="deep" aria-labelledby="checklist-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Checklist</p>
    <h2 id="checklist-title" class="display">O que você já construiu.</h2>
    <p class="lead">Marque o que você já domina com segurança. Seu progresso fica salvo apenas neste navegador.</p>
  </header>
  <div class="container checklist" data-checklist>
    <div class="ring" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="ring__fill" cx="60" cy="60" r="52"/></svg><span data-ring-label>0%</span></div>
    <p class="sr-only" aria-live="polite" data-ring-sr></p>
    <div class="checklist__groups">
      ${checklist
        .map(
          (g) => `<fieldset><legend>${esc(g.group)}</legend>${g.items
            .map((it) => {
              const id = `ck-${n++}`;
              return `<label class="check" for="${id}"><input type="checkbox" id="${id}" data-key="${esc(it)}"><span class="check__box" aria-hidden="true">${icon('check')}</span>${esc(it)}</label>`;
            })
            .join('')}</fieldset>`
        )
        .join('')}
    </div>
    <button type="button" class="btn btn--text" data-checklist-reset>Recomeçar checklist</button>
  </div>
</section>`;
};

/* ───────────── SEMINÁRIO ───────────── */
const typeIcon = { video: 'play', pdf: 'file', exercicio: 'note', link: 'link', material: 'book', anotacao: 'pencil', extra: 'star' };
const typeLabel = { video: 'Vídeo', pdf: 'PDF', exercicio: 'Exercício', link: 'Link', material: 'Material', anotacao: 'Anotações', extra: 'Extra' };
const seminarSection = () => `
<section id="seminario" class="chapter seminar" data-chapter="seminario" data-tone="night" aria-labelledby="seminario-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Material complementar</p>
    <h2 id="seminario-title" class="display">SCHNEIDER<br><em>Seminário de Flauta</em></h2>
    <p class="lead">Tudo o que foi apresentado no seminário está disponível aqui para você continuar estudando.</p>
  </header>
  <div class="container">
    ${seminars
      .map(
        (s) => `<article class="seminar__card" data-view="rise">
        <figure class="seminar__photo">${photo(12, { sizes: '(min-width: 900px) 30vw, 92vw' })}</figure>
        <header><h3>${esc(s.title)}</h3>${s.date ? `<p class="seminar__date">${esc(s.date)}</p>` : ''}<p>${esc(s.description)}</p></header>
        <ul class="materials">
          ${s.materials
            .map((m) => {
              const soon = !m.url;
              const ext = m.url && /^https?:/.test(m.url);
              const inner = `${icon(typeIcon[m.type] || 'link')}<span><small>${typeLabel[m.type] || 'Material'}${soon ? ' · em breve' : ''}</small><strong>${esc(m.title)}</strong><em>${esc(m.description)}</em></span>`;
              return `<li>${soon ? `<div class="material is-soon">${inner}</div>` : `<a class="material" href="${esc(m.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`}</li>`;
            })
            .join('')}
        </ul>
      </article>`
      )
      .join('')}
  </div>
</section>`;

/* ───────────── SCHNEIDER ───────────── */
const aboutSection = () => `
<section id="schneider" class="chapter about" data-chapter="schneider" data-tone="deep" aria-labelledby="schneider-title">
  <div class="container about__grid">
    <div class="about__media" data-view="parallax" data-speed="-0.05"><figure class="portrait">${photo(2, { sizes: '(min-width: 860px) 440px, 92vw', alt: `${teacher.name} tocando flauta transversal` })}</figure></div>
    <div data-view="rise">
      <p class="eyebrow">Conheça Schneider</p>
      <h2 id="schneider-title" class="display">${esc(teacher.name)}</h2>
      <p class="about__role">${esc(teacher.role)}</p>
      <p class="lead">${esc(teacher.intro)}</p>
      <dl class="facts">
        ${teacher.experience.map((e) => `<div class="${e.placeholder ? 'is-placeholder' : ''}"><dt>${esc(e.label)}</dt><dd>${esc(e.text)}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
  <div class="container">
    <ul class="moments" aria-label="Momentos da jornada">
      ${[[15, 'No palco'], [9, 'Na orquestra'], [6, 'Na sala de estudo'], [17, 'No dia a dia']].map(([n, c]) => `<li data-view="rise"><figure>${photo(n, { sizes: '(min-width: 900px) 24vw, 46vw' })}<figcaption>${c}</figcaption></figure></li>`).join('')}
    </ul>
    <h3 class="display about__h">Metodologia</h3>
    <ol class="method-steps">
      ${teacher.methodology.map((m, i) => `<li data-view="rise"><span>${pad(i + 1)}</span><h4>${esc(m.title)}</h4><p>${esc(m.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>`;


/* ───────────── FILOSOFIA ───────────── */
const finale = ['Descubra onde você está.', 'Entenda o que veio antes.', 'Conheça quem construiu essa tradição.', 'Descubra o que precisa desenvolver.', 'Escolha seu próximo passo.', 'Continue caminhando.'];
const philosophySection = () => `
<section id="filosofia" class="scene seq seq--philo" data-scene data-chapter="filosofia" data-tone="night" style="--h:${philosophy.length * 70 + 120}" aria-labelledby="filosofia-title">
  <div class="stage">
    <div class="seq__bg" aria-hidden="true"${kf('0 o:0 s:1.15; .15 o:.32 s:1.1; .85 o:.32 s:1; 1 o:.2 s:1')}>${photo(11, { sizes: '100vw', alt: '' })}</div>
    <h2 id="filosofia-title" class="eyebrow eyebrow--center seq__eyebrow">Filosofia</h2>
    <div class="seq__lines">
      ${philosophy.map((l, i) => `<p class="seq__line display${i === philosophy.length - 1 ? ' seq__line--gold' : ''}"${kf(seqKf(i, philosophy.length + 1, { holdLast: false, end: 0.82 }))}>${esc(l)}</p>`).join('')}
      <ul class="finale"${kf('0 o:0; .8 o:0 y:4; .88 o:1 y:0; 1 o:1')}>${finale.map((f, i) => `<li style="--i:${i}">${esc(f)}</li>`).join('')}</ul>
    </div>
    <div class="seq__meter" aria-hidden="true"><span></span></div>
  </div>
</section>`;

/* ───────────── AULAS ───────────── */
const lessonsSection = () => `
<section id="aulas" class="chapter lessons" data-chapter="aulas" data-tone="dawn" aria-labelledby="aulas-title">
  <header class="section-head container" data-view="rise">
    <p class="eyebrow">Aulas de flauta transversal</p>
    <h2 id="aulas-title" class="display">Continue sua jornada<br><em>com Schneider.</em></h2>
    <p class="lead">Aulas individuais, com planejamento e acompanhamento, para cada ponto do caminho — dos primeiros sons à preparação de audições.</p>
  </header>
  <ul class="formats container">
    ${lessons.formats.map((f) => `<li data-view="rise"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('')}
  </ul>
  <div class="container contact" data-view="rise">
    <figure class="contact__photo">${photo(5, { sizes: '(min-width: 900px) 34vw, 92vw' })}<figcaption>Cada aula parte de onde você está.</figcaption></figure>
    <form class="contact__form" data-contact novalidate>
      <h3 class="display">Quero começar minha jornada</h3>
      <p class="contact__note">${esc(lessons.note)}${contact.city ? ` ${esc(contact.city)}.` : ''}</p>
      <div class="field"><label for="c-nome">Seu nome</label><input id="c-nome" name="nome" autocomplete="name" required></div>
      <div class="field"><label for="c-nivel">Onde você está na jornada?</label>
        <select id="c-nivel" name="nivel"><option>Ainda não comecei</option><option>Primeiros passos</option><option>Fundamental</option><option>Intermediário</option><option>Avançado</option><option>Não sei — quero descobrir</option></select></div>
      <div class="field"><label for="c-obj">Seu objetivo</label>
        <select id="c-obj" name="objetivo">${goals.map((g) => `<option>${esc(g.title)}</option>`).join('')}<option>Outro</option></select></div>
      <div class="field"><label for="c-msg">Mensagem (opcional)</label><textarea id="c-msg" name="mensagem" rows="3"></textarea></div>
      <div class="contact__actions">
        ${contact.whatsapp ? `<button class="btn btn--gold" type="submit" data-channel="whatsapp">Enviar pelo WhatsApp ${icon('arrow')}</button>` : ''}
        ${contact.email ? `<button class="btn ${contact.whatsapp ? 'btn--ghost' : 'btn--gold'}" type="submit" data-channel="email">Enviar por e-mail ${icon('arrow')}</button>` : ''}
        ${!contact.whatsapp && !contact.email ? `<p class="note is-placeholder">Configure o WhatsApp ou o e-mail de contato em <code>src/data/site.mjs</code> para ativar o envio.</p>` : ''}
      </div>
      <p class="contact__status" role="status" data-contact-status></p>
    </form>
  </div>
</section>`;

/* ───────────── FONTES ───────────── */
const sourcesSection = () => `
<section id="fontes" class="chapter refs" data-chapter="fontes" data-tone="night" aria-labelledby="fontes-title">
  <div class="container">
    <p class="eyebrow">Fontes e referências</p>
    <h2 id="fontes-title" class="display">Uma tradição se constrói com fontes.</h2>
    <p class="lead">Informações históricas e biográficas deste site seguem as referências abaixo. Nenhuma citação foi atribuída a flautistas sem fonte; quando há incerteza ou divergência entre autores, isso é indicado no próprio texto.</p>
    <ol class="refs__list">${Object.values(references)
      .map((r) => `<li><span class="tag">${esc(r.kind)}</span> ${esc(r.text)}${r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">${new URL(r.url).hostname}</a>` : ''}</li>`)
      .join('')}</ol>
  </div>
</section>`;

/* ───────────── JSON-LD ───────────── */
function jsonld() {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url + '/', inLanguage: 'pt-BR', description: site.description },
    {
      '@context': 'https://schema.org', '@type': 'Course', name: 'Aulas de flauta transversal — The Flute Journey', description: site.description, inLanguage: 'pt-BR',
      provider: { '@type': 'Person', name: teacher.name, jobTitle: teacher.role, url: site.url + '/#schneider' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: problems.map((p) => ({ '@type': 'Question', name: p.title, acceptedAnswer: { '@type': 'Answer', text: `Possíveis causas: ${p.causes.join('; ')}. Estratégias: ${p.strategies.join('; ')}.` } })),
    },
  ];
}

const appData = () => ({
  quiz, quizResults,
  chapters: [],
});

export function renderIndex() {
  return `${head({
    title: 'Schneider — The Flute Journey · Aulas e guia de flauta transversal',
    description: site.description,
    jsonld: jsonld(),
  })}
<body class="no-js" data-tone="night">
<script>document.body.classList.replace('no-js','js')</script>
<div class="backdrop" aria-hidden="true"><div class="backdrop__glow"></div><div class="backdrop__grain"></div></div>
${topbar()}
<main id="conteudo">
${hero()}
${prologue()}
${map()}
${chapters.map(chapter).join('\n')}
${horizonSection()}
${historySection()}
${pillarsSection()}
${methodsSection()}
${repSection()}
${studySection()}
${musicSection()}
${problemsSection()}
${toolsSection()}
${teacherSection()}
${levelSection()}
${goalsSection()}
${checklistSection()}
${seminarSection()}
${aboutSection()}
${philosophySection()}
${lessonsSection()}
${sourcesSection()}
</main>
${footer()}
${hereBar()}
${journeyIndex()}
<script type="application/json" id="app-data">${JSON.stringify({ ...appData(), contact }).replace(/</g, '\\u003c')}</script>
<script src="assets/js/main.js" defer></script>
</body>
</html>`;
}
