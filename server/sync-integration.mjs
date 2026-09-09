import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const equal = (a,b) => Boolean(a && b && Buffer.byteLength(a)===Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a),Buffer.from(b)));
const response = (body,status=200) => Response.json(body,{status,headers:{'cache-control':'no-store','x-robots-tag':'noindex'}});
const fail = (status,error) => { throw Object.assign(new Error(error),{status}); };
export function migrateSync(db) {
 db.exec(`CREATE TABLE IF NOT EXISTS sync_articles (external_id TEXT PRIMARY KEY, draft_id TEXT UNIQUE NOT NULL REFERENCES drafts(id), revision INTEGER NOT NULL, payload_hash TEXT NOT NULL, draft_hash TEXT NOT NULL)`);
}
function publicUrl(value) {
 try { const u=new URL(value);return u.protocol==='https:' && !u.username && !u.password && !u.hash && u.hostname.includes('.') && !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname); } catch { return false; }
}
function validate(body,env) {
 if(!body || typeof body!=='object' || Array.isArray(body))fail(400,'Objeto obrigatório.');
 const required={externalId:160,title:120,slug:150,excerpt:300,contentHtml:80000,sourceUrl:2000,imageUrl:2000};
 for(const [key,max] of Object.entries(required))if(typeof body[key]!=='string'||!body[key].trim()||body[key].length>max)fail(400,`Campo inválido: ${key}`);
 if(!/^[a-zA-Z0-9:._-]+$/.test(body.externalId)||!Number.isSafeInteger(body.revision)||body.revision<1||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug))fail(400,'Identificador, revisão ou endereço inválido.');
 if(body.action && !['draft','publish'].includes(body.action))fail(400,'Ação inválida.');
 if(!publicUrl(body.sourceUrl)||!publicUrl(body.imageUrl))fail(400,'URLs HTTPS válidas obrigatórias.');
 const mediaHost=`${env.DO_SPACES_BUCKET}.${env.DO_SPACES_REGION}.digitaloceanspaces.com`;
 const configured=env.DO_SPACES_PUBLIC_BASE_URL ? new URL(env.DO_SPACES_PUBLIC_BASE_URL).hostname : mediaHost;
 if(![mediaHost,configured].includes(new URL(body.imageUrl).hostname))fail(400,'Envie a capa ao armazenamento Código5 antes de importar.');
 // Deliberately small HTML contract. Reject unsupported markup instead of attempting regex sanitization.
 const tags=body.contentHtml.match(/<[^>]*>/g)||[];
 for(const tag of tags) {
  if(/^<\/?(?:p|h2|h3|ul|ol|li|strong|em|blockquote)>$/.test(tag)||/^<br\s*\/?>$/.test(tag))continue;
  const link=tag.match(/^<a href="([^"<>]+)">$/);
  if(tag==='</a>' || link && publicUrl(link[1]))continue;
  fail(400,'HTML não permitido. Use parágrafos, listas, subtítulos e links HTTPS simples.');
 }
 if(body.contentHtml.replace(/<[^>]*>/g,'').includes('<'))fail(400,'HTML incompleto.');
 if(!Array.isArray(body.categories)||body.categories.length<1||body.categories.length>3||body.categories.some(c=>!c||typeof c.name!=='string'||c.name.length>80||!c.name.trim()||!/^[-a-z0-9]{1,80}$/.test(c.slug)))fail(400,'Categorias inválidas.');
 return {externalId:body.externalId,revision:body.revision,title:body.title,slug:body.slug,excerpt:body.excerpt,contentHtml:body.contentHtml,sourceUrl:body.sourceUrl,imageUrl:body.imageUrl,categories:body.categories};
}
export async function handleSyncArticle(request,db,env,staticSlugs=new Set()) {
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 const canPublish=equal(token,env.COD5_SYNC_PUBLISH_TOKEN);
 if(!canPublish&&!equal(token,env.COD5_SYNC_DRAFT_TOKEN))return response({ok:false,error:'Não autorizado.'},401);
 const read = externalId => {
  const map=db.prepare('SELECT * FROM sync_articles WHERE external_id=?').get(externalId);
  const draft=map&&db.prepare('SELECT * FROM drafts WHERE id=?').get(map.draft_id);
  return {map,draft};
 };
 const result = (map,draft) => ({ok:true,externalId:map.external_id,id:draft.id,revision:map.revision,status:draft.status,url:draft.status==='published'?`https://codigo5.com.br/blog/${draft.slug}`:null});
 if(request.method==='GET') {const {map,draft}=read(new URL(request.url).searchParams.get('externalId')||'');return draft?response(result(map,draft)):response({ok:false,error:'Não encontrado.'},404);}
 if(request.method!=='POST')return response({ok:false,error:'Método não permitido.'},405);
 let body;
 try {body=await request.json();}catch{return response({ok:false,error:'JSON inválido.'},400);}
 let transaction=false;
 try {
  if(body?.action==='publish'&&!canPublish)fail(403,'Credencial sem permissão para publicar.');
  const data=validate(body,env);const payloadHash=hash(data);
  if(body.action==='publish' && read(data.externalId).draft?.status!=='published') {
   let media;try{media=await fetch(data.imageUrl,{method:'HEAD',redirect:'error',signal:AbortSignal.timeout(10000)});}catch{fail(422,'Capa indisponível. Rascunho preservado.');}
   if(!media.ok||!/^image\/(png|jpeg|webp)(?:;|$)/.test(media.headers.get('content-type')||''))fail(422,'Capa inválida ou indisponível.');
  }
  db.exec('BEGIN IMMEDIATE');transaction=true;
  let {map,draft}=read(data.externalId);
  if(map) {
   if(hash(draft)!==map.draft_hash)fail(409,'Conteúdo alterado no painel. Revisão humana preservada.');
   if(data.revision<map.revision || data.revision===map.revision&&payloadHash!==map.payload_hash)fail(409,'Revisão conflitante.');
   if(draft.status==='published'&&data.revision!==map.revision)fail(409,'Artigo publicado: alterações pelo painel.');
  }
  if(staticSlugs.has(data.slug)||db.prepare('SELECT id FROM drafts WHERE slug=? AND id<>? UNION SELECT id FROM posts WHERE slug=? AND id<>?').get(data.slug,draft?.id||'',data.slug,draft?.id||'')||db.prepare('SELECT id FROM redirects WHERE source_path IN (?,?)').get('/blog/'+data.slug,'/blog/'+data.slug+'/'))fail(409,'Endereço já utilizado. Conteúdo existente preservado.');
  const now=new Date().toISOString();
  if(!map||data.revision>map.revision) {
   const id=draft?.id||randomUUID();
   if(!draft)db.prepare("INSERT INTO drafts(id,telegram_user_id,status,mode,source_type,source_value,created_at,updated_at) VALUES (?,'sync','draft','link','link',?,?,?)").run(id,data.sourceUrl,now,now);
   db.prepare('UPDATE drafts SET source_value=?,title=?,slug=?,excerpt=?,seo_title=?,seo_description=?,content_html=?,content_markdown=NULL,image_url=?,categories_json=?,tags_json=?,notes=?,updated_at=? WHERE id=?').run(data.sourceUrl,data.title,data.slug,data.excerpt,data.title,data.excerpt,data.contentHtml,data.imageUrl,JSON.stringify(data.categories),'[]',JSON.stringify({integration:'sync',externalId:data.externalId,source:data.sourceUrl}),now,id);
   draft=db.prepare('SELECT * FROM drafts WHERE id=?').get(id);
   db.prepare('INSERT INTO sync_articles VALUES (?,?,?,?,?) ON CONFLICT(external_id) DO UPDATE SET revision=excluded.revision,payload_hash=excluded.payload_hash,draft_hash=excluded.draft_hash').run(data.externalId,id,data.revision,payloadHash,hash(draft));
   map=read(data.externalId).map;
  }
  if(body.action==='publish'&&draft.status!=='published') {
   if(draft.status!=='draft')fail(409,'Rascunho não disponível para publicação.');
   db.prepare(`INSERT INTO posts(id,slug,title,excerpt,seo_title,seo_description,image_url,content_html,categories_json,tags_json,status,canonical_url,published_at,updated_at,created_by,updated_by) SELECT id,slug,title,excerpt,seo_title,seo_description,image_url,content_html,categories_json,tags_json,'published',?, ?,?,'sync','sync' FROM drafts WHERE id=?`).run(`https://codigo5.com.br/blog/${draft.slug}`,now,now,draft.id);
   db.prepare("UPDATE drafts SET status='published',updated_at=? WHERE id=?").run(now,draft.id);
   draft=db.prepare('SELECT * FROM drafts WHERE id=?').get(draft.id);
   db.prepare('UPDATE sync_articles SET draft_hash=? WHERE external_id=?').run(hash(draft),data.externalId);
  }
  db.exec('COMMIT');transaction=false;return response(result(map,draft));
 }catch(error){if(transaction)db.exec('ROLLBACK');if(error.status)return response({ok:false,error:error.message},error.status);throw error;}
}
