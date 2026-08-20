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
