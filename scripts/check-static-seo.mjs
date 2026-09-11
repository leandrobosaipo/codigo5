import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import posts from '../src/content/blog-posts.json' with {type:'json'};
const files = fs.readdirSync('dist', {recursive:true}).filter(f=>f.endsWith('.html'));
for (const file of files) {
 const document = new JSDOM(fs.readFileSync(path.join('dist',file),'utf8')).window.document;
 const route = file === 'index.html' ? '/' : '/'+file.replace(/\.html$/,'');
 const robots=document.querySelectorAll('meta[name="robots"]');
 assert.equal(robots.length,1,route+' robots count');
 assert.equal(/\bnoindex\b/i.test(robots[0].content),route.startsWith('/blog/tag/'),route+' indexability');
 assert.equal(document.querySelectorAll('h1').length,1,route+' h1');
 assert.equal(document.querySelectorAll('link[rel="canonical"]').length,1,route+' canonical count');
 assert.equal(document.querySelector('link[rel="canonical"]').href,'https://codigo5.com.br'+route,route+' canonical');
 assert.ok(document.querySelector('main').textContent.length>200,route+' content');
 assert.equal(document.querySelectorAll('#codigo5-schema').length,1,route+' schema');
 JSON.parse(document.querySelector('#codigo5-schema').textContent);
 const image=document.querySelector('meta[property="og:image"]').content;
 assert.equal(document.querySelector('meta[name="twitter:image"]').content,image);
 assert.ok(image.startsWith('https://'),route+' absolute image');
 for(const img of document.images) if(img.getAttribute('src')?.startsWith('/assets/')) assert.ok(fs.existsSync('dist'+img.getAttribute('src')),route+' missing '+img.getAttribute('src'));
 const post=posts.find(p=>route==='/blog/'+p.slug);
 if(post) assert.equal(image,post.image,route+' featured image');
 if(image.includes('/social/')) {
   assert.ok(fs.existsSync('dist'+new URL(image).pathname),route+' cover file');
   assert.equal(document.querySelector('meta[property="og:image:width"]').content,'1200');
 }
}
assert.ok(files.length>=38);
console.log(`SEO estático validado: ${files.length} páginas, ${posts.length} imagens de destaque, conteúdo e schema no HTML.`);
