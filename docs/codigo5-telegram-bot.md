# Código5 Telegram Bot

## Objetivo

Criar um bot editorial da Código5 para:

- registrar pautas e rascunhos
- receber ideia ou link pelo Telegram
- manter estado de sessão
- evoluir para criação, edição, exclusão e publicação de posts no site

## Stack da fase 1

- Telegram Bot API
- Cloudflare Pages Functions
- Cloudflare D1
- Cloudflare KV
- site existente da Código5 em Cloudflare Pages

## Bindings atuais

- `BOT_DB`: D1 com posts, drafts, redirects e jobs
- `BOT_SESSIONS`: KV para estado de sessão

## Rotas atuais

- `GET /api/telegram/health`
- `POST /api/telegram/webhook`
- `GET /api/bot/drafts`
- `POST /api/bot/drafts`
- `POST /api/bot/generate`
- `POST /api/bot/publish`
- `POST /api/bot/edit`
- `POST /api/bot/delete`
- `POST /api/bot/image-prompt`
- `POST /api/bot/upload-image`
- `GET /api/bot/posts`
- `GET /sitemap.xml`

## Fluxo entregue na fase 1

1. usuário envia `/novo` ou `/novo <ideia>`
2. o backend identifica se é link ou ideia
3. sugere segmento e foco principal
4. cria rascunho no D1
5. mantém o estado atual da conversa no KV

## Comandos atuais do bot

- `/start`
- `/help`
- `/status`
- `/novo`
- `/gerar`
- `/publicar`
- `/imagem`
- `/editar`
- `/excluir`
- `/rascunhos`

## Variáveis de ambiente esperadas

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SECRET_TOKEN`
- `TELEGRAM_ALLOWED_USER_IDS`
- `BOT_APP_NAME`
- `BOT_DEFAULT_TIMEZONE`
- `DO_SPACES_KEY`
- `DO_SPACES_SECRET`
- `DO_SPACES_BUCKET`
- `DO_SPACES_REGION`
- `DO_SPACES_ENDPOINT`
- `DO_SPACES_PUBLIC_BASE_URL`
- `DO_SPACES_UPLOAD_PREFIX`

## Status atual

### Entregue

- backend publicado no Pages
- D1 criado e migrado
- KV criado e ligado
- criação, geração e publicação de posts
- arquivamento com redirect dinâmico
- sitemap dinâmico para posts publicados pelo bot
- prompt de imagem salvo no rascunho
- edição básica de post existente por draftId ou slug
- edição visual no Mini App para título, slug, resumo, SEO, foco e capa
- edição do corpo HTML do post direto na Mini App
- upload visual da capa na Mini App com envio ao DigitalOcean Spaces
- redirect automático/customizado quando a slug de post publicado muda
- webhook validando secret e usuário autorizado
- testes locais passando

### Pendente para upload real no DigitalOcean

- configurar os segredos do Spaces no projeto `codigo5-web`
- validar envio de foto com legenda `/capa draftId`
- confirmar a pasta lógica `site-assets/telegram-bot`

## Próximas fases

### Fase 2

- gerar texto do post com base nas skills da Código5
- criar preview editorial
- salvar SEO, categorias, tags e CTA

### Próxima fase sugerida

- busca de imagem e seleção visual
- atualização de slug com redirect customizado
- edição de conteúdo HTML e CTA direto no painel
- upload de imagem visual no Mini App
