(function(){
  if(window.__trenzaOverridesLoaded)return;window.__trenzaOverridesLoaded=true;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function css(){
    if(document.getElementById('trenza-edge-fix-css'))return;
    var s=document.createElement('style');s.id='trenza-edge-fix-css';
    s.textContent=`
      @keyframes trenzaEdgeHero{0%{transform:scale(1.015) translate3d(0,0,0)}100%{transform:scale(1.05) translate3d(-1.15%,-.7%,0)}}
      @keyframes trenzaEdgeMarquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-33.333333%,0,0)}}
      .hero-media{animation:${reduce?'none':'trenzaEdgeHero 20s ease-in-out infinite alternate'}!important;will-change:transform}
      .marquee-track{animation:${reduce?'none':'trenzaEdgeMarquee 24s linear infinite'}!important;will-change:transform}
      @media(prefers-reduced-motion:reduce){.hero-media,.marquee-track{animation:none!important}}
      #trenzaQuickView{position:fixed;inset:0;z-index:9999;display:none;background:rgba(15,10,7,.48);padding:24px;align-items:center;justify-content:flex-end}
      #trenzaQuickView.open{display:flex}
      #trenzaQuickViewPanel{width:min(620px,100%);height:min(92vh,900px);background:#f6efe8;color:#241b16;box-shadow:-25px 0 70px rgba(0,0,0,.2);display:grid;grid-template-rows:auto 1fr auto;transform:translateX(103%);transition:transform .42s cubic-bezier(.2,.7,.2,1);overflow:hidden}
      #trenzaQuickView.open #trenzaQuickViewPanel{transform:none}
      #trenzaQuickViewHead{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid rgba(50,37,29,.16)}
      #trenzaQuickViewClose{border:0;background:none;font-size:28px;cursor:pointer;color:#241b16}
      #trenzaQuickViewBody{overflow:auto;padding:22px}
      #trenzaQuickViewBody img{width:100%;aspect-ratio:4/3;object-fit:contain;background:#e4d8cb}
      #trenzaQuickViewTag{display:inline-block;margin-top:16px;font:500 9px 'DM Sans',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#806b50}
      #trenzaQuickViewTitle{font:500 44px 'Cormorant Garamond',serif;letter-spacing:.08em;margin:8px 0 10px}
      #trenzaQuickViewDesc{font:14px/1.75 'DM Sans',sans-serif;color:#77695e;margin:0 0 18px}
      #trenzaQuickViewAdd{width:100%;min-height:52px;border:0;background:#211812;color:#fff;font:500 9px 'DM Sans',sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
      @media(max-width:680px){#trenzaQuickView{padding:0;align-items:stretch}#trenzaQuickViewPanel{width:100%;height:100%;max-height:none;transform:translateY(103%)}#trenzaQuickView.open #trenzaQuickViewPanel{transform:none}#trenzaQuickViewBody{padding:16px}#trenzaQuickViewBody img{aspect-ratio:1/1.05}#trenzaQuickViewTitle{font-size:38px}}
      @media(prefers-reduced-motion:reduce){#trenzaQuickViewPanel{transition:none!important}}
    `;document.head.appendChild(s);
  }
  function lang(){return localStorage.getItem('trenza-lang')||'tr'}
  function create(){
    if(document.getElementById('trenzaQuickView'))return;
    var q=document.createElement('div');q.id='trenzaQuickView';q.setAttribute('aria-hidden','true');
    q.innerHTML='<aside id="trenzaQuickViewPanel" role="dialog" aria-modal="true" aria-labelledby="trenzaQuickViewTitle"><div id="trenzaQuickViewHead"><span class="kicker">TRƎNZA</span><button id="trenzaQuickViewClose" type="button" aria-label="Kapat">×</button></div><div id="trenzaQuickViewBody"><img id="trenzaQuickViewImg" alt=""><span id="trenzaQuickViewTag"></span><h2 id="trenzaQuickViewTitle"></h2><p id="trenzaQuickViewDesc"></p></div><div style="padding:16px 22px;border-top:1px solid rgba(50,37,29,.16)"><button id="trenzaQuickViewAdd" type="button">ÖN KAYIT SEPETİNE EKLE</button></div></aside>';
    document.body.appendChild(q);
  }
  function boot(){
    css();create();
    var q=document.getElementById('trenzaQuickView'),panel=document.getElementById('trenzaQuickViewPanel'),close=document.getElementById('trenzaQuickViewClose'),img=document.getElementById('trenzaQuickViewImg'),tag=document.getElementById('trenzaQuickViewTag'),title=document.getElementById('trenzaQuickViewTitle'),desc=document.getElementById('trenzaQuickViewDesc'),add=document.getElementById('trenzaQuickViewAdd'),current=null;
    var files={SCULPT:'sculpt',WAVE:'wave',LUNA:'luna',FOLD:'fold',SHELL:'shell',ARIA:'aria','ÉCLAT':'eclat',NOVA:'nova',BAIA:'baia',VITA:'vita'};
    function open(card){
      current=card;var name=card.dataset.product||'';var file=files[name]||name.toLowerCase();var meta=card.querySelector('.product-meta');var t=card.querySelector('.tag');var l=lang();
      img.src='assets/products/'+file+'.jpg';img.alt='TRƎNZA '+name+' çanta';tag.textContent=t?t.textContent:'';title.textContent=name;desc.textContent=l==='en'?(meta?meta.dataset.metaEn:''):(meta?meta.dataset.metaTr:'');
      add.dataset.product=name;q.classList.add('open');q.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';history.pushState({trenzaProduct:name},'',location.pathname+location.search+'#product-'+file);setTimeout(function(){close.focus()},20);
    }
    function shut(fromHistory){q.classList.remove('open');q.setAttribute('aria-hidden','true');document.body.style.overflow='';if(fromHistory&&location.hash.indexOf('#product-')===0)history.pushState({},'',location.pathname+location.search);if(current)current.focus()}
    document.addEventListener('click',function(e){var card=e.target.closest&&e.target.closest('.product');if(!card||e.target.closest('.add-cart'))return;open(card)});
    document.addEventListener('keydown',function(e){var card=e.target.closest&&e.target.closest('.product');if(card&&!e.target.closest('.add-cart')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open(card);return}if(q.classList.contains('open')&&e.key==='Escape'){e.preventDefault();shut(true);return}if(q.classList.contains('open')&&e.key==='Tab'){var f=panel.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    close.addEventListener('click',function(){shut(true)});q.addEventListener('click',function(e){if(e.target===q)shut(true)});
    add.addEventListener('click',function(){var name=add.dataset.product;if(!name)return;var existing=document.querySelector('.add-cart[data-add="'+CSS.escape(name)+'"]');if(existing){existing.click();shut(false);return}var cart={};try{cart=JSON.parse(localStorage.getItem('trenza-cart')||'{}')}catch(e){}cart[name]=(cart[name]||0)+1;localStorage.setItem('trenza-cart',JSON.stringify(cart));var count=document.getElementById('cartCount');if(count)count.textContent=Object.values(cart).reduce(function(a,b){return a+b},0);shut(false)});
    window.addEventListener('popstate',function(){if(q.classList.contains('open'))shut(false)});
    if(location.hash.indexOf('#product-')===0){var key=location.hash.slice(9);setTimeout(function(){var n=Object.keys(files).find(function(k){return files[k]===key});var c=n&&document.querySelector('.product[data-product="'+CSS.escape(n)+'"]');if(c)open(c)},30)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Keep the visible cart badge alive after the legacy language layer replaces the cart button label. */
(function(){
  function sync(){
    var btn=document.getElementById('cartBtn');if(!btn)return;
    var span=document.getElementById('cartCount');if(!span){span=document.createElement('span');span.id='cartCount';span.textContent='0';btn.appendChild(span)}
    try{var cart=JSON.parse(localStorage.getItem('trenza-cart')||'{}');span.textContent=Object.values(cart).reduce(function(a,b){return a+Number(b||0)},0)}catch(e){span.textContent='0'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){sync();setInterval(sync,250)},{once:true});else{sync();setInterval(sync,250)}
})();
