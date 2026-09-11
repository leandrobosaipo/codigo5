# SEO, Analytics e compartilhamento — Código5

Revisão iniciada em 08/09/2026 (Cuiabá), release em 09/09/2026 UTC.

## Entregue no código

- [x] 70 páginas com conteúdo real no HTML inicial: 8 institucionais, 20 artigos, 10 categorias e 32 tags.
- [x] Título, descrição e canonical próprios antes e depois do JavaScript. Arquivos HTML sem extensão na URL final, conforme as regras do Cloudflare Pages.
- [x] Open Graph e Twitter Card com imagem absoluta, título, descrição e texto alternativo.
- [x] Oito capas institucionais JPEG de 1200 × 630, com cerca de 88–123 KB cada. Fotografias ilustrativas geradas com IA; não são retratos da equipe nem provas de resultados de clientes.
- [x] Todos os 20 artigos com imagem de destaque e a mesma imagem na prévia social. Dezenove imagens existentes preservadas e otimizadas; o artigo “Quem somos”, antes sem imagem, utiliza a capa da história da empresa.
- [x] Schema JSON-LD: Organization, WebSite, WebPage, AboutPage, ContactPage, CollectionPage, BreadcrumbList, Service e BlogPosting, conforme o conteúdo de cada página. FAQs existentes mantidas, sem promessa de resultado enriquecido.
- [x] Conteúdo publicado/atualizado pelo painel D1 recebe título, descrição, imagem, BlogPosting e texto inicial na resposta do servidor, sem esperar o próximo build. Essa resposta não é armazenada em cache. O navegador aplica DOMPurify para exibir a formatação editorial.
- [x] Sitemap com as 38 URLs indexáveis do acervo. As 32 páginas de tags usam `noindex,follow` e não entram no sitemap. O acervo gerado permanece no sitemap durante indisponibilidade do D1; nenhuma URL dinâmica é inventada nesse fallback.
- [x] Rotas privadas fora do índice. URLs desconhecidas não são tratadas como páginas válidas; quando a consulta ao banco falha, recebem status temporário 503 em vez de 404 definitivo.
- [x] Marcas e capturas pesadas em WebP. A imagem de atendimento caiu de 2.138.757 para 72.270 bytes, com conteúdo e composição preservados.
- [x] Fontes WOFF2 locais com licença preservada e preload de Manrope; removida a dependência de Google Fonts no carregamento.
- [x] Páginas institucionais não consultam o banco editorial para redirects de artigos, evitando uma dependência desnecessária no primeiro carregamento.
- [x] Contraste das legendas de portfólio ajustado.
- [x] Configuração única do Google tag. A medição automática de visualizações e mudanças de histórico já estava ativa no GA4; removida a segunda emissão manual para evitar contagem duplicada.
- [x] Evento `contact_click` distingue WhatsApp, e-mail e telefone. Mede clique, não mensagem enviada ou venda. Não envia telefone, conteúdo da conversa, query string ou fragmentos.
- [x] Ambiente local, preview e painel privado excluídos desses eventos.

## Search Console — acesso e acompanhamento

- [x] Token público de verificação existente preservado no HTML.
- [x] Sitemap público: https://codigo5.com.br/sitemap.xml
- [x] Reautenticação concluída em 09/09/2026; acesso à propriedade de domínio `sc-domain:codigo5.com.br` confirmado.
- [x] Propriedade de domínio correta selecionada. Inspeções feitas em URLs exatas de `https://codigo5.com.br/`; totais da propriedade não usados como métricas exclusivas do institucional.
- [x] Sitemap atual enviado em 09/09/2026: status **Processado**, última leitura em 09/09/2026 e **38 páginas encontradas**. Isso confirma leitura do sitemap, não indexação de todas as páginas.
- [x] Inspeção das cinco URLs prioritárias: início, serviços, automação, portfólio e artigo “Quem somos”. Canonicals confirmados nas três URLs já indexadas; testes ao vivo de início, automação e artigo aprovados.
- [ ] Conferência visual da captura e do HTML na interface GSC; o HTML público já foi validado separadamente na entrega.
- [x] Página inicial, `/automacao-com-ia` e `/blog/quem-somos` aprovadas no teste ao vivo; solicitações de indexação aceitas na fila prioritária em 09/09/2026. Aceitação na fila não garante indexação nem prazo.
- [x] Ações manuais e problemas de segurança: **nenhum problema detectado** em 09/09/2026.
- [ ] Revisar exclusões por URL/host: o relatório disponível é de 03/09/2026, anterior a esta entrega, e inclui subdomínios. Seus 185 registros não indexados e 68 indexados não representam apenas o institucional nem comprovam falhas do novo release.
- [ ] Acompanhar consultas, impressões, cliques e CTR por página e mercado; comparar períodos equivalentes depois que houver dados suficientes.

### Inspeções autenticadas de 09/09/2026

| URL | Índice do Google | Evidência |
|---|---|---|
| `/` | Indexada | Canonical declarado e selecionado: própria URL. Rastreamento registrado em 31/08/2026; teste ao vivo atual aprovado e atualização solicitada. |
| `/servicos` | Indexada | Canonical declarado e selecionado: própria URL. Rastreamento registrado em 05/09/2026. |
| `/portfolio` | Indexada | Canonical declarado e selecionado: própria URL. Rastreamento registrado em 04/09/2026. |
| `/automacao-com-ia` | Detectada, ainda não indexada | Teste ao vivo aprovado, breadcrumb válido e indexação solicitada. |
| `/blog/quem-somos` | Registro antigo de redirecionamento | Último rastreamento em 20/04/2026, canonical Google com barra final. Versão atual aprovada no teste ao vivo, breadcrumb válido e indexação solicitada. |

O sitemap antigo `/sitemap_index.xml`, cadastrado em 2023, ainda aparece com erro histórico. O sitemap atual `/sitemap.xml` está processado; nenhum sitemap de subdomínio foi removido.

## Analytics — evidência e checklist

- [x] Google tag existente `GT-KDD832` preservado. Inspeção de rede identificou o destino GA4 `G-4M9KM8258K` e resposta 204 do endpoint de coleta para evento automático.
- [x] Validação pública de navegação: uma única visualização da página inicial e uma de Serviços, ambas com título correto e resposta 204.
- [x] Eventos de contato direcionados ao Measurement ID observado, sem criar outra propriedade ou duplicar a instalação.
- [ ] Confirmar recebimento no Tempo Real/DebugView e associação atual à propriedade após reautenticar o Google. Uma resposta HTTP do coletor não prova processamento no relatório.
- [ ] Conferir fuso, retenção, filtros internos e associação do Search Console dentro da propriedade correta. Não alterados sem acesso verificado.
- [ ] Só marcar conversão após definir o que representa um lead qualificado; clique em WhatsApp não equivale a atendimento concluído.

## PageSpeed e autoridade

Medição inicial oficial, página inicial, 08/09/2026 às 23:23 AMT:

| Medida | Celular | Computador |
|---|---:|---:|
| Desempenho | 77 | 97 |
| Acessibilidade | 96 | 95 |
| Práticas recomendadas | 100 | 100 |
| SEO Lighthouse | 100 | 100 |
| LCP | 4,8 s | 1,1 s |
| CLS | 0 | 0 |

[Relatório inicial](https://pagespeed.web.dev/analysis/https-codigo5-com-br/49migou4o4?form_factor=mobile).
A ferramenta não tinha dados de campo suficientes para avaliar a experiência real dos visitantes. O teste de laboratório varia entre execuções; a pontuação SEO não mede posição no Google.

Medição posterior, 09/09/2026 às 00:12 AMT:

| Medida | Celular | Computador |
|---|---:|---:|
| Desempenho | 77 | 98 |
| Acessibilidade | 100 | 100 |
| Práticas recomendadas | 100 | 100 |
| SEO Lighthouse | 100 | 100 |
| LCP | 4,3 s | 1,0 s |
| CLS | 0 | 0 |

[Relatório posterior](https://pagespeed.web.dev/analysis/https-codigo5-com-br/z74408w8tj?form_factor=mobile).
O LCP móvel melhorou, mas continua acima da faixa boa; a nota móvel permaneceu em 77. As próximas oportunidades apontadas são dimensionamento de imagens e redução de JavaScript/CSS não utilizados. Não há promessa de nota 100 nem de posição no Google.

PageRank não é uma configuração ou nota pública que o site possa definir. O trabalho de autoridade deve vir de conteúdo útil, autoria verdadeira, projetos comprováveis, links internos pertinentes e menções editoriais legítimas. Não foram comprados links nem inventadas avaliações, clientes, resultados ou métricas.

## Verificação e manutenção

`npm test`, `npm run lint`, TypeScript, `npm run build` e `node scripts/check-static-seo.mjs`.
O último comando verifica conteúdo, canonical único, schema, imagem social e arquivos locais de todas as páginas geradas. A validação pública sem JavaScript confirmou título, H1, canonical, imagem social e schema nas oito páginas institucionais e nos vinte artigos. As 28 imagens sociais carregaram no domínio público. A página inicial não apresentou rolagem horizontal em viewport de 390 px.

As prévias de redes sociais podem manter cache de links já compartilhados. A nova imagem depende de nova leitura pelo respectivo serviço; não foi feita nenhuma postagem em contas sociais.

Fonte de roteamento/cache: [documentação Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Atualização de 11/09/2026

Consulte [a auditoria atual de indexação](indexacao-2026-09-11.md): 72 páginas verificadas, 40 indexáveis, 32 tags com noindex intencional, ambos os artigos novos aprovados nos testes ao vivo do Google e indexação solicitada. O backend atual usa SQLite no Mac Mini; as referências históricas a D1 acima descrevem a entrega anterior à migração.
