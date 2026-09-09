import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { SqliteD1, SqliteKV } from './storage.mjs';

test('Node routes preserve authentication, draft persistence, redirects and dynamic SEO', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cod5-http-'));
  const filename = join(dir, 'editorial.sqlite');
  const db = new SqliteD1(filename);
  for (const file of readdirSync('migrations').filter(file => !file.startsWith('0004')).sort()) db.exec(readFileSync(join('migrations', file), 'utf8'));
  const kv = new SqliteKV(db);
  await kv.put('admin-link:local-test', JSON.stringify({ email: 'test@example.invalid', telegramUserId: '123' }), { expirationTtl: 60 });
  db.close();
  const port = 18336;
  const child = spawn(process.execPath, ['output/server.mjs'], { env: { ...process.env, COD5_DATABASE_FILE: filename, COD5_ASSETS_DIR: resolve('dist'), PORT: String(port), HOST: '127.0.0.1', TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_ALLOWED_USER_IDS: '123' }, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    await Promise.race([once(child.stdout, 'data'), once(child, 'exit').then(() => { throw new Error('Server exited'); }), new Promise((_, reject) => { const timer=setTimeout(()=>reject(new Error('Start timeout')),10000); timer.unref(); })]);
    const base = `http://127.0.0.1:${port}`;
    const request = (path, options) => fetch(base + path, { redirect: 'manual', ...options });
    assert.equal((await request('/api/admin/posts')).status, 401);
    assert.equal((await request('/api/bot/drafts')).status, 400);
    assert.equal((await request('/api/missing')).status, 404);
    assert.equal((await request('/assets/missing.js')).status, 404);
    const old = await request('/contact'); assert.equal(old.status, 301); assert.equal(old.headers.get('location'), 'https://codigo5.com.br/contato');
    const home = await request('/'); assert.equal(home.status, 200); assert.match(await home.text(), /Sites que apresentam/);
    const login = await request('/api/admin/auth/consume', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ token: 'local-test' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const authenticated = await request('/api/admin/posts', { headers: { cookie } }); assert.equal(authenticated.status, 200);
    const replay = await request('/api/admin/auth/consume', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ token:'local-test' }) }); assert.equal(replay.status, 401);
    writeFileSync(join(dir,'read-only'),'migration');
    assert.equal((await request('/api/admin/posts',{method:'POST',headers:{cookie}})).status,503);
    assert.equal((await request('/')).status,200);
    unlinkSync(join(dir,'read-only'));
    const post = (path, body) => request(path, { method:'POST', headers:{cookie,'content-type':'application/json'}, body:JSON.stringify(body) });
    const created = await post('/api/admin/posts', {source:'Verificação local da migração'}); assert.equal(created.status,200);
    const {item} = await created.json();
    const saved = await post('/api/admin/posts-save', {draftId:item.id,title:'Artigo local',slug:'artigo-local',contentMarkdown:'Conteúdo de validação apenas no banco temporário.'}); assert.equal(saved.status,200);
    assert.equal((await post('/api/admin/posts-publish', {draftId:item.id})).status,200);
    const article = await request('/blog/artigo-local'); assert.equal(article.status,200); assert.match(await article.text(), /Conteúdo de validação apenas/);
    assert.equal((await post('/api/admin/posts-save', {draftId:item.id,slug:'artigo-local-renomeado'})).status,200);
    assert.equal((await request('/blog/artigo-local')).status,301);
    const persisted = new SqliteD1(filename); assert.equal(persisted.prepare('SELECT slug FROM posts WHERE id=?').bind(item.id).first('slug'),'artigo-local-renomeado'); persisted.prepare("INSERT INTO redirects(source_path,target_path,created_at) VALUES (?,?,datetime('now'))").bind('/blog/artigo-local-renomeado','/blog').run(); persisted.close();
    const listing=await (await request('/api/bot/posts')).json(); assert.equal(listing.posts.length,0);
    assert.equal((await request('/api/telegram/health')).status, 200);
    assert.equal((await request('/sitemap.xml')).status, 200);
    assert.equal((await request('/admin/editorial')).headers.get('x-robots-tag'), 'noindex, follow');
    assert.equal((await request('/api/admin/posts', {method:'DELETE',headers:{cookie}})).status, 405);
  } finally {
    const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; rmSync(dir, {recursive:true,force:true});
  }
});
