// Painel do administrador: métricas, cadastros e acesso ao editor.
import { markSVG } from '../src/brand/flute-path.mjs';

export function adminPage() {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel · The Flute Journey</title><meta name="robots" content="noindex">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/visuals.css">
<style>
:root{--bg:#060a16;--surface:#0a1020;--card:#0d1428;--line:rgba(255,255,255,.09);--line2:rgba(255,255,255,.16);--text:#c9cfdb;--muted:#8b93a7;--white:#f4f5f8;--gold:#c8a96a;--gold2:#e3cb94;--s1:#b88a2a;--s2:#5b7fd6;--ok:#79c49a;--bad:#e08a6e;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 Inter,system-ui,sans-serif}
a{color:var(--gold2)}button,select,input,textarea{font:inherit;color:inherit}
.top{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;justify-content:space-between;padding:.8rem clamp(16px,3vw,32px);background:rgba(6,10,22,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:.6rem;color:var(--white);text-decoration:none;font-family:'Cormorant Garamond',serif;font-size:1.3rem}.brand svg{width:32px;height:32px;color:var(--gold)}
.nav{display:flex;flex-wrap:wrap;gap:.4rem}.btn{display:inline-flex;align-items:center;gap:.4rem;min-height:38px;padding:.4rem .9rem;border-radius:99px;border:1px solid var(--line2);background:none;cursor:pointer;text-decoration:none;color:var(--white);font-size:.85rem}.btn:hover{border-color:var(--gold)}.btn--gold{background:var(--gold);border-color:var(--gold);color:#15110a}
main{max-width:1240px;margin:0 auto;padding:1.4rem clamp(16px,3vw,32px) 4rem}
h1{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(2rem,5vw,2.8rem);color:var(--white);margin:.2rem 0 1rem}
h2{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:0 0 .8rem}
.filters{display:flex;gap:.4rem;align-items:center;margin-bottom:1.2rem}.filters button[aria-pressed=true]{background:var(--white);color:#060a16;border-color:var(--white)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.7rem;margin-bottom:1.4rem}
.tile{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:.9rem 1rem}.tile b{display:block;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:2rem;color:var(--white);line-height:1.1}.tile span{font-size:.78rem;color:var(--muted)}
.grid{display:grid;gap:1rem;grid-template-columns:1fr}@media(min-width:960px){.grid{grid-template-columns:1fr 1fr}.span2{grid-column:span 2}}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:1.1rem 1.2rem;min-width:0}
.bars{position:relative;display:flex;align-items:flex-end;gap:2px;height:180px;border-bottom:1px solid var(--line2);padding-top:10px}
.bars i{flex:1;min-width:3px;background:var(--s1);border-radius:4px 4px 0 0;position:relative}.bars i:hover{filter:brightness(1.25)}
.axis{display:flex;justify-content:space-between;font-size:.72rem;color:var(--muted);margin-top:.3rem}
.tip{position:fixed;pointer-events:none;z-index:20;background:#111a33;border:1px solid var(--line2);border-radius:8px;padding:.4rem .6rem;font-size:.8rem;color:var(--white);display:none;white-space:nowrap}
.hb{display:grid;gap:.45rem}.hb div{display:grid;grid-template-columns:minmax(90px,38%) 1fr auto;gap:.6rem;align-items:center;font-size:.84rem}.hb span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hb em{display:block;height:10px;border-radius:0 4px 4px 0;background:var(--s1);font-style:normal;min-width:2px}.hb b{font-weight:500;color:var(--white);font-variant-numeric:tabular-nums}
.legend{display:flex;gap:1rem;font-size:.78rem;color:var(--muted);margin-bottom:.6rem}.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:.35rem;vertical-align:-1px}
.fun{display:grid;gap:.35rem}.fun div{display:grid;grid-template-columns:minmax(110px,30%) 1fr;gap:.6rem;align-items:center;font-size:.8rem}.fun .pair{display:grid;gap:2px}.fun em{display:block;height:8px;border-radius:0 4px 4px 0;min-width:2px}.fun .a{background:var(--s1)}.fun .b{background:var(--s2)}
.fun small{color:var(--muted);font-variant-numeric:tabular-nums}
table{width:100%;border-collapse:collapse;font-size:.85rem}th,td{text-align:left;padding:.55rem .5rem;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600;position:sticky;top:0;background:var(--card)}
td small{display:block;color:var(--muted)}.tbl{overflow:auto;max-height:70vh}
.chip{display:inline-block;font-size:.7rem;padding:.1rem .5rem;border-radius:99px;border:1px solid var(--line2)}.chip--gold{border-color:var(--gold);color:var(--gold2)}
.row-actions{display:flex;flex-wrap:wrap;gap:.3rem}.row-actions .btn{min-height:32px;padding:.2rem .6rem;font-size:.76rem}
.search{min-height:40px;border-radius:99px;border:1px solid var(--line2);background:var(--surface);padding:.4rem 1rem;width:min(320px,100%)}
select.sm{background:var(--surface);border:1px solid var(--line2);border-radius:8px;padding:.2rem .3rem;max-width:150px}
details.data summary{cursor:pointer;color:var(--muted);font-size:.78rem;margin-top:.6rem}
.empty{color:var(--muted);font-size:.9rem}
.help{font-size:.88rem;color:var(--muted);margin:0 0 1rem}
</style></head><body>
<header class="top">
  <a class="brand" href="/">${markSVG()}The Flute Journey · Painel</a>
  <nav class="nav">
    <a class="btn btn--gold" href="/#jornada">Editar o site</a>
    <a class="btn" href="/?visitante" target="_blank" rel="noopener">Ver como visitante</a>
    <a class="btn" href="/api/admin/users.csv">Exportar cadastros (CSV)</a>
    <button class="btn" type="button" id="logout">Sair</button>
  </nav>
</header>
<main>
  <h1>Olá, Natan.</h1>
  <p class="help">Para editar textos e imagens, abra o site (“Editar o site”) e ative o <strong>modo edição</strong> no botão dourado no canto superior.</p>
  <div class="filters" role="group" aria-label="Período">
    <span class="empty">Período:</span>
    <button class="btn" data-days="7" aria-pressed="false">7 dias</button>
    <button class="btn" data-days="30" aria-pressed="true">30 dias</button>
    <button class="btn" data-days="90" aria-pressed="false">90 dias</button>
    <button class="btn" data-days="365" aria-pressed="false">1 ano</button>
  </div>
  <section class="tiles" id="tiles" aria-label="Indicadores"></section>
  <div class="grid">
    <section class="card span2"><h2>Visitantes por dia</h2><div class="bars" id="daily" role="img" aria-label="Visitantes por dia"></div><div class="axis" id="daily-axis"></div><details class="data"><summary>Ver dados em tabela</summary><div id="daily-table"></div></details></section>
    <section class="card"><h2>Cliques mais frequentes</h2><div class="hb" id="clicks"></div></section>
    <section class="card"><h2>Seções mais vistas</h2><div class="hb" id="sections"></div></section>
    <section class="card"><h2>De onde vêm as visitas</h2><div class="hb" id="refs"></div></section>
    <section class="card"><h2>Funil da jornada</h2><div class="legend"><span><i style="background:var(--s1)"></i>Chegaram à etapa</span><span><i style="background:var(--s2)"></i>Aprovados na prova</span></div><div class="fun" id="funnel"></div></section>
    <section class="card span2">
      <div style="display:flex;flex-wrap:wrap;gap:.8rem;justify-content:space-between;align-items:center;margin-bottom:.8rem"><h2 style="margin:0">Cadastros</h2><input class="search" id="q" type="search" placeholder="Buscar por nome, e-mail ou telefone"></div>
      <div class="tbl"><table><thead><tr><th>Pessoa</th><th>Contato</th><th>Jornada</th><th>Uso</th><th>Aluno</th><th>Ações</th></tr></thead><tbody id="users"></tbody></table></div>
    </section>
  </div>
</main>
<div class="tip" id="tip"></div>
<script>
(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const api = async (p, opt = {}) => { const r = await fetch('/api/admin/' + p, { ...opt, headers: { 'Content-Type': 'application/json', 'X-TFJ': '1' } }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Erro'); return j; };
  const fmtT = (s) => s >= 3600 ? Math.floor(s / 3600) + 'h ' + Math.round((s % 3600) / 60) + 'min' : s >= 60 ? Math.floor(s / 60) + 'min ' + (s % 60) + 's' : s + 's';
  const fmtD = (ts) => ts ? new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
  const tip = $('#tip');
  const showTip = (e, html) => { tip.innerHTML = html; tip.style.display = 'block'; tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, e.clientX + 12) + 'px'; tip.style.top = (e.clientY - 40) + 'px'; };
  const hideTip = () => { tip.style.display = 'none'; };
  const LABELS = { 'hero-comecar': 'Começar a jornada (topo)', 'hero-nivel': 'Descubra seu nível (topo)', 'topbar-aulas': 'Aulas (menu)', 'footer-aulas': 'Aulas (rodapé)', 'lock-cadastro': 'Criar conta (etapa bloqueada)', 'lock-aulas': 'Desbloquear com aulas', 'form-whatsapp': 'Formulário → WhatsApp', 'form-email': 'Formulário → e-mail', whatsapp: 'Link WhatsApp', instagram: 'Instagram', video: 'Vídeos assistidos', seminario: 'Materiais do seminário', 'quiz-premium': 'Prova → quero aulas' };
  const lab = (l) => LABELS[l] || l.replace(/^quiz-/, 'Prova: ').replace(/^trilha-/, 'Trilha: ');

  function hbars(el, rows, fmt = (n) => n) {
    if (!rows.length) { el.innerHTML = '<p class="empty">Ainda sem dados neste período.</p>'; return; }
    const max = Math.max(...rows.map((r) => r.n), 1);
    el.innerHTML = rows.map((r) => '<div><span title="' + esc(lab(r.label)) + '">' + esc(lab(r.label)) + '</span><em style="width:' + (r.n / max * 100).toFixed(1) + '%"></em><b>' + fmt(r.n) + '</b></div>').join('');
  }

  let days = 30;
  async function loadStats() {
    const s = await api('stats?days=' + days);
    const t = s.totals;
    const tiles = [
      [t.visitors, 'visitantes únicos'], [t.pageviews, 'páginas vistas'], [fmtT(t.avgSeconds), 'tempo médio por visita'], [Math.round(t.mobileShare * 100) + '%', 'pelo celular'],
      [t.signups, 'cadastros no período'], [t.users, 'cadastros no total'], [t.students, 'alunos'], [t.logins, 'logins no período'],
      [t.quizzes, 'provas feitas'], [Math.round(t.quizPass * 100) + '%', 'aprovação nas provas'],
    ];
    $('#tiles').innerHTML = tiles.map(([v, l]) => '<div class="tile"><b>' + v + '</b><span>' + l + '</span></div>').join('');
    // visitantes por dia (série única: sem legenda; dica ao passar o mouse)
    const map = Object.fromEntries(s.daily.map((d) => [d.day, d]));
    const list = []; for (let i = days - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10); list.push(map[d] || { day: d, visitors: 0, pageviews: 0, seconds: 0 }); }
    const shown = list.slice(-Math.min(days, 90));
    const max = Math.max(...shown.map((d) => d.visitors), 1);
    const el = $('#daily');
    el.innerHTML = shown.map((d, i) => '<i data-i="' + i + '" style="height:' + Math.max(d.visitors ? 3 : 0, d.visitors / max * 100) + '%"></i>').join('');
    el.onmousemove = (e) => { const b = e.target.closest('i'); if (!b) return hideTip(); const d = shown[+b.dataset.i]; showTip(e, '<b>' + d.day.split('-').reverse().join('/') + '</b><br>' + d.visitors + ' visitantes · ' + (d.pageviews || 0) + ' páginas'); };
    el.onmouseleave = hideTip;
    $('#daily-axis').innerHTML = '<span>' + shown[0].day.split('-').reverse().slice(0, 2).join('/') + '</span><span>máx. ' + max + '/dia</span><span>' + shown[shown.length - 1].day.split('-').reverse().slice(0, 2).join('/') + '</span>';
    $('#daily-table').innerHTML = '<table><thead><tr><th>Dia</th><th>Visitantes</th><th>Páginas</th><th>Tempo total</th></tr></thead><tbody>' + shown.filter((d) => d.visitors).reverse().map((d) => '<tr><td>' + d.day.split('-').reverse().join('/') + '</td><td>' + d.visitors + '</td><td>' + d.pageviews + '</td><td>' + fmtT(d.seconds || 0) + '</td></tr>').join('') + '</tbody></table>';
    hbars($('#clicks'), s.clicks);
    hbars($('#sections'), s.sections);
    hbars($('#refs'), s.refs);
    const fmax = Math.max(...s.funnel.map((f) => f.reached), 1);
    $('#funnel').innerHTML = s.funnel.map((f, i) => '<div><span>' + String(i + 1).padStart(2, '0') + ' · ' + esc(f.label) + '</span><span class="pair"><em class="a" style="width:' + (f.reached / fmax * 100).toFixed(1) + '%" title="Chegaram: ' + f.reached + '"></em><em class="b" style="width:' + (f.passed / fmax * 100).toFixed(1) + '%" title="Aprovados: ' + f.passed + '"></em><small>' + f.reached + ' chegaram · ' + f.passed + ' aprovados</small></span></div>').join('');
  }

  let users = []; let stations = [];
  async function loadUsers() { const r = await api('users'); users = r.users; stations = r.stations; renderUsers(); }
  function renderUsers() {
    const q = $('#q').value.trim().toLowerCase();
    const rows = users.filter((u) => !q || (u.name + u.email + u.phone).toLowerCase().includes(q));
    if (!rows.length) { $('#users').innerHTML = '<tr><td colspan="6" class="empty">Nenhum cadastro ainda.</td></tr>'; return; }
    $('#users').innerHTML = rows.map((u) => {
      const first = u.name.split(' ')[0];
      const msg = encodeURIComponent('Olá, ' + first + '! Aqui é o Natan Schneider, do The Flute Journey. Vi que você está na etapa "' + stations[u.max_unlocked] + '" da jornada. Quer conversar sobre aulas para continuar evoluindo?');
      const phone = u.phone.length <= 11 ? '55' + u.phone : u.phone;
      const admin = u.role === 'admin';
      return '<tr data-id="' + u.id + '"><td><strong>' + esc(u.name) + '</strong>' + (admin ? ' <span class="chip chip--gold">admin</span>' : '') + '<small>cadastro ' + fmtD(u.created_at) + '</small></td>'
        + '<td>' + esc(u.email) + '<small>' + esc(u.phone) + '</small></td>'
        + '<td>' + (admin ? '—' : '<select class="sm" data-act="stage" aria-label="Etapa liberada">' + stations.map((s, i) => '<option value="' + i + '"' + (i === u.max_unlocked ? ' selected' : '') + '>até ' + (i + 1) + ' · ' + esc(s) + '</option>').join('') + '</select><small>' + u.passed + ' provas aprovadas · ' + u.attempts + ' tentativas' + (u.placement_done ? ' · nivelamento ' + esc(u.placement_score) : '') + '</small>') + '</td>'
        + '<td>' + u.logins + ' logins<small>' + fmtT(u.seconds) + ' no site · visto ' + fmtD(u.last_seen_at) + '</small></td>'
        + '<td>' + (admin ? '—' : '<label><input type="checkbox" data-act="student"' + (u.is_student ? ' checked' : '') + '> aluno</label><small>libera todas as etapas</small>') + '</td>'
        + '<td><div class="row-actions">' + (u.phone ? '<a class="btn btn--gold" target="_blank" rel="noopener" href="https://wa.me/' + phone + '?text=' + msg + '">WhatsApp</a>' : '') + '<a class="btn" href="mailto:' + esc(u.email) + '">E-mail</a>' + (admin ? '' : '<button class="btn" data-act="reset">Zerar progresso</button><button class="btn" data-act="delete">Excluir</button>') + '</div></td></tr>';
    }).join('');
  }
  $('#users').addEventListener('change', async (e) => {
    const tr = e.target.closest('tr'); const id = tr?.dataset.id; if (!id) return;
    try {
      if (e.target.dataset.act === 'student') await api('users/' + id, { method: 'PATCH', body: JSON.stringify({ isStudent: e.target.checked }) });
      if (e.target.dataset.act === 'stage') await api('users/' + id, { method: 'PATCH', body: JSON.stringify({ maxUnlocked: +e.target.value }) });
      loadUsers();
    } catch (err) { alert(err.message); }
  });
  $('#users').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); const id = b?.closest('tr')?.dataset.id; if (!id || b.tagName !== 'BUTTON') return;
    const u = users.find((x) => x.id === +id);
    if (b.dataset.act === 'delete' && confirm('Excluir a conta de ' + u.name + ' e todos os dados? Isso não pode ser desfeito.')) { await api('users/' + id, { method: 'DELETE' }); loadUsers(); }
    if (b.dataset.act === 'reset' && confirm('Zerar o progresso de ' + u.name + '?')) { await api('users/' + id, { method: 'PATCH', body: JSON.stringify({ resetProgress: true }) }); loadUsers(); }
  });
  $('#q').addEventListener('input', renderUsers);
  document.querySelectorAll('[data-days]').forEach((b) => b.addEventListener('click', () => { days = +b.dataset.days; document.querySelectorAll('[data-days]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); loadStats(); }));
  $('#logout').addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST', headers: { 'X-TFJ': '1' } }); location.href = '/'; });
  loadStats().catch((e) => alert(e.message)); loadUsers().catch((e) => alert(e.message));
})();
</script></body></html>`;
}
