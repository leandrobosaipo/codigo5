const statuses = new Set([
  'requested', 'retry', 'delivery_unknown', 'login_required', 'captcha_required',
  'quota_exceeded', 'layout_changed', 'blocked',
]);

function validateConfig({ portal, origin, enabled }) {
  if (typeof portal !== 'string' || !portal.trim() || portal.length > 100) throw new TypeError('Invalid portal');
  let parsed;
  try { parsed = new URL(origin); } catch { throw new TypeError('Invalid origin'); }
  if (parsed.protocol !== 'https:' || parsed.origin !== origin || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new TypeError('Invalid origin');
  }
  if (typeof enabled !== 'boolean') throw new TypeError('Invalid enabled flag');
  return { portal: portal.trim(), origin, enabled: Number(enabled) };
}

function validDate(value) {
  return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value));
}

export function migrateGscQueue(db, config) {
  const { portal, origin, enabled } = validateConfig(config);
  db.exec(`
    CREATE TABLE IF NOT EXISTS gsc_queue_config (
      portal TEXT PRIMARY KEY,
      origin TEXT NOT NULL,
      enabled INTEGER NOT NULL CHECK (enabled IN (0, 1))
    );
    CREATE TABLE IF NOT EXISTS gsc_queue (
      id TEXT PRIMARY KEY,
      portal TEXT NOT NULL,
      origin TEXT NOT NULL,
      url TEXT NOT NULL,
      published_at TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending','in_progress','requested','retry','delivery_unknown','login_required','captcha_required','quota_exceeded','layout_changed','blocked')),
      attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
      owner TEXT,
      error_code TEXT,
      next_attempt_at TEXT,
      requested_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (portal, url, published_at)
    );
    CREATE INDEX IF NOT EXISTS idx_gsc_queue_claim ON gsc_queue(status, next_attempt_at, created_at);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_gsc_queue_url ON gsc_queue(portal, url);
    CREATE TRIGGER IF NOT EXISTS gsc_queue_after_published_insert
    AFTER INSERT ON posts WHEN NEW.status='published'
    BEGIN
      INSERT OR IGNORE INTO gsc_queue(id,portal,origin,url,published_at,status,created_at,updated_at)
      SELECT lower(hex(randomblob(16))), portal, origin,
        COALESCE(NULLIF(NEW.canonical_url,''), origin || '/blog/' || NEW.slug),
        COALESCE(NEW.published_at, CURRENT_TIMESTAMP), 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM gsc_queue_config WHERE enabled=1;
    END;
    CREATE TRIGGER IF NOT EXISTS gsc_queue_after_draft_published
    AFTER UPDATE OF status ON posts WHEN OLD.status<>'published' AND NEW.status='published'
    BEGIN
      INSERT OR IGNORE INTO gsc_queue(id,portal,origin,url,published_at,status,created_at,updated_at)
      SELECT lower(hex(randomblob(16))), portal, origin,
        COALESCE(NULLIF(NEW.canonical_url,''), origin || '/blog/' || NEW.slug),
        COALESCE(NEW.published_at, CURRENT_TIMESTAMP), 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM gsc_queue_config WHERE enabled=1;
    END;
  `);
  db.prepare(`INSERT INTO gsc_queue_config(portal, origin, enabled) VALUES (?, ?, ?)
    ON CONFLICT(portal) DO UPDATE SET origin=excluded.origin, enabled=excluded.enabled`).run(portal, origin, enabled);
  return { portal, origin, enabled: Boolean(enabled) };
}

// Caller must hold the worker's exclusive persistent flock before recovery.
export function recoverInterrupted(db, portal) {
  if (typeof portal !== 'string' || !portal.trim()) throw new TypeError('Invalid portal');
  const result = db.prepare(`UPDATE gsc_queue SET status='delivery_unknown', owner=NULL,
    error_code='process_interrupted', updated_at=CURRENT_TIMESTAMP
    WHERE portal=? AND status='in_progress'`).run(portal.trim());
  return Number(result.changes);
}

export function claimNext(db, owner, now, maxAttempts) {
  if (typeof owner !== 'string' || !owner.trim()) throw new TypeError('Invalid owner');
  if (!validDate(now)) throw new TypeError('Invalid now timestamp');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) throw new TypeError('Invalid maxAttempts');
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare(`UPDATE gsc_queue SET status='blocked', owner=NULL, error_code='max_attempts', updated_at=?
      WHERE status IN ('pending','retry') AND attempts>=? AND (next_attempt_at IS NULL OR next_attempt_at<=?)`).run(now, maxAttempts, now);
    if (db.prepare("SELECT 1 FROM gsc_queue WHERE status='in_progress' LIMIT 1").get()) {
      db.exec('COMMIT');
      return null;
    }
    const candidate = db.prepare(`SELECT q.id FROM gsc_queue q
      JOIN gsc_queue_config c ON c.portal=q.portal AND c.enabled=1
      WHERE q.status IN ('pending','retry') AND q.attempts<?
        AND (q.next_attempt_at IS NULL OR q.next_attempt_at<=?)
      ORDER BY q.created_at, q.id LIMIT 1`).get(maxAttempts, now);
    if (!candidate) {
      db.exec('COMMIT');
      return null;
    }
    db.prepare(`UPDATE gsc_queue SET status='in_progress', owner=?, attempts=attempts+1,
      error_code=NULL, next_attempt_at=NULL, updated_at=? WHERE id=?`).run(owner.trim(), now, candidate.id);
    const claimed = db.prepare('SELECT * FROM gsc_queue WHERE id=?').get(candidate.id);
    db.exec('COMMIT');
    return claimed;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function setRequestStatus(db, id, owner, status, { errorCode = null, nextAttemptAt = null, requestedAt = null } = {}) {
  if (!statuses.has(status)) throw new TypeError('Invalid request status');
  if (typeof id !== 'string' || !id || typeof owner !== 'string' || !owner.trim()) throw new TypeError('Invalid queue ownership');
  if (status === 'retry' && !validDate(nextAttemptAt)) throw new TypeError('retry requires nextAttemptAt');
  if (requestedAt !== null && !validDate(requestedAt)) throw new TypeError('Invalid requestedAt');
  if (nextAttemptAt !== null && status !== 'retry') throw new TypeError('nextAttemptAt is only valid for retry');
  if (errorCode !== null && (typeof errorCode !== 'string' || errorCode.length > 160)) throw new TypeError('Invalid errorCode');
  const result = db.prepare(`UPDATE gsc_queue SET status=?, owner=NULL, error_code=?, next_attempt_at=?,
    requested_at=CASE WHEN ?='requested' THEN ? ELSE requested_at END, updated_at=COALESCE(?, CURRENT_TIMESTAMP)
    WHERE id=? AND owner=? AND status='in_progress'`).run(
    status, errorCode, nextAttemptAt, status, requestedAt, requestedAt ?? nextAttemptAt, id, owner.trim(),
  );
  return Number(result.changes) === 1;
}
