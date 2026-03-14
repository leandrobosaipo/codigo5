

## Plano: Reposicionar o site para Automação com IA

O site atual está posicionado como "empresa de software e consultoria de TI". O PRD pede reposicionamento completo para **automação com Inteligência Artificial**. A estrutura visual e design system permanecem — o trabalho é principalmente de conteúdo e novas seções.

---

### Resumo das Mudanças

**Identidade e SEO**
- Atualizar `index.html`: título, meta description e OG tags para "automação com IA"
- Atualizar palavras-chave para: "automação com inteligência artificial", "agentes de IA para empresas", etc.

**Navbar** — Atualizar links: Início, Soluções, Casos de Uso, Sobre, Contato. CTA: "Solicitar Diagnóstico Gratuito"

**HeroSection** — Novo título: "Automação com Inteligência Artificial para empresas". Subtítulo sobre agentes de IA, automação de processos. CTAs: "Solicitar diagnóstico gratuito" + "Ver soluções"

**Nova seção: ProblemsSection** — Seção "Problema do Mercado" com lista de dores (WhatsApp manual, planilhas, relatórios manuais, etc.) e mensagem "Tudo isso pode ser automatizado com IA"

**ServicesSection → SolutionsSection** — 4 cards novos:
1. Agentes de IA para empresas (WhatsApp, leads, suporte)
2. Automação de processos (tarefas, integrações, relatórios)
3. Apps com IA (sistemas internos, dashboards)
4. Automação de marketing (conteúdo, publicação, análise)

**Nova seção: TechStackSection** — Logos/badges das tecnologias: OpenAI/GPT, Gemini, n8n, APIs REST, WhatsApp API, automações cloud

**PortfolioSection → UseCasesSection** — 3 casos de uso concretos: Clínica médica, E-commerce, Portal de conteúdo — cada um com lista de automações realizadas

**Nova seção: ProcessSection** — 6 etapas do processo de trabalho em timeline/stepper visual

**AboutSection** — Atualizar diferenciais para: especialista em automação com IA, integrações complexas, soluções personalizadas, foco em resultado financeiro

**TrustBar** — Manter prova social existente, ajustar texto para contexto de automação

**TestimonialsSection** — Manter estrutura, ajustar depoimentos para contexto de automação/IA

**ContactSection** — CTA: "Solicitar diagnóstico gratuito". Título: "Descubra como a IA pode automatizar seu negócio"

**Footer** — Atualizar links e serviços para refletir novo posicionamento

**Index.tsx** — Nova ordem de seções:
1. Navbar
2. HeroSection
3. TrustBar
4. ProblemsSection (nova)
5. SolutionsSection (renomeada)
6. TechStackSection (nova)
7. UseCasesSection (renomeada)
8. ProcessSection (nova)
9. AboutSection
10. TestimonialsSection
11. ContactSection
12. Footer

---

### Arquivos modificados
- `index.html` — SEO
- `src/pages/Index.tsx` — nova composição
- `src/components/Navbar.tsx` — links e CTA
- `src/components/HeroSection.tsx` — conteúdo IA
- `src/components/ServicesSection.tsx` → renomear para `SolutionsSection.tsx`
- `src/components/PortfolioSection.tsx` → renomear para `UseCasesSection.tsx`
- `src/components/AboutSection.tsx` — diferenciais IA
- `src/components/ContactSection.tsx` — CTA diagnóstico
- `src/components/TrustBar.tsx` — ajuste menor
- `src/components/TestimonialsSection.tsx` — ajuste depoimentos
- `src/components/Footer.tsx` — novo conteúdo

### Novos arquivos
- `src/components/ProblemsSection.tsx`
- `src/components/TechStackSection.tsx`
- `src/components/ProcessSection.tsx`

Design system, cores e animações permanecem iguais.

