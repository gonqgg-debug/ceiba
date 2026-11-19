// SEO base y optimización para IA de las páginas de clientes.
// Todo sale del mismo contenido de la plantilla (content), para que título, descripción,
// datos estructurados y archivos para buscadores siempre digan lo mismo.
//   seoHead(content, { url })  -> etiquetas para <head>
//   robotsTxt({ url })         -> robots.txt que no bloquea a buscadores de IA
//   sitemapXml({ url, paths }) -> sitemap.xml
import { schemaClinica } from './templates/clinica.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
const abs = (u, base) => { try { return u ? new URL(u, base).href : ''; } catch { return ''; } };

// Buscadores de IA que dejamos pasar de forma explícita.
export const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended'];

export function seoTitle(c = {}) {
  const brand = c.brand || {}, name = brand.name || brand.fullName || '';
  if (c.seo?.title) return clip(c.seo.title, 65);
  const what = c.seo?.what || brand.tagline || 'Clínica dental';
  const where = c.seo?.where || (c.contact?.address || '').split(',').slice(-2).join(',').trim();
  return clip([`${what}${where ? ` en ${where}` : ''}`, name].filter(Boolean).join(' · '), 65);
}

export function seoDescription(c = {}) {
  return clip(c.seo?.description || c.meta?.description || [c.hero?.sub, c.hero?.lead].filter(Boolean).join(' '), 160);
}

export function seoHead(c = {}, { url = '' } = {}) {
  const title = seoTitle(c), desc = seoDescription(c);
  const img = abs(c.seo?.image || c.hero?.img || c.brand?.logo, url);
  const ld = JSON.stringify(schemaClinica({ ...c, contact: { website: url, ...c.contact } })).replace(/</g, '\\u003c');
  return [
    `<title>${esc(title)}</title>`,
    desc && `<meta name="description" content="${esc(desc)}">`,
    url && `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    desc && `<meta property="og:description" content="${esc(desc)}">`,
    url && `<meta property="og:url" content="${esc(url)}">`,
    img && `<meta property="og:image" content="${esc(img)}">`,
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}">`,
    `<script type="application/ld+json">${ld}</script>`,
  ].filter(Boolean).join('\n');
}

export function robotsTxt({ url = '' } = {}) {
  return [...AI_BOTS.map(b => `User-agent: ${b}\nAllow: /\n`), 'User-agent: *\nAllow: /\n', url && `Sitemap: ${abs('/sitemap.xml', url)}`].filter(Boolean).join('\n') + '\n';
}

export function sitemapXml({ url, paths = ['/'], lastmod = new Date().toISOString().slice(0, 10) }) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${esc(abs(p, url))}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}
