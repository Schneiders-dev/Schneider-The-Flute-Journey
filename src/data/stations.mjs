// As 17 etapas da jornada, com conteúdo enxuto e visual.
// Cada tópico: `short` (uma frase visível) + `text`/`practice` (em "Saiba mais") + `visual` opcional.
// `video`: URL do YouTube/Vimeo ou arquivo enviado pelo editor (vazio = sem vídeo).
// `free`: etapas que o aluno pode desbloquear sozinho, pelas provas. As demais são liberadas nas aulas.
import { chapters, stations as STATION_LIST } from './journey.mjs';

const topicIndex = Object.fromEntries(chapters.flatMap((c) => c.topics.map((t) => [t.id, t])));

const T = (id, short, visual, extra = {}) => {
  const base = topicIndex[id] || {};
  return { id, title: base.title, short, text: base.text, practice: base.practice, visual: visual || '', video: '', ...extra };
};

const META = {
  inicio: {
    hero: { kind: 'flute-parts' },
    topics: [
      T('conhecendo', 'O som nasce do ar soprado contra a borda do orifício — sem palheta, sem vibração dos lábios.', 'air-edge'),
      T('partes', 'Cabeça, corpo e pé: três partes, um único instrumento.', 'flute-parts'),
    ],
  },
  'primeiro-contato': {
    hero: { kind: 'assembly' },
    topics: [
      T('montagem', 'Encaixe com leve rotação, segurando pelas partes lisas.', 'assembly'),
      T('desmontagem', 'Ordem inversa, mesmo cuidado.', ''),
      T('conservacao', 'Vareta e pano depois de tocar; sempre guardada no estojo.', 'photo:3'),
      T('postura', 'A flauta vem até você — ombros soltos, cabeça alinhada.', 'photo:2'),
      T('maos', 'Três pontos de apoio: queixo, base do indicador esquerdo e polegar direito.', 'support-points'),
    ],
  },
  'primeiro-som': {
    hero: { kind: 'embouchure' },
    topics: [
      T('embocadura', 'Lábios relaxados, abertura pequena, ar dirigido à borda.', 'embouchure'),
      T('primeiro-som', 'Comece só com a cabeça da flauta: som claro, mesmo que pequeno.', ''),
      T('respiracao-pp', 'Inspire sem subir os ombros; expire sem empurrar.', 'breath'),
      T('primeiras-notas', 'Si, Lá e Sol: as primeiras notas mais estáveis.', 'fingering:B,A,G'),
      T('digitacao', 'Movimentos pequenos e precisos, mão sempre na mesma posição.', 'fingering:F,E,D'),
      T('leitura', 'Ler é transformar símbolos em som.', 'staff:first-notes'),
      T('primeiras-musicas', 'Melodias que você conhece de ouvido são as melhores primeiras músicas.', ''),
    ],
  },
  fundamentos: {
    hero: { kind: 'metronome' },
    topics: [
      T('som', 'Seu som é sua identidade: comece imaginando o som que quer ter.', 'wave'),
      T('ritmo', 'Ritmo sólido dá liberdade ao fraseado.', 'staff:rhythm'),
      T('metronomo', 'O metrônomo mede e constrói a regularidade.', 'metronome'),
      T('leitura-f', 'Leia um pouco todos os dias, com material mais fácil que o seu nível.', ''),
    ],
  },
  'construcao-som': {
    hero: { kind: 'staff', id: 'long-tone' },
    topics: [
      T('long-tones', 'Nota longa: início limpo, som estável, final controlado.', 'staff:long-tone'),
      T('dinamica', 'Mudar a dinâmica sem mudar a afinação.', 'staff:dynamics'),
    ],
  },
  respiracao: {
    hero: { kind: 'breath' },
    topics: [
      T('respiracao-f', 'Respirar bem é administrar o ar ao longo da frase.', 'staff:breath'),
      T('apoio', 'Fluxo de ar estável, sustentado pelo corpo — sem rigidez.', 'breath'),
    ],
  },
  articulacao: {
    hero: { kind: 'staff', id: 'articulations' },
    topics: [
      T('ataques', 'A língua libera o ar — “tu” ou “du” —, sem bater.', 'syllables'),
      T('legato', 'Ligado: a linha continua entre as notas.', 'staff:legato'),
      T('staccato', 'Destacado: nota curta, som cheio.', 'staff:staccato'),
    ],
  },
  afinacao: {
    hero: { kind: 'tuner' },
    topics: [
      T('afinacao', 'Afinar é ouvir: ajuste até o som parar de ondular.', 'tuner'),
      T('escalas-f', 'Primeiras escalas: Sol, Fá e Dó maiores.', 'staff:c-major'),
      T('arpejos-f', 'Arpejo: as notas do acorde, uma de cada vez.', 'staff:arpeggio'),
    ],
  },
  tecnica: {
    hero: { kind: 'staff', id: 'octaves' },
    topics: [
      T('flexibilidade', 'Harmônicos: uma digitação, várias notas.', 'staff:harmonics'),
      T('intervalos', 'Saltos revelam se a embocadura está flexível.', 'staff:octaves'),
      T('agudo', 'Agudo é ar rápido e direcionado — não força.', ''),
      T('velocidade', 'Velocidade é consequência de controle.', 'metronome'),
      T('coordenacao', 'Língua e dedos chegando juntos.', 'staff:dotted'),
    ],
  },
  escalas: {
    hero: { kind: 'staff', id: 'c-major' },
    topics: [
      T('escalas-maiores', 'Todas as tonalidades maiores, em toda a extensão.', 'staff:c-major'),
      T('escalas-menores', 'Natural, harmônica e melódica: três cores.', 'staff:a-minor'),
      T('cromatica', 'Todos os semitons, com regularidade absoluta.', 'staff:chromatic'),
      T('arpejos', 'Maiores, menores, de sétima e diminutos.', 'staff:arpeggio'),
      T('tercas', 'Escalas em terças: outra forma de enxergar a tonalidade.', 'staff:thirds'),
    ],
  },
  estudos: {
    hero: { kind: 'photo', photo: 4 },
    topics: [
      T('articulacao', 'A articulação é a dicção da flauta.', 'staff:articulations'),
      T('duplo', '“Tu-cu”: duas sílabas para passagens rápidas.', 'syllables-double'),
      T('triplo', '“Tu-cu-tu”: para tercinas rápidas.', 'syllables-triple'),
    ],
  },
  repertorio: {
    hero: { kind: 'photo', photo: 13 },
    topics: [
      { id: 'rep-escolha', title: 'Escolher o repertório', short: 'Cada obra é escolhida pelo que ela ensina.', text: 'Uma boa obra para o seu momento tem desafios possíveis e muita música. Obras difíceis demais cedo costumam consolidar tensões e erros.', practice: 'Escolha com seu professor uma obra “de crescimento” e outra “de consolidação”.', visual: '', video: '' },
      { id: 'rep-periodos', title: 'Uma obra de cada período', short: 'Barroco, Clássico, Romântico, Moderno e Brasileiro.', text: 'Conhecer estilos diferentes amplia as ferramentas interpretativas. Consulte a biblioteca de repertório deste site.', practice: 'Monte um plano anual com uma obra de cada período.', visual: '', video: '' },
    ],
  },
  interpretacao: {
    hero: { kind: 'staff', id: 'phrase' },
    topics: [
      T('fraseado', 'Toda frase tem direção e um ponto culminante.', 'staff:phrase'),
      T('timbre', 'Pequenos ajustes de ar e embocadura mudam a cor do som.', 'wave'),
      T('vibrato', 'Oscilação regular do som — recurso expressivo, não enfeite.', 'vibrato'),
      T('estilo', 'Cada época pede escolhas diferentes.', ''),
      T('ornamentacao', 'Trinados, apojaturas e mordentes.', 'staff:ornaments'),
      T('musicalidade', 'Musicalidade se desenvolve — não é um dom fixo.', ''),
    ],
  },
  intermediario: { hero: { kind: 'photo', photo: 13 }, horizon: 'intermediario', topics: [] },
  avancado: { hero: { kind: 'photo', photo: 9 }, horizon: 'avancado', topics: [] },
  performance: { hero: { kind: 'photo', photo: 10 }, horizon: 'performance', topics: [] },
  formacao: { hero: { kind: 'photo', photo: 18 }, horizon: 'formacao', topics: [] },
};

// Até a etapa 8 (Afinação) o aluno avança sozinho; da 9 (Técnica) em diante, só com as aulas.
export const FREE_UNTIL = 8;

export const stationsFull = STATION_LIST.map((s, i) => ({
  ...s,
  n: i + 1,
  free: i + 1 <= FREE_UNTIL,
  hero: META[s.id].hero,
  horizon: META[s.id].horizon || '',
  topics: META[s.id].topics,
  media: [], // imagens/vídeos extras adicionados pelo editor
}));
