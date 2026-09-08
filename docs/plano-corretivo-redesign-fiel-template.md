# Plano Corretivo: Refatoração fiel ao template de referência

## Status
- Documento: plano corretivo
- Etapa SDD: ponte entre ideação, PRD corretivo e SPEC corretiva
- Projeto: `/Users/leandrobosaipo/.openclaw/codigo5-github`
- Referência visual principal: `https://nextsaas-wp.pixels71.com/ai-marketing-agency/`
- Referência metodológica: `/Users/leandrobosaipo/.openclaw/codigo5-github/specreviewerlionlab.md`
- Data: 2026-04-15

---

## 1. Resumo honesto do problema

O redesign executado até aqui foi **parcial**.

Houve:
- deploy público válido;
- melhoria de acabamento;
- padronização de alguns componentes;
- melhora do blog interno e do admin.

Mas **não houve refatoração fiel ao template de referência**.

Os principais desvios foram:
- a paleta global permaneceu quente/editorial, não AI/SaaS premium;
- a arquitetura da home continuou sendo a home antiga da Código5 com blocos refinados;
- as páginas internas receberam wrappers e headers melhores, mas não uma nova linguagem estrutural;
- o admin evoluiu como produto próprio, mas não a partir da mesma gramática visual do template;
- o trabalho ficou mais próximo de “evolução do site atual” do que de “migração de direção visual”.

Conclusão:

> o próximo ciclo não deve ser tratado como polimento.
> deve ser tratado como **refatoração corretiva de direção visual**.

---

## 2. Princípio do plano corretivo

O objetivo agora não é continuar iterando o visual atual.

O objetivo é:

1. parar de otimizar a linguagem editorial bege atual;
2. redefinir a fundação visual para uma linguagem mais próxima de:
   - AI agency
   - SaaS premium
   - contraste forte
   - atmosfera tecnológica
   - composição mais dramática e mais dirigida;
3. reconstruir home e páginas internas com base nessa nova fundação;
4. só então adaptar blog e admin para acompanhar a mesma gramática.

---

## 3. Leitura da referência e implicações práticas

Com base na referência, o site alvo precisa transmitir:

- blocos mais densos e mais premium;
- uso forte de superfícies escuras e contrastes claros;
- gradientes e fundos com atmosfera de produto digital;
- hero mais dramático;
- seções com mais ritmo e menos aparência de “stack de componentes”;
- cards mais sofisticados;
- tipografia mais ousada;
- hierarquia mais forte entre headline, supporting copy e CTA;
- menos sensação institucional tradicional;
- mais sensação de agência/produto de IA.

### Isso implica trocar:
- tokens globais de cor;
- linguagem de superfícies;
- direção dos heros;
- composição das seções;
- densidade visual da home;
- leitura do blog e páginas internas;
- acabamento do admin.

---

## 4. O que descartar do ciclo atual

Esses itens não devem ser tratados como base visual definitiva:

### 4.1 Paleta atual
- fundo creme/bege claro como base dominante;
- dourado quente como eixo principal;
- contraste suave demais.

### 4.2 Estrutura da home atual
- sequência herdada:
  - hero
  - trust bar
  - soluções
  - stack
  - segmentos
  - processo
  - clientes
  - blog
  - contato

Essa ordem não é necessariamente errada, mas a composição atual ainda parece site institucional tradicional.

### 4.3 Linguagem dos frames atuais
- `SectionFrame` e `SectionHeader` podem ser reaproveitados conceitualmente,
  mas o visual final deles **não deve ser mantido como está**.

### 4.4 Acabamento editorial quente do blog
- o blog ficou mais arrumado, mas ainda conversa com a direção visual antiga.

---

## 5. O que reaproveitar

Nem tudo deve ser jogado fora.

### 5.1 Estrutura funcional
- rotas;
- blog runtime;
- SEO;
- admin editorial;
- fluxo Telegram;
- D1/KV/Spaces;
- publicação via Pages.

### 5.2 Componentização útil
- `SectionFrame`
- `SectionHeader`
- `BlogFeatureCard`
- `RichTextEditor`

Mas todos esses devem passar por nova direção visual.

### 5.3 Organização da implementação
- PRD existente pode servir como ponto de partida;
- SPEC existente serve como histórico, não como fonte final;
- o novo ciclo deve nascer como **SPEC corretiva**, não continuação cega da anterior.

---

## 6. Metodologia SDD aplicada ao plano corretivo

Seguindo o espírito do `specreviewerlionlab.md`, o novo ciclo deve acontecer assim:

### Etapa 1. Ideação corretiva
Objetivo:
- documentar exatamente onde o site atual diverge da referência.

Saída:
- checklist de divergências visuais e estruturais;
- decisões explícitas sobre o que manter, trocar e reconstruir.

### Etapa 2. PRD corretivo
Objetivo:
- redefinir o problema como “falta de fidelidade de direção visual”.

Deve incluir:
- problema;
- metas;
- fora de escopo;
- user stories;
- contexto técnico.

### Etapa 3. SPEC corretiva
Objetivo:
- descrever como reconstruir o site para a linguagem correta.

Deve incluir:
- sprints;
- features;
- acceptance criteria;
- edge cases;
- estrutura de arquivos;
- rollout;
- QA.

### Etapa 4. Implementação por sprint
Objetivo:
- reexecutar o redesign como reconstrução dirigida.

### Etapa 5. Teste por critérios de aceite
Objetivo:
- validar não só se funciona, mas se ficou fiel à direção esperada.

### Etapa 6. Deploy e auditoria visual
Objetivo:
- comparar produção final vs referência.

---

## 7. Novo plano corretivo por sprint

## Sprint C1: Design reset
### Objetivo
Trocar a base visual do projeto para a nova direção.

### Entregas
- nova paleta global;
- novos tokens de superfície;
- nova lógica de contraste;
- novo sistema de sombras, bordas, raios e fundos;
- nova direção tipográfica;
- nova biblioteca de shells/cards/hero surfaces.

### Arquivos principais
- `src/index.css`
- `src/components/SectionFrame.tsx`
- `src/components/SectionHeader.tsx`
- `src/components/ui/button.tsx`

### Critério de aceite
- ao olhar tokens e blocos base, o site já não parece mais “editorial bege”;
- a fundação visual precisa apontar claramente para AI/SaaS premium.

---

## Sprint C2: Home rebuild
### Objetivo
Reconstruir a home com narrativa e composição mais fiéis à referência.

### Entregas
- hero novo, mais dramático e mais tecnológico;
- nova ordem ou recomposição das seções;
- trust/proof mais integrado;
- services/use-cases/process em linguagem de produto/agência;
- blog da home incorporado ao novo ritmo;
- contato com fechamento mais premium.

### Arquivos principais
- `src/pages/Index.tsx`
- `src/components/HeroSection.tsx`
- `src/components/TrustBar.tsx`
- `src/components/SolutionsSection.tsx`
- `src/components/TechStackSection.tsx`
- `src/components/UseCasesSection.tsx`
- `src/components/ProcessSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/EditorialSection.tsx`
- `src/components/ContactSection.tsx`

### Critério de aceite
- a home deve parecer reconstruída, não apenas refinada;
- o topo do site deve gerar impacto comparável à referência.

---

## Sprint C3: Internal pages rebuild
### Objetivo
Trazer a mesma linguagem da home para páginas internas.

### Entregas
- novos headers internos;
- nova composição de sobre, serviços, portfólio e contato;
- melhor integração entre conteúdo e prova social;
- ritmo visual coerente com a nova home.

### Arquivos principais
- `src/pages/AboutPage.tsx`
- `src/pages/ServicesPage.tsx`
- `src/pages/PortfolioPage.tsx`
- `src/pages/ContactPage.tsx`

### Critério de aceite
- as páginas internas não podem parecer “versão mais simples da home”;
- precisam parecer parte do mesmo sistema premium.

---

## Sprint C4: Blog rebuild
### Objetivo
Fazer o blog acompanhar a nova identidade.

### Entregas
- blog index com nova atmosfera visual;
- post interno com leitura premium;
- sidebar coerente com a nova gramática;
- categorias/tags e cards com acabamento alinhado.

### Arquivos principais
- `src/pages/BlogIndex.tsx`
- `src/pages/BlogPostPage.tsx`
- `src/components/BlogSidebar.tsx`
- `src/components/BlogFeatureCard.tsx`

### Critério de aceite
- o blog deve parecer parte do mesmo produto visual da home;
- não pode parecer uma área editorial separada.

---

## Sprint C5: Admin alignment
### Objetivo
Alinhar o admin editorial à nova direção visual.

### Entregas
- novo acabamento do admin;
- ajuste de densidade visual;
- refinamento do editor;
- coerência visual com o resto do site.

### Arquivos principais
- `src/pages/AdminEditorialPage.tsx`
- `src/components/RichTextEditor.tsx`
- `src/index.css`

### Critério de aceite
- o admin deve parecer parte da mesma plataforma, não uma ferramenta paralela.

---

## Sprint C6: QA visual e rollout final
### Objetivo
Fechar a reconstrução com validação real.

### Entregas
- revisão mobile;
- revisão de acessibilidade;
- revisão de consistência visual;
- checagem de regressão funcional;
- comparação final entre produção e referência.

### Critério de aceite
- produção final deve ficar perceptivelmente mais próxima do template;
- não apenas “mais bonita”, mas **na mesma família visual**.

---

## 8. Critérios corretivos de aceite

O próximo ciclo só deve ser considerado concluído se estas afirmações forem verdadeiras:

1. a paleta global lembrar mais um produto/agência AI premium do que um site editorial bege;
2. a home parecer reconstruída, não apenas ajustada;
3. o hero gerar impacto visual imediato;
4. páginas internas parecerem parte do mesmo sistema;
5. blog e home parecerem da mesma marca;
6. admin acompanhar a mesma direção;
7. o usuário conseguir olhar produção e reconhecer sem esforço a influência do template.

---

## 9. Riscos

### Risco 1
Continuar refinando a direção errada.

Mitigação:
- reset visual explícito na Sprint C1.

### Risco 2
Misturar linguagem antiga com nova.

Mitigação:
- tratar a fundação visual como substituição, não adição.

### Risco 3
Gastar sprint com microdetalhes antes da macroestrutura.

Mitigação:
- hero, paleta e composição primeiro.

---

## 10. Próximo passo recomendado

O próximo passo certo não é implementar direto.

O próximo passo certo é gerar uma:

### SPEC corretiva

Com:
- sprints C1 a C6;
- features detalhadas;
- acceptance criteria;
- edge cases;
- arquivos impactados;
- QA checklist;
- rollout.

---

## 11. Resumo executivo

O redesenho atual:
- foi publicado;
- melhorou;
- mas não ficou fiel.

O ciclo correto agora é:
- assumir o desvio;
- redefinir a fundação visual;
- reconstruir home, internas, blog e admin na direção certa;
- validar por sprints corretivas.

Este documento existe para impedir que o próximo ciclo repita o mesmo erro:

> evoluir o visual antigo em vez de migrar para a linguagem certa.
