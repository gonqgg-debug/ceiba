// Diseño «Estudio» para clínicas dentales y consultorios (page.kind = 'clinica',
// theme.style = 'estudio'). Cálido y tranquilo, como un estudio y no una clínica fría:
// reservar desde el primer segundo (tratamiento + horario en el hero), una carta de
// tratamientos con precios que muestra la foto al pasar el cursor, la visita contada en
// pasos, una calculadora de meses sin intereses y el equipo con cédula.
// Mismo JSON que la plantilla «clinica». Si falta un dato, la sección no aparece.
// Estilos en /assets/clinica.css (raíz .cx.es); interacción en /assets/clinica.js (bindEstudio).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);
const digits = s => String(s ?? '').replace(/\D/g, '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#2F5D50');
// Precio en número (para la calculadora): «Desde $14,500» → 14500; «Sin costo» → null
const amount = p => { const m = String(p || '').replace(/,/g, '').match(/\$\s?(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : null; };
const WA = '<svg class="es-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';
const ARROW = '<svg class="es-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>';

export const ESTUDIO_FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600&display=swap';

export function renderEstudio(c = {}, { mode = 'live', marks = {} } = {}) {
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
  const photo = (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : `<div class="${cls} es-noimg" aria-hidden="true"></div>`);

  const rating = c.rating?.value ? c.rating : null;
  const services = list(c.services?.items).slice(0, 8);
  const trust = list(c.trust).slice(0, 4);
  const steps = list(c.process?.steps).slice(0, 5);
  const members = list(c.team?.members).slice(0, 6);
  const lead = members[0];
  const gallery = list(c.gallery?.images).filter(g => url(g.img));
  const reviews = list(c.reviews?.items).slice(0, 3);
  const faq = (list(c.faq).length ? list(c.faq) : list(c.chat?.faq)).filter(f => f.q && f.a).slice(0, 8);
  const visit = c.visit || {};
  const rows = list(visit.rows).filter(r => !(contact.address && /^direcci/i.test(r.dt || '')));
  const slots = list(hero.slots).slice(0, 4);
  const pay = list(c.payments?.methods), insurers = list(c.payments?.insurers);
  // Meses sin intereses: los que aparezcan en las formas de pago («3 y 6 MSI») o en su texto
  const msiText = [...pay, c.payments?.text || ''].filter(x => /msi|meses sin intereses/i.test(x)).join(' ');
  const months = [...new Set((msiText.match(/\d+/g) || []).map(Number).filter(n => [3, 6, 9, 12, 18, 24].includes(n)))].sort((x, y) => x - y);
  const msiMin = amount((c.payments?.text || '').match(/mayores? a \$[\d,]+/i)?.[0]) || 0;
  const priced = services.filter(s => amount(s.price) && amount(s.price) >= msiMin);
  const ctaTop = hero.ctaTop || 'Agenda tu cita';
  const nav = [
    services.length && ['es-trat', c.services?.navLabel || 'Tratamientos'],
    steps.length >= 2 && ['es-visita', 'Tu visita'],
    (members.length || c.team?.text) && ['es-equipo', 'Equipo'],
    reviews.length && ['es-opiniones', 'Opiniones'],
    ['es-llegar', 'Ubicación'],
  ].filter(Boolean);
  const navLink = ([id, label]) => (live ? `<a href="#${id}">${esc(label)}</a>` : `<span>${esc(label)}</span>`);

  // Lo que sabe el asistente (mismo formato que la plantilla «clinica»)
  const kb = { name, wa: waNum, book: live ? bookHref : '', maps: live ? mapsHref : '', address: contact.address || '',
    hours: rows.map(r => [r.dt, r.dd]), slots, faq: [...faq, ...list(c.chat?.faq)].map(f => [f.q, f.a]).slice(0, 14),
    services: services.map(s => [s.name, s.price || '', s.desc || '']), more: list(c.services?.more), pay: [...pay, ...insurers], today: list(c.today?.bullets).map(b => b.t || b) };

  const out = [];
  out.push(`<div class="cx es${live ? '' : ' es-still'}" style="--a:${hex(brand.accent)}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  // Encabezado
  const logo = url(brand.logo) ? `<img src="${url(brand.logo)}" alt="${esc(name)}">` : `<b>${esc(brand.name || name)}</b>`;
  out.push(`<header class="es-top">${live ? `<a class="es-logo" href="#es-inicio">${logo}</a>` : `<span class="es-logo">${logo}</span>`}
    <nav class="es-nav" aria-label="Secciones">${nav.map(navLink).join('')}</nav>
    <div class="es-top-acts">${telNum ? a('es-tel', `tel:${telNum}`, esc(contact.phone)) : ''}${a('es-btn es-btn--sm', bookHref, esc(ctaTop), mk('cta'))}</div></header>`);

  // Hero: título, reserva en dos toques (tratamiento + horario) y la foto en arco
  const pickSvc = services.slice(0, 5);
  out.push(`<section class="es-hero" id="es-inicio"${mk('hero')}><div class="es-hero-copy">
      ${rating ? `<p class="es-rating"><span class="es-stars" aria-hidden="true">${STAR.repeat(5)}</span><b>${esc(rating.value)}</b> · ${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</p>` : ''}
      <h1>${esc(hero.title)}</h1>
      ${hero.sub ? `<p class="es-lede">${esc(hero.sub)}</p>` : ''}
      ${waNum && pickSvc.length ? `<form class="es-book" data-es-book${live ? '' : ' inert'}>
        <fieldset><legend>¿Qué necesitas?</legend><div class="es-chips">${pickSvc.map((s, i) => `<label><input type="radio" name="svc" value="${esc(s.name)}"${i ? '' : ' checked'}><span>${esc(s.name)}</span></label>`).join('')}</div></fieldset>
        ${slots.length ? `<fieldset><legend>¿Cuándo te queda?</legend><div class="es-chips">${slots.map((s, i) => `<label><input type="radio" name="slot" value="${esc(s)}"${i ? '' : ' checked'}><span>${esc(s)}</span></label>`).join('')}<label><input type="radio" name="slot" value=""><span>Otro día</span></label></div></fieldset>` : ''}
        <button class="es-btn es-btn--lg" type="submit">${WA}<span>${esc(hero.cta || 'Apartar mi cita')}</span></button>
        <p class="es-book-note">Te confirmamos por WhatsApp${telNum ? `, o llámanos al ${a('es-u', `tel:${telNum}`, esc(contact.phone))}` : ''}.</p></form>`
        : `<div class="es-ctas">${a('es-btn es-btn--lg', bookHref, `${esc(hero.cta || 'Agenda tu cita')}${ARROW}`)}${telNum ? a('es-btn es-btn--line es-btn--lg', `tel:${telNum}`, `Llamar al ${esc(contact.phone)}`) : ''}</div>`}
    </div>
    <figure class="es-hero-media">${photo(hero.photo, hero.photoAlt || name, 'es-arch')}
      ${lead ? `<figcaption><b>${esc(lead.name)}</b>${lead.role ? `<span>${esc(lead.role)}</span>` : ''}${lead.cedula ? `<small>Cédula ${esc(lead.cedula)}</small>` : ''}</figcaption>` : ''}</figure></section>`);

  // Lo que nos distingue
  if (trust.length) out.push(`<section class="es-trust"${mk('trust')}><ul>${trust.map(t => `<li><b>${esc(t.b)}</b><span>${esc(t.t)}</span></li>`).join('')}</ul></section>`);

  // Tratamientos: carta con precios; al pasar el cursor, la foto del tratamiento
  if (services.length) {
    const first = services.find(s => url(s.img));
    out.push(`<section class="es-sec es-menu" id="es-trat"${mk('services')}><div class="es-head"><h2>${esc(c.services.title || 'Tratamientos')}</h2>${c.services.sub ? `<p>${esc(c.services.sub)}</p>` : ''}</div>
      <div class="es-menu-in">${first ? `<div class="es-menu-stage" aria-hidden="true">${services.map((s, i) => (url(s.img) ? `<div class="es-menu-img${s === first ? ' on' : ''}" data-i="${i}" style="background-image:url('${url(s.img)}')"></div>` : '')).join('')}</div>` : ''}
      <ol class="es-menu-list">${services.map((s, i) => {
        const go = waNum && !contact.bookingUrl ? waMsg(`Hola, me interesa: ${s.name}`) : bookHref;
        return `<li data-i="${i}"${url(s.img) ? '' : ' data-noimg'}>${url(s.img) ? `<span class="es-thumb" style="background-image:url('${url(s.img)}')" aria-hidden="true"></span>` : ''}<div class="es-item"><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}</div><i aria-hidden="true"></i>${s.price ? `<span class="es-price">${esc(s.price)}</span>` : '<span></span>'}${live && go ? `<a class="es-item-go" href="${esc(go)}"${ext(go)} aria-label="Agendar ${esc(s.name)}">${ARROW}</a>` : ''}</li>`;
      }).join('')}</ol></div>
      ${list(c.services.more).length ? `<p class="es-more"><b>También:</b> ${list(c.services.more).slice(0, 12).map(esc).join(' · ')}</p>` : ''}
      ${c.services.note ? `<p class="es-note">${esc(c.services.note)}</p>` : ''}</section>`);
  }

  // Tu visita, paso a paso (cada paso con una foto del lugar)
  if (steps.length >= 2) {
    const pics = [hero.photo, ...gallery.map(g => g.img), ...services.map(s => s.img)].filter(url);
    const stepPics = steps.map((s, i) => url(s.img) || pics[(i + 1) % Math.max(pics.length, 1)] || '');
    out.push(`<section class="es-sec es-visit" id="es-visita"><div class="es-head"><h2>${esc(c.process.title || 'Cómo es tu primera visita')}</h2>${c.process.sub ? `<p>${esc(c.process.sub)}</p>` : ''}</div>
      <div class="es-visit-in" data-es-steps><div class="es-visit-stage" aria-hidden="true">${stepPics.map((p, i) => `<div class="es-visit-img${i ? '' : ' on'}" data-i="${i}"${p ? ` style="background-image:url('${p}')"` : ''}></div>`).join('')}<span class="es-visit-count"><b>1</b> / ${steps.length}</span></div>
      <ol class="es-steps">${steps.map((s, i) => `<li><button type="button" data-i="${i}" aria-pressed="${!i}"><span class="es-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(s.t)}</b></button><p>${esc(s.d)}</p></li>`).join('')}</ol></div></section>`);
  }

  // Precios claros y meses sin intereses
  if (priced.length && months.length) {
    out.push(`<section class="es-sec es-pay"><div class="es-pay-in"><div class="es-pay-copy"><h2>${esc(c.payments?.title || 'Paga como te acomode')}</h2>${c.payments?.text ? `<p>${esc(c.payments.text)}</p>` : ''}
        ${pay.length ? `<ul class="es-tags">${pay.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${insurers.length ? `<p class="es-ins"><b>Aseguradoras:</b> ${insurers.map(esc).join(' · ')}</p>` : ''}</div>
      <div class="es-calc" data-es-calc>
        <label class="es-field"><span>Tratamiento</span><select data-es-svc${live ? '' : ' disabled'}>${priced.map(s => `<option value="${amount(s.price)}"${/desde/i.test(s.price) ? ' data-from' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
        <div class="es-field"><span>Meses sin intereses</span><div class="es-seg">${months.map((m, i) => `<button type="button" data-m="${m}" aria-pressed="${i === months.length - 1}">${m}</button>`).join('')}</div></div>
        <p class="es-calc-out" aria-live="polite"><small data-es-from>${/desde/i.test(priced[0].price) ? 'Desde' : ''}</small><b data-es-mo>$${Math.ceil(amount(priced[0].price) / months[months.length - 1]).toLocaleString('es-MX')}</b><span>al mes, <span data-es-n>${months[months.length - 1]}</span> meses</span></p>
        <p class="es-note">Con tarjetas participantes. Te confirmamos el precio de tu caso en la valoración.</p></div></div></section>`);
  }

  // Equipo
  if (members.length || c.team?.text) {
    out.push(`<section class="es-sec es-team" id="es-equipo"${mk('team')}><div class="es-head"><h2>${esc(c.team.title || 'Quién te atiende')}</h2>${c.team.text ? `<p>${esc(c.team.text)}</p>` : ''}</div>
      ${members.length ? `<ul class="es-people">${members.map(m => `<li>${photo(m.photo, m.name, 'es-person')}<b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</li>`).join('')}</ul>` : ''}
      ${c.team.note ? `<p class="es-note">${esc(c.team.note)}</p>` : ''}</section>`);
  }

  // Opiniones
  if (reviews.length) out.push(`<section class="es-sec es-reviews" id="es-opiniones"${mk('reviews')}><div class="es-rev-head">${rating ? `<p class="es-big"><b>${esc(rating.value)}</b><span class="es-stars" aria-hidden="true">${STAR.repeat(5)}</span><small>${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</small></p>` : ''}<h2>${esc(c.reviews.title || 'Lo que dicen nuestros pacientes')}</h2></div>
    <div class="es-quotes">${reviews.map(r => `<figure><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b>${r.meta ? `<span>${esc(r.meta)}</span>` : ''}</figcaption></figure>`).join('')}</div>
    ${c.reviews.note ? `<p class="es-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Preguntas frecuentes
  if (faq.length) out.push(`<section class="es-sec es-faq"><div class="es-head"><h2>Preguntas frecuentes</h2>${waNum ? `<p>¿Otra duda? ${a('es-u', waMsg(`Hola, tengo una pregunta para ${name}`), 'Escríbenos por WhatsApp')}.</p>` : ''}</div>
    <div class="es-qa">${faq.map((f, i) => `<details${i ? '' : ' open'}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  // Cómo llegar y cierre
  out.push(`<section class="es-end" id="es-llegar"${mk('visit')}><div class="es-end-in">
      <div class="es-end-copy"><h2>${esc(visit.title && !/^vis[ií]tanos$/i.test(visit.title) ? visit.title : 'Te esperamos')}</h2>
        ${contact.address ? `<p class="es-addr">${esc(contact.address)}</p>` : ''}${visit.zones ? `<p class="es-zones">${esc(visit.zones)}</p>` : ''}
        ${rows.length ? `<dl class="es-hours">${rows.slice(0, 5).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>` : ''}
        <div class="es-ctas">${a('es-btn es-btn--light es-btn--lg', bookHref, `${esc(ctaTop)}${ARROW}`)}${mapsHref ? a('es-btn es-btn--ghost es-btn--lg', mapsHref, 'Cómo llegar') : ''}</div></div>
      ${photo(visit.photo || gallery[0]?.img, visit.photoAlt || 'Fachada', 'es-end-img')}</div>
    <footer class="es-foot"><span>© ${new Date().getFullYear()} ${esc(name)}</span><span>Aviso de privacidad</span>${c.legal?.cofepris ? `<span>Aviso COFEPRIS ${esc(c.legal.cofepris)}</span>` : ''}${c.legal?.responsable ? `<span>Responsable sanitario: ${esc(c.legal.responsable)}</span>` : ''}${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</footer></section>`);

  // WhatsApp flotante y barra fija en celular
  if (waNum) out.push(`<div class="es-fab">${a('es-wa-fab', waHref, WA, ' aria-label="Escríbenos por WhatsApp"')}</div>`);
  out.push(`<div class="es-sticky">${a('es-btn', bookHref, esc(ctaTop))}${waNum ? a('es-btn es-btn--line', waHref, `${WA}WhatsApp`) : ''}</div>`);
  out.push(`<script type="application/json" class="es-kb">${JSON.stringify(kb).replace(/</g, '\\u003c')}</script></div>`);
  return out.join('\n');
}
