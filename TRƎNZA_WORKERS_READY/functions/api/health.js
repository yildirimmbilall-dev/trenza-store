import { json, methodNotAllowed } from './_utils.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ok: false, database: 'not_configured' }, 503);
  try {
    const row = await env.DB.prepare('SELECT 1 AS ok').first();
    return json({ ok: row?.ok === 1, database: 'connected' });
  } catch (error) {
    console.error('health check failed', error);
    return json({ ok: false, database: 'error' }, 500);
  }
}

export async function onRequest({ request, ...rest }) {
  if (request.method === 'GET') return onRequestGet({ request, ...rest });
  return methodNotAllowed();
}
