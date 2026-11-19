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

export function renderClinica(c = {}, { mode = 'live', marks = {} } = {}) {
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
  const ratingLine = rating ? `<span class="cx-stars" aria-hidden="true">${stars(rating.value)}</span><b>${esc(rating.value)}</b><span>${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</span>` : '';

  const out = [];
  out.push(`<div class="cx" style="--a:${hex(brand.accent)}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  // Barra superior
  if (c.util?.note || c.util?.hours || telNum) out.push(`<div class="cx-util">${c.util?.note ? `<span>${ico('bolt', 'cx-ico-s')}${esc(c.util.note)}</span>` : ''}${c.util?.hours ? `<span class="cx-util-h">${ico('clock', 'cx-ico-s')}${esc(c.util.hours)}</span>` : ''}${telNum ? act('cx-util-tel', `tel:${telNum}`, `${ico('phone', 'cx-ico-s')}${esc(contact.phone)}`) : ''}</div>`);

  // Encabezado
  out.push(`<header class="cx-top"><div class="cx-brand">${url(brand.logo) ? `<img src="${url(brand.logo)}" alt="${esc(name)}">` : `<b>${esc(brand.name)}</b>${brand.tagline ? `<span>${esc(brand.tagline)}</span>` : ''}`}</div>
    <nav class="cx-nav">${nav.map(page).join('')}</nav>
    <div class="cx-top-acts">${telNum ? act('cx-btn cx-btn--line cx-hide-s', `tel:${telNum}`, `${ico('phone', 'cx-ico-s')}Llamar`) : ''}${act('cx-btn', bookHref, ctaTop, mk('cta'))}</div></header>`);

  // Hero
  out.push(`<section class="cx-hero"${mk('hero')}><div class="cx-hero-copy">
      ${rating ? `<p class="cx-rating">${ratingLine}</p>` : ''}
      <h1>${esc(hero.title)}</h1>
      ${hero.sub ? `<p class="cx-lede">${esc(hero.sub)}</p>` : ''}
      <div class="cx-ctas">${act('cx-btn cx-btn--lg', bookHref, `${esc(hero.cta || 'Agenda tu cita')}${ico('arrow', 'cx-ico-s')}`)}${waNum ? act('cx-btn cx-btn--lg cx-btn--ghost', waHref, `${WA}${esc(hero.ctaWhatsapp || 'Escríbenos por WhatsApp')}`) : ''}</div>
      ${telNum ? `<p class="cx-call">${esc(hero.callLabel || 'O llámanos')}: ${act('', `tel:${telNum}`, `<b>${esc(contact.phone)}</b>`)}</p>` : ''}
    </div>
    <div class="cx-hero-media">${img(hero.photo, hero.photoAlt || name, 'cx-hero-img')}
      ${list(hero.slots).length ? `<div class="cx-float cx-slots"><b>${ico('calendar', 'cx-ico-s')}Próximos horarios</b><div>${list(hero.slots).slice(0, 3).map(s => `<span>${esc(s)}</span>`).join('')}</div></div>` : ''}
      ${rating ? `<div class="cx-float cx-rate-card"><span class="cx-stars" aria-hidden="true">${stars(rating.value)}</span><b>${esc(rating.value)} de 5</b><small>${esc(rating.count)} reseñas</small></div>` : ''}
    </div></section>`);

  // Beneficios
  if (trust.length) out.push(`<section class="cx-benefits"${mk('trust')}>${trust.map(t => `<div class="cx-benefit">${ico(iconName(t.icon, `${t.b} ${t.t}`))}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);

  // Atención de hoy
  if (today) out.push(`<section class="cx-today cx-sec"><div class="cx-today-copy"><h2>${esc(today.title || 'Te atendemos')}</h2>${today.text ? `<p>${esc(today.text)}</p>` : ''}${hoursRows.length ? `<dl class="cx-hours">${hoursRows.slice(0, 4).map(r => `<dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd>`).join('')}</dl>` : ''}</div>
    <div class="cx-panel"><ul class="cx-checks">${list(today.bullets).slice(0, 5).map(b => `<li>${ico(iconName(b.icon, b.t || b), 'cx-ico-c')}<span>${esc(b.t || b)}</span></li>`).join('')}</ul>${act('cx-btn', bookHref, ctaTop)}</div></section>`);

  // Servicios
  if (services.length) out.push(`<section class="cx-services cx-sec"${mk('services')}><div class="cx-head"><div><h2>${esc(c.services.title || 'Nuestros servicios')}</h2>${c.services.sub ? `<p>${esc(c.services.sub)}</p>` : ''}</div><div class="cx-car-nav"><button type="button" data-cx-car="prev" aria-label="Anterior">${ico('arrow', 'cx-ico-s cx-flip')}</button><button type="button" data-cx-car="next" aria-label="Siguiente">${ico('arrow', 'cx-ico-s')}</button></div></div>
    <ul class="cx-car" tabindex="0" aria-label="${esc(c.services.title || 'Servicios')}, desliza para ver más">${services.map(s => {
      const call = s.action === 'Llamar' && telNum;
      const href = call ? `tel:${telNum}` : (waNum && !contact.bookingUrl ? waMsg(`Hola, quiero agendar: ${s.name}`) : bookHref);
      return `<li class="cx-card">${img(s.img, s.imgAlt || s.name, 'cx-card-img')}<div class="cx-card-body"><div class="cx-card-t"><b>${esc(s.name)}</b>${s.price ? `<i>${esc(s.price)}</i>` : ''}</div><p>${esc(s.desc)}</p>${act('cx-link', href, `${esc(s.action || 'Agendar')}${ico('arrow', 'cx-ico-s')}`)}</div></li>`;
    }).join('')}</ul>
    ${list(c.services.more).length ? `<div class="cx-pills"><span>También atendemos:</span>${list(c.services.more).slice(0, 14).map(m => `<em>${esc(m)}</em>`).join('')}</div>` : ''}
    ${c.services.note ? `<p class="cx-note">${esc(c.services.note)}</p>` : ''}</section>`);

  // Ayuda para elegir (interactivo, con los mismos servicios)
  if (services.length >= 3) out.push(`<section class="cx-finder cx-sec"><div class="cx-panel cx-finder-in"><div><h2>${esc(c.finder?.title || '¿Qué necesitas?')}</h2><p>${esc(c.finder?.sub || 'Elige una opción y te decimos cómo empezar.')}</p></div>
    <div class="cx-finder-opts" role="radiogroup" aria-label="Servicio">${services.slice(0, 6).map((s, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-cx-pick="${i}">${esc(s.name)}</button>`).join('')}</div>
    <div class="cx-finder-out" aria-live="polite">${services.slice(0, 6).map((s, i) => {
      const href = waNum ? waMsg(`Hola, me interesa: ${s.name}. ¿Me ayudan a agendar?`) : bookHref;
      return `<div data-cx-res="${i}"${i ? ' hidden' : ''}><b>${esc(s.name)}</b>${s.price ? `<i>${esc(s.price)}</i>` : ''}<p>${esc(s.desc)}</p>${act('cx-btn', href, `${waNum ? WA : ''}Quiero agendar`)}</div>`;
    }).join('')}</div></div></section>`);

  // Proceso
  if (steps.length >= 2) out.push(`<section class="cx-process cx-sec"><div class="cx-head"><div><h2>${esc(c.process.title || 'Cómo es tu primera visita')}</h2>${c.process.sub ? `<p>${esc(c.process.sub)}</p>` : ''}</div></div><ol>${steps.map((s, i) => `<li><span class="cx-num">${i + 1}</span><b>${esc(s.t)}</b><p>${esc(s.d)}</p></li>`).join('')}</ol></section>`);

  // Equipo
  if (c.team?.text || members.length) out.push(`<section class="cx-team cx-sec"${mk('team')}><div class="cx-head"><div><h2>${esc(c.team.title || 'Nuestro equipo')}</h2>${c.team.text ? `<p>${esc(c.team.text)}</p>` : ''}</div></div>
    ${members.length ? `<ul class="cx-people">${members.map(m => `<li>${img(m.photo, m.name, 'cx-person-img')}<div class="cx-person-t"><b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</div></li>`).join('')}</ul>`
      : `<div class="cx-team-solo">${img(c.team.photo, c.team.photoAlt, 'cx-team-img')}<ul class="cx-checks">${list(c.team.bullets).slice(0, 6).map(b => `<li>${ico('check', 'cx-ico-c')}<span>${esc(b)}</span></li>`).join('')}</ul></div>`}
    ${c.team.note ? `<p class="cx-note">${esc(c.team.note)}</p>` : ''}</section>`);

  // Galería
  if (gallery.length >= 3) out.push(`<section class="cx-gallery cx-sec"><div class="cx-head"><div><h2>${esc(c.gallery.title || 'Conoce el lugar')}</h2>${c.gallery.text ? `<p>${esc(c.gallery.text)}</p>` : ''}</div></div><div class="cx-mosaic">${gallery.map((g, i) => img(g.img, g.alt, `cx-tile cx-tile--${i % 6}`)).join('')}</div></section>`);

  // Reseñas
  if (reviews.length) out.push(`<section class="cx-reviews cx-sec"${mk('reviews')}><div class="cx-head"><div><h2>${esc(c.reviews.title || 'Lo que dicen nuestros clientes')}</h2>${rating ? `<p class="cx-rating">${ratingLine}</p>` : ''}</div>${live && url(c.reviews.moreUrl) ? `<a class="cx-btn cx-btn--line" href="${esc(url(c.reviews.moreUrl))}" target="_blank" rel="noopener">Ver todas en Google</a>` : ''}</div>
    <div class="cx-rev-list">${reviews.map(r => `<figure class="cx-rev"><span class="cx-stars" aria-label="${esc(r.stars || 5)} de 5">${stars(r.stars || 5)}</span><blockquote>${esc(r.text)}</blockquote><figcaption><span class="cx-avatar" aria-hidden="true">${esc((r.name || '?').trim()[0])}</span><b>${esc(r.name)}</b>${r.meta ? `<small>${esc(r.meta)}</small>` : ''}</figcaption></figure>`).join('')}</div>
    ${c.reviews.note ? `<p class="cx-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Preguntas frecuentes
  if (faq.length) out.push(`<section class="cx-faq cx-sec"><div class="cx-head"><div><h2>Preguntas frecuentes</h2></div></div><div class="cx-faq-list">${faq.slice(0, 8).map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}<span aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  // Ubicación
  out.push(`<section class="cx-visit cx-sec"${mk('visit')}><div class="cx-visit-card">${img(visit.photo, visit.photoAlt || 'Fachada', 'cx-visit-img')}<div class="cx-visit-info"><h2>${esc(visit.title || 'Cómo llegar')}</h2>
      ${contact.address ? `<p class="cx-addr">${ico('map', 'cx-ico-s')}${esc(contact.address)}</p>` : ''}${visit.zones ? `<p class="cx-zones">${esc(visit.zones)}</p>` : ''}
      ${hoursRows.length ? `<dl class="cx-hours">${hoursRows.slice(0, 5).map(r => `<dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd>`).join('')}</dl>` : ''}
      <div class="cx-ctas">${mapsHref ? act('cx-btn', mapsHref, `${ico('map', 'cx-ico-s')}Abrir en Google Maps`) : ''}${waNum ? act('cx-btn cx-btn--ghost', waHref, `${WA}WhatsApp`) : ''}</div></div></div></section>`);

  // Formulario de cita (en la vista previa abre WhatsApp con el mensaje armado)
  if (waNum || contact.bookingUrl) out.push(`<section class="cx-book cx-sec"><div class="cx-panel cx-book-in"><div class="cx-book-copy"><h2>${esc(c.form?.title || 'Agenda tu cita')}</h2><p>${esc(c.form?.sub || 'Déjanos tus datos y te confirmamos por WhatsApp.')}</p></div>
    <form class="cx-form" data-cx-form${live ? '' : ' inert'}><label><span>Nombre</span><input name="n" autocomplete="name" required></label><label><span>Teléfono</span><input name="t" type="tel" autocomplete="tel" inputmode="tel"></label>
      ${services.length ? `<label class="cx-wide"><span>¿Qué necesitas?</span><select name="s"><option value="">Elige una opción</option>${services.map(s => `<option>${esc(s.name)}</option>`).join('')}<option>Otro</option></select></label>` : ''}
      <label><span>Día que prefieres</span><input name="d" placeholder="Ej.: martes en la tarde"></label><label><span>Comentarios</span><input name="m"></label>
      <button class="cx-btn cx-btn--lg cx-wide" type="submit">${waNum ? WA : ''}Enviar y agendar</button><small class="cx-wide">Al enviar aceptas nuestro aviso de privacidad.</small></form></div></section>`);

  // Pie
  out.push(`<footer class="cx-foot"><div class="cx-foot-cols"><div><b class="cx-foot-name">${esc(name)}</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}</div>
      ${services.length ? `<div><b>Servicios</b>${services.slice(0, 6).map(s => `<span>${esc(s.name)}</span>`).join('')}</div>` : ''}
      <div><b>Contacto</b>${telNum ? act('', `tel:${telNum}`, esc(contact.phone)) : ''}${waNum ? act('', waHref, 'WhatsApp') : ''}${contact.email ? act('', `mailto:${contact.email}`, esc(contact.email)) : ''}${hoursRows.slice(0, 2).map(r => `<span>${esc(r.dt)}: ${esc(r.dd)}</span>`).join('')}</div></div>
    <div class="cx-foot-legal"><span>© ${new Date().getFullYear()} ${esc(name)}</span><span>Aviso de privacidad</span>${legal.cofepris ? `<span>Aviso COFEPRIS ${esc(legal.cofepris)}</span>` : ''}${legal.responsable ? `<span>Responsable sanitario: ${esc(legal.responsable)}</span>` : ''}${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</div></footer>`);

  // Chat y WhatsApp flotantes
  const chat = list(c.chat?.faq).length ? c.chat : null;
  out.push(`<div class="cx-fab">${chat ? `<div class="cx-chat" role="region" aria-label="Chat de ${esc(name)}"><div class="cx-chat-top"><div><b>${esc(chat.title || name)}</b><span>${esc(chat.subtitle || 'Te respondemos aquí o por WhatsApp')}</span></div><button type="button" data-cx-chat="toggle" aria-label="Cerrar chat">×</button></div>
      <div class="cx-chat-log"><p class="cx-msg">${esc(chat.greeting || 'Hola 👋 ¿En qué te podemos ayudar?')}</p></div>
      <div class="cx-chat-sug">${list(chat.faq).slice(0, 4).map(f => `<button type="button" data-cx-q data-a="${esc(f.a)}" data-act="${f.action === 'book' ? 'book' : 'wa'}">${esc(f.q)}</button>`).join('')}</div></div>
    <button type="button" class="cx-chat-btn" data-cx-chat="toggle" aria-expanded="false"${mk('chat')}>${ico('chat', 'cx-ico-s')}${esc(chat.button || '¿Dudas? Pregúntanos')}</button>` : ''}
    ${waNum ? act('cx-wa-fab', waHref, WA, ` aria-label="WhatsApp"${chat ? '' : mk('whatsapp')}`) : ''}</div>
  <div class="cx-sticky">${act('cx-btn', bookHref, ctaTop)}${waNum ? act('cx-btn cx-btn--ghost', waHref, `${WA}WhatsApp`) : ''}</div>`);

  out.push('</div>');
  return out.join('\n');
}
