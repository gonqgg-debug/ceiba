import { renderFonda, FONDA_FONTS } from './fonda.js';
import { DESIGNS } from './designs.js';
// Plantilla «clínica» (v2): la portada nueva que ve el cliente en su propuesta.
// Módulo ES sin dependencias: lo usan el servidor (/vista/[slug]) y el
// navegador (comparador de /p/[slug]; build.py lo copia a site/assets/).
//
//   renderClinica(content, { mode: 'live' | 'mock', marks: { services: 2, ... } })
//
// mode 'live': enlaces reales (tel:, WhatsApp, mapas) y formulario que abre WhatsApp.
// mode 'mock': nada navega, para mostrarla dentro del comparador.
// Cada sección aparece solo si hay datos. Esquema: ops/esquema-propuesta.md
// Estilos: src/assets/clinica.css (clases .cx-*). Interacción: src/assets/clinica.js

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#1F4FD1');
const digits = s => String(s ?? '').replace(/\D/g, '');
const stars = n => '★★★★★'.slice(0, Math.max(1, Math.min(5, Math.round(Number(n) || 5))));
const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);

// Íconos de línea (24×24). Nombres que puede usar el contenido en `icon`.
const P = {
  tooth: 'M7 3.5c1.6-.9 3.1.2 5 .2s3.4-1.1 5-.2c2.4 1.4 2.3 5 1.2 8-.9 2.4-1.1 8.5-3 8.5-1.6 0-1.4-5.2-3.2-5.2S10.6 20 9 20c-1.9 0-2.1-6.1-3-8.5C4.9 8.5 4.6 4.9 7 3.5Z',
  calendar: 'M4 6.5h16v13H4zM4 10h16M8.5 3.5v4M15.5 3.5v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  card: 'M3 6.5h18v11H3zM3 10h18M7 14.5h4',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3ZM9 12l2 2 4-4',
  star: 'm12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  map: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  car: 'M5 16.5h14M6.5 16.5V19M17.5 16.5V19M4.5 16.5v-4l2-5h11l2 5v4M4.5 12.5h15M8 14.5h.01M16 14.5h.01',
  scan: 'M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16',
  sparkle: 'M12 3.5c.6 4 2.4 6 6.5 6.5-4.1.6-5.9 2.5-6.5 6.5-.6-4-2.4-5.9-6.5-6.5 4.1-.5 5.9-2.5 6.5-6.5ZM18.5 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z',
  child: 'M12 8.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM8 21v-6.5L6 12m10 9v-6.5l2-2.5M8.5 11.5h7l1 3h-9l1-3Z',
  phone: 'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z',
  check: 'M5 12.5 10 17.5 19.5 7',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 14 7 21l5-2.5 5 2.5-1.5-7',
  bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
};
const ICON_GUESS = [
  [/años|experiencia|trayectoria/i, 'award'], [/c[eé]dula|certific|especialista|colegio|asociaci/i, 'shield'],
  [/msi|meses|pago|tarjeta|precio/i, 'card'], [/estaciona|valet|parking/i, 'car'], [/urgencia|mismo día|hoy/i, 'bolt'],
  [/digital|escáner|esc[aá]ner|radiograf|3d|tomograf/i, 'scan'], [/niñ|pediatr|familia/i, 'child'], [/horario|abierto|domingo|sábado/i, 'clock'],
  [/rese|opini|google|calific/i, 'star'], [/extranjer|inglés|english|tourism/i, 'globe'], [/whatsapp|respond|chat/i, 'chat'],
  [/sucursal|ubicaci|cerca/i, 'map'], [/estétic|sonrisa|blanque/i, 'sparkle'],
];
const iconName = (name, text = '') => (P[name] ? name : (ICON_GUESS.find(([re]) => re.test(text)) || [, 'check'])[1]);
const ico = (name, cls = 'cx-ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[name] || P.check}"/></svg>`;
const WA = '<svg class="cx-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';

// Tema de diseño (page.theme). Opciones cerradas para que todo combine.
export const THEME_OPTIONS = {
  mode: { light: 'Claro', dark: 'Oscuro' },
  hero: { organic: 'Orgánica', rounded: 'Redondeada', square: 'Rectangular' },
  font: { moderna: 'Moderna', elegante: 'Elegante (con serif)', geometrica: 'Geométrica', clasica: 'Clásica', amable: 'Amable', sobria: 'Sobria', editorial: 'Editorial', calida: 'Cálida', lujo: 'De lujo', fuerte: 'Con carácter', retro: 'Retro', limpia: 'Limpia' },
  corners: { soft: 'Suaves', sharp: 'Rectas' },
  buttons: { pill: 'Redondos', square: 'Rectangulares', outline: 'Con contorno' },
  style: { sobria: 'Sobria', expresiva: 'Expresiva (más animación)', cercana: 'Cercana (colorida y amable)', fonda: 'Fonda (restaurantes)', estudio: 'Estudio (clínicas)', galeria: 'Galería (clínicas)', fresca: 'Fresca (clínicas)' , capsula: 'Cápsula (clínicas)' , cine: 'Cine (clínicas)' , estrellas: 'Estrellas (clínicas)' , glam: 'Glam (clínicas)' , ciudad: 'Ciudad (clínicas)' , nogal: 'Nogal (clínicas)' , ola: 'Ola (clínicas)' , abierto: 'Abierto (clínicas)' , hogar: 'Hogar (clínicas)' , menta: 'Menta (clínicas)' , clara: 'Clara (clínicas)' , revista: 'Revista (clínicas)' , ahumado: 'Ahumado (restaurantes)' , deli: 'Deli (restaurantes)' , banquete: 'Banquete (restaurantes)' , fantasia: 'Fantasía (restaurantes)' , bowl: 'Bowl (restaurantes)' , helado: 'Helado (restaurantes)' , trazo: 'Trazo (restaurantes)' , tienda: 'Tienda (restaurantes)' , fijo: 'Fijo (restaurantes)' , noche: 'Noche (restaurantes)' , recreo: 'Recreo (restaurantes)' , taberna: 'Taberna (restaurantes)' , fiesta: 'Fiesta (restaurantes)' , mercado: 'Mercado (restaurantes)' , spa: 'Spa (hoteles)' , egeo: 'Egeo (hoteles)' , alpes: 'Alpes (hoteles)' , archivo: 'Archivo (hoteles)' , clasico: 'Clásico (hoteles)' , selva: 'Selva (hoteles)' , finca: 'Finca (hoteles)' , glamping: 'Glamping (hoteles)' , rancho: 'Rancho (hoteles)' , safari: 'Safari (hoteles)' , motel: 'Motel (hoteles)' , calendario: 'Calendario (hoteles)' , pelicula: 'Película (hoteles)' , reloj: 'Reloj (hoteles)' , verano: 'Verano (hoteles)' , arco: 'Arco (inmobiliarias)' , local: 'Local (inmobiliarias)' , brisa: 'Brisa (inmobiliarias)' , cartelera: 'Cartelera (inmobiliarias)' , lujo: 'Lujo (inmobiliarias)' , isla: 'Isla (inmobiliarias)' , valua: 'Valúa (inmobiliarias)' , asesora: 'Asesora (inmobiliarias)' , mapa: 'Mapa (inmobiliarias)' , pregunta: 'Pregunta (inmobiliarias)' , atardecer: 'Atardecer (inmobiliarias)' , torre: 'Torre (inmobiliarias)' , folleto: 'Folleto (inmobiliarias)' , ruleta: 'Ruleta (inmobiliarias)' , cabana: 'Cabaña (inmobiliarias)' },
};
export const FONTS = {
  moderna: ['Red Hat Display', 'Red Hat Text', 'Red+Hat+Display:wght@500;600;700&family=Red+Hat+Text:wght@400;500;600'],
  elegante: ['Fraunces', 'Inter', 'Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600'],
  geometrica: ['Poppins', 'Poppins', 'Poppins:wght@400;500;600;700'],
  clasica: ['Lora', 'Source Sans 3', 'Lora:wght@500;600;700&family=Source+Sans+3:wght@400;500;600'],
  amable: ['Nunito', 'Nunito', 'Nunito:wght@400;500;600;700;800'],
  sobria: ['Manrope', 'Manrope', 'Manrope:wght@400;500;600;700;800'],
  editorial: ['Newsreader', 'Hanken Grotesk', 'Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600'],
  calida: ['DM Serif Display', 'DM Sans', 'DM+Serif+Display&family=DM+Sans:wght@400;500;600'],
  lujo: ['Cormorant Garamond', 'Jost', 'Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600'],
  fuerte: ['Bricolage Grotesque', 'Bricolage Grotesque', 'Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800'],
  retro: ['Playfair Display', 'Lora', 'Playfair+Display:wght@700;800&family=Lora:wght@400;500'],
  limpia: ['Plus Jakarta Sans', 'Plus Jakarta Sans', 'Plus+Jakarta+Sans:wght@400;500;600;700'],
};
// La letra que eligió el cliente (theme.font) o la que subió (theme.customFont = { url, name }).
// Manda sobre la letra propia de cada diseño (Estudio, Fonda…); sin elección, cada diseño usa la suya.
const fontUrl = u => (typeof u === 'string' && /^https:\/\/[^\s"'()<>\\]+$/i.test(u) ? u : '');
export function fontChoice(c) {
  const t = c?.theme || {}, custom = fontUrl(t.customFont?.url);
  // La letra de su página, si está en Google Fonts (theme.googleFont = 'Spectral'); para el texto, la del par elegido o la del diseño
  const gf = /^[A-Za-z][A-Za-z0-9 ]{1,38}$/.test(t.googleFont || '') ? t.googleFont.trim() : '';
  const pair = gf ? [gf, FONTS[t.font]?.[1] || null, `${gf.replace(/ /g, '+')}:wght@400;500;600;700${FONTS[t.font] ? `&family=${FONTS[t.font][2].split('&family=').pop()}` : ''}`] : FONTS[t.font] ? FONTS[t.font] : null;
  if (!pair && !custom) return null;
  const stack = f => `'${String(f).replace(/['";<>]/g, '')}',ui-sans-serif,system-ui,sans-serif`;
  return {
    href: pair ? `https://fonts.googleapis.com/css2?family=${pair[2]}&display=swap` : '',
    vars: `--fh:${custom ? stack('Letra del cliente') : stack(pair[0])};${pair?.[1] ? `--fb:${stack(pair[1])};` : ''}`,
    face: custom ? `<style>@font-face{font-family:'Letra del cliente';src:url('${custom}');font-display:swap}</style>` : '',
  };
}
export const themeOf = c => {
  const t = c?.theme || {}, pick = (k, d) => (THEME_OPTIONS[k][t[k]] ? t[k] : d);
  // Restaurantes: el diseño «Fonda» por defecto; «fonda» solo aplica a restaurantes
  let style = pick('style', c?.kind === 'restaurante' ? 'fonda' : 'sobria');
  if (style === 'fonda' && c?.kind !== 'restaurante') style = 'sobria';
  if (DESIGNS[style] && !DESIGNS[style].kinds.includes(c?.kind || 'clinica')) style = 'sobria';
  // Cercana usa la tipografía amable si no se eligió otra
  return { mode: pick('mode', 'light'), hero: pick('hero', 'organic'), font: pick('font', style === 'cercana' ? 'amable' : c?.kind === 'restaurante' ? 'elegante' : 'moderna'), corners: pick('corners', 'soft'), buttons: pick('buttons', 'pill'), style };
};
const designFonts = c => (themeOf(c).style === 'fonda' ? FONDA_FONTS : DESIGNS[themeOf(c).style]?.fonts || `https://fonts.googleapis.com/css2?family=${FONTS[themeOf(c).font][2]}&display=swap`);
export const fontHref = c => fontChoice(c)?.href || designFonts(c);

// Vistas de un sitio con varias páginas (ver lib/site-pages.js):
//   home: la portada completa · servicios · contacto · sub: página por servicio, zona o catálogo.
// Cada vista reutiliza las mismas secciones de la portada, así todo el sitio se ve igual.
const VIEWS = {
  servicios: ['hero', 'rooms', 'amenities', 'services', 'menu', 'listings', 'prices', 'offers', 'finder', 'faq', 'book'],
  contacto: ['hero', 'visit', 'book'],
  sub: ['hero', 'text', 'services', 'prices', 'faq', 'book'],
};
function viewContent(c, view, sub) {
  const hero = c.hero || {};
  if (view === 'servicios') {
    const main = c.menu?.categories?.length ? c.menu : c.rooms?.items?.length ? c.rooms : c.listings?.items?.length ? c.listings : c.services || {};
    const photo = url(c.menu?.photo) || c.rooms?.items?.find(i => url(i.img))?.img || c.listings?.items?.find(i => url(i.img))?.img || c.services?.items?.find(i => url(i.img))?.img || hero.photo;
    return { ...c, rating: null, hero: { ...hero, title: main.title || 'Servicios', sub: main.sub || hero.sub, slots: [], photo } };
  }
  if (view === 'contacto') return { ...c, rating: null, hero: { ...hero, title: c.contactPage?.title || 'Contacto', sub: c.contactPage?.sub || [c.contact?.address, c.util?.hours].filter(Boolean).join(' · ') || hero.sub, slots: [], photo: c.visit?.photo || hero.photo, photoAlt: c.visit?.photoAlt } };
  if (view === 'sub' && sub) return {
    ...c, rating: null,
    hero: { ...hero, title: sub.hero?.title || sub.title, sub: sub.hero?.sub || sub.intro || '', photo: sub.hero?.photo || hero.photo, photoAlt: sub.hero?.photoAlt || sub.title, slots: [], cta: sub.cta || hero.cta },
    services: list(sub.items).length ? { title: sub.itemsTitle || 'Opciones', sub: sub.itemsSub, items: sub.items, note: sub.itemsNote } : null,
    prices: sub.prices || null,
    faq: list(sub.faq),
  };
  return c;
}


// Rubros (page.kind): cambian secciones, formulario, asistente y datos para Google
export const KINDS = { clinica: 'Clínica o consultorio', restaurante: 'Restaurante o café', hotel: 'Hotel u hospedaje', inmobiliaria: 'Inmobiliaria', despacho: 'Despacho contable o legal' };
const SCHEMA_TYPE = { clinica: 'MedicalClinic', restaurante: 'Restaurant', hotel: 'Hotel', inmobiliaria: 'RealEstateAgent', despacho: 'LegalService' };
const N = ['n', 'Nombre', { auto: 'name', req: true }], T = ['t', 'Teléfono', { type: 'tel', auto: 'tel' }];
const FORMS = {
  clinica: { title: 'Agenda tu cita', sub: 'Déjanos tus datos y te confirmamos por WhatsApp.', intro: 'Hola, quiero agendar una cita en', btn: 'Enviar y agendar',
    fields: [N, T, ['s', '¿Qué necesitas?', { opts: 'svc', wide: true }], ['d', 'Día que prefieres', { ph: 'Ej.: martes en la tarde' }], ['m', 'Comentarios']] },
  restaurante: { title: 'Reserva tu mesa', sub: 'Elige día y hora y te confirmamos por WhatsApp.', intro: 'Hola, quiero reservar una mesa en', btn: 'Reservar mesa',
    fields: [N, T, ['p', 'Personas', { opts: ['2', '3', '4', '5', '6', '7', '8', 'Más de 8'] }], ['d', 'Día', { type: 'date' }], ['h', 'Hora', { type: 'time' }], ['m', 'Ocasión o comentarios', { ph: 'Cumpleaños, terraza, silla para bebé…' }]] },
  hotel: { title: 'Reserva tu estancia', sub: 'Dinos tus fechas y te confirmamos disponibilidad y tarifa por WhatsApp.', intro: 'Hola, quiero reservar en', btn: 'Consultar disponibilidad',
    fields: [N, T, ['in', 'Llegada', { type: 'date' }], ['out', 'Salida', { type: 'date' }], ['g', 'Huéspedes', { opts: ['1', '2', '3', '4', '5', '6 o más'] }], ['r', 'Habitación', { opts: 'rooms' }], ['m', 'Comentarios', { wide: true }]] },
  inmobiliaria: { title: 'Cuéntanos qué buscas', sub: 'Te mandamos opciones que sí te sirven, por WhatsApp.', intro: 'Hola, busco una propiedad con', btn: 'Enviar',
    fields: [N, T, ['o', 'Busco', { opts: ['Comprar', 'Rentar', 'Vender mi propiedad', 'Poner en renta mi propiedad'] }], ['z', 'Zona o propiedad'], ['b', 'Presupuesto', { ph: 'Ej.: hasta $4,500,000' }], ['m', 'Comentarios']] },
  despacho: { title: 'Agenda tu primera consulta', sub: 'Cuéntanos tu caso en dos líneas y te contactamos hoy.', intro: 'Hola, quiero agendar una consulta con', btn: 'Agendar consulta',
    fields: [N, T, ['s', 'Tema', { opts: 'svc' }], ['f', '¿Cómo prefieres?', { opts: ['Llamada', 'Videollamada', 'En la oficina'] }], ['m', 'Cuéntanos brevemente tu caso', { wide: true }]] },
};

export function renderClinica(c = {}, { mode = 'live', marks = {}, view = 'home', sub = null, pages = null, href = null } = {}) {
  // Estudio: portada propia; las páginas internas usan las secciones de siempre con su tipografía
  const fc = fontChoice(c);
  const D = DESIGNS[themeOf(c).style];
  if (D && view === 'home') return (fc?.face || '') + D.render(c, { mode, marks, fontVars: fc?.vars || '' }) + (mode === 'live' ? `\n<script type="application/ld+json">${JSON.stringify(schemaClinica(c)).replace(/</g, '\\u003c')}</script>` : '');
  if (themeOf(c).style === 'fonda') return (fc?.face || '') + renderFonda(c, { mode, marks, view, pages, href, fontVars: fc?.vars || '' }) + (mode === 'live' && view === 'home' ? `\n<script type="application/ld+json">${JSON.stringify(schemaClinica(c)).replace(/</g, '\\u003c')}</script>` : '');
  const live = mode === 'live';
  if (view !== 'home') c = viewContent(c, view, sub);
  const show = key => view === 'home' || (VIEWS[view] || []).includes(key);
  // Enlaces entre páginas: href(slug) arma la dirección («» = inicio)
  const linkTo = slug => (href ? href(slug) : `/${slug}`);
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const name = brand.fullName || brand.name || '';
  const waNum = digits(contact.whatsapp), telNum = digits(contact.phone);
  const waMsg = t => `https://wa.me/${waNum}?text=${encodeURIComponent(t)}`;
  const waHref = waNum ? waMsg(`Hola, quiero agendar una cita en ${name || 'la clínica'}`) : '';
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const bookHref = url(contact.bookingUrl) || waHref || (telNum ? `tel:${telNum}` : '');
  const mk = sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`;
  const ext = h => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');
  const act = (cls, href, inner, extra = '') => (live && href ? `<a class="${cls}" href="${esc(href)}"${ext(href)}${extra}>${inner}</a>` : `<span class="${cls}"${extra}>${inner}</span>`);
  const page = label => (live ? `<a href="#" data-page="${esc(label)}">${esc(label)}</a>` : `<span>${esc(label)}</span>`);
  const img = (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : `<div class="${cls} cx-noimg" aria-hidden="true"></div>`);

  const nav = list(c.nav).slice(0, 6);
  const rating = c.rating?.value ? c.rating : null;
  const services = list(c.services?.items).slice(0, 8);
  const trust = list(c.trust).slice(0, 4);
  const today = c.today?.bullets?.length ? c.today : null;
  const steps = list(c.process?.steps).slice(0, 5);
  const members = list(c.team?.members).slice(0, 8);
  const gallery = list(c.gallery?.images).filter(g => url(g.img)).slice(0, 8);
  const reviews = list(c.reviews?.items).slice(0, 6);
  const faq = list(c.faq).length ? list(c.faq) : list(c.chat?.faq).map(f => ({ q: f.q, a: f.a }));
  const visit = c.visit || {};
  const hoursRows = list(visit.rows).filter(r => !(contact.address && /^direcci/i.test(r.dt || '')));
  const legal = c.legal || {};
  const ctaTop = esc(hero.ctaTop || 'Agenda tu cita');
  const stats = list(c.stats).slice(0, 4);
  const priceRows = list(c.prices?.rows).length ? list(c.prices.rows) : services.filter(s => s.price).map(s => ({ name: s.name, price: s.price }));
  const offers = list(c.offers?.items).slice(0, 3);
  const tech = list(c.tech?.items).slice(0, 4);
  const pay = list(c.payments?.methods), insurers = list(c.payments?.insurers);
  const chat = list(c.chat?.faq).length ? c.chat : null;
  const kind = KINDS[c.kind] ? c.kind : 'clinica';
  const menuCats = list(c.menu?.categories).filter(m => list(m.items).length).slice(0, 8);
  const rooms = list(c.rooms?.items).slice(0, 8);
  const amenities = list(c.amenities?.items).slice(0, 12);
  const listings = list(c.listings?.items).slice(0, 12);
  const textCards = services.length && services.every(s => !url(s.img));
  const actLabel = { clinica: 'Agendar', restaurante: 'Reservar', hotel: 'Reservar', inmobiliaria: 'Platicar con una asesora', despacho: 'Consultar' }[kind];
  const wantLabel = { clinica: 'Quiero agendar', restaurante: 'Quiero reservar', hotel: 'Quiero reservar', inmobiliaria: 'Quiero información', despacho: 'Quiero una consulta' }[kind];
  // Lo que sabe el asistente (para la demostración y para responder lo que escriban)
  const kb = chat ? {
    name, wa: waNum, book: live ? bookHref : '', maps: live ? mapsHref : '', address: contact.address || '',
    hours: hoursRows.map(r => [r.dt, r.dd]), slots: list(hero.slots).slice(0, 3),
    faq: [...faq, ...list(chat.faq)].map(f => [f.q, f.a]).slice(0, 14),
    services: [...services.map(s => [s.name, s.price || '', s.desc || '']),
      ...menuCats.flatMap(m => list(m.items).map(i => [i.name, i.price || '', [m.name, i.desc].filter(Boolean).join(': ')])),
      ...rooms.map(r => [r.name, r.price ? `${r.price} por ${r.unit || 'noche'}` : '', [r.desc, r.guests && `hasta ${r.guests} huéspedes`].filter(Boolean).join(' · ')]),
      ...listings.map(l => [l.title, l.price || '', [l.op, l.zone, l.beds && `${l.beds} recámaras`, l.m2 && `${l.m2} m²`].filter(Boolean).join(' · ')])].slice(0, 40),
    more: list(c.services?.more),
    pay: [...pay, ...insurers], today: list(today?.bullets).map(b => b.t || b),
  } : null;
  const ratingLine = rating ? `<span class="cx-stars" aria-hidden="true">${stars(rating.value)}</span><b>${esc(rating.value)}</b><span>${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</span>` : '';

  const out = [];
  const th = themeOf(c), [fh, fb] = FONTS[th.font];
  const cls = ['cx', th.mode === 'dark' && 'cx--dark', th.hero !== 'organic' && `cx--hero-${th.hero}`, th.corners === 'sharp' && 'cx--sharp', th.buttons !== 'pill' && `cx--btn-${th.buttons}`, th.style === 'expresiva' && 'cx--expresiva', th.style === 'cercana' && 'cx--cercana', c.kind === 'restaurante' && 'cx--resto'].filter(Boolean).join(' ');
  const xp = th.style === 'expresiva', ck = th.style === 'cercana';
  // Palabras en máscaras (entrada del título y frase que se enciende): se arman aquí para que no parpadee
  const words = t => String(t || '').split(/\s+/).filter(Boolean).map((w, i) => `<span class="cx-w" style="--i:${i}"><span>${esc(w)}</span></span>`).join(' ');
  const fstack = f => `'${f}',ui-sans-serif,system-ui,sans-serif`;
  out.push(`${fc?.face || ''}<div class="${cls}" style="--a:${hex(brand.accent)};--fh:${fstack(fh)};--fb:${fstack(fb)};${fc?.vars || ''}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  // Barra superior
  if (c.util?.note || c.util?.hours || telNum) out.push(`<div class="cx-util">${c.util?.note ? `<span>${ico('bolt', 'cx-ico-s')}${esc(c.util.note)}</span>` : ''}${c.util?.hours ? `<span class="cx-util-h">${ico('clock', 'cx-ico-s')}${esc(c.util.hours)}</span>` : ''}${telNum ? act('cx-util-tel', `tel:${telNum}`, `${ico('phone', 'cx-ico-s')}${esc(contact.phone)}`) : ''}</div>`);

  // Encabezado
  out.push(`<header class="cx-top"><div class="cx-brand">${pages?.length && live ? `<a class="cx-home" href="${esc(linkTo(''))}" aria-label="${esc(name)}, inicio"></a>` : ''}${url(th.mode === 'dark' && brand.logoDark ? brand.logoDark : brand.logo) ? `<img src="${url(th.mode === 'dark' && brand.logoDark ? brand.logoDark : brand.logo)}" alt="${esc(name)}" class="${[brand.logoWide && 'cx-logo-wide', th.mode === 'dark' && brand.logoDark && 'cx-logo-dark'].filter(Boolean).join(' ')}">` : `<b>${esc(brand.name)}</b>${brand.tagline ? `<span>${esc(brand.tagline)}</span>` : ''}`}</div>
    <nav class="cx-nav">${pages?.length && live ? pages.filter(pg => pg.slug).slice(0, 6).map(pg => `<a href="${esc(linkTo(pg.slug))}"${(sub?.slug || view) === pg.slug ? ' aria-current="page"' : ''}>${esc(pg.nav || pg.title)}</a>`).join('') : nav.map(page).join('')}</nav>
    <div class="cx-top-acts">${telNum ? act('cx-btn cx-btn--line cx-hide-s', `tel:${telNum}`, `${ico('phone', 'cx-ico-s')}Llamar`) : ''}${act('cx-btn', bookHref, ctaTop, mk('cta'))}</div></header>`);

  // Hero
  if (show('hero')) out.push(`<section class="cx-hero" data-enter${mk('hero')}><div class="cx-hero-copy">
      ${rating ? `<p class="cx-rating">${ratingLine}</p>` : ''}
      <h1${xp ? ' class="cx-h1-words"' : ''}>${xp ? words(hero.title) : esc(hero.title)}</h1>
      ${hero.sub ? `<p class="cx-lede">${esc(hero.sub)}</p>` : ''}
      <div class="cx-ctas">${act('cx-btn cx-btn--lg', bookHref, `${esc(hero.cta || 'Agenda tu cita')}${ico('arrow', 'cx-ico-s')}`)}${waNum ? act('cx-btn cx-btn--lg cx-btn--ghost', waHref, `${WA}${esc(hero.ctaWhatsapp || 'Escríbenos por WhatsApp')}`) : ''}</div>
      ${list(hero.slots).length ? `<p class="cx-next"><span>Próximos horarios</span>${list(hero.slots).slice(0, 3).map(s => act('cx-next-slot', waNum ? waMsg(`Hola, quiero agendar el horario de ${s}`) : bookHref, esc(s))).join('')}</p>` : ''}
      ${telNum ? `<p class="cx-call">${esc(hero.callLabel || 'O llámanos')}: ${act('cx-u', `tel:${telNum}`, `<b>${esc(contact.phone)}</b>`)}</p>` : ''}
    </div>
    <div class="cx-hero-media">${img(hero.photo, hero.photoAlt || name, 'cx-hero-img')}${ck && trust[0]?.b ? `<div class="cx-sticker" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="cxs" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs><text textLength="276" lengthAdjust="spacing"><textPath href="#cxs" textLength="276" lengthAdjust="spacing">${esc(`${trust[0].b.slice(0, 26)} · `.repeat(trust[0].b.length <= 12 ? 3 : 2))}</textPath></text></svg><span>${ico(iconName(trust[0].icon, trust[0].b), 'cx-ico')}</span></div>` : ''}</div></section>`);

  // Restaurante: cinta con los platillos, justo después del hero
  if (c.kind === 'restaurante' && view === 'home') {
    const dishes = list(c.menu?.categories).flatMap(m => list(m.items).map(i => i.name)).filter(Boolean).slice(0, 12);
    if (dishes.length >= 4) out.push(`<div class="cx-marquee cx-marquee--band" role="marquee" aria-label="Del menú: ${esc(dishes.join(', '))}"><div class="cx-mq-track" aria-hidden="true">${[0, 1].map(() => `<span>${dishes.map(d => `<em>${esc(d)}</em>`).join('<i>✺</i>')}<i>✺</i></span>`).join('')}</div></div>`);
  }

  // Texto de una página interna (servicio, zona o catálogo)
  if (show('text') && sub) {
    if (sub.intro && sub.hero?.sub) out.push(`<section class="cx-sec cx-text"><p class="cx-lede">${esc(sub.intro)}</p></section>`);
    for (const t of list(sub.sections).slice(0, 8)) out.push(`<section class="cx-sec cx-text"><div class="cx-head"><div><h2>${esc(t.title)}</h2>${t.text ? `<p>${esc(t.text)}</p>` : ''}</div></div>${list(t.bullets).length ? `<ul class="cx-checks">${list(t.bullets).slice(0, 8).map(b => `<li>${ico('check', 'cx-ico-c')}<span>${esc(b)}</span></li>`).join('')}</ul>` : ''}</section>`);
  }

  // Beneficios
  if (show('trust') && trust.length) out.push(`<section class="cx-benefits"${mk('trust')}>${trust.map(t => `<div class="cx-benefit">${ck ? `<i class="cx-bico">${ico(iconName(t.icon, `${t.b} ${t.t}`))}</i>` : ''}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);

  // Cifras
  if (show('stats') && stats.length >= 3) out.push(`<section class="cx-stats">${stats.map(s => `<div><b${xp ? ' data-cx-count' : ''}>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);

  // Expresiva: una frase grande que se enciende palabra por palabra al hacer scroll
  const statement = c.statement || today?.text || '';
  if (xp && view === 'home' && statement) out.push(`<section class="cx-statement cx-sec"><p data-cx-words>${words(statement)}</p></section>`);

  // Atención de hoy
  if (show('today') && today) out.push(`<section class="cx-today cx-sec"><div class="cx-today-copy"><h2>${esc(today.title || 'Te atendemos')}</h2>${today.text && !(xp && view === 'home' && !c.statement) ? `<p>${esc(today.text)}</p>` : ''}${hoursRows.length ? `<dl class="cx-hours">${hoursRows.slice(0, 4).map(r => `<dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd>`).join('')}</dl>` : ''}</div>
    <div class="cx-panel"><ul class="cx-checks">${list(today.bullets).slice(0, 5).map(b => `<li>${ico(iconName(b.icon, b.t || b), 'cx-ico-c')}<span>${esc(b.t || b)}</span></li>`).join('')}</ul>${act('cx-btn', bookHref, ctaTop)}</div></section>`);

  // Habitaciones (hotel)
  if (show('rooms') && rooms.length) out.push(`<section class="cx-rooms cx-sec"${mk('services')}><div class="cx-head"><div><h2>${esc(c.rooms.title || 'Habitaciones')}</h2>${c.rooms.sub ? `<p>${esc(c.rooms.sub)}</p>` : ''}</div></div>
    <div class="cx-room-list">${rooms.map(r => {
      const specs = [r.guests && `Hasta ${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`, r.view].filter(Boolean);
      const href = waNum ? waMsg(`Hola, quiero reservar la habitación ${r.name}. ¿Tienen disponibilidad?`) : bookHref;
      return `<article class="cx-room"><div class="cx-room-frame">${img(r.img, r.imgAlt || r.name, 'cx-room-img')}</div><div class="cx-room-body"><h3>${esc(r.name)}</h3>${r.desc ? `<p>${esc(r.desc)}</p>` : ''}
        ${specs.length ? `<p class="cx-specs">${specs.map(x => `<span>${esc(x)}</span>`).join('')}</p>` : ''}
        ${list(r.amenities).length ? `<ul class="cx-amen-mini">${list(r.amenities).slice(0, 6).map(x => `<li>${ico('check', 'cx-ico-s')}${esc(x)}</li>`).join('')}</ul>` : ''}
        <div class="cx-room-foot">${r.price ? `<p class="cx-room-price"><small>Desde</small><b>${esc(r.price)}</b><small>por ${esc(r.unit || 'noche')}</small></p>` : '<span></span>'}${act('cx-btn', href, 'Reservar')}</div></div></article>`;
    }).join('')}</div>${c.rooms.note ? `<p class="cx-note">${esc(c.rooms.note)}</p>` : ''}</section>`);

  // Amenidades (hotel)
  if (show('amenities') && amenities.length) out.push(`<section class="cx-amenities cx-sec"><div class="cx-head"><div><h2>${esc(c.amenities.title || 'Todo lo que incluye tu estancia')}</h2>${c.amenities.sub ? `<p>${esc(c.amenities.sub)}</p>` : ''}</div></div><ul class="cx-amen">${amenities.map(a => `<li>${ico(iconName(a.icon, a.b), 'cx-ico')}<b>${esc(a.b)}</b>${a.t ? `<span>${esc(a.t)}</span>` : ''}</li>`).join('')}</ul></section>`);

  // Menú (restaurante): pestañas por categoría; sin script se ve completo
  if (show('menu') && menuCats.length) out.push(`<section class="cx-menu cx-sec"${mk('services')}><div class="cx-head"><div><h2>${esc(c.menu.title || 'Nuestro menú')}</h2>${c.menu.sub ? `<p>${esc(c.menu.sub)}</p>` : ''}</div>${live && url(c.menu.pdf) ? `<a class="cx-btn cx-btn--line" href="${esc(url(c.menu.pdf))}" target="_blank" rel="noopener">Ver menú completo</a>` : ''}</div>
    ${menuCats.length > 1 ? `<div class="cx-tabs" role="tablist" aria-label="Categorías del menú">${menuCats.map((m, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cx-tab="${i}">${esc(m.name)}</button>`).join('')}</div>` : ''}
    <div class="cx-menu-wrap${url(c.menu.photo) ? ' cx-menu-wrap--photo' : ''}">${url(c.menu.photo) ? `<figure class="cx-menu-photo">${img(c.menu.photo, c.menu.photoAlt || 'Platillos de la casa', 'cx-menu-img')}${c.menu.photoCaption ? `<figcaption>${esc(c.menu.photoCaption)}</figcaption>` : ''}</figure>` : ''}<div class="cx-menu-cats">${menuCats.map((m, i) => `<div class="cx-menu-cat" role="tabpanel" data-cx-panel="${i}"><h3>${esc(m.name)}</h3>${m.note ? `<p class="cx-note">${esc(m.note)}</p>` : ''}<ul>${list(m.items).slice(0, 16).map(it => `<li><div class="cx-dish"><b>${esc(it.name)}</b>${list(it.tags).length ? `<span class="cx-tags">${list(it.tags).slice(0, 3).map(t => `<em>${esc(t)}</em>`).join('')}</span>` : ''}${it.desc ? `<p>${esc(it.desc)}</p>` : ''}</div><i aria-hidden="true"></i>${it.price ? `<span class="cx-dish-p">${esc(it.price)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}</div></div>
    ${c.menu.note ? `<p class="cx-note">${esc(c.menu.note)}</p>` : ''}</section>`);

  // Propiedades (inmobiliaria): filtro venta / renta
  if (show('listings') && listings.length) {
    const ops = [...new Set(listings.map(l => String(l.op || '').toLowerCase()).filter(Boolean))];
    out.push(`<section class="cx-listings cx-sec"${mk('services')}><div class="cx-head"><div><h2>${esc(c.listings.title || 'Propiedades disponibles')}</h2>${c.listings.sub ? `<p>${esc(c.listings.sub)}</p>` : ''}</div>
      ${ops.length > 1 ? `<div class="cx-tabs cx-tabs--sm" role="radiogroup" aria-label="Filtrar propiedades"><button type="button" role="radio" aria-checked="true" data-cx-filter="">Todas</button>${ops.map(o => `<button type="button" role="radio" aria-checked="false" data-cx-filter="${esc(o)}">${esc(o[0].toUpperCase() + o.slice(1))}</button>`).join('')}</div>` : ''}</div>
      <ul class="cx-props">${listings.map(l => {
        const specs = [l.beds && `${l.beds} rec.`, l.baths && `${l.baths} baños`, l.m2 && `${l.m2} m²`, l.parking && `${l.parking} ${String(l.parking) === '1' ? 'auto' : 'autos'}`].filter(Boolean);
        const href = waNum ? waMsg(`Hola, me interesa la propiedad: ${l.title}${l.zone ? ` (${l.zone})` : ''}. ¿Me dan más información?`) : bookHref;
        return `<li class="cx-prop" data-op="${esc(String(l.op || '').toLowerCase())}"><div class="cx-card-frame">${img(l.img, l.imgAlt || l.title, 'cx-card-img')}${l.op ? `<em class="cx-badge">${esc(l.op)}</em>` : ''}</div>
          <div class="cx-prop-body">${l.price ? `<p class="cx-prop-price">${esc(l.price)}</p>` : ''}<b>${esc(l.title)}</b>${l.zone ? `<p class="cx-prop-zone">${ico('map', 'cx-ico-s')}${esc(l.zone)}</p>` : ''}
          ${specs.length ? `<p class="cx-specs">${specs.map(x => `<span>${esc(x)}</span>`).join('')}</p>` : ''}${act('cx-link cx-card-link', href, `Me interesa${ico('arrow', 'cx-ico-s cx-arrow')}`)}</div></li>`;
      }).join('')}</ul>${c.listings.note ? `<p class="cx-note">${esc(c.listings.note)}</p>` : ''}</section>`);
  }

  // Servicios
  if (show('services') && services.length) out.push(`<section class="cx-services cx-sec"${mk('services')}><div class="cx-head"><div><h2>${esc(c.services.title || 'Nuestros servicios')}</h2>${c.services.sub ? `<p>${esc(c.services.sub)}</p>` : ''}</div><div class="cx-car-nav"><button type="button" data-cx-car="prev" aria-label="Anterior">${ico('arrow', 'cx-ico-s cx-flip')}</button><button type="button" data-cx-car="next" aria-label="Siguiente">${ico('arrow', 'cx-ico-s')}</button></div></div>
    <ul class="cx-car${textCards ? ' cx-car--text' : ''}"${ck ? ' data-cx-pop' : ''} tabindex="0" aria-label="${esc(c.services.title || 'Servicios')}, desliza para ver más">${services.map(s => {
      const call = s.action === 'Llamar' && telNum;
      const href = call ? `tel:${telNum}` : (waNum && !contact.bookingUrl ? waMsg(`Hola, me interesa: ${s.name}`) : bookHref);
      return `<li class="cx-card">${textCards ? '' : `<div class="cx-card-frame">${img(s.img, s.imgAlt || s.name, 'cx-card-img')}</div>`}<div class="cx-card-body"><div class="cx-card-t"><b>${esc(s.name)}</b>${s.price ? `<i>${esc(s.price)}</i>` : ''}</div><p>${esc(s.desc)}</p>${act('cx-link cx-card-link', href, `${esc(s.action || actLabel)}${ico('arrow', 'cx-ico-s cx-arrow')}`)}</div></li>`;
    }).join('')}</ul>
    ${list(c.services.more).length ? (xp ? `<div class="cx-marquee" role="marquee" aria-label="También atendemos: ${esc(list(c.services.more).slice(0, 14).join(', '))}"><div class="cx-mq-track" aria-hidden="true">${[0, 1].map(() => `<span>${list(c.services.more).slice(0, 14).map(m => `<em>${esc(m)}</em>`).join('<i>·</i>')}<i>·</i></span>`).join('')}</div></div>` : `<div class="cx-pills"><span>También atendemos:</span>${list(c.services.more).slice(0, 14).map(m => `<em>${esc(m)}</em>`).join('')}</div>`) : ''}
    ${c.services.note ? `<p class="cx-note">${esc(c.services.note)}</p>` : ''}</section>`);

  // Lista de precios
  if (show('prices') && priceRows.length >= 3) out.push(`<section class="cx-prices cx-sec"><div class="cx-prices-in"><div class="cx-prices-copy"><h2>${esc(c.prices?.title || 'Precios claros, sin sorpresas')}</h2><p>${esc(c.prices?.note || 'Precios de referencia. Te confirmamos el tuyo en tu valoración, antes de empezar.')}</p>${act('cx-btn', bookHref, ctaTop)}</div><ul>${priceRows.slice(0, 10).map(r => `<li><span>${esc(r.name)}</span><i aria-hidden="true"></i><b>${esc(r.price)}</b></li>`).join('')}</ul></div></section>`);

  // Ayuda para elegir (interactivo, con los mismos servicios)
  if (show('finder') && services.length >= 3) out.push(`<section class="cx-finder cx-sec"><div class="cx-panel cx-finder-in"><div><h2>${esc(c.finder?.title || '¿Qué necesitas?')}</h2><p>${esc(c.finder?.sub || 'Elige una opción y te decimos cómo empezar.')}</p></div>
    <div class="cx-finder-opts" role="radiogroup" aria-label="Servicio">${services.slice(0, 6).map((s, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-cx-pick="${i}">${esc(s.name)}</button>`).join('')}</div>
    <div class="cx-finder-out" aria-live="polite">${services.slice(0, 6).map((s, i) => {
      const href = waNum ? waMsg(`Hola, me interesa: ${s.name}. ¿Me dan más información?`) : bookHref;
      return `<div data-cx-res="${i}"${i ? ' hidden' : ''}><b>${esc(s.name)}</b>${s.price ? `<i>${esc(s.price)}</i>` : ''}<p>${esc(s.desc)}</p>${act('cx-btn', href, `${waNum ? WA : ''}${wantLabel}`)}</div>`;
    }).join('')}</div></div></section>`);

  // Paquetes y promociones
  if (show('offers') && offers.length) out.push(`<section class="cx-offers cx-sec"><div class="cx-head"><div><h2>${esc(c.offers.title || 'Paquetes y promociones')}</h2>${c.offers.sub ? `<p>${esc(c.offers.sub)}</p>` : ''}</div></div><div class="cx-offer-list">${offers.map((o, i) => {
      const hl = offers.length > 1 ? i === 1 : true;
      return `<div class="cx-offer${hl ? ' cx-offer--hl' : ''}">${o.tag ? `<em>${esc(o.tag)}</em>` : ''}<b>${esc(o.title)}</b><p>${esc(o.desc)}</p><div class="cx-offer-p">${o.was ? `<s>${esc(o.was)}</s>` : ''}<strong>${esc(o.price)}</strong></div>${act(`cx-btn${hl ? '' : ' cx-btn--line'}`, waNum ? waMsg(`Hola, me interesa: ${o.title}`) : bookHref, 'Lo quiero')}</div>`;
    }).join('')}</div>${c.offers.note ? `<p class="cx-note">${esc(c.offers.note)}</p>` : ''}</section>`);

  // Asistente con IA (demostración que se reproduce sola y responde lo que escriban)
  if (show('chat') && chat) out.push(`<section class="cx-ai cx-sec"${mk('chat')}><div class="cx-ai-in"><div class="cx-ai-copy"><span class="cx-kicker">${ico('sparkle', 'cx-ico-s')}Asistente con IA</span><h2>${esc(c.assistant?.title || 'Pregunta lo que quieras, a cualquier hora')}</h2><p>${esc(c.assistant?.sub || 'Responde al momento con nuestra información, te ayuda a elegir y aparta tu cita. Si necesitas a una persona, te pasa con recepción por WhatsApp.')}</p>
      <ul class="cx-checks">${(list(c.assistant?.bullets).length ? list(c.assistant.bullets) : ['Precios, horarios y ubicación al momento', 'Aparta tu cita sin esperar respuesta', 'Atiende de noche y en fin de semana', 'Te pasa con recepción cuando lo necesitas']).slice(0, 4).map(b => `<li>${ico('check', 'cx-ico-c')}<span>${esc(b)}</span></li>`).join('')}</ul>
      <p class="cx-ai-try">${ico('chat', 'cx-ico-s')}Pruébalo: escribe una pregunta en el chat.</p></div>
    <div class="cx-phone"><div class="cx-phone-top"><span class="cx-avatar" aria-hidden="true">${ico('sparkle', 'cx-ico-s')}</span><div><b>${esc(chat.title || name)}</b><small>Asistente · responde al momento</small></div></div>
      <div class="cx-phone-log" data-cx-log aria-live="polite"></div>
      <form class="cx-ask" data-cx-ask${live ? '' : ' inert'}><input name="q" placeholder="Escribe tu pregunta…" autocomplete="off" aria-label="Escribe tu pregunta al asistente"><button type="submit" aria-label="Enviar">${ico('arrow', 'cx-ico-s')}</button></form></div></div></section>`);

  // Proceso
  if (show('process') && steps.length >= 2) out.push(`<section class="cx-process cx-sec"><div class="cx-head"><div><h2>${esc(c.process.title || 'Cómo es tu primera visita')}</h2>${c.process.sub ? `<p>${esc(c.process.sub)}</p>` : ''}</div></div><ol>${steps.map((s, i) => `<li><span class="cx-num">${i + 1}</span><b>${esc(s.t)}</b><p>${esc(s.d)}</p></li>`).join('')}</ol></section>`);

  // Equipo
  if (show('team') && (c.team?.text || members.length)) out.push(`<section class="cx-team cx-sec"${mk('team')}><div class="cx-head"><div><h2>${esc(c.team.title || 'Nuestro equipo')}</h2>${c.team.text ? `<p>${esc(c.team.text)}</p>` : ''}</div></div>
    ${members.length ? `<ul class="cx-people">${members.map(m => `<li>${img(m.photo, m.name, 'cx-person-img')}<div class="cx-person-t"><b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</div></li>`).join('')}</ul>`
      : `<div class="cx-team-solo">${img(c.team.photo, c.team.photoAlt, 'cx-team-img')}<ul class="cx-checks">${list(c.team.bullets).slice(0, 6).map(b => `<li>${ico('check', 'cx-ico-c')}<span>${esc(b)}</span></li>`).join('')}</ul></div>`}
    ${c.team.note ? `<p class="cx-note">${esc(c.team.note)}</p>` : ''}</section>`);

  // Tecnología
  if (show('tech') && tech.length >= 2) out.push(`<section class="cx-tech cx-sec"><div class="cx-tech-in">${img(c.tech.photo, c.tech.photoAlt, 'cx-tech-img')}<div class="cx-tech-copy"><h2>${esc(c.tech.title || 'Tecnología que se nota')}</h2>${c.tech.text ? `<p>${esc(c.tech.text)}</p>` : ''}<div class="cx-tech-grid">${tech.map(t => `<div>${ico(iconName(t.icon, `${t.b} ${t.t}`))}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</div></div></div></section>`);

  // Galería
  if (show('gallery') && gallery.length >= 3 && xp) out.push(`<section class="cx-chapters" data-cx-chapters style="--n:${gallery.length}"><div class="cx-ch-pin"><div class="cx-ch-head"><h2>${esc(c.gallery.title || 'Conoce el lugar')}</h2>${c.gallery.text ? `<p>${esc(c.gallery.text)}</p>` : ''}<span class="cx-ch-count" aria-hidden="true"><b>1</b> / ${gallery.length}</span></div><div class="cx-ch-frame">${gallery.map((g, i) => `<div class="cx-ch-img${i ? '' : ' is-on'}" role="img" aria-label="${esc(g.alt || '')}" style="background-image:url('${url(g.img)}')"></div>`).join('')}</div></div></section>`);
  else if (show('gallery') && gallery.length >= 3) out.push(`<section class="cx-gallery cx-sec"><div class="cx-head"><div><h2>${esc(c.gallery.title || 'Conoce el lugar')}</h2>${c.gallery.text ? `<p>${esc(c.gallery.text)}</p>` : ''}</div></div><div class="cx-mosaic" data-moment="develop">${gallery.map((g, i) => `<div class="cx-tile cx-tile--${i % 6}">${img(g.img, g.alt, 'cx-tile-img')}</div>`).join('')}</div></section>`);

  // Reseñas
  if (show('reviews') && reviews.length) out.push(`<section class="cx-reviews cx-sec"${mk('reviews')}><div class="cx-head"><div><h2>${esc(c.reviews.title || 'Lo que dicen nuestros clientes')}</h2>${rating ? `<p class="cx-rating">${ratingLine}</p>` : ''}</div>${live && url(c.reviews.moreUrl) ? `<a class="cx-btn cx-btn--line" href="${esc(url(c.reviews.moreUrl))}" target="_blank" rel="noopener">Ver todas en Google</a>` : ''}</div>
    <div class="cx-rev-list">${reviews.map(r => `<figure class="cx-rev"><span class="cx-stars" aria-label="${esc(r.stars || 5)} de 5">${stars(r.stars || 5)}</span><blockquote>${esc(r.text)}</blockquote><figcaption><span class="cx-avatar" aria-hidden="true">${esc((r.name || '?').trim()[0])}</span><b>${esc(r.name)}</b>${r.meta ? `<small>${esc(r.meta)}</small>` : ''}</figcaption></figure>`).join('')}</div>
    ${c.reviews.note ? `<p class="cx-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Formas de pago y aseguradoras
  if (show('pay') && (pay.length || insurers.length)) out.push(`<section class="cx-pay cx-sec"><div class="cx-pay-in"><div><h2>${esc(c.payments.title || 'Formas de pago')}</h2>${c.payments.text ? `<p>${esc(c.payments.text)}</p>` : ''}</div><div class="cx-pay-lists">${pay.length ? `<div class="cx-chips">${pay.map(x => `<span>${ico('card', 'cx-ico-s')}${esc(x)}</span>`).join('')}</div>` : ''}${insurers.length ? `<p class="cx-pay-l">Aseguradoras</p><div class="cx-chips">${insurers.map(x => `<span>${ico('shield', 'cx-ico-s')}${esc(x)}</span>`).join('')}</div>` : ''}</div></div></section>`);

  // Preguntas frecuentes
  if (show('faq') && faq.length) out.push(`<section class="cx-faq cx-sec"><div class="cx-head"><div><h2>Preguntas frecuentes</h2></div></div><div class="cx-faq-list">${faq.slice(0, 8).map(f => `<div class="cx-qa"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('')}</div></section>`);

  // Ubicación
  if (show('visit')) out.push(`<section class="cx-visit cx-sec"${mk('visit')}><div class="cx-visit-card">${img(visit.photo, visit.photoAlt || 'Fachada', 'cx-visit-img')}<div class="cx-visit-info"><h2>${esc(visit.title || 'Cómo llegar')}</h2>
      ${contact.address ? `<p class="cx-addr">${ico('map', 'cx-ico-s')}${esc(contact.address)}</p>` : ''}${visit.zones ? `<p class="cx-zones">${esc(visit.zones)}</p>` : ''}
      ${hoursRows.length ? `<dl class="cx-hours">${hoursRows.slice(0, 5).map(r => `<dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd>`).join('')}</dl>` : ''}
      <div class="cx-ctas">${mapsHref ? act('cx-btn', mapsHref, `${ico('map', 'cx-ico-s')}Abrir en Google Maps`) : ''}${waNum ? act('cx-btn cx-btn--ghost', waHref, `${WA}WhatsApp`) : ''}</div></div></div>
    ${live && contact.address ? `<div class="cx-map"><iframe title="Mapa de ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&amp;output=embed"></iframe></div>` : ''}</section>`);

  // Formulario por rubro (abre WhatsApp con el mensaje armado)
  const F = FORMS[kind];
  const field = ([n, label, o = {}]) => {
    const opts = o.opts === 'svc' ? services.map(x => x.name).concat(services.length ? ['Otro'] : []) : o.opts === 'rooms' ? rooms.map(r => r.name) : o.opts;
    if (Array.isArray(opts) && !opts.length) return '';
    const ctl = Array.isArray(opts)
      ? `<select name="${n}" data-l="${esc(label)}"><option value="">Elige una opción</option>${opts.map(x => `<option>${esc(x)}</option>`).join('')}</select>`
      : `<input name="${n}" data-l="${esc(label)}"${o.type ? ` type="${o.type}"` : ''}${o.auto ? ` autocomplete="${o.auto}"` : ''}${o.type === 'tel' ? ' inputmode="tel"' : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.req ? ' required' : ''}>`;
    return `<label${o.wide ? ' class="cx-wide"' : ''}><span>${esc(label)}</span>${ctl}</label>`;
  };
  if (show('book') && (waNum || contact.bookingUrl)) out.push(`<section class="cx-book cx-sec"><div class="cx-panel cx-book-in"><div class="cx-book-copy"><h2>${esc(c.form?.title || F.title)}</h2><p>${esc(c.form?.sub || F.sub)}</p></div>
    <form class="cx-form" data-cx-form data-intro="${esc(F.intro)}"${live ? '' : ' inert'}>${F.fields.map(field).join('')}
      <button class="cx-btn cx-btn--lg cx-wide" type="submit">${waNum ? WA : ''}${esc(c.form?.button || F.btn)}</button><small class="cx-wide">Al enviar aceptas nuestro aviso de privacidad.</small></form></div></section>`);

  // Pie
  out.push(`<footer class="cx-foot"><div class="cx-foot-cols"><div>${url(brand.logo) ? `<span class="cx-foot-logo"><img src="${url(brand.logo)}" alt="${esc(name)}"></span>` : `<b class="cx-foot-name">${esc(name)}</b>`}${contact.address ? `<p>${esc(contact.address)}</p>` : ''}</div>
      ${pages?.length && live ? `<div><b>Páginas</b>${pages.slice(0, 10).map(pg => `<a href="${esc(linkTo(pg.slug))}">${esc(pg.title)}</a>`).join('')}</div>` : services.length ? `<div><b>Servicios</b>${services.slice(0, 6).map(s => `<span>${esc(s.name)}</span>`).join('')}</div>` : ''}
      <div><b>Contacto</b>${telNum ? act('', `tel:${telNum}`, esc(contact.phone)) : ''}${waNum ? act('', waHref, 'WhatsApp') : ''}${contact.email ? act('', `mailto:${contact.email}`, esc(contact.email)) : ''}${hoursRows.slice(0, 2).map(r => `<span>${esc(r.dt)}: ${esc(r.dd)}</span>`).join('')}</div></div>
    <div class="cx-foot-legal"><span>© ${new Date().getFullYear()} ${esc(name)}</span><span>Aviso de privacidad</span>${legal.cofepris ? `<span>Aviso COFEPRIS ${esc(legal.cofepris)}</span>` : ''}${legal.responsable ? `<span>Responsable sanitario: ${esc(legal.responsable)}</span>` : ''}${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</div></footer>`);

  // Chat y WhatsApp flotantes
  out.push(`<div class="cx-fab">${chat ? `<div class="cx-chat" role="region" aria-label="Chat de ${esc(name)}"><div class="cx-chat-top"><div><b>${esc(chat.title || name)}</b><span>${esc(chat.subtitle || 'Te respondemos aquí o por WhatsApp')}</span></div><button type="button" data-cx-chat="toggle" aria-label="Cerrar chat">×</button></div>
      <div class="cx-chat-log"><p class="cx-msg">${esc(chat.greeting || 'Hola 👋 ¿En qué te podemos ayudar?')}</p></div>
      <div class="cx-chat-sug">${list(chat.faq).slice(0, 4).map(f => `<button type="button" data-cx-q data-a="${esc(f.a)}" data-act="${f.action === 'book' ? 'book' : 'wa'}">${esc(f.q)}</button>`).join('')}</div>
      <form class="cx-ask cx-ask--chat" data-cx-ask${live ? '' : ' inert'}><input name="q" placeholder="Escribe tu pregunta…" autocomplete="off" aria-label="Escribe tu pregunta"><button type="submit" aria-label="Enviar">${ico('arrow', 'cx-ico-s')}</button></form></div>
    ${live ? `<p class="cx-teaser" hidden>${esc(chat.teaser || { restaurante: '¿Te ayudo a reservar tu mesa? 👋', hotel: '¿Buscas habitación? Te ayudo 👋', inmobiliaria: '¿Buscas casa? Te ayudo 👋', despacho: '¿Tienes una duda legal o fiscal? 👋' }[kind] || '¿Te ayudo a agendar tu cita? 👋')}</p>` : ''}
    <button type="button" class="cx-chat-btn" data-cx-chat="toggle" aria-expanded="false" aria-label="${esc(chat.button || '¿Dudas? Pregúntanos')}">${ico('chat', 'cx-ico-s')}<span class="cx-chat-l">${esc(chat.button || '¿Dudas? Pregúntanos')}</span></button>` : ''}
    ${waNum ? act('cx-wa-fab', waHref, WA, ` aria-label="WhatsApp"${chat ? '' : mk('whatsapp')}`) : ''}</div>
  <div class="cx-sticky">${act('cx-btn', bookHref, ctaTop)}${waNum ? act('cx-btn cx-btn--ghost', waHref, `${WA}WhatsApp`) : ''}</div>`);

  if (kb) out.push(`<script type="application/json" class="cx-kb">${JSON.stringify(kb).replace(/</g, '\\u003c')}</script>`);
  out.push('</div>');
  if (live && view === 'home') out.push(`<script type="application/ld+json">${JSON.stringify(schemaClinica(c)).replace(/</g, '\\u003c')}</script>`);
  return out.join('\n');
}

// Datos estructurados (schema.org) para que Google y los asistentes de IA entiendan
// qué es la clínica, dónde está, qué ofrece, cuánto cuesta y qué preguntan sus pacientes.
export function schemaClinica(c = {}) {
  const brand = c.brand || {}, contact = c.contact || {};
  const list = v => (Array.isArray(v) ? v : []);
  const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length)));
  const biz = clean({
    '@type': c.schemaType || SCHEMA_TYPE[c.kind] || 'Dentist',
    name: brand.fullName || brand.name,
    description: c.hero?.sub || c.meta?.description,
    url: contact.website, logo: brand.logo, image: c.hero?.img || brand.logo,
    telephone: contact.phone || contact.whatsapp, email: contact.email,
    address: contact.address ? { '@type': 'PostalAddress', streetAddress: contact.address, addressCountry: 'MX' } : null,
    hasMap: contact.mapsUrl,
    areaServed: c.visit?.zones,
    openingHours: list(c.visit?.rows).filter(r => /\d{1,2}:\d{2}/.test(r.dd || '')).map(r => `${r.dt}: ${r.dd}`),
    aggregateRating: c.rating?.value ? { '@type': 'AggregateRating', ratingValue: String(c.rating.value), reviewCount: String(c.rating.count || '') } : null,
    makesOffer: list(c.services?.items).map(s => clean({ '@type': 'Offer', itemOffered: clean({ '@type': 'Service', name: s.name, description: s.desc }), price: (String(s.price || '').match(/[\d,.]+/) || [''])[0].replace(/,/g, '') || null, priceCurrency: s.price ? 'MXN' : null })),
  });
  const priceOf = v => (String(v || '').match(/[\d,.]+/) || [''])[0].replace(/,/g, '') || null;
  const menuCats = list(c.menu?.categories).filter(m => list(m.items).length);
  if (menuCats.length) biz.hasMenu = { '@type': 'Menu', hasMenuSection: menuCats.map(m => clean({ '@type': 'MenuSection', name: m.name, hasMenuItem: list(m.items).map(i => clean({ '@type': 'MenuItem', name: i.name, description: i.desc, offers: i.price ? { '@type': 'Offer', price: priceOf(i.price), priceCurrency: 'MXN' } : null })) })) };
  if (list(c.rooms?.items).length) biz.makesOffer = list(c.rooms.items).map(r => clean({ '@type': 'Offer', itemOffered: clean({ '@type': 'HotelRoom', name: r.name, description: r.desc, occupancy: r.guests ? { '@type': 'QuantitativeValue', maxValue: Number(r.guests) || undefined } : null }), price: priceOf(r.price), priceCurrency: r.price ? 'MXN' : null }));
  if (list(c.amenities?.items).length) biz.amenityFeature = list(c.amenities.items).map(a => ({ '@type': 'LocationFeatureSpecification', name: a.b, value: true }));
  if (list(c.listings?.items).length) biz.makesOffer = list(c.listings.items).map(l => clean({ '@type': 'Offer', name: l.title, description: [l.op, l.zone].filter(Boolean).join(' · '), price: priceOf(l.price), priceCurrency: l.price ? 'MXN' : null }));
  const faq = (list(c.faq).length ? list(c.faq) : list(c.chat?.faq)).filter(f => f.q && f.a);
  const graph = [biz];
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
