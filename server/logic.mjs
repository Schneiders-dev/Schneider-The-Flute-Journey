// Regras da jornada: acesso às etapas, provas e nivelamento.
import { randomBytes } from 'node:crypto';
import { db, now } from './db.mjs';
import { content } from '../src/content.mjs';
import { FREE_UNTIL } from '../src/data/stations.mjs';
import { stationQuizzes, placementTest, placementStart, QUIZ_RULES } from '../src/data/quizzes.mjs';
import { visual } from '../src/render/visuals.mjs';

export const N = () => content.stations.length;
const PLACEMENT_SECONDS = 30;

/** Estado de cada etapa para um usuário (ou visitante). */
export function accessFor(user) {
  const n = N();
  if (!user) return { access: Array.from({ length: n }, (_, i) => (i === 0 ? 'open' : 'guest')), current: 0, done: 0 };
  if (user.role === 'admin') return { access: Array(n).fill('open'), current: 0, done: 0 };
  const passed = new Set(db.prepare('SELECT station FROM progress WHERE user_id = ? AND passed_at > 0').all(user.id).map((r) => r.station));
  const cap = user.is_student ? n - 1 : FREE_UNTIL - 1;
  // desbloqueadas: até max_unlocked (nivelamento/provas), limitado pelo plano
  const maxU = Math.min(user.max_unlocked, user.is_student ? n - 1 : cap);
  const access = Array.from({ length: n }, (_, i) => {
    if (i <= maxU) return passed.has(i) ? 'done' : 'open';
    if (i > cap) return 'premium';
    return 'prev';
  });
  // etapa atual: a primeira desbloqueada ainda não concluída (a partir do ponto de partida)
  let current = maxU;
  for (let i = Math.min(user.start_station, maxU); i <= maxU; i++) if (!passed.has(i)) { current = i; break; }
  return { access, current, done: [...passed].length };
}

const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

/** Inicia uma prova: escolhe perguntas, embaralha opções e guarda o gabarito no servidor. */
export function startQuiz(user, stationIdx) {
  const st = content.stations[stationIdx];
  const bank = stationQuizzes[st.id] || [];
  const picked = shuffle(bank.map((_, i) => i)).slice(0, QUIZ_RULES.perStation);
  const items = picked.map((qi) => ({ qi, order: shuffle([0, 1, 2, 3]) }));
  const id = randomBytes(12).toString('hex');
  db.prepare('INSERT INTO attempts (id, user_id, station, payload, started_at) VALUES (?, ?, ?, ?, ?)').run(id, user.id, stationIdx, JSON.stringify(items), now());
  return {
    attempt: id,
    seconds: QUIZ_RULES.secondsPerQuestion,
    passMin: QUIZ_RULES.passMin,
    questions: items.map(({ qi, order }) => {
      const q = bank[qi];
      return { q: q.q, options: order.map((o) => q.options[o]), visualHtml: q.visual ? visual(q.visual) : '' };
    }),
  };
}

/** Corrige a prova no servidor e desbloqueia a próxima etapa se aprovado. */
export function submitQuiz(user, attemptId, answers) {
  const a = db.prepare('SELECT * FROM attempts WHERE id = ? AND user_id = ?').get(attemptId, user.id);
  if (!a) throw httpError(404, 'Prova não encontrada.');
  if (a.finished_at) throw httpError(409, 'Esta prova já foi enviada.');
  const items = JSON.parse(a.payload);
  const limitMs = (items.length * QUIZ_RULES.secondsPerQuestion + 20) * 1000 + 15000;
  const late = now() - a.started_at > limitMs;
  const st = content.stations[a.station];
  const bank = stationQuizzes[st.id];
  let score = 0;
  const review = items.map(({ qi, order }, k) => {
    const pickedOpt = Array.isArray(answers) && Number.isInteger(answers[k]) ? order[answers[k]] : -1;
    const ok = pickedOpt === 0 && !late;
    if (ok) score++;
    return { q: bank[qi].q, ok, correct: bank[qi].options[0] };
  });
  const passed = score >= QUIZ_RULES.passMin;
  db.prepare('UPDATE attempts SET finished_at = ?, score = ? WHERE id = ?').run(now(), score, attemptId);
  db.prepare(`INSERT INTO progress (user_id, station, best_score, attempts, passed_at) VALUES (?, ?, ?, 1, ?)
    ON CONFLICT(user_id, station) DO UPDATE SET best_score = MAX(best_score, excluded.best_score), attempts = attempts + 1,
    passed_at = CASE WHEN passed_at > 0 THEN passed_at ELSE excluded.passed_at END`).run(user.id, a.station, score, passed ? now() : 0);
  let nextId = null; let premium = false;
  if (passed) {
    const next = a.station + 1;
    if (next < N()) {
      nextId = content.stations[next].id;
      const cap = user.is_student ? N() - 1 : FREE_UNTIL - 1;
      if (next > cap) premium = true;
      else if (next > user.max_unlocked) db.prepare('UPDATE users SET max_unlocked = ? WHERE id = ?').run(next, user.id);
    }
  }
  return { score, total: items.length, passed, review, nextId, premium, late };
}

export function placementQuestions() {
  return {
    seconds: PLACEMENT_SECONDS,
    questions: placementTest.map((q) => ({ q: q.q, options: q.kind === 'know' ? shuffleKeep(q) : q.options, visualHtml: q.visual ? visual(q.visual) : '' })),
  };
}
// As perguntas de conhecimento têm as opções embaralhadas de forma determinística (por pergunta),
// para que a correção não dependa de estado no servidor.
function permFor(q) {
  let h = 0; for (const ch of q.q + q.options.join()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  return order;
}
function shuffleKeep(q) { return permFor(q).map((o) => q.options[o]); }

export function gradePlacement(answers) {
  let self = 0; let know = 0;
  placementTest.forEach((q, k) => {
    const a = Array.isArray(answers) && Number.isInteger(answers[k]) ? answers[k] : -1;
    if (a < 0 || a > 3) return;
    if (q.kind === 'self') self += a;
    else if (permFor(q)[a] === 0) know += 1;
  });
  const start = placementStart(self, know) - 1; // índice 0-based
  return { self, know, current: Math.min(start, FREE_UNTIL - 1) };
}

export function applyPlacement(user, answers) {
  const g = gradePlacement(answers);
  const maxU = Math.max(user.max_unlocked, g.current);
  db.prepare('UPDATE users SET start_station = ?, max_unlocked = ?, placement_done = 1, placement_score = ? WHERE id = ?').run(g.current, maxU, `${g.self}+${g.know}`, user.id);
  return g;
}

export function httpError(status, message) { return Object.assign(new Error(message), { status }); }
