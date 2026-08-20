/* TRƎNZA commerce configuration
   PRE-LAUNCH: no payment is collected.
   Cloudflare Pages Functions + D1 handle registrations/pre-order requests.
*/
window.TRENZA_COMMERCE = {
  mode: 'prelaunch',
  currency: null,
  paymentProvider: null,
  launchReady: false,
  api: {
    preRegister: '/api/pre-register',
    preorder: '/api/preorder',
    health: '/api/health'
  }
};

/* Mobile form correction: the generic .form input rule must not style the consent checkbox. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
    .consent-row input[type="checkbox"]{
      width:18px !important;
      min-width:18px !important;
      max-width:18px !important;
      height:18px !important;
      min-height:18px !important;
      padding:0 !important;
      margin:3px 0 0 !important;
      flex:0 0 18px !important;
      border:0 !important;
      box-sizing:border-box !important;
    }
    .consent-row span{
      min-width:0 !important;
      overflow-wrap:anywhere;
      word-break:normal;
    }
    @media(max-width:680px){
      html,body{overflow-x:hidden !important;max-width:100% !important;}
      .launch-inner,.launch-inner .form,.launch-inner .fine,.consent-row{width:100%;max-width:100%;}
      .launch h2{max-width:100%;overflow-wrap:normal;}
    }
    #early,#collection,#models,#atelier,#details,#guide{scroll-margin-top:72px;}
  `;
  document.head.appendChild(css);
})();

/* PRE-LAUNCH HERO: replace only the removed storefront/interior photograph. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
    .hero picture{display:none !important;}
    .hero > .hero-media{display:none !important;}
    .hero{
      background-color:var(--espresso) !important;
      background-image:url('assets/hero-editorial.svg') !important;
      background-size:cover !important;
      background-position:center center !important;
      background-repeat:no-repeat !important;
    }
    @media(max-width:680px){
      .hero{background-position:62% center !important;}
    }
  `;
  document.head.appendChild(css);
})();
