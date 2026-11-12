import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { migrateEvidence, sendEvidence } from './gsc-whatsapp.mjs';

for (const lostReceipt of [false, true]) test('evidence then standalone URL, lost receipt=' + lostReceipt, async () => {
  const db = new DatabaseSync(':memory:');
  migrateEvidence(db);
  const url = 'https://codigo5.com.br/blog/teste';
  db.prepare('INSERT INTO gsc_whatsapp(job_id,url,file) VALUES(?,?,?)').run('job', url, fileURLToPath(import.meta.url));
  const number = '123456789012345@g.us';
  const env = { CODIGO5_REVIEW_GROUP_JID: number, CODIGO5_EVOLUTION_INSTANCE: 'fixture', CODIGO5_EVOLUTION_URL: 'https://example.test' };
  const sent = [];
  const mock = async (path, opts) => {
    if (path.includes('/instance/')) return Response.json({ instance: { state: 'open' } });
    if (path.includes('/group/')) return Response.json({ id:number, subject:'Código5 Web', announce:false });
    const body = JSON.parse(opts.body);
    assert.equal(body.number, number);
    sent.push(body);
    if (lostReceipt) throw new Error('Response lost after send');
    return Response.json({ key:{ id:'receipt-' + sent.length, remoteJid:number } });
  };
  await sendEvidence(db, env, mock);
  await sendEvidence(db, env, mock);
  assert.equal(sent.length, lostReceipt ? 1 : 2);
  assert.equal(sent[0].mediatype, 'image');
  if (!lostReceipt) assert.deepEqual(sent[1], {number, text:url, linkPreview:true});
  assert.equal(db.prepare('SELECT image_state FROM gsc_whatsapp').get().image_state, lostReceipt ? 'delivery_unknown' : 'accepted');
  db.close();
});
