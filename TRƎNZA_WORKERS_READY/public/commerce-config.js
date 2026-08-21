/* TRƎNZA commerce configuration
   Current mode: PRE-REGISTRATION / PRE-ORDER
   No payment is collected until a real payment provider and merchant account are connected.

   checkoutEndpoint: set this to a URL that accepts a POST request with a JSON body
   ({type, email, name?, items?, note?, createdAt}) to make the "Ön Kayıt" and
   "Ön Sipariş" forms save leads to a real list instead of opening the visitor's
   email app. Until this is set, both forms fall back to mailto:hello@trenza.com.tr.

   Easiest options to get a URL for this field:
   - Formspree (formspree.io) — free tier, just create a form and paste its endpoint
   - Web3Forms (web3forms.com) — free, no backend needed
   - A small Cloudflare Worker that writes to KV/D1 or forwards to Cloudflare Email Routing
   Any of these can be wired up without touching this site's code again — only this
   one value needs to change.
*/
window.TRENZA_COMMERCE = {
  mode: 'preorder',
  currency: null,
  paymentProvider: null,
  checkoutEndpoint: null,
  launchReady: false
};

/* Same-page navigation guard: internal section links never reload the site. */
(function () {
  function initTrenzaNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var targetId = href.slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
        var menu = document.getElementById('links');
        var menuButton = document.getElementById('menu');
        if (menu) menu.classList.remove('open');
        if (menuButton) {
          menuButton.textContent = '☰';
          menuButton.setAttribute('aria-expanded', 'false');
        }
        requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrenzaNavigation, { once: true });
  } else {
    initTrenzaNavigation();
  }
})();

/* Premium TR / EN switch. */
(function () {
  function mountLanguageStyles() {
    if (document.getElementById('trenza-lang-premium-style')) return;
    var style = document.createElement('style');
    style.id = 'trenza-lang-premium-style';
    style.textContent = `
      .lang-switch{display:flex!important;align-items:center;gap:2px;padding:3px;border:1px solid rgba(216,191,151,.28)!important;border-radius:999px!important;background:rgba(18,11,7,.28)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03),0 8px 24px rgba(0,0,0,.12)}
      .lang-switch button{min-width:34px;height:28px;padding:0 9px!important;border:0!important;border-radius:999px!important;background:transparent!important;color:rgba(247,238,228,.58)!important;font:600 9px 'DM Sans',sans-serif!important;letter-spacing:.14em!important;line-height:28px;cursor:pointer;transition:background .25s ease,color .25s ease,transform .25s ease,box-shadow .25s ease}
      .lang-switch button:hover{color:#f7eee4!important;transform:translateY(-1px)}
      .lang-switch button.active{background:linear-gradient(180deg,#d8bf97,#c2a477)!important;color:#211812!important;box-shadow:0 3px 10px rgba(194,164,119,.28),inset 0 1px 0 rgba(255,255,255,.35)}
      @media(max-width:680px){.lang-switch{padding:2px!important}.lang-switch button{min-width:31px;height:26px;line-height:26px;padding:0 8px!important;font-size:8px!important}}
    `;
    document.head.appendChild(style);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountLanguageStyles, { once:true }); else mountLanguageStyles();
})();

/* Final accessibility enhancement for product cards. */
(function () {
  function enhanceProductKeyboardAccess() {
    if (!document.getElementById('trenza-a11y-product-style')) {
      var style = document.createElement('style');
      style.id = 'trenza-a11y-product-style';
      style.textContent = '.product:focus-visible{outline:2px solid #c2a477;outline-offset:3px}';
      document.head.appendChild(style);
    }
    document.querySelectorAll('.product').forEach(function (card) {
      card.setAttribute('tabindex','0'); card.setAttribute('role','button');
      if (!card.getAttribute('aria-label')) card.setAttribute('aria-label',(card.dataset.product||'')+' — detayları gör');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceProductKeyboardAccess, { once:true }); else enhanceProductKeyboardAccess();
  setTimeout(enhanceProductKeyboardAccess,700);
})();

/* Preserve the user's premium cord/material wording in both languages. */
(function () {
  function applyPremiumMaterialCopy(lang) {
    var isEN = lang === 'en';
    document.querySelectorAll('[data-i18n="d2_title"]').forEach(function (el) { el.textContent = isEN ? 'PREMIUM CORD' : 'PREMIUM KORDON'; });
    document.querySelectorAll('[data-i18n="d2_p"]').forEach(function (el) { el.textContent = isEN ? 'High-quality, shape-retaining premium cord yarns are used.' : 'Yüksek kaliteli, şekil tutan premium kordon iplikler kullanılır.'; });
  }
  function bind() {
    applyPremiumMaterialCopy(localStorage.getItem('trenza-lang') || 'tr');
    document.querySelectorAll('[data-lang]').forEach(function (button) {
      if (button.dataset.premiumCopyBound === '1') return;
      button.dataset.premiumCopyBound = '1';
      button.addEventListener('click', function () { setTimeout(function () { applyPremiumMaterialCopy(button.dataset.lang); },0); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once:true }); else bind();
})();

/* HARDENED FALLBACK: keep motion running and Quick View working even if the inline page script fails. */
(function () {
  function boot() {
    try {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var styleId='trenza-motion-fallback-style';
      if (!document.getElementById(styleId)) {
        var s=document.createElement('style'); s.id=styleId;
        s.textContent=`
          .hero-media{animation:${reduce?'none':'trenzaHeroFallback 18s ease-in-out infinite alternate'};transform-origin:center center;}
          .marquee-track{width:max-content;animation:${reduce?'none':'trenzaMarqueeFallback 24s linear infinite'};}
          @keyframes trenzaHeroFallback{0%{transform:scale(1.01) translate3d(0,0,0)}100%{transform:scale(1.045) translate3d(-1.2%,-.7%,0)}}
          @keyframes trenzaMarqueeFallback{from{transform:translate3d(0,0,0)}to{transform:translate3d(-33.333333%,0,0)}}
          @media (max-width:680px){.hero-media{animation:${reduce?'none':'trenzaHeroFallbackMobile 20s ease-in-out infinite alternate'};}@keyframes trenzaHeroFallbackMobile{0%{transform:scale(1.01) translate3d(0,0,0)}100%{transform:scale(1.04) translate3d(-.7%,-.5%,0)}}}
          @media(prefers-reduced-motion:reduce){.hero-media,.marquee-track{animation:none!important}}
        `; document.head.appendChild(s);
      }

      var qv=document.getElementById('productQuickview');
      var panel=document.getElementById('productQuickviewPanel');
      if (!qv || !panel) return;
      var backdrop=document.getElementById('productQuickviewBackdrop');
      var close=document.getElementById('productQuickviewClose');
      var picture=document.getElementById('productQuickviewPicture');
      var title=document.getElementById('productQuickviewTitle');
      var desc=document.getElementById('productQuickviewDescription');
      var series=document.getElementById('productQuickviewSeries');
      var add=document.getElementById('productQuickviewAdd');
      var current=null;
      var map={SCULPT:'sculpt',WAVE:'wave',LUNA:'luna',FOLD:'fold',SHELL:'shell',ARIA:'aria','ÉCLAT':'eclat',NOVA:'nova',BAIA:'baia',VITA:'vita'};
      var open=function(card,push){
        current=card;
        var name=card.dataset.product||''; var file=map[name]||name.toLowerCase();
        var meta=card.querySelector('.product-meta'); var tag=card.querySelector('.tag');
        picture.innerHTML='<source srcset="assets/products/'+file+'.webp" type="image/webp"><img src="assets/products/'+file+'.jpg" alt="TRƎNZA '+name+' çanta">';
        title.textContent=name; desc.textContent=(meta && meta.textContent)||''; series.textContent=(tag&&tag.textContent)||''; add.dataset.add=name;
        qv.classList.add('open'); qv.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
        if(push) history.pushState({product:name},'',location.pathname+location.search+'#product-'+file);
        setTimeout(function(){ if(close) close.focus(); },20);
      };
      var shut=function(clear){
        qv.classList.remove('open'); qv.setAttribute('aria-hidden','true'); document.body.style.overflow='';
        if(clear && location.hash.indexOf('#product-')===0) history.pushState({},'',location.pathname+location.search);
        if(current) current.focus();
      };
      if (!qv.dataset.fallbackBound) {
        qv.dataset.fallbackBound='1';
        document.addEventListener('click',function(e){var card=e.target.closest && e.target.closest('.product'); if(card && !e.target.closest('.add-cart')) open(card,true);});
        document.addEventListener('keydown',function(e){
          var card=e.target.closest && e.target.closest('.product');
          if(card && !e.target.closest('.add-cart') && (e.key==='Enter'||e.key===' ')){e.preventDefault();open(card,true);return;}
          if(qv.classList.contains('open') && e.key==='Escape'){e.preventDefault();shut(true);return;}
          if(qv.classList.contains('open') && e.key==='Tab'){var fs=panel.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');if(fs.length){var f=fs[0],l=fs[fs.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}}
        });
        close&&close.addEventListener('click',function(){shut(true)}); backdrop&&backdrop.addEventListener('click',function(){shut(true)});
        add&&add.addEventListener('click',function(){var n=add.dataset.add;if(!n)return;var c={};try{c=JSON.parse(localStorage.getItem('trenza-cart')||'{}')}catch(e){}c[n]=(c[n]||0)+1;localStorage.setItem('trenza-cart',JSON.stringify(c));shut(false);var cart=document.getElementById('cartCount');if(cart)cart.textContent=Object.values(c).reduce(function(a,b){return a+b},0)});
      }
    } catch (err) { console.warn('TRƎNZA fallback layer:',err); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
