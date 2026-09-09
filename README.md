# Código5 — site institucional

Site da [Código5](https://codigo5.com.br): serviços, trabalhos, trajetória, blog e contato. Inclui painel editorial e Mini App Telegram.

## Desenvolvimento

Stack: React 18, TypeScript, Vite, Tailwind e Cloudflare Pages Functions. Blog dinâmico em D1, sessões em KV e arquivos no DigitalOcean Spaces.

```sh
npm ci
npm run dev
npm run test
npm run lint
npm run build
```

## Publicação

Produção: Cloudflare Pages, projeto `codigo5-web`, branch `main`. O projeto usa upload direto; um push sozinho não publica o site.

```sh
npm run test && npm run build
npx wrangler pages deploy dist --project-name codigo5-web --branch main
```

Autenticação é feita localmente pelo Wrangler. Não adicionar tokens, `.env` reais nem arquivos de sessão ao Git. Antes de publicar, conferir os bindings e variáveis com a configuração ativa. Preservar os secrets existentes no provedor.

## Conteúdo e operação

- `src/content/company.ts`: serviços, mercados e trabalhos em destaque.
- `src/content/siteContent.ts`: contatos e catálogo histórico de clientes.
- `src/styles-company.css`: identidade visual institucional.
- `functions/`: API editorial, autenticação, redirects e sitemap.
- `docs/redesign-2026-09.md`: decisões da repaginação e rollback.

As imagens e marcas do portfólio pertencem aos respectivos titulares. O portfólio registra trabalhos ao longo do tempo; sites externos podem ter mudado após a entrega.

## Guardrail SEO

Preservar em conjunto `functions/_middleware.ts`, `functions/sitemap.xml.ts`, `scripts/generate-static-site.mjs` e `scripts/check-static-seo.mjs`, `scripts/generate-sitemap.mjs` e o teste `src/test/seo-source-canonical.test.ts`.

Após publicação, conferir que os endereços do sitemap são finais, indexáveis e possuem canonical próprio no HTML-fonte; verificar `/api/telegram/health` e `/api/bot/posts`. Rollback pelo deployment anterior completo, sem alterar o banco.

## SEO e compartilhamento

O build pré-renderiza as páginas públicas com os mesmos componentes React. Artigos publicados em D1 também recebem metadados e conteúdo inicial na resposta do servidor. As capas institucionais ficam em `public/assets/codigo5/social/`; o blog usa a imagem de destaque de cada artigo. Rode `node scripts/check-static-seo.mjs` após o build. Veja o checklist e as evidências em `docs/seo-checklist-2026-09-09.md`.
