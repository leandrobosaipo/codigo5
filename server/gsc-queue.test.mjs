import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { claimNext, migrateGscQueue, recoverInterrupted, setRequestStatus } from './gsc-queue.mjs';

const origin = 'https://codigo5.com.br';
function setup(options = {}) {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE posts (
    id TEXT PRIMARY KEY, slug TEXT NOT NULL, status TEXT NOT NULL,
    canonical_url TEXT, published_at TEXT
  )`);
  migrateGscQueue(db, { portal: 'codigo5', origin, enabled: true, ...options });
  return db;
}
function insertPost(db, {id, slug=id, status='published', url=null, publishedAt='2026-10-01T10:00:00Z'}) {
  db.prepare('INSERT INTO posts(id,slug,status,canonical_url,published_at) VALUES(?,?,?,?,?)')
    .run(id, slug, status, url, publishedAt);
}

test('config validates, creates durable queue, and does not backfill history', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE posts (id TEXT PRIMARY KEY, slug TEXT, status TEXT, canonical_url TEXT, published_at TEXT)`);
  insertPost(db, {id:'old'});
  assert.throws(() => migrateGscQueue(db, {portal:'',origin,enabled:true}), /portal/i);
  assert.throws(() => migrateGscQueue(db, {portal:'codigo5',origin:'http://codigo5.com.br',enabled:true}), /origin/i);
  migrateGscQueue(db, {portal:'codigo5',origin,enabled:true});
  assert.equal(db.prepare('SELECT count(*) AS n FROM gsc_queue').get().n, 0);
  assert.deepEqual({...db.prepare('SELECT portal,origin,enabled FROM gsc_queue_config').get()}, {portal:'codigo5',origin,enabled:1});
  db.close();
});

test('publication triggers enqueue inserts and draft-to-published updates once per portal URL', () => {
  const db = setup();
  insertPost(db, {id:'inserted',url:'https://codigo5.com.br/blog/inserted'});
  insertPost(db, {id:'draft',status:'draft',url:'https://codigo5.com.br/blog/from-draft'});
  db.prepare("UPDATE posts SET status='published' WHERE id='draft'").run();
  db.prepare("UPDATE posts SET status='published' WHERE id='draft'").run();
  insertPost(db, {id:'duplicate',slug:'other-id',url:'https://codigo5.com.br/blog/inserted',publishedAt:'2026-10-02T10:00:00Z'});
  const rows = db.prepare('SELECT url,status FROM gsc_queue ORDER BY url').all().map(row => ({...row}));
  assert.deepEqual(rows, [
    {url:'https://codigo5.com.br/blog/from-draft',status:'pending'},
    {url:'https://codigo5.com.br/blog/inserted',status:'pending'},
  ]);
  db.close();
});

test('queue writes roll back with the publishing transaction', () => {
  const db = setup();
  db.exec('BEGIN');
  insertPost(db, {id:'rolled-back'});
  db.exec('ROLLBACK');
  assert.equal(db.prepare('SELECT count(*) AS n FROM gsc_queue').get().n, 0);
  db.close();
});

test('one worker claims due rows, retries are bounded, and terminal outcomes cannot be changed', () => {
  const db = setup();
  insertPost(db, {id:'first'});
  const first = claimNext(db, 'worker-a', '2026-10-01T11:00:00Z', 2);
  assert.equal(first.status, 'in_progress');
  assert.equal(first.attempts, 1);
  assert.equal(claimNext(db, 'worker-b', '2026-10-01T11:00:00Z', 2), null);
  assert.equal(setRequestStatus(db, first.id, 'worker-b', 'requested', {requestedAt:'2026-10-01T11:01:00Z'}), false);
  assert.equal(setRequestStatus(db, first.id, 'worker-a', 'retry', {nextAttemptAt:'2026-10-01T12:00:00Z',errorCode:'timeout'}), true);
  assert.equal(claimNext(db, 'worker-a', '2026-10-01T11:59:59Z', 2), null);
  const second = claimNext(db, 'worker-a', '2026-10-01T12:00:00Z', 2);
  assert.equal(second.attempts, 2);
  assert.equal(setRequestStatus(db, second.id, 'worker-a', 'retry', {nextAttemptAt:'2026-10-01T13:00:00Z'}), true);
  assert.equal(claimNext(db, 'worker-a', '2026-10-01T14:00:00Z', 2), null);
  assert.equal(db.prepare('SELECT status FROM gsc_queue').get().status, 'blocked');
  db.close();
});

test('migration preserves active claims; explicit recovery marks interrupted work unknown without resending', () => {
  const db = setup();
  insertPost(db, {id:'interrupted'});
  const claimed = claimNext(db, 'worker-a', '2026-10-01T11:00:00Z', 3);
  migrateGscQueue(db, {portal:'codigo5',origin,enabled:true});
  assert.equal(db.prepare('SELECT status FROM gsc_queue WHERE id=?').get(claimed.id).status, 'in_progress');
  assert.equal(claimNext(db, 'worker-b', '2026-10-01T11:30:00Z', 3), null);
  assert.equal(recoverInterrupted(db, 'codigo5'), 1);
  assert.equal(db.prepare('SELECT status FROM gsc_queue WHERE id=?').get(claimed.id).status, 'delivery_unknown');
  assert.equal(claimNext(db, 'worker-b', '2026-10-01T12:00:00Z', 3), null);
  assert.equal(setRequestStatus(db, claimed.id, 'worker-a', 'retry', {nextAttemptAt:'2026-10-01T13:00:00Z'}), false);
  db.close();
});
