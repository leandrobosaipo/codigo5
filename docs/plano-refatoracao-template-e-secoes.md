# Plano Técnico de Refatoração do Template e das Seções

## Objetivo

Corrigir a refatoração parcial do site da Código5 para remover:

- copy de bastidor e frases com cara de IA
- inconsistência entre paleta nova e trechos antigos
- problemas de contraste e legibilidade
- seções que parecem explicar o redesign em vez de vender o serviço
- diferenças visuais entre home, internas, blog, admin e páginas utilitárias

## Critérios de aceite globais

- Toda seção pública fala com cliente final e não com designer, dev ou IA.
- Nenhum título, subtítulo ou aside explica “como a seção foi pensada”.
- Nenhum texto público usa linguagem de bastidor como “o bloco foi redesenhado”, “a referência aqui”, “a linguagem visual”, “o objetivo aqui é parecer”.
- A paleta antiga não aparece em superfícies públicas principais.
- Títulos e textos mantêm contraste adequado no fundo em que aparecem.
- Home, páginas internas, blog e admin parecem partes do mesmo produto.

## Etapa 1 — Auditoria e inventário

### Entregas

- Mapeamento das seções públicas
- Mapeamento das páginas internas
- Mapeamento das páginas utilitárias
- Lista de frases e padrões proibidos

### Testes

- Busca automatizada por frases de bastidor em componentes e páginas públicas
- Busca automatizada por classes e cores legadas em áreas públicas

## Etapa 2 — Limpeza editorial

### Entregas

- Reescrita de títulos, leads, asides e microcopy pública
- Remoção de frases em tom metodológico ou autoexplicativo
- Adequação ao sistema de marca da Código5

### Testes

- Teste de guardrail para frases proibidas
- Revisão manual das páginas principais em produção

## Etapa 3 — Consolidação visual

### Entregas

- Limpeza de superfícies, gradientes e fundos antigos
- Correção de contraste em títulos, textos e chips
- Uniformização de cards, blocos de destaque e CTA

### Testes

- Teste de guardrail para classes e cores proibidas
- Build e checagem visual das páginas-chave

## Etapa 4 — Refatoração da home

### Entregas

- Revisão de Hero, Solutions, UseCases, TechStack, Process, Testimonials, Editorial e Contact
- Adequação de hierarquia, CTA e prova social

### Testes

- Testes automatizados de guardrail
- Revisão manual de home em desktop e mobile

## Etapa 5 — Refatoração de páginas internas e blog

### Entregas

- Revisão de Sobre, Serviços, Portfólio, Contato, Blog Index, Categoria, Tag e Post
- Revisão de páginas utilitárias

### Testes

- Testes automatizados de guardrail
- Revisão manual das páginas internas mais importantes

## Etapa 6 — Admin e rollout

### Entregas

- Ajustes finais de alinhamento do admin
- Revisão final de consistência entre público e painel

### Testes

- `npm test`
- `npm run build`
- checagem dos assets em produção

## Execução desta rodada

Nesta execução, as etapas 1, 2 e parte da 3 e 5 serão aplicadas de imediato:

- criação dos guardrails automatizados
- limpeza editorial das seções públicas mais críticas
- correção de cores antigas mais evidentes em áreas públicas
- validação por testes e deploy
