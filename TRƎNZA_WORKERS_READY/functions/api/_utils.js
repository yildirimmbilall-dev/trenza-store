const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const MAX_BODY_BYTES = 16 * 1024;
const CONSENT_VERSION = 'prelaunch-v1-2026-08-20';

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', ...headers }
  });
}

export function methodNotAllowed() {
  return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST, OPTIONS' });
}

export function options(request) {
  const origin = request.headers.get('Origin');
  const headers = {};
  if (origin) headers['access-control-allow-origin'] = origin;
  headers['access-control-allow-methods'] = 'POST, OPTIONS';
  headers['access-control-allow-headers'] = 'content-type';
  headers['access-control-max-age'] = '86400';
  return new Response(null, { status: 204, headers });
}

export function assertSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function readJson(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error('payload_too_large');
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error('payload_too_large');
  try { return JSON.parse(text); } catch { throw new Error('invalid_json'); }
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function validEmail(email) {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function cleanText(value, max) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function honeypotTriggered(value) {
  return String(value || '').trim().length > 0;
}

export function nowIso() { return new Date().toISOString(); }
export { CONSENT_VERSION };
