import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { claimNext, migrateGscQueue, recoverInterrupted, setRequestStatus } from './gsc-queue.mjs';
import { preflightArticle } from './gsc-preflight.mjs';
import { requestViaGsc } from './gsc-browser.mjs';

const alertStates = new Set(['login_required', 'captcha_required', 'quota_exceeded', 'layout_changed', 'delivery_unknown', 'blocked', 'requested']);
const transientPreflight = new Set(['request_failed', 'sitemap_unavailable', 'robots_unavailable']);

function nextRetry(now, attempts) {
  return new Date(Date.parse(now) + Math.min(60 * 2 ** (attempts - 1), 360) * 1000).toISOString();
}

export async function processOne(db, config, { preflight = preflightArticle, request = requestViaGsc, now = () => new Date().toISOString() } = {}) {
  const owner = randomUUID();
  const job = claimNext(db, owner, now(), config.maxAttempts);
  if (!job) return null;
  let status, errorCode = null;
  try {
    const checked = await preflight(job.url, { origin: job.origin });
    if (!checked.ok) {
      errorCode = checked.code;
      status = transientPreflight.has(checked.code) && job.attempts < config.maxAttempts ? 'retry' : 'blocked';
    } else {
      const result = await request({ url: job.url, property: config.property, profileDir: config.profileDir, headless: config.headless !== false, executablePath: config.executablePath });
      status = result.status === 'already_requested' ? 'requested' : result.status === 'already_indexed' ? 'blocked' : result.status;
      if (result.status === 'already_requested' || result.status === 'already_indexed') errorCode = result.status;
      if (status === 'retry' && job.attempts >= config.maxAttempts) { status = 'blocked'; errorCode = 'max_attempts'; }
    }
  } catch {
    status = 'delivery_unknown'; // A thrown browser error may have happened after the click.
    errorCode = 'unexpected_failure';
  }
  db.exec('BEGIN IMMEDIATE');
  try {
    if (!setRequestStatus(db, job.id, owner, status, {
      errorCode,
      nextAttemptAt: status === 'retry' ? nextRetry(now(), job.attempts) : null,
      requestedAt: status === 'requested' && errorCode !== 'already_requested' ? now() : null,
    })) throw new Error('Queue ownership lost; inspect job before another attempt');
    if (alertStates.has(status)) enqueueEvent(db, job, status, errorCode);
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
  return { id: job.id, url: job.url, status, errorCode };
}

export function migrateEvents(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS gsc_events (
    id TEXT PRIMARY KEY, job_id TEXT, status TEXT NOT NULL, url TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('pending','sending','acked','failed','delivery_unknown')),
    attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT, ack TEXT, created_at TEXT NOT NULL
  )`);
}

export function enqueueEvent(db, job, status, code = null) {
  migrateEvents(db);
  const id = `${job.id}:${status}`;
  db.prepare("INSERT OR IGNORE INTO gsc_events(id,job_id,status,url,state,created_at,ack) VALUES (?,?,?,?,'pending',CURRENT_TIMESTAMP,?)")
    .run(id, job.id, status, job.url, code);
  return id;
}

export async function deliverEvents(db, config, { request = fetch, now = () => new Date().toISOString() } = {}) {
  if (!config.callbackUrl || !config.callbackToken) return 0;
  const target = new URL(config.callbackUrl);
  if (target.protocol !== 'https:' || target.username || target.password || target.hash) throw new Error('Invalid callback URL');
  const due = db.prepare("SELECT * FROM gsc_events WHERE state IN ('pending','failed') AND attempts<3 AND (next_attempt_at IS NULL OR next_attempt_at<=?) ORDER BY created_at LIMIT 5").all(now());
  for (const event of due) {
    db.prepare("UPDATE gsc_events SET state='sending',attempts=attempts+1 WHERE id=?").run(event.id);
    try {
      const response = await request(config.callbackUrl, {
        method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${config.callbackToken}` },
        body: JSON.stringify({ eventId: event.id, jobId: event.job_id, status: event.status, url: event.url }),
        signal: AbortSignal.timeout(10000),
      });
      const ack = await response.json().catch(() => null);
      if (response.ok && ack?.ok === true && ['sent', 'duplicate'].includes(ack.state)) {
        db.prepare("UPDATE gsc_events SET state='acked',ack=? WHERE id=?").run(ack.state, event.id);
      } else if (response.status >= 400) {
        db.prepare("UPDATE gsc_events SET state='failed',next_attempt_at=? WHERE id=?").run(nextRetry(now(), event.attempts + 1), event.id);
      } else {
        db.prepare("UPDATE gsc_events SET state='delivery_unknown' WHERE id=?").run(event.id);
      }
    } catch {
      db.prepare("UPDATE gsc_events SET state='delivery_unknown' WHERE id=?").run(event.id);
    }
  }
  return due.length;
}

function readConfig(env = process.env) {
  const config = {
    portal: env.COD5_GSC_PORTAL, origin: env.COD5_GSC_ORIGIN, property: env.COD5_GSC_PROPERTY,
    profileDir: env.COD5_GSC_PROFILE_DIR, headless: true, executablePath: env.COD5_GSC_BROWSER_EXECUTABLE || undefined,
    callbackUrl: env.COD5_GSC_CALLBACK_URL, callbackToken: env.COD5_GSC_CALLBACK_TOKEN,
    maxAttempts: Number(env.COD5_GSC_MAX_ATTEMPTS || 3),
  };
  if (!config.property || !config.profileDir || !Number.isInteger(config.maxAttempts) || config.maxAttempts < 1 || config.maxAttempts > 5) throw new Error('Invalid GSC worker configuration');
  return config;
}

async function main() {
  const command = process.argv[2] || 'run';
  const config = readConfig();
  const db = new DatabaseSync(process.env.COD5_DATABASE_FILE || '/data/editorial.sqlite');
  db.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
  migrateGscQueue(db, { portal: config.portal, origin: config.origin, enabled: true });
  migrateEvents(db);
  if (command === 'enqueue') {
    const url = process.argv[3];
    const parsed = new URL(url);
    if (parsed.origin !== config.origin || !/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsed.pathname) || parsed.search || parsed.hash) throw new Error('Only an exact configured article URL can be enqueued');
    const post = db.prepare("SELECT id,published_at FROM posts WHERE canonical_url=? AND status='published' LIMIT 1").get(url);
    if (!post?.published_at) throw new Error('Published article not found');
    db.prepare("INSERT OR IGNORE INTO gsc_queue(id,portal,origin,url,published_at,status,created_at,updated_at) VALUES (?,?,?,?,?,'pending',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)")
      .run(randomUUID(), config.portal, config.origin, url, post.published_at);
    const job = db.prepare('SELECT id,status FROM gsc_queue WHERE portal=? AND url=? AND published_at=?').get(config.portal, url, post.published_at);
    console.log(JSON.stringify(job));
  } else if (command === 'status') {
    console.log(JSON.stringify(db.prepare('SELECT id,url,status,attempts,error_code,requested_at FROM gsc_queue WHERE portal=? ORDER BY created_at DESC LIMIT 20').all(config.portal)));
  } else if (command === 'run') {
    // The compose entrypoint holds an exclusive flock across this entire process.
    const interruptedJobs = db.prepare("SELECT id,url FROM gsc_queue WHERE portal=? AND status='in_progress'").all(config.portal);
    const interrupted = recoverInterrupted(db, config.portal);
    for (const job of interruptedJobs) enqueueEvent(db, job, 'delivery_unknown', 'process_interrupted');
    if (interrupted) console.log(JSON.stringify({ event: 'interrupted_jobs', count: interrupted }));
    let stopping = false;
    for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { stopping = true; });
    const heartbeat = () => writeFile(process.env.COD5_GSC_HEARTBEAT_FILE || '/gsc/heartbeat', new Date().toISOString(), { mode: 0o600 });
    const heartbeatTimer = setInterval(() => { heartbeat().catch(() => {}); }, 20000);
    try {
      while (!stopping) {
        await heartbeat();
        const result = await processOne(db, config);
        if (result) console.log(JSON.stringify({ jobId: result.id, status: result.status, errorCode: result.errorCode }));
        await deliverEvents(db, config);
        await new Promise(resolve => setTimeout(resolve, result ? 1000 : 20000));
      }
    } finally { clearInterval(heartbeatTimer); }
  } else throw new Error('Unknown command');
  db.close();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => {
  console.error(JSON.stringify({ error: error.name, message: 'GSC worker failed' }));
  process.exitCode = 1;
});
