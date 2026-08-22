import { onRequestPost as leadPost, onRequestOptions as leadOptions } from '../functions/api/lead.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

function noCacheHtml(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
  headers.set('pragma', 'no-cache');
  headers.set('expires', '0');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/lead') {
      if (request.method === 'OPTIONS') return leadOptions({ request, env, ctx });
      if (request.method === 'POST') return leadPost({ request, env, ctx });
      return json({ ok: false, error: 'method_not_allowed' }, 405);
    }

    if (url.pathname === '/api/health') return json({ ok: true, service: 'trenza-store' });
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);

    // The final ZIP already contains its own motion/video implementation.
    // Do not inject legacy motion CSS/JS that are not part of the final package.
    return noCacheHtml(await env.ASSETS.fetch(request));
  }
};
