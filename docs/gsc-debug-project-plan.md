# Plano: corrigir e validar a solicitação de indexação

## Escopo e critério de sucesso

O fluxo cobre artigos publicados presentes na fila `gsc_queue`, com ou sem vídeo. Não criar gatilho separado para vídeo. Sucesso exige confirmar o clique em **Solicitar indexação** e ler **Indexação solicitada** no Search Console. `already_requested` é leitura do estado anterior e não pode criar um novo clique nem preencher `requested_at`. Depois que o clique começa, qualquer falha sem confirmação fica `delivery_unknown` e não recebe retry automático.

## Atividades

1. **Diagnóstico** — concluído. O job `d1a7ad2ee02294fd336736484ccf6f17` apontou para `https://codigo5.com.br/blog/da-planilha-ao-acompanhamento-comercial`, estava `blocked/article_invalid`, tentativa 1, `requested_at` nulo. O preflight posterior retornou `ok`. O catch amplo anterior não persistia a causa exata; ela é irrecuperável sem nova tentativa de diagnóstico.
2. **Runner e preflight** — distinguir falhas de rede, HTTP e validação com códigos seguros; incluir fase, categoria, clique, duração e erro categorizado nos registros; persistir diagnóstico mínimo no evento; diferenciar a intenção de clicar da confirmação de `click()` resolvido; remover o bloqueio `already_indexed` quando a ação ainda está disponível.
3. **Callback/Telegram** — aceitar o diagnóstico estruturado do worker e mostrar etapa e erro em linguagem clara. Contrato do callback: `eventId`, `jobId`, `status`, `url`, `phase`, `code`, `clicked`, `detail`, `attempt`. `eventId` de execução inclui a tentativa.
4. **Validação local** — testar causas de preflight, clique confirmado, artigo indexado com botão disponível, solicitação já existente, timeout depois do clique, persistência e callback, e IDs distintos em tentativas diferentes.
5. **Deploy controlado** — antes de alterar produção, salvar imagem/configuração atuais, confirmar rollback e validar os testes locais. Depois do deploy, ler a versão ativa e o comportamento do consumidor antes de reexecutar.
6. **Reexecução exata** — depois do gate de backup, deploy e readback, reexecutar uma única vez o job exato acima. Não criar job substituto nem retry genérico. Se a tentativa anterior estiver inconclusiva, verificar o estado no Search Console antes de qualquer novo clique.
7. **Relatório** — registrar diagnóstico observado, evidência de clique e texto de confirmação, estado final no banco e entrega/ACK do callback. Se a confirmação não for observada, reportar `delivery_unknown`.

## Evidência atual

O estado de produção citado é a leitura auditada que iniciou este plano. A confirmação antiga de clique não existe. Preflight `ok` sozinho não comprova solicitação no Search Console. Deploy, nova execução e readback final permanecem pendentes.
