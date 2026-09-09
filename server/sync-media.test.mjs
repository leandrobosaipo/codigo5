import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handleSyncMedia} from './sync-media.mjs';
test('media rejects unauthorized and disguised content and uses stable hash keys',async()=>{
 const env={COD5_SYNC_DRAFT_TOKEN:'test-secret'};const keys=[];
 const run=(body,type='image/png',token='test-secret')=>handleSyncMedia(new Request('https://codigo5.com.br/api/integrations/sync/media',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':type},body}),env,async key=>{keys.push(key);return 'https://cdn.invalid/'+key;});
 assert.equal((await run('invalid','image/png','wrong')).status,401);
 assert.equal((await run('<script>alert(1)</script>')).status,400);
 const sample=Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]);assert.equal((await run(sample)).status,200);assert.equal((await run(sample)).status,200);assert.equal(keys[0],keys[1]);
});
