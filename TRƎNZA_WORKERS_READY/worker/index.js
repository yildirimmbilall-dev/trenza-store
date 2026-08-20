import { onRequest as preRegister } from '../functions/api/pre-register.js';
import { onRequest as preOrder } from '../functions/api/preorder.js';
import { onRequest as health } from '../functions/api/health.js';

const notFound = () => new Response(JSON.stringify({ ok: false, error: 'not_found' }), {
  status: 404,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin'
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/pre-register') {
      return preRegister({ request, env, ctx });
    }

    if (url.pathname === '/api/preorder') {
      return preOrder({ request, env, ctx });
    }

    if (url.pathname === '/api/health') {
      return health({ request, env, ctx });
    }

    if (url.pathname.startsWith('/api/')) {
      return notFound();
    }

    // Serve the real hero asset from /public/assets.
    // Do not replace hero.jpg / hero.webp with the legacy editorial SVG.
    if (url.pathname === '/assets/hero.webp' || url.pathname === '/assets/hero.jpg') {
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set('cache-control', 'no-cache, must-revalidate');
      return new Response(response.body, { status: response.status, headers });
    }

    return env.ASSETS.fetch(request);
  }
};
