// Servidor estático sem dependências (usado por Railway, Render etc.).
// Uso: npm start  — escuta na porta definida em PORT (padrão 8080).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PORT = process.env.PORT || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};
const PRIVATE = /^\/(src|scripts|node_modules|\.git)(\/|$)|^\/package(-lock)?\.json$/;

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (PRIVATE.test(path)) throw new Error('private');
    let file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) throw new Error('outside');
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    const ext = extname(file);
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=604800',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><meta charset="utf-8"><title>Página não encontrada</title><p style="font-family:sans-serif">Página não encontrada. <a href="/">Voltar para a jornada</a></p>');
  }
}).listen(PORT, () => console.log(`The Flute Journey em http://localhost:${PORT}`));
