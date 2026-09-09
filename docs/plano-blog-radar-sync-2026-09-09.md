# Blog Código5 + Radar + Sync

Plano de expansão e diagnóstico — 09/09/2026.

## 1. Decisão e resultado esperado

Manter o site atual e o painel editorial. Usar o Radar para descobrir e organizar referências; o Sync para preparar texto e imagem; o painel para revisar; e a API do site para publicar. Não migrar o site inteiro para WordPress nem dar ao Sync acesso direto ao banco da Código5.

Primeira entrega da integração: uma fonte monitorada para a Código5 gera uma pauta, que vira rascunho com imagem, é revisada e publicada uma única vez no blog. Depois, repetir o cadastro para outros clientes e destinos, sem alterar os portais existentes.

## 2. O que existe hoje

| Parte | Situação confirmada |
|---|---|
| Páginas institucionais | Conteúdo em `src/content/company.ts`, `siteContent.ts` e componentes. Gerado no build; alterações exigem publicação do site. O painel não edita serviços, história e portfólio. |
| Blog | Híbrido. Acervo empacotado em `src/content/blog-posts.json` e posts dinâmicos em D1. O navegador combina os dois por slug; alterações dinâmicas podem substituir a versão do acervo. |
| HTML e SEO | `functions/_middleware.ts` consulta posts dinâmicos para responder com conteúdo, título, imagem e schema no HTML. Sitemap inclui conteúdo dinâmico. Não é apenas conteúdo inserido por JavaScript. |
| Painel | `/admin/editorial`: acesso protegido por Telegram/link de acesso; criação, importação do acervo, edição visual, capa, geração de texto, publicação e arquivamento. |
| API | `/api/admin/posts*` para usuário autenticado; `/api/bot/*` para fluxo do bot; `/api/bot/posts` para leitura pública. Nenhuma destas deve virar uma escrita pública sem autenticação. |
| Imagens | Upload e armazenamento no Spaces, já usados pelo editor. |
| Radar | Projeto local `RadarCred`, SQLite e catálogo/adapters de fontes; container `radarcred` ativo no Mac Mini. Revisão exata da imagem não identificável por tag atual. |
| Sync | Produção verificada no Mac Mini/Portainer: `cod5-sync-app`, imagem `sha-5bcde48`, com backup e watchdog. Node executa `server.mjs`; SQLite local emula interface D1 e fila durável. A pasta `worker` não significa que a produção está em Cloudflare. |
| Integração existente | Radar cria candidatos em modo `simulate`; Sync recebe em `/v1/admin/radarcred/candidates` e processa pela fila. Publicação atual usa adapter WordPress. Não foi encontrado adapter para o blog Código5. |

### Bloqueio operacional encontrado

Uma consulta agregada somente leitura ao D1 da Código5 retornou erro **7500: limite diário de linhas lidas do plano gratuito excedido**. Portanto, não foi possível confirmar a quantidade atual de posts dinâmicos nem validar gravação/publicação autenticada em produção nesta auditoria. O fallback estático explica por que o site continua exibindo artigos; não comprova que o banco está funcionando.

Não houve alteração de plano pago, banco ou configuração dos portais. O limite deve ser liberado pelo provedor ou o titular deve escolher capacidade adequada antes de ativar publicação contínua.

### Melhorias imediatas do painel

- Separar título, resumo, texto e imagem dos ajustes opcionais de fonte, endereço e busca.
- Usar nomes simples no lugar de “cockpit”, “CRUD”, “slug” e “preview”.
- Salvar os campos atuais antes de publicar, gerar texto ou enviar capa; não executar a próxima etapa se o salvamento falhar.
- Manter o editor aberto após salvar e conservar o texto diante de erro.
- Avisar quando a lista do banco não carregar, em vez de aparentar uma listagem dinâmica completa.

Limite preservado: o salvamento atual de um artigo já publicado também atualiza sua versão pública. Uma revisão separada, com botão de aprovar alterações antes de torná-las públicas, exige versionamento e entra como evolução posterior. Não confundir “salvar publicado” com rascunho privado.

## 3. Fluxo proposto

```mermaid
flowchart LR
  A[Fontes autorizadas] --> B[Radar: coletar e deduplicar]
  B --> C[Escolher cliente, assunto e destino]
  C --> D[Sync: preparar texto e imagem]
  D --> E[Painel: revisar rascunho]
  E --> F[API Código5: publicar]
  F --> G[Conferir página, capa e sitemap]
  G --> H[Sync registra entrega confirmada]
```

Uma fonte pode interessar a mais de um cliente. Coletar o material uma vez e decidir o aproveitamento por cliente. Texto, identidade visual, regras e aprovação pertencem ao destino, não à fonte.

## 4. Fase 0 — capacidade e publicação manual confiável

1. Liberar a operação do D1 e medir consumo real antes de escolher plano ou migração. O erro indica limite, não a causa do consumo.
2. Medir consultas de listagem, artigo, sitemap e painel: frequência, linhas lidas, índice utilizado e volume retornado. O blog público deve buscar apenas posts publicados e a lista não precisa transportar o corpo integral de todos os artigos.
3. Definir cache curto de leitura pública, com invalidação após salvar/publicar/arquivar. Não aplicar cache a sessão, rascunhos ou conteúdo administrativo. Prever atualização entre regiões e tempo máximo de propagação; validar o conteúdo público após esse intervalo, sem interpretar um HTTP 200 como entrega.
4. Conferir estado de erro/fallback: artigo de acervo pode continuar disponível; artigo novo não deve virar um falso 404 permanente quando o banco estiver indisponível. Falhas temporárias não devem receber cache longo.
5. Validar pelo painel um artigo autorizado: criar, salvar, recarregar, adicionar capa, publicar e confirmar página, HTML, listagem e sitemap. Para testes, usar ambiente isolado; não publicar pauta fictícia em produção.

**Saída:** banco operacional, publicação manual confirmada e consumo de leitura conhecido. Sem isso, não iniciar automação recorrente.

## 5. Fase 1 — cadastro de clientes, destinos e fontes no Radar

Reaproveitar `source_catalog`, `sources`, `site_adapters`, `source_fetches`, `items` e `client_sources`.

### Cadastro de destino

Identificador estável do cliente/portal, nome, URL pública, tipo de publicação (`wordpress` ou `codigo5`), fuso, categorias válidas, contato responsável e estado ativo/pausado. Credenciais ficam no ambiente/gerenciador de segredos, nunca no CSV, tela pública ou documento.

### Cadastro de fonte

Domínio e URL canônica, forma de coleta (feed, HTML, sitemap ou URLs-semente), temas, idioma, frequência, prioridade, último sucesso e erro observado. Validar domínio e extração antes de ativar. Definir direitos e regras de aproveitamento; encontrar uma referência não autoriza copiar integralmente texto ou fotografia.

### Vínculo cliente × fonte

Reutilizar a unicidade do par existente. Associar relevância, assuntos incluídos/excluídos, região e limite de pautas. A mesma fonte pode ter vínculos diferentes para Código5, uma clínica ou uma loja.

### Operação de cadastro

“Adicionar fonte” → informar endereço → testar títulos, datas, links e texto → escolher clientes interessados → salvar desativada → ativar após teste. Fonte com falha de extração deve mostrar o motivo, não entrar silenciosamente na rotina.

O catálogo local auditado contém 237 fontes ativas e 24 vínculos ativos para `perrengue`. São contagens do cadastro consultado, não garantia de coleta bem-sucedida. Não transformar o grupo G5 em lista genérica: seu runner exige cinco domínios específicos. As sete linhas rotuladas G5 no catálogo mestre precisam de classificação; não provam falha do runner ativo. Criar grupos próprios para novos interesses, preservando o contrato G5.

**Saída:** fonte nova coletada e vinculada ao cliente certo; teste comprova que o vínculo de outro cliente não é alterado.

## 6. Fase 2 — seleção editorial por destino

1. Reaproveitar o envio de candidatos do Radar em `simulate`, sem publicar ao coletar.
2. Selecionar destino e categoria pela lista de opções reais do Sync; bloquear categoria inválida ou destino pausado.
3. Acrescentar perfil editorial por destino: público, serviço relacionado, tom, região, tamanho, instruções de imagem e necessidade de revisão. Para Código5: explicar implicações práticas para empresários, evitando notícia genérica sem relação com os serviços/clientes.
4. Manter referência original, data de coleta, hash e trecho utilizado. Informar ausência de dado; não completar fatos por suposição.
5. Preservar a política source-only do Sync. Adicionar fontes não autoriza ativar enriquecimento factual externo nem mudar regras dos portais atuais.

**Saída:** uma referência produz rascunhos distintos e corretamente associados a dois clientes, sem vazamento de regras ou reaproveitamento acidental de publicação.

## 7. Fase 3 — novo adapter de publicação Código5

O Sync já possui criação/atualização WordPress, busca por origem e `portal_publications`. Reaproveitar essa responsabilidade e adicionar o destino Código5 na mesma seleção de adapter, sem duplicar geração ou fila.

### API do site — contrato novo, ainda não implementado

Rotas propostas, não existentes: `POST /api/integrations/sync/articles`, `GET /api/integrations/sync/articles/:externalId` e ação autenticada de publicação. Separar criação/atualização de rascunho da publicação; o padrão inicial é rascunho.

Campos mínimos do contrato:

- `externalId`, `destinationId`, `revision` e chave de idempotência;
- título, endereço sugerido, resumo, conteúdo e termos validados;
- referências de origem e identificação do job/candidato;
- capa com descrição alternativa, origem e indicação de ilustração;
- ação solicitada: rascunho ou publicação autorizada.

Resposta deve conter identificador persistido, estado, revisão, URL canônica quando aplicável e erros legíveis. “Aceito” não significa “publicado”. Após timeout, consultar o mesmo identificador antes de reenviar.

### Segurança e consistência

- Credencial exclusiva por destino, revogável e com permissões separadas para rascunho/publicação. Não reutilizar a sessão do usuário nem distribuir o segredo administrativo geral entre clientes.
- Validar tamanho, HTML, categorias, URL, mídia e tipo de arquivo. Para baixar imagem, bloquear rede privada, redirects inseguros e formatos não permitidos; preferir upload para o armazenamento já usado pelo site.
- Índice único por integração + destino + identificador externo. Não usar só o slug para decidir se o conteúdo já existe.
- Registrar mapeamento para draft/post e revisão. Um retry não cria outro artigo; uma versão antiga não sobrescreve a mais nova.
- Preparar mídia antes de publicar. Se o upload falhar, manter o rascunho e o erro; não publicar artigo parcialmente pronto.
- Persistir mudanças relacionadas em transação/batch adequado. Preservar redirects em troca de endereço e impedir colisão com outro artigo.
- Gravar pela camada de conteúdo do site. O Sync não acessa D1 diretamente; isso preserva regras, sanitização, SEO e auditoria.

**Saída:** enviar o mesmo job duas vezes gera um único rascunho, com a mesma capa e identificador. Revisão/publicação confirmadas pelo site e pelo Sync.

## 8. Fase 4 — experiência simples no painel

Tela de uso diário: “Pautas recebidas”, “Rascunhos” e “Publicados”. Em cada pauta: assunto, fonte, cliente/destino, data e botão “Preparar artigo”. No editor: título, texto, capa e “Salvar e publicar”; fonte e ajustes opcionais ficam acessíveis sem ocupar a tela inteira.

Exibir claramente:

- de onde veio a referência;
- quem deve revisar e para qual site o artigo irá;
- texto/imagem ainda em preparação, falha recuperável ou pronto para revisar;
- URL publicada somente depois da confirmação;
- último erro e próxima ação, sem exigir que o operador leia logs.

Sugestões de categoria/SEO podem ser automáticas, mas editáveis. Prévia deve mostrar título, resumo, capa e corpo como aparecerão no blog. Agendamento futuro só entra após o fluxo manual e a fila estarem validados; não criar um segundo agendador concorrente.

## 9. Fase 5 — canário e expansão

1. Começar com Código5, uma fonte escolhida e apenas rascunhos.
2. Confirmar coleta, deduplicação, geração, mídia, revisão e publicação na ordem.
3. Testar falhas: fonte fora do ar; resposta 429/500; imagem recusada; timeout após gravação; categoria inválida; colisão de endereço; replay; credencial revogada; banco sem capacidade.
4. Testar o mesmo material em dois destinos. Bloqueio de um destino não deve interromper outro, nem compartilhar credenciais.
5. Liberar gradualmente novos grupos e fontes. Definir orçamento/limites de gerações por destino, frequência e número de pautas; coleta e geração devem ter controles separados para evitar custo por item irrelevante.
6. Monitorar fila, jobs sem progresso, falhas por fonte, artigos duplicados e confirmação pública. Reutilizar lease/reclaim/watchdog e deduplicação do Sync; não criar outro sistema de filas.

**Concluído quando:** novo cliente/portal é cadastrado sem patch específico; uma publicação única e correta é confirmada; erro e retomada funcionam; portais atuais continuam com configuração e comportamento anteriores.

## 10. Ordem de execução e isolamento

| Ordem | Entrega | Dependência |
|---|---|---|
| 0 | Liberar capacidade e provar publicação manual | Banco disponível e acesso do usuário ao painel |
| 1 | Cadastro e teste de fontes/vínculos | Radar atual, sem mudar G5 |
| 2 | Perfil editorial por destino e candidatos | Categorias/destinos reais do Sync |
| 3 | API Código5 + adapter Sync + idempotência | Contrato versionado e testes isolados |
| 4 | Caixa de pautas/revisão no painel | API/candidatos funcionando |
| 5 | Canário e expansão gradual | Readback público e falhas testadas |

O Sync local estava com alterações alheias no worktree. Trabalhar em checkout isolado a partir da revisão de produção confirmada e reconciliar os contratos antes de mexer. README/SYSTEM do Sync ainda contêm referências Cloudflare incompatíveis com o runtime Node observado; corrigir a documentação no projeto antes da implementação. Não usar caminhos de infraestrutura legada como base do rollout.

Rollback por etapa: pausar apenas o destino Código5, preservar jobs e artefatos, restaurar a imagem/deployment anterior, manter migrações aditivas e não apagar artigos entregues. Não restaurar banco inteiro para desfazer uma alteração de interface.

## 11. Evidências e pontos de entrada

Código5: `src/hooks/use-runtime-blog.ts`, `src/pages/AdminEditorialPage.tsx`, `functions/api/admin/posts-save.ts`, `posts-publish.ts`, `functions/api/bot/posts.ts`, `functions/_shared/bot/db.ts`, `functions/_middleware.ts` e `wrangler.toml`.

Radar: `src/radarcred/sources.py`, `crawler.py`, `runner.py`, `storage.py`, `web.py`, `data/source_catalog.csv`, `data/client_sources.csv` e `docs/source-sync-spec.md`.

Sync: `docs/contracts/v1-api.md`, `db/schema.sql`, `worker/src/index.ts`; produção inspecionada em `server.mjs`, funções `Cod5SqliteD1`, `Cod5DurableQueue`, `createOrUpdateWordPressPost`, `processQueuedJob` e `findExistingWordPressPostByOrigin`. A equivalência do checkout local com a imagem ativa não foi assumida.

Este documento é um plano. Não foram cadastradas fontes, ativados jobs, implementado o novo adapter ou publicadas pautas em nome do usuário.
