// Chat de clientes: enlace privado, archivos en Supabase Storage, avance del arranque
// y revisión del dominio. El agente (api/chat.js) usa estas piezas.
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { resolveNs, resolve4 } from 'node:dns/promises';
import { insert, select, update } from './db.js';
import { siteUrl } from './stripe.js';

// ---------- enlace privado (sin contraseña) ----------
const secret = () => process.env.CEIBA_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-only-secret';
export const linkToken = slug => createHmac('sha256', secret()).update(`chat:${slug}`).digest('base64url').slice(0, 32);
export function validToken(slug, token) {
  if (typeof slug !== 'string' || typeof token !== 'string' || !/^[a-z0-9-]{3,80}$/.test(slug)) return false;
  const a = Buffer.from(linkToken(slug)), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const chatUrl = slug => `${siteUrl()}/cuenta/${slug}?t=${linkToken(slug)}`;

// ---------- filas ----------
export async function getChat(slug) {
  return (await select('client_chats', `slug=eq.${encodeURIComponent(slug)}&limit=1`))?.[0] || null;
}
export async function saveChat(id, patch) {
  return (await update('client_chats', `id=eq.${id}`, { ...patch, updated_at: new Date().toISOString() }))?.[0];
}
// Crea el chat de una propuesta pagada si no existe (lo llama el webhook de Stripe).
export async function ensureChat({ proposalId, slug, business, email }) {
  const existing = await getChat(slug);
  if (existing) {
    if (email && !existing.email) await saveChat(existing.id, { email });
    return existing;
  }
  return insert('client_chats', { proposal_id: proposalId || null, slug, business, email: email || null });
}
export async function findChatByEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return [];
  return (await select('client_chats', `email=ilike.${encodeURIComponent(e)}&select=slug,business&limit=5`)) || [];
}

// ---------- archivos (bucket privado «materiales») ----------
const sb = () => ({ url: process.env.SUPABASE_URL?.replace(/\/$/, ''), key: process.env.SUPABASE_SERVICE_ROLE_KEY });
async function storage(path, body) {
  const { url, key } = sb();
  const res = await fetch(`${url}/storage/v1/${path}`, {
    method: 'POST', headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(body || {}), signal: AbortSignal.timeout(8000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Storage ${res.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}
export const ALLOWED_TYPES = /^(image\/(png|jpe?g|webp|gif|svg\+xml|heic|heif)|application\/pdf|application\/zip|application\/postscript|application\/illustrator)$/;
export const MAX_BYTES = 25 * 1024 * 1024;
const safeName = n => String(n || 'archivo').normalize('NFD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').slice(-80);
// URL para que el navegador suba el archivo directo a Storage (PUT), sin pasar por Vercel.
export async function signUpload(slug, name) {
  const path = `${slug}/${randomUUID().slice(0, 8)}-${safeName(name)}`;
  const r = await storage(`object/upload/sign/materiales/${path}`);
  return { path, uploadUrl: `${sb().url}/storage/v1${r.url}` };
}
// Enlace de lectura. Para el modelo usamos uno largo y fijo, para que el historial no cambie.
export async function signDownload(path, seconds = 3600) {
  const r = await storage(`object/sign/materiales/${path}`, { expiresIn: seconds });
  return `${sb().url}/storage/v1${r.signedURL}`;
}
export const LONG_LINK = 60 * 60 * 24 * 365 * 5; // 5 años

// ---------- avance del arranque ----------
// Lo calcula el servidor a partir de lo que guardó el agente; el agente lo recibe en cada turno.
export function checklist(chat) {
  const d = chat.data || {}, files = chat.files || [];
  const count = t => files.filter(f => f.kind === t).length;
  const items = [
    { id: 'logo', label: 'Logo', done: count('logo') > 0 || d.sin_logo === 'si', detail: count('logo') ? 'Recibido' : d.sin_logo === 'si' ? 'Lo diseñamos nosotros' : 'Pendiente' },
    { id: 'fotos', label: 'Fotos', done: count('foto') >= 3 || d.sin_fotos === 'si', detail: d.sin_fotos === 'si' ? 'Usaremos fotos de apoyo' : `${count('foto')} de 3 o más` },
    { id: 'marca', label: 'Colores y estilo', done: count('guia_marca') > 0 || !!d.colores, detail: count('guia_marca') ? 'Guía de marca recibida' : d.colores ? d.colores : 'Pendiente' },
    { id: 'datos', label: 'Datos del negocio', done: !!(d.horario && d.servicios && d.direccion && (d.telefono || d.whatsapp)), detail: (() => { const miss = [['horario', 'horario'], ['servicios', 'servicios'], ['direccion', 'dirección']].filter(([k]) => !d[k]).map(([, l]) => l); if (!d.telefono && !d.whatsapp) miss.push('teléfono'); return miss.length ? `Falta: ${miss.join(', ')}` : 'Completos'; })() },
    { id: 'dominio', label: 'Dominio', done: !!d.dominio_situacion, detail: d.dominio_situacion === 'tiene' ? (d.dominio || 'Tiene dominio') : d.dominio_situacion === 'comprar' ? `Comprar ${d.dominio || 'uno nuevo'}` : d.dominio_situacion === 'despues' ? 'Lo vemos después' : 'Pendiente' },
  ];
  return { items, done: items.filter(i => i.done).length, total: items.length };
}

// ---------- revisión de dominio ----------
const PROVIDERS = [[/domaincontrol\.com/, 'GoDaddy'], [/wixdns\.net/, 'Wix'], [/googledomains\.com|squarespacedns|google\.com/, 'Squarespace (antes Google Domains)'], [/hostgator/, 'HostGator'], [/akky|akkydns/, 'Akky'], [/neubox/, 'Neubox'], [/cloudflare\.com/, 'Cloudflare'], [/namecheaphosting|registrar-servers\.com/, 'Namecheap'], [/awsdns/, 'Amazon Route 53'], [/hostinger|dns-parking/, 'Hostinger'], [/vercel-dns/, 'Vercel'], [/ionos|ui-dns/, 'IONOS']];
export async function checkDomain(raw) {
  const host = String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) return { dominio: host, valido: false, nota: 'No parece un dominio válido (ejemplo: tunegocio.com).' };
  const ns = await resolveNs(host).catch(() => []);
  const a = await resolve4(host).catch(() => []);
  const provider = PROVIDERS.find(([re]) => ns.some(n => re.test(n)))?.[1] || null;
  return {
    dominio: host, valido: true, registrado: ns.length > 0,
    proveedor_dns: provider, servidores_dns: ns.slice(0, 4), tiene_sitio: a.length > 0,
    nota: ns.length ? `El dominio existe${provider ? ` y sus DNS están en ${provider}` : ''}.` : 'No encontramos el dominio: puede estar libre para comprarse o tener un error de escritura.',
  };
}
