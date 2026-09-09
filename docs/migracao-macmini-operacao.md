# Operação Código5 no Mac Mini

Migração de 09/09/2026. Escopo concluído nesta onda: site Código5, APIs editoriais, painel e armazenamento do bot Telegram. Os demais bancos D1 estão no plano de migração por aplicação; não foram desativados.

## Estrutura em produção

- Portainer endpoint 3, stack 231 `codigo5-web`.
- Aplicação Node 24 + SQLite nativo, sem nova dependência de banco. Handlers existentes preservados.
- Porta loopback `127.0.0.1:8336`, acessada pelo Cloudflare Tunnel codigo5-cloud.
- Domínios `codigo5.com.br`, `www.codigo5.com.br` e `novo.codigo5.com.br`; o último permanece não indexável.
- Banco `/opt/cod5/codigo5-web/data/editorial.sqlite`; WAL, synchronous FULL, timeout de bloqueio e sessões com expiração.
- Backups `/opt/cod5/codigo5-web/backups`: cópia consistente a cada 6 horas, retenção das 14 últimas cópias. Conferir integridade antes de restaurar.
- Imagens continuam no DigitalOcean Spaces. Credenciais preservadas; valores nunca entram no Git.
- Configuração protegida local: `../env/.env.macmini`. `COD5_IMAGE` identifica a imagem do release.

## Evidência da migração

Export final comparado com o destino: 12 rascunhos, 3 posts e 14 redirecionamentos; todas as linhas e colunas originais preservadas. O banco antigo não tinha as duas colunas content_markdown da migração 0004: o startup agora aplica essa alteração de maneira idempotente, preservando HTML.

Fluxo autenticado validado também pela URL pública: login, criação e edição de rascunho, upload, leitura da imagem e persistência. Rascunho de teste removido; nenhum artigo fictício publicado e nenhuma mensagem enviada. Token e segredo do webhook foram recuperados do histórico e conferidos com os serviços reais.

A listagem pública exclui artigos cujo endereço já foi redirecionado. Isso evita oferecer links legados que voltam ao índice sem apagar o histórico.

Testes cobrem persistência após reabertura, transação com rollback, expiração de sessão, migração idempotente, autenticação, publicação em banco temporário, SEO dinâmico, redirects, métodos HTTP e bloqueio temporário de escrita. Build e verificador de SEO estático complementam esses testes.

Evidências privadas: `../reports/migration-macmini-2026-09-09/`, incluindo comparação final de dados e verificação editorial pública. Essa pasta contém backups e configuração sensível e não deve ser publicada.

## Release

1. Conferir git status e preservar alterações de outras tarefas.
2. Executar `npm run build`, `npm run build:server`, `npm run test:server`, `npm test -- --maxWorkers=2`, lint e verificação SEO pertinentes.
3. Criar commit. Construir Dockerfile com `COD5_REVISION` igual ao commit e tag imutável `codigo5-web:<commit>` no Docker do Mini.
4. Atualizar somente COD5_IMAGE na configuração protegida. Aplicar deploy/compose.yml à stack 231 preservando as outras variáveis e volumes.
5. Para imagem construída localmente, a atualização pela API Portainer precisa de `pullImage: false`; não tentar puxar essa tag de um registry externo.
6. Aguardar healthcheck e conferir imagem, hash do bundle, logs, domínio público e comportamento editorial. HTTP 200 isolado não prova publicação nem persistência.

## Recuperação

Para regressão de código, voltar à imagem anterior mantendo o volume atual. Antes de qualquer restauração de dados, bloquear gravações criando `/data/read-only` no container; confirmar POST 503 e preservar uma cópia do banco atual.

Restaurar backup primeiro em arquivo separado, executar PRAGMA integrity_check e conferir contagens e registros necessários. Substituição do banco exige aplicação parada e tratamento conjunto de SQLite/WAL/SHM; nunca copiar um arquivo antigo por cima de banco aberto. Reiniciar, validar leitura e escrita, e só então remover o bloqueio.

O D1 antigo é snapshot inativo: não voltar DNS ou escritores para ele depois de novas gravações no Mini sem reconciliação. A opção normal de rollback é a imagem anterior no Mini.

## Legado Cloudflare e acompanhamento

As 74 versões históricas com Functions foram retiradas. O Pages codigo5-web mantém apenas conteúdo estático com redirecionamento 307 para o domínio principal; bindings BOT_DB e BOT_SESSIONS removidos. O banco D1 codigo5-bot foi preservado como cópia inativa, não excluído. DNS e Tunnel continuam na Cloudflare.

O monitor existente da home foi preservado. Uma tarefa de acompanhamento executa verificações horárias por 24 execuções, notificando falha ou mudança relevante. Validar também backups e logs: monitor da home sozinho não garante saúde das APIs.
