import { json, methodNotAllowed, options, assertSameOrigin, readJson, normalizeEmail, validEmail, cleanText, honeypotTriggered, nowIso, CONSENT_VERSION } from './_utils.js';

const ALLOWED_PRODUCTS = new Set(['SCULPT','WAVE','LUNA','FOLD','SHELL','ARIA','ÉCLAT','NOVA','BAIA','VITA']);

export async function onRequestOptions({ request }) { return options(request); }

export async function onRequestPost({ request, env }) {
  if (!assertSameOrigin(request)) return json({ ok: false, error: 'origin_not_allowed' }, 403);
  let body;
  try { body = await readJson(request); } catch (error) {
    return json({ ok: false, error: error.message === 'payload_too_large' ? 'payload_too_large' : 'invalid_request' }, 400);
  }
  if (honeypotTriggered(body.website)) return json({ ok: true, submitted: true });

  const name = cleanText(body.name, 100);
  const email = normalizeEmail(body.email);
  const note = cleanText(body.note, 1000);
  const language = body.language === 'en' ? 'en' : 'tr';
  const consent = body.consent === true;
  const rawItems = body.items;

  if (name.length < 2 || !validEmail(email)) return json({ ok: false, error: 'invalid_customer' }, 400);
  if (!consent) return json({ ok: false, error: 'consent_required' }, 400);
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 10) return json({ ok: false, error: 'invalid_items' }, 400);

  const items = [];
  for (const item of rawItems) {
    const product = String(item?.product || '');
    const quantity = Number(item?.quantity);
    if (!ALLOWED_PRODUCTS.has(product) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return json({ ok: false, error: 'invalid_items' }, 400);
    }
    items.push({ product, quantity });
  }

  if (!env.DB) return json({ ok: false, error: 'database_not_configured' }, 503);

  const now = nowIso();
  try {
    const statements = [
      env.DB.prepare(`
        INSERT INTO preorder_requests (name, email, items_json, note, language, consent_version, consented_at, source, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'website-preorder', ?)
      `).bind(name, email, JSON.stringify(items), note, language, CONSENT_VERSION, now, now),
      env.DB.prepare(`
        INSERT INTO subscribers (email, language, consent_version, consented_at, source, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'website-preorder', ?, ?)
        ON CONFLICT(email) DO UPDATE SET language=excluded.language, consent_version=excluded.consent_version, consented_at=excluded.consented_at, source=excluded.source, updated_at=excluded.updated_at
      `).bind(email, language, CONSENT_VERSION, now, now, now)
    ];
    const results = await env.DB.batch(statements);
    const result = results?.[0];
    return json({ ok: true, submitted: true, id: result?.meta?.last_row_id || null });
  } catch (error) {
    console.error('preorder insert failed', error);
    return json({ ok: false, error: 'server_error' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'POST') return onRequestPost(context);
  return methodNotAllowed();
}
