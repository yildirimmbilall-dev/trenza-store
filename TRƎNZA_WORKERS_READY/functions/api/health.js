import { json, methodNotAllowed } from './_utils.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, database: 'not_configured', resend: env.RESEND_API_KEY ? 'configured' : 'not_configured' }, 503);
  try {
    const row = await env.DB.prepare('SELECT 1 AS ok').first();
    return json({ ok: row?.ok === 1, database: 'connected', resend: env.RESEND_API_KEY ? 'configured' : 'not_configured' });
  } catch (error) {
    console.error('health check failed', error);
    return json({ ok: false, database: 'error', resend: env.RESEND_API_KEY ? 'configured' : 'not_configured' }, 500);
  }
}

export async function onRequest({ request, ...rest }) {
  if (request.method === 'GET') return onRequestGet({ request, ...rest });
  return methodNotAllowed();
}
