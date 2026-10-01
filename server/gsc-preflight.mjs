import {checkPage, sitemapUrls} from '../scripts/check-public-seo.mjs';

const fail=(code)=>({ok:false,code});

function robotsAllows(text,path){
 const groups=[];let agents=[],rules=[];
 for(const raw of text.split(/\r?\n/)){
  const line=raw.replace(/#.*$/,'').trim();if(!line)continue;
  const i=line.indexOf(':');if(i<0)continue;
  const key=line.slice(0,i).trim().toLowerCase(),value=line.slice(i+1).trim();
  if(key==='user-agent'){
   if(rules.length){groups.push({agents,rules});agents=[];rules=[];}
   agents.push(value.toLowerCase());
  }else if((key==='allow'||key==='disallow')&&agents.length)rules.push({allow:key==='allow',path:value});
 }
 if(agents.length)groups.push({agents,rules});
 const relevant=groups.filter(g=>g.agents.includes('*')||g.agents.includes('googlebot'));
 if(!relevant.length)return false;
 const matched=relevant.flatMap(g=>g.rules).filter(r=>r.path&&path.startsWith(r.path));
 if(!matched.length)return true;
 matched.sort((a,b)=>b.path.length-a.path.length);
 const longest=matched.filter(r=>r.path.length===matched[0].path.length);
 return longest.some(r=>r.allow);
}

export async function preflightArticle(url,{origin,request=fetch}={}){
 let base,target;
 try{base=new URL(origin);target=new URL(url);}catch{return fail('invalid_url');}
 if(base.protocol!=='https:'||base.username||base.password||base.pathname!=='/'||base.search||base.hash||target.protocol!=='https:'||target.origin!==base.origin||target.username||target.password||target.search||target.hash||!/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target.pathname))return fail('invalid_url');
 const read=async(path)=>request(new URL(path,base.origin).href,{redirect:'manual',signal:AbortSignal.timeout(15000)});
 try{
  let response,html;
  try{response=await read(target.href);html=await response.text();checkPage(target.href,response,html);}catch{return fail('article_invalid');}
  let sitemap;
  try{const sitemapResponse=await read('/sitemap.xml');if(sitemapResponse.status!==200)return fail('sitemap_unavailable');sitemap=sitemapUrls(await sitemapResponse.text(),new URL('/sitemap.xml',base.origin).href);}catch{return fail('sitemap_unavailable');}
  if(!sitemap.includes(target.href))return fail('sitemap_missing_article');
  let robots;
  try{const robotsResponse=await read('/robots.txt');if(robotsResponse.status!==200)return fail('robots_unavailable');robots=await robotsResponse.text();}catch{return fail('robots_unavailable');}
  return robotsAllows(robots,target.pathname)?{ok:true}:fail('robots_disallow');
 }catch{return fail('request_failed');}
}
