import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync, readFileSync } from 'node:fs';
import { handleSyncArticle, migrateSync } from './sync-integration.mjs';

test('Sync import preserves existing content and is idempotent with scoped publication', async()=>{
 const db=new DatabaseSync(':memory:');for(const f of readdirSync('migrations').sort())db.exec(readFileSync('migrations/'+f,'utf8'));migrateSync(db);
 const env={COD5_SYNC_DRAFT_TOKEN:'draft-secret',COD5_SYNC_PUBLISH_TOKEN:'publish-secret',DO_SPACES_BUCKET:'cdn-codigo5',DO_SPACES_REGION:'sfo2'};
 const body={externalId:'radar-1',revision:1,title:'Atendimento na empresa',slug:'atendimento-na-empresa',excerpt:'Como organizar o atendimento.',seoTitle:'Atendimento com IA para empresas',seoDescription:'Guia para organizar atendimento de empresas.',contentHtml:'<p>Uma orientação útil para organizar o atendimento da sua empresa.</p>',sourceUrl:'https://example.com/noticia',imageUrl:'https://cdn-codigo5.sfo2.digitaloceanspaces.com/capa.webp',categories:[{slug:'marketing-digital',name:'Marketing Digital'}],tags:[{slug:'automacao',name:'Automação'}]};
 const req=(b,token='draft-secret')=>handleSyncArticle(new Request('https://codigo5.com.br/api/integrations/sync/articles',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(b)}),db,env,new Set());
 assert.equal((await req(body,'wrong')).status,401);
 assert.equal((await req({...body,action:'publish'})).status,403);
 const first=await req(body);assert.equal(first.status,200);const a=await first.json();assert.equal(a.status,'draft');assert.equal(db.prepare('SELECT seo_title FROM drafts WHERE id=?').get(a.id).seo_title,body.seoTitle);
 assert.equal((await req(body)).status,200);assert.equal(db.prepare('SELECT count(*) n FROM drafts').get().n,1);
 assert.equal((await req({...body,title:'Changed same revision'})).status,409);
 assert.equal((await req({...body,externalId:'other'})).status,409);
 assert.equal((await req({...body,externalId:'bad',slug:'bad',contentHtml:'<img src=x onerror=alert(1)>'})).status,400);
 mock.method(globalThis,'fetch',async()=>new Response(null,{headers:{'content-type':'image/webp'}}));
 const pub=await req({...body,action:'publish'},'publish-secret');assert.equal(pub.status,200);assert.equal((await pub.json()).status,'published');
 const stamp=db.prepare('SELECT published_at FROM posts').get().published_at;assert.equal((await req({...body,action:'publish'},'publish-secret')).status,200);assert.equal(db.prepare('SELECT published_at FROM posts').get().published_at,stamp);
 db.prepare("UPDATE drafts SET title='Human edit' WHERE id=?").run(a.id);
 assert.equal((await req({...body,revision:2})).status,409);assert.equal(db.prepare('SELECT title FROM drafts').get().title,'Human edit');
 const read=await handleSyncArticle(new Request('https://codigo5.com.br/api/integrations/sync/articles?externalId=radar-1',{headers:{authorization:'Bearer draft-secret'}}),db,env,new Set());assert.equal(read.status,200);assert.equal((await read.json()).imageUrl,body.imageUrl);
 mock.restoreAll();db.close();
});
