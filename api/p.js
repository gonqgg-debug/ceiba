// GET /p/[slug]  (vercel.json lo reescribe a /api/p?slug=...)
// Propuesta privada armada con los datos de Supabase (o la de ejemplo).
import { isAdmin } from '../lib/admin.js';
import { loadProposal, trackView } from '../lib/proposals.js';
import { renderProposal } from '../lib/render-proposal.js';

const html = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'private, no-store' } });
const simple = (title, text, status) => html(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><body style="margin:0;display:grid;place-items:center;min-height:100dvh;background:#0B1514;color:#F7F4EB;font:16px/1.5 system-ui,sans-serif;padding:24px;text-align:center"><div><h1 style="font-size:28px;margin:0 0 8px">${title}</h1><p style="margin:0 0 20px;opacity:.75">${text}</p><a href="/" style="color:#D6FA52">Ir a Ceiba Labs</a></div></body></html>`, status);

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const admin = isAdmin(request);
  let r;
  try { r = await loadProposal(slug, { admin }); }
  catch (err) { console.error('p', err.message); return simple('No pudimos abrir tu propuesta', 'Intenta de nuevo en unos minutos.', 502); }
  // Vencida: se muestra igual, la página ya trae el aviso y el botón para pedir una nueva.
  if (r.error && !r.expired) return simple('No encontramos esta propuesta', 'Revisa el enlace que te mandamos.', r.status);
  if (!admin) await trackView(r.proposal, request, 'propuesta');
  return html(renderProposal(r.proposal));
}
