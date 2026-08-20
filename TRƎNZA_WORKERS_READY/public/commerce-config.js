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
