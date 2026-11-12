import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { claimNext, migrateGscQueue, recoverInterrupted, setRequestStatus } from './gsc-queue.mjs';
import { preflightArticle } from './gsc-preflight.mjs';
import { requestViaGsc } from './gsc-browser.mjs';
import { saveEvidence, migrateEvidence, sendEvidence } from './gsc-whatsapp.mjs';

const alertStates = new Set(['login_required', 'captcha_required', 'quota_exceeded', 'layout_changed', 'delivery_unknown', 'blocked', 'requested']);
const transientPreflight = new Set(['request_failed', 'article_network_error', 'article_body_error', 'sitemap_unavailable', 'robots_unavailable']);

function nextRetry(now, attempts) {
  return new Date(Date.parse(now) + Math.min(60 * 2 ** (attempts - 1), 360) * 1000).toISOString();
}

export async function processOne(db, config, { preflight = preflightArticle, request = requestViaGsc, now = () => new Date().toISOString(), logger = () => {} } = {}) {
  const started = Date.now();
  const owner = randomUUID();
  const job = claimNext(db, owner, now(), config.maxAttempts);
  if (!job) return null;
  let status, evidence, errorCode = null, diagnosis = { phase: 'preflight', code: 'started', clicked: false, detail: null };
  const phaseLogger = event => { try { logger({ event: 'gsc_phase', jobId: job.id, url: job.url, ...event }); } catch {} };
  try {
    let checked;
    const preflightStarted = Date.now();
    phaseLogger({ phase: 'preflight', state: 'start', durationMs: null });
    try { checked = await preflight(job.url, { origin: job.origin }); }
    catch { checked = { ok: false, code: 'preflight_unexpected_failure' }; }
    phaseLogger({ phase: 'preflight', state: checked.ok ? 'complete' : 'error', code: checked.code || 'ok', durationMs: Date.now() - preflightStarted });
    if (!checked.ok) {
      errorCode = checked.code;
      diagnosis = { phase: 'preflight', code: checked.code, clicked: false, detail: checked.detail || null };
      status = (checked.code === 'preflight_unexpected_failure' || transientPreflight.has(checked.code) || /^article_http_5\d\d$/.test(checked.code)) && job.attempts < config.maxAttempts ? 'retry' : 'blocked';
    } else {
      const browserStarted = Date.now();
      phaseLogger({ phase: 'browser', state: 'start', durationMs: null });
      try {
        const result = await request({ url: job.url, property: config.property, profileDir: config.profileDir, headless: config.headless !== false, executablePath: config.executablePath, onPhase: phaseLogger,
          capture: page => saveEvidence(page, job, '/gsc/evidence') });
        evidence = result.status === 'requested' && result.clicked === true && result.evidence;
        diagnosis = result.diagnosis || { phase: 'browser', code: result.status, clicked: result.clicked ?? null, detail: null };
        status = result.status === 'already_requested' ? 'requested' : result.status === 'already_indexed' ? 'blocked' : result.status;
        if (result.status === 'already_requested' || result.status === 'already_indexed') errorCode = result.status;
        if (status === 'retry' && job.attempts >= config.maxAttempts) { status = 'blocked'; errorCode = 'max_attempts'; }
        phaseLogger({ phase: 'browser', state: 'complete', code: diagnosis.code, durationMs: Date.now() - browserStarted });
      } catch {
        status = 'delivery_unknown';
        errorCode = 'unexpected_failure';
        diagnosis = { phase: 'browser', code: 'unexpected_failure', clicked: null, detail: null };
        phaseLogger({ phase: 'browser', state: 'error', code: 'unexpected_failure', durationMs: Date.now() - browserStarted });
      }
    }
  } catch {
    status = 'blocked';
    errorCode = 'preflight_unexpected_failure';
    diagnosis = { phase: 'preflight', code: errorCode, clicked: false, detail: null };
  }
  db.exec('BEGIN IMMEDIATE');
  try {
    if (!setRequestStatus(db, job.id, owner, status, {
      errorCode,
      nextAttemptAt: status === 'retry' ? nextRetry(now(), job.attempts) : null,
      requestedAt: status === 'requested' && errorCode !== 'already_requested' ? now() : null,
    })) throw new Error('Queue ownership lost; inspect job before another attempt');
    if (alertStates.has(status)) enqueueEvent(db, job, status, errorCode, diagnosis, job.attempts);
    if (evidence) db.prepare('INSERT INTO gsc_whatsapp(job_id,url,file) VALUES(?,?,?)').run(job.id, job.url, evidence);
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
  return { id: job.id, url: job.url, status, errorCode, diagnosis, durationMs: Date.now() - started };
}

export function migrateEvents(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS gsc_events (
    id TEXT PRIMARY KEY, job_id TEXT, status TEXT NOT NULL, url TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('pending','sending','acked','failed','delivery_unknown')),
    attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT, ack TEXT, created_at TEXT NOT NULL
  )`);
  const columns = new Set(db.prepare('PRAGMA table_info(gsc_events)').all().map(row => row.name));
  for (const [name, type] of [['phase', 'TEXT'], ['diagnostic_code', 'TEXT'], ['clicked', 'INTEGER'], ['detail', 'TEXT'], ['attempt', 'INTEGER']]) {
    if (!columns.has(name)) db.exec(`ALTER TABLE gsc_events ADD COLUMN ${name} ${type}`);
  }
}

export function enqueueEvent(db, job, status, code = null, diagnosis = null, attempt = null) {
  migrateEvents(db);
  const id = attempt === null ? `${job.id}:${status}` : `${job.id}:${status}:attempt-${attempt}`;
  const safe = diagnosis && {
    phase: /^[a-z_]{1,40}$/.test(diagnosis.phase || '') ? diagnosis.phase : 'unknown',
    code: /^[a-z0-9_]{1,80}$/.test(diagnosis.code || '') ? diagnosis.code : 'unknown',
    clicked: diagnosis.clicked === true ? 1 : diagnosis.clicked === false ? 0 : null,
    detail: typeof diagnosis.detail === 'string' && /^[a-z0-9_]{1,80}$/i.test(diagnosis.detail) ? diagnosis.detail : null,
  };
  db.prepare("INSERT OR IGNORE INTO gsc_events(id,job_id,status,url,state,created_at,ack,phase,diagnostic_code,clicked,detail,attempt) VALUES (?,?,?,?,'pending',CURRENT_TIMESTAMP,?,?,?,?,?,?)")
    .run(id, job.id, status, job.url, code, safe?.phase ?? null, safe?.code ?? null, safe?.clicked ?? null, safe?.detail ?? null, attempt);
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
        body: JSON.stringify({ eventId: event.id, jobId: event.job_id, status: event.status, url: event.url, phase: event.phase, code: event.diagnostic_code, clicked: event.clicked === null ? null : Boolean(event.clicked), detail: event.detail, attempt: event.attempt }),
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
  migrateEvidence(db);
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
    const interruptedJobs = db.prepare("SELECT id,url,attempts FROM gsc_queue WHERE portal=? AND status='in_progress'").all(config.portal);
    const interrupted = recoverInterrupted(db, config.portal);
    for (const job of interruptedJobs) enqueueEvent(db, job, 'delivery_unknown', 'process_interrupted', { phase: 'worker', code: 'process_interrupted', clicked: null }, job.attempts);
    if (interrupted) console.log(JSON.stringify({ event: 'interrupted_jobs', count: interrupted }));
    let stopping = false;
    for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { stopping = true; });
    const heartbeat = () => writeFile(process.env.COD5_GSC_HEARTBEAT_FILE || '/gsc/heartbeat', new Date().toISOString(), { mode: 0o600 });
    const heartbeatTimer = setInterval(() => { heartbeat().catch(() => {}); }, 20000);
    try {
      while (!stopping) {
        await heartbeat();
        const result = await processOne(db, config, { logger: record => console.log(JSON.stringify(record)) });
        if (result) console.log(JSON.stringify({ event: 'gsc_job_finished', jobId: result.id, url: result.url, status: result.status, errorCode: result.errorCode, phase: result.diagnosis.phase, code: result.diagnosis.code, clicked: result.diagnosis.clicked, durationMs: result.durationMs }));
        await deliverEvents(db, config);
        await sendEvidence(db, process.env).catch(() => console.error('GSC WhatsApp: pending delivery precheck failed'));
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
