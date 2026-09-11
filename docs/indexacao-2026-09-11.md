# Auditoria de indexação — 11/09/2026

## Resultado atual

Verificadas 72 páginas na origem Mac Mini: 8 institucionais, 22 artigos, 10 categorias e 32 arquivos de tags. Todas responderam 200. As 40 URLs do sitemap têm um H1, canonical próprio, `index,follow,max-image-preview:large` e nenhum cabeçalho X-Robots-Tag. As 32 tags mantêm `noindex,follow` intencional e ficam fora do sitemap. Painel, APIs e o host novo.codigo5.com.br continuam protegidos contra indexação.

As 40 URLs foram abertas também no navegador interno no domínio público, com canonical e robots conferidos. robots.txt permite rastreamento e referencia o sitemap correto; todos os lastmod atuais usam AAAA-MM-DD.

## Search Console

- Artigo `seo-pratico-ajude-clientes-e-o-google-a-entender-seu-site`: o índice conservava exclusão por noindex do rastreamento de 10/09 às 10:33:15. Teste ao vivo em 11/09 às 09:46 aprovou: “O URL está disponível para o Google” e “É possível indexar a página”. Nova solicitação de indexação aceita.
- Artigo `como-usar-ia-para-acelerar-marketing-e-vendas`: ainda desconhecido no índice. Teste ao vivo em 11/09 às 09:50 aprovado. Solicitação de indexação aceita.
- Sitemap reenviado em 11/09 e envio confirmado. Relatório ainda mostrava última leitura de 10/09, status Processado e 39 URLs; arquivo atual contém 40. Aguardar nova leitura.

Não foi possível atribuir a causa exata do noindex histórico: ele não se reproduziu no HTML atual nem nos testes atuais do Google. Não houve remoção de tag ou deploy de aplicação nesta auditoria. Não declarar os artigos indexados com base na fila de solicitação.

## Checklist de manutenção

- [x] HTML inicial, HTTP, canonical, robots, sitemap e conteúdo dos 72 caminhos verificados.
- [x] Robots e canonical das 40 URLs indexáveis conferidos no navegador público.
- [x] Ambos os artigos aprovados pelo Googlebot no teste ao vivo.
- [x] Solicitações de indexação e reenvio do sitemap aceitos.
- [x] Google tag GT-KDD832 presente no artigo público; JSON-LD presente.
- [ ] Recebimento de eventos e conversões no GA4 não revalidado nesta auditoria de indexação. Presença da tag não comprova recebimento.
- [ ] Aguardar rastreamento/indexação efetiva e nova leitura do sitemap.

O verificador `node scripts/check-static-seo.mjs` agora exige exatamente uma diretiva robots e falha se uma página pública gerada apresentar noindex; permite noindex somente em arquivos de tags. Passou nas 70 páginas do build. Os dois artigos posteriores ao build foram verificados na origem, no navegador e no GSC.

Evidência detalhada local: `../reports/indexacao-2026-09-11/origin-completo.json`. Nenhuma alteração em banco, posts, Sync, Radar ou infraestrutura.
