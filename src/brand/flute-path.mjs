/**
 * Identidade visual de The Flute Journey: uma linha reta que se transforma em flauta transversal
 * e volta a ser linha — um traço contínuo, sem tirar o lápis do papel.
 * Proporções medidas sobre uma flauta real (foto de referência 1280 px → viewBox de 600):
 * coroa, porta-lábio com o orifício (≈10 %), anéis da junção cabeça/corpo (≈27 % e 32 %),
 * chave de trilo, chave do polegar, chaves abertas com furo (≈50–75 %), a alavanca curva
 * do Sol♯, o grupo do Ré♯ (≈79 %) e as três chaves de rolete do pé, penduradas por baixo.
 * Coordenadas no viewBox 0 0 600 90 (a linha entra e sai em y = 45).
 */
const TOP = 37;
const BOTTOM = 53;
const MID = 45;
const n = (v) => Math.round(v * 10) / 10;
const c = (...p) => ` C${p.map(n).join(' ')}`;

/** Laço que cai da borda de cima e volta a ela (a chave). `hole` = chave aberta com furo. */
function keyLoop(x, r, wob = 0, hole = false) {
  const cy = MID + wob * 0.5;
  let d = c(x - r * 0.1, TOP - 1, x + r, cy - r * 0.95, x + r * 1.02, cy + wob * 0.3);
  d += c(x + r * 1.04, cy + r * 1.12, x - r * 0.98, cy + r * 1.08, x - r, cy);
  if (hole) {
    d += c(x - r * 0.98, cy - r * 0.45, x - r * 0.1, cy - r * 0.5, x + r * 0.05, cy - r * 0.05);
    d += c(x + r * 0.2, cy + r * 0.35, x - r * 0.45, cy + r * 0.4, x - r * 0.35, cy - r * 0.1);
    d += c(x - r * 0.25, cy - r * 0.75, x + r * 0.3, TOP - 0.5, x + r * 1.4, TOP + 0.2);
  } else {
    d += c(x - r * 1.02, cy - r * 0.85, x - r * 0.2, TOP - 0.6, x + r * 1.4, TOP + 0.2);
  }
  return d;
}

/** Chave de rolete do pé, pendurada por baixo do tubo. */
function footKey(x, r) {
  const cy = BOTTOM + r * 0.95;
  let d = c(x - r * 0.4, BOTTOM + 0.3, x + r * 1.05, cy - r * 0.9, x + r, cy);
  d += c(x + r * 0.98, cy + r * 1.1, x - r * 1.02, cy + r * 1.05, x - r, cy);
  d += c(x - r * 0.98, cy - r * 1.0, x + r * 0.4, BOTTOM - 0.4, x + r * 2.1, BOTTOM);
  return d;
}

/** Anel: a linha desce até a borda de baixo, dá uma voltinha e sobe de novo. */
function ring(x) {
  return (
    c(x - 2, TOP, x, TOP + 2, x, TOP + 7) +
    c(x, BOTTOM - 4, x - 1, BOTTOM + 1, x + 1.8, BOTTOM + 1.2) +
    c(x + 4.5, BOTTOM + 1.5, x + 3.6, BOTTOM - 3, x + 3.6, TOP + 7) +
    c(x + 3.6, TOP + 2, x + 6, TOP, x + 10, TOP)
  );
}

export function flutePath() {
  // entra pela esquerda e contorna a coroa
  let d = `M0 ${MID}` + c(6, MID, 9, 49, 11, 52) + c(14, 56, 18, 51, 15, 45) + c(12, 39, 6, 36, 9, TOP + 0.5) + c(11, TOP - 0.4, 14, TOP, 20, TOP);
  // cabeça e porta-lábio (≈ x 42–81), orifício num laço que cai para dentro (≈ x 62)
  d += c(28, TOP - 0.3, 35, TOP + 0.3, 41, TOP);
  d += c(44, TOP - 9, 78, TOP - 10, 82, TOP - 1);
  d += c(84, TOP + 4, 66, TOP + 6, 62, TOP + 3) + c(58, TOP, 67, TOP - 1.6, 74, TOP + 1) + c(82, TOP + 2, 90, TOP, 100, TOP);
  d += c(120, TOP - 0.6, 140, TOP + 0.6, 156, TOP);
  // anéis da junção cabeça/corpo
  d += ring(159) + c(176, TOP, 184, TOP, 190, TOP) + ring(193);
  // corpo: chave de trilo (pequena), chave do polegar (fechada)
  d += c(215, TOP - 0.4, 236, TOP + 0.4, 252, TOP);
  d += keyLoop(258, 4.2, 0.3);
  d += keyLoop(285, 7, -0.4);
  // mão esquerda: chaves abertas
  const w = [0.5, -0.4, 0.3, -0.3, 0.4, -0.5, 0.3, -0.4];
  d += keyLoop(303, 7.6, w[0], true) + keyLoop(321, 7.6, w[1], true);
  d += keyLoop(341, 7.6, w[2], true);
  // alavanca do Sol♯: cacho que sobe acima do tubo
  d += c(345, TOP - 0.5, 347, TOP - 12, 353, TOP - 13) + c(359, TOP - 14, 360, TOP - 5, 354, TOP - 6) + c(350, TOP - 7, 352, TOP - 1, 356, TOP);
  d += keyLoop(360, 7.6, w[3], true) + keyLoop(379, 7.6, w[4], true);
  // mão direita
  d += c(386, TOP, 390, TOP, 392, TOP);
  d += keyLoop(401, 7.8, w[5], true) + keyLoop(425, 7.8, w[6], true) + keyLoop(449, 7.8, w[7], true);
  // grupo do Ré♯ com o trilo por cima
  d += c(462, TOP, 466, TOP - 7, 473, TOP - 7) + c(480, TOP - 7, 482, TOP, 486, TOP);
  // pé: chaves de rolete penduradas na borda de baixo
  d += c(490, TOP, 492, TOP + 4, 493, TOP + 9) + c(494, BOTTOM - 3, 495, BOTTOM, 497, BOTTOM);
  d += footKey(502, 5.6) + footKey(532, 5.8) + footKey(562, 5.6);
  // a ponta: sobe pela boca do tubo, volta ao meio e segue como linha reta
  d += c(580, BOTTOM - 1, 584, TOP + 3, 580, TOP + 1) + c(576, TOP - 1, 574, TOP + 6, 580, MID - 2) + c(585, MID, 590, MID, 600, MID);
  return d;
}

/** Versão curta para o monograma (viewBox 0 0 330 90). */
export function fluteMarkPath() {
  let d = `M0 ${MID}` + c(6, MID, 9, 49, 11, 52) + c(14, 56, 18, 51, 15, 45) + c(12, 39, 6, 36, 9, TOP + 0.5) + c(11, TOP - 0.4, 14, TOP, 22, TOP);
  d += c(26, TOP - 9, 60, TOP - 10, 64, TOP - 1);
  d += c(66, TOP + 4, 48, TOP + 6, 44, TOP + 3) + c(40, TOP, 49, TOP - 1.6, 56, TOP + 1) + c(64, TOP + 2, 84, TOP, 98, TOP);
  d += ring(104);
  d += c(122, TOP, 128, TOP, 134, TOP);
  [[150, 10.5, 0.5], [176, 11, -0.5], [202, 10.5, 0.4], [228, 10.8, -0.4]].forEach(([x, r, wob]) => (d += keyLoop(x, r, wob, true)));
  d += ring(248);
  d += c(266, TOP, 270, TOP + 4, 272, TOP + 9) + c(274, BOTTOM - 3, 275, BOTTOM, 280, BOTTOM) + footKey(288, 5.5);
  d += c(304, BOTTOM - 1, 308, TOP + 3, 304, TOP + 1) + c(300, TOP - 1, 298, TOP + 6, 304, MID - 2) + c(310, MID, 318, MID, 330, MID);
  return d;
}

export const FLUTE_PATH = flutePath();
export const FLUTE_MARK_PATH = fluteMarkPath();

/** Monograma circular (logo). */
export const markSVG = (cls = 'mark', stroke = 'currentColor') => `
<svg class="${cls}" viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <circle cx="20" cy="20" r="18.5" stroke="${stroke}" stroke-opacity=".35" stroke-width=".8"/>
  <g transform="rotate(-35 20 20) translate(2 15.1) scale(.109)"><path d="${FLUTE_MARK_PATH}" stroke="${stroke}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
</svg>`;

/** A linha que vira flauta e continua linha (hero e divisores). */
export const fluteLineSVG = (cls = 'fline') => `
<div class="${cls}" aria-hidden="true">
  <span class="fline__in"></span>
  <svg class="fline__svg" viewBox="0 0 600 90" fill="none">
    <path class="fline__path" d="${FLUTE_PATH}" pathLength="1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="fline__notes" fill="currentColor">
      <g class="fline__note"><ellipse cx="66" cy="18" rx="3.4" ry="2.5" transform="rotate(-20 66 18)"/><path d="M69 17.5V5l5 3" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/></g>
      <g class="fline__note fline__note--2"><ellipse cx="82" cy="11" rx="3" ry="2.2" transform="rotate(-20 82 11)"/><path d="M84.6 10.5V0" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/></g>
    </g>
  </svg>
  <span class="fline__out"></span>
</div>`;
