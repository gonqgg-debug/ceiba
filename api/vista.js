// GET /vista/[slug]  (vercel.json lo reescribe a /api/vista?slug=...)
// La portada nueva del cliente en pantalla completa, con una barra de vista previa.
import { SYMBOLS } from '../lib/generated/shared.js';
import { isAdmin } from '../lib/admin.js';
import { loadProposal, trackView } from '../lib/proposals.js';
import { renderClinica } from '../lib/templates/clinica.js';

const TEMPLATES = { clinica: renderClinica };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const html = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'private, no-store' } });

const HEAD = title => `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Red+Hat+Display:wght@500;600;700&family=Red+Hat+Text:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/clinica.css">
<style>
body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;overflow-x:clip}
[hidden]{display:none!important}
.vista{container-type:inline-size}
.vp-bar{position:relative;z-index:10;display:flex;align-items:center;gap:12px 20px;padding:10px max(16px,env(safe-area-inset-left));background:#0B1514;color:#F7F4EB;font:400 14px/1.35 Geist,system-ui,sans-serif}
.vp-bar p{margin:0;flex:1;min-width:0}
.vp-bar b{font-weight:600}
.vp-bar .tag{font:500 11px/1 ui-monospace,monospace;letter-spacing:.04em;text-transform:uppercase;border:1px solid rgba(247,244,235,.35);border-radius:5px;padding:5px 7px;margin-right:10px;white-space:nowrap}
.vp-bar .tag--draft{background:#D6FA52;color:#0B1514;border-color:#D6FA52}
.vp-acts{display:flex;gap:8px;align-items:center}
.vp-btn{display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;white-space:nowrap;border:1px solid rgba(247,244,235,.3);color:#F7F4EB;background:none;cursor:pointer;font-family:inherit}
.vp-btn--main{background:#D6FA52;color:#0B1514;border-color:#D6FA52}
.vp-x{width:36px;padding:0;justify-content:center;font-size:20px;font-weight:400}
.vp-pill{position:fixed;left:12px;bottom:12px;z-index:20;height:34px;padding:0 12px;border-radius:999px;border:0;background:#0B1514;color:#F7F4EB;font:600 13px Geist,system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px -6px rgba(0,0,0,.5)}
.vp-toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:30;background:#0B1514;color:#F7F4EB;font:400 14px/1.4 Geist,system-ui,sans-serif;padding:12px 16px;border-radius:10px;max-width:min(92vw,420px);box-shadow:0 10px 30px -10px rgba(0,0,0,.5)}
@media (max-width:700px){.vp-bar{flex-wrap:wrap;font-size:13px}.vp-bar p{flex-basis:calc(100% - 50px)}.vp-acts{width:100%}.vp-acts .vp-btn:not(.vp-x){flex:1;justify-content:center}.vp-x{position:absolute;top:8px;right:10px}.vp-pill{bottom:76px}}
</style></head>`;

function page(p, { admin }) {
  const render = TEMPLATES[p.template || 'clinica'] || renderClinica;
  const draft = admin && !['enviada', 'vista', 'activada'].includes(p.status);
  return html(`${HEAD(`${p.business} · Vista previa de Ceiba Labs`)}
<body>
${SYMBOLS}
<div class="vp-bar" id="vp-bar" role="region" aria-label="Vista previa">
  <p><span class="tag${draft ? ' tag--draft' : ''}">${draft ? 'Borrador' : 'Vista previa'}</span>Así se vería la página de <b>${esc(p.business)}</b>. Todavía no está publicada.</p>
  <div class="vp-acts"><a class="vp-btn" href="/p/${esc(p.slug)}">Ver mi propuesta</a><a class="vp-btn vp-btn--main" href="/p/${esc(p.slug)}#plan">Activar mi página</a><button class="vp-btn vp-x" type="button" id="vp-hide" aria-label="Ocultar barra de vista previa">×</button></div>
</div>
<button class="vp-pill" id="vp-pill" type="button" hidden>Vista previa · Ceiba Labs</button>
<main class="vista">${render(p.page || {}, { mode: 'live' })}</main>
<div class="vp-toast" id="vp-toast" role="status" aria-live="polite" hidden></div>
<script src="/assets/clinica.js" defer></script>
<script src="/assets/vista.js" defer></script>
</body></html>`);
}

const notFound = (title, text, status) => html(`${HEAD(title)}<body style="display:grid;place-items:center;min-height:100dvh;font:16px/1.5 Geist,system-ui,sans-serif;color:#18231F;padding:24px;text-align:center"><div><h1 style="font:600 28px 'Red Hat Display',sans-serif;margin:0 0 8px">${esc(title)}</h1><p style="margin:0 0 20px;color:#5E6A64">${esc(text)}</p><a href="/" style="color:#103D37;font-weight:600">Ir a Ceiba Labs</a></div></body></html>`, status);

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const admin = isAdmin(request);
  let r;
  try { r = await loadProposal(slug, { admin }); }
  catch (err) { console.error('vista', err.message); return notFound('No pudimos abrir la vista previa', 'Intenta de nuevo en unos minutos.', 502); }
  if (r.expired) return notFound('Esta vista previa venció', 'Pide una propuesta actualizada y te mandamos un enlace nuevo.', 410);
  if (r.error) return notFound('No encontramos esta vista previa', 'Revisa el enlace que te mandamos.', r.status);
  if (!admin) await trackView(r.proposal, request, 'vista');
  return page(r.proposal, { admin });
}
