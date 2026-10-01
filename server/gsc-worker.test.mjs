import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migrateGscQueue } from './gsc-queue.mjs';
import { processOne, deliverEvents, enqueueEvent, migrateEvents } from './gsc-worker.mjs';

function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec("CREATE TABLE posts(id TEXT PRIMARY KEY,slug TEXT,canonical_url TEXT,status TEXT,published_at TEXT);");
  migrateGscQueue(db, { portal: 'codigo5', origin: 'https://codigo5.com.br', enabled: true });
  db.prepare("INSERT INTO posts VALUES ('post1','artigo-real','https://codigo5.com.br/blog/artigo-real','published','2026-10-01T10:00:00Z')").run();
  return db;
}

test('timeout after GSC click stays unknown and a second pass never clicks again', async () => {
  const db = fixture(); let calls = 0;
  const config = { portal: 'codigo5', origin: 'https://codigo5.com.br', property: 'sc-domain:codigo5.com.br', profileDir: '/private/profile', maxAttempts: 3 };
  const deps = { preflight: async () => ({ ok: true }), request: async () => { calls++; return { status: 'delivery_unknown', clicked: true }; }, now: () => '2026-10-01T12:00:00.000Z' };
  const first = await processOne(db, config, deps);
  assert.equal(first.status, 'delivery_unknown');
  assert.equal(db.prepare('SELECT status FROM gsc_queue').get().status, 'delivery_unknown');
  assert.equal(await processOne(db, config, deps), null);
  assert.equal(calls, 1);
  db.close();
});

test('preflight block prevents browser request and leaves a visible reason', async () => {
  const db = fixture(); let calls = 0;
  const config = { portal: 'codigo5', origin: 'https://codigo5.com.br', property: 'sc-domain:codigo5.com.br', profileDir: '/private/profile', maxAttempts: 3 };
  const result = await processOne(db, config, {
    preflight: async () => ({ ok: false, code: 'article_invalid' }),
    request: async () => { calls++; return { status: 'requested' }; },
    now: () => '2026-10-01T12:00:00.000Z',
  });
  assert.equal(result.status, 'blocked');
  assert.equal(db.prepare('SELECT error_code FROM gsc_queue').get().error_code, 'article_invalid');
  assert.equal(calls, 0);
  db.close();
});

test('expired session, challenge and quota park the job without resending', async () => {
  for (const state of ['login_required', 'captcha_required', 'quota_exceeded']) {
    const db = fixture(); let calls = 0;
    const config = { portal: 'codigo5', origin: 'https://codigo5.com.br', property: 'sc-domain:codigo5.com.br', profileDir: '/private/profile', maxAttempts: 3 };
    await processOne(db, config, { preflight: async () => ({ ok: true }), request: async () => { calls++; return { status: state, clicked: false }; }, now: () => '2026-10-01T12:00:00.000Z' });
    assert.equal(db.prepare('SELECT status FROM gsc_queue').get().status, state);
    assert.equal(await processOne(db, config, { preflight: async () => ({ ok: true }), request: async () => { calls++; }, now: () => '2026-10-01T12:00:00.000Z' }), null);
    assert.equal(calls, 1);
    db.close();
  }
});

test('callback requires an ACK; a timeout remains unknown without blind resend', async () => {
  const db = fixture(); migrateEvents(db);
  enqueueEvent(db, { id: 'job1', url: 'https://codigo5.com.br/blog/artigo-real' }, 'worker_down');
  const config = { callbackUrl: 'https://codigo5.com.br/api/integrations/gsc/events', callbackToken: 'test-token' };
  let calls = 0;
  await deliverEvents(db, config, { request: async () => { calls++; return Response.json({ ok: true, state: 'sent' }); }, now: () => '2026-10-01T12:00:00.000Z' });
  assert.equal(db.prepare("SELECT state FROM gsc_events WHERE id='job1:worker_down'").get().state, 'acked');
  enqueueEvent(db, { id: 'job2', url: 'https://codigo5.com.br/blog/artigo-real' }, 'delivery_unknown');
  await deliverEvents(db, config, { request: async () => { calls++; throw new Error('timeout'); }, now: () => '2026-10-01T12:00:00.000Z' });
  assert.equal(db.prepare("SELECT state FROM gsc_events WHERE id='job2:delivery_unknown'").get().state, 'delivery_unknown');
  await deliverEvents(db, config, { request: async () => { calls++; }, now: () => '2026-10-01T12:00:00.000Z' });
  assert.equal(calls, 2);
  db.close();
});

test('an existing GSC request is recognized without inventing a new request time', async () => {
  const db = fixture();
  const config = { portal: 'codigo5', origin: 'https://codigo5.com.br', property: 'sc-domain:codigo5.com.br', profileDir: '/private/profile', maxAttempts: 3 };
  const result = await processOne(db, config, { preflight: async () => ({ ok: true }), request: async () => ({ status: 'already_requested', clicked: false }), now: () => '2026-10-01T12:00:00.000Z' });
  assert.equal(result.status, 'requested');
  const row = db.prepare('SELECT error_code,requested_at FROM gsc_queue').get();
  assert.equal(row.error_code, 'already_requested');
  assert.equal(row.requested_at, null);
  db.close();
});
