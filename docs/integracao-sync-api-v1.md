# Integração Sync → Código5 v1

Implementação no runtime Node do Mac Mini. Sem acesso direto ao banco por outro serviço.

`POST /api/integrations/sync/articles` e `GET /api/integrations/sync/articles?externalId=...` usam Bearer. Variáveis protegidas: `COD5_SYNC_DRAFT_TOKEN` permite importar/consultar e `COD5_SYNC_PUBLISH_TOKEN` permite também publicar. Ausência de token desativa acesso. Nunca usar token do painel ou Telegram.

Payload POST: `externalId` (estável), `revision` (inteiro positivo), `title`, `slug`, `excerpt`, `contentHtml`, `sourceUrl`, `imageUrl`, `categories` (lista de `{slug,name}`) e `action` (`draft` por padrão ou `publish`). Apenas destino Código5. Resposta contém `ok`, `externalId`, `id`, `revision`, `status` e `url` (somente publicado). GET 404 significa identificador ainda não importado.

HTML aceito: p, h2, h3, ul, ol, li, strong, em, blockquote, br e a com href HTTPS. Sem atributos extras, scripts, embeds ou imagens no corpo; a capa deve existir no Spaces Código5. Publicação verifica a disponibilidade e tipo da imagem antes de gravar. Links de referência preservados no source_value e notes do rascunho.

A importação usa transação SQLite e chave única externalId. Repetir a mesma revisão/conteúdo retorna o mesmo registro. Revisão divergente retorna 409. Colisões com acervo estático, outro rascunho/post ou redirects retornam 409, sem substituir registros. Hash do rascunho detecta edição humana e impede sobrescrita. Após publicação, atualizações passam pelo painel; Sync pode consultar/repetir a entrega original sem republicar.

Falhas: 400 payload/HTML inválido; 401 token inválido; 403 escopo insuficiente; 409 conflito; 422 capa indisponível; 503 bloqueio operacional temporário. Após timeout, consultar externalId antes de repetir. Uma resposta de rascunho não comprova publicação. Confirmar página, imagem, HTML SEO, listagem e sitemap no consumidor.

Schema aditivo `sync_articles` mantém vínculo e hashes. Não remover tabela, rascunhos ou posts em rollback: pausar destino/token e preservar histórico. Geração e scheduler permanecem no Sync.

`POST /api/integrations/sync/media` recebe bytes PNG/JPEG/WebP (até 6 MB), Content-Type correspondente e o mesmo Bearer. Verifica assinatura do formato e retorna `{ok,imageUrl}`. O caminho é derivado do hash dos bytes: retry não cria outro nome nem substitui imagens de outro conteúdo. Reutiliza o upload Spaces do site. Não busca URLs externas, evitando acesso a rede interna por importação de mídia.
