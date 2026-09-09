# Migração D1 → Mac Mini

Data: 09/09/2026. Estado: inventário confirmado; implementação e troca de produção pendentes.

## Contrato

Preservar site, blog, painel, autenticação Telegram, uploads, URLs, redirecionamentos e SEO. Migrar dados sem perdas. Cloudflare permanece como DNS/Tunnel/Access; aplicação e banco passam ao Mac Mini. Desativar o legado somente após funcionamento comprovado. Não excluir backups nem bancos de outros serviços por associação de nome.

## Inventário confirmado pela API

| Banco D1 | Consumidor configurado | Situação a validar |
|---|---|---|
| codigo5-bot | Pages codigo5-web | Blog, rascunhos e redirects deste site; primeira onda |
| rbike-shop-prod | Pages rbike-bloom-shop | Loja; exige teste de pedidos, autenticação e pagamento antes de troca |
| cod5-leads-diagnostico | Pages cod5-leads-diagnostico | Diagnóstico e integrações; exige rastrear webhooks e tarefas |
| adops-ops | Worker adops-api-public | Binding legado presente; comparar com runtime ativo antes de desativar |
| cod5-news-sync | Worker cod5-news-sync | Sync principal confirmado no Mini; investigar tráfego/cron remanescente |
| moises-jobs-production | Worker moises-api | Mapear uploads, processamento, jobs e consumidores |
| he-marketing-vini-amorim-ops | Nenhum binding encontrado nos Pages/Workers listados | Verificar acesso direto por API e histórico antes de classificar inativo |
| hannaecelso-site | Nenhum binding encontrado nos Pages/Workers listados | Verificar acesso direto por API e histórico |
| teste1 | Nenhum binding encontrado nos Pages/Workers listados | Nome não comprova ausência de uso |

Binding configurado não comprova tráfego. Ausência de binding não descarta uso via API. Radar usa SQLite no Mac Mini; Sync ativo usa SQLite local, fila durável e scheduler. Esses serviços não precisam ser migrados novamente.

## Evidência inicial Código5

- Baseline: 59 testes aprovados, 18 arquivos, antes de qualquer implementação.
- Isolamento: branch migration/macmini-d1, worktree migration-macmini, base f22bdb2. Main preservada.
- D1 exportado: 67.590 bytes; SHA256 0939ad957a8fa354ed4cb4f2202a88542e18431864df1050f98ff0c417018005.
- Restauração em SQLite temporário: integrity_check = ok; 12 drafts, 3 posts, 14 redirects, 0 users e 0 publish_jobs. Contagens referem-se ao instante do export.
- Sessões/login estão em KV e precisam ser tratados separadamente.
- Arquivos permanecem em DigitalOcean Spaces; migração do banco não implica mover imagens.
- Mac Mini: Portainer endpoint 3 online, 140 GiB livres no sistema. Volume /srv/cod5-files com 87% usado: evitar para esta migração.

## Onda 1 — Código5

### 1. Fixar baseline e mapa de dependências

Registrar commit, imagem, domínio, rotas e configuração ativa. Inventariar todas as Functions e uso D1/KV. Identificar credenciais locais equivalentes aos secrets do Pages; API do provedor não revela secrets criptografados. Manter valores fora do Git e relatórios públicos. Verificar consumidores Telegram e ferramentas de publicação antes do corte.

Aceite: mapa completo, backup restaurável, configuração necessária disponível e testes baseline verdes.

### 2. Implementar compatibilidade mínima

Reutilizar os handlers existentes e o padrão SQLite já operado no Sync. Node serve o build estático e encaminha APIs/middleware sem reescrever regras editoriais. SQLite persistente com WAL, synchronous FULL, timeout de bloqueio e transações. Sessões KV passam para tabela com expiração; preservar sessões existentes quando exportáveis. Não compartilhar banco com Sync.

TDD: testes de leitura/escrita persistida, rollback de transação, expiração de sessão, proteção do admin/bot, redirects, artigo dinâmico e sitemap. Primeiro comprovar falha esperada; depois implementar o mínimo e rodar regressão.

Aceite: mesmos contratos HTTP e autenticação; nenhum segredo no bundle ou resposta; nenhum banco vazio inicializado silenciosamente em produção.

### 3. Subir ambiente candidato no Mini

Criar stack própria, diretórios data/backups dedicados, porta loopback confirmada livre, restart e healthcheck. Usar imagem identificada pelo commit e limites proporcionais. Importar cópia do banco, validar integridade, contagens e conteúdo por hash. Instalar backup consistente e restaurá-lo em outro arquivo para comprovar recuperação. Publicar hostname candidato somente pelo Tunnel.

Aceite: imagem/commit identificáveis, volume persistente, reinício preserva dados, logs sem erro e URL candidata funcional. Não alterar domínio principal nesta fase.

### 4. Revisar e testar fluxo real

Revisão de contrato primeiro: cada recurso existente funciona. Revisão de qualidade depois: segurança, erros, concorrência, fechamento do banco, timeout HTTP, traversal de arquivos, método HTTP, cabeçalhos e permissões. Testar home, internas, blog antigo e dinâmico, categorias, redirects, sitemap, canonical, OG e noindex admin. Testar criação/edição de rascunho, upload e persistência; não publicar conteúdo fictício.

Aceite: testes automatizados e leitura real no navegador interno; health isolado não substitui o fluxo editorial. Chamadas externas que enviam mensagens exigem autorização de envio específica, não simulá-las como sucesso.

### 5. Corte com escritor único

Registrar backup/config anterior e congelar gravações no legado durante export final; requisições devem receber resposta temporária explícita para retry, nunca sucesso sem gravação. Fazer export final e importar antes de liberar gravações no novo. Reconciliar registros e sessões alterados desde o primeiro export. Alterar domínio/Tunnel mantendo URL pública. Evitar dois escritores independentes. Se não houver mecanismo seguro de congelamento e reconciliação, não efetuar corte.

Aceite: requests públicos chegam ao Mini, dados finais coincidem, edição persiste após reinício e consumidores apontam para o destino correto. Durante a transição, manter páginas públicas acessíveis.

### 6. Monitorar e corrigir

Monitorar HTTP público, health que consulta tabelas, latência, 5xx, erros de SQLite, disco, backup e reinícios. Usar ferramentas existentes do Mini/UptimeRobot; alertas somente relevantes, cooldown de 30 minutos e recuperação. Conferir um ciclo de backup e consumidores reais. Falha: reproduzir, identificar causa, teste de regressão, correção mínima, nova validação.

Aceite para retirada: fluxo editorial comprovado, backup restaurado, ausência de consumidores legados, período de observação documentado cobrindo operações agendadas existentes.

### 7. Retirar legado com reversão preservada

Desativar rotas/cron/webhooks antigos vinculados ao serviço migrado e impedir novas gravações no D1. Preservar export e configuração de retorno. Exclusão definitiva do banco não é necessária para retirar a dependência e só ocorre depois da retenção acordada/definida com evidência. Não excluir D1 de serviços ainda pendentes.

Rollback antes de novas gravações: restaurar roteamento anterior. Depois de novas gravações: congelar novo escritor, exportar SQLite, reconciliar/importar deltas no destino de retorno e só então reabrir. Nunca simplesmente apontar ao D1 desatualizado.

## Ondas seguintes

1. Sync/AdOps: identificar domínio efetivo, acessos diretos workers.dev, cron e dependências; retirar apenas o legado comprovadamente substituído. Sem replay de jobs ou publicações duplicadas.
2. Diagnóstico/leads: preservar consentimento, histórico, filas, webhooks, Chatwoot/Evolution e idempotência; simular integrações antes de ativar envio real.
3. Moisés: mapear jobs em curso, blobs, duração e retries; drenar fila e validar produto final antes do corte.
4. Rbike: janela própria com pedidos, estoque, sessões, OAuth, frete, pagamento e webhooks conciliados. Não usar cobrança real para teste. Não permitir dois escritores de pedidos.
5. Bancos sem consumidor: levantar acessos por API e confirmar inexistência de uso antes de arquivar/desativar.

Cada onda exige seu próprio repositório/worktree, baseline, backup, teste candidato, revisão, corte serial, monitoramento e evidência final. Investigações independentes podem ocorrer em paralelo; arquitetura, importação e troca de tráfego são seriadas.

## Conclusão verificável

Por serviço registrar: recurso antigo, novo stack/imagem/commit, backup/hash/data, contagens, testes, URL pública, operação real comprovada, monitor ativo, rollback e estado do legado. Marcar PASS, FAIL ou NÃO VERIFICADO por requisito. Não declarar migração concluída com base apenas em build ou container saudável.

## Impedimento encontrado antes da implementação

A API do Pages informa TELEGRAM_BOT_TOKEN, TELEGRAM_SECRET_TOKEN, TELEGRAM_ALLOWED_USER_IDS e configuração Spaces como secret_text, sem revelar valores. O arquivo documentado /Users/leandrobosaipo/.openclaw/codigo5-github/.env.telegram.cod5 não existe mais. A busca por arquivos de configuração locais nos projetos e fontes operacionais não encontrou a configuração real desse bot. Não substituir por token de outro bot ou credencial de outro cliente.

Próxima dependência para executar o corte: recuperar a configuração desse serviço de backup/gerenciador de segredos ou reprovisionar suas credenciais de forma controlada. Não colocar valores no chat ou Git. O site e recursos Cloudflare foram preservados; nenhum serviço foi desligado. O plano está pronto para revisão; a migração de produção ainda não foi executada.
