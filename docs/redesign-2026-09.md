# Repaginação Código5 — setembro de 2026

## Objetivo e conteúdo

Organizar o site institucional em serviços, trabalhos, empresa, blog e contato. Apresentar desenvolvimento, conteúdo/SEO, operação editorial/AdOps, sistemas/IA e infraestrutura. A trajetória de mais de 15 anos vem do sistema de marca existente; não foi criada uma data de fundação nem novas métricas comerciais.

Fontes do conteúdo: `src/content/siteContent.ts`, `docs/codigo5-brand-system.md` e documentação dos projetos operacionais consultada com autorização do proprietário. Clientes públicos foram limitados ao catálogo já existente. Capturas do portfólio são referências de trabalhos e não garantia de que o site externo permanece na versão original.

## Direção visual

Branco #ffffff, azul profundo #172d42, azul principal #164cc7, superfície #f3f6fa e pequeno detalhe #d65c35. Tipografia Manrope com hierarquia de tamanhos; textos longos com espaçamento de leitura. A assinatura visual são capturas reais dos projetos, sem imagens genéricas de IA. Navegação curta, contraste, foco de teclado e adaptação móvel.

## Origem e preservação

O GitHub estava em `e5c750b`, anterior ao runtime. A cópia local `site/` incluía blog dinâmico, funções, migrações e correções de canonical que ainda não estavam versionadas. Foi criada uma cópia Git em `release/` a partir de `leandrobosaipo/codigo5` e incorporada a base local atual, sem arquivos de credenciais, caches ou artefatos temporários.

A configuração de produção foi conferida na API Cloudflare: projeto `codigo5-web`, branch `main`; sete variáveis públicas, D1 e KV iguais ao `wrangler.toml`. Secrets permanecem no provedor. A publicação existente é por upload direto, sem integração Git automática.

## Validação e rollback

Executar `npm run test`, `npm run lint` e `npm run build`. Verificar no navegador desktop e móvel, links por seção, blog, categoria e contato. Conferir sitemap/canonical, leitura do blog e health editorial após o deploy.

Deployment anterior para rollback: `62969c89-f7aa-4ae5-9e94-ad162e008893`. Não fazer migrações de banco neste redesign. Rollback pelo deployment completo no Cloudflare Pages.

## Verificações finais

Capturas atualizadas em 08/09/2026 de Clínica Petterle, CREF17/MT e Roo Notícias, com títulos e páginas conferidos. Sonata Musical permanece como marca histórica, pois o domínio apresentou página padrão de hospedagem nesta data; o catálogo histórico não oferece links externos. Os três destaques oferecem links para sites conferidos.

A revisão pré-publicação identificou uma falha anterior de autenticação nas APIs da Mini App. Foi adicionada validação de dados assinados do Telegram nas rotas `/api/bot/*`, preservando o GET público de posts. O identificador recebido deve coincidir com o usuário assinado e autorizado. Testes cobrem acesso público, acesso anônimo, assinatura inválida, divergência de usuário e acesso válido.

A leitura de HTML de artigos agora usa DOMPurify. Essa é a única dependência nova da repaginação, justificada pela filtragem de HTML não confiável; preserva texto, links e imagens e remove código executável. O banco e os artigos existentes não são reescritos.
