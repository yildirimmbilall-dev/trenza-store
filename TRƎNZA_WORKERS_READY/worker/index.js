import { onRequest as preRegister } from '../functions/api/pre-register.js';
import { onRequest as preOrder } from '../functions/api/preorder.js';
import { onRequest as health } from '../functions/api/health.js';

const notFound = () => new Response(JSON.stringify({ ok: false, error: 'not_found' }), { status: 404, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export default { async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === '/api/pre-register') return preRegister({ request, env, ctx });
  if (url.pathname === '/api/preorder') return preOrder({ request, env, ctx });
  if (url.pathname === '/api/health') return health({ request, env, ctx });
  if (url.pathname.startsWith('/api/')) return notFound();
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  const contentType = headers.get('content-type') || '';
  if (url.pathname === '/assets/hero.webp' || url.pathname === '/assets/hero.jpg') {
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0'); headers.set('pragma', 'no-cache'); headers.set('expires', '0');
  }
  if (contentType.includes('text/html')) {
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0'); headers.set('pragma', 'no-cache'); headers.set('expires', '0');
    let body = await response.text();
    if (!body.includes('trenza-edge-overrides.js')) body = body.replace(/<\/body>/i, '<script src="/assets/trenza-edge-overrides.js" defer></script></body>');
    return new Response(body, { status: response.status, statusText: response.statusText, headers });
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };