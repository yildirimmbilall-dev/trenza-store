const ALLOWED_ORIGINS=new Set(['https://trenza.com.tr','https://www.trenza.com.tr']);
const TO='hello@trenza.com.tr';
const FROM='TRƎNZA <hello@trenza.com.tr>';
const corsHeaders=origin=>({'Access-Control-Allow-Origin':ALLOWED_ORIGINS.has(origin)?origin:(!origin?'https://trenza.com.tr':'null'),'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'});
const json=(data,status,origin)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...corsHeaders(origin)}});
const clean=(v,max=2000)=>String(v??'').trim().slice(0,max);
export async function onRequestOptions({request}){return new Response(null,{status:204,headers:corsHeaders(request.headers.get('Origin')||'')});}
export async function onRequestPost({request,env}){
 const origin=request.headers.get('Origin')||'';
 if(origin&&!ALLOWED_ORIGINS.has(origin))return json({ok:false,error:'origin'},403,origin);
 if(!env.RESEND_API_KEY)return json({ok:false,error:'server_not_configured'},503,origin);
 let body;try{body=await request.json();}catch{return json({ok:false,error:'invalid_json'},400,origin);}
 if(clean(body?.website,100))return new Response(null,{status:204,headers:corsHeaders(origin)});
 const type=body?.type==='early-access'?'early-access':body?.type==='preorder'?'preorder':null;
 if(!type)return json({ok:false,error:'invalid_type'},400,origin);
 const email=clean(body.email,254);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({ok:false,error:'invalid_email'},400,origin);
 const name=clean(body.name,160),items=clean(body.items,1200),note=clean(body.note,2000),createdAt=clean(body.createdAt,80);
 const esc=v=>clean(v,4000).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const subject=type==='preorder'?'TRƎNZA · Yeni Ön Sipariş Talebi':'TRƎNZA · Yeni Erken Erişim Kaydı';
 const text=type==='preorder'?`Yeni TRƎNZA ön sipariş talebi\n\nAd Soyad: ${name}\nE-posta: ${email}\nSeçimler: ${items||'Belirtilmedi'}\nNot: ${note||'Yok'}\nTarih: ${createdAt||new Date().toISOString()}`:`Yeni TRƎNZA erken erişim kaydı\n\nE-posta: ${email}\nTarih: ${createdAt||new Date().toISOString()}`;
 const html=`<div style="font-family:Arial,Helvetica,sans-serif;color:#241b16;line-height:1.6"><h2>${subject}</h2><p><strong>E-posta:</strong> ${esc(email)}</p>${type==='preorder'?`<p><strong>Ad Soyad:</strong> ${esc(name||'Belirtilmedi')}</p><p><strong>Seçimler:</strong> ${esc(items||'Belirtilmedi')}</p><p><strong>Not:</strong> ${esc(note||'Yok')}</p>`:''}<p><strong>Tarih:</strong> ${esc(createdAt||new Date().toISOString())}</p></div>`;
 const resend=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:FROM,to:[TO],reply_to:[email],subject,text,html})});
 if(!resend.ok)return json({ok:false,error:'email_provider'},502,origin);
 return json({ok:true},200,origin);
}