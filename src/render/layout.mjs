import { site, contact } from '../data/site.mjs';
import { esc, icon } from './helpers.mjs';

// Capítulos navegáveis (usados no menu, no indicador "Você está aqui" e no rodapé).
export const navChapters = [
  { id: 'inicio', label: 'Início' },
  { id: 'mapa', label: 'O mapa da jornada' },
  { id: 'primeiros-passos', label: 'Primeiros passos' },
  { id: 'fundamentos', label: 'Fundamentos' },
  { id: 'tecnica', label: 'Desenvolvimento técnico' },
  { id: 'musical', label: 'Desenvolvimento musical' },
  { id: 'horizonte', label: 'Intermediário → Formação' },
  { id: 'historia', label: 'História da flauta' },
  { id: 'pilares', label: 'Os pilares do flautista' },
  { id: 'metodos', label: 'Biblioteca de métodos' },
  { id: 'repertorio', label: 'Repertório' },
  { id: 'como-estudar', label: 'Como estudar' },
  { id: 'estudar-musica', label: 'Como estudar uma música' },
  { id: 'problemas', label: 'Problemas comuns' },
  { id: 'ferramentas', label: 'Ferramentas do flautista' },
  { id: 'professor', label: 'A importância do professor' },
  { id: 'nivel', label: 'Descubra seu nível' },
  { id: 'trilhas', label: 'Trilhas de objetivo' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'seminario', label: 'Seminário de flauta' },
  { id: 'schneider', label: 'Conheça Schneider' },
  { id: 'filosofia', label: 'Filosofia' },
  { id: 'aulas', label: 'Aulas' },
  { id: 'fontes', label: 'Fontes e referências' },
];

export function head({ title, description, path = '', prefix = '', jsonld = [], extraHead = '' }) {
  const url = `${site.url}/${path}`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="${esc(site.keywords.join(', '))}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#04050a">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${prefix}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="${prefix}assets/css/main.css">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
${extraHead}
</head>`;
}

export function topbar(prefix = '') {
  const H = prefix ? prefix + 'index.html' : '';
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="progress" aria-hidden="true"><span></span></div>
<header class="topbar">
  <a class="brand" href="${prefix ? prefix + 'index.html' : '#inicio'}" aria-label="Schneider — The Flute Journey, início">
    <span class="brand__name">SCHNEIDER</span><span class="brand__sub">The Flute Journey</span>
  </a>
  <nav class="topbar__nav" aria-label="Atalhos">
    <a href="${H}#mapa">Mapa</a>
    <a href="${H}#metodos">Métodos</a>
    <a href="${H}#nivel">Seu nível</a>
    <a href="${H}#aulas" class="topbar__cta">Aulas</a>
  </nav>
  <button class="menu-btn" type="button" aria-haspopup="dialog" aria-controls="journey-index" data-open-index>
    <span class="menu-btn__lines" aria-hidden="true"><i></i><i></i></span><span class="menu-btn__label">Jornada</span>
  </button>
</header>`;
}

export function journeyIndex(prefix = '') {
  const H = prefix;
  return `
<dialog class="jindex" id="journey-index" aria-labelledby="jindex-title">
  <div class="jindex__inner">
    <div class="jindex__head">
      <p class="eyebrow">Índice da jornada</p>
      <h2 id="jindex-title">Para onde você quer ir?</h2>
      <button class="jindex__close" type="button" data-close-index aria-label="Fechar">✕</button>
    </div>
    <ol class="jindex__list">
      ${navChapters.map((c, i) => `<li><a href="${H}#${c.id}" data-close-index><span>${String(i + 1).padStart(2, '0')}</span>${esc(c.label)}</a></li>`).join('')}
    </ol>
  </div>
</dialog>`;
}

export function hereBar() {
  return `
<div class="here" data-here hidden>
  <button class="here__btn" type="button" data-open-index aria-label="Abrir índice da jornada">
    <span class="here__track" aria-hidden="true"><span class="here__fill"></span></span>
    <span class="here__text"><small>Você está aqui</small><strong data-here-label>Início</strong></span>
    <span class="here__next" aria-hidden="true"><small>Próximo</small><span data-here-next></span></span>
  </button>
</div>`;
}

export function footer(prefix = '') {
  const H = prefix ? prefix + 'index.html' : '';
  const socials = [
    contact.whatsapp && `<a href="https://wa.me/${contact.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`,
    contact.instagram && `<a href="${contact.instagram}" target="_blank" rel="noopener">Instagram @schneiderflautist</a>`,
    contact.youtube && `<a href="${contact.youtube}" target="_blank" rel="noopener">YouTube</a>`,
    contact.email && `<a href="mailto:${contact.email}">${esc(contact.email)}</a>`,
  ].filter(Boolean);
  return `
<footer class="footer">
  <div class="footer__cta">
    <p class="eyebrow">Continue caminhando</p>
    <p class="footer__line">Agora você sabe onde está na sua jornada.<br><em>Qual é o próximo passo?</em></p>
    <a class="btn btn--gold" href="${H}#aulas">Começar aulas com Schneider ${icon('arrow')}</a>
  </div>
  <div class="footer__grid">
    <div>
      <p class="brand brand--footer"><span class="brand__name">SCHNEIDER</span><span class="brand__sub">The Flute Journey</span></p>
      <p class="footer__small">${esc(site.tagline)}</p>
      ${socials.length ? `<p class="footer__social">${socials.join(' · ')}</p>` : ''}
    </div>
    <nav aria-label="Guias">
      <p class="footer__h">Guias</p>
      <a href="${prefix}guia/index.html">Todos os guias</a>
      <a href="${prefix}guia/problemas/index.html">Problemas comuns</a>
      <a href="${prefix}guia/metodos/index.html">Métodos para flauta</a>
      <a href="${prefix}guia/pedagogos/index.html">Grandes pedagogos</a>
      <a href="${prefix}guia/pilares/index.html">Os pilares do flautista</a>
    </nav>
    <nav aria-label="Jornada">
      <p class="footer__h">Jornada</p>
      <a href="${H}#mapa">O mapa da jornada</a>
      <a href="${H}#nivel">Descubra seu nível</a>
      <a href="${H}#trilhas">Trilhas de objetivo</a>
      <a href="${H}#seminario">Seminário de flauta</a>
      <a href="${H}#aulas">Aulas</a>
    </nav>
  </div>
  <p class="footer__legal">© ${new Date().getFullYear()} Schneider — The Flute Journey. Conteúdo educacional. Partituras protegidas por direitos autorais não são distribuídas neste site. Informações históricas acompanhadas de fontes; quando há incerteza, ela é indicada.</p>
</footer>`;
}
