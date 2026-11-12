import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const confirmationText = /^(?:indexação solicitada|indexing requested|(?:o|a) URL foi adicionad[oa] a uma fila de rastreamento prioritári[oa]\..*|URL was added to a priority crawl queue\..*)$/i;
export const receipt = page => page.getByText(confirmationText).filter({ visible: true }).first();

export async function saveEvidence(page, job, directory, diagnostic = false) {
  if (!/^[a-f0-9-]{32,36}$/.test(job.id)) throw new Error('invalid_job');
  await page.getByText(job.url, { exact: true }).filter({ visible: true }).first().waitFor({ timeout: 5000 });
  if (!diagnostic) await receipt(page).waitFor({ timeout: 5000 });
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = join(directory, job.id + (diagnostic ? '-diagnostico.png' : '.png'));
  await writeFile(file + '.tmp', await page.screenshot(), { mode: 0o600 });
  await rename(file + '.tmp', file);
  return file;
}

export function migrateEvidence(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS gsc_whatsapp (
    job_id TEXT PRIMARY KEY, url TEXT NOT NULL, file TEXT NOT NULL,
    image_state TEXT NOT NULL DEFAULT 'pending', image_id TEXT,
    link_state TEXT NOT NULL DEFAULT 'pending', link_id TEXT)`);
}

export async function sendEvidence(db, env, request = fetch) {
  const job = db.prepare("SELECT * FROM gsc_whatsapp WHERE image_state='pending' OR (image_state IN ('accepted','unavailable') AND link_state='pending') ORDER BY rowid LIMIT 1").get();
  if (!job) return;
  const number = env.CODIGO5_REVIEW_GROUP_JID;
  if (!/^\d{10,20}(?:-\d{6,12})?@g\.us$/.test(number || '')) throw new Error('invalid_group');
  const instance = encodeURIComponent(env.CODIGO5_EVOLUTION_INSTANCE);
  const api = async (path, body) => {
    const response = await request(env.CODIGO5_EVOLUTION_URL + path, {
      method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(25000),
      headers: { apikey: env.CODIGO5_EVOLUTION_KEY, 'content-type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error('evolution_http_' + response.status);
    return response.json();
  };
  if ((await api('/instance/connectionState/' + instance)).instance?.state !== 'open') throw new Error('instance_offline');
  const group = await api('/group/findGroupInfos/' + instance + '?groupJid=' + encodeURIComponent(number));
  if (group.id !== number || group.subject !== 'Código5 Web' || group.announce !== false) throw new Error('group_unverified');
  for (const part of ['image', 'link']) {
    if (job[part + '_state'] !== 'pending') continue;
    const body = part === 'image' ? { number, mediatype: 'image', mimetype: 'image/png', fileName: 'indexacao-solicitada.png',
      caption: 'Google Search Console · Indexação solicitada', media: (await readFile(job.file)).toString('base64') }
      : { number, text: job.url, linkPreview: true };
    const claim = db.prepare(`UPDATE gsc_whatsapp SET ${part}_state='sending' WHERE job_id=? AND ${part}_state='pending'`).run(job.job_id);
    if (!claim.changes) return;
    try {
      const result = await api('/message/' + (part === 'image' ? 'sendMedia' : 'sendText') + '/' + instance, body);
      if (!result.key?.id || result.key.remoteJid !== number) throw new Error('unverified_receipt');
      db.prepare(`UPDATE gsc_whatsapp SET ${part}_state='accepted',${part}_id=? WHERE job_id=?`).run(result.key.id, job.job_id);
    } catch {
      db.prepare(`UPDATE gsc_whatsapp SET ${part}_state='delivery_unknown' WHERE job_id=?`).run(job.job_id);
      return;
    }
  }
}
