// Piezas comunes de los diseños de portada (estudio, galeria, fresca…): limpiar datos,
// enlaces reales (WhatsApp, llamar, mapas), y lo que cada diseño necesita del JSON del cliente.
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
export const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);
export const digits = s => String(s ?? '').replace(/\D/g, '');
export const hexOr = d => c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : d);
export const ICON = {
  wa: cls => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>`,
  arrow: cls => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
};

// Horario a datos (para «abierto ahora»): «Lunes a viernes» + «9:00 a 20:00» → { días: [1..5], de: 540, a: 1200 }
const DAYS = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, miércoles: 3, jueves: 4, viernes: 5, sabado: 6, sábado: 6 };
export function schedule(rows) {
  const out = [];
  for (const r of list(rows)) {
    const dt = String(r.dt || '').toLowerCase(), dd = String(r.dd || '');
    const t = dd.match(/(\d{1,2})(?::(\d{2}))?\s*(?:a|-|–)\s*(\d{1,2})(?::(\d{2}))?/);
    if (!t) continue;
    const names = Object.keys(DAYS).filter(d => dt.includes(d)).sort((a, b) => dt.indexOf(a) - dt.indexOf(b));
    let days = names.map(n => DAYS[n]);
    if (names.length === 2 && /\ba\b/.test(dt)) { days = []; for (let d = DAYS[names[0]]; ; d = (d + 1) % 7) { days.push(d); if (d === DAYS[names[1]]) break; } }
    if (!days.length) continue;
    out.push({ days, from: +t[1] * 60 + +(t[2] || 0), to: +t[3] * 60 + +(t[4] || 0) });
  }
  return out;
}

// Lo que todos los diseños sacan del JSON del cliente
export function base(c = {}, { mode = 'live', marks = {} } = {}, fallbackAccent = '#2A4DA0') {
  const live = mode === 'live';
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const name = brand.fullName || brand.name || '';
  const waNum = digits(contact.whatsapp), telNum = digits(contact.phone);
  const waMsg = t => `https://wa.me/${waNum}?text=${encodeURIComponent(t)}`;
  const waHref = waNum ? waMsg(`Hola, quiero agendar una cita en ${name || 'la clínica'}`) : '';
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const bookHref = url(contact.bookingUrl) || waHref || (telNum ? `tel:${telNum}` : '');
  const ext = h => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');
  const visit = c.visit || {};
  const rows = list(visit.rows).filter(r => !(contact.address && /^direcci/i.test(r.dt || '')));
  const faq = (list(c.faq).length ? list(c.faq) : list(c.chat?.faq)).filter(f => f.q && f.a);
  const services = list(c.services?.items);
  return {
    live, brand, contact, hero, name, waNum, telNum, waMsg, waHref, mapsHref, bookHref, visit, rows, faq, services,
    accent: hexOr(fallbackAccent)(brand.accent),
    rating: c.rating?.value ? c.rating : null,
    reviews: list(c.reviews?.items), members: list(c.team?.members), gallery: list(c.gallery?.images).filter(g => url(g.img)),
    pay: list(c.payments?.methods), insurers: list(c.payments?.insurers), offers: list(c.offers?.items), steps: list(c.process?.steps), trust: list(c.trust),
    ctaTop: hero.ctaTop || 'Agenda tu cita',
    menu: list(c.menu?.categories).filter(m => list(m.items).length),
    dishes: list(c.menu?.categories).flatMap(m => list(m.items).map(i => ({ ...i, cat: m.name }))),
    slots: list(c.booking?.slots).length ? list(c.booking.slots) : list(hero.slots),
    rooms: list(c.rooms?.items), amenities: list(c.amenities?.items), listings: list(c.listings?.items),
    mk: sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`,
    // enlace real en vivo; en la miniatura de la propuesta, texto sin navegar
    a: (cls, href, inner, extra = '') => (live && href ? `<a class="${cls}" href="${esc(href)}"${ext(href)}${extra}>${inner}</a>` : `<span class="${cls}"${extra}>${inner}</span>`),
    photo: (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : `<div class="${cls} t-noimg" aria-hidden="true"></div>`),
    serviceHref: s => (waNum && !contact.bookingUrl ? waMsg(`Hola, me interesa: ${s.name}`) : bookHref),
    kb: extra => `<script type="application/json" class="t-kb">${JSON.stringify({ name, wa: waNum, book: live ? bookHref : '', ...extra }).replace(/</g, '\\u003c')}</script>`,
    legal: () => [`© ${new Date().getFullYear()} ${esc(name)}`, 'Aviso de privacidad', c.legal?.cofepris && `COFEPRIS ${esc(c.legal.cofepris)}`, c.legal?.responsable && `Responsable sanitario: ${esc(c.legal.responsable)}`, c.footer?.note && esc(c.footer.note)].filter(Boolean).map(x => `<span>${x}</span>`).join(''),
    // Reservación de hotel: llegada, salida, huéspedes y habitación; arma el mensaje para WhatsApp
    stayForm: (cls = '') => (waNum ? `<form class="t-stay ${cls}" data-t-form data-intro="Hola, quiero reservar en"${live ? '' : ' inert'}>
      <label><span>Llegada</span><input name="in" data-l="Llegada" type="date"></label><label><span>Salida</span><input name="out" data-l="Salida" type="date"></label>
      <label><span>Huéspedes</span><select name="g" data-l="Huéspedes">${['1', '2', '3', '4', '5', '6 o más'].map(x => `<option${x === '2' ? ' selected' : ''}>${x}</option>`).join('')}</select></label>
      ${list(c.rooms?.items).length ? `<label><span>Habitación</span><select name="r" data-l="Habitación"><option value="">La que esté disponible</option>${list(c.rooms.items).map(r => `<option>${esc(r.name)}</option>`).join('')}</select></label>` : ''}
      <button type="submit">Consultar disponibilidad</button></form>` : ''),
    // Inmobiliarias: datos para filtrar, enlace «Me interesa» y la ficha corta de cada propiedad
    lstAttrs: l => ` data-op="${esc(String(l.op || '').toLowerCase())}" data-beds="${+l.beds || 0}" data-price="${+digits(String(l.price || '').split('/')[0]) || 0}" data-zone="${esc(String(l.zone || '').toLowerCase())}" data-t="${esc(String(l.title || '').toLowerCase())}"`,
    lstHref: l => (waNum ? waMsg(`Hola, me interesa: ${l.title}${l.price ? ` (${l.price})` : ''}${l.zone ? `, ${l.zone}` : ''}. ¿Sigue disponible?`) : bookHref),
    lstFacts: l => [l.beds && `${l.beds} rec.`, l.baths && `${l.baths} baños`, l.m2 && `${l.m2} m²`, l.parking && `${l.parking} est.`].filter(Boolean),
    // «¿Cuánto vale tu casa?»: arma el mensaje para WhatsApp (vendedores)
    valueForm: (cls = '') => (waNum ? `<form class="t-val ${cls}" data-t-form data-intro="Hola, quiero saber cuánto vale mi propiedad"${live ? '' : ' inert'}>
      <label><span>Colonia</span><input name="z" data-l="Colonia" placeholder="¿Dónde está?"></label><label><span>Tipo</span><select name="k" data-l="Tipo"><option>Casa</option><option>Departamento</option><option>Terreno</option><option>Local</option></select></label>
      <label><span>Recámaras</span><select name="b" data-l="Recámaras">${['1', '2', '3', '4', '5 o más'].map(x => `<option${x === '3' ? ' selected' : ''}>${x}</option>`).join('')}</select></label>
      <button type="submit">Pedir valuación gratis</button></form>` : ''),
    // Filtros de propiedades (los lee bindT en clinica.js): operación, recámaras, precio máximo y búsqueda escrita
    lstFilters: (cls = '', { q = false } = {}) => `<form class="t-filt ${cls}" data-t-filt role="search" onsubmit="return false">${q ? `<label class="t-filt-q"><span>Qué buscas</span><input name="q" type="search" placeholder="Ej. casa de 3 recámaras en Zapopan hasta 5 millones"></label>` : ''}
      <label><span>Operación</span><select name="op"><option value="">Venta y renta</option><option value="venta">Venta</option><option value="renta">Renta</option></select></label>
      <label><span>Recámaras</span><select name="beds"><option value="">Cualquiera</option>${[1, 2, 3, 4].map(n => `<option value="${n}">${n}+</option>`).join('')}</select></label></form>`,
    roomHref: r => (waNum ? waMsg(`Hola, quiero reservar la habitación ${r.name}. ¿Tienen disponibilidad?`) : bookHref),
    navLink: ([id, label]) => (live ? `<a href="#${id}">${esc(label)}</a>` : `<span>${esc(label)}</span>`),
  };
}
