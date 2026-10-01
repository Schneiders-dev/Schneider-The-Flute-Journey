# The Flute Journey

> Uma jornada pela arte de aprender, estudar e tocar flauta transversal — por Natan Schneider.

Plataforma de aprendizagem com **17 etapas**, contas de aluno, **prova de nivelamento**, **provas por etapa** (5 perguntas, 15 s cada), bloqueio progressivo das etapas, **painel do administrador** com métricas e cadastros, e **editor visual** para trocar textos, imagens e vídeos direto no site.

## Como funciona

| Quem | O que vê |
|---|---|
| Visitante | Toda a biblioteca (métodos, repertório, pedagogos, história, pilares, como estudar…), a etapa 1 como amostra e as demais etapas embaçadas com convite para criar conta. |
| Aluno cadastrado | Faz a prova de nivelamento → começa na etapa indicada (as anteriores ficam liberadas para revisão). Cada etapa aprovada (4 de 5 acertos) desbloqueia a seguinte, **até a etapa 8 (Afinação)**. |
| Aluno das aulas | Marcado como "aluno" no painel → todas as 17 etapas liberadas. |
| Administrador | Painel em `/admin` (visitantes, tempo médio, cliques, seções mais vistas, funil da jornada, cadastros com botão de WhatsApp, exportação CSV) e modo edição no próprio site. |

O conteúdo bloqueado **não é enviado** ao navegador (a página é montada no servidor para cada pessoa) e as provas são **corrigidas no servidor** — não dá para burlar pelo navegador.

## Hospedagem (Railway)

O projeto já vem com `Dockerfile` e `railway.json`. No serviço do Railway:

1. **Volume**: adicione um Volume montado em **`/data`** (é onde ficam o banco de dados e os arquivos enviados pelo editor — sem ele, os cadastros se perdem a cada atualização).
2. **Variáveis** (aba *Variables*):
   - `ADMIN_EMAIL` — o e-mail que você usará para entrar como administrador
   - `ADMIN_PASSWORD` — uma senha forte (mínimo 8 caracteres)
3. **Domínio**: *Settings → Networking → Generate Domain* (ou conecte um domínio próprio).

Para entrar como administrador: abra o site, clique em **Entrar** e use o e-mail/senha das variáveis. Trocar a variável `ADMIN_PASSWORD` e reiniciar troca a senha.

## Editando o site (administrador)

Com o administrador conectado aparece uma barra dourada no topo:
- **Modo edição** → clique em qualquer texto contornado para editar (salva ao sair do campo).
- Clique numa **imagem** → *Trocar imagem* (envio do computador, redimensionada automaticamente), *Ajustar enquadramento* (clique no ponto de destaque) ou *Remover*.
- Em cada tópico: **🎬 Adicionar vídeo** (link do YouTube/Vimeo ou arquivo MP4 de até 40 MB).
- Em cada etapa: **＋ Adicionar imagem ou vídeo**.
- **Ver como visitante** mostra o site como um visitante sem conta.

As alterações ficam salvas no banco (volume `/data`) e valem para todos imediatamente.

## Desenvolvimento

```bash
npm run dev     # servidor local em http://localhost:8080 (admin: admin@local / admin12345)
npm run check   # gera as páginas de guia e verifica os links internos
```

Requer Node 22.13+. **Nenhuma dependência** (o banco é o SQLite embutido no Node).

```
server/            servidor HTTP, contas, provas, métricas, painel do administrador
src/data/          conteúdo (etapas, provas, pedagogos, métodos, repertório, prática…)
src/render/        HTML (página principal, ilustrações e partituras em SVG, páginas de guia)
src/brand/         identidade visual: a linha que vira flauta (logo)
assets/            CSS, JS (motor de animação, contas/provas, editor), fontes, fotos
```

## Identidade visual

O logo é a **linha que se transforma em flauta e volta a ser linha**, num traço contínuo, com proporções medidas de uma flauta real (porta-lábio, junções, chaves abertas, alavanca do Sol♯, chaves de rolete do pé). Ele está em `src/brand/flute-path.mjs` e é usado no topo, no menu flutuante, no rodapé e na abertura.

## Privacidade (LGPD)

Cadastro com consentimento explícito para contato; senhas com hash `scrypt`; sessões em cookie `HttpOnly`; métricas próprias e anônimas (sem serviços de terceiros); exclusão de conta pelo painel. Texto de privacidade na seção "Fontes" do site.

## Política editorial

Nenhuma citação atribuída sem fonte; incertezas históricas indicadas no texto; nenhum método apresentado como obrigatório; partituras não distribuídas.
