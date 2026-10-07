import {beforeEach,describe,expect,it,vi} from 'vitest';

const {sendTelegramMessage}=vi.hoisted(()=>({sendTelegramMessage:vi.fn()}));
vi.mock('../../functions/_shared/bot/telegram',()=>({sendTelegramMessage}));
import {onRequestPost} from '../../functions/api/integrations/gsc/events';

const rows=new Map<string,{status:string;attempts:number}>();
const db={
 prepare(sql:string){let args:unknown[]=[];return {bind(...values:unknown[]){args=values;return this;},run(){
  if(sql.includes('INSERT OR IGNORE')){const [id]=args as [string];if(!rows.has(id))rows.set(id,{status:'sending',attempts:1});}
  else if(sql.includes('UPDATE gsc_alerts')){
   if(sql.includes("SET status='sending'")){const [ ,id]=args as [string,string];const row=rows.get(id);if(row?.status==='failed'&&row.attempts<2){row.status='sending';row.attempts++;}}
   else{const [status,,id]=args as [string,string,string];const row=rows.get(id);if(row)row.status=status;}
  }
  return {meta:{changes:1}};
 },first(){return rows.get(args[0] as string)||null;}};},
 exec(){return {count:1};},
} as never;
const env={BOT_DB:db,TELEGRAM_BOT_TOKEN:'bot',TELEGRAM_ALLOWED_USER_IDS:'123,456',COD5_GSC_CALLBACK_TOKEN:'callback-secret',COD5_GSC_NOTIFY_TELEGRAM_USER_ID:'123'} as never;
const event={eventId:'evt-1',jobId:'job-1',status:'quota_exceeded',url:'https://codigo5.com.br/blog/post-1'};
const request=(body=event,token='callback-secret')=>new Request('https://codigo5.com.br/api/integrations/gsc/events',{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(body)});
const invoke=async(body=event,token='callback-secret')=>{
 const response=await onRequestPost({request:request(body,token),env} as never);
 return {status:response.status,body:await response.json()};
};

describe('GSC worker callback',()=>{
 beforeEach(()=>{rows.clear();sendTelegramMessage.mockReset().mockResolvedValue({ok:true,skipped:false,body:{ok:true}});});
 it('requires the callback bearer token',async()=>{
  expect((await invoke(event,'wrong')).status).toBe(401);
  expect(sendTelegramMessage).not.toHaveBeenCalled();
 });
 it('sends only once per event id and acknowledges duplicates',async()=>{
  expect(await invoke()).toMatchObject({status:200,body:{ok:true,state:'sent'}});
  expect(await invoke()).toMatchObject({status:200,body:{ok:true,state:'sent',duplicate:true}});
  expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
  expect(sendTelegramMessage.mock.calls[0][2].text).toContain('O Google informou que o limite de solicitações foi atingido.');
  expect(sendTelegramMessage.mock.calls[0][2].text).toContain('Etapa: etapa não identificada');
 });
 it('marks explicit provider failures failed and permits one retry',async()=>{
  sendTelegramMessage.mockResolvedValueOnce({ok:false,skipped:false,status:503,body:{ok:false}}).mockResolvedValueOnce({ok:true,skipped:false,body:{ok:true}});
  expect(await invoke()).toMatchObject({status:502,body:{ok:false,state:'failed'}});
  expect(await invoke()).toMatchObject({status:200,body:{ok:true,state:'sent'}});
  expect(await invoke()).toMatchObject({status:200,body:{ok:true,state:'sent',duplicate:true}});
  expect(sendTelegramMessage).toHaveBeenCalledTimes(2);
 });
 it('allows watchdog events without an article and still requires provider ACK body.ok',async()=>{
  const watchdog={eventId:'watch-1',jobId:'watchdog',status:'worker_down'};
  expect(await invoke(watchdog)).toMatchObject({status:200,body:{ok:true,state:'sent'}});
  expect(sendTelegramMessage.mock.calls[0][2].text).not.toContain('Artigo:');
  const second={eventId:'watch-2',jobId:'watchdog',status:'recovered'};
  sendTelegramMessage.mockResolvedValueOnce({ok:true,skipped:false,status:200,body:{ok:false}});
  expect(await invoke(second)).toMatchObject({status:502,body:{ok:false,state:'failed'}});
  expect((await invoke({eventId:'watch-3',jobId:'job-3',status:'quota_exceeded'})).status).toBe(400);
 });
 it('uses explicit success evidence and does not expose free-form diagnostics',async()=>{
  const requested={eventId:'req-1',jobId:'job-1',status:'requested',url:event.url,phase:'confirmation',code:'requested',clicked:true,detail:'private cookie'};
  expect(await invoke(requested)).toMatchObject({status:200,body:{ok:true,state:'sent'}});
  const text=sendTelegramMessage.mock.calls[0][2].text;
  expect(text).toContain('Google confirmou o recebimento do pedido.');expect(text).not.toContain('private cookie');
 });
 it('distinguishes an existing request and uncertain delivery',async()=>{
  await invoke({eventId:'old-1',jobId:'job-1',status:'requested',url:event.url,phase:'inspection_result',code:'already_requested',clicked:false});
  expect(sendTelegramMessage.mock.calls[0][2].text).toContain('Google já mostrava um pedido confirmado; nenhuma nova solicitação feita.');
  await invoke({eventId:'unknown-1',jobId:'job-1',status:'delivery_unknown',url:event.url,phase:'confirmation',code:'confirmation_unverified',clicked:true});
  expect(sendTelegramMessage.mock.calls[1][2].text).toContain('O clique foi feito, mas não foi possível confirmar se o Google recebeu o pedido. Não vou repetir automaticamente.');
 });
 it('explains allowlisted preflight errors and confirmation timeout',async()=>{
  await invoke({eventId:'missing-1',jobId:'job-1',status:'blocked',url:event.url,phase:'preflight',code:'article_http_404',clicked:false,detail:'secret detail'});
  const missing=sendTelegramMessage.mock.calls[0][2].text;
  expect(missing).toContain('A página retornou erro HTTP 404 (página não encontrada).');expect(missing).not.toContain('secret detail');
  await invoke({eventId:'timeout-1',jobId:'job-1',status:'delivery_unknown',url:event.url,phase:'confirmation',code:'confirmation_unverified',clicked:true});
  expect(sendTelegramMessage.mock.calls[1][2].text).toContain('O Google não exibiu a confirmação dentro do tempo de espera.');
 });
 it('never includes unknown diagnostic codes in notifications',async()=>{
  await invoke({eventId:'secret-1',jobId:'job-1',status:'blocked',url:event.url,phase:'preflight',code:'private_token_value',clicked:false});
  const text=sendTelegramMessage.mock.calls[0][2].text;
  expect(text).not.toContain('private_token_value');expect(text).not.toContain('Problema:');
 });
 it('rejects malformed diagnostic fields and keeps backward compatibility',async()=>{
  expect((await invoke({...event,phase:'bad phase'})).status).toBe(400);
  expect((await invoke({...event,clicked:'yes'})).status).toBe(400);
  expect((await invoke({...event,attempt:0})).status).toBe(400);
  expect((await invoke(event)).status).toBe(200);
 });
});
