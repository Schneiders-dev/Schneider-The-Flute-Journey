// Ilustrações didáticas: trechos de partitura, dedilhados, embocadura, respiração, metrônomo, afinador…
// Tudo em SVG/HTML leve, sem imagens externas (exceto a foto real da flauta e as fotos do acervo).
import { photo } from './helpers.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ───────────── Motor de partitura (clave de sol) ───────────── */
const S = 10; // distância entre linhas
const TOPY = 30; // linha superior (Fá5)
const BOT = TOPY + 4 * S; // linha inferior (Mi4)
const LET = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const NAMES = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };

function parsePitch(p) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(p);
  const step = (+m[3] - 4) * 7 + LET[m[1]] - 2; // Mi4 = 0
  return { step, acc: m[2], name: NAMES[m[1]] + (m[2] === '#' ? '♯' : m[2] === 'b' ? '♭' : '') };
}
const yOf = (step) => BOT - (step * S) / 2;

/**
 * notes: [{ p:'G4', d:'q'|'h'|'w'|'8'|'q.', art:'stacc'|'acc'|'ten', fermata, tr, grace:'A4', lyric, dyn, label }]
 * opts: { time:'4/4', slurs:[[a,b]], hairpins:[[a,b,'<'|'>']], breath:[index], bars:[index], beams:[[a,b]], tuplet:[[a,b,'3']], width }
 */
export function staff(notes, opts = {}) {
  const gap = opts.gap || 34;
  let x = 52;
  const parts = [];
  const xs = [];
  if (opts.time) {
    const [a, b] = opts.time.split('/');
    parts.push(`<text class="nt-time" x="${x + 4}" y="${TOPY + 2 * S - 1}">${a}</text><text class="nt-time" x="${x + 4}" y="${BOT - 1}">${b}</text>`);
    x += 26;
  }
  x += 12;
  const beamed = new Set();
  (opts.beams || []).forEach(([a, b]) => { for (let i = a; i <= b; i++) beamed.add(i); });
  const stemInfo = [];
  notes.forEach((n, i) => {
    if (n.grace) x += 12;
    if (n.acc || /[#b]\d$/.test(n.p)) x += 10;
    xs.push(x);
    const { step, acc } = parsePitch(n.p);
    const y = yOf(step);
    const filled = !['h', 'w', 'h.'].includes(n.d);
    // linhas suplementares
    for (let s = -2; s >= step; s -= 2) parts.push(`<line class="nt-ledger" x1="${x - 9}" x2="${x + 9}" y1="${yOf(s)}" y2="${yOf(s)}"/>`);
    for (let s = 10; s <= step; s += 2) parts.push(`<line class="nt-ledger" x1="${x - 9}" x2="${x + 9}" y1="${yOf(s)}" y2="${yOf(s)}"/>`);
    if (acc) parts.push(`<text class="nt-glyph nt-acc" x="${x - 16}" y="${y + 4}">${acc === '#' ? '♯' : '♭'}</text>`);
    if (n.grace) {
      const g = parsePitch(n.grace);
      const gy = yOf(g.step);
      parts.push(`<g class="nt-grace"><ellipse cx="${x - 14}" cy="${gy}" rx="3.6" ry="2.6" transform="rotate(-20 ${x - 14} ${gy})"/><line x1="${x - 10.8}" y1="${gy}" x2="${x - 10.8}" y2="${gy - 22}"/><line x1="${x - 17}" y1="${gy - 6}" x2="${x - 5}" y2="${gy - 16}"/></g>`);
    }
    parts.push(`<ellipse class="nt-head${filled ? '' : ' nt-open'}" cx="${x}" cy="${y}" rx="${n.d === 'w' ? 6.4 : 5.4}" ry="${n.d === 'w' ? 4.3 : 3.9}" transform="rotate(${n.d === 'w' ? -12 : -20} ${x} ${y})"/>`);
    if (n.d && n.d.endsWith('.')) parts.push(`<circle class="nt-fill" cx="${x + 9}" cy="${step % 2 === 0 ? y - 4 : y}" r="1.7"/>`);
    const up = opts.stems ? opts.stems === 'up' : step < 4;
    const sx = up ? x + 5 : x - 5;
    if (n.d !== 'w') {
      const sy = up ? y - 34 : y + 34;
      stemInfo[i] = { sx, sy, y, up };
      parts.push(`<line class="nt-stem" x1="${sx}" y1="${y}" x2="${sx}" y2="${sy}"/>`);
      if (n.d && n.d.startsWith('8') && !beamed.has(i)) parts.push(`<path class="nt-flag" d="M${sx} ${sy} q ${up ? '9 10 6 22' : '9 -10 6 -22'}"/>`);
    }
    // articulações (do lado oposto à haste)
    const ay = up ? y + 10 : y - 10;
    if (n.art === 'stacc') parts.push(`<circle class="nt-fill" cx="${x}" cy="${ay}" r="1.9"/>`);
    if (n.art === 'acc') parts.push(`<path class="nt-line" d="M${x - 6} ${ay - 3} L${x + 6} ${ay} L${x - 6} ${ay + 3}"/>`);
    if (n.art === 'ten') parts.push(`<line class="nt-line" x1="${x - 6}" x2="${x + 6}" y1="${ay}" y2="${ay}"/>`);
    if (n.fermata) parts.push(`<text class="nt-glyph nt-fermata" x="${x - 9}" y="${TOPY - 8}">𝄐</text>`);
    if (n.tr) parts.push(`<text class="nt-tr" x="${x - 6}" y="${TOPY - 10}">tr</text>`);
    if (n.harm) parts.push(`<circle class="nt-line" cx="${x}" cy="${TOPY - 12}" r="3.2"/>`);
    if (n.lyric) parts.push(`<text class="nt-lyric" x="${x}" y="${BOT + 34}">${esc(n.lyric)}</text>`);
    if (n.label) parts.push(`<text class="nt-label" x="${x}" y="${BOT + (n.lyric ? 50 : 34)}">${esc(n.label)}</text>`);
    if (n.dyn) parts.push(`<text class="nt-glyph nt-dyn" x="${x - 6}" y="${BOT + 30}">${{ p: '𝆏', f: '𝆑', mf: '𝆐𝆑', mp: '𝆐𝆏', pp: '𝆏𝆏', ff: '𝆑𝆑' }[n.dyn]}</text>`);
    x += (n.space || 1) * gap;
    if ((opts.bars || []).includes(i)) {
      parts.push(`<line class="nt-bar" x1="${x - gap / 2 + 6}" x2="${x - gap / 2 + 6}" y1="${TOPY}" y2="${BOT}"/>`);
      x += 8;
    }
  });
  // barras de ligação (colcheias)
  (opts.beams || []).forEach(([a, b]) => {
    const A = stemInfo[a]; const B = stemInfo[b];
    if (!A || !B) return;
    const up = A.up;
    const ys = stemInfo.slice(a, b + 1).map((s) => s.y);
    const yb = up ? Math.min(...ys) - 30 : Math.max(...ys) + 30;
    for (let i = a; i <= b; i++) {
      const s = stemInfo[i];
      parts.push(`<line class="nt-stem" x1="${s.sx}" y1="${s.y}" x2="${s.sx}" y2="${yb}"/>`);
    }
    parts.push(`<line class="nt-beam" x1="${A.sx}" x2="${B.sx}" y1="${yb}" y2="${yb}"/>`);
  });
  (opts.tuplets || []).forEach(([a, b, t]) => {
    const mx = (xs[a] + xs[b]) / 2;
    parts.push(`<text class="nt-tuplet" x="${mx}" y="${TOPY - 14}">${t}</text>`);
  });
  (opts.slurs || []).forEach(([a, b]) => {
    const ya = yOf(parsePitch(notes[a].p).step); const yb = yOf(parsePitch(notes[b].p).step);
    const top = Math.min(ya, yb) - 26;
    parts.push(`<path class="nt-slur" d="M${xs[a]} ${ya - 10} C ${xs[a] + 10} ${top}, ${xs[b] - 10} ${top}, ${xs[b]} ${yb - 10}"/>`);
  });
  (opts.hairpins || []).forEach(([a, b, t]) => {
    const y = BOT + 26; const x1 = xs[a] + (notes[a].dyn ? 16 : 0); const x2 = xs[b] - (notes[b].dyn ? 12 : 0);
    if (t === '<') parts.push(`<path class="nt-line" d="M${x2} ${y - 5} L${x1} ${y} L${x2} ${y + 5}"/>`);
    else parts.push(`<path class="nt-line" d="M${x1} ${y - 5} L${x2} ${y} L${x1} ${y + 5}"/>`);
  });
  (opts.breath || []).forEach((i) => parts.push(`<text class="nt-breath" x="${xs[i] + gap / 2 - 2}" y="${TOPY - 4}">,</text>`));
  if (opts.vibrato) parts.push(`<path class="nt-line" d="M${xs[0] + 10} ${TOPY - 16} ${Array.from({ length: 10 }, (_, k) => `q 4 ${k % 2 ? 5 : -5} 8 0`).join(' ')}"/>`);
  const W = opts.width || x + 10;
  const lines = [0, 1, 2, 3, 4].map((i) => `<line class="nt-staff" x1="6" x2="${W - 6}" y1="${TOPY + i * S}" y2="${TOPY + i * S}"/>`).join('');
  const end = opts.final === false ? '' : `<line class="nt-bar" x1="${W - 10}" x2="${W - 10}" y1="${TOPY}" y2="${BOT}"/><line class="nt-bar nt-bar--thick" x1="${W - 6}" x2="${W - 6}" y1="${TOPY}" y2="${BOT}"/>`;
  const H = BOT + (notes.some((n) => n.label && n.lyric) ? 58 : notes.some((n) => n.label || n.lyric || n.dyn) || opts.hairpins ? 44 : 20);
  return `<svg class="notation" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.aria || 'Exemplo em partitura')}">${lines}<text class="nt-glyph nt-clef" x="12" y="${BOT - S}">𝄞</text>${end}${parts.join('')}</svg>`;
}

const q = (p, extra = {}) => ({ p, d: 'q', ...extra });
const e = (p, extra = {}) => ({ p, d: '8', ...extra });
const lbl = (arr) => arr.map((p) => q(p, { label: parsePitch(p).name }));

export const STAFF = {
  'first-notes': () => staff(lbl(['B4', 'A4', 'G4']), { aria: 'As notas Si, Lá e Sol na pauta' }),
  rhythm: () => staff([{ p: 'G4', d: 'h', label: 'mínima' }, { p: 'G4', d: 'h' }, q('A4', { label: 'semínima' }), q('A4'), e('B4', { label: 'colcheias' }), e('B4'), e('A4'), e('G4')], { time: '4/4', bars: [1], beams: [[4, 5], [6, 7]], aria: 'Mínimas, semínimas e colcheias em 4/4' }),
  'long-tone': () => staff([{ p: 'G4', d: 'w', dyn: 'p' }, { p: 'G4', d: 'w', dyn: 'f', space: 1.6 }, { p: 'G4', d: 'w', dyn: 'p' }], { gap: 62, hairpins: [[0, 1, '<'], [1, 2, '>']], aria: 'Nota longa com crescendo e diminuendo' }),
  dynamics: () => staff([q('G4', { dyn: 'pp' }), q('A4'), q('B4', { dyn: 'mf' }), q('C5'), q('D5', { dyn: 'ff' })], { gap: 44, hairpins: [[0, 4, '<']], aria: 'Dinâmicas de pianíssimo a fortíssimo' }),
  breath: () => staff([q('C5'), q('D5'), q('E5'), q('C5'), q('D5'), q('B4'), { p: 'C5', d: 'h' }], { breath: [3], slurs: [[0, 3], [4, 6]], aria: 'Sinal de respiração entre duas frases' }),
  legato: () => staff([q('G4'), q('A4'), q('B4'), q('C5')], { slurs: [[0, 3]], aria: 'Notas ligadas por uma ligadura' }),
  staccato: () => staff([q('G4', { art: 'stacc' }), q('A4', { art: 'stacc' }), q('B4', { art: 'stacc' }), q('C5', { art: 'stacc' })], { aria: 'Notas em staccato' }),
  accent: () => staff([q('G4', { art: 'acc' }), q('A4'), q('B4', { art: 'acc' }), q('C5')], { aria: 'Notas com acento' }),
  articulations: () => staff([q('G4', { label: 'ligado' }), q('A4'), q('B4', { art: 'stacc', label: 'staccato' }), q('C5', { art: 'stacc' }), q('D5', { art: 'acc', label: 'acento' }), q('C5', { art: 'ten', label: 'tenuto' })], { slurs: [[0, 1]], gap: 42, aria: 'Legato, staccato, acento e tenuto' }),
  'c-major': () => staff(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map((p) => q(p, { label: parsePitch(p).name })), { gap: 30, aria: 'Escala de Dó maior' }),
  'a-minor': () => staff(['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'].map((p) => q(p, { label: parsePitch(p).name })), { gap: 30, aria: 'Escala de Lá menor natural' }),
  chromatic: () => staff(['C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5'].map((p) => q(p)), { gap: 28, aria: 'Escala cromática' }),
  arpeggio: () => staff(['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'].map((p) => q(p, { label: parsePitch(p).name })), { gap: 32, aria: 'Arpejo de Dó maior' }),
  thirds: () => staff(['C4', 'E4', 'D4', 'F4', 'E4', 'G4', 'F4', 'A4'].map((p) => e(p)), { beams: [[0, 1], [2, 3], [4, 5], [6, 7]], gap: 28, aria: 'Escala em terças' }),
  harmonics: () => staff([{ p: 'C4', d: 'w', label: 'Dó' }, { p: 'C5', d: 'w', label: 'Dó', harm: true }, { p: 'G5', d: 'w', label: 'Sol', harm: true }, { p: 'C6', d: 'w', label: 'Dó', harm: true }], { gap: 48, aria: 'Série de harmônicos com a digitação do Dó grave' }),
  octaves: () => staff([{ p: 'C4', d: 'h' }, { p: 'C5', d: 'h' }, { p: 'D4', d: 'h' }, { p: 'D5', d: 'h' }], { slurs: [[0, 1], [2, 3]], bars: [1], gap: 44, aria: 'Oitavas ligadas' }),
  dotted: () => staff([{ p: 'C5', d: 'q.' }, e('D5'), { p: 'E5', d: 'q.' }, e('F5'), { p: 'G5', d: 'h' }], { time: '4/4', bars: [3], gap: 40, aria: 'Ritmo pontuado' }),
  phrase: () => staff([q('E4', { dyn: 'p' }), q('G4'), q('C5'), q('E5'), { p: 'G5', d: 'h', dyn: 'f' }, q('E5'), q('C5'), { p: 'D5', d: 'h', dyn: 'p', fermata: true }], { slurs: [[0, 7]], hairpins: [[0, 4, '<'], [4, 7, '>']], gap: 36, aria: 'Frase com crescendo até o ponto culminante e diminuendo' }),
  ornaments: () => staff([{ p: 'B4', d: 'h', tr: true, label: 'trinado' }, { p: 'A4', d: 'h', grace: 'B4', label: 'apojatura', space: 1.4 }], { gap: 70, aria: 'Trinado e apojatura' }),
  fermata: () => staff([q('G4'), q('A4'), { p: 'B4', d: 'h', fermata: true }], { gap: 44, aria: 'Nota com fermata' }),
};

export const SYLLABLES = {
  syllables: () => staff([q('A4', { art: 'stacc', lyric: 'tu' }), q('A4', { art: 'stacc', lyric: 'tu' }), q('A4', { art: 'stacc', lyric: 'tu' }), q('A4', { art: 'stacc', lyric: 'tu' })], { gap: 44, aria: 'Ataque simples com a sílaba tu' }),
  'syllables-double': () => staff(['tu', 'cu', 'tu', 'cu', 'tu', 'cu', 'tu', 'cu'].map((s) => e('A4', { lyric: s })), { beams: [[0, 3], [4, 7]], gap: 30, aria: 'Duplo golpe de língua: tu-cu' }),
  'syllables-triple': () => staff(['tu', 'cu', 'tu', 'tu', 'cu', 'tu'].map((s) => e('A4', { lyric: s })), { beams: [[0, 2], [3, 5]], tuplets: [[0, 2, '3'], [3, 5, '3']], gap: 32, aria: 'Triplo golpe de língua: tu-cu-tu' }),
};

/* ───────────── Dedilhados (flauta Boehm) ───────────── */
// Ordem: polegar esquerdo (Si), L1, L2, L3, R1, R2, R3, mínimo direito (Ré♯).
const FINGER = {
  B: [1, 1, 0, 0, 0, 0, 0, 1],
  A: [1, 1, 1, 0, 0, 0, 0, 1],
  G: [1, 1, 1, 1, 0, 0, 0, 1],
  F: [1, 1, 1, 1, 1, 0, 0, 1],
  E: [1, 1, 1, 1, 1, 1, 0, 1],
  D: [1, 1, 1, 1, 1, 1, 1, 0],
};
const FNAME = { B: 'Si', A: 'Lá', G: 'Sol', F: 'Fá', E: 'Mi', D: 'Ré' };
export function fingering(letter, withName = true) {
  const f = FINGER[letter];
  const holes = [1, 2, 3, 4, 5, 6].map((k, i) => {
    const y = 26 + i * 22 + (i > 2 ? 12 : 0);
    return `<circle cx="40" cy="${y}" r="8.5" class="${f[k] ? 'fg-on' : 'fg-off'}"/>`;
  }).join('');
  return `<figure class="fingering"><svg viewBox="0 0 80 190" role="img" aria-label="Dedilhado da nota ${FNAME[letter]}">
    <rect x="31" y="8" width="18" height="174" rx="9" class="fg-tube"/>
    <ellipse cx="18" cy="30" rx="6" ry="9" class="${f[0] ? 'fg-on' : 'fg-off'}"/>
    <text x="10" y="54" class="fg-tag">pol.</text>
    ${holes}
    <line x1="22" x2="58" y1="${26 + 2 * 22 + 17}" y2="${26 + 2 * 22 + 17}" class="fg-split"/>
    <ellipse cx="64" cy="168" rx="7" ry="5" class="${f[7] ? 'fg-on' : 'fg-off'}"/>
    <text x="54" y="186" class="fg-tag">Ré♯</text>
  </svg>${withName ? `<figcaption>${FNAME[letter]}</figcaption>` : ''}</figure>`;
}

/* ───────────── Ilustrações ───────────── */
const fluteImg = (prefix, cls = 'realflute') => `<img class="${cls}" src="${prefix}assets/img/flauta.webp" alt="Flauta transversal" width="1280" height="81" loading="lazy" decoding="async">`;

const ILLU = {
  'flute-parts': (prefix) => `<figure class="v-parts">
    <div class="v-parts__img">${fluteImg(prefix)}
      <span class="v-pin v-pin--up" style="--x:10.3%"><i></i><b>Porta-lábio</b></span>
      <span class="v-pin" style="--x:4%"><i></i><b>Coroa</b></span>
      <span class="v-pin" style="--x:55%"><i></i><b>Corpo e chaves</b></span>
      <span class="v-pin v-pin--up" style="--x:90%"><i></i><b>Pé</b></span>
    </div>
    <div class="v-parts__bar"><span style="--w:27%">Cabeça</span><span style="--w:54%">Corpo</span><span style="--w:19%">Pé</span></div>
  </figure>`,
  assembly: (prefix) => `<figure class="v-assembly" aria-label="Montagem: cabeça, corpo e pé se encaixam">
    <div class="v-assembly__row">
      <span class="v-seg v-seg--1" style="--a:0%;--b:27%"><img src="${prefix}assets/img/flauta.webp" alt="" loading="lazy"></span>
      <span class="v-seg v-seg--2" style="--a:27%;--b:81%"><img src="${prefix}assets/img/flauta.webp" alt="" loading="lazy"></span>
      <span class="v-seg v-seg--3" style="--a:81%;--b:100%"><img src="${prefix}assets/img/flauta.webp" alt="" loading="lazy"></span>
    </div>
    <figcaption>Cabeça → corpo → pé, com leve rotação. O orifício alinha com o centro das primeiras chaves.</figcaption>
  </figure>`,
  'support-points': (prefix) => `<figure class="v-parts v-support">
    <div class="v-parts__img">${fluteImg(prefix)}
      <span class="v-dot" style="--x:10%"><b>1 · Queixo / lábio</b></span>
      <span class="v-dot v-dot--up" style="--x:43%"><b>2 · Base do indicador esquerdo</b></span>
      <span class="v-dot" style="--x:67%"><b>3 · Polegar direito (por baixo)</b></span>
    </div>
  </figure>`,
  'air-edge': () => `<figure class="v-svg"><svg viewBox="0 0 320 150" role="img" aria-label="O jato de ar se divide na borda do orifício">
    <path d="M40 98 H150 A30 18 0 0 0 210 98 H300" class="ill-wall"/>
    <path d="M40 112 H300" class="ill-wall ill-wall--thin"/>
    <path d="M10 60 C 80 64, 140 76, 206 90" class="ill-air"/>
    <path d="M206 90 C 220 94, 236 104, 248 120" class="ill-air ill-air--in"/>
    <path d="M206 90 C 230 86, 262 76, 300 66" class="ill-air ill-air--out"/>
    <circle cx="206" cy="94" r="4" class="ill-dot"/>
    <text x="196" y="140" class="ill-txt">borda</text><text x="12" y="48" class="ill-txt">jato de ar</text>
  </svg><figcaption>O ar se divide na borda: parte entra, parte sai — e a coluna de ar vibra.</figcaption></figure>`,
  embouchure: () => `<figure class="v-svg"><svg viewBox="0 0 320 170" role="img" aria-label="Embocadura: lábios relaxados direcionando o ar para a borda do orifício">
    <path d="M30 40 C 70 30, 100 44, 118 70 C 122 78, 112 84, 100 82 C 80 80, 60 74, 30 76 Z" class="ill-lip"/>
    <path d="M30 110 C 70 120, 104 110, 120 94 C 124 88, 114 84, 102 86 C 80 90, 60 96, 30 96 Z" class="ill-lip"/>
    <path d="M122 84 C 160 86, 190 92, 214 104" class="ill-air"/>
    <path d="M150 126 H200 A26 14 0 0 0 252 126 H300" class="ill-wall"/>
    <path d="M150 140 H300" class="ill-wall ill-wall--thin"/>
    <circle cx="214" cy="108" r="3.6" class="ill-dot"/>
    <text x="24" y="24" class="ill-txt">lábios relaxados</text><text x="210" y="162" class="ill-txt">porta-lábio</text>
  </svg><figcaption>Abertura pequena e flexível; o ar mira a borda do orifício.</figcaption></figure>`,
  breath: () => `<figure class="v-svg v-breath"><svg viewBox="0 0 220 200" role="img" aria-label="Respiração: expansão ao redor da cintura e das costelas, ombros relaxados">
    <path d="M70 30 C 70 14, 150 14, 150 30" class="ill-wall ill-wall--thin"/>
    <path d="M60 46 L40 52 M160 46 L180 52" class="ill-wall ill-wall--thin"/>
    <g class="ill-lungs"><path d="M104 60 C 70 60, 58 110, 62 150 C 78 158, 96 150, 104 140 Z"/><path d="M116 60 C 150 60, 162 110, 158 150 C 142 158, 124 150, 116 140 Z"/></g>
    <path class="ill-diaph" d="M54 160 C 90 140, 130 140, 166 160"/>
    <path d="M40 120 l-14 0 m0 0 l6 -5 m-6 5 l6 5 M180 120 l14 0 m0 0 l-6 -5 m6 5 l-6 5" class="ill-arrow"/>
    <text x="70" y="192" class="ill-txt">diafragma desce</text><text x="58" y="12" class="ill-txt">ombros soltos</text>
  </svg><figcaption>Expansão ao redor da cintura e das costelas — os ombros não sobem.</figcaption></figure>`,
  metronome: () => `<figure class="v-svg v-metro"><svg viewBox="0 0 160 190" role="img" aria-label="Metrônomo">
    <path d="M40 176 L62 22 H98 L120 176 Z" class="ill-body"/>
    <g class="ill-pendulum"><line x1="80" y1="150" x2="80" y2="36"/><rect x="72" y="70" width="16" height="12" rx="2"/></g>
    <circle cx="80" cy="150" r="5" class="ill-dot"/>
  </svg><figcaption>Pulso estável: a base de todo ritmo.</figcaption></figure>`,
  tuner: () => `<figure class="v-svg v-tuner"><svg viewBox="0 0 220 140" role="img" aria-label="Afinador: o ponteiro busca o centro">
    <path d="M30 110 A80 80 0 0 1 190 110" class="ill-wall ill-wall--thin"/>
    ${[-40, -20, 0, 20, 40].map((a) => `<line x1="110" y1="38" x2="110" y2="48" transform="rotate(${a} 110 110)" class="${a ? 'ill-tick' : 'ill-tick ill-tick--c'}"/>`).join('')}
    <line class="ill-needle" x1="110" y1="110" x2="110" y2="44"/>
    <circle cx="110" cy="110" r="5" class="ill-dot"/>
    <text x="22" y="132" class="ill-txt">baixo</text><text x="98" y="30" class="ill-txt">ok</text><text x="170" y="132" class="ill-txt">alto</text>
  </svg><figcaption>Ouça primeiro; confira depois.</figcaption></figure>`,
  wave: () => `<figure class="v-svg v-wave"><svg viewBox="0 0 320 90" role="img" aria-label="Onda sonora estável">
    <path class="ill-wave" d="M0 45 ${Array.from({ length: 16 }, (_, k) => `q 10 ${k % 2 ? 28 : -28} 20 0`).join(' ')}"/>
  </svg><figcaption>Som estável, centrado, sem ar desperdiçado.</figcaption></figure>`,
  vibrato: () => `<figure class="v-svg v-wave"><svg viewBox="0 0 320 90" role="img" aria-label="Vibrato: oscilação regular do som">
    <path class="ill-wave ill-wave--soft" d="M0 45 ${Array.from({ length: 32 }, (_, k) => `q 5 ${(k % 2 ? 1 : -1) * (10 + 12 * Math.abs(Math.sin(k / 5)))} 10 0`).join(' ')}"/>
  </svg><figcaption>Pulsações regulares de intensidade — com intenção.</figcaption></figure>`,
};

/** Renderiza a ilustração de uma chave de visual. */
export function visual(key, { prefix = '' } = {}) {
  if (!key) return '';
  if (key.startsWith('photo:')) return `<figure class="v-photo">${photo(+key.slice(6), { prefix, sizes: '(min-width: 900px) 30vw, 90vw' })}</figure>`;
  if (key.startsWith('staff:')) {
    const id = key.slice(6);
    return STAFF[id] ? `<figure class="v-staff">${STAFF[id]()}</figure>` : '';
  }
  if (key.startsWith('note:')) {
    const p = key.slice(5);
    if (p === 'whole') return `<figure class="v-staff">${staff([{ p: 'B4', d: 'w' }], { time: '4/4', gap: 60, aria: 'Uma semibreve' })}</figure>`;
    return `<figure class="v-staff">${staff([q(p)], { gap: 60, aria: 'Uma nota na pauta' })}</figure>`;
  }
  if (key.startsWith('dyn:')) return `<figure class="v-dyn"><span class="nt-glyph">${{ p: '𝆏', f: '𝆑' }[key.slice(4)]}</span></figure>`;
  if (key.startsWith('fingering:')) return `<div class="v-fingerings">${key.slice(10).split(',').map((l) => fingering(l)).join('')}</div>`;
  if (SYLLABLES[key]) return `<figure class="v-staff">${SYLLABLES[key]()}</figure>`;
  if (ILLU[key]) return ILLU[key](prefix);
  return '';
}

/** Visual principal (cabeçalho) de uma etapa. */
export function heroVisual(h, prefix = '') {
  if (!h) return '';
  if (h.kind === 'photo') return `<figure class="v-photo v-photo--hero">${photo(h.photo, { prefix, sizes: '(min-width: 900px) 40vw, 92vw' })}</figure>`;
  if (h.kind === 'staff') return visual('staff:' + h.id, { prefix });
  if (h.src) return `<figure class="v-photo v-photo--hero"><img src="${h.src}" alt="" style="object-position:${h.pos || '50% 50%'}" loading="lazy"></figure>`;
  return visual(h.kind, { prefix });
}
