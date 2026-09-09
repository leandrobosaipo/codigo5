import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SqliteD1, SqliteKV } from './storage.mjs';

test('D1 compatibility preserves rows across restart and rolls back failed batches', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cod5-storage-'));
  try {
    let db = new SqliteD1(join(dir, 'test.sqlite'));
    db.exec('CREATE TABLE posts (id TEXT PRIMARY KEY, title TEXT NOT NULL)');
    await db.prepare('INSERT INTO posts VALUES (?, ?)').bind('one', 'Primeiro').run();
    assert.throws(() => db.batch([
      db.prepare('INSERT INTO posts VALUES (?, ?)').bind('two', 'Segundo'),
      db.prepare('INSERT INTO posts VALUES (?, ?)').bind('one', 'Duplicado'),
    ]));
    db.close(); db = new SqliteD1(join(dir, 'test.sqlite'));
    assert.equal(await db.prepare('SELECT count(*) AS total FROM posts').first('total'), 1);
    assert.equal((await db.prepare('SELECT * FROM posts').all()).results[0].title, 'Primeiro');
    db.close();
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('KV preserves sessions, expiration and deletion', async () => {
  const db = new SqliteD1(':memory:');
  const kv = new SqliteKV(db);
  await kv.put('admin-session:example', 'session', { expirationTtl: 60 });
  assert.equal(await kv.get('admin-session:example'), 'session');
  db.exec('UPDATE runtime_kv SET expires_at = 1');
  assert.equal(await kv.get('admin-session:example'), null);
  await kv.put('temporary', 'value'); await kv.delete('temporary');
  assert.equal(await kv.get('temporary'), null);
  db.close();
});
