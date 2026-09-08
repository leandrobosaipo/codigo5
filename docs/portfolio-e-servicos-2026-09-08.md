# Ampliação do portfólio e serviços — 8 de setembro de 2026

O catálogo preserva as 23 marcas da versão anterior e inclui Perrengue Mato Grosso (já constava do catálogo geral), Shop10, Rbike Shop MT e Titaniun Implantes. São 27 marcas e 11 projetos em destaque. Nomes, descrições e imagens se referem ao trabalho documentado; não representam promessa de resultado nem declaração de contrato atual.

## Evidências de contexto

- Shop10: `Shop10/README.md` e `DOCUMENTACAO_PROJETO.md`: site publicado, painel de conteúdo, SEO e operação. Domínio confirmado: shop10mt.com.br.
- Rbike: `Rbike/rbike-bloom-shop/docs/integrations/omie.md` e `Rbike/deploy/rbike-omie-sync/README.md`: catálogo, ERP, preço/estoque e apoio à venda. Domínio confirmado: rbikeshopmt.com.br. Não foram anunciadas integrações com marketplaces em piloto.
- Titaniun: `Titanium/titaniumimplantes-replit-home/docs/DEPLOY_VM8_RUNBOOK.md`: site institucional em produção. Grafia pública e domínio confirmados: Titaniun Implantes, titaniunimplantes.com.br.
- FlechaTur: `Flechatur/README.md` e documentação SEO; site público conferido em flechaturmt.com.br.
- Histórico Codex consultado: “Listar automações em nome amigável” (`01a0692b-46af-7133-a929-809fbc963555`), “Melhorar modal de rotina AdOps” (`01a06cef-ee28-7100-93bc-a403d355daf1`) e “Criar BI de contatos higienizado” (`01a06e22-e104-7783-8944-b4b6219364ef`). Sustentam capacidades de operação editorial, AdOps, BI, qualidade de dados e integrações. Dados pessoais, valores e informações operacionais privadas não entram no site.
- Projetos sem publicação comprovada e sites em preparação não foram anunciados como entregas públicas.

## Imagens

Capturas da página pública em navegador Chrome, viewport 1440 × 960, JPEG, em 08/09/2026: Rbike, Shop10, FlechaTur, Titaniun, PraticLar, Nobres Rações, Usical e Portal 163. Somam-se às três capturas anteriores de Clínica Petterle, Roo Notícias e CREF17/MT. Não são interfaces inventadas. Sites externos podem mudar após a captura.

Logos de Rbike e Titaniun vêm dos assets públicos dos respectivos projetos. Logos de Nobres Rações e Usical foram atualizados a partir das URLs efetivamente usadas em seus cabeçalhos; os caminhos antigos estavam em 404. As cópias locais evitam dependência desses caminhos remotos.

## Blog

Links antigos do conteúdo para `/servicos/seo-local/` e `/suporte-wordpress/` ganharam redirecionamento para as seções atuais. Links entre artigos legados são normalizados para `/blog/:slug` antes da sanitização. A consulta opcional de redirecionamentos no banco não pode derrubar páginas durante falha de D1; resposta HTML degradada usa `no-store`.

Validação: testes automatizados, lint, build, revisão visual responsiva e conferência pública após o deploy. O conteúdo dinâmico continua sujeito à disponibilidade do D1; o arquivo estático conserva acesso aos artigos incluídos no repositório.
