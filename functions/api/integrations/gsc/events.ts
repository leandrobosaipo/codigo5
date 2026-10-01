import {readAllowedUserIds} from '../../../_shared/bot/auth';
import {sendTelegramMessage} from '../../../_shared/bot/telegram';
import type {Env} from '../../../_shared/bot/types';

const statuses=new Set(['login_required','captcha_required','quota_exceeded','layout_changed','worker_down','delivery_unknown','recovered','requested','blocked']);
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store'}});
const validId=(value:unknown)=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value);
const markdown=(value:string)=>value.replace(/([_*`])/g,'\\$1').replaceAll('[','\\[');
type GscEnv=Env&{COD5_GSC_CALLBACK_TOKEN?:string;COD5_GSC_NOTIFY_TELEGRAM_USER_ID?:string};
const constantTimeEqual=async(a:string,b:string)=>{
 const encoder=new TextEncoder(),[left,right]=await Promise.all([a,b].map(value=>crypto.subtle.digest('SHA-256',encoder.encode(value))));
 const x=new Uint8Array(left),y=new Uint8Array(right);let difference=0;for(let i=0;i<x.length;i++)difference|=x[i]^y[i];return difference===0;
};

export const onRequestPost:PagesFunction<GscEnv>=async({request,env})=>{
 const token=env.COD5_GSC_CALLBACK_TOKEN;
 const supplied=request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]||'';
 if(!token||!await constantTimeEqual(token,supplied))return response({ok:false,error:'Unauthorized'},401);
 let event:Record<string,unknown>;
 try{event=await request.json() as Record<string,unknown>;}catch{return response({ok:false,error:'Invalid JSON'},400);}
 if(!validId(event.eventId)||!validId(event.jobId)||typeof event.status!=='string'||!statuses.has(event.status))return response({ok:false,error:'Invalid event'},400);
 let article:URL|undefined;
 if(event.url!==undefined&&event.url!==null){
  if(typeof event.url!=='string')return response({ok:false,error:'Invalid article URL'},400);
  try{article=new URL(event.url);}catch{return response({ok:false,error:'Invalid article URL'},400);}
  if(article.origin!=='https://codigo5.com.br'||article.username||article.password||!/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.pathname)||article.search||article.hash)return response({ok:false,error:'Invalid article URL'},400);
 }else if(!['worker_down','recovered'].includes(event.status))return response({ok:false,error:'Article URL required'},400);
 const recipient=env.COD5_GSC_NOTIFY_TELEGRAM_USER_ID?.trim();
 if(!recipient||!readAllowedUserIds(env).has(recipient)||!/^\d+$/.test(recipient))return response({ok:false,error:'Notification recipient unavailable'},503);
 const db=env.BOT_DB;
 try{db.prepare(`CREATE TABLE IF NOT EXISTS gsc_alerts(event_id TEXT PRIMARY KEY,job_id TEXT NOT NULL,status TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)` ).run();}catch{return response({ok:false,error:'Persistence unavailable'},503);}
 const existing=await db.prepare('SELECT status,attempts FROM gsc_alerts WHERE event_id=?').bind(event.eventId).first() as {status:string;attempts:number}|null;
 if(existing){
  if(existing.status!=='failed'||existing.attempts>=2)return response({ok:true,state:existing.status,duplicate:true});
  const claim=await db.prepare("UPDATE gsc_alerts SET status='sending',attempts=attempts+1,updated_at=? WHERE event_id=? AND status='failed' AND attempts<2").bind(new Date().toISOString(),event.eventId).run();
  if(!claim.meta.changes)return response({ok:true,state:'failed',duplicate:true});
 }else{
  const claim=await db.prepare("INSERT OR IGNORE INTO gsc_alerts(event_id,job_id,status,attempts,updated_at) VALUES(?,?,'sending',1,?)").bind(event.eventId,event.jobId,new Date().toISOString()).run();
  if(!claim.meta.changes){const claimed=await db.prepare('SELECT status FROM gsc_alerts WHERE event_id=?').bind(event.eventId).first() as {status:string}|null;return response({ok:true,state:claimed?.status||'sending',duplicate:true});}
 }
 const message=[`GSC ${markdown(event.status)}`,`Job: ${markdown(event.jobId as string)}`,...(article?[`Artigo: ${markdown(article.href)}`]:[])].join('\n');
 try{
  const sent=await sendTelegramMessage(env,Number(recipient),{text:message});
  const delivered=sent.ok&&(sent.body as {ok?:unknown}|null)?.ok===true;
  const state=delivered?'sent':'failed';
  await db.prepare('UPDATE gsc_alerts SET status=?,updated_at=? WHERE event_id=? AND status=\'sending\'').bind(state,new Date().toISOString(),event.eventId).run();
  return response({ok:delivered,state},delivered?200:502);
 }catch{
  // A thrown request may have reached Telegram; keep sending to prevent an unsafe retry.
  return response({ok:false,state:'sending'},202);
 }
};
