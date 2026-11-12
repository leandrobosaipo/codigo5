# Acesso ao editorial com Google — 12/11/2026

**Decisão proposta:** autorizar exclusivamente a conta Google verificada `leandro@codigo5.com.br`. O domínio sozinho não concede acesso. Manter o bot editorial como integração separada do login humano.

## Diagnóstico

A rota pública de sessão respondeu JSON no runtime Mac Mini/SQLite. Um POST sem e-mail a `/api/admin/auth/request-link` retornou a validação esperada, sem criar link. Na tela, o erro de JSON é compatível com a resposta textual do tratamento global de exceções em `server/index.mjs`: o formulário chama `response.json()` antes de tratar o status. O caminho autorizado grava o token em BOT_SESSIONS antes do fetch ao Telegram. Uma recusa HTTP normal do provedor é convertida em JSON; uma exceção no armazenamento ou transporte pode escapar. Não há evidência para atribuir a falha original a um deles ou afirmar que o Telegram recebeu o pedido.

O fluxo escolhe o primeiro ID Telegram para qualquer e-mail permitido; o login inverso atribui o primeiro e-mail a qualquer ID permitido. A sessão dura 30 dias e sua leitura não revalida a permissão. Ampliar essas listas não é uma forma segura de delegar administração.

## Sequência de entrega

1. Antes da migração, fazer a API devolver JSON também nas exceções e o formulário tolerar respostas de infraestrutura em texto. Registrar etapa (armazenamento ou transporte), horário e ID de correlação, sem e-mail, token, URL do bot ou link de entrada. Testar falhas simuladas e não repetir envio de resultado incerto.
2. Usar como referência `local/src/auth.ts` do Sync para a autorização por código, state, validação do ID token com as chaves públicas Google, lista explícita e proteção CSRF. No editorial, a sessão dura 30 dias desde o login, tanto no cookie persistente do navegador quanto no SQLite. Sair do painel revoga a sessão imediatamente.
3. Criar cliente OAuth Web exclusivo do site, cadastrar exatamente `https://codigo5.com.br/api/admin/auth/google/callback` e guardar o segredo no ambiente do serviço. Configurar explicitamente `ADMIN_ALLOWED_EMAILS=leandro@codigo5.com.br`; configuração ausente deve negar acesso. Não reutilizar cookies ou segredos do Sync.
4. Adicionar início e callback sob `/api/admin/auth/google/`, com escopos openid e email, state e nonce de uso único com expiração curta. Validar assinatura, emissor, audiência, validade, nonce e email_verified antes de comparar o endereço completo normalizado. Usar sub como identidade da sessão. Após sucesso, redirecionar para o caminho fixo do painel, sem credenciais na URL.
5. Emitir sessão nova, revogável, em cookie exclusivo do host, HttpOnly, Secure, SameSite=Lax, com expiração também no servidor. Revalidar a autorização em cada leitura. Exigir origem e token CSRF nas mutações, inclusive logout. No adaptador Node, preservar cada Set-Cookie separadamente (hoje usa Object.fromEntries). Trocar os dois controles Telegram por “Entrar com Google”.
6. Na virada, desativar no servidor request-link, consume e login por initData para o admin; rejeitar cookies e links legados por versão, sem apagar o banco. Inventariar chamadas da Mini App e distinguir as operações do bot das rotas administrativas antes de desativar os endpoints.

## Critérios de aceite e retorno

Em ambiente isolado, testar token adulterado, audiência errada, e-mail não verificado, outra conta do mesmo domínio, callback repetido, ausência de CSRF, expiração, logout e rejeição dos acessos legados. Validar build e testes do projeto. Com a conta autorizada, percorrer Google → painel → salvar e reler rascunho → sair; confirmar 401 ao reabrir a API e 403 para outra conta verificada. Não publicar artigo para testar. Conferir bot e site público independentemente.

Antes da implantação, identificar a release ativa, guardar configuração e backup SQLite com restauração ensaiada. Em caso de falha, fechar o admin e restaurar a release/configuração anterior sob restrição de acesso; preservar posts posteriores ao backup. Só declarar acesso liberado após o teste humano da conta e a releitura do rascunho no ambiente alvo.
