# GSC e Telegram — 7 de outubro de 2026

## Resultado

A correção foi implantada no portal e no worker. Foi feita **uma única tentativa** para o artigo indicado.

O clique em “Solicitar indexação” ocorreu. O Search Console não mostrou a confirmação dentro de 180 segundos. O resultado fica como **não confirmado** (`delivery_unknown`). Não haverá nova tentativa automática para este pedido.

## Alvo e tentativa

- **Job:** `d1a7ad2ee02294fd336736484ccf6f17`
- **Artigo:** https://codigo5.com.br/blog/da-planilha-ao-acompanhamento-comercial
- **Tentativas:** 1 → 2
- **Estado final:** `delivery_unknown`
- **`requested_at`:** vazio

A checagem inicial do artigo (preflight), que antes o bloqueava como `article_invalid`, passou nesta execução. Depois do clique, a tela não exibiu “Indexação solicitada”; isso não permite afirmar se o Google recebeu ou não o pedido.

| Fase | Resultado | Duração |
| --- | --- | ---: |
| Preflight | `ok` | 395 ms |
| Inicialização do navegador | concluída | 14.077 ms |
| Abertura do Search Console | concluída | 10.048 ms |
| Resultado da inspeção | concluído | 3.719 ms |
| Clique | concluído, `clicked=true` | 153 ms |
| Confirmação | `confirmation_unverified` | 180.012 ms |
| **Total** | **sem confirmação do Google** | **208.835 ms** |

## Aviso no Telegram

O evento `d1a7ad2ee02294fd336736484ccf6f17:delivery_unknown:attempt-2` foi aceito pelo callback e ficou `acked`/`sent`, com uma chamada ao provedor. Isso confirma o aceite técnico do envio; não confirma que uma pessoa leu a mensagem.

O evento anterior `:blocked` permaneceu intacto (`delivery_unknown`, `ack=article_invalid`).

## Leitura posterior no Google

Em uma aba nova do Chrome, fiz uma consulta somente de leitura para o mesmo URL. O Search Console exibiu “O URL não está no Google” e “O Google não reconhece o URL”; não mostrou sitemap ou página de referência, e o último rastreamento aparecia como `N/D`.

A tela oferecia o botão “Solicitar indexação”. Ele não foi acionado. Essa tela confirma que o URL ainda não aparecia indexado no momento da consulta, mas não esclarece se o Google recebeu o clique anterior. A causa da falta de confirmação continua desconhecida e o estado da tentativa permanece `delivery_unknown`.

A consulta pelo IAB não estava disponível no contexto desta execução. Depois, o contexto raiz do Codex confirmou a mesma leitura em uma nova aba IAB, somente de leitura: URL não está no Google, Google não reconhece o URL, sem sitemap ou página de referência, último rastreamento `N/D`. O botão “Solicitar indexação” não foi acionado. Nenhuma dessas telas confirma o recebimento do clique anterior.

## Deploy e saúde

- **Portal:** `codigo5-web:gsc-20261007-4b95d7b28e6d` — saudável.
- **Worker:** `codigo5-gsc-worker:gsc-20261007-f1d22f4025a9` — saudável após a execução.
- Na última verificação, o heartbeat tinha 4 segundos e `gsc-watchdog.timer` estava ativo.
- O bundle ativo do portal contém o handler e a mensagem de razão corrigidos. Os hashes dos três módulos ativos do worker correspondem aos arquivos aprovados.
- Página do artigo: HTTP 200. Health do portal: HTTP 200. Callback sem credencial: HTTP 401.
- A fila terminou sem itens due ou em processamento. O job `delivery_unknown` não é reivindicado pelo loop normal.
- O container `codigo5-web-backup` também reiniciou com a tag do portal, pois ambos usam `COD5_IMAGE` no stack. Está em execução; não houve alteração de volumes ou banco.

## Validação

- Testes GSC server: 26/26.
- Testes Telegram: 9/9; o teste local não enviou mensagens reais.
- `build:server` e `build`: passaram.
- Smoke do callback sem credencial: HTTP 401.
- Nenhum segundo `processOne` foi iniciado.

## Arquivos do pacote

- **Handler de evento e mensagem Telegram:** `functions/api/integrations/gsc/events.ts` e `src/test/gsc-events.test.ts`.
- **Worker, checagem inicial do artigo e navegador:** `server/gsc-worker.mjs`, `server/gsc-preflight.mjs` e `server/gsc-browser.mjs`, com seus testes.
- **Documentação do fluxo:** `docs/gsc-runner.md` e `docs/gsc-debug-project-plan.md`.

## Próximo passo

Investigar os sinais visuais que levaram ao timeout de confirmação e melhorar a evidência dessa fase. Uma captura futura deve ser sanitizada. Não repetir o pedido para este job sem autorização e sem esclarecer o estado atual no Google.

## Rollback e evidências

Os arquivos completos de stack, ambiente, compose e snapshot SQLite estão fora do repositório em `/Users/leandrobosaipo/Projetos/codigo5.com.br/reports/gsc-debug-2026-10-07/rollback/`. O diretório está em modo `700`; os 18 arquivos estão em modo `600`. Os hashes antes e depois da movimentação conferem. O snapshot SQLite passou em `integrity_check` e mantém o job-alvo e o evento anteriores ao retry; seu SHA-256 é `d1ceeb7e55762955a9ad6ddc28b582b40c63448f114e83d7bb09d6faf95360d2`. Os demais hashes e as tags anteriores estão no manifesto privado. As tags anteriores são `codigo5-web:7f958d9` e `codigo5-gsc-worker:81dcaac`.

O script operacional da chamada única e seus hashes também estão no diretório privado. Ele coletou as fases e as imprimiu quando `processOne` terminou; por isso os logs de fase não apareceram em tempo real durante a espera de confirmação.
