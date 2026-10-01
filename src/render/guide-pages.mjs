// Páginas individuais (SEO): cada problema, método, pedagogo, pilar e capítulo ganha sua própria URL.
import { site, contact } from '../data/site.mjs';
import { pedagogues } from '../data/pedagogues.mjs';
import { methods, LEVELS, FOCUS } from '../data/methods.mjs';
import { pillars, problems } from '../data/practice.mjs';
import { chapters } from '../data/journey.mjs';
import { esc, icon, list } from './helpers.mjs';
import { stopHTML, problemBody, pillarBody, ribbonHTML, methodById, levelTags } from './components.mjs';
import { head, topbar, journeyIndex, footer } from './layout.mjs';

function page({ path, title, description, crumbs, body, prefix, jsonld = [], ribbonIndex }) {
  const bc = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: `${site.url}/${c.path}` })),
  };
  return {
    path,
    html: `${head({ title, description, path, prefix, jsonld: [bc, ...jsonld] })}
<body class="no-js guide" data-tone="deep">
<script>document.body.classList.replace('no-js','js')</script>
<div class="backdrop" aria-hidden="true"><div class="backdrop__glow"></div><div class="backdrop__grain"></div></div>
${topbar(prefix)}
<main id="conteudo" class="guide__main container">
  <nav class="crumbs" aria-label="Você está em">
    <ol>${crumbs.map((c, i) => (i < crumbs.length - 1 ? `<li><a href="${prefix}${c.path}">${esc(c.label)}</a></li>` : `<li aria-current="page">${esc(c.label)}</li>`)).join('')}</ol>
  </nav>
  ${ribbonIndex !== undefined ? ribbonHTML(ribbonIndex) : ''}
  ${body}
  <aside class="softcta">
    <p class="softcta__q">Quer descobrir como aplicar isso ao seu estudo?</p>
    <p class="softcta__sub">Um plano personalizado transforma informação em evolução.</p>
    <div class="softcta__row"><a class="btn btn--gold" href="${prefix}index.html#aulas">Começar aulas com Schneider ${icon('arrow')}</a><a class="btn btn--ghost" href="${prefix}index.html#mapa">Voltar ao mapa da jornada</a></div>
  </aside>
</main>
${footer(prefix)}
${journeyIndex(prefix + 'index.html')}
<script type="application/json" id="app-data">${JSON.stringify({ contact }).replace(/</g, '\\u003c')}</script>
<script src="${prefix}assets/js/main.js" defer></script>
</body>
</html>`,
  };
}

const home = { label: 'The Flute Journey', path: 'index.html' };
const guides = { label: 'Guias', path: 'guia/index.html' };

export function renderGuidePages() {
  const out = [];
  const P2 = '../../';

  // Problemas
  const prob = { label: 'Problemas comuns', path: 'guia/problemas/index.html' };
  problems.forEach((p) => {
    const t = p.title.replace(/\.$/, '');
    out.push(page({
      path: `guia/problemas/${p.id}.html`, prefix: P2, ribbonIndex: 1,
      title: `“${t}” — causas e estratégias | Flauta transversal`,
      description: `${t}? Possíveis causas, o que observar, estratégias de estudo e quando procurar orientação. Guia de flauta transversal.`,
      crumbs: [home, guides, prob, { label: t, path: `guia/problemas/${p.id}.html` }],
      body: `<article class="guide__article"><p class="eyebrow">Problemas comuns</p><h1 class="display">“${esc(t)}”</h1>${problemBody(p, { prefix: P2 + 'index.html' })}</article>`,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: p.title, acceptedAnswer: { '@type': 'Answer', text: `Possíveis causas: ${p.causes.join('; ')}. Estratégias: ${p.strategies.join('; ')}. ${p.help}` } }] }],
    }));
  });
  out.push(indexPage('guia/problemas/index.html', 'Problemas comuns na flauta transversal', 'Som soproso, agudo que não sai, falta de ar, staccato, afinação, velocidade: causas e estratégias de estudo.', prob, problems.map((p) => ({ href: `${p.id}.html`, title: p.title, text: p.causes.slice(0, 2).join(' · ') }))));

  // Métodos
  const met = { label: 'Métodos para flauta', path: 'guia/metodos/index.html' };
  methods.forEach((m) => {
    const lv = levelTags(m.level);
    const rel = (m.related || []).map((id) => methodById[id]).filter(Boolean);
    out.push(page({
      path: `guia/metodos/${m.id}.html`, prefix: P2, ribbonIndex: 2,
      title: `${m.title} — ${m.author.split('(')[0].trim()} | Métodos para flauta`,
      description: `${m.title}: o que é, para que serve, nível, como estudar e erros comuns. ${m.purpose}`,
      crumbs: [home, guides, met, { label: m.title, path: `guia/metodos/${m.id}.html` }],
      body: `<article class="guide__article">
        <p class="eyebrow">Biblioteca de métodos</p><h1 class="display">${esc(m.title)}</h1>
        <p class="lead">${esc(m.author)}</p>
        <p class="tags">${lv.map((l) => `<span class="tag tag--lv">${LEVELS[l]}</span>`).join('')}${m.focus.map((f) => `<span class="tag">${FOCUS[f]}</span>`).join('')}</p>
        <dl class="facts facts--2">
          <div><dt>História</dt><dd>${esc(m.history)}</dd></div>
          <div><dt>O que é</dt><dd>${esc(m.what)}</dd></div>
          <div><dt>Para que serve</dt><dd>${esc(m.purpose)}</dd></div>
          <div><dt>Nível</dt><dd>${lv.map((l) => LEVELS[l]).join(' → ')}</dd></div>
          <div><dt>Como estudar</dt><dd>${esc(m.how)}</dd></div>
          <div><dt>O que desenvolve</dt><dd>${esc(m.develops)}</dd></div>
          <div><dt>Como se encaixa na jornada</dt><dd>${esc(m.fit)}</dd></div>
          <div><dt>Erros comuns</dt><dd>${esc(m.mistakes)}</dd></div>
          ${rel.length ? `<div><dt>Métodos relacionados</dt><dd>${rel.map((r) => `<a href="${r.id}.html">${esc(r.title)}</a>`).join(' · ')}</dd></div>` : ''}
        </dl>
        ${m.note ? `<p class="note">${esc(m.note)}</p>` : ''}
        ${m.pedagogue ? `<a class="link-more" href="../pedagogos/${m.pedagogue}.html">Conheça a história do autor ${icon('arrow')}</a>` : ''}
        <p class="note">Nenhum método é obrigatório para todos os estudantes. A escolha depende do seu momento e dos seus objetivos.</p>
      </article>`,
    }));
  });
  out.push(indexPage('guia/metodos/index.html', 'Métodos para flauta transversal', 'Taffanel & Gaubert, Moyse, Trevor Wye, Reichert, Andersen, Köhler, Rubank, Altès e outros: para que serve cada método e como estudá-lo.', met, methods.map((m) => ({ href: `${m.id}.html`, title: m.title, text: m.author }))));

  // Pedagogos
  const ped = { label: 'Grandes pedagogos', path: 'guia/pedagogos/index.html' };
  pedagogues.forEach((p) => {
    out.push(page({
      path: `guia/pedagogos/${p.slug}.html`, prefix: P2,
      title: `${p.name} (${p.years}) — história e legado | Flauta transversal`,
      description: `${p.name}: ${p.tagline} Biografia, obra, como usar o método e como ele entra na jornada do flautista.`,
      crumbs: [home, guides, ped, { label: p.name, path: `guia/pedagogos/${p.slug}.html` }],
      body: `<div class="guide__article guide__article--wide">${stopHTML(p, { prefix: P2, headingLevel: 1, standalone: true })}</div>`,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'Person', name: p.name, nationality: p.nationality, description: p.tagline }],
    }));
  });
  out.push(indexPage('guia/pedagogos/index.html', 'Grandes flautistas e pedagogos da flauta', 'Quantz, Boehm, Taffanel, Gaubert, Moyse, Andersen, Köhler, Wye, Debost, Rampal, Galway e outros nomes que construíram a tradição da flauta.', ped, pedagogues.map((p) => ({ href: `${p.slug}.html`, title: `${p.name} · ${p.years}`, text: p.tagline }))));

  // Pilares
  const pil = { label: 'Os pilares do flautista', path: 'guia/pilares/index.html' };
  pillars.forEach((p) => {
    out.push(page({
      path: `guia/pilares/${p.id}.html`, prefix: P2, ribbonIndex: 1,
      title: `${p.title} na flauta transversal — exercícios e erros comuns`,
      description: `${p.title}: ${p.short} O que é, por que importa, exercícios, erros comuns e indicadores de evolução.`,
      crumbs: [home, guides, pil, { label: p.title, path: `guia/pilares/${p.id}.html` }],
      body: `<article class="guide__article"><p class="eyebrow">Os pilares do flautista</p><h1 class="display">${esc(p.title)} <em>— ${esc(p.short)}</em></h1>${pillarBody(p, { prefix: P2, local: false })}</article>`,
    }));
  });
  out.push(indexPage('guia/pilares/index.html', 'Os oito pilares do flautista', 'Som, respiração, articulação, afinação, técnica, leitura, interpretação e repertório.', pil, pillars.map((p) => ({ href: `${p.id}.html`, title: p.title, text: p.short }))));

  // Capítulos da jornada
  const jor = { label: 'A jornada', path: 'guia/jornada/index.html' };
  const chapterSeo = {
    'primeiros-passos': 'Como aprender flauta transversal: primeiros passos',
    fundamentos: 'Fundamentos da flauta: som, respiração, staccato, afinação',
    tecnica: 'Técnica na flauta: escalas, duplo golpe de língua, agudos e velocidade',
    musical: 'Interpretação na flauta: fraseado, vibrato, timbre e estilo',
  };
  chapters.forEach((c) => {
    out.push(page({
      path: `guia/jornada/${c.id}.html`, prefix: P2, ribbonIndex: c.ribbonIndex,
      title: `${chapterSeo[c.id]} | The Flute Journey`,
      description: `${c.lead} ${c.topics.map((t) => t.title).slice(0, 6).join(', ')}.`,
      crumbs: [home, guides, jor, { label: c.kicker, path: `guia/jornada/${c.id}.html` }],
      body: `<article class="guide__article">
        <p class="eyebrow">Capítulo ${c.number} · ${esc(c.kicker)}</p>
        <h1 class="display">${esc(chapterSeo[c.id])}</h1>
        <p class="lead">${esc(c.lead)}</p>
        ${c.topics.map((t) => `<section class="topic topic--flat" id="t-${t.id}"><h2>${esc(t.title)}</h2><p>${esc(t.text)}</p><p class="topic__practice"><span>Como praticar</span>${esc(t.practice)}</p></section>`).join('')}
        <a class="link-more" href="${P2}index.html#${c.id}">Ver este capítulo na jornada interativa ${icon('arrow')}</a>
      </article>`,
    }));
  });
  out.push(indexPage('guia/jornada/index.html', 'A jornada do flautista', 'Primeiros passos, fundamentos, técnica e desenvolvimento musical na flauta transversal.', jor, chapters.map((c) => ({ href: `${c.id}.html`, title: chapterSeo[c.id], text: c.lead }))));

  // Índice geral
  out.push(page({
    path: 'guia/index.html', prefix: '../',
    title: 'Guias de flauta transversal | Schneider — The Flute Journey',
    description: 'Guias de estudo de flauta transversal: problemas comuns, métodos, pedagogos, pilares e a jornada completa.',
    crumbs: [home, guides],
    body: `<article class="guide__article"><p class="eyebrow">Guias</p><h1 class="display">Guias de estudo</h1>
      <ul class="glist">
        <li><a href="jornada/index.html"><strong>A jornada do flautista</strong><span>Primeiros passos, fundamentos, técnica, interpretação.</span></a></li>
        <li><a href="problemas/index.html"><strong>Problemas comuns</strong><span>Causas e estratégias para as dificuldades mais frequentes.</span></a></li>
        <li><a href="metodos/index.html"><strong>Métodos para flauta</strong><span>Para que serve cada método e como estudá-lo.</span></a></li>
        <li><a href="pedagogos/index.html"><strong>Grandes pedagogos</strong><span>Quem construiu a tradição da flauta.</span></a></li>
        <li><a href="pilares/index.html"><strong>Os pilares do flautista</strong><span>Oito áreas que sustentam todo o caminho.</span></a></li>
      </ul></article>`,
  }));

  function indexPage(path, title, description, crumb, items) {
    return page({
      path, prefix: P2, title: `${title} | The Flute Journey`, description,
      crumbs: [home, guides, crumb],
      body: `<article class="guide__article"><p class="eyebrow">Guias</p><h1 class="display">${esc(title)}</h1><p class="lead">${esc(description)}</p>
        <ul class="glist">${items.map((i) => `<li><a href="${i.href}"><strong>${esc(i.title)}</strong><span>${esc(i.text)}</span></a></li>`).join('')}</ul></article>`,
    });
  }

  return out;
}
