import { expect, it, vi } from 'vitest';
import { renderPublishedPostSeo } from '../../functions/_shared/public-seo';
import { onRequest } from '../../functions/_middleware';
const row = {slug:'post-novo',title:'Novo artigo',seo_title:'Novo título SEO',seo_description:'Uma descrição',excerpt:'Resumo',content_html:'<p>Conteúdo publicado agora.</p><script>alert(1)</script><img src=x onerror=alert(1)>',image_url:'https://example.com/capa.webp',published_at:'2026-09-09T00:00:00Z',updated_at:'2026-09-09T01:00:00Z'};
it('renders fresh editorial title, image and safe content without client JavaScript',()=>{
 const html=renderPublishedPostSeo('<html><head><title>Home</title><meta property="og:image" content="home.jpg" /></head><body><div id="root"><div>Home</div></div></body></html>',row);
 expect(html).toContain('<h1>Novo artigo</h1>');expect(html).toContain('Conteúdo publicado agora.');expect(html).toContain('https://example.com/capa.webp');
 expect(html).not.toContain('onerror');expect(html).not.toContain('alert(1)');expect(html).toContain('BlogPosting');expect(html).toContain('ImageObject');expect(html).toContain('og:image:width');expect(html).toContain('article:published_time');expect(html).toContain('twitter:card');expect(html.match(/id="codigo5-schema"/g)).toHaveLength(1);
});
it('never interprets an injected title or closing script as markup',()=>{
 const html=renderPublishedPostSeo('<head><title>Home</title></head><body><div id="root"></div></body>',{...row,title:'</script><img src=x onerror=alert(1)>'});
 expect(html).not.toContain('</script><img');expect(html).toContain('\\u003c/script>');
});
it('returns a temporary unindexed status for unknown posts when D1 is unavailable',async()=>{
 const response=await onRequest({request:new Request('https://codigo5.com.br/blog/unknown'),env:{BOT_DB:{prepare:vi.fn(()=>{throw Error('offline');})}},next:async()=>new Response('<meta name="robots" content="index,follow" />',{headers:{'content-type':'text/html'}})} as never);
 expect(response.status).toBe(503);expect(response.headers.get('x-robots-tag')).toContain('noindex');
});
const dynamicContext = (route:string) => ({
 request:new Request(`https://codigo5.com.br${route}`),
 env:{BOT_DB:{prepare:(sql:string)=>{
   const all=async()=>({results:(sql.includes('FROM redirects') && !sql.includes('FROM posts'))?[]:[{...row,categories_json:'[{"slug":"tema-novo","name":"Tema novo"}]',tags_json:'[]'}]});
   return {all,bind:()=>({all})};
 }}},
 next:async()=>new Response('<head><title>Home</title><meta name="robots" content="index,follow" /><link rel="canonical" href="https://codigo5.com.br/" /></head><body><div id="root"><div>Home</div></div></body>',{headers:{'content-type':'text/html',etag:'old-static'}}),
});
it('serves a newly published category instead of returning a false 404',async()=>{
 const response=await onRequest(dynamicContext('/blog/categoria/tema-novo') as never);
 expect(response.status).toBe(200);expect(response.headers.get('x-robots-tag')).toBeNull();
 expect(response.headers.get('etag')).toBeNull();expect(response.headers.get('cache-control')).toBe('no-store');
 const html=await response.text();expect(html).toContain('<h1>Tema novo</h1>');expect(html).toContain('CollectionPage');expect(html).toContain('/blog/post-novo');
});
it('serves new post metadata through the actual middleware',async()=>{
 const response=await onRequest(dynamicContext('/blog/post-novo') as never);
 expect(response.status).toBe(200);const html=await response.text();
 expect(html).toContain('<title>Novo título SEO</title>');expect(html).toContain('href="https://codigo5.com.br/blog/post-novo"');expect(html).toContain('<h1>Novo artigo</h1>');
});
