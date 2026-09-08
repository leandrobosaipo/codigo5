# Plano de Correcao de Contraste - Home e Blog da Codigo5

Data: 2026-04-16
Ambiente auditado: producao (`https://codigo5.com.br` e `https://codigo5.com.br/blog`)
Metodologia: leitura visual via prints do usuario + validacao em pagina real com `agent-browser`

## 1. Objetivo

Corrigir textos que estao ficando ilegiveis por contraste insuficiente na home e no blog, sem atacar apenas "cor isolada". O foco aqui e corrigir:

- heranca de cor errada em secoes dark;
- opacidades baixas demais sobre fundos com gradiente, glow ou blur;
- chips/cards claros usando texto claro demais;
- inconsistencias entre token, contexto visual e superficie real.

## 2. Ganho de conhecimento desta auditoria

O problema principal nao e apenas "escolher uma cor mais clara". O problema recorrente identificado foi:

1. Componentes-base com classes semanticas (`section-heading`, `section-lead`, `section-header-aside`) estao definindo cor final via CSS e, em alguns casos, essa cor vence a tentativa de "invert" feita por utilitarios locais.
2. Em producao, varios titulos de secoes dark estao computando para `rgb(18, 22, 38)` e nao para branco, mesmo quando o componente tenta aplicar `text-white`.
3. O site usa muitos fundos com:
   - gradiente;
   - glow ciano;
   - blur;
   - transparencia;
   - shells com sobreposicao.

   Nesses cenarios, uma cor "teoricamente suficiente" no Figma ou no token isolado pode ficar visualmente apagada na pagina real.
4. O contraste ruim esta mais ligado a **componente + contexto + ordem do CSS** do que a um token unico.

## 3. Evidencias confirmadas nesta rodada

### 3.1 Home - secoes dark com heading escuro

Inspecao em pagina real com `agent-browser` retornou:

- `#casos h2` -> `rgb(18, 22, 38)`
- `#blog h2` -> `rgb(18, 22, 38)`
- `#contato h2` -> `rgb(18, 22, 38)`

Isso confirma que o texto do heading em secoes dark esta herdando/aplicando cor escura no lugar de cor clara.

### 3.2 Home - leads e asides tambem escuros demais em secoes dark

Inspecao em pagina real com `agent-browser` retornou:

- `#casos .section-lead` -> `rgb(37, 43, 60)`
- `#casos .section-header-aside` -> `rgb(80, 87, 104)`
- `#blog .section-lead` -> `rgb(37, 43, 60)`
- `#blog .section-header-aside` -> `rgb(80, 87, 104)`
- `#contato .section-lead` -> `rgb(37, 43, 60)`
- `#contato .section-header-aside` -> `rgb(80, 87, 104)`

Essas cores podem funcionar em blocos claros, mas nao em shells dark com gradiente profundo.

### 3.3 Blog - sidebar exige validacao por contexto

A sidebar do blog hoje mostra cores computadas mais seguras no painel escuro, mas os prints do usuario registram cenarios em que ela apareceu praticamente branca sobre branca. Isso indica um segundo tipo de falha:

- o mesmo componente pode alternar entre estados visualmente bons e ruins dependendo do painel/gradiente/ordem de CSS aplicada na versao publicada.

Conclusao: a cor computada isolada nao basta; precisamos testar o bloco no contexto real e comparar com screenshot.

## 4. Blocos problemáticos ja confirmados

### Fase A - Hero da home

Sintoma visto nos prints:
- cards de apoio e linhas de checklist com texto quase sumindo;
- metricas e textos auxiliares visualmente fracos em relacao ao fundo.

Hipotese tecnica:
- combinacao de fundo dark + transparencia + texto em tom medio escuro;
- contraste aceitavel em codigo, mas ruim na composicao final.

Correcao proposta:
- revisar especificamente os tons de:
  - metric labels;
  - checklist rows;
  - labels pequenos do painel lateral;
- remover dependencia de tons `slate-400` e variantes medias nesses blocos;
- usar uma escala unica para "text on dark":
  - heading: branco puro;
  - lead: slate-100;
  - supporting text: slate-200;
  - micro label: cyan-100 ou white/90.

Teste de aceite:
- print desktop e mobile;
- leitura do texto a 100% de zoom;
- nenhum texto importante pode parecer "cinza escondido" sobre navy.

### Fase B - "Mercados onde isso encaixa"

Sintoma visto nos prints:
- kicker ok;
- h2 praticamente apagado;
- lead e aside muito fracos sobre o fundo dark;
- alguns textos internos dos cards ainda delicados demais.

Causa raiz mais provavel:
- `SectionHeader` invertido falhando no h2/lead/aside;
- overlay dos cards ainda exigindo mais contraste.

Correcao proposta:
- corrigir a arquitetura do `SectionHeader` para ter variante dark real, nao apenas utilitario extra;
- revisar overlay dos cards para garantir separacao entre imagem e texto;
- promover summary e nota final para tons mais claros.

Teste de aceite:
- heading legivel em primeiro olhar;
- lead e aside lidos sem precisar "forcar a vista";
- texto de card legivel mesmo nas imagens mais claras.

### Fase C - "Como o projeto avanca"

Sintoma visto nos prints:
- heading da secao quase preto sobre fundo dark;
- lead e aside muito fracos;
- corpo de cards melhor que o topo, mas ainda dependente de tons medianos.

Causa raiz:
- mesma falha do `SectionHeader` invertido;
- subtom dos textos secundarios ainda baixo.

Correcao proposta:
- resolver o componente-base primeiro;
- depois revisar o texto secundario dos cards com uma escala fixa para dark.

Teste de aceite:
- heading e lead legiveis sem zoom;
- hierarquia clara entre titulo do card e texto explicativo;
- icones e badges continuam legiveis sem parecerem "lavados".

### Fase D - "Radar editorial"

Sintoma visto nos prints:
- heading, lead e texto do aside muito escuros sobre fundo dark;
- tags/chips do bloco claro ficando claras demais sobre superficie clara.

Causa raiz:
- problema duplo:
  - `SectionHeader` invertido falhando na parte dark;
  - chips do painel claro com contraste insuficiente.

Correcao proposta:
- corrigir `SectionHeader`;
- criar variante de chip para painel claro com:
  - texto mais escuro;
  - borda mais visivel;
  - fundo menos lavado.

Teste de aceite:
- painel dark com texto forte;
- painel claro com chips totalmente legiveis;
- CTA final mantendo hierarquia clara.

### Fase E - "Pronto para começar"

Sintoma visto nos prints:
- h2, lead e aside tambem ficam quase apagados no topo do bloco dark.

Causa raiz:
- repeticao do mesmo problema estrutural do `SectionHeader`.

Correcao proposta:
- aplicar a mesma correcao arquitetural da variante dark;
- depois revisar apenas os cards de contato para uniformidade.

Teste de aceite:
- topo da secao legivel;
- cards claros/dark do bloco final com leitura equilibrada.

### Fase F - Sidebar do blog

Sintoma visto nos prints:
- textos da coluna lateral aparecendo brancos demais ou claros demais sobre fundo claro;
- em outro estado, painel dark pode estar correto, mas a composicao geral ainda exige verificacao.

Causa raiz:
- componentes de sidebar misturam contextos claro e dark;
- alguns itens parecem depender demais de utilitarios locais e nao de uma variante explicita por superficie.

Correcao proposta:
- separar claramente estilos para:
  - painel dark;
  - painel light;
  - chips light;
  - links light;
  - headings light;
- validar sidebar em:
  - index do blog;
  - pagina interna do post;
  - categoria/tag.

Teste de aceite:
- nenhum texto branco sobre painel claro;
- headings e labels com contraste consistente;
- links continuam claramente clicaveis.

## 5. Plano tecnico de correcao

### Etapa 1 - Resolver a arquitetura da cor em contexto dark

Foco:
- `SectionHeader`
- classes semanticas que definem cor por default

Acao:
- criar variante dark real no componente, em vez de depender so de `invert` com utilitario solto;
- evitar que `section-heading`, `section-lead` e `section-header-aside` imponham cor clara/escura errada depois do utilitario.

Resultado esperado:
- qualquer secao dark que use `SectionHeader` deixa de quebrar por heranca de cor.

### Etapa 2 - Revisar escalas de texto por superficie

Criar tabela simples e fixa:

- dark heading -> white
- dark lead -> slate-100
- dark body -> slate-200
- dark micro label -> cyan-100 / white 90
- light heading -> foreground
- light body -> foreground 78-85
- light micro label -> primary forte ou foreground 70

Resultado esperado:
- o time para de escolher cor "no olho" em cada bloco.

### Etapa 3 - Revisar componentes mistos

Foco:
- hero cards
- chips
- badges
- sidebar
- cards com imagem + overlay

Resultado esperado:
- cada componente passa a saber em qual superficie esta sendo usado.

### Etapa 4 - Validacao visual por contexto real

Para cada correcao:
- screenshot desktop;
- screenshot mobile;
- comparacao com print do usuario;
- checagem em zoom normal.

## 6. Ordem de execucao recomendada

1. Corrigir `SectionHeader` dark.
2. Corrigir home:
   - mercados
   - processo
   - radar editorial
   - contato
3. Corrigir hero cards e checklist.
4. Corrigir sidebar do blog.
5. Fazer passada final comparando home + blog.

## 7. Como adicionar novos prints sem perder contexto

Quando novos prints chegarem, registrar cada um assim:

- bloco:
- pagina:
- texto ilegivel:
- fundo por tras:
- tipo do problema:
  - heading escuro em fundo dark
  - texto claro em fundo claro
  - opacity baixa demais
  - chip/tag com borda e texto insuficientes
  - overlay de imagem insuficiente
- prioridade:
  - alta
  - media
  - baixa

## 8. Criterio de encerramento

Essa frente so pode ser considerada resolvida quando:

- nenhum h2/h3 importante em secao dark parecer "quase preto";
- nenhum texto funcional em painel claro parecer "quase branco";
- nenhuma tag/chip exigir esforco para leitura;
- home e blog passarem em auditoria visual real, nao apenas em leitura de codigo.
