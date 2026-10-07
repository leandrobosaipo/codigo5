import {readAllowedUserIds} from '../../../_shared/bot/auth';
import {sendTelegramMessage} from '../../../_shared/bot/telegram';
import type {Env} from '../../../_shared/bot/types';

const statuses=new Set(['login_required','captcha_required','quota_exceeded','layout_changed','worker_down','delivery_unknown','recovered','requested','blocked']);
const phases=new Set(['launch','preflight','inspection','inspection_result','click','confirmation','browser','worker','unknown']);
const codes=new Set(['started','request_failed','article_network_error','article_body_error','article_not_html','article_blocked_header','article_missing_robots','article_blocked_meta','article_canonical_count','article_canonical_mismatch','article_missing_duplicate_heading','article_missing_source_content','sitemap_unavailable','sitemap_missing_article','robots_unavailable','robots_disallow','invalid_url','preflight_unexpected_failure','already_requested','already_indexed','layout_changed','confirmation_unverified','click_outcome_unknown','browser_step_failed','unexpected_failure','max_attempts','process_interrupted','login_required','captcha_required','quota_exceeded']);
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store'}});
const validId=(value:unknown)=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value);
const markdown=(value:string)=>value.replace(/([_*`])/g,'\\$1').replaceAll('[','\\[');
const diagnostic=(event:Record<string,unknown>)=>{
 const phase=typeof event.phase==='string'&&phases.has(event.phase)?event.phase:'unknown';
 const code=typeof event.code==='string'&&(codes.has(event.code)||/^article_http_[1-5]\d\d$/.test(event.code))?event.code:null;
 const clicked=event.clicked===true?true:event.clicked===false?false:null;
 if(event.phase!==undefined&&event.phase!==null&&(typeof event.phase!=='string'||event.phase.length>40||!/^[a-z_]+$/.test(event.phase)))return null;
 if(event.code!==undefined&&event.code!==null&&(typeof event.code!=='string'||event.code.length>80||!/^[a-z0-9_]+$/.test(event.code)))return null;
 if(event.clicked!==undefined&&event.clicked!==null&&typeof event.clicked!=='boolean')return null;
 if(event.detail!==undefined&&event.detail!==null&&(typeof event.detail!=='string'||event.detail.length>500))return null;
 if(event.attempt!==undefined&&event.attempt!==null&&(!Number.isInteger(event.attempt)||Number(event.attempt)<1||Number(event.attempt)>100))return null;
 return {phase,code,clicked};
};
const messageFor=(event:Record<string,unknown>,url:string|undefined,d:{phase:string;code:string|null;clicked:boolean|null})=>{
 const phaseLabel:Record<string,string>={launch:'abertura do Search Console',preflight:'checagem do artigo',inspection:'inspeção do URL',inspection_result:'leitura do resultado',click:'envio do pedido',confirmation:'confirmação do Google',browser:'uso do navegador',worker:'processamento',unknown:'etapa não identificada'};
 const phase=phaseLabel[d.phase]||phaseLabel.unknown;
 let result:string,problem:string|undefined;
 if(event.status==='requested'&&d.clicked===true&&d.phase==='confirmation')result='Google confirmou o recebimento do pedido.';
 else if(event.status==='requested'&&d.clicked===false&&d.code==='already_requested')result='Google já mostrava um pedido confirmado; nenhuma nova solicitação feita.';
 else if(event.status==='requested')result='O serviço registrou a solicitação como concluída.';
 else if(event.status==='delivery_unknown'){result=d.clicked===false?'O pedido não foi enviado.':d.clicked===true?'O clique foi feito, mas não foi possível confirmar se o Google recebeu o pedido. Não vou repetir automaticamente.':'Não foi possível confirmar se o pedido foi enviado ou recebido pelo Google. Não vou repetir automaticamente.';problem=d.code==='confirmation_unverified'?'O Google não exibiu a confirmação dentro do tempo de espera.':undefined;}
 else if(event.status==='blocked'){result=d.clicked===false?'O pedido não foi enviado.':d.clicked===true?'O processamento foi interrompido após o clique; o recebimento pelo Google não foi confirmado.':'O processamento foi bloqueado; não há confirmação do recebimento pelo Google.';}
 else if(event.status==='quota_exceeded')result='O Google informou que o limite de solicitações foi atingido.';
 else if(event.status==='login_required')result='O Search Console pediu login; o pedido não foi confirmado.';
 else if(event.status==='captcha_required')result='O Google pediu uma verificação; o pedido não foi confirmado.';
 else if(event.status==='layout_changed')result='A tela do Search Console mudou e o pedido não foi confirmado.';
 else if(event.status==='worker_down')result='O serviço está indisponível no momento.';
 else result='O serviço voltou a funcionar.';
 const code=d.code||'';
 problem=problem||({invalid_url:'O endereço do artigo não passou na validação.',article_not_html:'A página não retornou HTML.',article_blocked_header:'O cabeçalho da página bloqueia indexação.',article_missing_robots:'A página não contém a instrução robots esperada.',article_blocked_meta:'Uma instrução da página bloqueia indexação.',article_canonical_count:'A página não tem exatamente um endereço canônico.',article_canonical_mismatch:'O endereço principal da página não corresponde ao link.',article_missing_duplicate_heading:'O título principal está ausente ou duplicado.',article_missing_source_content:'O conteúdo principal da página está ausente ou muito curto.',sitemap_missing_article:'O link do artigo não consta no sitemap.',robots_disallow:'O robots.txt bloqueia o acesso ao artigo.',sitemap_unavailable:'Não foi possível consultar o sitemap.',robots_unavailable:'Não foi possível consultar o robots.txt.',article_network_error:'Não foi possível acessar a página do artigo.',article_body_error:'Não foi possível ler o conteúdo da página.',request_failed:'Uma consulta necessária falhou.',preflight_unexpected_failure:'Ocorreu um erro durante as verificações iniciais.',already_indexed:'O Google já indica que o URL está indexado.',click_outcome_unknown:'Não foi possível determinar se o clique foi executado.',browser_step_failed:'Uma etapa do navegador falhou.',unexpected_failure:'Ocorreu uma falha inesperada.',process_interrupted:'O processamento foi interrompido.',max_attempts:'O limite de tentativas foi atingido.',confirmation_unverified:'O Google não exibiu a confirmação dentro do tempo de espera.'} as Record<string,string>)[code];
 const http=code.match(/^article_http_([1-5]\d\d)$/);if(http)problem=http[1]==='404'?'A página retornou erro HTTP 404 (página não encontrada).':`A página retornou erro HTTP ${http[1]}.`;
 return [`Search Console: ${result}`,`Etapa: ${phase}`,...(problem?[`Problema: ${problem}`]:[]),...(url?[`Artigo: ${url}`]:[])].join('\n');
};
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
 const diagnosis=diagnostic(event);if(!diagnosis)return response({ok:false,error:'Invalid diagnostic'},400);
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
 const message=messageFor(event,article?.href,diagnosis);
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
