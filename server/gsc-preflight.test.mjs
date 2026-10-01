import assert from 'node:assert/strict';
import {test} from 'node:test';
import {preflightArticle} from './gsc-preflight.mjs';

const origin='https://codigo5.com.br';
const article=`${origin}/blog/sample`;
const html=`<html><head><meta name="robots" content="index,follow"><link rel="canonical" href="${article}"></head><body><main><h1>Sample article</h1>${'Public article content. '.repeat(20)}</main></body></html>`;
const response=(body,status=200,headers={'content-type':'text/html'})=>new Response(body,{status,headers});
const sitemap=`<urlset><url><loc>${article}</loc></url></urlset>`;
const robots='User-agent: *\nAllow: /blog/';
const requester=(overrides={})=>async(url,options)=>{
 assert.equal(new URL(url).origin,origin,'preflight attempted an external request');
 assert.equal(options.redirect,'manual');
 if(url===article)return overrides.article||response(html);
 if(url===`${origin}/sitemap.xml`)return overrides.sitemap||response(sitemap,200,{'content-type':'application/xml'});
 if(url===`${origin}/robots.txt`)return overrides.robots||response(robots,200,{'content-type':'text/plain'});
 throw new Error(`Unexpected URL: ${url}`);
};

test('preflight accepts an indexable article listed in same-origin sitemap and allowed by robots',async()=>{
 assert.deepEqual(await preflightArticle(article,{origin,request:requester()}),{ok:true});
});

test('preflight rejects URLs outside the exact public article origin before fetching',async()=>{
 for(const url of ['http://codigo5.com.br/blog/sample','https://evil.test/blog/sample','https://127.0.0.1/blog/sample','https://codigo5.com.br.evil.test/blog/sample',`${origin}/blog/sample?x=1`,`${origin}/blog/sample#part`,`${origin}/blog/sample/extra`,`${origin}/blog/sample@evil.test`]){
  let calls=0;
  const result=await preflightArticle(url,{origin,request:async()=>{calls++;throw new Error('must not fetch');}});
  assert.equal(result.ok,false,url);
  assert.equal(calls,0,url);
 }
});

test('preflight rejects canonical mismatch and noindex',async()=>{
 for(const bad of [html.replace(article,`${origin}/blog/other`),html.replace('index,follow','noindex,follow')]){
  const result=await preflightArticle(article,{origin,request:requester({article:response(bad)})});
  assert.deepEqual(result,{ok:false,code:'article_invalid'});
 }
});

test('preflight fails closed when sitemap fetch fails or omits article',async()=>{
 assert.deepEqual(await preflightArticle(article,{origin,request:requester({sitemap:response('',503)})}),{ok:false,code:'sitemap_unavailable'});
 assert.deepEqual(await preflightArticle(article,{origin,request:requester({sitemap:response('<urlset><url><loc>https://codigo5.com.br/blog/another</loc></url></urlset>',200,{'content-type':'application/xml'})})}),{ok:false,code:'sitemap_missing_article'});
});

test('preflight rejects robots disallow and allows explicit path allow',async()=>{
 const blocked=await preflightArticle(article,{origin,request:requester({robots:response('User-agent: *\nDisallow: /blog/')})});
 assert.deepEqual(blocked,{ok:false,code:'robots_disallow'});
 const allowed=await preflightArticle(article,{origin,request:requester({robots:response('User-agent: *\nDisallow: /\nAllow: /blog/')})});
 assert.deepEqual(allowed,{ok:true});
});
