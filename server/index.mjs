import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, sep, dirname } from 'node:path';
import { Readable } from 'node:stream';
import { SqliteD1, SqliteKV } from './storage.mjs';
import { migrateEditorial } from './migrate.mjs';
import { handleSyncMedia } from './sync-media.mjs';
import { buildSpacesKey, uploadImageToSpaces } from '../functions/_shared/bot/spaces.ts';
import { handleSyncArticle, migrateSync } from './sync-integration.mjs';
import { renderLlms } from './llms.mjs';
import archive from '../src/content/blog-posts.json' with { type: 'json' };
import routes from '../output/routes.ts';
import { onRequest as publicMiddleware } from '../functions/_middleware.ts';
import { onRequest as botMiddleware } from '../functions/api/bot/_middleware.ts';

const dataFile = process.env.COD5_DATABASE_FILE || '/data/editorial.sqlite';
if (!existsSync(dataFile)) throw new Error('Imported editorial database required; refusing to start with an empty database.');
if (process.env.NODE_ENV === 'production') {
  if (!/^\d+:[A-Za-z0-9_-]+$/.test(process.env.TELEGRAM_BOT_TOKEN || '') || !/^\d+(,\s*\d+)*$/.test(process.env.TELEGRAM_ALLOWED_USER_IDS || '')) throw new Error('Valid editorial Telegram configuration required.');
  for (const name of ['TELEGRAM_SECRET_TOKEN', 'DO_SPACES_KEY', 'DO_SPACES_SECRET', 'DO_SPACES_BUCKET', 'DO_SPACES_REGION', 'DO_SPACES_ENDPOINT']) if (!process.env[name]) throw new Error(`Missing configuration: ${name}`);
}
const db = new SqliteD1(dataFile);
migrateEditorial(db.database);
migrateSync(db.database);
const staticSlugs = new Set(archive.map(post => post.slug));
for (const table of ['drafts', 'posts', 'redirects', 'publish_jobs', 'users']) db.prepare(`SELECT 1 FROM ${table} LIMIT 1`).all();
const env = { ...process.env, BOT_DB: db, BOT_SESSIONS: new SqliteKV(db) };
const assets = resolve(process.env.COD5_ASSETS_DIR || 'dist');
const redirects = (await readFile(resolve(assets, '_redirects'), 'utf8')).split('\n').map(line => line.trim().split(/\s+/)).filter(parts => /^30[1278]$/.test(parts[2]));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf' };

async function staticResponse(request) {
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
  const url = new URL(request.url);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return new Response('Bad path', { status: 400 }); }
  if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.')) || pathname.includes('\\')) return new Response('Not found', { status: 404 });
  for (const [source, target, status] of redirects) {
    if (source === pathname || source.endsWith('*') && pathname.startsWith(source.slice(0, -1))) return Response.redirect(new URL(target, request.url), Number(status));
  }
  const base = resolve(assets, `.${pathname}`);
  if (base !== assets && !base.startsWith(assets + sep)) return new Response('Not found', { status: 404 });
  const candidates = [base, `${base}.html`, resolve(base, 'index.html')];
  if (!extname(pathname) && !pathname.startsWith('/assets/')) candidates.push(resolve(assets, 'index.html'));
  for (const file of candidates) {
    try {
      if (!(await stat(file)).isFile()) continue;
      const headers = { 'content-type': mime[extname(file)] || 'application/octet-stream', 'cache-control': /\/assets\/.*\.(js|css)$/.test(pathname) ? 'public, max-age=31536000, immutable' : 'public, max-age=300' };
      return new Response(await readFile(file), { headers });
    } catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
  }
  return new Response('Not found', { status: 404 });
}

async function dispatch(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && existsSync(resolve(dirname(dataFile), 'read-only'))) return Response.json({ ok: false, error: 'Atualização em andamento. Tente novamente em instantes.' }, { status: 503, headers: { 'retry-after': '30', 'cache-control': 'no-store' } });
  if (url.pathname === '/api/integrations/sync/media') return handleSyncMedia(request,env,(key,bytes,type)=>uploadImageToSpaces(env,buildSpacesKey(env,key),bytes,type));
  if (url.pathname === '/api/integrations/sync/articles') return handleSyncArticle(request,db.database,env,staticSlugs);
  if (url.pathname === '/llms.txt' || url.pathname === '/llms-full.txt') {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
    const posts = db.prepare("SELECT slug,title,excerpt,seo_description FROM posts WHERE status='published' ORDER BY published_at DESC,updated_at DESC").all();
    return new Response(request.method === 'HEAD' ? null : renderLlms(posts, url.pathname === '/llms-full.txt'), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300' } });
  }
  const handlerModule = routes[url.pathname];
  const endpoint = async () => {
    if (!handlerModule) return url.pathname.startsWith('/api/') ? new Response('Not found', { status: 404 }) : staticResponse(request);
    const method = request.method === 'HEAD' ? 'Get' : request.method[0] + request.method.slice(1).toLowerCase();
    const handler = handlerModule[`onRequest${method}`] || handlerModule.onRequest;
    return handler ? handler({ request, env }) : new Response('Method not allowed', { status: 405 });
  };
  if (url.pathname.startsWith('/api/bot/')) return botMiddleware({ request, env, next: endpoint });
  return publicMiddleware({ request, env, next: (input) => input ? staticResponse(new Request(input, request)) : endpoint() });
}

const server = createServer(async (incoming, outgoing) => {
  const started = Date.now();
  try {
    const rawPath = incoming.url || '/';
    if (!rawPath.startsWith('/') || rawPath.startsWith('//')) { outgoing.writeHead(400); outgoing.end(); return; }
    const chunks = []; let size = 0;
    for await (const chunk of incoming) {
      size += chunk.length;
      if (size > 12 * 1024 * 1024) { outgoing.writeHead(413); outgoing.end('Payload too large'); return; }
      chunks.push(chunk);
    }
    const method = incoming.method || 'GET';
    const request = new Request(`https://codigo5.com.br${rawPath}`, { method, headers: incoming.headers, ...(!['GET', 'HEAD'].includes(method) ? { body: Buffer.concat(chunks) } : {}) });
    const result = await dispatch(request);
    const response = new Response(result.body, { status: result.status, headers: result.headers });
    response.headers.set('x-codigo5-runtime', 'macmini-sqlite');
    response.headers.set('x-content-type-options', 'nosniff');
    response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
    if (incoming.headers.host?.split(':')[0] === 'novo.codigo5.com.br') response.headers.set('x-robots-tag', 'noindex, nofollow');
    if (rawPath.startsWith('/api/admin/') || rawPath.startsWith('/api/telegram/')) response.headers.set('cache-control', 'no-store');
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    if (method === 'HEAD' || !response.body) outgoing.end(); else Readable.fromWeb(response.body).pipe(outgoing);
    console.info(JSON.stringify({ method, path: rawPath.split('?')[0], status: response.status, ms: Date.now() - started }));
  } catch (error) {
    console.error(JSON.stringify({ error: error.name, message: 'Request failed' }));
    if (!outgoing.headersSent) outgoing.writeHead(500, { 'cache-control': 'no-store' });
    outgoing.end('Internal server error');
  }
});
server.requestTimeout = 120000;
server.headersTimeout = 15000;
server.listen(Number(process.env.PORT || 8080), process.env.HOST || '0.0.0.0', () => console.info('Código5 runtime ready'));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
