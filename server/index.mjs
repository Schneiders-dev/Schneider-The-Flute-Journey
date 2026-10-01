// Servidor de The Flute Journey — Node puro, sem dependências.
// Uso: node server/index.mjs   (variáveis: PORT, DATA_DIR, ADMIN_EMAIL, ADMIN_PASSWORD)
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { db, DATA_DIR, now } from './db.mjs';
import { accessFor, startQuiz, submitQuiz, placementQuestions, gradePlacement, applyPlacement, httpError, N } from './logic.mjs';
import { content, applyOverrides, validPath } from '../src/content.mjs';
import { renderIndex } from '../src/render/index-page.mjs';
import { adminPage } from './admin-page.mjs';
import { navChapters } from '../src/render/layout.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const PORT = +process.env.PORT || 8080;
const SESSION_DAYS = 30;
const MAX_JSON = 64 * 1024;
const MAX_UPLOAD = 40 * 1024 * 1024;

/* ───────────── Senhas e sessões ───────────── */
function hashPassword(pw) {
  const salt = randomBytes(16);
  return `s1$${salt.toString('base64')}$${scryptSync(pw, salt, 64).toString('base64')}`;
}
function checkPassword(pw, stored) {
  const [, salt, hash] = String(stored).split('$');
  if (!salt || !hash) return false;
  const a = scryptSync(pw, Buffer.from(salt, 'base64'), 64);
  const b = Buffer.from(hash, 'base64');
  return a.length === b.length && timingSafeEqual(a, b);
}
const tokenHash = (t) => createHash('sha256').update(t).digest('hex');

function createSession(res, req, userId) {
  const token = randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(tokenHash(token), userId, now(), now() + SESSION_DAYS * 864e5);
  setCookie(res, req, 'tfj_s', token, SESSION_DAYS * 86400);
}
function currentUser(req) {
  const t = cookies(req).tfj_s;
  if (!t) return null;
  const row = db.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?').get(tokenHash(t), now());
  return row || null;
}

// Administrador criado/atualizado a partir das variáveis de ambiente.
// Lê variáveis tolerando espaços e aspas coladas por engano no painel da hospedagem.
const envClean = (k) => String(process.env[k] || '').trim().replace(/^["']|["']$/g, '').trim();
const ADMIN_EMAIL = envClean('ADMIN_EMAIL').toLowerCase();
const ADMIN_PASSWORD = envClean('ADMIN_PASSWORD');
const isAdminEmail = (email) => !!ADMIN_EMAIL && email === ADMIN_EMAIL;

// Administrador: o e-mail de ADMIN_EMAIL é sempre administrador.
// - Se ADMIN_PASSWORD estiver definida, a conta é criada/atualizada com essa senha.
// - Sem ADMIN_PASSWORD, basta criar a conta pelo site com esse e-mail (a senha é a escolhida no cadastro).
function ensureAdmin() {
  if (!ADMIN_EMAIL) { console.warn('⚠ Administrador: defina a variável ADMIN_EMAIL com o seu e-mail.'); return; }
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(ADMIN_EMAIL);
  if (ADMIN_PASSWORD.length >= 8) {
    if (!u) db.prepare("INSERT INTO users (name, email, pass_hash, role, is_student, consent, created_at) VALUES ('Natan Schneider', ?, ?, 'admin', 1, 1, ?)").run(ADMIN_EMAIL, hashPassword(ADMIN_PASSWORD), now());
    else if (u.role !== 'admin' || !checkPassword(ADMIN_PASSWORD, u.pass_hash)) db.prepare("UPDATE users SET role = 'admin', is_student = 1, pass_hash = ? WHERE id = ?").run(hashPassword(ADMIN_PASSWORD), u.id);
    console.log(`✓ Administrador: ${ADMIN_EMAIL} (senha definida em ADMIN_PASSWORD)`);
  } else {
    if (u && u.role !== 'admin') db.prepare("UPDATE users SET role = 'admin', is_student = 1 WHERE id = ?").run(u.id);
    if (ADMIN_PASSWORD) console.warn('⚠ ADMIN_PASSWORD tem menos de 8 caracteres e foi ignorada.');
    console.log(u ? `✓ Administrador: ${ADMIN_EMAIL}` : `✓ Administrador: crie a conta pelo site com o e-mail ${ADMIN_EMAIL} — ela vira administradora automaticamente.`);
  }
}

/* ───────────── Utilidades HTTP ───────────── */
function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));
}
function isHttps(req) { return req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted; }
function setCookie(res, req, name, value, maxAge) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
  if (isHttps(req)) parts.push('Secure');
  const prev = res.getHeader('Set-Cookie') || [];
  res.setHeader('Set-Cookie', [...(Array.isArray(prev) ? prev : [prev]), parts.join('; ')]);
}
function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', ...extra });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
const json = (res, status, obj) => send(res, status, obj);
async function readBody(req, limit = MAX_JSON) {
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > limit) throw httpError(413, 'Conteúdo grande demais.'); chunks.push(c); }
  return Buffer.concat(chunks);
}
async function readJSON(req) {
  const buf = await readBody(req);
  try { return JSON.parse(buf.toString('utf8') || '{}'); } catch { throw httpError(400, 'JSON inválido.'); }
}
function clientIp(req) { return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || ''; }

// Limite simples de tentativas por IP (login/cadastro).
const hits = new Map();
function rateLimit(req, key, max, windowMs) {
  const k = key + '|' + clientIp(req); const t = now();
  const arr = (hits.get(k) || []).filter((x) => t - x < windowMs);
  if (arr.length >= max) throw httpError(429, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
  arr.push(t); hits.set(k, arr);
}

// Identificador anônimo de visitante (métricas próprias).
function visitorId(req, res) {
  let v = cookies(req).tfj_v;
  if (!v || !/^[\w-]{16,40}$/.test(v)) { v = randomBytes(12).toString('base64url'); setCookie(res, req, 'tfj_v', v, 400 * 86400); }
  return v;
}

/* ───────────── Conteúdo editável + cache de páginas ───────────── */
let contentVersion = 0;
function loadOverrides() {
  const rows = db.prepare('SELECT path, value FROM content').all();
  applyOverrides(Object.fromEntries(rows.map((r) => [r.path, JSON.parse(r.value)])));
  contentVersion++;
  pageCache.clear();
}
const pageCache = new Map();
function renderFor(user, preview) {
  const viewer = preview ? null : user;
  const a = accessFor(viewer);
  const isAdmin = user?.role === 'admin';
  const key = `${contentVersion}|${isAdmin}|${a.current}|${a.access.join(',')}`;
  let html = pageCache.get(key);
  if (!html) {
    html = renderIndex({ access: a.access, current: a.current, isAdmin, isStatic: false });
    if (pageCache.size > 300) pageCache.clear();
    pageCache.set(key, html);
  }
  return html;
}

/* ───────────── Arquivos estáticos ───────────── */
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.ico': 'image/x-icon' };
const PUBLIC = /^\/(assets|guia)\/|^\/(robots\.txt|sitemap\.xml|favicon\.ico)$/;
async function serveFile(req, res, file, cache) {
  const st = await stat(file).catch(() => null);
  if (!st || !st.isFile()) return false;
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range && type.startsWith('video/')) {
    const start = range[1] ? +range[1] : 0; const end = range[2] ? +range[2] : st.size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
    createReadStream(file, { start, end }).pipe(res); return true;
  }
  res.writeHead(200, { ...headers, 'Content-Length': st.size });
  if (req.method === 'HEAD') { res.end(); return true; }
  createReadStream(file).pipe(res); return true;
}

/* ───────────── Rotas da API ───────────── */
const userView = (u) => u && { id: u.id, name: u.name, email: u.email, role: u.role, isStudent: !!u.is_student, placementDone: !!u.placement_done };
const cleanPhone = (p) => String(p || '').replace(/\D/g, '').slice(0, 15);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

async function api(req, res, path, user) {
  const method = req.method;
  // Proteção contra requisições de outros sites: todo POST precisa do cabeçalho próprio (exceto métricas).
  if (method !== 'GET' && path !== 't' && req.headers['x-tfj'] !== '1') throw httpError(403, 'Requisição inválida.');

  if (path === 'me' && method === 'GET') {
    if (user) db.prepare('UPDATE users SET last_seen_at = ? WHERE id = ?').run(now(), user.id);
    const a = accessFor(user);
    return json(res, 200, { user: userView(user), ...a });
  }
  if (path === 'register' && method === 'POST') {
    rateLimit(req, 'register', 8, 60 * 60e3);
    const b = await readJSON(req);
    const name = String(b.name || '').trim().slice(0, 80);
    const email = String(b.email || '').trim().toLowerCase().slice(0, 190);
    const phone = cleanPhone(b.phone);
    const password = String(b.password || '');
    if (name.length < 2) throw httpError(400, 'Informe seu nome.');
    if (!EMAIL.test(email)) throw httpError(400, 'E-mail inválido.');
    if (phone.length < 10) throw httpError(400, 'Informe o WhatsApp com DDD.');
    if (password.length < 8 || password.length > 128) throw httpError(400, 'A senha precisa ter de 8 a 128 caracteres.');
    if (!b.consent) throw httpError(400, 'É preciso concordar com a política de privacidade.');
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) throw httpError(409, 'Já existe uma conta com este e-mail. Use “Entrar”.');
    const r = db.prepare('INSERT INTO users (name, email, phone, pass_hash, consent, created_at, last_login_at, logins, role, is_student) VALUES (?, ?, ?, ?, 1, ?, ?, 1, ?, ?)').run(name, email, phone, hashPassword(password), now(), now(), isAdminEmail(email) ? 'admin' : 'visitor', isAdminEmail(email) ? 1 : 0);
    const created = db.prepare('SELECT * FROM users WHERE id = ?').get(r.lastInsertRowid);
    createSession(res, req, created.id);
    logEvent(req, res, created.id, 'signup', '', 0);
    let placed = false; let current = 0;
    if (Array.isArray(b.placement) && b.placement.length) { current = applyPlacement(created, b.placement).current; placed = true; }
    return json(res, 200, { ok: true, placed, current, admin: isAdminEmail(email) });
  }
  if (path === 'login' && method === 'POST') {
    rateLimit(req, 'login', 10, 15 * 60e3);
    const b = await readJSON(req);
    const u = db.prepare('SELECT * FROM users WHERE email = ?').get(String(b.email || '').trim().toLowerCase());
    if (!u || !checkPassword(String(b.password || ''), u.pass_hash)) throw httpError(401, 'E-mail ou senha incorretos.');
    if (isAdminEmail(u.email) && u.role !== 'admin') db.prepare("UPDATE users SET role = 'admin', is_student = 1 WHERE id = ?").run(u.id);
    db.prepare('UPDATE users SET last_login_at = ?, logins = logins + 1 WHERE id = ?').run(now(), u.id);
    createSession(res, req, u.id);
    logEvent(req, res, u.id, 'login', '', 0);
    return json(res, 200, { ok: true });
  }
  if (path === 'logout' && method === 'POST') {
    const t = cookies(req).tfj_s;
    if (t) db.prepare('DELETE FROM sessions WHERE token = ?').run(tokenHash(t));
    setCookie(res, req, 'tfj_s', '', 0);
    return json(res, 200, { ok: true });
  }
  if (path === 'placement' && method === 'GET') return json(res, 200, placementQuestions());
  if (path === 'placement/preview' && method === 'POST') { const b = await readJSON(req); return json(res, 200, gradePlacement(b.answers)); }
  if (path === 'placement' && method === 'POST') {
    if (!user) throw httpError(401, 'Entre na sua conta.');
    const b = await readJSON(req);
    return json(res, 200, applyPlacement(user, b.answers));
  }
  if (path === 'quiz/start' && method === 'POST') {
    if (!user) throw httpError(401, 'Entre na sua conta para fazer a prova.');
    rateLimit(req, 'quiz' + user.id, 40, 60 * 60e3);
    const b = await readJSON(req);
    const idx = content.stations.findIndex((s) => s.id === b.station);
    if (idx < 0) throw httpError(404, 'Etapa não encontrada.');
    const a = accessFor(user);
    if (!['open', 'done'].includes(a.access[idx])) throw httpError(403, 'Esta etapa ainda está bloqueada.');
    return json(res, 200, startQuiz(user, idx));
  }
  if (path === 'quiz/submit' && method === 'POST') {
    if (!user) throw httpError(401, 'Entre na sua conta.');
    const b = await readJSON(req);
    return json(res, 200, submitQuiz(user, String(b.attempt || ''), b.answers));
  }
  if (path === 't' && method === 'POST') {
    const b = await readJSON(req).catch(() => ({}));
    const type = String(b.type || '');
    if (!['pv', 'hb', 'click', 'sec', 'quiz', 'placement', 'signup'].includes(type)) return send(res, 204, '');
    trackVisit(req, res, user, type, b);
    return send(res, 204, '');
  }

  /* ───── Administrador ───── */
  if (path.startsWith('admin/')) {
    if (user?.role !== 'admin') throw httpError(403, 'Acesso restrito ao administrador.');
    return adminApi(req, res, path.slice(6), method, user);
  }
  throw httpError(404, 'Rota não encontrada.');
}

function logEvent(req, res, userId, type, label, value) {
  const vid = visitorId(req, res);
  db.prepare('INSERT INTO events (ts, vid, user_id, type, label, value) VALUES (?, ?, ?, ?, ?, ?)').run(now(), vid, userId || null, type, String(label).slice(0, 80), value | 0);
}
function trackVisit(req, res, user, type, b) {
  const vid = visitorId(req, res);
  const day = new Date().toISOString().slice(0, 10);
  const t = now();
  db.prepare(`INSERT INTO visits (vid, day, user_id, first_ts, last_ts, seconds, pageviews, ref, mobile) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)
    ON CONFLICT(vid, day) DO UPDATE SET last_ts = excluded.last_ts, user_id = COALESCE(excluded.user_id, user_id)`).run(vid, day, user?.id ?? null, t, t, String(b.ref || '').slice(0, 80), b.mobile ? 1 : 0);
  if (type === 'pv') db.prepare('UPDATE visits SET pageviews = pageviews + 1 WHERE vid = ? AND day = ?').run(vid, day);
  else if (type === 'hb') db.prepare('UPDATE visits SET seconds = seconds + 15 WHERE vid = ? AND day = ?').run(vid, day);
  else db.prepare('INSERT INTO events (ts, vid, user_id, type, label, value) VALUES (?, ?, ?, ?, ?, ?)').run(t, vid, user?.id ?? null, type, String(b.label || '').slice(0, 80), Number.isFinite(+b.value) ? +b.value | 0 : 0);
}

/* ───────────── API do administrador ───────────── */
async function adminApi(req, res, path, method) {
  if (path === 'stats' && method === 'GET') {
    const days = Math.min(365, Math.max(1, +new URL(req.url, 'http://x').searchParams.get('days') || 30));
    const since = Date.now() - days * 864e5;
    const sinceDay = new Date(since).toISOString().slice(0, 10);
    const q = (sql, ...p) => db.prepare(sql).get(...p);
    const all = (sql, ...p) => db.prepare(sql).all(...p);
    const totals = {
      visitors: q('SELECT COUNT(DISTINCT vid) n FROM visits WHERE day >= ?', sinceDay).n,
      visits: q('SELECT COUNT(*) n FROM visits WHERE day >= ?', sinceDay).n,
      pageviews: q('SELECT COALESCE(SUM(pageviews),0) n FROM visits WHERE day >= ?', sinceDay).n,
      avgSeconds: Math.round(q('SELECT COALESCE(AVG(seconds),0) n FROM visits WHERE day >= ? AND pageviews > 0', sinceDay).n),
      mobileShare: q('SELECT COALESCE(AVG(mobile),0) n FROM visits WHERE day >= ?', sinceDay).n,
      signups: q('SELECT COUNT(*) n FROM users WHERE role != ? AND created_at >= ?', 'admin', since).n,
      users: q('SELECT COUNT(*) n FROM users WHERE role != ?', 'admin').n,
      students: q('SELECT COUNT(*) n FROM users WHERE is_student = 1 AND role != ?', 'admin').n,
      logins: q("SELECT COUNT(*) n FROM events WHERE type = 'login' AND ts >= ?", since).n,
      quizzes: q('SELECT COUNT(*) n FROM attempts WHERE finished_at >= ?', since).n,
      quizPass: q('SELECT COALESCE(AVG(CASE WHEN score >= 4 THEN 1.0 ELSE 0 END),0) n FROM attempts WHERE finished_at >= ?', since).n,
    };
    const daily = all('SELECT day, COUNT(*) visitors, SUM(pageviews) pageviews, SUM(seconds) seconds FROM visits WHERE day >= ? GROUP BY day ORDER BY day', sinceDay);
    const clicks = all("SELECT label, COUNT(*) n FROM events WHERE type = 'click' AND ts >= ? GROUP BY label ORDER BY n DESC LIMIT 15", since);
    const sections = all("SELECT label, COUNT(DISTINCT vid) n FROM events WHERE type = 'sec' AND ts >= ? GROUP BY label ORDER BY n DESC LIMIT 30", since);
    const refs = all("SELECT CASE WHEN ref = '' THEN '(direto)' ELSE ref END label, COUNT(*) n FROM visits WHERE day >= ? GROUP BY label ORDER BY n DESC LIMIT 10", sinceDay);
    const funnel = content.stations.map((s, i) => ({ label: s.title, reached: q('SELECT COUNT(*) n FROM users WHERE role != ? AND max_unlocked >= ?', 'admin', i).n, passed: q('SELECT COUNT(*) n FROM progress WHERE station = ? AND passed_at > 0', i).n }));
    const names = Object.fromEntries([...navChapters.map((c) => [c.id, c.label]), ...content.stations.map((s, i) => [s.id, `Etapa ${i + 1} · ${s.title}`])]);
    sections.forEach((r) => { r.label = names[r.label] || r.label; });
    return json(res, 200, { days, totals, daily, clicks, sections, refs, funnel });
  }
  if (path === 'users' && method === 'GET') {
    const rows = db.prepare(`SELECT u.id, u.name, u.email, u.phone, u.role, u.is_student, u.start_station, u.max_unlocked, u.placement_done, u.placement_score, u.notes, u.logins, u.created_at, u.last_seen_at, u.last_login_at,
      (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id AND p.passed_at > 0) passed,
      (SELECT COUNT(*) FROM attempts a WHERE a.user_id = u.id AND a.finished_at > 0) attempts,
      (SELECT COALESCE(SUM(v.seconds),0) FROM visits v WHERE v.user_id = u.id) seconds
      FROM users u ORDER BY u.created_at DESC`).all();
    return json(res, 200, { users: rows, stations: content.stations.map((s) => s.title) });
  }
  if (path === 'users.csv' && method === 'GET') {
    const rows = db.prepare('SELECT name, email, phone, is_student, max_unlocked, created_at, last_seen_at FROM users WHERE role != ? ORDER BY created_at DESC').all('admin');
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = ['Nome,E-mail,Telefone,Aluno,Etapa,Cadastro,Último acesso', ...rows.map((r) => [r.name, r.email, r.phone, r.is_student ? 'sim' : 'não', (r.max_unlocked + 1) + ' · ' + content.stations[r.max_unlocked].title, new Date(r.created_at).toLocaleString('pt-BR'), r.last_seen_at ? new Date(r.last_seen_at).toLocaleString('pt-BR') : ''].map(cell).join(','))].join('\n');
    return send(res, 200, '﻿' + csv, 'text/csv; charset=utf-8', { 'Content-Disposition': 'attachment; filename="alunos-flute-journey.csv"' });
  }
  const um = /^users\/(\d+)$/.exec(path);
  if (um && method === 'PATCH') {
    const b = await readJSON(req);
    const u = db.prepare('SELECT * FROM users WHERE id = ?').get(+um[1]);
    if (!u) throw httpError(404, 'Usuário não encontrado.');
    if ('isStudent' in b) db.prepare('UPDATE users SET is_student = ? WHERE id = ?').run(b.isStudent ? 1 : 0, u.id);
    if ('maxUnlocked' in b) db.prepare('UPDATE users SET max_unlocked = ? WHERE id = ?').run(Math.max(0, Math.min(N() - 1, +b.maxUnlocked | 0)), u.id);
    if ('notes' in b) db.prepare('UPDATE users SET notes = ? WHERE id = ?').run(String(b.notes).slice(0, 2000), u.id);
    if (b.resetProgress) { db.prepare('DELETE FROM progress WHERE user_id = ?').run(u.id); db.prepare('UPDATE users SET max_unlocked = start_station WHERE id = ?').run(u.id); }
    pageCache.clear();
    return json(res, 200, { ok: true });
  }
  if (um && method === 'DELETE') {
    const u = db.prepare('SELECT role FROM users WHERE id = ?').get(+um[1]);
    if (u?.role === 'admin') throw httpError(400, 'O administrador não pode ser excluído por aqui.');
    db.prepare('DELETE FROM users WHERE id = ?').run(+um[1]);
    return json(res, 200, { ok: true });
  }
  if (path === 'content' && method === 'GET') return json(res, 200, { overrides: db.prepare('SELECT path, value, updated_at FROM content ORDER BY updated_at DESC').all() });
  if (path === 'content' && method === 'POST') {
    const b = await readJSON(req);
    const p = String(b.path || '');
    if (!validPath(p)) throw httpError(400, 'Caminho inválido.');
    if (b.remove) db.prepare('DELETE FROM content WHERE path = ?').run(p);
    else {
      const v = sanitizeValue(b.value);
      db.prepare('INSERT INTO content (path, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(path) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at').run(p, JSON.stringify(v), now());
    }
    loadOverrides();
    return json(res, 200, { ok: true });
  }
  if (path === 'upload' && method === 'POST') {
    const type = String(req.headers['content-type'] || '').split(';')[0];
    const ext = { 'image/webp': '.webp', 'image/jpeg': '.jpg', 'image/png': '.png', 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov' }[type];
    if (!ext) throw httpError(415, 'Formato não aceito. Use imagem (WebP, JPG, PNG) ou vídeo (MP4, WebM, MOV).');
    const buf = await readBody(req, MAX_UPLOAD);
    if (buf.length < 100) throw httpError(400, 'Arquivo vazio.');
    const name = `${Date.now().toString(36)}-${randomBytes(5).toString('hex')}${ext}`;
    await writeFile(join(DATA_DIR, 'uploads', name), buf);
    return json(res, 200, { url: `/uploads/${name}` });
  }
  throw httpError(404, 'Rota não encontrada.');
}

// Valores aceitos no editor: textos, números, booleanos, listas/objetos simples; URLs só locais ou https.
function sanitizeValue(v, depth = 0) {
  if (depth > 5) throw httpError(400, 'Valor complexo demais.');
  if (v === null || typeof v === 'boolean' || typeof v === 'number') return v;
  if (typeof v === 'string') return v.slice(0, 8000);
  if (Array.isArray(v)) return v.slice(0, 60).map((x) => sanitizeValue(x, depth + 1));
  if (typeof v === 'object') {
    const out = {};
    for (const [k, x] of Object.entries(v).slice(0, 30)) {
      if (!/^[A-Za-z0-9_-]+$/.test(k)) continue;
      let val = sanitizeValue(x, depth + 1);
      if (['src', 'video', 'url'].includes(k) && typeof val === 'string' && val && !/^(\/uploads\/[\w.-]+|assets\/img\/[\w./-]+|https:\/\/[^\s"'<>]+|#[\w-]+)$/.test(val)) throw httpError(400, 'Endereço não permitido.');
      out[k] = val;
    }
    return out;
  }
  throw httpError(400, 'Valor inválido.');
}

/* ───────────── Servidor ───────────── */
ensureAdmin();
loadOverrides();
db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now());

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    if (path.startsWith('/api/')) {
      const user = currentUser(req);
      return await api(req, res, path.slice(5), user);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método não permitido', 'text/plain');
    if (path === '/' || path === '/index.html') {
      const user = currentUser(req);
      visitorId(req, res);
      const html = renderFor(user, user?.role === 'admin' && url.searchParams.has('visitante'));
      return send(res, 200, html, 'text/html; charset=utf-8', { 'Cache-Control': 'no-store' });
    }
    if (path === '/admin') {
      const user = currentUser(req);
      if (user?.role !== 'admin') { res.writeHead(302, { Location: '/?entrar' }); return res.end(); }
      return send(res, 200, adminPage(), 'text/html; charset=utf-8', { 'Cache-Control': 'no-store' });
    }
    if (path === '/health') return send(res, 200, 'ok', 'text/plain');
    if (path.startsWith('/uploads/')) {
      const name = path.slice(9);
      if (!/^[\w.-]+$/.test(name)) return send(res, 404, 'Não encontrado', 'text/plain');
      if (await serveFile(req, res, join(DATA_DIR, 'uploads', name), 'public, max-age=31536000, immutable')) return;
      return send(res, 404, 'Não encontrado', 'text/plain');
    }
    if (PUBLIC.test(path)) {
      const file = normalize(join(ROOT, path));
      if (!file.startsWith(ROOT)) return send(res, 404, 'Não encontrado', 'text/plain');
      const target = path.endsWith('/') ? join(file, 'index.html') : file;
      const cache = /\.(woff2|webp|png|jpg)$/.test(target) ? 'public, max-age=604800' : 'public, max-age=300';
      if (await serveFile(req, res, target, cache)) return;
    }
    return send(res, 404, '<!doctype html><meta charset="utf-8"><title>Página não encontrada</title><p style="font-family:sans-serif">Página não encontrada. <a href="/">Voltar para a jornada</a></p>', 'text/html; charset=utf-8');
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    if (!res.headersSent) json(res, status, { error: status >= 500 ? 'Erro interno. Tente novamente.' : err.message });
    else res.end();
  }
});
server.listen(PORT, () => console.log(`The Flute Journey em http://localhost:${PORT}  (dados: ${DATA_DIR})`));
