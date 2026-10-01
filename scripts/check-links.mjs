// Verifica links internos (arquivos e âncoras) em todas as páginas geradas.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (f === 'node_modules' || f.startsWith('.')) return; statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk(ROOT);
const ids = new Map(files.map((f) => [f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
let bad = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const [path, hash] = href.split('#');
    const target = path ? resolve(dirname(f), path) : f;
    if (!existsSync(target)) { console.log(`✗ ${relative(ROOT, f)} → ${href} (arquivo inexistente)`); bad++; continue; }
    if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) { console.log(`✗ ${relative(ROOT, f)} → ${href} (âncora inexistente)`); bad++; }
  }
}
console.log(bad ? `${bad} link(s) quebrado(s)` : `✓ ${files.length} páginas, nenhum link interno quebrado`);
process.exit(bad ? 1 : 0);
