const site = 'https://codigo5.com.br';
const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const postLine = post => `- [${clean(post.title)}](${site}/blog/${encodeURIComponent(post.slug)}): ${clean(post.seo_description || post.seoDescription || post.excerpt).slice(0, 240)}`;

export function renderLlms(posts, full = false) {
  const listed = posts.slice(0, full ? 50 : 12);
  const publicPages = [
    '- [Início](https://codigo5.com.br/): apresentação, serviços e contato.',
    '- [Serviços](https://codigo5.com.br/servicos): sites, presença digital, automações e conteúdo.',
    '- [Automação com IA](https://codigo5.com.br/automacao-com-ia): atendimento, agenda, curadoria e operações.',
    '- [Portfólio](https://codigo5.com.br/portfolio): projetos e experiência por mercado.',
    '- [Blog](https://codigo5.com.br/blog): conteúdo para empresários sobre tecnologia, marketing e automação.',
    '- [Contato](https://codigo5.com.br/contato): como falar com a Código5.',
  ];
  return [`# Código5`, '', 'A Código5 cria sites, presença digital e automações com IA para empresas e operações editoriais no Brasil.', '', '## Páginas públicas', ...publicPages, '', '## Conteúdo recente', ...(listed.length ? listed.map(postLine) : ['- O acervo público está temporariamente indisponível.']), '', '## Uso', 'Use somente as páginas públicas listadas neste arquivo como referência.', ''].join('\n');
}
