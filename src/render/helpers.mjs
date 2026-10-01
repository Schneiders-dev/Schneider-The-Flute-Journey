import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = new URL('../../', import.meta.url).pathname;

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const list = (items, cls = '') =>
  `<ul${cls ? ` class="${cls}"` : ''}>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

// Keyframes declarativos para o motor de scroll (ver assets/js/main.js).
// Formato: "pos prop:valor prop:valor; pos ..." — x em vw, y em vh, s escala, r graus, o opacidade, b blur(px).
export const kf = (desktop, small) =>
  ` data-kf="${desktop}"${small ? ` data-kf-sm="${small}"` : ''}`;

export const initials = (name) =>
  name
    .replace(/^Sir\s+/, '')
    .split(/\s+/)
    .filter((w) => /^[A-ZÀ-Ý]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

// Retrato: usa a imagem local se existir; senão, um monograma editorial.
export function portrait(slug, name, prefix = '') {
  const exts = ['webp', 'jpg', 'jpeg', 'png'];
  const found = exts.map((e) => `assets/img/pedagogos/${slug}.${e}`).find((p) => existsSync(join(ROOT, p)));
  let credit = '';
  const creditsFile = join(ROOT, 'assets/img/pedagogos/credits.json');
  if (found && existsSync(creditsFile)) {
    try {
      const c = JSON.parse(readFileSync(creditsFile, 'utf8'))[slug];
      if (c) credit = `<figcaption class="portrait__credit">${esc(c)}</figcaption>`;
    } catch {}
  }
  if (found) {
    return `<figure class="portrait"><img src="${prefix}${found}" alt="Retrato de ${esc(name)}" loading="lazy" decoding="async" width="600" height="750">${credit}</figure>`;
  }
  return `<figure class="portrait portrait--mono" aria-hidden="true"><span class="portrait__mono">${esc(initials(name))}</span><span class="portrait__frame"></span></figure>`;
}

export const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Ícones minimalistas (stroke) para zonas e interface.
export const icons = {
  seed: '<path d="M12 20v-7"/><path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6Z"/><path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5Z"/>',
  note: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  staff: '<path d="M3 6h18M3 10h18M3 14h18M3 18h18"/><circle cx="9" cy="14" r="1.6" fill="currentColor"/><circle cx="15" cy="10" r="1.6" fill="currentColor"/>',
  bridge: '<path d="M2 18h20"/><path d="M4 18c0-5 3.6-8 8-8s8 3 8 8"/><path d="M8 18v-5M12 18v-8M16 18v-5"/>',
  peak: '<path d="m3 20 6-10 4 6 3-4 5 8Z"/><path d="M9 10V4l3 1.5L9 7"/>',
  stage: '<path d="M3 20h18"/><path d="M5 20V8l7-4 7 4v12"/><path d="M9 20v-6h6v6"/>',
  star: '<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7Z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  play: '<path d="M7 4v16l13-8Z"/>',
  file: '<path d="M14 3H6v18h12V7Z"/><path d="M14 3v4h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16Z"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
};

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
