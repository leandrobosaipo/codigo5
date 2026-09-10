# Regras do projeto Código5

- Para sitemap, indexação ou Search Console, use a skill `google-search-console`; use `seo-audit` quando o pedido exigir diagnóstico técnico mais amplo.
- O sitemap deve conter somente URLs canônicas e indexáveis. Em `<lastmod>`, emita `AAAA-MM-DD` ou ISO 8601 completo com fuso; prefira `AAAA-MM-DD` quando o banco não guardar o fuso.
- Antes de publicar mudanças no sitemap, execute os testes, gere o build e valide que todo `lastmod` corresponde a `^\d{4}-\d{2}-\d{2}$`.
- Depois do deploy, confira `/sitemap.xml` no ambiente público e o relatório do sitemap no Google Search Console. Um sitemap aceito não comprova que todas as páginas foram indexadas.
