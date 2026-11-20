// Páginas de clientes en su propio dominio.
// middleware.js reescribe cualquier host que no sea de Ceiba a /api/site?host=...&path=...
//   /             -> su página (site_content) en modo live, con SEO y datos estructurados
//   /robots.txt   -> deja pasar a buscadores y buscadores de IA
//   /sitemap.xml
// También sirve /media/<slug>/<archivo> (vercel.json -> /api/site?media=...): el logo y las fotos
// que el cliente subió en su chat (bucket privado «materiales»), solo si existen en su chat.
// (Una sola función para no pasar el límite de funciones del plan de Vercel.)
import { SYMBOLS } from '../lib/generated/shared.js';
import { select } from '../lib/db.js';
import { fontHref, renderClinica } from '../lib/templates/clinica.js';
import { robotsTxt, seoHead, sitemapXml } from '../lib/seo.js';
import { signDownload } from '../lib/client-chat.js';
import { pageSeo, renderSitePage, sitePages } from '../lib/site-pages.js';

const TEMPLATES = { clinica: renderClinica };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const send = (body, type, status = 200, cache = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400') =>
  new Response(body, { status, headers: { 'content-type': `${type}; charset=utf-8`, 'cache-control': cache } });

const soon = host => send(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(host)}</title></head>
<body style="margin:0;display:grid;place-items:center;min-height:100dvh;font:16px/1.5 system-ui,sans-serif;color:#1E1F24;padding:24px;text-align:center"><div><h1 style="font-size:26px;margin:0 0 8px">Muy pronto</h1><p style="margin:0;color:#6B6E76">Estamos preparando la nueva página de ${esc(host)}.</p></div></body></html>`, 'text/html', 200, 'no-store');

async function media(p) {
  
  const slug = p.split('/')[0];
  if (!/^[a-z0-9-]{3,80}\/[\w.-]{1,120}$/.test(p) || p.includes('..')) return new Response('No encontrado', { status: 404 });
  try {
    const chat = (await select('client_chats', `slug=eq.${encodeURIComponent(slug)}&select=files&limit=1`))?.[0];
    const file = (chat?.files || []).find(f => f.path === p && /^image\//.test(f.type || ''));
    if (!file) return new Response('No encontrado', { status: 404 });
    const url = await signDownload(p, 60 * 60 * 24);
    return new Response(null, { status: 302, headers: { location: url, 'cache-control': 'public, max-age=3600' } });
  } catch (err) {
    console.error('media', err.message);
    return new Response('No disponible', { status: 502 });
  }
}

// Resumen del negocio para asistentes de IA (formato llmstxt.org), con los mismos datos de su página.
function llmsTxt(c, url) {
  const b = c.brand || {}, k = c.contact || {}, line = (l, v) => (v ? `- ${l}: ${v}\n` : '');
  const hours = c.util?.hours || (c.visit?.rows || []).map(r => `${r.dt}: ${r.dd}`).join('; ');
  const services = (c.services?.items || []).map(s => `- ${s.name}${s.price ? ` (${s.price})` : ''}${s.desc ? `: ${s.desc}` : ''}`).join('\n');
  const faq = (c.faq?.length ? c.faq : c.chat?.faq || []).filter(f => f.q && f.a).map(f => `- **${f.q}** ${f.a}`).join('\n');
  const lede = c.hero?.sub || b.tagline;
  return `# ${b.fullName || b.name || ''}\n\n${lede ? `> ${lede}\n\n` : ''}${line('Página', url)}${line('Dirección', k.address)}${line('Teléfono', k.phone)}${line('WhatsApp', k.whatsapp && `https://wa.me/${k.whatsapp}`)}${line('Correo', k.email)}${line('Horario', hours)}${line('Zonas', c.visit?.zones)}${services ? `\n## Servicios\n${services}\n` : ''}${faq ? `\n## Preguntas frecuentes\n${faq}\n` : ''}`;
}

// Datos estructurados de una página interna: ruta de navegación y sus preguntas frecuentes
function pageSchema(c, current, pageUrl, home) {
  const name = c.page?.brand?.fullName || c.page?.brand?.name || '';
  const graph = [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name, item: home }, { '@type': 'ListItem', position: 2, name: current.title, item: pageUrl }] }];
  const faq = (current.sub?.faq || []).filter(f => f.q && f.a);
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  if (current.view === 'sub' && current.sub?.kind !== 'zona') graph.push({ '@type': 'Service', name: current.title, description: current.sub?.intro || current.sub?.hero?.sub, provider: { '@type': 'LocalBusiness', name, url: home } });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  if (q.has('media')) return media(q.get('media') || '');
  const host = String(q.get('host') || '').toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '');
  const path = '/' + String(q.get('path') || '').replace(/^\/+/, '');
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) return send('No encontrado', 'text/plain', 404, 'no-store');
  let row;
  try { row = (await select('proposals', `domain=eq.${encodeURIComponent(host)}&select=slug,business,recommended_plan,site_content,published_at,updated_at&limit=1`))?.[0]; }
  catch (err) { console.error('site', host, err.message); return send('No disponible', 'text/plain', 502, 'no-store'); }
  if (!row?.site_content || !row.published_at) return path === '/robots.txt' ? send('User-agent: *\nDisallow: /\n', 'text/plain') : soon(host);

  const url = `https://${host}/`;
  if (path === '/robots.txt') return send(robotsTxt({ url }), 'text/plain');
  if (path === '/llms.txt') return send(llmsTxt(row.site_content.page || {}, url), 'text/plain');
  const plan = row.recommended_plan;
  if (path === '/sitemap.xml') return send(sitemapXml({ url, paths: sitePages(row.site_content, plan).map(p => `/${p.slug}`), lastmod: (row.updated_at || row.published_at).slice(0, 10) }), 'application/xml');

  const c = row.site_content, page = c.page || {};
  const r = renderSitePage(c, plan, path, { href: slug => `/${slug}` });
  if (!r) return Response.redirect(url, 301);
  const fonts = fontHref(page);
  const pageUrl = url + r.page.slug;
  const meta = pageSeo(c, r.page);
  const head = meta
    ? [`<title>${esc(meta.title)}</title>`, meta.description && `<meta name="description" content="${esc(meta.description)}">`, `<link rel="canonical" href="${esc(pageUrl)}">`,
      `<meta property="og:type" content="website">`, `<meta property="og:title" content="${esc(meta.title)}">`, meta.description && `<meta property="og:description" content="${esc(meta.description)}">`,
      `<meta property="og:url" content="${esc(pageUrl)}">`, `<script type="application/ld+json">${JSON.stringify(pageSchema(c, r.page, pageUrl, url)).replace(/</g, '\\u003c')}</script>`].filter(Boolean).join('\n')
    : seoHead(page, { url }).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ''); /* la plantilla ya trae los datos estructurados */
  return send(`<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${head}
${page.brand?.accent ? `<meta name="theme-color" content="${esc(page.brand.accent)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Red+Hat+Display:wght@500;600;700&family=Red+Hat+Text:wght@400;500;600&display=swap">
${fonts ? `<link rel="stylesheet" href="${fonts}">` : ''}
<link rel="stylesheet" href="/assets/clinica.css">
<style>body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;overflow-x:clip}[hidden]{display:none!important}.vista{container-type:inline-size}</style>
</head><body>
${SYMBOLS}
<main class="vista">${r.html}</main>
<script src="/assets/clinica.js" defer></script>
</body></html>`, 'text/html');
}
