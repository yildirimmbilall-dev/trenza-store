/* TRƎNZA commerce configuration */
window.TRENZA_COMMERCE = {
  mode: 'preorder',
  currency: null,
  paymentProvider: null,
  preRegisterEndpoint: '/api/pre-register',
  preorderEndpoint: '/api/preorder',
  checkoutEndpoint: '/api/preorder',
  launchReady: false
};

/* Same-page navigation. */
(function(){
  function init(){
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click',function(e){
        var href=link.getAttribute('href'); if(!href||href==='#')return;
        var target=document.getElementById(href.slice(1)); if(!target)return;
        e.preventDefault(); if(history.pushState)history.pushState(null,'',href); else location.hash=href.slice(1);
        var menu=document.getElementById('links'),btn=document.getElementById('menu'); if(menu)menu.classList.remove('open'); if(btn)btn.setAttribute('aria-expanded','false');
        requestAnimationFrame(function(){target.scrollIntoView({behavior:'smooth',block:'start'});});
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Premium language switch styling + small legacy compatibility layer. */
(function(){
  function init(){
    if(!document.getElementById('trenza-lang-style')){var s=document.createElement('style');s.id='trenza-lang-style';s.textContent='.lang-switch{display:flex!important;align-items:center;gap:2px;padding:3px;border:1px solid rgba(216,191,151,.28)!important;border-radius:999px!important;background:rgba(18,11,7,.28)!important;backdrop-filter:blur(12px)}.lang-switch button{min-width:34px;height:28px;padding:0 9px!important;border:0!important;border-radius:999px!important;background:transparent!important;color:rgba(247,238,228,.58)!important;font:600 9px DM Sans,sans-serif!important;letter-spacing:.14em!important}.lang-switch button.active{background:linear-gradient(180deg,#d8bf97,#c2a477)!important;color:#211812!important}';document.head.appendChild(s)}

    var early=document.getElementById('earlyForm');
    if(early&&!early.querySelector('[data-trenza-consent]')){
      var wrap=document.createElement('div');wrap.className='consent';wrap.style.cssText='display:flex;align-items:flex-start;gap:10px;margin-top:12px;font-size:10px;line-height:1.6;color:#9f8d7f;text-align:left';
      wrap.innerHTML='<input data-trenza-consent id="legacyEarlyConsent" name="consent" type="checkbox" required style="width:16px;height:16px;margin:1px 0 0;accent-color:#c2a477"><label for="legacyEarlyConsent" style="cursor:pointer">Ön kayıt ve bilgilendirme talebim için bilgilerimin kullanılmasını kabul ediyorum.</label>';
      var button=early.querySelector('button[type="submit"]'); early.insertBefore(wrap,button);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Legacy index compatibility: inject consent into the JSON payload sent by the old inline form handler. */
(function(){
  var originalFetch=window.fetch;
  if(!originalFetch||window.__trenzaFetchShim)return; window.__trenzaFetchShim=true;
  window.fetch=function(input,init){
    try{
      if(init&&typeof init.body==='string'){
        var payload=JSON.parse(init.body);
        if(payload&&payload.type==='early-access'){
          var checkbox=document.getElementById('legacyEarlyConsent')||document.getElementById('earlyConsent');
          payload.consent=!!(checkbox&&checkbox.checked);
          payload.language=(localStorage.getItem('trenza-lang')||'tr');
          init=Object.assign({},init,{body:JSON.stringify(payload)});
        }
      }
    }catch(e){}
    return originalFetch.call(this,input,init);
  };
})();

/* Preserve the premium cord wording. */
(function(){
  function apply(lang){var en=lang==='en';document.querySelectorAll('[data-i18n="d2_title"]').forEach(function(el){el.textContent=en?'PREMIUM CORD':'PREMIUM KORDON'});document.querySelectorAll('[data-i18n="d2_p"]').forEach(function(el){el.textContent=en?'High-quality, shape-retaining premium cord yarns are used.':'Yüksek kaliteli, şekil tutan premium kordon iplikler kullanılır.'})}
  function bind(){apply(localStorage.getItem('trenza-lang')||'tr');document.querySelectorAll('[data-lang]').forEach(function(btn){btn.addEventListener('click',function(){setTimeout(function(){apply(btn.dataset.lang)},0)},{once:false})})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();

/* Product keyboard accessibility. */
(function(){
  function init(){document.querySelectorAll('.product').forEach(function(card){card.tabIndex=0;card.setAttribute('role','button');if(!card.getAttribute('aria-label'))card.setAttribute('aria-label',(card.dataset.product||'')+' — detayları gör')})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();setTimeout(init,700);
})();
