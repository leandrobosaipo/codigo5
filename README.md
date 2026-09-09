# Código5 — site institucional

Site da [Código5](https://codigo5.com.br): serviços, trabalhos, trajetória, blog e contato. Inclui painel editorial e Mini App Telegram.

## Desenvolvimento

Stack: React 18, TypeScript, Vite e Tailwind. Servidor Node no Mac Mini, blog e sessões em SQLite persistente, arquivos no DigitalOcean Spaces. Os handlers em `functions/` são reutilizados pelo Node; não dependem de D1 em produção.

```sh
npm ci
npm run dev
npm run test
npm run lint
npm run build
```

## Publicação

Produção: Mac Mini, stack Portainer `codigo5-web` (endpoint 3, stack 231). Cloudflare fornece DNS/Tunnel. O projeto Pages antigo serve apenas redirecionamento; não publicar a aplicação nele.

```sh
npm test -- --maxWorkers=2
npm run build
npm run build:server
npm run test:server
node scripts/check-static-seo.mjs
```

A imagem deve ser identificada pelo commit, construída com `Dockerfile` e aplicada pelo Portainer com `deploy/compose.yml`. Para imagens construídas no servidor, usar `PullImage: false`; o helper genérico força pull e não serve para esse caso. Segredos ficam no Portainer e no arquivo local protegido documentado no runbook, nunca no Git. Veja `docs/migracao-macmini-operacao.md` para validação e rollback.

## Conteúdo e operação

- `src/content/company.ts`: serviços, mercados e trabalhos em destaque.
- `src/content/siteContent.ts`: contatos e catálogo histórico de clientes.
- `src/styles-company.css`: identidade visual institucional.
- `functions/`: API editorial, autenticação, redirects e sitemap.
- `docs/redesign-2026-09.md`: decisões da repaginação e rollback.

As imagens e marcas do portfólio pertencem aos respectivos titulares. O portfólio registra trabalhos ao longo do tempo; sites externos podem ter mudado após a entrega.

## Guardrail SEO

Preservar em conjunto `functions/_middleware.ts`, `functions/sitemap.xml.ts`, `scripts/generate-static-site.mjs` e `scripts/check-static-seo.mjs`, `scripts/generate-sitemap.mjs` e o teste `src/test/seo-source-canonical.test.ts`.

Após publicação, conferir que os endereços do sitemap são finais, indexáveis e possuem canonical próprio no HTML-fonte; verificar `/api/telegram/health` e `/api/bot/posts`. Rollback pela imagem anterior no Portainer, preservando o volume SQLite. Retorno ao D1 exige reconciliação dos dados; não basta trocar DNS.

## SEO e compartilhamento

O build pré-renderiza as páginas públicas com os mesmos componentes React. Artigos publicados no SQLite também recebem metadados e conteúdo inicial na resposta do servidor. As capas institucionais ficam em `public/assets/codigo5/social/`; o blog usa a imagem de destaque de cada artigo. Rode `node scripts/check-static-seo.mjs` após o build. Veja o checklist e as evidências em `docs/seo-checklist-2026-09-09.md`.

## Runtime Mac Mini

O runtime Node em `server/` reutiliza os handlers editoriais e substitui D1/KV por SQLite persistente. `codigo5.com.br` e `www.codigo5.com.br` já apontam para o Portainer. `novo.codigo5.com.br` permanece como endereço auxiliar com noindex.

```sh
npm run build
npm run build:server
npm run test:server
```

O banco precisa estar importado antes da inicialização; o servidor recusa criar um editorial vazio. Build Docker usa `Dockerfile`, bundle `output/server.mjs` e `dist`. Compose em `deploy/compose.yml`, imagem versionada por `COD5_IMAGE`, dados em `/opt/cod5/codigo5-web/data`, backups em `/opt/cod5/codigo5-web/backups`. Não salvar esses dados ou secrets no Git.
