import { onRequest as preRegister } from '../functions/api/pre-register.js';
import { onRequest as preOrder } from '../functions/api/preorder.js';
import { onRequestPost as leadPost,onRequestOptions as leadOptions } from '../functions/api/lead.js';
import { onRequest as health } from '../functions/api/health.js';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export default{async fetch(request,env,ctx){const url=new URL(request.url);
 if(url.pathname==='/api/lead'){if(request.method==='OPTIONS')return leadOptions({request,env,ctx});if(request.method==='POST')return leadPost({request,env,ctx});return json({ok:false,error:'method_not_allowed'},405);}
 if(url.pathname==='/api/pre-register')return preRegister({request,env,ctx});
 if(url.pathname==='/api/preorder')return preOrder({request,env,ctx});
 if(url.pathname==='/api/health')return health({request,env,ctx});
 if(url.pathname.startsWith('/api/'))return json({ok:false,error:'not_found'},404);
 const response=await env.ASSETS.fetch(request);const headers=new Headers(response.headers);if((headers.get('content-type')||'').includes('text/html')){headers.set('cache-control','no-store, no-cache, must-revalidate, max-age=0');headers.set('pragma','no-cache');headers.set('expires','0');}
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};