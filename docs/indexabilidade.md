# Contrato de indexação

Artigos públicos novos são renderizados pelo servidor a partir do SQLite, sem rebuild. Painel, bot Telegram e Sync devem produzir HTTP 200, canonical próprio, robots sem noindex e conteúdo no HTML original, além de uma única entrada no sitemap. Os testes HTTP usam banco temporário e substituem somente a consulta externa da imagem de teste.

## Sitemap e falhas

- O sitemap dinâmico filtra fontes de redirects do SQLite e do arquivo `_redirects` para todas as URLs, incluindo o arquivo de posts estáticos.
- O build também exclui redirects estáticos, inclusive padrões com `*`. A regra 200 da SPA não é redirect.
- Se o banco não permite confirmar redirects, o sitemap temporariamente contém apenas as oito rotas institucionais, filtradas pelos redirects estáticos conhecidos, com `no-store` e marcador de fallback. Artigos não são apagados; a recuperação do banco restaura o sitemap completo.
- Tags, admin, Mini App e rascunhos permanecem fora do sitemap e não indexáveis. Não retirar noindex globalmente.
- Lastmod usa AAAA-MM-DD. URLs sem data conhecida não recebem data inventada.

## Verificação

`npm run build` inclui a validação do HTML estático e de cada URL do sitemap de build. `npm run build:server` e `npm run test:server` verificam publicação pelos três caminhos, exclusão de rascunhos, repetição idempotente no Sync e renomeação de slug.

`npm run check:public-seo -- https://codigo5.com.br/sitemap.xml` confere todas as URLs; trocar pelo endereço de um artigo para conferência após publicação. As requisições não levam sessão, não seguem redirects, têm timeout e são sequenciais. Saída com erro indica pendência de entrega, sem desfazer publicação ou criar retry editorial. Agentes usam navegador interno para a coleta pública, conforme política global.

Não é necessário criar endpoint ou alterar o contrato das APIs de publicação. O verificador é um gate operacional, não um job agendado nem bloqueio de gravação no banco.

## Alerta GSC de setembro de 2026

O relatório apontou sete redirects históricos e quatro artigos excluídos por noindex. Em 16/09 as onze URLs já retornavam 200, canonical próprio e index,follow no HTML-fonte. O teste Google ao vivo do artigo de horários cancelados confirmou indexabilidade, repetida em 17/09. A origem exata do noindex histórico não foi comprovada; esta mudança não deve ser apresentada como causa de sua remoção.

Após deploy: verificar o sitemap servido, testar as URLs no navegador, solicitar reindexação das quatro afetadas e validar os dois motivos no GSC. Registrar os resultados observados; rever após 7 e 14 dias. Indexação final depende do Google.

Publicação usa a stack Portainer `codigo5-web`, imagem por commit. Seguir `migracao-macmini-operacao.md`. Preservar SQLite e configuração no rollback.
