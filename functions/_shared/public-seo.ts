import { mapRowToPost } from '../api/bot/posts';

const site = 'https://codigo5.com.br';
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const textOnly = (html: string) => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<\/(p|h[1-6]|li|div)>/gi,'\n\n').replace(/<[^>]*>/g,'').trim();

type PublicSeo = {title:string; description:string; url:string; image:string; type:string; schema:Record<string, unknown>; body:string};
const renderPublicSeo = (html:string, {title,description,url,image,type,schema,body}:PublicSeo) => {
  const meta = [
    ['name','description',description], ['property','og:type',type], ['property','og:title',title],
    ['property','og:description',description], ['property','og:url',url], ['property','og:image',image],
    ['property','og:image:alt',title], ['name','twitter:title',title], ['name','twitter:description',description],
    ['name','twitter:image',image], ['name','twitter:image:alt',title], ['name','robots','index,follow,max-image-preview:large'],
  ];
  html = html.replace(/<title>[\s\S]*?<\/title>/,() => `<title>${escape(title)}</title>`)
    .replace(/<meta\s+property="og:image:(width|height|type)"[^>]*>/g,'')
    .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,'');
  for(const [attr,key,value] of meta) {
    const tag=`<meta ${attr}="${key}" content="${escape(value)}" />`;
    const pattern = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`);
    html = pattern.test(html) ? html.replace(pattern,() => tag) : html.replace('</head>',() => tag+'</head>');
  }

  html=html.replace('</head>',() => `<script type="application/ld+json" id="codigo5-schema">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
  const rootStart=html.indexOf('<div id="root">');
  const rootEnd=html.lastIndexOf('</div>');
  if(rootStart >= 0 && rootEnd > rootStart) {

    html=html.slice(0,rootStart)+`<div id="root">${body}</div>`+html.slice(rootEnd+6);
  }
  return html;
};

// Fresh D1 posts remain shareable before JavaScript, including publications after the last build.
export const renderPublishedPostSeo = (html:string, row:Record<string, unknown>) => {
  const post = mapRowToPost(row);
  const url = `${site}/blog/${encodeURIComponent(post.slug)}`;
  let image = `${site}/assets/codigo5/social/blog.jpg`;
  try { const candidate = new URL(post.image || image, site); if(candidate.protocol === 'https:') image = candidate.href; } catch { /* Use the local cover for malformed image URLs. */ }
  const title = post.seoTitle || post.title;
  const description = textOnly(post.seoDescription || post.excerpt);
  const schema = {'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description,url,mainEntityOfPage:url,image:[image],datePublished:post.date,dateModified:post.modified,inLanguage:'pt-BR',author:{'@type':'Organization',name:'Código5',url:site},publisher:{'@type':'Organization',name:'Código5',url:site,logo:{'@type':'ImageObject',url:`${site}/assets/codigo5/logos/logo-dark.webp`}}};
  const body=`<div class="c5-site"><header class="c5-container"><a href="/">Código5</a> · <a href="/blog">Blog</a></header><main id="conteudo" class="c5-container c5-prose"><article><h1>${escape(post.title)}</h1><p>${escape(post.excerpt)}</p><img class="c5-article-cover" src="${escape(image)}" alt="${escape(post.title)}" /><div style="white-space:pre-line">${escape(textOnly(post.contentHtml))}</div></article></main></div>`;
  return renderPublicSeo(html,{title,description,url,image,type:'article',schema,body});
};

export const renderPublishedCollectionSeo = (html:string, route:string, name:string, rows:Record<string, unknown>[]) => {
  const title = `${name} | Blog Código5`;
  const description = `Artigos da Código5 sobre ${name}.`;
  const url = site + route;
  const image = `${site}/assets/codigo5/social/blog.jpg`;
  const schema = {'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url};
  const body = `<div class="c5-site"><main id="conteudo" class="c5-container"><a href="/blog">Blog Código5</a><h1>${escape(name)}</h1><p>${escape(description)}</p><ul>${rows.map(row => `<li><a href="/blog/${encodeURIComponent(String(row.slug))}">${escape(row.title)}</a></li>`).join('')}</ul></main></div>`;
  return renderPublicSeo(html,{title,description,url,image,type:'website',schema,body});
};
