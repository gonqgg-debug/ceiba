// Galería de plantillas: site/plantillas/index.html y una página por plantilla
// (site/plantillas/<id>.html) con su demo. Uso: node scripts/plantillas.mjs
// Las miniaturas salen de scripts/plantillas-shots.cjs (con el servidor local corriendo).
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { CATALOGO, RUBROS } from '../lib/templates/catalogo.js';
import { renderClinica, fontHref } from '../lib/templates/clinica.js';
import { SYMBOLS } from '../lib/generated/shared.js';

const OUT = new URL('../site/plantillas/', import.meta.url);
mkdirSync(new URL('img/', OUT), { recursive: true });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const head = (title, extra = '') => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${extra}</head>`;

for (const t of CATALOGO) {
  const demo = (await import(`../lib/demos/${t.demo}.js`)).default;
  const page = { ...demo.page, ...(t.page || {}), theme: { ...(demo.page.theme || {}), font: undefined, style: t.id } }; // cada diseño trae su propia letra
  if (t.accent) page.brand = { ...page.brand, accent: t.accent };
  writeFileSync(new URL(`${t.id}.html`, OUT), `${head(`${t.name} · Plantillas Ceiba`, `<link rel="stylesheet" href="${fontHref(page)}"><link rel="stylesheet" href="/assets/clinica.css">
<style>body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;overflow-x:clip}[hidden]{display:none!important}.vista{container-type:inline-size}
.pl-back{position:fixed;left:12px;bottom:12px;z-index:50;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:999px;background:#0B1514;color:#F7F4EB;font:600 13px system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 16px -6px #0008}</style>`)}
<body>${SYMBOLS}<main class="vista">${renderClinica(page, { mode: 'live' })}</main><a class="pl-back" href="/plantillas/">← Todas las plantillas</a><script src="/assets/clinica.js" defer></script></body></html>`);
}

const card = t => `<a class="pl-card" href="/plantillas/${t.id}.html">
  <span class="pl-shot">${existsSync(new URL(`img/${t.id}.jpg`, OUT)) ? `<img src="/plantillas/img/${t.id}.jpg" alt="" loading="lazy">` : ''}</span>
  <span class="pl-meta"><b>${esc(t.name)}</b>${t.estado ? `<em>${esc(t.estado)}</em>` : ''}</span>
  <span class="pl-idea">${esc(t.idea)}</span>
  <span class="pl-ref">Basada en ${esc(t.ref.name)}</span></a>`;
const groups = Object.entries(RUBROS).map(([k, label]) => [label, CATALOGO.filter(t => (t.rubro || t.kind) === k)]);
writeFileSync(new URL('index.html', OUT), `${head('Plantillas · Ceiba Labs', `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap">
<style>
:root{--bg:#0B1514;--fg:#F7F4EB;--mute:#A8B3AE;--line:rgba(247,244,235,.12);--lime:#D6FA52}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:400 16px/1.5 Geist,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:1240px;margin:0 auto;padding:48px 16px 80px}
h1{font-size:clamp(2rem,5vw,3.2rem);line-height:1.05;margin:0 0 .5rem;font-weight:600;letter-spacing:-.02em}
.lede{color:var(--mute);max-width:44em;margin:0 0 2.5rem}
h2{font-size:1.1rem;font-weight:600;margin:2.6rem 0 1rem;display:flex;gap:.6rem;align-items:baseline}
h2 small{color:var(--mute);font-weight:400;font-size:.9rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.pl-card{display:grid;gap:.45rem;color:inherit;text-decoration:none;padding:10px 10px 16px;border-radius:16px;border:1px solid var(--line);transition:border-color .2s,transform .2s}
.pl-card:hover{border-color:var(--lime);transform:translateY(-2px)}
.pl-card:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.pl-shot{aspect-ratio:16/10;border-radius:10px;overflow:hidden;background:#16211F}
.pl-shot img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.pl-meta{display:flex;align-items:center;gap:.5rem;padding:0 4px;margin-top:.3rem}
.pl-meta b{font-weight:600;font-size:1.05rem}
.pl-meta em{font-style:normal;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--bg);background:var(--lime);border-radius:999px;padding:2px 8px}
.pl-idea{color:var(--mute);font-size:.9rem;padding:0 4px}
.pl-ref{font-size:.8rem;color:var(--mute);opacity:.75;padding:0 4px}
.empty{color:var(--mute);font-size:.92rem;border:1px dashed var(--line);border-radius:14px;padding:18px}
</style>`)}
<body><main>
<h1>Plantillas por rubro</h1>
<p class="lede">Cada plantilla se basa en uno de los sitios de referencia y usa datos de ejemplo. Toca una para abrirla completa; en el celular se ve como la vería un cliente. Esta página no aparece en Google.</p>
${groups.map(([label, ts]) => `<h2>${esc(label)} <small>${ts.length} de 15</small></h2>${ts.length ? `<div class="grid">${ts.map(card).join('')}</div>` : '<p class="empty">En camino.</p>'}`).join('\n')}
</main></body></html>`);
console.log(`plantillas: ${CATALOGO.length} página(s) y el índice en site/plantillas/`);
