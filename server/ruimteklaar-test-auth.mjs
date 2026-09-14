/** Mathematical access gate, explicitly not a secret-password or identity service.
 * Each protected request rechecks the credential's prime factorisation; cookies
 * are never trusted as a logged-in flag. No production secret is required.
 * The credential envelope is NOT a signed session token: its one-hour timestamp
 * is a convenience timeout, not a non-renewable authorization boundary. A holder
 * of any valid credential is authorized and can always log in again.
 */
import {factorCode, MAX_FACTOR_CODE_LENGTH} from './ruimteklaar-factor-code.mjs';
export const REVIEW_ROOT = '/apps/ruimteklaar/test/';
const COOKIE = '__Host-wisik-ruimteklaar-test', TTL = 3600, BODY_LIMIT = 4096;
const enc = new TextEncoder(), attempts = new Map();
const CSS = 'body{margin:0;background:#081827;color:#eef4fa;font:17px/1.6 system-ui,sans-serif}main{box-sizing:border-box;max-width:420px;margin:24vh auto 0;padding:24px}input{box-sizing:border-box;display:block;width:100%;min-height:52px;border-radius:8px;padding:12px 14px;font:inherit;background:#152d41;color:#fff;border:1px solid #7792a6}input:focus{outline:3px solid #ffc08d;outline-offset:3px}input[aria-invalid=true]{border:2px solid #ffb1a4}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
function baseHeaders(type = 'text/html; charset=utf-8') {
  return new Headers({'Content-Type': type, 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store', 'Cloudflare-CDN-Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Vary': 'Cookie', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'"});
}
function reply(body, status = 200, type) { return new Response(body, {status, headers: baseHeaders(type)}); }
function json(body, status = 200) { return reply(JSON.stringify(body), status, 'application/json; charset=utf-8'); }
function page(invalid = false) {
  // Exactly one visible input: no explanation, example, pattern or visible label.
  // A single-field form submits natively with Enter / the mobile keyboard's Go.
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Ruimteklaar</title><link rel="stylesheet" href="${REVIEW_ROOT}login.css"></head><body><main><form method="post" action="${REVIEW_ROOT}login"><input id="password" name="password" type="password" aria-label="Wachtwoord" autocomplete="current-password" autocapitalize="none" spellcheck="false" enterkeyhint="go" required maxlength="${MAX_FACTOR_CODE_LENGTH}"${invalid ? ' aria-invalid="true" aria-describedby="access-error"' : ''}>${invalid ? '<span id="access-error" class="sr-only" role="alert">Toegang niet mogelijk.</span>' : ''}</form></main></body></html>`;
}
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
function unb64(s) {
  if (!/^[A-Za-z0-9_-]+$/.test(s)) throw new Error('encoding');
  return Uint8Array.from(atob(s.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
}
function cookie(value, maxAge = TTL) { return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`; }
function redirect(location, credential) {
  const h = baseHeaders(); h.set('Location', location);
  if (credential !== undefined) h.set('Set-Cookie', cookie(credential, credential ? TTL : 0));
  return new Response(null, {status: 303, headers: h});
}
function validCredential(request, now) {
  const values = (request.headers.get('Cookie') || '').split(';').map(s => s.trim()).filter(s => s.startsWith(COOKIE + '='));
  if (values.length !== 1) return null;
  const token = values[0].slice(COOKIE.length + 1);
  if (token.length > 1536) return null;
  try {
    const data = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(unb64(token)));
    if (!data || data.v !== 2 || data.aud !== new URL(request.url).origin || !Number.isSafeInteger(data.iat) || !Number.isSafeInteger(data.exp) || data.iat > now + 5 || data.exp <= now || data.exp - data.iat !== TTL) return null;
    // Revalidate the mathematics on EVERY request, including CSS/JS and /session.
    const proof = factorCode(data.proof);
    if (!proof || proof !== data.proof) return null;
    return data;
  } catch { return null; }
}
async function limitedBody(request) {
  const length = request.headers.get('Content-Length');
  if (length && (!/^\d+$/.test(length) || Number(length) > BODY_LIMIT)) return null;
  if (!request.body) return '';
  const reader = request.body.getReader(); let size = 0; const chunks = [];
  try {
    while (true) {
      const {value, done} = await reader.read(); if (done) break;
      size += value.length;
      if (size > BODY_LIMIT) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const all = new Uint8Array(size); let offset = 0;
    for (const c of chunks) { all.set(c, offset); offset += c.length; }
    return new TextDecoder('utf-8', {fatal: true}).decode(all);
  } catch { return null; } finally { reader.releaseLock(); }
}
async function throttle(request, now) {
  for (const [id, row] of attempts) if (row.until <= now) attempts.delete(id);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const id = b64(await crypto.subtle.digest('SHA-256', enc.encode('review-attempt:' + new URL(request.url).origin + ':' + ip)));
  let row = attempts.get(id);
  if (!row) {
    if (attempts.size >= 2048) return {ok: false, retry: 900};
    row = {count: 0, until: now + 900}; attempts.set(id, row);
  }
  row.count++;
  return {ok: row.count <= 5, retry: Math.max(1, row.until - now), id};
}
export async function handleReview(request, env, assets, clock = () => Date.now()) {
  const url = new URL(request.url), now = Math.floor(clock() / 1000), path = url.pathname, root = REVIEW_ROOT.slice(0, -1);
  if (path !== root && !path.startsWith(REVIEW_ROOT)) return reply('Niet gevonden.', 404, 'text/plain; charset=utf-8');
  if (url.protocol !== 'https:') return reply('Gebruik HTTPS.', 400, 'text/plain; charset=utf-8');
  const rel = path === root ? '' : path.slice(REVIEW_ROOT.length), method = request.method;
  if (!['GET', 'HEAD', 'POST'].includes(method)) return reply('Methode niet toegestaan.', 405, 'text/plain; charset=utf-8');
  if (method === 'POST' && request.headers.get('Origin') !== url.origin) return json({error: 'Toegang niet mogelijk.'}, 403);
  if (rel === 'login.css' && (method === 'GET' || method === 'HEAD')) return reply(method === 'HEAD' ? null : CSS, 200, 'text/css; charset=utf-8');
  if (rel === 'login' && method === 'POST') {
    if ((request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') return json({error: 'Toegang niet mogelijk.'}, 415);
    const body = await limitedBody(request);
    if (body === null) return json({error: 'Toegang niet mogelijk.'}, 413);
    const limit = await throttle(request, now);
    if (!limit.ok) { const r = reply(page(true), 429); r.headers.set('Retry-After', String(limit.retry)); return r; }
    const form = new URLSearchParams(body), passwords = form.getAll('password');
    const proof = passwords.length === 1 && [...form.keys()].every(k => k === 'password') ? factorCode(passwords[0]) : null;
    if (!proof) return reply(page(true), 401);
    attempts.delete(limit.id);
    const credential = b64(enc.encode(JSON.stringify({v: 2, aud: url.origin, iat: now, exp: now + TTL, proof})));
    return redirect(REVIEW_ROOT, credential);
  }
  if (rel === 'logout' && method === 'POST') return redirect(REVIEW_ROOT, '');
  if (method === 'POST') return json({error: 'Niet gevonden.'}, 404);
  const credential = validCredential(request, now);
  if (!credential) return rel === '' || rel === 'index.html' ? reply(method === 'HEAD' ? null : page(), 200) : json({error: 'Toegang niet mogelijk.'}, 401);
  if (rel === 'session') return json({authenticated: true, expiresAt: credential.exp * 1000});
  if (rel === '' && path === root) return redirect(REVIEW_ROOT);
  const name = rel || 'index.html';
  const asset = Object.hasOwn(assets, name) ? assets[name] : null;
  if (!asset) return reply('Niet gevonden.', 404, 'text/plain; charset=utf-8');
  return reply(method === 'HEAD' ? null : asset.body, 200, asset.type);
}
