import fs from 'node:fs';
import content from '../src/content/automations.json' with { type: 'json' };
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url='https://codigo5.com.br/automacao-com-ia';
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(content.seoTitle)}</title>`);
for(const [attribute,key,value] of [['name','description',content.description],['property','og:title',content.seoTitle],['property','og:description',content.description],['property','og:url',url],['property','og:image','https://codigo5.com.br'+content.image],['name','twitter:title',content.seoTitle],['name','twitter:description',content.description],['name','twitter:image','https://codigo5.com.br'+content.image]]){
 html=html.replace(new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[\\s\\S]*?"\\s*\\/>`),`<meta ${attribute}="${key}" content="${escape(value)}" />`);
}
html=html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,`<link rel="canonical" href="${url}" />`);
// Initial readable HTML uses the same content source as React; createRoot replaces it on startup.
const body=`<div class="c5-site"><header class="c5-container"><a href="/">Código5</a> · <a href="/servicos">Serviços</a> · <a href="/portfolio">Portfólio</a></header><main class="c5-container" id="conteudo"><section class="c5-page-hero"><h1>${escape(content.title)}</h1><p>${escape(content.intro)}</p><img src="${content.image}" width="768" height="512" alt="Atendimento humanizado em uma barbearia; imagem ilustrativa" /></section><h2>O que podemos automatizar</h2>${content.solutions.map(s=>`<section id="${s.id}"><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p><ul>${s.items.map(t=>`<li>${escape(t)}</li>`).join('')}</ul></section>`).join('')}<h2>Para o seu tipo de negócio</h2>${content.markets.map(s=>`<section><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p></section>`).join('')}<h2>Antes de começar</h2>${content.faq.map(s=>`<details><summary>${escape(s.question)}</summary><p>${escape(s.answer)}</p></details>`).join('')}<p><a href="/contato">Converse com a Código5 sobre sua operação</a></p></main></div>`;
html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
const schema={'@context':'https://schema.org','@type':'Service',name:content.title,description:content.description,url,provider:{'@type':'Organization',name:'Código5',url:'https://codigo5.com.br'},areaServed:'Brasil'};
html=html.replace('</head>',`<script type="application/ld+json" id="codigo5-schema">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
fs.mkdirSync('dist/automacao-com-ia',{recursive:true});fs.writeFileSync('dist/automacao-com-ia/index.html',html);
if(!html.includes('<h1>')||!html.includes(url)||!content.markets.every(m=>html.includes(escape(m.title))))throw Error('Automation static HTML incomplete');
console.log('Automação: conteúdo completo e canonical presentes no HTML inicial.');
