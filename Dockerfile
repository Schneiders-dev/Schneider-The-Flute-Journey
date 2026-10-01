# The Flute Journey — servidor Node sem dependências (SQLite embutido no Node 22)
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    DATA_DIR=/data \
    PORT=3000
COPY package.json ./
COPY server ./server
COPY src ./src
COPY assets ./assets
COPY scripts ./scripts
# gera as páginas de guia (SEO) dentro da imagem
RUN node scripts/build.mjs && mkdir -p /data
# Banco de dados e arquivos enviados ficam em /data — monte um Volume do Railway nesse caminho.
EXPOSE 3000
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.mjs"]
