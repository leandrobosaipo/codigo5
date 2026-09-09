# Operação Radar → Sync → blog Código5

Entrega de 09/09/2026. O site e seus dados continuam no Mac Mini. A integração usa a API protegida do site; Sync não acessa seu banco diretamente.

## Uso diário

1. No Radar, selecione o cliente Código5 e uma fonte/pauta relevante.
2. Encaminhe ao Sync com destino Código5. Confirme a simulação para preparar texto e capa como rascunho.
3. Confira título, informações, fonte e imagem no detalhe do job e no editor. Simulação não publica.
4. Depois da revisão, confirme a publicação do mesmo job. Aguarde `completed` e confira o link público.

A coleta da fonte Google Search Central roda às 8h e 16h (America/Cuiaba), com trava de concorrência, timeout e deduplicação. O piloto limita cada coleta a três itens. Coletar não gera texto/imagem nem publica automaticamente. Novas fontes precisam ser cadastradas e associadas ao cliente, com extração validada antes de entrar no agendamento. Não reutilizar o grupo legado `codigo5`: executar explicitamente `--client codigo5`.

## Evidência da entrega

- Radar: código dd7cb09; imagem release-071ea32 e script de coleta versionado em volume. Execuções 66–68 concluídas; repetição encontrou os mesmos três itens sem duplicá-los. Catálogo dos demais clientes preservado.
- Sync: release 52a2adc, incluindo adapter Código5, fila de simulação e autenticação limitada às rotas Radar. Releases posteriores podem incorporar trabalho concorrente; conferir SHA real antes de operar.
- Site: release ce2af04. Sessenta testes Vitest e build do servidor passaram; testes de integração cobrem autenticação, revisão, deduplicação e recuperação de falha.
- Um único artigo gerado, revisado e publicado: [SEO prático: ajude clientes e o Google a entender seu site](https://codigo5.com.br/blog/seo-pratico-ajude-clientes-e-o-google-a-entender-seu-site).
- Job Sync `8e578d08-4287-48d6-a455-eb520d61b2fa`, candidato Radar 7. Estado final `completed`, etapa `published`.
- Comparação por hash confirmou os 12 rascunhos, três posts e 14 redirecionamentos anteriores intactos. Acréscimo: um rascunho e um post.
- A capa foi conferida no navegador interno, assim como artigo, título, canonical e Open Graph.

## Cache e preservação

Uma regra antiga Cloudflare mantinha HTML/API por cinco horas e ignorava a origem. Foi preservada e complementada por bypass de `/api/`, `/admin`, `/blog` e `/sitemap.xml` nos domínios do site. A listagem dinâmica também responde `Cache-Control: no-store`. Isso evita apresentar uma publicação nova como inexistente.

Backups ocorreram antes dos deploys. As configurações e volumes existentes foram preservados; apenas imagens de release e credenciais específicas da integração foram adicionadas/atualizadas. Os segredos ficam no ambiente, nunca neste documento.

## Acompanhamento e recuperação

O monitor existente acompanha saúde, integridade dos backups, artigo público e próxima coleta agendada. O primeiro ciclo futuro do cron ainda precisa ser observado; as execuções manuais já passaram. Não afirmar indexação Google somente porque o sitemap contém o artigo.

Em falha, consulte o mesmo job antes de repetir: um timeout pode ocorrer depois de o site gravar. A integração consulta `externalId` para recuperar esse resultado sem duplicar publicação ou imagem. Não crie outro job para contornar erro sem confirmar o anterior.

Não restaure um banco antigo sobre gravações novas. Antes de redeploy Sync, obtenha configuração atual, verifique fila e coordene com outras tarefas. Mantenha os tokens de rascunho/publicação separados. Evidências operacionais privadas ficam em `reports/integration-radar-sync-2026-09-09`, fora do repositório público.
