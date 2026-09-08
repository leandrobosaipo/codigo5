# PRD - Hardening Responsivo do Site Código5

Data: 2026-04-16
Escopo: produção pública em `https://codigo5.com.br`
Foco: telas pequenas, com ênfase em iPhone 14 / largura ~390px

## 1. Problema

O site funciona razoavelmente em desktop, mas ainda apresenta falhas responsivas relevantes em telas pequenas:

- páginas com densidade excessiva e leitura cansativa;
- sidebar e blocos editoriais descendo para mobile sem reestruturação;
- seções da home com altura e complexidade desnecessárias em viewport curta;
- sinais de comportamento inconsistente em `/servicos` sob auditoria mobile;
- pós-conteúdo do blog e do post interno longos demais para consumo em mobile;
- componentes que funcionam em desktop, mas não têm uma estratégia mobile própria.

O problema aqui não é apenas CSS “quebrado”. É falta de arquitetura mobile explícita.

## 2. Metas

- Garantir que home, `/servicos`, `/blog` e post interno funcionem com clareza em telas pequenas.
- Reduzir densidade de informação acima da dobra em mobile.
- Transformar blocos de desktop em composições específicas para mobile quando necessário.
- Evitar overflow, zonas visualmente vazias, painéis excessivos e pilhas longas sem hierarquia.
- Validar cada fase com teste operacional e correção imediata de falhas.

## 3. Fora de escopo

- Redesign completo desktop.
- Reescrita total de copy.
- Mudança estrutural do CMS/blog backend.
- Otimização de performance profunda além do necessário para estabilidade responsiva.

## 4. Usuários impactados

- Visitantes mobile vindos de redes sociais, busca e WhatsApp.
- Leads em primeira visita no site.
- Leitores do blog em mobile.
- Clientes comparando serviços e contato em telas pequenas.

## 5. Fases

### Fase 1 - `/servicos`

Objetivo:
- Garantir renderização estável e legível da página de serviços em mobile.

Problemas suspeitos:
- captura mobile inconsistente na auditoria;
- hero interno alto demais;
- sequência de blocos sem compactação suficiente.

Entregas:
- revisar `InternalPageHero` em mobile;
- compactar `serviceLanes`;
- garantir fluidez de `SolutionsSection`, `TechStackSection`, `ProcessSection` e `ContactSection` dentro de `/servicos`;
- validar que a página renderiza corretamente e não apresenta tela vazia ou paint anômalo.

Critérios de aceite:
- página abre e renderiza conteúdo completo em iPhone 14;
- sem tela vazia;
- sem seções com blocos gigantes desnecessários;
- CTA e conteúdo principal aparecem sem exigir rolagem excessiva logo no início.

Testes:
- screenshot mobile de `/servicos`;
- snapshot interativo mobile;
- checagem de headings, links e CTA;
- build e suíte de testes local.

### Fase 2 - Home

Objetivo:
- Fazer a home trabalhar bem em mobile, com hierarquia mais clara e menos densidade por seção.

Problemas conhecidos:
- hero longa demais;
- blocos como `Mercados`, `Como o projeto avança`, `Radar editorial` e `Contato` ainda pesados;
- múltiplos painéis que, em mobile, se tornam uma pilha longa sem síntese.

Entregas:
- compactar `HeroSection`;
- revisar sequência e altura das seções;
- transformar grids desktop em empilhamento mobile mais eficiente;
- reduzir redundância visual em cards e painéis;
- preservar CTA principal e entendimento rápido do que a empresa faz.

Critérios de aceite:
- leitura clara acima da dobra;
- CTA primário aparece cedo;
- cards não ocupam altura exagerada;
- seções editoriais e de processo não cansam a leitura em mobile.

Testes:
- screenshot full mobile da home;
- snapshot interativo mobile da home;
- validação manual das seções críticas;
- build e suíte de testes local.

### Fase 3 - Blog index

Objetivo:
- Reestruturar o `/blog` para mobile sem deixar a navegação editorial virar “cauda” inútil no fim da página.

Problemas conhecidos:
- cards do topo funcionam, mas a taxonomia e a sidebar perdem utilidade no mobile;
- navegação editorial chega tarde;
- excesso de conteúdo em sequência.

Entregas:
- reorganizar ordem mobile do índice;
- tratar `Mapa editorial` e `BlogSidebar` como blocos próprios para telas pequenas;
- reduzir densidade dos chips/categorias;
- preservar navegação por tema sem empilhar blocos excessivos.

Critérios de aceite:
- taxonomy útil e legível em mobile;
- sidebar não vira bloco gigantesco e redundante;
- leitura do feed continua clara.

Testes:
- screenshot full mobile de `/blog`;
- snapshot interativo mobile;
- validação dos blocos de categoria, recentes e CTA;
- build e suíte de testes local.

### Fase 4 - Post interno

Objetivo:
- Tornar o consumo do post e do pós-conteúdo mais eficiente em telas pequenas.

Problemas conhecidos:
- pós-conteúdo extenso;
- sidebar e relacionados pesando demais no mobile;
- muita sequência abaixo do artigo.

Entregas:
- compactar related/content next steps em mobile;
- revisar blocos de navegação, tags e leituras recentes;
- preservar foco no artigo.

Critérios de aceite:
- leitura do artigo continua central;
- pós-conteúdo não domina a página;
- navegação auxiliar continua acessível.

Testes:
- screenshot full mobile de um post real;
- snapshot interativo mobile;
- validação da ordem de leitura;
- build e suíte de testes local.

## 6. Estratégia de testes

Cada fase só é considerada concluída depois de:

1. implementação;
2. `npm test`;
3. `npm run build`;
4. validação com `agent-browser` em mobile;
5. correção imediata de qualquer falha detectada.

## 7. Resultado esperado

Ao final das fases:

- home, `/servicos`, `/blog` e post interno devem funcionar com clareza em telas pequenas;
- os principais blocos devem ter versões mobile realmente utilizáveis;
- a navegação, leitura e CTA devem continuar funcionais sem depender da experiência desktop.
