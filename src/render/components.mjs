import { esc, list, kf, portrait, icon } from './helpers.mjs';
import { ROLE_LABELS } from '../data/pedagogues.mjs';
import { references } from '../data/references.mjs';
import { LEVELS, FOCUS, methods } from '../data/methods.mjs';
import { PERIODS, REP_LEVELS } from '../data/repertoire.mjs';
import { ribbon } from '../data/journey.mjs';

export const methodById = Object.fromEntries(methods.map((m) => [m.id, m]));

export const fluteSVG = () => `
<svg class="flute" viewBox="0 0 1200 96" role="img" aria-label="Ilustração de uma flauta transversal">
  <defs>
    <linearGradient id="fl-silver" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6f8fb"/><stop offset=".3" stop-color="#c3c9d4"/><stop offset=".55" stop-color="#6b7383"/><stop offset=".78" stop-color="#d2d7e0"/><stop offset="1" stop-color="#4d5462"/>
    </linearGradient>
    <linearGradient id="fl-key" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#aab1bd"/><stop offset="1" stop-color="#5d6472"/>
    </linearGradient>
    <linearGradient id="fl-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="44" y="40" width="1112" height="16" rx="8" fill="url(#fl-silver)"/>
  <rect x="18" y="36" width="30" height="24" rx="7" fill="url(#fl-key)"/>
  <rect x="300" y="37" width="12" height="22" rx="3" fill="url(#fl-key)"/>
  <rect x="992" y="37" width="12" height="22" rx="3" fill="url(#fl-key)"/>
  <ellipse cx="150" cy="40" rx="30" ry="10" fill="url(#fl-key)"/>
  <ellipse cx="150" cy="40" rx="9" ry="4" fill="#070a12"/>
  <line x1="380" y1="31" x2="985" y2="31" stroke="url(#fl-key)" stroke-width="3" stroke-linecap="round"/>
  ${[420, 474, 528, 612, 664, 738, 796, 854, 912]
    .map((x, i) => `<g><circle cx="${x}" cy="44" r="12" fill="url(#fl-key)" stroke="#3b414d" stroke-width="1"/>${i < 3 || (i > 4 && i < 8) ? `<circle cx="${x}" cy="44" r="3.6" fill="#070a12"/>` : ''}</g>`)
    .join('')}
  <rect x="1032" y="33" width="26" height="20" rx="8" fill="url(#fl-key)"/>
  <rect x="1072" y="33" width="26" height="20" rx="8" fill="url(#fl-key)"/>
  <rect x="1112" y="33" width="26" height="20" rx="8" fill="url(#fl-key)"/>
  <rect class="flute__sheen" x="44" y="40" width="240" height="6" rx="3" fill="url(#fl-sheen)"/>
</svg>`;

export const staffSVG = (cls = 'staff') => `
<svg class="${cls}" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  ${[0, 1, 2, 3, 4]
    .map((i) => {
      const y = 270 + i * 16;
      return `<path d="M-80 ${y} C 260 ${y - 120}, 620 ${y + 150}, 900 ${y - 10} S 1180 ${y - 90}, 1300 ${y - 40}" ${i === 2 ? 'class="staff__gold"' : ''}/>`;
    })
    .join('')}
</svg>`;

// Indicador "Você está aqui" dentro dos capítulos.
export function ribbonHTML(index, label = 'Você está aqui') {
  return `<nav class="ribbon" aria-label="Posição na jornada"><ol>${ribbon
    .map((r, i) => {
      if (i === index)
        return `<li class="ribbon__here" aria-current="step"><span class="ribbon__dot"></span><span><small>${label}</small>${esc(r)}</span></li>`;
      return `<li class="${i < index ? 'is-past' : ''}">${esc(r)}</li>`;
    })
    .join('<li class="ribbon__sep" aria-hidden="true">→</li>')}</ol></nav>`;
}

export function sourcesHTML(keys, title = 'Fontes e referências') {
  if (!keys?.length) return '';
  return `<details class="sources"><summary>${title}</summary><ol>${keys
    .map((k) => references[k])
    .filter(Boolean)
    .map((r) => `<li>${esc(r.text)}${r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">${new URL(r.url).hostname}</a>` : ''}</li>`)
    .join('')}</ol></details>`;
}

// A "parada histórica": composição editorial do pedagogo.
export function stopHTML(p, { prefix = '', headingLevel = 3, standalone = false } = {}) {
  const H = `h${headingLevel}`;
  const roles = p.roles.map((r) => `<li>${ROLE_LABELS[r]}</li>`).join('');
  return `
<article class="stop" id="p-${p.slug}" aria-labelledby="p-${p.slug}-name">
  <p class="stop__kicker"><span class="stop__pin" aria-hidden="true"></span>Uma nova parada no caminho</p>
  <div class="stop__grid">
    <div class="stop__media" data-view="parallax" data-speed="-0.06">
      ${portrait(p.slug, p.name, prefix)}
    </div>
    <div class="stop__head" data-view="rise">
      <${H} class="stop__name" id="p-${p.slug}-name">${esc(p.name)}</${H}>
      <p class="stop__years">${esc(p.years)} <span>·</span> ${esc(p.nationality)}</p>
      <ul class="roles" aria-label="Papéis históricos">${roles}</ul>
      <p class="stop__tagline">${esc(p.tagline)}</p>
      <p>${esc(p.bio)}</p>
      <p class="stop__importance">${esc(p.importance)}</p>
    </div>
  </div>
  <div class="stop__work" data-view="rise">
    <p class="eyebrow">A obra</p>
    <h${headingLevel + 1} class="stop__work-title">${esc(p.work.title)}</h${headingLevel + 1}>
    <dl class="facts">
      <div><dt>Objetivo</dt><dd>${esc(p.work.objective)}</dd></div>
      <div><dt>Como usar</dt><dd>${esc(p.work.how)}</dd></div>
      <div><dt>Para quem</dt><dd>${esc(p.work.forWhom)}</dd></div>
      <div><dt>O que desenvolve</dt><dd>${esc(p.work.develops)}</dd></div>
      <div><dt>Erros comuns</dt><dd>${esc(p.work.mistakes)}</dd></div>
    </dl>
    <div class="stop__journey">
      <p class="eyebrow">Como entra na sua jornada</p>
      <p>${esc(p.journey)}</p>
      <p class="stop__legacy"><strong>Legado.</strong> ${esc(p.legacy)}</p>
    </div>
    ${p.note ? `<p class="note"><strong>Nota histórica.</strong> ${esc(p.note)}</p>` : ''}
    ${sourcesHTML(p.sources)}
    ${standalone ? '' : `<a class="link-more" href="${prefix}guia/pedagogos/${p.slug}.html">Página completa de ${esc(p.name.replace(/^Sir /, ''))} ${icon('arrow')}</a>`}
  </div>
</article>`;
}

export const levelTags = (levels) => (Array.isArray(levels) ? levels : [levels]);

export function methodCard(m, { prefix = '' } = {}) {
  const lv = levelTags(m.level);
  const related = (m.related || []).map((id) => methodById[id]).filter(Boolean);
  return `
<details class="mcard" id="m-${m.id}" data-level="${lv.join(' ')}" data-focus="${m.focus.join(' ')}">
  <summary>
    <span class="mcard__author">${esc(m.author)}</span>
    <span class="mcard__title">${esc(m.title)}</span>
    <span class="tags">${lv.map((l) => `<span class="tag tag--lv">${LEVELS[l]}</span>`).join('')}${m.focus.map((f) => `<span class="tag">${FOCUS[f]}</span>`).join('')}</span>
    <span class="mcard__toggle" aria-hidden="true">${icon('plus')}</span>
  </summary>
  <div class="mcard__body">
    <dl class="facts facts--2">
      <div><dt>Autor</dt><dd>${esc(m.author)}${m.pedagogue ? ` — <a href="#p-${m.pedagogue}">conheça a história</a>` : ''}</dd></div>
      <div><dt>História</dt><dd>${esc(m.history)}</dd></div>
      <div><dt>O que é</dt><dd>${esc(m.what)}</dd></div>
      <div><dt>Para que serve</dt><dd>${esc(m.purpose)}</dd></div>
      <div><dt>Nível</dt><dd>${lv.map((l) => LEVELS[l]).join(' → ')}</dd></div>
      <div><dt>Como estudar</dt><dd>${esc(m.how)}</dd></div>
      <div><dt>O que desenvolve</dt><dd>${esc(m.develops)}</dd></div>
      <div><dt>Como se encaixa na jornada</dt><dd>${esc(m.fit)}</dd></div>
      <div><dt>Erros comuns</dt><dd>${esc(m.mistakes)}</dd></div>
      ${related.length ? `<div><dt>Métodos relacionados</dt><dd>${related.map((r) => `<a href="#m-${r.id}" data-open>${esc(r.title)}</a>`).join(' · ')}</dd></div>` : ''}
    </dl>
    ${m.note ? `<p class="note">${esc(m.note)}</p>` : ''}
    <a class="link-more" href="${prefix}guia/metodos/${m.id}.html">Página do método ${icon('arrow')}</a>
  </div>
</details>`;
}

export function repCard(r) {
  return `
<details class="rcard" id="r-${r.id}" data-level="${r.level}" data-period="${r.period}">
  <summary>
    <span class="rcard__period">${PERIODS[r.period]}</span>
    <span class="rcard__title">${esc(r.title)}</span>
    <span class="rcard__composer">${esc(r.composer)}</span>
    <span class="tag tag--lv rcard__level">${REP_LEVELS[r.level]}</span>
  </summary>
  <dl class="facts facts--2">
    <div><dt>Contexto histórico</dt><dd>${esc(r.context)}</dd></div>
    <div><dt>Dificuldades</dt><dd>${esc(r.difficulties)}</dd></div>
    <div><dt>Competências desenvolvidas</dt><dd>${esc(r.skills)}</dd></div>
    <div><dt>Sugestões de estudo</dt><dd>${esc(r.study)}</dd></div>
    <div><dt>Aspectos interpretativos</dt><dd>${esc(r.interpretation)}</dd></div>
  </dl>
  ${r.note ? `<p class="note">${esc(r.note)}</p>` : ''}
</details>`;
}

export function problemBody(p, { prefix = '' } = {}) {
  return `
<div class="problem__grid">
  <section><h4>Possíveis causas</h4>${list(p.causes)}</section>
  <section><h4>O que observar</h4>${list(p.observe)}</section>
  <section><h4>Estratégias de estudo</h4>${list(p.strategies)}</section>
  <section><h4>O que evitar</h4>${list(p.avoid)}</section>
</div>
<p class="problem__help"><strong>Quando procurar orientação individual.</strong> ${esc(p.help)} <a href="${prefix}#aulas">Falar com Schneider</a></p>`;
}

export function pillarBody(p, { prefix = '', local = true } = {}) {
  const ms = p.methods.map((id) => methodById[id]).filter(Boolean);
  return `
<p class="pillar__what">${esc(p.what)}</p>
<div class="pillar__grid">
  <section><h4>Por que importa</h4><p>${esc(p.why)}</p></section>
  <section><h4>Exercícios</h4>${list(p.exercises)}</section>
  <section><h4>Erros comuns</h4>${list(p.mistakes)}</section>
  <section><h4>Indicadores de evolução</h4>${list(p.signs)}</section>
</div>
<p class="pillar__methods"><strong>Métodos relacionados:</strong> ${ms
    .map((m) => `<a href="${local ? '' : prefix + 'guia/metodos/' + m.id + '.html'}${local ? '#m-' + m.id : ''}"${local ? ' data-open' : ''}>${esc(m.title)}</a>`)
    .join(' · ')}</p>`;
}

export function softCTA(text, sub) {
  return `
<aside class="softcta" data-view="rise">
  <p class="softcta__q">${esc(text)}</p>
  ${sub ? `<p class="softcta__sub">${esc(sub)}</p>` : ''}
  <a class="btn btn--ghost" href="#aulas">Continue sua jornada com Schneider ${icon('arrow')}</a>
</aside>`;
}

export { kf, icon, esc, list };
