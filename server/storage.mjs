import { DatabaseSync } from 'node:sqlite';

// Same synchronous D1 contract used by the existing Sync runtime on the Mini.
export class SqliteD1 {
  constructor(filename) {
    this.database = new DatabaseSync(filename, { enableForeignKeyConstraints: true });
    this.database.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;');
  }
  prepare(sql) {
    const db = this.database;
    const statement = (values = []) => ({
      bind: (...args) => statement(args),
      first: (column) => { const row = db.prepare(sql).get(...values); return row ? column ? row[column] ?? null : { ...row } : null; },
      all: () => ({ success: true, results: db.prepare(sql).all(...values).map(row => ({ ...row })) }),
      run: () => { const result = db.prepare(sql).run(...values); return { success: true, results: [], meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }; },
      execute: () => /^\s*(SELECT|PRAGMA|WITH)\b/i.test(sql) ? statement(values).all() : statement(values).run(),
    });
    return statement();
  }
  batch(statements) {
    this.database.exec('BEGIN IMMEDIATE');
    try { const results = statements.map(item => item.execute()); this.database.exec('COMMIT'); return results; }
    catch (error) { this.database.exec('ROLLBACK'); throw error; }
  }
  exec(sql) { this.database.exec(sql); return { count: 1, duration: 0 }; }
  close() { this.database.close(); }
}

export class SqliteKV {
  constructor(db) {
    this.db = db;
    db.exec('CREATE TABLE IF NOT EXISTS runtime_kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER)');
  }
  async get(key) {
    const row = this.db.prepare('SELECT value FROM runtime_kv WHERE key=? AND (expires_at IS NULL OR expires_at>?)').bind(key, Math.floor(Date.now()/1000)).first();
    return row?.value ?? null;
  }
  async put(key, value, options = {}) {
    const expiration = options.expiration ?? (options.expirationTtl ? Math.floor(Date.now()/1000) + options.expirationTtl : null);
    this.db.prepare('INSERT OR REPLACE INTO runtime_kv VALUES (?, ?, ?)').bind(key, value, expiration).run();
  }
  async delete(key) { this.db.prepare('DELETE FROM runtime_kv WHERE key=?').bind(key).run(); }
}
