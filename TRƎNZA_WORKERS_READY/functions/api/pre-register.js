import { json, methodNotAllowed, options, assertSameOrigin, readJson, normalizeEmail, validEmail, cleanText, honeypotTriggered, nowIso, CONSENT_VERSION } from './_utils.js';

export async function onRequestOptions({ request }) { return options(request); }

export async function onRequestPost({ request, env }) {
  if (!assertSameOrigin(request)) return json({ ok: false, error: 'origin_not_allowed' }, 403);
  let body;
  try { body = await readJson(request); } catch (error) {
    return json({ ok: false, error: error.message === 'payload_too_large' ? 'payload_too_large' : 'invalid_request' }, 400);
  }

  if (honeypotTriggered(body.website)) return json({ ok: true, subscribed: true });

  const email = normalizeEmail(body.email);
  const language = body.language === 'en' ? 'en' : 'tr';
  const consent = body.consent === true;
  if (!validEmail(email)) return json({ ok: false, error: 'invalid_email' }, 400);
  if (!consent) return json({ ok: false, error: 'consent_required' }, 400);
  if (!env.DB) return json({ ok: false, error: 'database_not_configured' }, 503);

  const now = nowIso();
  try {
    const result = await env.DB.prepare(`
      INSERT INTO subscribers (email, language, consent_version, consented_at, source, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'website-prelaunch', ?, ?)
      ON CONFLICT(email) DO UPDATE SET language=excluded.language, consent_version=excluded.consent_version, consented_at=excluded.consented_at, source=excluded.source, updated_at=excluded.updated_at
    `).bind(email, language, CONSENT_VERSION, now, now, now).run();

    return json({ ok: true, subscribed: true, id: result.meta?.last_row_id || null });
  } catch (error) {
    console.error('pre-register insert failed', error);
    return json({ ok: false, error: 'server_error' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'POST') return onRequestPost(context);
  return methodNotAllowed();
}
