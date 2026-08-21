/* TRƎNZA commerce configuration
   Current mode: PRE-REGISTRATION / PRE-ORDER.
   The site posts to the same-origin Cloudflare Worker API. The Worker validates
   and stores submissions in D1 and sends an owner notification through Resend.
   No payment is collected until a real payment provider and merchant account are connected.
*/
window.TRENZA_COMMERCE = {
  mode: 'preorder',
  currency: null,
  paymentProvider: null,
  preRegisterEndpoint: '/api/pre-register',
  preorderEndpoint: '/api/preorder',
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
        if (window.history && window.history.pushState) window.history.pushState(null, '', '#' + targetId); else window.location.hash = targetId;
        var menu = document.getElementById('links');
        var menuButton = document.getElementById('menu');
        if (menu) menu.classList.remove('open');
        if (menuButton) { menuButton.textContent = '☰'; menuButton.setAttribute('aria-expanded', 'false'); }
        requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTrenzaNavigation, { once: true }); else initTrenzaNavigation();
})();

/* Premium TR / EN switch. */
(function () {
  function mountLanguageStyles() {
    if (document.getElementById('trenza-lang-premium-style')) return;
    var style = document.createElement('style'); style.id = 'trenza-lang-premium-style';
    style.textContent = `.lang-switch{display:flex!important;align-items:center;gap:2px;padding:3px;border:1px solid rgba(216,191,151,.28)!important;border-radius:999px!important;background:rgba(18,11,7,.28)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03),0 8px 24px rgba(0,0,0,.12)}.lang-switch button{min-width:34px;height:28px;padding:0 9px!important;border:0!important;border-radius:999px!important;background:transparent!important;color:rgba(247,238,228,.58)!important;font:600 9px 'DM Sans',sans-serif!important;letter-spacing:.14em!important;line-height:28px;cursor:pointer;transition:background .25s ease,color .25s ease,transform .25s ease,box-shadow .25s ease}.lang-switch button:hover{color:#f7eee4!important;transform:translateY(-1px)}.lang-switch button.active{background:linear-gradient(180deg,#d8bf97,#c2a477)!important;color:#211812!important;box-shadow:0 3px 10px rgba(194,164,119,.28),inset 0 1px 0 rgba(255,255,255,.35)}@media(max-width:680px){.lang-switch{padding:2px!important}.lang-switch button{min-width:31px;height:26px;line-height:26px;padding:0 8px!important;font-size:8px!important}}`;
    document.head.appendChild(style);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountLanguageStyles, { once:true }); else mountLanguageStyles();
})();

/* Final accessibility enhancement for product cards. */
(function () {
  function enhanceProductKeyboardAccess() {
    if (!document.getElementById('trenza-a11y-product-style')) { var style = document.createElement('style'); style.id = 'trenza-a11y-product-style'; style.textContent = '.product:focus-visible{outline:2px solid #c2a477;outline-offset:3px}'; document.head.appendChild(style); }
    document.querySelectorAll('.product').forEach(function (card) { card.setAttribute('tabindex','0'); card.setAttribute('role','button'); if (!card.getAttribute('aria-label')) card.setAttribute('aria-label',(card.dataset.product||'')+' — detayları gör'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceProductKeyboardAccess, { once:true }); else enhanceProductKeyboardAccess();
  setTimeout(enhanceProductKeyboardAccess,700);
})();

/* Preserve the premium cord wording in both languages. */
(function () {
  function applyPremiumMaterialCopy(lang) {
    var isEN = lang === 'en';
    document.querySelectorAll('[data-i18n="d2_title"]').forEach(function (el) { el.textContent = isEN ? 'PREMIUM CORD' : 'PREMIUM KORDON'; });
    document.querySelectorAll('[data-i18n="d2_p"]').forEach(function (el) { el.textContent = isEN ? 'High-quality, shape-retaining premium cord yarns are used.' : 'Yüksek kaliteli, şekil tutan premium kordon iplikler kullanılır.'; });
  }
  function bind() {
    applyPremiumMaterialCopy(localStorage.getItem('trenza-lang') || 'tr');
    document.querySelectorAll('[data-lang]').forEach(function (button) { if (button.dataset.premiumCopyBound === '1') return; button.dataset.premiumCopyBound = '1'; button.addEventListener('click', function () { setTimeout(function () { applyPremiumMaterialCopy(button.dataset.lang); },0); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once:true }); else bind();
})();
