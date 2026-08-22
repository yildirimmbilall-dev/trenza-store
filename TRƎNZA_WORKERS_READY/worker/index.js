import { onRequestPost as leadPost, onRequestOptions as leadOptions } from '../functions/api/lead.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

function withMotion(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
  headers.set('pragma', 'no-cache');
  headers.set('expires', '0');
  const html = new HTMLRewriter()
    .on('head', { element(el) { el.append('<link rel="stylesheet" href="/trenza-motion.css?v=20260822" data-trenza-motion="live">', { html: true }); } })
    .on('body', { element(el) { el.append('<script src="/trenza-motion.js?v=20260822" defer></script>', { html: true }); } })
    .transform(response);
  return new Response(html.body, { status: html.status, statusText: html.statusText, headers });
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
    return withMotion(await env.ASSETS.fetch(request));
  }
};
