// Diseño «Glam» para clínicas de estética dental (theme.style = 'glam'), basado en TruGLO
// Modern Dental (antes Glo Modern Dental): barra negra con teléfono espaciado y botón amarillo,
// menú en franja negra, foto del consultorio a todo lo ancho con el título en versalitas,
// la doctora con su nombre sobre la foto, credenciales como sellos, el equipo con etiqueta,
// opiniones con estrellas turquesa, una caja negra sobre collage y preguntas en acordeón.
import { base, esc, url, ICON } from './base.js';

export const GLAM_FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap';

export function renderGlam(c = {}, opts = {}) {
  const b = base(c, opts, '#3CB4AC'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), lead = b.members[0], reviews = b.reviews.slice(0, 3), trust = b.trust.slice(0, 4);
  const pics = [...b.gallery.map(g => g.img), ...services.map(s => s.img)].filter(u => url(u));
  const nav = [['gl-nosotros', 'Nosotros'], services.length && ['gl-trat', 'Tratamientos'], reviews.length && ['gl-opiniones', 'Opiniones'], b.faq.length && ['gl-preguntas', 'Preguntas'], ['gl-contacto', 'Contacto']].filter(Boolean);

  const out = [`<link rel="stylesheet" href="/assets/t-glam.css">`,
    `<div class="cx gl${b.live ? '' : ' gl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  out.push(`<header class="gl-top"><div class="gl-bar"><div class="gl-bar-l">${b.telNum ? a('gl-phone', `tel:${b.telNum}`, esc(contact.phone)) : ''}${a('gl-yellow', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</div>
      <span class="gl-logo">${url(b.brand.logoDark || b.brand.logo) ? `<img src="${url(b.brand.logoDark || b.brand.logo)}" alt="${esc(name)}">` : `<b>${esc(b.brand.name || name)}</b><small>${esc(b.brand.tagline || '')}</small>`}</span>
      <div class="gl-bar-r">${c.util?.note ? a('gl-out gl-out--red', b.telNum ? `tel:${b.telNum}` : b.waHref, '¿Urgencia?') : ''}${a('gl-out', b.live ? '#gl-contacto' : '', 'Contacto')}</div></div>
    <nav class="gl-nav" aria-label="Secciones">${nav.map(b.navLink).join('')}</nav></header>`);

  out.push(`<section class="gl-hero"${b.mk('hero')}>${photo(b.visit.photo && b.gallery[0] ? b.gallery[0].img : hero.photo, b.gallery[0]?.alt || hero.photoAlt || '', 'gl-hero-img')}<h1>${esc(hero.title)}</h1></section>`);

  out.push(`<section class="gl-intro" id="gl-nosotros"><div><h2>${esc(b.brand.tagline ? `${b.brand.tagline} ${contact.address ? `en ${String(contact.address).split(',').slice(-1)[0].trim()}` : ''}` : name)}</h2>${[hero.sub, c.team?.text].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}</div>
    ${lead ? `<figure class="gl-doc">${photo(lead.photo, lead.name, 'gl-doc-img')}<figcaption><b>${esc(lead.name)}</b>${lead.role ? `<span>${esc(lead.role)}</span>` : ''}</figcaption></figure>` : ''}</section>`);

  // Credenciales como sellos tipográficos (de los datos del cliente, sin inventar prensa)
  if (trust.length) out.push(`<section class="gl-seals"${b.mk('trust')}><ul>${trust.map(t => `<li><b>${esc(t.b)}</b><span>${esc(t.t)}</span></li>`).join('')}</ul>${a('gl-black', b.bookHref, 'Consulta en persona')}</section>`);

  if (c.gallery?.images?.length || lead) out.push(`<section class="gl-team"${b.mk('team')}>${photo(c.team?.groupPhoto || b.gallery[2]?.img || lead?.photo, 'Nuestro equipo', 'gl-team-img')}<span class="gl-label">${esc(c.team?.title || 'Nuestro equipo')}</span></section>`);

  if (reviews.length) out.push(`<section class="gl-revs" id="gl-opiniones"${b.mk('reviews')}><h2>Opiniones</h2><div>${reviews.map(r => `<figure><span aria-label="${esc(r.stars || 5)} de 5">${ICON.star.repeat(r.stars || 5)}</span><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join('')}</div>${b.rating ? a('gl-teal', b.mapsHref || b.bookHref, `${esc(b.rating.value)} en ${esc(b.rating.source || 'Google')} · Ver más reseñas`) : ''}${c.reviews?.note ? `<p class="gl-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Caja negra sobre collage: tratamientos con foto
  if (services.length) out.push(`<section class="gl-collage" id="gl-trat"${b.mk('services')}><div class="gl-col-bg" aria-hidden="true">${pics.slice(0, 6).map(p => `<i style="background-image:url('${p}')"></i>`).join('')}</div>
    <div class="gl-box"><h2>${esc(c.services.title || 'Tratamientos')}</h2><ul>${services.map(s => `<li>${photo(s.img, s.imgAlt || s.name, 'gl-box-img')}<b>${esc(s.name)}</b>${s.price ? `<small>${esc(s.price)}</small>` : ''}</li>`).join('')}</ul>${a('gl-teal', b.bookHref, esc(b.ctaTop))}</div></section>`);

  if (b.faq.length) out.push(`<section class="gl-faq" id="gl-preguntas"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 8).map((f, i) => `<details${i ? '' : ' open'}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);

  out.push(`<section class="gl-book">${photo(pics[1] || hero.photo, '', 'gl-book-img')}<div><p>Agenda una</p><h2>Cita</h2>${a('gl-black', b.bookHref, esc(b.ctaTop))}</div></section>`);

  out.push(`<section class="gl-contact" id="gl-contacto"${b.mk('visit')}>${b.live && contact.address ? `<iframe title="Mapa de ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&amp;output=embed"></iframe>` : photo(b.visit.photo, '', 'gl-map-ph')}
    <div class="gl-card"><b>${esc(b.brand.name || name)}</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.telNum ? `<p>Tel. ${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.rows.slice(0, 3).map(r => `<p><span>${esc(r.dt)}</span> ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('gl-link', b.mapsHref, 'Ver mapa grande') : ''}</div></section>
  <footer class="gl-foot"><b>${esc(b.brand.name || name)}</b>${b.telNum ? a('gl-phone', `tel:${b.telNum}`, esc(contact.phone)) : ''}<div>${b.legal()}</div></footer>`);
  out.push(`<div class="gl-sticky">${a('gl-yellow', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('gl-out', b.waHref, `${ICON.wa('gl-wa')}WhatsApp`) : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
