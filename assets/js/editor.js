/*!
 * The Flute Journey — editor do administrador (carregado só para o administrador).
 * Textos: clique e edite (salva ao sair do campo). Imagens: trocar, ajustar enquadramento, ocultar.
 * Vídeos por tópico, mídias extras por etapa e links do seminário.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const toast = (m) => (window.TFJ?.toast ? TFJ.toast(m) : alert(m));
  const save = async (path, value, remove = false) => {
    const r = await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-TFJ': '1' }, body: JSON.stringify({ path, value, remove }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Não foi possível salvar.');
  };
  const reloadKeep = () => { sessionStorage.setItem('tfj-scroll', String(scrollY)); sessionStorage.setItem('tfj-edit', '1'); location.reload(); };
  const y = sessionStorage.getItem('tfj-scroll');
  if (y) { sessionStorage.removeItem('tfj-scroll'); addEventListener('load', () => setTimeout(() => scrollTo(0, +y), 50)); }

  // Barra do administrador
  const bar = document.createElement('div');
  bar.className = 'adminbar';
  bar.innerHTML = `<button type="button" class="adminbar__edit" aria-pressed="false">✎ Modo edição</button><a href="/admin">Painel</a><a href="/?visitante" target="_blank" rel="noopener">Ver como visitante</a><span class="adminbar__hint" hidden>Clique em um texto para editar · clique em uma imagem para trocar</span>`;
  document.body.appendChild(bar);
  const style = document.createElement('style');
  style.textContent = `
  .adminbar{position:fixed;z-index:70;top:calc(var(--topbar) + 8px);left:50%;transform:translateX(-50%);display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;justify-content:center;padding:.35rem;border-radius:99px;background:rgba(8,12,26,.9);border:1px solid rgba(200,169,106,.5);backdrop-filter:blur(12px);font-size:.8rem;max-width:calc(100vw - 20px)}
  .adminbar a,.adminbar button{color:#f4f5f8;text-decoration:none;padding:.35rem .8rem;border-radius:99px;border:1px solid transparent;background:none;cursor:pointer}
  .adminbar__edit{background:#c8a96a!important;color:#15110a!important;font-weight:600}
  .adminbar__edit[aria-pressed=true]{background:#79c49a!important}
  .adminbar__hint{color:#e3cb94;padding:0 .6rem}
  body.is-editing [data-edit]{outline:1px dashed rgba(200,169,106,.6);outline-offset:3px;border-radius:4px;cursor:text;min-width:1ch}
  body.is-editing [data-edit]:hover{outline-color:#e3cb94;background:rgba(200,169,106,.06)}
  body.is-editing [data-edit]:focus{outline:2px solid #e3cb94;background:rgba(200,169,106,.1)}
  body.is-editing [data-edit-img] img,body.is-editing [data-edit-hero] img,body.is-editing [data-edit-hero] figure{outline:2px dashed rgba(91,127,214,.8);outline-offset:-2px;cursor:pointer}
  body.is-editing [data-edit-img].media-empty{display:block;min-height:120px;border:2px dashed rgba(91,127,214,.8);border-radius:10px}
  .edtools{position:absolute;z-index:75;display:flex;gap:.3rem;flex-wrap:wrap;padding:.35rem;border-radius:12px;background:#0d1530;border:1px solid rgba(91,127,214,.8);box-shadow:0 14px 30px -10px #000}
  .edtools button,.edslot{font:500 .76rem Inter,sans-serif;color:#f4f5f8;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:99px;padding:.35rem .7rem;cursor:pointer}
  .edslot{display:none;margin:.3rem .3rem .3rem 0;border-color:rgba(91,127,214,.8)}
  body.is-editing .edslot{display:inline-flex}
  .edfocus{cursor:crosshair!important}
  .edmedia-x{position:absolute;top:6px;right:6px;z-index:3;width:28px;height:28px;border-radius:50%;border:0;background:#e08a6e;color:#fff;cursor:pointer;display:none}
  body.is-editing .edmedia-x{display:block}
  .st__media-item{position:relative}`;
  document.head.appendChild(style);
  const editBtn = $('.adminbar__edit');

  let editing = false;
  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('is-editing', on);
    editBtn.setAttribute('aria-pressed', String(on));
    editBtn.textContent = on ? '✓ Editando — clique para sair' : '✎ Modo edição';
    $('.adminbar__hint').hidden = !on;
    $$('[data-edit]').forEach((el) => {
      if (on) { el.setAttribute('contenteditable', 'plaintext-only'); if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true'); el.spellcheck = true; }
      else el.removeAttribute('contenteditable');
    });
    if (on) { window.TFJ?.revealAll?.(); $$('details').forEach((d) => { if (d.querySelector('[data-edit]')) d.open = true; }); }
    sessionStorage.setItem('tfj-edit', on ? '1' : '');
    closeTools();
  }
  editBtn.addEventListener('click', () => setEditing(!editing));

  // Textos
  document.addEventListener('focusin', (e) => { const el = e.target.closest?.('[data-edit]'); if (el && editing) el.dataset.orig = el.innerText; });
  document.addEventListener('focusout', async (e) => {
    const el = e.target.closest?.('[data-edit]');
    if (!el || !editing) return;
    const val = el.innerText.replace(/ /g, ' ').trim();
    if (val === (el.dataset.orig || '').trim()) return;
    if (!val) { el.innerText = el.dataset.orig; return toast('O texto não pode ficar vazio.'); }
    try { await save(el.dataset.edit, val); toast('Texto salvo'); } catch (err) { toast(err.message); el.innerText = el.dataset.orig; }
  });
  document.addEventListener('keydown', (e) => { if (editing && e.key === 'Enter' && !e.shiftKey && e.target.closest?.('[data-edit]') && !e.target.closest('p.lead, .tp__more p, dd')) { e.preventDefault(); e.target.blur(); } });
  // Durante a edição, cliques em textos não abrem links nem fecham "Saiba mais"
  document.addEventListener('click', (e) => {
    if (!editing) return;
    if (e.target.closest('[data-edit]') && e.target.closest('a, summary, button')) e.preventDefault();
  }, true);

  // Imagens
  let tools = null;
  function closeTools() { tools?.remove(); tools = null; $$('.edfocus').forEach((i) => i.classList.remove('edfocus')); }
  function placeTools(target, html) {
    closeTools();
    tools = document.createElement('div'); tools.className = 'edtools'; tools.innerHTML = html;
    document.body.appendChild(tools);
    const r = target.getBoundingClientRect();
    tools.style.left = Math.max(8, Math.min(innerWidth - tools.offsetWidth - 8, r.left + scrollX + 8)) + 'px';
    tools.style.top = (r.top + scrollY + 8) + 'px';
    return tools;
  }
  async function resizeImage(file, max = 1800) {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return new Promise((res) => c.toBlob(res, 'image/webp', 0.82));
  }
  async function upload(blob) {
    const r = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': blob.type, 'X-TFJ': '1' }, body: blob });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Falha no envio.');
    return j.url;
  }
  const pick = (accept) => new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => res(i.files[0] || null); i.click(); });
  async function pickAndUpload(kind) {
    const f = await pick(kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*');
    if (!f) return null;
    toast('Enviando…');
    if (kind === 'video') { if (f.size > 40 * 1024 * 1024) throw new Error('Vídeo grande demais (máx. 40 MB). Prefira um link do YouTube.'); return upload(f); }
    return upload(await resizeImage(f));
  }

  document.addEventListener('click', async (e) => {
    if (!editing || e.target.closest('.edtools, .adminbar')) return;
    const slot = e.target.closest('[data-edit-img]');
    const hero = e.target.closest('[data-edit-hero]');
    if (!slot && !hero) { if (!e.target.closest('.edtools')) closeTools(); return; }
    e.preventDefault(); e.stopPropagation();
    const path = slot ? slot.dataset.editImg : hero.dataset.editHero;
    const img = (slot || hero).querySelector('img');
    const t = placeTools(slot || hero, `<button data-a="swap">Trocar imagem</button>${img ? '<button data-a="focus">Ajustar enquadramento</button>' : ''}<button data-a="hide">${slot?.classList.contains('media-empty') ? 'Restaurar' : 'Remover'}</button><button data-a="x">✕</button>`);
    t.addEventListener('click', async (ev) => {
      const a = ev.target.dataset.a; if (!a) return;
      try {
        if (a === 'x') return closeTools();
        if (a === 'swap') {
          const url = await pickAndUpload('image'); if (!url) return;
          if (slot) { await save(path + '.src', url); await save(path + '.hidden', false); }
          else await save(path, { kind: 'photo-src', src: url, pos: '50% 50%' });
          toast('Imagem trocada'); return reloadKeep();
        }
        if (a === 'hide') {
          if (slot) await save(path + '.hidden', !slot.classList.contains('media-empty'));
          else await save(path, { kind: '' });
          return reloadKeep();
        }
        if (a === 'focus') {
          closeTools(); img.classList.add('edfocus'); toast('Clique no ponto da imagem que deve ficar em destaque');
          img.addEventListener('click', async (ce) => {
            ce.preventDefault(); ce.stopPropagation();
            const r = img.getBoundingClientRect();
            const pos = `${Math.round(((ce.clientX - r.left) / r.width) * 100)}% ${Math.round(((ce.clientY - r.top) / r.height) * 100)}%`;
            img.style.objectPosition = pos; img.classList.remove('edfocus');
            if (slot) await save(path + '.pos', pos);
            else { const cur = img.getAttribute('src'); await save(path, { kind: 'photo-src', src: cur.startsWith('/uploads/') ? cur : cur, pos }); }
            toast('Enquadramento salvo');
          }, { once: true, capture: true });
        }
      } catch (err) { toast(err.message); }
    });
  }, true);

  // Vídeo de cada tópico
  $$('[data-edit-video]').forEach((slot) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'edslot';
    b.textContent = slot.dataset.value ? '🎬 Trocar/remover vídeo' : '🎬 Adicionar vídeo';
    slot.appendChild(b);
    b.addEventListener('click', async () => {
      const choice = prompt('Cole o link do vídeo (YouTube ou Vimeo).\nDigite ARQUIVO para enviar um vídeo do computador (até 40 MB).\nDeixe em branco para remover o vídeo.', slot.dataset.value || '');
      if (choice === null) return;
      try {
        let url = choice.trim();
        if (url.toUpperCase() === 'ARQUIVO') { url = await pickAndUpload('video'); if (!url) return; }
        if (url && !/^https:\/\//.test(url) && !url.startsWith('/uploads/')) return toast('Use um link que comece com https://');
        await save(slot.dataset.editVideo, url); reloadKeep();
      } catch (err) { toast(err.message); }
    });
  });

  // Mídias extras por etapa
  $$('[data-edit-media]').forEach((slot) => {
    let list = []; try { list = JSON.parse(slot.dataset.value || '[]'); } catch (e) { /* noop */ }
    const path = slot.dataset.editMedia;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'edslot'; b.textContent = '＋ Adicionar imagem ou vídeo a esta etapa';
    slot.appendChild(b);
    b.addEventListener('click', async () => {
      const kind = prompt('O que deseja adicionar?\n1 = imagem do computador\n2 = vídeo do computador (até 40 MB)\n3 = link do YouTube/Vimeo', '1');
      if (!kind) return;
      try {
        let item = null;
        if (kind.trim() === '1') { const url = await pickAndUpload('image'); if (url) item = { src: url }; }
        else if (kind.trim() === '2') { const url = await pickAndUpload('video'); if (url) item = { video: url }; }
        else if (kind.trim() === '3') { const url = (prompt('Cole o link do vídeo:') || '').trim(); if (/^https:\/\//.test(url)) item = { video: url }; }
        if (!item) return;
        item.caption = (prompt('Legenda (opcional):') || '').trim();
        await save(path, [...list, item]); reloadKeep();
      } catch (err) { toast(err.message); }
    });
    // botões de remover nos itens já existentes
    const gallery = slot.previousElementSibling?.classList.contains('st__media') ? slot.previousElementSibling : null;
    gallery && $$('.st__media-item', gallery).forEach((it, i) => {
      const x = document.createElement('button'); x.type = 'button'; x.className = 'edmedia-x'; x.textContent = '✕'; x.title = 'Remover';
      it.appendChild(x);
      x.addEventListener('click', async (ev) => { ev.stopPropagation(); if (!confirm('Remover esta mídia da etapa?')) return; await save(path, list.filter((_, k) => k !== i)); reloadKeep(); });
    });
  });

  // Links do seminário
  $$('[data-edit-link]').forEach((li) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'edslot'; b.textContent = '🔗 Link';
    li.appendChild(b);
    b.addEventListener('click', async () => {
      const v = prompt('Endereço do material (https://… ou deixe vazio para "em breve"):', li.dataset.value || '');
      if (v === null) return;
      const url = v.trim();
      if (url && !/^https:\/\//.test(url) && !url.startsWith('#')) return toast('Use um link https://');
      try { await save(li.dataset.editLink, url); reloadKeep(); } catch (err) { toast(err.message); }
    });
  });

  if (sessionStorage.getItem('tfj-edit') === '1') setEditing(true);
})();
