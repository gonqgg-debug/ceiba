// Acceso del equipo: el token CEIBA_ADMIN_TOKEN llega como cookie HttpOnly
// (después de entrar en /admin) o como Authorization: Bearer (scripts, rutina).
import { timingSafeEqual } from 'node:crypto';

const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const cookie = (req, name) => (req.headers.get('cookie') || '').split(/;\s*/).map(c => c.split('=')).find(([k]) => k === name)?.slice(1).join('=');

export function isAdmin(request) {
  const token = process.env.CEIBA_ADMIN_TOKEN;
  if (!token || token.length < 24) return false;
  const bearer = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const fromCookie = decodeURIComponent(cookie(request, 'ceiba_admin') || '');
  return (bearer && same(bearer, token)) || (fromCookie && same(fromCookie, token));
}

export const adminCookie = (value, maxAge = 60 * 60 * 24 * 30) =>
  `ceiba_admin=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.SITE_URL?.startsWith('https') ? '; Secure' : ''}`;
