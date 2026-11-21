// Páginas de un sitio de cliente según su plan (ficha en lib/catalog.js).
//   Todos:    inicio, servicios y contacto (servicios y contacto salen solas del contenido de la portada)
//   Negocio:  + hasta 4 páginas por servicio o zona
//   Avanzado: + hasta 9 páginas por servicio, zona o catálogo
// Las páginas extra viven en site_content.pages: [{ slug, title, nav?, kind, hero, intro, sections, items, prices, faq, seo }].
// Si el contenido trae más páginas de las que incluye el plan, se muestran solo las que caben.
import { planSpec } from './catalog.js';
import { renderClinica } from './templates/clinica.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(['', 'servicios', 'contacto', 'robots.txt', 'sitemap.xml', 'llms.txt', 'index.html']);

export function sitePages(content = {}, planId) {
  const spec = planSpec(planId);
  const page = content.page || {};
  const base = [
    { slug: '', title: 'Inicio', nav: 'Inicio', view: 'home' },
    // La página de «servicios» se llama según el rubro (el slug no cambia para no romper enlaces)
    (() => {
      const k = { restaurante: ['Menú', page.menu?.title], hotel: ['Habitaciones', page.rooms?.title], inmobiliaria: ['Propiedades', page.listings?.title], despacho: ['Áreas de práctica', page.services?.title] }[page.kind];
      return k ? { slug: 'servicios', title: k[1] || k[0], nav: k[0], view: 'servicios' } : { slug: 'servicios', title: page.services?.title || 'Servicios', nav: 'Servicios', view: 'servicios' };
    })(),
  ];
  const extra = (Array.isArray(content.pages) ? content.pages : [])
    .filter(p => p && SLUG.test(p.slug || '') && !RESERVED.has(p.slug) && p.title)
    .slice(0, Math.max(0, Math.min(spec.servicePages, spec.pages - 3)))
    .map(p => ({ slug: p.slug, title: p.title, nav: p.nav === false ? null : (p.navLabel || p.title), view: 'sub', sub: p }));
  const contact = { slug: 'contacto', title: 'Contacto', nav: 'Contacto', view: 'contacto' };
  return [...base, ...extra, contact];
}

// Arma una página del sitio. path: «/», «/servicios», «/limpieza-dental»… Devuelve null si no existe.
export function renderSitePage(content = {}, planId, path = '/', { href, mode = 'live' } = {}) {
  const slug = String(path || '/').replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').replace(/^index$/, '');
  const pages = sitePages(content, planId);
  const current = pages.find(p => p.slug === slug);
  if (!current) return null;
  const nav = pages.filter(p => p.nav).map(p => ({ slug: p.slug, title: p.title, nav: p.nav }));
  const html = renderClinica(content.page || {}, { mode, view: current.view, sub: current.sub ? { ...current.sub, slug: current.slug } : null, pages: nav, href });
  return { html, page: current, pages };
}

// Título y descripción para buscadores de cada página
export function pageSeo(content = {}, current) {
  const page = content.page || {}, brand = page.brand || {}, name = brand.fullName || brand.name || '';
  if (!current || current.view === 'home') return null; // la portada usa seoTitle/seoDescription
  const s = current.sub || {};
  const title = s.seo?.title || `${current.title} · ${name}`;
  const desc = s.seo?.description || s.hero?.sub || s.intro
    || (current.view === 'servicios' ? (page.services?.sub || `Servicios de ${name}: precios, en qué consisten y cómo agendar.`)
      : current.view === 'contacto' ? `Cómo llegar a ${name}, horarios, teléfono y WhatsApp.${page.contact?.address ? ` ${page.contact.address}.` : ''}` : '');
  return { title: title.slice(0, 70), description: String(desc).replace(/\s+/g, ' ').trim().slice(0, 160) };
}
