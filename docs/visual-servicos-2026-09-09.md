# Revisão visual das páginas públicas — 09/09/2026

## Alterações

- Home: seis cartões com imagem, público, serviço e explicação curta; fotografia ilustrativa na trajetória e no método de trabalho.
- Serviços: abertura visual e chamada de automação com imagem; preservadas as cinco frentes completas e seus exemplos reais.
- Automações: sete cartões com imagem, público e sequência de funcionamento. O detalhamento permanece disponível no HTML, em seções expansíveis. Seis mercados com ícones.
- Sobre: capturas de Rbike, CREF17 e Portal 163 como evidência da trajetória; imagens de rotina e painel do Radar com origem identificada.
- Portfólio: abertura com projeto real e sete blocos de soluções com ícones. Catálogo e filtros preservados.
- Contato: imagem ilustrativa e ícones dos canais de atendimento.
- Blog: imagem de abertura na listagem e nas coleções. Corrigido o componente que recebia a imagem de coleção, mas não a exibia. Artigos relacionados passam a mostrar suas capas.
- Privacidade: ícones discretos, sem alteração das condições ou informações legais.

Não foram criados retratos fictícios da equipe, depoimentos, resultados ou telas apresentadas como sistemas reais. Capturas existentes conservam sua identificação; cenas geradas são legendadas como ilustrativas. Os textos continuam selecionáveis, acessíveis e presentes no HTML para leitura e busca.

## Imagens novas

Geradas com a ferramenta integrada `image_gen`, conferidas visualmente e convertidas para WebP com 1.200 px de largura, qualidade 80. Conjunto com aproximadamente 184 KiB. Sem biblioteca nova. Usam carregamento tardio fora da abertura; dimensões reservam espaço no layout.

| Arquivo em `public/assets/codigo5/visual/` | Cena / orientação do prompt |
|---|---|
| `loja-pedidos.webp` | Fotografia editorial natural de uma lojista brasileira acompanhando pedidos no laptop, balcão com embalagem e caderno, produtos reais de uma pequena loja, luz lateral, tons azul-marinho e madeira. Sem identidade de cliente, poses publicitárias ou elementos futuristas. |
| `conversa-projeto.webp` | Fotografia editorial de uma conversa sobre um site, mãos e ombros de duas pessoas, esboços de páginas em papel, laptop e mesa de trabalho. Sem retratar funcionários reais, sem logotipos ou aperto de mãos encenado. |
| `agenda-atendimento.webp` | Cena de recepção de clínica odontológica brasileira: recepcionista e visitante, calendário e computador, ambiente cotidiano e luz natural. Sem procedimento clínico, dados de pacientes ou identidade de cliente real. |

## Verificação e operação

- Integridade dos arquivos e cobertura visual das sete soluções no teste de assets.
- Teste de regressão para a imagem fornecida ao cabeçalho das coleções.
- Revisão independente de conteúdo e diff, além de validação visual no navegador interno.
- Layouts públicos conferidos em 390 px sem rolagem horizontal.
- Recursos temporários de restauração de Stilo e Veloztrix encerrados. Quatro cópias temporárias removidas: 650.911.251 bytes liberados; backups originais e capturas preservados.
- Publicação pelo fluxo existente Cloudflare Pages, sem alteração de banco, credenciais ou integrações.

Rollback: republicar o deployment anterior completo, preservando D1 e KV.
