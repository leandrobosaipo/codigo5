# Plano de melhoria editorial, visual e de prova social do site Código5

## 1. Objetivo

Reduzir a carga de leitura do site sem descaracterizar a comunicação da Código5.

O foco não é "deixar o site bonito" de forma genérica. O foco é:

- cortar excesso de texto;
- aumentar leitura por varredura;
- introduzir mais imagem e prova visual;
- corrigir a distribuição de logos e prova social;
- preservar a característica de comunicação já definida na marca.

---

## 2. Característica de comunicação que deve ser preservada

Com base na documentação de marca da Código5 e na leitura do site publicado, a comunicação correta da marca é:

- clara;
- prática;
- comercial;
- consultiva;
- sem hype tecnológico;
- sem promessas vazias;
- sem linguagem de bastidor;
- orientada a confiança, operação e resultado;
- pensada para empresário que não quer ler discurso longo nem jargão.

### O que isso significa na prática

Devemos preservar:

- sensação de empresa séria e preparada;
- clareza sobre o que a Código5 faz;
- tom direto e confiável;
- foco em presença digital, captação, operação e resultado.

Devemos reduzir:

- explicação longa demais;
- densidade excessiva de cards com texto;
- repetições de ideia em várias seções;
- blocos que parecem mais "raciocínio da agência" do que benefício percebido pelo cliente.

---

## 3. Diagnóstico geral do site hoje

### 3.1 Problema editorial

O site fala demais.

Há muita explicação por seção, muito texto de apoio, muitos cards explicativos e pouca priorização visual. Em vez de o visitante entender rápido:

- o que a Código5 faz;
- para quem faz;
- por que confiar;
- onde já entregou;

ele precisa ler demais para chegar à mesma conclusão.

### 3.2 Problema visual

O site tem menos imagem do que deveria para o tipo de serviço que vende.

Hoje a estrutura depende muito de:

- headlines;
- parágrafos;
- chips;
- cards;
- listas;

e pouco de:

- fotos reais;
- recortes de interface;
- screenshots de projetos;
- ambientes de clientes;
- logos bem distribuídos;
- estudos visuais curtos.

### 3.3 Problema de prova social

A prova social está mal distribuída.

Problemas confirmados no código:

- a faixa principal da home mostra só `clients.slice(0, 6)`, então a vitrine inicial de logos corta a lista de forma arbitrária;
- marcas pedidas pelo usuário como `Roo Noticias` e `Shop10` não entram hoje nessa seleção principal;
- algumas marcas aparecem em mais de um bloco do site, o que gera percepção de repetição, enquanto outras relevantes ficam escondidas;
- a home e o portfólio não estão trabalhando com uma curadoria explícita de "marcas âncora" vs "marcas de apoio".

### 3.4 Problema de arquitetura de conteúdo

O site usa uma boa base de posicionamento, mas ainda está organizado mais como narrativa de explicação do que como página de decisão.

O visitante precisa de:

1. entendimento rápido;
2. imagens que sustentem percepção;
3. prova social visível;
4. serviços organizados;
5. CTA claro;

Hoje existe uma boa parte disso, mas com densidade alta demais.

---

## 4. Diretriz principal de correção

### Regra editorial

Cada seção deve responder só uma função principal:

- atrair;
- provar;
- mostrar;
- organizar;
- converter.

Se uma seção estiver tentando fazer duas ou três dessas coisas ao mesmo tempo, ela tende a ficar longa.

### Regra visual

Cada página pública precisa ter mais blocos de imagem e menos blocos só de texto.

Tipos de imagem prioritários:

1. logos reais de clientes;
2. screenshots de sites e projetos publicados;
3. fotos contextuais por segmento;
4. imagens de bastidor comercial apenas quando reforçarem confiança;
5. thumbs/editoriais no blog com padrão mais forte.

### Regra de prova social

Separar os clientes em três níveis:

1. `Marcas âncora`
   Usadas na home, hero, portfólio e provas principais.

2. `Marcas de apoio`
   Usadas em grids secundários.

3. `Marcas contextuais`
   Usadas por segmento, estudo de caso ou página específica.

---

## 5. Curadoria correta de logos

### 5.1 Marcas que precisam entrar na prova principal

Com base no pedido do usuário, a curadoria principal deve contemplar pelo menos:

- Perrengue Mato Grosso
- Roo Noticias
- Portal Pantanal MT
- Portal Norte MT
- Shop10
- AlphaVille Buffet

### 5.2 Problemas atuais

- `Shop10` tem asset no projeto, mas não está incluído hoje nos catálogos principais de clientes.
- `Roo Noticias` existe no catálogo expandido, mas não está na primeira camada de prova da home.
- `Portal Pantanal MT` e `Portal Norte MT` existem, mas podem ficar escondidos dependendo da seção.
- `AlphaVille Buffet` existe, mas não necessariamente entra na vitrine principal.
- `Perrengue Mato Grosso` existe e aparece, mas divide espaço com marcas menos estratégicas na primeira seleção.

### 5.3 Correção proposta

Criar três conjuntos explícitos no conteúdo:

- `homeAnchorClients`
- `supportingClients`
- `segmentClients`

E parar de usar corte arbitrário tipo `slice(0, 6)` em área principal.

---

## 6. Plano por página e por seção

## Fase 1. Home

### 1.1 Hero

#### Problema atual

- texto demais acima da dobra;
- muitos blocos simultâneos;
- falta imagem forte ou prova visual dominante;
- a leitura depende demais da headline + cards + checklist.

#### O que preservar

- promessa central de clareza comercial;
- tom consultivo;
- CTA direto;
- sensação de estrutura séria.

#### O que mudar

- reduzir a quantidade de texto de apoio;
- manter só um argumento principal e um secundário;
- substituir parte dos cards por um bloco visual mais forte;
- trocar pelo menos um bloco textual por:
  - screenshot de projeto real;
  - composição com logos;
  - mini mosaico de cases visuais.

#### Direção recomendada

- headline curta;
- subheadline em 2 linhas máximas;
- 1 CTA principal + 1 CTA secundário;
- 1 bloco de logos âncora;
- 1 visual forte de projeto;
- reduzir checklist e cards auxiliares.

---

### 1.2 Credenciais e logos da home

#### Problema atual

- poucas logos;
- corte arbitrário;
- seleção sem lógica aparente para o visitante;
- omissão de marcas importantes.

#### O que mudar

- substituir a grade atual por uma vitrine curada de marcas âncora;
- incluir explicitamente:
  - Perrengue Mato Grosso
  - Roo Noticias
  - Portal Pantanal MT
  - Portal Norte MT
  - Shop10
  - AlphaVille Buffet
- remover duplicidade visual entre home e testemunhos.

#### Resultado esperado

O visitante precisa enxergar, em segundos, que a Código5 já entregou para marcas reais e conhecidas dentro do contexto regional.

---

### 1.3 TrustBar

#### Problema atual

- comunica bem, mas ainda depende mais de texto do que de impacto visual.

#### O que mudar

- compactar copy;
- usar menos frases e mais prova curta;
- integrar mini logos ou indicadores visuais.

---

### 1.4 SolutionsSection

#### Problema atual

- explica demais;
- cards longos;
- pouca imagem.

#### O que mudar

- reduzir texto por card;
- introduzir imagem ou ícone forte por trilha;
- organizar por 3 trilhas com leitura de 5 segundos:
  - parecer melhor;
  - captar melhor;
  - operar melhor.

---

### 1.5 UseCasesSection

#### Problema atual

- visualmente melhor do que outras seções, mas ainda longa;
- muita legenda e texto de apoio em cada card.

#### O que mudar

- manter cards com imagem;
- reduzir texto dentro de cada segmento;
- priorizar:
  - nome do segmento;
  - imagem;
  - uma frase curta;
  - 2 ou 3 capacidades.

#### Regra

Essa seção já tem imagem. O problema aqui é excesso de copy dentro do card.

---

### 1.6 TechStackSection

#### Problema atual

- fala como estrutura interna da agência;
- pouco visual;
- abstrata demais para quem compra.

#### O que mudar

- traduzir stack para benefício visual/comercial;
- usar menos texto técnico;
- adicionar imagens/screens de:
  - CMS;
  - ecommerce;
  - blog;
  - automação.

#### Regra

Se a seção não tiver imagem, ela vira mais um bloco de leitura. Isso precisa ser evitado.

---

### 1.7 ProcessSection

#### Problema atual

- boa lógica, mas ainda muito card textual;
- explica mais do que mostra.

#### O que mudar

- manter as etapas;
- reduzir texto por etapa;
- usar linha visual / diagrama / screenshot de fluxo;
- dar sensação de processo simples, não de metodologia extensa.

---

### 1.8 TestimonialsSection / Clientes

#### Problema atual

- mistura logos e texto explicativo;
- risco de repetição com a hero;
- pouco critério aparente de priorização.

#### O que mudar

- transformar em seção de portfólio resumido;
- priorizar marcas âncora;
- usar menos texto institucional;
- incluir:
  - logos maiores;
  - cards com thumbnail do projeto;
  - 1 linha por cliente/segmento.

---

### 1.9 EditorialSection

#### Problema atual

- ainda fala demais sobre a função do blog;
- mapa editorial ocupa muito espaço;
- chips de assunto dominam visualmente.

#### O que mudar

- diminuir texto explicativo;
- reduzir número de chips visíveis;
- colocar mais destaque visual nos posts;
- transformar a seção em:
  - "3 conteúdos em destaque"
  - "assuntos principais"
  - CTA para blog

#### Regra

O visitante precisa clicar, não ler uma tese sobre por que o blog existe.

---

### 1.10 ContactSection

#### Problema atual

- encerra bem, mas com densidade alta;
- muitos textos paralelos antes da ação.

#### O que mudar

- simplificar headline;
- destacar canal principal;
- reduzir caixas auxiliares;
- usar um fechamento mais visual com:
  - WhatsApp;
  - email;
  - localização;
  - 1 argumento de confiança.

---

## Fase 2. Página de Serviços

### Estrutura atual

- hero institucional;
- trilhas de serviço;
- reaproveitamento de seções da home.

### Problema

A página ainda explica demais e prova de menos.

### Plano

#### Hero

- reduzir texto;
- incluir imagem ou mockup de entregas;
- dar leitura mais rápida do que entra no serviço.

#### Trilhas de serviço

- trocar cards longos por módulos mais comerciais;
- cada trilha com:
  - nome;
  - imagem/thumbnail;
  - 3 entregas;
  - CTA.

#### Prova

- inserir logos ou mini cases específicos por serviço.

#### Resultado esperado

A página deve funcionar como página de compra, não só de explicação.

---

## Fase 3. Página de Portfólio

### Problema atual

- já é a página certa para prova, mas ainda depende de texto institucional;
- falta imagem mais forte de projetos;
- o usuário quer enxergar clientes e trabalhos com rapidez.

### Plano

- transformar o topo em galeria/grade de marcas âncora;
- incluir `Shop10` se houver material adequado;
- incluir `Roo Noticias` em posição visível;
- separar por blocos:
  - mídia;
  - institucional;
  - varejo;
  - saúde;
  - eventos;
- cada bloco com:
  - logo;
  - captura do site;
  - 1 frase curta sobre o projeto.

### Resultado esperado

Portfólio precisa parecer repertório real, não vitrine genérica de logos.

---

## Fase 4. Página Sobre

### Problema atual

- boa direção de marca;
- ainda extensa;
- pouca imagem humana e de contexto.

### Plano

- reduzir texto de filosofia;
- manter clareza sobre como a Código5 pensa;
- incluir:
  - foto do time/ambiente, se existir;
  - colagem de projetos;
  - linha do tempo curta;
  - marcas atendidas como reforço visual.

### Resultado esperado

O visitante deve entender rápido:

- quem é a Código5;
- como trabalha;
- por que confiar.

---

## Fase 5. Página Contato

### Problema atual

- útil, mas longa;
- muito contexto antes da ação.

### Plano

- simplificar hero;
- usar menos texto;
- transformar a página em CTA operacional:
  - WhatsApp
  - email
  - endereço
  - como funciona o primeiro contato
- incluir imagem de apoio ou composição institucional leve.

### Resultado esperado

Menos leitura. Mais ação.

---

## Fase 6. Blog index

### Problema atual

- topo com imagens funciona;
- abaixo disso o blog volta a ficar muito textual;
- sidebar fica pesada;
- taxonomy/chips ocupam muito espaço.

### Plano

#### Destaques

- manter imagem forte;
- reduzir metadados excessivos;
- priorizar 3 ou 4 cards visuais.

#### Navegação editorial

- trocar lista extensa de categorias por bloco mais compacto;
- mostrar só categorias prioritárias;
- esconder excedente em "ver mais".

#### Arquivo recente

- reduzir quantidade inicial de cards visíveis;
- aumentar peso das imagens;
- diminuir trechos de excerpt.

### Resultado esperado

O blog index precisa parecer mídia/editorial, não arquivo pesado de leitura.

---

## Fase 7. Sidebar do blog

### Problema atual

- longa;
- muito texto;
- baixa hierarquia visual;
- em alguns contextos perde leitura e contraste.

### Plano

- transformar a sidebar em navegação curta;
- ordem ideal:
  1. categorias principais
  2. posts recentes
  3. CTA curto
- reduzir quantidade de itens;
- usar melhor contraste e menos massa de informação.

### Resultado esperado

A sidebar deve ajudar a navegar, não competir com o conteúdo principal.

---

## Fase 8. Página de post

### Problema atual

- artigo funciona;
- o pós-conteúdo fica longo;
- há excesso de elementos editoriais depois do artigo.

### Plano

- manter hero do post;
- reduzir blocos pós-artigo;
- priorizar:
  - CTA principal
  - 2 ou 3 relacionados
  - categorias/tags de forma mais enxuta
- incluir imagem em componentes relacionados com mais destaque.

### Resultado esperado

Quem termina o artigo precisa ter um próximo clique claro, não cinco caminhos equivalentes.

---

## Fase 9. Categoria e tag do blog

### Problema atual

- tendem a herdar a mesma lógica de excesso do blog principal.

### Plano

- manter consistência visual com o blog;
- simplificar topo;
- reduzir explanatory copy;
- manter cards visuais com imagens.

---

## Fase 10. Utilitárias e páginas de apoio

### Páginas

- Política de privacidade
- 404

### Plano

- manter simples;
- não inflar com copy desnecessária;
- assegurar consistência visual;
- sem competir com páginas de venda.

---

## 7. Backlog técnico prioritário

### Prioridade P1

1. Parar de cortar logos da home com `slice(0, 6)`.
2. Criar seleção explícita de marcas âncora.
3. Incluir `Shop10` no catálogo principal, se a marca realmente deve fazer parte da prova pública.
4. Incluir `Roo Noticias` na vitrine principal.
5. Reduzir texto do hero da home.
6. Reduzir texto do editorial/blog section da home.
7. Reduzir densidade de sidebar do blog.

### Prioridade P2

1. Adicionar imagens/screenshots reais em:
   - hero
   - serviços
   - portfólio
   - blog index
2. Enxugar Process e TechStack.
3. Reorganizar ContactSection.

### Prioridade P3

1. Reequilibrar páginas institucionais com mais foto e menos explicação.
2. Refinar categoria/tag/post para leitura mais leve.

---

## 8. Teste de aceite por página

## Home

- o visitante entende em 5 a 8 segundos:
  - o que a Código5 faz;
  - para quem;
  - por que confiar.
- a primeira dobra tem imagem ou prova visual forte.
- os logos pedidos aparecem na estratégia principal.

## Serviços

- a página mostra serviços com leitura rápida;
- tem mais visual de entrega e menos explicação abstrata.

## Portfólio

- o visitante vê clientes e projetos sem precisar ler muito;
- as marcas âncora aparecem.

## Blog

- o visitante navega por imagem e tema;
- a sidebar ajuda em vez de poluir.

## Contato

- a ação principal está óbvia sem leitura longa.

---

## 9. Recomendação principal

Executar em três ondas:

### Onda 1

- prova social e logos;
- hero da home;
- redução de texto do blog section da home;
- sidebar do blog.

### Onda 2

- serviços;
- portfólio;
- contato;
- processo e stack.

### Onda 3

- sobre;
- post do blog;
- categoria/tag;
- utilitárias.

---

## 10. Riscos

- adicionar muitas imagens sem curadoria pode deixar o site genérico;
- trocar texto por imagem sem manter a promessa comercial pode enfraquecer a clareza;
- repetir as mesmas logos em todos os blocos mantém a percepção de duplicidade;
- inflar o portfólio com muitos clientes sem hierarquia visual volta a gerar ruído.

---

## 11. Recomendação técnica final

Opção principal:

- reestruturar o conteúdo para leitura curta e prova visual forte, sem mudar o posicionamento da marca.

Alternativa curta:

- fazer só um corte de copy.

Essa alternativa é mais rápida, mas fraca. Ela não resolve o problema principal, que é a combinação de:

- texto demais;
- imagem de menos;
- prova social mal distribuída.
