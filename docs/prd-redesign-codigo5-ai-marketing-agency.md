# PRD: Redesign da Código5 inspirado em AI Marketing Agency

## Status
- Documento: PRD
- Etapa SDD: Product Requirements Document
- Projeto: `/Users/leandrobosaipo/.openclaw/codigo5-github`
- Referência visual principal: `https://nextsaas-wp.pixels71.com/ai-marketing-agency/`
- Referência metodológica: `/Users/leandrobosaipo/.openclaw/codigo5-github/specreviewerlionlab.md`
- Data: 2026-04-15

---

## 1. Problema a ser resolvido

A Código5 já possui uma base funcional sólida, com home, blog, páginas internas, admin editorial e fluxo de publicação via Telegram. O problema atual não é falta de estrutura, e sim falta de uma direção visual mais forte, coesa e memorável em toda a experiência.

Hoje o site transmite competência, mas ainda não comunica com a força visual de uma marca digital premium. A percepção é de um site ajustado por seções, com partes bem resolvidas, porém sem um sistema visual unificado capaz de elevar:

- autoridade percebida da marca;
- impacto comercial da home;
- consistência entre home, blog, páginas internas e admin;
- valor percebido dos serviços de IA, automações, sites e integrações;
- clareza entre conteúdo editorial e oferta comercial.

O tema de referência escolhido traz exatamente a direção que falta hoje: uma linguagem visual de agência AI/marketing mais sofisticada, mais editorial, mais tecnológica e mais segura. O objetivo não é copiar o template, mas refatorar a Código5 para uma linguagem equivalente em qualidade, ritmo visual, hierarquia, paleta e sofisticação.

---

## 2. Metas (Goals)

### Meta principal
Refatorar o site da Código5 para uma nova linguagem visual inspirada no tema “AI Marketing Agency”, elevando a percepção de marca, a consistência visual e a capacidade comercial do site.

### Metas específicas

1. Criar uma identidade visual mais premium, tecnológica e editorial para a Código5.
2. Reestruturar a home para parecer uma landing institucional de alto padrão, com narrativa mais coesa do topo ao rodapé.
3. Padronizar componentes, seções, espaçamentos, proporções, cards, blocos e ritmo visual entre home, blog e páginas internas.
4. Fazer o blog parecer parte da mesma marca, não uma área paralela.
5. Reforçar autoridade visual em serviços, prova social, conteúdo e CTAs.
6. Melhorar o acabamento visual do admin editorial para ele conversar com o novo sistema da marca.
7. Manter performance, responsividade e acessibilidade em nível de produção.
8. Reduzir a sensação de “site montado por blocos” e aumentar a sensação de “produto digital com direção”.

### Objetivos de percepção

Ao final da refatoração, o site deve ser percebido como:

- mais atual;
- mais premium;
- mais estratégico;
- mais tecnológico;
- mais organizado;
- mais confiável;
- mais próximo de uma agência/produto AI-ready de alto nível.

---

## 3. Fora de escopo

Para este PRD, ficam fora de escopo:

- reescrever toda a arquitetura backend do projeto;
- trocar a stack principal do site;
- reconstruir o CMS/editorial bot do zero;
- alterar a lógica principal de autenticação do admin;
- migrar o site para outro framework;
- implementar novo branding institucional completo (logo nova, naming novo, reposicionamento total);
- criar novas integrações externas que não sejam necessárias para o redesign;
- refatoração profunda de SEO técnico fora do que for impactado pelo layout;
- produção final de ilustrações exclusivas antes da definição visual principal;
- rebuild completo do conteúdo textual de todas as páginas.

Também fica fora de escopo, por enquanto:

- cópia literal do tema de referência;
- uso das animações do template apenas por estética, sem justificativa;
- dependência de assets proprietários do template.

---

## 4. User Stories

### Visitante / potencial cliente

- Como visitante, eu quero acessar a home e sentir imediatamente que a Código5 é uma empresa atual, forte e preparada para projetos digitais mais complexos.
- Como decisor, eu quero entender rapidamente o que a Código5 faz, para quem faz e por que ela parece uma escolha confiável.
- Como potencial cliente, eu quero ver uma apresentação visual mais refinada dos serviços para perceber valor antes mesmo de ler todos os detalhes.
- Como visitante, eu quero navegar entre home, blog e páginas internas sem sentir quebra de linguagem visual.
- Como leitor, eu quero que o blog tenha aparência editorial de alto nível, sem parecer um anexo improvisado.

### Leandro / operação Código5

- Como responsável pela Código5, eu quero que o site tenha uma cara mais próxima do padrão visual que eu admiro nesse tema de referência.
- Como operador do conteúdo, eu quero que o novo design seja coerente com o fluxo editorial e com o admin já existente.
- Como marca, eu quero uma base visual reutilizável para futuras páginas, seções, campanhas e conteúdos.
- Como negócio, eu quero que o redesign aumente a percepção de valor dos serviços e ajude a converter melhor.

### Administrador editorial

- Como editor/admin, eu quero que o painel administrativo acompanhe o novo padrão visual, para a operação parecer parte do mesmo produto.
- Como editor, eu quero continuar criando e editando posts com fluidez, sem perder a coerência visual entre o que edito e o que o usuário final vê.

---

## 5. Contexto técnico

### Estado atual da codebase

O projeto já possui:

- site institucional em produção na Cloudflare Pages;
- blog com posts estáticos + publicados em runtime;
- admin editorial com autenticação e CRUD;
- bot/mini app no Telegram para operação editorial;
- D1, KV e integração com DigitalOcean Spaces;
- sistema visual próprio já parcialmente refinado em fases anteriores.

Arquivos e áreas relevantes já existentes:

- home em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/pages/Index.tsx`
- hero em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx`
- blog em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/pages/BlogIndex.tsx`
- seção editorial da home em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/EditorialSection.tsx`
- sistema visual global em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/index.css`
- conteúdo institucional em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts`
- admin editorial em `/Users/leandrobosaipo/.openclaw/codigo5-github/src/pages/AdminEditorialPage.tsx`

### Leitura da referência visual

Com base no tema de referência e na listagem pública do template, a direção desejada inclui:

- visual de AI marketing agency / SaaS premium;
- seções mais amplas, bem ritmadas e altamente visuais;
- paleta quente/refinada com contraste escuro e acentos marcantes;
- cards com acabamento premium;
- hierarquia forte de headlines;
- atmosfera tecnológica, mas não fria;
- sensação de produto/agência mais sofisticada;
- uso mais consistente de fundos, profundidade e composição;
- blocos mais unificados e menos “remendo por seção”.

### Princípios de implementação

1. A refatoração deve preservar a stack atual.
2. O redesign deve ser componentizado e reaproveitável.
3. O novo sistema visual precisa nascer no `src/index.css` e/ou em abstrações de design reutilizáveis.
4. O blog e a home devem compartilhar padrões, não viver como universos separados.
5. O admin editorial deve evoluir para conversar com a nova identidade visual.
6. O conteúdo atual deve continuar funcional durante o processo.
7. O redesign deve considerar mobile desde o início.

### Restrições técnicas

- sem dependência obrigatória de assets proprietários do template;
- sem depender de copiar código do tema de referência;
- sem quebrar rotas já indexadas;
- sem quebrar fluxo editorial existente;
- sem introduzir regressões em publicação, admin e blog runtime;
- sem piorar significativamente bundle e performance.

---

## 6. Hipóteses de produto

1. Uma linguagem visual mais premium aumentará a percepção de autoridade da Código5.
2. A coerência visual entre home, blog e páginas internas ajudará a reduzir a sensação de site “montado por partes”.
3. O novo visual aumentará o valor percebido dos serviços de IA, automações e integrações.
4. Melhor narrativa visual e melhor composição de seções devem melhorar a leitura e a navegação.

---

## 7. Critérios de sucesso de negócio

- o site parecer claramente mais premium e mais coeso do que a versão atual;
- a home comunicar melhor a proposta de valor em poucos segundos;
- o blog parecer parte da mesma marca;
- o admin parecer parte do mesmo ecossistema digital;
- a nova identidade ser forte o suficiente para servir de base a páginas futuras;
- a refatoração ser percebida como upgrade real, não só troca cosmética.

---

## 8. Entregáveis esperados desta iniciativa

Este PRD prepara a criação de uma SPEC técnica que deve cobrir pelo menos:

- redesign da home;
- redesign do blog index;
- redesign do post interno;
- redesign das páginas institucionais principais;
- redesign do admin editorial;
- unificação do design system visual;
- critérios de responsividade, acessibilidade e performance;
- fases/sprints de implementação com critérios de aceite claros.

---

## 9. Próximo passo no fluxo SDD

O próximo documento deve ser uma SPEC técnica detalhando:

- sprints;
- features;
- critérios de aceite;
- edge cases;
- estrutura de arquivos;
- componentes impactados;
- estratégia de rollout;
- validações de UX, acessibilidade e regressão.

Sugestão de formato para a SPEC:

- JSON estruturado, para facilitar revisão por agentes;
- opcionalmente uma versão Markdown legível para acompanhamento humano.

