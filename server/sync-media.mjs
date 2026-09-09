import { createHash, timingSafeEqual } from 'node:crypto';
const equal=(a,b)=>Boolean(a&&b&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b)));
export async function handleSyncMedia(request,env,upload) {
 const reply=(body,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store','x-robots-tag':'noindex'}});
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!equal(token,env.COD5_SYNC_DRAFT_TOKEN)&&!equal(token,env.COD5_SYNC_PUBLISH_TOKEN))return reply({ok:false,error:'Não autorizado.'},401);
 if(request.method!=='POST')return reply({ok:false,error:'Método inválido.'},405);
 const type=request.headers.get('content-type');
 if(!['image/png','image/jpeg','image/webp'].includes(type))return reply({ok:false,error:'Use PNG, JPEG ou WebP.'},400);
 const bytes=Buffer.from(await request.arrayBuffer());
 if(bytes.length>6*1024*1024||bytes.length<12)return reply({ok:false,error:'Imagem deve ter até 6 MB.'},400);
 const valid=type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 if(!valid)return reply({ok:false,error:'Formato da imagem incompatível.'},400);
 const key=`sync/${createHash('sha256').update(bytes).digest('hex')}.${type==='image/jpeg'?'jpg':type.split('/')[1]}`;
 const imageUrl=await upload(key,bytes,type);
 return reply({ok:true,imageUrl});
}
