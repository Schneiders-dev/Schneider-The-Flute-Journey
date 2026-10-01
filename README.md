# SCHNEIDER — THE FLUTE JOURNEY

> Uma jornada pela arte de aprender, estudar e tocar flauta transversal.

Site educacional imersivo (scrollytelling) sobre a formação de um flautista: um caminho de 17 estações, do primeiro som à formação artística, com paradas históricas dedicadas aos grandes pedagogos, biblioteca de métodos, repertório, rotinas de estudo, problemas comuns, questionário de nível, trilhas de objetivo, checklist, área de seminário e apresentação das aulas.

## Como funciona

- **Site estático, sem dependências em produção.** HTML pré-renderizado + um CSS + um JS (~30 KB) em JavaScript puro.
- **Conteúdo separado do layout.** Todo o texto fica em `src/data/*.mjs`; `npm run build` gera as páginas.
- **SEO.** Todo o conteúdo está no HTML (funciona sem JavaScript). Além da página principal, o build gera **57 páginas individuais** em `guia/` (cada problema, método, pedagogo, pilar e capítulo), com títulos, descrições, dados estruturados (JSON-LD: `Course`, `FAQPage`, `Person`, `BreadcrumbList`), `sitemap.xml` e `robots.txt`.

```
src/data/          ← conteúdo (edite aqui)
  site.mjs           contato, URL, página "Conheça Schneider", aulas, seminários
  journey.mjs        zonas, estações, capítulos e tópicos, horizonte, história da flauta
  pedagogues.mjs     paradas históricas (biografias, obras, notas de incerteza, fontes)
  methods.mjs        biblioteca de métodos
  repertoire.mjs     repertório progressivo
  practice.mjs       pilares, problemas, rotinas, ferramentas, questionário, trilhas, checklist
  references.mjs     fontes e referências
src/render/        ← templates HTML
scripts/build.mjs  ← gera index.html, guia/**, sitemap.xml, robots.txt
assets/css/main.css
assets/js/main.js  ← motor de scroll + interações
```

## Comandos

```bash
npm run build   # gera o site
npm run dev     # build + servidor local em http://localhost:8080
npm run check   # build + verificação de links internos e âncoras
```

Requer Node 18+. Não há pacotes a instalar.

## Publicação

O resultado do build fica na raiz do repositório (`index.html`, `guia/`, `assets/`), pronto para GitHub Pages (Settings → Pages → *Deploy from a branch*, pasta `/`), Netlify, Vercel ou qualquer hospedagem estática. Ajuste `site.url` em `src/data/site.mjs` para a URL definitiva e rode `npm run build`.

## O que precisa ser preenchido por você

O site **não inventa** informações pessoais. Antes de publicar:

1. **Contato** — `contact` em `src/data/site.mjs` (WhatsApp, e-mail, Instagram, cidade). Sem isso, o formulário mostra um aviso.
2. **Conheça Schneider** — `teacher.experience` (trajetória, formação, experiência como professor). Itens com `placeholder: true` aparecem com contorno tracejado até serem preenchidos. Foto opcional em `assets/img/schneider.jpg`.
3. **Retratos dos pedagogos** — ver `assets/img/pedagogos/README.md`. Sem imagem, aparece um retrato tipográfico (monograma). Use apenas imagens de domínio público ou autorizadas e registre a origem em `credits.json`.
4. **Seminário** — links de vídeos, PDFs e anotações em `seminars` (`src/data/site.mjs`). Itens sem `url` aparecem como "em breve". Para um novo seminário, adicione um objeto no início da lista.

## Política editorial

- Nenhuma citação é atribuída a flautistas.
- Dados históricos seguem as referências de `references.mjs` (Toff, Powell, Blakeman, McCutchan, Boehm/Miller, Quantz/Reilly, Grove etc.).
- Quando há divergência ou incerteza entre fontes, ela é indicada no texto (`note`).
- Nenhum método é apresentado como obrigatório; níveis de repertório são aproximados.
- Partituras não são distribuídas; recomendações de aplicativos são por categoria, com aviso para verificar informações atuais.

## Experiência e acessibilidade

- **Motor de cenas** (`assets/js/main.js`): seções fixas (`[data-scene]`) cujo progresso é controlado pelo scroll; elementos internos usam keyframes declarativos (`data-kf="0 o:0 y:5; .3 o:1 y:0"`; `data-kf-sm` para telas pequenas). Tudo é reversível ao rolar para cima.
- Rolagem horizontal guiada pelo scroll vertical (horizonte, história, "como estudar uma música"), caminho SVG desenhado pelo scroll (serpentina no desktop, estrada vertical no celular), frases que se acendem palavra por palavra, parallax leve, troca de cenário (cor de fundo) por capítulo.
- Só `transform` e `opacity` são animados; blur é desativado no celular; elementos fora da tela não são processados (IntersectionObserver); um único `requestAnimationFrame` por quadro.
- **`prefers-reduced-motion`**: todas as cenas viram fluxo normal, sem animação; trilhas horizontais viram rolagem nativa com snap.
- Sem JavaScript, todo o conteúdo continua visível e navegável.
- Indicador permanente **"Você está aqui"**, índice da jornada em `<dialog>`, abas com navegação por teclado, foco visível, áreas de toque ≥ 44 px.
- Progresso do checklist e resultado do questionário ficam salvos apenas no navegador do visitante (`localStorage`).
