# Código5 Figma-Ready Blueprint

## 1. Objetivo

Este documento traduz o sistema visual do site público da Código5 para um formato pronto para desenho no Figma.

Ele não é um moodboard solto.
Ele é uma especificação de board + templates, com decisões já fechadas para:

- direção visual;
- tokens;
- componentes;
- templates de página;
- orçamento de copy;
- política de assets;
- distribuição de prova social;
- fluxo mínimo de protótipo.

Direção escolhida:

- `tech startup bold`
- com base `editorial premium`
- sem cair em sci-fi genérico
- sem voltar para site corporativo frio

---

## 2. Estrutura do arquivo Figma

Criar estas páginas no arquivo:

1. `00 Cover`
2. `01 Visual Direction`
3. `02 Tokens`
4. `03 Components`
5. `04 Home Template`
6. `05 Internal Template`
7. `06 Portfolio Template`
8. `07 Blog Hub Template`
9. `08 Blog Article Template`
10. `09 Utility Pages`
11. `10 Asset Slots`
12. `11 Prototype Flow`

---

## 3. Direção visual

### 3.1 Linguagem principal

O site deve parecer:

- empresa de tecnologia aplicada;
- madura o suficiente para projetos reais;
- visualmente forte;
- comercialmente clara;
- com repertório editorial;
- mais imagem do que explicação.

### 3.2 Territórios visuais permitidos

- editorial tech brasileira
- startup bold
- corporate premium

### 3.3 Anti-referências

- glassmorphism pesado
- sci-fi genérico
- neon sem função
- card dentro de card dentro de card
- excesso de chips e badges
- imagem abstrata de IA como prova principal

### 3.4 Regras de composição

- headlines grandes e curtas
- asset dominante por seção
- contraste alto
- blocos escuros com respiro amplo
- alternância previsível entre dark e light sections
- prova visual real antes de logo wall

---

## 4. Tokens

### 4.1 Cores

- `Color / Surface / Dark` → `#091321`
- `Color / Surface / Dark Strong` → `#08101B`
- `Color / Surface / Light` → `#F3F7FD`
- `Color / Surface / Elevated` → `#FFFFFF`
- `Color / Brand / Primary` → `#67E8F9`
- `Color / Brand / Accent` → `#FF8A5B`
- `Color / Brand / Proof` → `#A3E635`
- `Color / Text / Strong` → `#111827`
- `Color / Text / Default` → `#243041`
- `Color / Text / Muted` → `#5E6A79`
- `Color / Stroke / Soft` → `rgba(17,24,39,0.08)`
- `Color / Stroke / Strong` → `rgba(17,24,39,0.16)`

### 4.2 Tipografia

- `Type / Display / XL`
  - uso: hero principal desktop
  - família: serif display
  - peso: extra bold
- `Type / Display / L`
  - uso: hero interno e títulos de destaque
- `Type / Heading / L`
  - uso: títulos de seção
- `Type / Heading / M`
  - uso: títulos de card e subtítulos
- `Type / Body / L`
  - uso: apoio de hero e introduções curtas
- `Type / Body / M`
  - uso: corpo e apoio de cards
- `Type / Meta / S`
  - uso: kicker, chips, metadata
- `Type / Button / M`
  - uso: CTAs

### 4.3 Espaçamento

- `Space / 4`
- `Space / 8`
- `Space / 12`
- `Space / 16`
- `Space / 24`
- `Space / 32`
- `Space / 40`
- `Space / 56`
- `Space / 72`
- `Space / 96`

### 4.4 Radius

- `Radius / S` → 12
- `Radius / M` → 18
- `Radius / L` → 24
- `Radius / XL` → 32

### 4.5 Grid

- desktop:
  - 12 colunas
  - max width `1200-1280`
  - gutter `32`
- mobile:
  - 4 colunas
  - gutter `20`
- frames:
  - desktop `1440`
  - mobile `390`

---

## 5. Componentes

### 5.1 Foundation

- `Top Nav`
- `Section Header`
- `Primary CTA`
- `Secondary CTA`
- `Metric Card`
- `Logo Tile`
- `Chip / Category`
- `Tag / Segment`
- `Divider / Editorial`
- `Proof Strip`

### 5.2 Content

- `Hero / Split`
- `Hero / Editorial`
- `Hero / Internal`
- `Feature Card / Service`
- `Feature Card / Market`
- `Case Card / Screenshot First`
- `Case Collage / 1+2`
- `Editorial Card / Feature`
- `Editorial Card / Archive`
- `Sidebar Block / Categories`
- `Sidebar Block / Recent`
- `CTA Band / Final`
- `Utility Hero / Simple`

### 5.3 Variantes obrigatórias

Quando fizer sentido, cada componente deve ter:

- `light`
- `dark`
- `compact`
- `featured`
- `mobile`

### 5.4 Regras obrigatórias por componente

Cada componente precisa sair do blueprint com:

- padding interno
- altura mínima
- proporção imagem/texto
- estado hover
- estado focus
- comportamento mobile
- token de spacing aplicado

---

## 6. Templates

### 6.1 Home

Ordem:

1. `Hero / Split`
2. `Proof Strip`
3. `Feature Card / Service` em grid 2x2
4. `Feature Card / Market`
5. bloco operacional curto
6. timeline de processo
7. `Case Collage / 1+2` + logos de apoio
8. blog hub curto
9. `CTA Band / Final`

Regras:

- hero é o maior bloco de impacto;
- prova social rápida entra logo no topo;
- logo wall não pode se repetir na seção seguinte;
- o blog entra como prova editorial.

### 6.2 Internal Template

Usa:

- Sobre
- Serviços
- Contato

Ordem:

1. `Hero / Internal`
2. bloco de contexto
3. bloco principal específico
4. prova visual contextual
5. `CTA Band / Final`

Regras:

- não parecer “home menor”;
- cada página com uma função central clara;
- uma única prova dominante por página.

### 6.3 Portfolio Template

Ordem:

1. hero com `Case Collage / 1+2`
2. grid de `Case Card / Screenshot First`
3. recorte por segmento
4. logo wall secundária
5. CTA final

Regras:

- screenshot vem antes da logo;
- a narrativa é “projeto real”;
- logos entram como apoio.

### 6.4 Blog Hub Template

Ordem:

1. `Hero / Editorial`
2. 1 destaque grande + 2 menores
3. grid de artigos
4. entrada rápida por tema
5. sidebar simplificada

Regras:

- thumb domina;
- taxonomy apoia;
- não parecer arquivo pesado.

### 6.5 Blog Article Template

Ordem:

1. cover
2. meta strip
3. coluna de leitura
4. figures, pull quotes e imagens
5. relacionados visuais
6. CTA discreto

Regras:

- sidebar não conduz a página;
- leitura com respiro;
- relacionados entram no fluxo.

### 6.6 Utility Pages

#### 404

- hero curto
- 2 caminhos úteis
- CTA simples

#### Privacidade

- hero leve
- largura de leitura estreita
- tipografia limpa
- mínimo de ornamento

---

## 7. Copy budget

### Hero

- 1 headline
- 1 apoio
- até 2 CTAs

### Section Header

- 1 kicker
- 1 título
- 1 apoio

### Card

- 1 título
- 1 frase

### Prova

- 1 frase curta

### Regra geral

- nenhum bloco comercial depende de parágrafo longo

---

## 8. Política de assets

### Classes

- `A1` → screenshot real de case
- `A2` → collage local de case
- `A3` → thumb editorial
- `A4` → logo wall

### Ordem de prioridade

1. `A1`
2. `A2`
3. `A3`
4. `A4`

### Regras

Nunca usar:

- imagem genérica de IA como prova principal;
- logo-only proof em sequência longa;
- mockup sem vínculo com case real quando houver case disponível.

### Assets mais fortes disponíveis hoje

- Roo Notícias
- Clínica Petterle
- AlphaVille Buffet
- Sonata Musical
- Portal Pantanal MT
- collages locais de serviços, portfólio e blog

---

## 9. Distribuição de prova social

- Home → prova rápida
- Portfólio → prova expandida
- Internas → prova contextual
- Blog → prova editorial

Evitar:

- mesma marca repetida em blocos consecutivos;
- mesma logo wall em home + internas + portfólio;
- blog competindo com portfólio em prova de marca.

---

## 10. Naming no Figma

- `Page / Home`
- `Page / Internal`
- `Page / Portfolio`
- `Page / Blog Hub`
- `Page / Blog Article`
- `Page / Utility`

- `Section / Hero / Split`
- `Section / Hero / Internal`
- `Section / Proof / Strip`
- `Section / CTA / Final`

- `Card / Case / Featured`
- `Card / Editorial / Feature`
- `Card / Editorial / Compact`

- `Token / Color / Surface / Dark`
- `Text / Display / XL`

---

## 11. Autolayout rules

Todos os frames principais devem sair com:

- auto layout vertical
- constraints claros para desktop/mobile
- variants configuradas
- crop previsível para assets
- spacing por token, não por valor solto

---

## 12. Prototype flow

Fluxo mínimo:

- Home → Serviços
- Home → Portfólio
- Home → Blog
- Blog Hub → Artigo
- Interna → CTA / Contato

---

## 13. Critérios de aceite

- nenhum template exige decisão estrutural nova do designer
- todas as páginas têm ordem de seções travada
- cada seção tem tipo de bloco definido
- cada bloco tem tipo de asset definido
- a distribuição de prova social está fechada
- desktop e mobile preservam a mesma gramática visual
- o portfólio parece vitrine premium
- o blog parece editorial curado

---

## 14. Próxima etapa no Figma

Depois de montar esse arquivo:

1. desenhar versão low-fidelity de todas as páginas
2. aplicar tokens e componentes
3. subir para high-fidelity primeiro:
   - Home
   - Portfólio
   - Blog Hub
4. validar mobile
5. só depois refinar internas secundárias
