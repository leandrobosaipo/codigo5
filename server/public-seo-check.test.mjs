import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {audit, checkPage, sitemapUrls} from '../scripts/check-public-seo.mjs';
const url='https://example.test/blog/new';
const html=`<html><head><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"></head><body><main><h1>New post</h1>${'Public article content. '.repeat(20)}</main></body></html>`;
const response=(body=html, status=200, headers={})=>new Response(body,{status,headers:{'content-type':'text/html',...headers}});
test('public audit checks original HTML and rejects redirects, blocks, missing content and invalid sitemap entries',async()=>{
 checkPage(url,response(),html);
 for(const bad of [response('',301),response('',503),response(html,200,{'x-robots-tag':'noindex'})]) assert.throws(()=>checkPage(url,bad,html));
 for(const bad of [html.replace('index,follow','noindex,follow'),html.replace(url,'https://example.test/'),html.replace('<main>','<div>').replace('</main>','</div>')])assert.throws(()=>checkPage(url,response(),bad));
 const xml=`<urlset><url><loc>${url}</loc><lastmod>2026-09-17</lastmod></url></urlset>`;
 assert.throws(()=>sitemapUrls(xml.replace('2026-09-17','2026-02-30'),'https://example.test/sitemap.xml'));
 assert.throws(()=>sitemapUrls(xml.replace('</urlset>',`<url><loc>${url}</loc></url></urlset>`),'https://example.test/sitemap.xml'));
 const result=await audit('https://example.test/sitemap.xml',async(target, options)=>{
  assert.equal(options.redirect,'manual');return target.endsWith('.xml')?response(xml,200,{'content-type':'application/xml'}):response();
 });assert.equal(result.checked,1);
});

test('build sitemap excludes static redirects including wildcard sources',()=>{
 const directory=mkdtempSync(join(tmpdir(),'cod5-sitemap-'));
 try {
  mkdirSync(join(directory,'dist'));
  writeFileSync(join(directory,'dist/_redirects'),'/blog/microinteracoes-que-convertem /blog 301\n/blog/categoria/* /blog 302\n/* /index.html 200\n');
  execFileSync(process.execPath,[resolve('scripts/generate-sitemap.mjs')],{cwd:directory});
  const xml=readFileSync(join(directory,'dist/sitemap.xml'),'utf8');
  assert.ok(!xml.includes('/blog/microinteracoes-que-convertem'));
  assert.ok(!xml.includes('/blog/categoria/'));
  assert.ok(xml.includes('<loc>https://codigo5.com.br/blog</loc>'));
 } finally {rmSync(directory,{recursive:true,force:true});}
});
