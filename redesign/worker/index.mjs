import release from '../release.json' with {type:'json'};
export function parseRange(value,size){
  const m=/^bytes=(\d*)-(\d*)$/.exec(value||'');if(!m||(!m[1]&&!m[2]))return null;
  let start,end;
  if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return null;start=Math.max(0,size-suffix);end=size-1;}
  else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end))return null;end=Math.min(end,size-1);}
  return start>=0&&start<size&&end>=start?{offset:start,length:end-start+1}:null;
}
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
function secure(response,pathname){
 const result=new Response(response.body,response);for(const [key,value] of Object.entries(security))result.headers.set(key,value);
 if(!pathname.startsWith('/explo/')&&!pathname.startsWith('/stackoverflow/'))result.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'");
 else result.headers.set('Content-Security-Policy',"frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests");
 return result;
}
export default {async fetch(request,env){
 const url=new URL(request.url),pathname=url.pathname;
 if(!['GET','HEAD'].includes(request.method))return secure(new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}}),pathname);
 if(url.hostname==='www.javid.me')return secure(Response.redirect(`https://javid.me${pathname}${url.search}`,308),pathname);
 if(pathname==='/_health'){
  let media=null;try{media=await env.MEDIA.head(release.media.key);}catch{}
  const ready=media?.size===release.media.bytes;
  return secure(new Response(request.method==='HEAD'?null:JSON.stringify({service:release.service,status:ready?'ok':'degraded',sourceRevision:release.sourceRevision,artifactSha256:release.artifactSha256,hosting:'cloudflare-workers',dependencies:{media:ready?'ready':'unavailable'},observedAt:new Date().toISOString()}),{status:ready?200:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}),pathname);
 }
 if(pathname==='/explo/video.mp4'){
  let meta;try{meta=await env.MEDIA.head(release.media.key);}catch{return secure(new Response('Media temporarily unavailable',{status:503}),pathname);}
  if(!meta)return secure(new Response('Media unavailable',{status:503}),pathname);
  const headers=new Headers({'Content-Type':'video/mp4','Content-Disposition':'inline; filename="video.mp4"','Content-Length':String(meta.size),'Accept-Ranges':'bytes',ETag:meta.httpEtag,'Cache-Control':'public, max-age=3600'});
  const matches=request.headers.get('If-None-Match')?.split(',').some(v=>v.trim()===meta.httpEtag||v.trim()==='*');
  if(matches)return secure(new Response(null,{status:304,headers}),pathname);
  const requested=request.headers.get('Range'),ifRange=request.headers.get('If-Range');
  const range=requested&&(!ifRange||ifRange===meta.httpEtag)?parseRange(requested,meta.size):undefined;
  if(range===null){headers.set('Content-Range',`bytes */${meta.size}`);headers.delete('Content-Length');return secure(new Response(null,{status:416,headers}),pathname);}
  if(range){headers.set('Content-Length',String(range.length));headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${meta.size}`);}
  if(request.method==='HEAD')return secure(new Response(null,{status:range?206:200,headers}),pathname);
  let object;try{object=await env.MEDIA.get(release.media.key,range?{range}:undefined);}catch{return secure(new Response('Media temporarily unavailable',{status:503}),pathname);}
  if(!object)return secure(new Response('Media unavailable',{status:503}),pathname);
  return secure(new Response(object.body,{status:range?206:200,headers}),pathname);
 }
 if(pathname==='/new'||pathname.startsWith('/new/'))return secure(Response.redirect(new URL('/',request.url).href,308),pathname);
 if(pathname==='/resume.pdf')return secure(new Response('This public resume is no longer current. Please visit the homepage.',{status:410,headers:{'Content-Type':'text/plain; charset=utf-8'}}),pathname);
 return secure(await env.ASSETS.fetch(request),pathname);
}};
