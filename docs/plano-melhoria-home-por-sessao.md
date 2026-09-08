# Plano de Melhoria da Home por Sessao

## Objetivo

Corrigir a home da Codigo5 para que ela:

- pareca um produto premium e consistente do inicio ao fim;
- elimine resquicios de copy com cara de IA, bastidor ou template;
- resolva problemas de contraste e legibilidade;
- alinhe texto, cor e hierarquia visual em cada sessao;
- sirva como base para a revisao posterior do blog e paginas internas.

## Skills usadas como base

### Instaladas e usadas

- `copywriting`
  Direcionou os criterios de clareza, beneficio e CTA por sessao.
- `extract-design-system`
  Foi usada para extrair a paleta/typography do site publicado e comparar com o codigo.
- `tailwind-design-system`
  Serviu de base para estruturar o reset de tokens, semantic colors e padroes reutilizaveis.
- `accessibility`
  Serviu para os criterios de contraste, foco visual e legibilidade.

### Instalada, mas bloqueada no ambiente

- `audit-website`
  A skill foi instalada com sucesso, mas nao pode ser executada aqui porque o binario `squirrel` nao existe no PATH desta maquina.

## Base tecnica usada nesta analise

### Home atual

- `/src/pages/Index.tsx`
- `/src/components/HeroSection.tsx`
- `/src/components/TrustBar.tsx`
- `/src/components/SolutionsSection.tsx`
- `/src/components/UseCasesSection.tsx`
- `/src/components/TechStackSection.tsx`
- `/src/components/ProcessSection.tsx`
- `/src/components/TestimonialsSection.tsx`
- `/src/components/EditorialSection.tsx`
- `/src/components/ContactSection.tsx`
- `/src/components/SectionHeader.tsx`
- `/src/index.css`

### Extracao do design system da home publicada

Resultado observado em `.extract-design-system/normalized.json`:

- cor primaria detectada: `rgb(29, 196, 247)`
- tipografia detectada: `Fraunces`
- escala de espacamento detectada entre `4px` e `96px`

Leitura pratica:

- a extracao confirmou o ciano como ancora visual principal;
- a extracao nao mostrou um sistema consistente de cores secundarias e neutrals, o que reforca que a home ainda depende muito de gradientes e cores hardcoded por sessao;
- a deteccao de `Fraunces` como body e heading mostra que a pagina publicada ainda esta deixando o display dominar demais a percepcao textual.

## Diagnostico geral da home

Antes de atacar sessao por sessao, ha quatro problemas transversais:

1. **Contraste inconsistente**
   Varias sessoes usam texto em `white/70`, `slate-300`, `foreground/70` ou overlays muito proximos do fundo.

2. **Paleta sem governanca**
   O sistema global tem tokens frios, mas a home ainda usa muitos gradientes e surfaces locais, o que cria variacao demais entre sessoes.

3. **Texto ainda conceitual em pontos-chave**
   Algumas secoes estao melhores, mas ainda usam formulacoes abstratas demais para cliente final.

4. **Hierarquia de interface irregular**
   Alguns blocos usam forte peso visual, enquanto outros ficam "lavados" ou com densidade insuficiente.

## Estrategia de execucao

Nao precisa de nova rodada de planejamento antes de implementar.

A execucao deve acontecer em 10 fases:

- Fase 0: reset transversal de tokens e regras de contraste
- Fase 1: Hero
- Fase 2: TrustBar
- Fase 3: Solutions
- Fase 4: UseCases
- Fase 5: TechStack
- Fase 6: Process
- Fase 7: Testimonials
- Fase 8: Editorial
- Fase 9: Contact

Cada fase abaixo inclui:

- problemas observados;
- correcao tecnica;
- revisao de copy;
- testes de aceite.

---

## Fase 0 - Reset transversal

### Problemas

- `--muted-foreground` e variacoes translucidas ainda deixam muitos textos discretos demais.
- Os fundos da home usam gradientes fortes por sessao, sem uma matriz clara de:
  - fundo escuro principal
  - fundo escuro secundario
  - fundo claro principal
  - fundo claro secundario
  - card elevado
  - card neutro
- `Fraunces` esta forte demais para blocos em que o conteudo precisa ser objetivo e comercial.

### Acoes tecnicas

- Consolidar no `:root` uma matriz semantica minima:
  - `--surface-page`
  - `--surface-section-dark`
  - `--surface-section-light`
  - `--surface-card`
  - `--surface-card-strong`
  - `--text-strong`
  - `--text-default`
  - `--text-muted`
  - `--text-on-dark`
  - `--text-on-dark-muted`
- Reduzir dependencia de opacidades como `text-white/70` e `text-foreground/70` em favor de tokens semanticos.
- Limitar `Fraunces` a titulos e headlines; corpo, labels, stats e metas devem priorizar `Manrope`.

### Testes

- `npm test`
- `npm run build`
- Revisao visual manual da home em desktop e mobile
- Checklist WCAG AA:
  - texto normal >= 4.5:1
  - texto grande >= 3:1
- Busca por classes/transparencias de risco:
  - `rg "text-white/6|text-white/7|text-foreground/7|text-slate-3" src/components src/pages`

---

## Fase 1 - Hero

### Problemas

- O hero mistura fundo dark, transicao clara, glow ciano, glow laranja e cards internos com contraste desigual.
- O lado direito tem densidade alta, mas alguns labels pequenos usam contraste fraco.
- O bloco de logos no fim do hero muda de temperatura visual e parece outra secao.
- A narrativa ainda esta boa, mas pode ficar mais direta para quem chega frio no site.

### Cores

- Simplificar para 3 niveis:
  - fundo hero escuro principal
  - card overlay escuro secundario
  - destaque ciano
- Laranja deve virar acento raro, nao competir com o ciano em todo hero.

### Textos

- Revisar headline e subheadline para deixar a promessa mais concreta.
- Reduzir termos abstratos como "operacao digital" quando nao vierem acompanhados de ganho claro.
- Fazer os labels do painel lateral falarem mais de resultado e menos de estrutura.

### Elementos

- Reduzir ruido no painel direito.
- Dar mais respiro entre CTA, metricas e sinais.
- Revisar leitura do bloco de clientes/logos como extensao do hero ou separar claramente como faixa propria.

### Testes

- Conferir contraste de:
  - kicker
  - paragraph principal
  - labels pequenos do painel lateral
  - texto dos cards de metrica
- Validar hero em:
  - 1440px
  - 1280px
  - 1024px
  - 768px
  - 390px
- Teste manual:
  - headline precisa ser entendida em 5 segundos
  - CTA principal precisa ficar visivel sem competir com o secundario

---

## Fase 2 - TrustBar

### Problemas

- A secao depende demais de cards escuros com labels discretos.
- O titulo ainda esta mais institucional do que comercial.
- Os numeros nao deixam claro o que o visitante deve sentir ou concluir.

### Cores

- Aumentar contraste dos labels.
- Separar melhor titulo da grade numerica.

### Textos

- Reescrever para:
  - prova de experiencia
  - relevancia local
  - credibilidade real
- Cada label precisa ser menos neutro e mais inteligivel.

### Elementos

- Transformar a barra em uma sessao de prova e contexto, nao apenas "quatro numeros".
- Considerar incluir uma linha curta abaixo dos numeros com leitura comercial.

### Testes

- Validar se todos os labels ficam legiveis sobre o fundo.
- Verificar leitura da secao com zoom de 125% e 150%.

---

## Fase 3 - Solutions

### Problemas

- Boa estrutura, mas o contraste entre textos secundarios e cards ainda varia.
- O bloco da esquerda esta mais forte do que os cards da direita.
- Alguns textos ainda explicam o sistema, em vez de vender beneficio claro.

### Cores

- Uniformizar:
  - cards de servico
  - tags sobre imagem
  - links de acao
- Revisar overlay da imagem para a tag nao ficar "pendurada" visualmente.

### Textos

- Reescrever a coluna esquerda com foco em:
  - posicionamento
  - captacao
  - operacao
- Em cada card de servico:
  - trocar descricao generica por ganho pratico.

### Elementos

- Equalizar altura e peso visual dos cards.
- Ajustar CTA de cada card para parecer parte do funil, nao link solto.

### Testes

- Verificar consistencia de altura entre cards.
- Testar leitura das tags sobre imagem em telas menores.
- Validar contraste das descricoes dos cards.

---

## Fase 4 - UseCases

### Problemas

- A sessao e visualmente forte, mas bastante escura e densa.
- Os chips e overlays competem com o titulo do caso.
- O texto final em caixa pode soar repetitivo entre cards.

### Cores

- Refinar overlay para preservar imagem sem sacrificar legibilidade.
- Rever equilibrio entre preto, branco e ciano nos chips.

### Textos

- Tornar cada caso mais especifico e menos repetitivo.
- Fazer o bloco inferior de cada card falar uma dor ou ganho do segmento, nao uma frase generica repetida.

### Elementos

- Reduzir competicao entre badge, chips, titulo e resumo.
- Garantir que o card nao fique visualmente pesado demais no mobile.

### Testes

- Validar leitura do titulo sobre a imagem.
- Validar se os chips nao estouram ou embolam em 390px.

---

## Fase 5 - TechStack

### Problemas

- A secao ainda fala bastante de tecnologia, mas nem sempre traduz isso para seguranca comercial.
- Os cards das ferramentas parecem corretos, mas um pouco genéricos.
- A copy da coluna esquerda ainda pode ficar mais orientada a resultado.

### Cores

- Melhorar contraste dos textos pequenos nas caixas da esquerda.
- Uniformizar brilho e sombras dos cards de ferramentas.

### Textos

- Trocar foco de "stack" para:
  - base confiavel
  - edicao simples
  - site pronto para crescer
- Cada item deve responder "o que isso melhora para o cliente?".

### Elementos

- Reduzir sensacao de grid de logos generico.
- Considerar transformar ferramentas em capacidades, com ferramenta como suporte.

### Testes

- Revisar repeticao visual dos cards.
- Testar leitura do bloco esquerdo em tablet.

---

## Fase 6 - Process

### Problemas

- A secao esta visualmente boa, mas ainda tende ao institucional.
- Os cards sao muito parecidos entre si, com pouca hierarquia.
- Os textos podem ficar mais objetivos e orientados a entrega percebida.

### Cores

- Reforcar contraste entre etapa, titulo e detalhe.
- Evitar que os icones desaparecam no card.

### Textos

- Reescrever cada etapa em linguagem de progresso percebido.
- Evitar formulações internas demais.

### Elementos

- Aumentar sensacao de fluxo entre as etapas.
- Considerar ligacao visual entre etapas.

### Testes

- Validar leitura do processo em uma passada rapida.
- Verificar se o usuario entende a ordem sem precisar ler tudo.

---

## Fase 7 - Testimonials / Credenciais

### Problemas

- A secao ainda trabalha mais como vitrine de logos do que como prova social guiada.
- O texto introdutorio ainda pode soar conceitual.
- Alguns links/labels secundarios ainda podem ficar discretos demais.

### Cores

- Padronizar superficies das logos para nao parecer colagem de marcas em fundos aleatorios.
- Melhorar contraste do link do dominio e labels de segmento.

### Textos

- Reescrever o header para:
  - credibilidade
  - experiencia comprovada
  - variedade de segmentos
- Menos "repertorio", mais "confianca" e "casos reais".

### Elementos

- Diferenciar claramente:
  - marcas ancora
  - marcas de apoio
- Adicionar leitura curta que explique por que aquelas credenciais importam.

### Testes

- Conferir contraste dos links de dominio.
- Verificar se a secao funciona sem parecer "mural de logos".

---

## Fase 8 - Editorial

### Problemas

- A sessao do blog ainda corre risco de parecer uma camada paralela, nao parte do funil principal.
- Alguns textos seguem conceituais demais.
- Os chips de categoria em dark podem perder legibilidade.

### Cores

- Melhorar contraste dos chips.
- Garantir que cards do blog conversem com a paleta da home sem parecer um modulo separado.

### Textos

- Reescrever com foco em:
  - gerar demanda
  - educar o mercado
  - apoiar SEO e vendas
- Remover qualquer leitura de "radar" que soe mais interna do que comercial.

### Elementos

- Revisar hierarquia entre header, categorias e cards.
- Ver se a CTA final pode ser mais orientada a beneficio.

### Testes

- Validar contraste dos chips e meta dos posts.
- Conferir se os tres cards sao legiveis e equilibrados no mobile.

---

## Fase 9 - Contact

### Problemas

- A secao fecha bem, mas ainda mistura diagnostico, provas, contato e mini-processo com densidade alta.
- O bloco esquerdo e mais forte do que parte do lado direito.
- Alguns textos podem ficar mais curtos e mais humanos.

### Cores

- Melhorar contraste das informacoes de detalhe nos cards pequenos.
- Revisar equilibrio entre card dark esquerdo e cards claros direitos.

### Textos

- Simplificar o convite inicial.
- Tornar os cards de contato mais diretos.
- Reescrever "o que acontece depois" para ficar mais claro e menos consultivo.

### Elementos

- Reduzir carga visual.
- Separar melhor:
  - contato
  - formato de projeto
  - proximo passo

### Testes

- Validar a CTA principal no mobile.
- Verificar se o fechamento estimula acao sem parecer redundante.

---

## Ordem recomendada de execucao

1. Fase 0 - reset transversal
2. Fase 1 - hero
3. Fase 2 - trust bar
4. Fase 3 - solutions
5. Fase 7 - credenciais
6. Fase 9 - contact
7. Fase 4 - use cases
8. Fase 5 - tech stack
9. Fase 6 - process
10. Fase 8 - editorial

Motivo:

- Hero, trust, solutions, credenciais e contato sao os blocos que mais afetam percepcao comercial imediata.
- Depois disso, ajusta-se o miolo e o bloco editorial.

## Gatilhos objetivos de aceite

Uma fase so deve ser considerada pronta quando:

- `npm test` passar;
- `npm run build` passar;
- nao houver textos com cheiro de bastidor/template nos componentes da home;
- os titulos e paragrafo principais da sessao passarem em contraste AA;
- a secao continuar legivel em mobile;
- a CTA da sessao estiver clara e semanticamente correta.

## Proxima acao recomendada

Executar a **Fase 0 e a Fase 1 juntas**.

Isso cria a fundacao certa para o restante da home e resolve o ponto mais sensivel hoje: a hero.
