# Mapa de Assets da Nova Home da Código5

## 1. Objetivo

Mapear, seção por seção, quais assets a home precisa para sair de um modelo mais textual e ir para um modelo visual-first.

Este documento organiza:

- o que já existe e pode ser reaproveitado;
- o que existe, mas precisa ser melhorado;
- o que ainda precisa ser produzido;
- prioridade de produção;
- papel de cada asset dentro da narrativa da home.

## 2. Regra geral

A nova home deve depender menos de texto e mais de:

- imagem hero;
- logos curadas;
- mockups de projeto;
- thumbs editoriais fortes;
- cards com presença visual;
- recortes de repertório.

### Regra prática

Para cada seção principal, responder:

- qual é o asset dominante;
- qual é o asset de apoio;
- o que pode entrar como fallback;
- o que não deve ser inventado sem material real.

## 3. Inventário do que já existe hoje

## 3.1 Logos de clientes já disponíveis

O projeto já possui um catálogo útil de logos em `src/content/siteContent.ts`, incluindo marcas como:

- Perrengue Mato Grosso【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:76】
- AlphaVille Buffet【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:85】
- Portal Pantanal MT【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:117】
- Portal Norte MT【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:126】
- Portal 163【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:67】
- CREF17/MT【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:33】
- Clínica Petterle【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:58】
- Axis Construções【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:42】
- PraticLar【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:9】
- Sonata Musical【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:17】

### Lacunas percebidas

- `Roo Notícias` não apareceu na primeira lista lida agora e precisa ser verificado/normalizado antes de entrar na home principal.
- `Shop10` também precisa ser validado no catálogo ativo.
- Existe chance de parte dos logos estar com formatos e proporções inconsistentes.

## 3.2 Imagens de segmentos

A `UseCasesSection` já usa imagem por segmento via `useCases` em `siteContent.ts`, e essas imagens já sustentam parte do repertório visual da home.【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/UseCasesSection.tsx:22】

### Valor desses assets

- já ajudam a sair do modelo 100% textual;
- podem ser reaproveitados na nova seção de mercados;
- servem como base até entrar fotografia melhor.

### Limite atual

- ainda parecem mais “imagem de card” do que recorte visual de marca;
- podem não ter unidade estética suficiente para a nova hero e para a nova home inteira.

## 3.3 Thumbs e imagens do blog

O blog já possui thumbnails e imagens fortes em vários posts, especialmente no arquivo publicado e na seção editorial da home.【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/EditorialSection.tsx:91】

### Valor desses assets

- já permitem uma vitrine editorial mais visual;
- ajudam a reduzir texto na seção de blog;
- podem ser reaproveitados imediatamente.

### Limite atual

- há diferença de estilo entre thumbs;
- algumas imagens ainda soam mais “imagem de post” do que “ativo editorial premium”.

## 3.4 Prova visual da hero atual

A hero atual já usa:

- logos âncora【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx:131】
- bloco de direção do projeto【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx:101】
- cards de presença/captação/operação【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx:116】

### Valor desses assets

- a lógica de prova já existe;
- parte do material pode ser reaproveitada.

### Limite atual

- a lateral da hero ainda é card-based demais;
- falta um asset dominante memorável.

## 4. Mapa de assets por seção

## 4.1 HeroSection

### Papel visual da seção

Ser o ponto mais forte da home.
Ela precisa abrir a narrativa com:

- impacto;
- clareza;
- prova;
- sofisticação.

### Asset dominante necessário

- **1 imagem hero principal**

Formato ideal:

- horizontal ampla;
- ambiente real de operação digital;
- escritório, reunião, tela, ecommerce, dashboard ou projeto publicado;
- sensação de empresa séria e atual.

### Assets de apoio

- **1 mockup principal de site ou interface**
- **logos âncora curadas**
- **2 ou 3 chips visuais curtos**

### O que já existe

- logos âncora da hero atual【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx:131】
- estrutura de pilares presença/captação/operação【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/HeroSection.tsx:116】

### O que reaproveitar

- a curadoria de logos;
- a lógica de 3 pilares;
- a direção dark premium da moldura.

### O que não reaproveitar como está

- o bloco lateral inteiro em formato atual;
- excesso de microcards;
- hero sem imagem dominante real.

### O que produzir

- 1 foto hero principal;
- 1 mockup de interface/site da Código5;
- 1 versão de composição com logos curadas.

### Prioridade

🔥 máxima

## 4.2 Faixa de prova / TrustBar

### Papel visual da seção

Provar repertório em 2 segundos.

### Asset dominante necessário

- **logo strip forte**

### O que já existe

- logos diversas em `siteContent.ts`【/Users/leandrobosaipo/.openclaw/codigo5-github/src/content/siteContent.ts:8】

### O que produzir

- curadoria final das marcas da home;
- padronização de contraste, fundo e altura dos logos;
- eventual versão limpa em `.webp` ou `.png` de logos problemáticas.

### Set recomendado de logos âncora

- Perrengue Mato Grosso
- Portal Pantanal MT
- Portal Norte MT
- AlphaVille Buffet
- CREF17/MT
- Clínica Petterle
- Roo Notícias, se validado
- Shop10, se validado

### Prioridade

🔥 máxima

## 4.3 SolutionsSection

### Papel visual da seção

Mostrar rapidamente o que a Código5 entrega.

### Asset dominante necessário

- **4 mini visuais de solução**

Sugestões:

- site institucional em tela;
- ecommerce em notebook/mobile;
- painel de SEO/conteúdo;
- fluxo de integração/automação.

### O que já existe

- estrutura dos serviços como cards【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/SolutionsSection.tsx:6】

### O que não existe bem resolvido

- visual específico por serviço.

### O que produzir

- 4 mockups ou mini composições;
- 1 linguagem visual consistente para os 4 cards.

### Prioridade

🟧 alta

## 4.4 UseCasesSection

### Papel visual da seção

Mostrar mercados e contexto com imagem forte.

### Asset dominante necessário

- **3 imagens de segmentos**

### O que já existe

- cards com imagem dominante já funcional【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/UseCasesSection.tsx:28】

### O que reaproveitar

- estrutura de card com imagem;
- três recortes principais de segmento.

### O que melhorar

- garantir que as imagens conversem entre si;
- reduzir dependência de texto dentro do card;
- padronizar tratamento visual.

### O que produzir

Opcionalmente:

- 3 imagens melhores, com unidade estética;
- ou 3 composições mais editoriais a partir do material existente.

### Prioridade

🟨 média-alta

## 4.5 TechStackSection

### Papel visual da seção

Traduzir segurança operacional sem virar bloco técnico.

### Asset dominante necessário

- **ícones ou mini painéis**

### O que já existe

- a estrutura da seção e o conteúdo de base.【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/TechStackSection.tsx:6】

### O que produzir

- sistema visual leve de ícones/badges;
- talvez 1 mini painel ilustrado ao fundo.

### O que evitar

- foto genérica sem função;
- excesso de texto técnico para compensar falta de visual.

### Prioridade

🟨 média

## 4.6 ProcessSection

### Papel visual da seção

Mostrar processo de forma sintética.

### Asset dominante necessário

- **pipeline visual**

### O que já existe

- cards de etapas já definidos.【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/ProcessSection.tsx:6】

### O que produzir

- refinamento gráfico de etapas;
- ícones consistentes por etapa;
- talvez uma linha visual conectando as fases.

### Prioridade

🟨 média

## 4.7 TestimonialsSection / repertório

### Papel visual da seção

Mostrar repertório além da faixa rápida de logos.

### Asset dominante necessário

- **logos premium curadas + 2 ou 3 blocos visuais de repertório**

### O que já existe

- logos âncora e grade de apoio【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/TestimonialsSection.tsx:86】【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/TestimonialsSection.tsx:123】

### O que reaproveitar

- separação entre marcas âncora e apoio;
- surfaces diferentes por logo.

### O que melhorar

- parar de depender só de logo;
- incluir 2 ou 3 recortes visuais:
  segmento, peça, caso ou thumbnail institucional.

### O que produzir

- 2 ou 3 painéis visuais de case/repertório;
- eventual collage de marcas/projetos.

### Prioridade

🟧 alta

## 4.8 EditorialSection

### Papel visual da seção

Usar o blog como prova de autoridade.

### Asset dominante necessário

- **3 thumbs editoriais fortes**

### O que já existe

- cards do blog em destaque【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/EditorialSection.tsx:91】
- bloco “assuntos em destaque”【/Users/leandrobosaipo/.openclaw/codigo5-github/src/components/EditorialSection.tsx:65】

### O que reaproveitar

- 3 posts destacados;
- thumbs já melhores do acervo recente.

### O que melhorar

- escolher thumbs mais coerentes entre si;
- reduzir a importância visual da lista de assuntos;
- deixar o texto da seção mais curto.

### O que produzir

- curadoria de 3 thumbs consistentes;
- eventualmente redesign das thumbs futuras do blog.

### Prioridade

🟧 alta

## 4.9 ContactSection

### Papel visual da seção

Fechar a home com ação clara.

### Asset dominante necessário

- **1 bloco visual de fechamento**

Pode ser:

- foto institucional;
- painel de contato;
- collage curta com WhatsApp + marca + interface.

### O que já existe

- estrutura de cards final da seção.

### O que falta

- um asset dominante que evite depender de texto.

### O que produzir

- 1 visual de fechamento;
- talvez uma mini composição institucional da marca.

### Prioridade

🟨 média-alta

## 5. Quais assets podem ser reaproveitados já

### ✅ Reaproveitamento imediato

- logos do catálogo atual;
- imagens dos segmentos da `UseCasesSection`;
- thumbs dos posts recentes;
- mockups e blocos de interface já existentes na hero, se simplificados.

### ⚠️ Reaproveitamento com ajuste

- logos com fundo inconsistente;
- thumbs com linguagem visual irregular;
- cards da hero que hoje funcionam mais como texto do que como visual.

### ❌ Não confiar como asset principal

- texto como substituto de imagem;
- cards textuais como se fossem prova visual;
- repetir logos onde deveria haver case ou imagem.

## 6. Lista de produção mínima

## Onda 1 — indispensável

- curadoria final de logos da home;
- 1 imagem hero principal;
- 1 mockup principal da hero;
- 3 thumbs editoriais bem escolhidas;
- 3 imagens de segmentos consolidadas.

## Onda 2 — melhora forte

- 4 mini visuais das soluções;
- 2 ou 3 painéis de repertório/case;
- 1 visual de fechamento do contato.

## Onda 3 — refinamento

- padronização fina de logos;
- revisão visual futura das thumbnails do blog;
- banco de assets institucional da Código5.

## 7. Backlog operacional

### Etapa A — Curadoria

- validar catálogo de logos atual;
- confirmar se `Roo Notícias` e `Shop10` já têm asset correto no projeto;
- remover duplicidade e escolher marcas âncora da home.

### Etapa B — Hero

- definir imagem hero;
- definir mockup principal;
- encaixar logos âncora na primeira dobra.

### Etapa C — Miolo

- travar 3 imagens de segmentos;
- escolher ou produzir mini visuais de solução;
- decidir o tipo de painel para repertório.

### Etapa D — Editorial e fechamento

- escolher 3 thumbs melhores;
- reduzir taxonomy aparente;
- produzir visual do bloco final.

## 8. Recomendação principal

Antes de mexer na copy da nova home, resolver estes assets:

1. logos âncora corretas
2. hero principal
3. segmentos
4. thumbs editoriais

Sem isso, a próxima rodada de copy ainda vai correr o risco de compensar com texto o que deveria ser resolvido com imagem.

## 9. Próximo passo sugerido

Com este mapa pronto, a próxima etapa correta é:

- **copy reduzida da nova home**

já limitada pelos assets disponíveis e pela função visual de cada seção.
