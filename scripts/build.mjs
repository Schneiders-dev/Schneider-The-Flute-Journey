// Gera o site estático a partir de src/:
//   index.html, guia/**.html, sitemap.xml, robots.txt
// Uso: npm run build
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT } from '../src/render/helpers.mjs';
import { renderIndex, guestCtx } from '../src/render/index-page.mjs';
import { renderGuidePages } from '../src/render/guide-pages.mjs';
import { site } from '../src/data/site.mjs';

const write = (rel, content) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

rmSync(join(ROOT, 'guia'), { recursive: true, force: true });

write('index.html', renderIndex(guestCtx({ isStatic: true, appUrl: site.appUrl || '' })));
const pages = renderGuidePages();
pages.forEach((p) => write(p.path, p.html));

const today = new Date().toISOString().slice(0, 10);
const urls = ['', ...pages.map((p) => p.path)];
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}/${u}</loc><lastmod>${today}</lastmod><priority>${u === '' ? '1.0' : u.endsWith('index.html') ? '0.8' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`
);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`✓ index.html + ${pages.length} páginas de guia + sitemap.xml`);
