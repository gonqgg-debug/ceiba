// Diseño «Galería» para clínicas (theme.style = 'galeria'), basado en Grand Street Dental:
// hero de medios círculos de colores (como cartel de diseño), una frase grande al centro,
// opiniones como citas cortas en cuadrícula, la doctora a todo lo ancho con la pestaña
// «Contáctanos» que abre un formulario, y el consultorio en fotos de pared a pared.
// Mismo JSON que la plantilla «clinica». Estilos propios: /assets/t-galeria.css.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);
const digits = s => String(s ?? '').replace(/\D/g, '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#2A4DA0');
const WA = '<svg class="ga-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';

export const GALERIA_FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,600;6..96,700&family=Jost:wght@300;400;500;600&display=swap';

// Medios círculos del hero: [x %, y %, tamaño (cqi), giro, color]  (colores: a = color de la marca)
const SHAPES = [
  [-2, -6, 15, 180, 'pink'], [17, 10, 15, 0, 'orange'], [38, 4, 13, 225, 'white'], [61, -10, 12, 90, 'white'],
  [80, 4, 14, 180, 'orange'], [-6, 30, 12, 270, 'white'], [26, 46, 15, 180, 'pink'], [20, 64, 14, 315, 'a'],
  [54, 80, 9, 90, 'pink'], [88, 40, 14, 270, 'a'], [-2, 76, 14, 0, 'white'], [70, 78, 15, 0, 'white'], [50, 92, 6, 135, 'deep'],
];

export function renderGaleria(c = {}, { mode = 'live', marks = {}, fontVars = '' } = {}) {
  const live = mode === 'live';
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const name = brand.fullName || brand.name || '';
  const waNum = digits(contact.whatsapp), telNum = digits(contact.phone);
  const waMsg = t => `https://wa.me/${waNum}?text=${encodeURIComponent(t)}`;
  const waHref = waNum ? waMsg(`Hola, quiero agendar una cita en ${name || 'la clínica'}`) : '';
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const bookHref = url(contact.bookingUrl) || waHref || (telNum ? `tel:${telNum}` : '');
  const mk = sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`;
  const ext = h => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');
  const a = (cls, href, inner, extra = '') => (live && href ? `<a class="${cls}" href="${esc(href)}"${ext(href)}${extra}>${inner}</a>` : `<span class="${cls}"${extra}>${inner}</span>`);
  const photo = (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : '');

  const services = list(c.services?.items).slice(0, 8);
  const reviews = list(c.reviews?.items).slice(0, 8);
  const rating = c.rating?.value ? c.rating : null;
  const members = list(c.team?.members).slice(0, 6), lead = members[0];
  const gallery = list(c.gallery?.images).filter(g => url(g.img)).slice(0, 5);
  const faq = (list(c.faq).length ? list(c.faq) : list(c.chat?.faq)).filter(f => f.q && f.a).slice(0, 6);
  const visit = c.visit || {};
  const rows = list(visit.rows).filter(r => !(contact.address && /^direcci/i.test(r.dt || '')));
  const cases = list(c.cases?.items).filter(x => url(x.before) && url(x.after)).slice(0, 4);
  const ctaTop = hero.ctaTop || 'Agenda tu cita';
  const statement = c.statement || hero.sub || '';
  const nav = [services.length && ['ga-trat', 'Tratamientos'], lead && ['ga-equipo', 'Equipo'], cases.length && ['ga-casos', 'Antes y después'], reviews.length && ['ga-opiniones', 'Opiniones'], ['ga-llegar', 'Contacto']].filter(Boolean);

  const kb = { name, wa: waNum, book: live ? bookHref : '', maps: live ? mapsHref : '', address: contact.address || '', hours: rows.map(r => [r.dt, r.dd]),
    faq: faq.map(f => [f.q, f.a]), services: services.map(s => [s.name, s.price || '', s.desc || '']) };

  const out = [`<link rel="stylesheet" href="/assets/t-galeria.css">`];
  out.push(`<div class="cx ga${live ? '' : ' ga-still'}" style="--a:${hex(brand.accent)};${fontVars}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  // Encabezado: logo apilado a la izquierda, menú en versalitas y «Agenda» rectangular
  const logo = url(brand.logo) ? `<img src="${url(brand.logo)}" alt="${esc(name)}">` : `<b>${String(brand.name || name).split(/\s+/).slice(0, 3).map(esc).join('<br>')}</b>`;
  out.push(`<header class="ga-top">${live ? `<a class="ga-logo" href="#ga-inicio">${logo}</a>` : `<span class="ga-logo">${logo}</span>`}
    <nav class="ga-nav" aria-label="Secciones">${nav.map(([id, l]) => (live ? `<a href="#${id}">${esc(l)}</a>` : `<span>${esc(l)}</span>`)).join('')}</nav>
    ${a('ga-btn', bookHref, esc(ctaTop), mk('cta'))}</header>`);

  // Hero: medios círculos y el título
  out.push(`<section class="ga-hero" id="ga-inicio"${mk('hero')}><div class="ga-shapes" aria-hidden="true">${SHAPES.map(([x, y, s, r, col], i) => `<i class="ga-s ga-s--${col}" style="--x:${x}%;--y:${y}%;--s:${s}cqi;--r:${r}deg;--i:${i}"></i>`).join('')}</div>
    <div class="ga-hero-copy"><h1>${esc(hero.title)}</h1>${a('ga-btn ga-btn--lg', bookHref, `${esc(hero.cta || ctaTop)}`)}</div></section>`);

  // La frase al centro
  if (statement) out.push(`<section class="ga-statement"><p>${esc(statement)}</p></section>`);

  // Opiniones como citas cortas (en lugar de prensa: reseñas reales del negocio)
  if (reviews.length) out.push(`<section class="ga-quotes" id="ga-opiniones"${mk('reviews')}>${rating ? `<p class="ga-score"><b>${esc(rating.value)}</b> de 5 · ${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</p>` : ''}
    <ul>${reviews.map(r => `<li><b>${esc(r.name)}</b><q>${esc(r.text.length > 170 ? r.text.slice(0, 167).replace(/\s+\S*$/, '') + '…' : r.text)}</q>${r.meta ? `<small>${esc(r.meta)}</small>` : ''}</li>`).join('')}</ul>
    ${c.reviews?.note ? `<p class="ga-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // La doctora a todo lo ancho
  if (lead) out.push(`<section class="ga-lead" id="ga-equipo"${mk('team')}>${photo(lead.photo || hero.photo, lead.name, 'ga-lead-img')}
    <div class="ga-lead-card"><h2>${esc(lead.name)}</h2>${lead.role ? `<p>${esc(lead.role)}</p>` : ''}${lead.cedula ? `<small>Cédula ${esc(lead.cedula)}</small>` : ''}${c.team?.text ? `<p class="ga-lead-t">${esc(c.team.text)}</p>` : ''}</div></section>`);

  // Tratamientos
  if (services.length) out.push(`<section class="ga-sec ga-trat" id="ga-trat"${mk('services')}><h2>${esc(c.services.title || 'Tratamientos')}</h2>${c.services.sub ? `<p class="ga-sub">${esc(c.services.sub)}</p>` : ''}
    <ul class="ga-list">${services.map((s, i) => `<li><i class="ga-dot ga-dot--${['a', 'orange', 'pink', 'deep'][i % 4]}" aria-hidden="true"></i><div><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}</div>${s.price ? `<span>${esc(s.price)}</span>` : '<span></span>'}</li>`).join('')}</ul>
    ${c.services.note ? `<p class="ga-note">${esc(c.services.note)}</p>` : ''}</section>`);

  // El consultorio en fotos de pared a pared
  if (gallery.length >= 2) out.push(`<section class="ga-rooms" aria-label="${esc(c.gallery?.title || 'Conoce el consultorio')}">${gallery.map((g, i) => `<figure class="ga-room">${photo(g.img, g.alt, 'ga-room-img')}${g.alt ? `<figcaption>${esc(g.alt)}</figcaption>` : ''}</figure>`).join('')}</section>`);

  // Antes y después (solo con fotos reales del cliente)
  if (cases.length) out.push(`<section class="ga-sec ga-cases" id="ga-casos"><h2>${esc(c.cases.title || 'Antes y después')}</h2>${c.cases.sub ? `<p class="ga-sub">${esc(c.cases.sub)}</p>` : ''}
    <div class="ga-case-list">${cases.map(x => `<figure class="ga-case" data-ga-case><div class="ga-case-in">${photo(x.after, `Después: ${x.label || ''}`, 'ga-case-img')}<div class="ga-case-before">${photo(x.before, `Antes: ${x.label || ''}`, 'ga-case-img')}</div><input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después${x.label ? `: ${esc(x.label)}` : ''}"${live ? '' : ' disabled'}></div>${x.label ? `<figcaption>${esc(x.label)}</figcaption>` : ''}</figure>`).join('')}</div></section>`);

  // Preguntas
  if (faq.length) out.push(`<section class="ga-sec ga-faq"><h2>Preguntas frecuentes</h2><div class="ga-qa">${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  // Contacto y pie
  out.push(`<section class="ga-end" id="ga-llegar"${mk('visit')}>${photo(visit.photo, visit.photoAlt || 'Fachada', 'ga-end-img')}<div class="ga-end-in">
      <h2>${esc(visit.title && !/^vis[ií]tanos$/i.test(visit.title) ? visit.title : 'Ven a conocernos')}</h2>
      ${contact.address ? `<p>${esc(contact.address)}</p>` : ''}
      ${rows.length ? `<dl>${rows.slice(0, 4).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>` : ''}
      <div class="ga-ctas">${a('ga-btn ga-btn--lg', bookHref, esc(ctaTop))}${mapsHref ? a('ga-btn ga-btn--lg ga-btn--butter', mapsHref, 'Cómo llegar') : ''}</div></div></section>
    <footer class="ga-foot"><span>© ${new Date().getFullYear()} ${esc(name)}</span>${telNum ? a('', `tel:${telNum}`, esc(contact.phone)) : ''}${contact.email ? a('', `mailto:${contact.email}`, esc(contact.email)) : ''}<span>Aviso de privacidad</span>${c.legal?.cofepris ? `<span>COFEPRIS ${esc(c.legal.cofepris)}</span>` : ''}${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</footer>`);

  // Pestaña «Contáctanos»: formulario que abre WhatsApp con el mensaje armado
  if (waNum) out.push(`<div class="ga-tab" data-ga-tab><button type="button" class="ga-tab-btn" aria-expanded="false" aria-controls="ga-form">Contáctanos<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button>
    <form class="ga-form" id="ga-form" data-ga-form${live ? '' : ' inert'}><label><span>Nombre</span><input name="n" autocomplete="name" required></label><label><span>Teléfono</span><input name="t" type="tel" inputmode="tel" autocomplete="tel"></label>
      ${services.length ? `<label><span>Tratamiento</span><select name="s"><option value="">Elige una opción</option>${services.map(s => `<option>${esc(s.name)}</option>`).join('')}</select></label>` : ''}
      <label><span>Mensaje</span><textarea name="m" rows="3"></textarea></label><button class="ga-btn" type="submit">${WA}Enviar por WhatsApp</button></form></div>`);
  out.push(`<div class="ga-sticky">${a('ga-btn', bookHref, esc(ctaTop))}${waNum ? a('ga-btn ga-btn--butter', waHref, `${WA}WhatsApp`) : ''}</div>`);
  out.push(`<script type="application/json" class="ga-kb">${JSON.stringify(kb).replace(/</g, '\\u003c')}</script></div>`);
  return out.join('\n');
}
