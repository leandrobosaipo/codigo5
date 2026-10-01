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
});
