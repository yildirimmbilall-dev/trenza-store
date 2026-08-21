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
  checkoutEndpoint: null, // e.g. 'https://formspree.io/f/xxxxxxx'
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

/* Premium TR / EN switch — kept in this config file so the HTML structure stays untouched. */
(function () {
  function mountLanguageStyles() {
    if (document.getElementById('trenza-lang-premium-style')) return;
    var style = document.createElement('style');
    style.id = 'trenza-lang-premium-style';
    style.textContent = `
      .lang-switch{
        display:flex!important;
        align-items:center;
        gap:2px;
        padding:3px;
        border:1px solid rgba(216,191,151,.28)!important;
        border-radius:999px!important;
        background:rgba(18,11,7,.28)!important;
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.03),0 8px 24px rgba(0,0,0,.12);
      }
      .lang-switch button{
        min-width:34px;
        height:28px;
        padding:0 9px!important;
        border:0!important;
        border-radius:999px!important;
        background:transparent!important;
        color:rgba(247,238,228,.58)!important;
        font:600 9px 'DM Sans',sans-serif!important;
        letter-spacing:.14em!important;
        line-height:28px;
        cursor:pointer;
        transition:background .25s ease,color .25s ease,transform .25s ease,box-shadow .25s ease;
      }
      .lang-switch button:hover{color:#f7eee4!important;transform:translateY(-1px)}
      .lang-switch button.active{
        background:linear-gradient(180deg,#d8bf97,#c2a477)!important;
        color:#211812!important;
        box-shadow:0 3px 10px rgba(194,164,119,.28),inset 0 1px 0 rgba(255,255,255,.35);
      }
      .nav.scrolled .lang-switch{
        border-color:rgba(194,164,119,.34)!important;
        background:rgba(33,24,18,.72)!important;
      }
      .nav.scrolled .lang-switch button{color:rgba(238,231,223,.62)!important}
      .nav.scrolled .lang-switch button.active{color:#211812!important}
      @media(max-width:680px){
        .lang-switch{padding:2px!important}
        .lang-switch button{min-width:31px;height:26px;line-height:26px;padding:0 8px!important;font-size:8px!important}
      }
      @media(prefers-reduced-motion:reduce){.lang-switch button{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountLanguageStyles, { once: true });
  } else {
    mountLanguageStyles();
  }
})();
