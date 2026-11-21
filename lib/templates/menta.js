// Diseño «Menta» para clínicas (theme.style = 'menta'), basado en la nota de Mint Dentistry
// del documento de referencias: «marca verde coherente y tarjetas de servicio interactivas».
// Un solo color de marca en todo (bloques, botones, íconos), letra redondeada y tarjetas de
// tratamiento que se voltean al tocarlas para mostrar precio, detalle y botón.
import { base, esc, ICON } from './base.js';

export const MENTA_FONTS = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap';

export function renderMenta(c = {}, opts = {}) {
  const b = base(c, opts, '#1F9D6B'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 8), trust = b.trust.slice(0, 4), reviews = b.reviews.slice(0, 3);
  const nav = [services.length && ['mt-trat', 'Tratamientos'], b.members.length && ['mt-equipo', 'Equipo'], reviews.length && ['mt-opiniones', 'Opiniones'], ['mt-visita', 'Visítanos']].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-menta.css">`,
    `<div class="cx mt${b.live ? '' : ' mt-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="mt-top"><b class="mt-logo"><i aria-hidden="true"></i>${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav>${a('mt-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="mt-hero"${b.mk('hero')}><div class="mt-hero-copy"><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}<div class="mt-ctas">${a('mt-btn mt-btn--white', b.bookHref, esc(hero.cta || b.ctaTop))}${b.telNum ? a('mt-btn mt-btn--ghost', `tel:${b.telNum}`, esc(contact.phone)) : ''}</div>
      ${b.rating ? `<p class="mt-rate"><span aria-hidden="true">${ICON.star.repeat(5)}</span>${esc(b.rating.value)} · ${esc(b.rating.count)} reseñas en ${esc(b.rating.source || 'Google')}</p>` : ''}</div>
    <div class="mt-hero-art">${photo(hero.photo, hero.photoAlt || name, 'mt-hero-img')}<span class="mt-blob" aria-hidden="true"></span></div></section>`);
  if (trust.length) out.push(`<section class="mt-trust"${b.mk('trust')}>${trust.map(t => `<div><i aria-hidden="true">${ICON.check}</i><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  // Tarjetas que se voltean (frente: foto y nombre; vuelta: detalle, precio y botón)
  if (services.length) out.push(`<section class="mt-trat" id="mt-trat"${b.mk('services')}><h2>${esc(c.services.title || 'Tratamientos')}</h2><p class="mt-sub">${esc(c.services.sub || 'Toca una tarjeta para ver el detalle.')}</p>
    <ul>${services.map(s => `<li><button type="button" class="mt-flip" data-t-flip aria-pressed="false" aria-label="${esc(s.name)}: ver detalle"><span class="mt-face mt-front">${photo(s.img, s.imgAlt || s.name, 'mt-card-img')}<b>${esc(s.name)}</b><small>Ver detalle ${ICON.arrow('mt-arr')}</small></span>
      <span class="mt-face mt-back"><b>${esc(s.name)}</b>${s.desc ? `<span>${esc(s.desc)}</span>` : ''}${s.price ? `<strong>${esc(s.price)}</strong>` : ''}</span></button>${a('mt-card-go', b.serviceHref(s), `Agendar ${esc(s.name.toLowerCase())}`)}</li>`).join('')}</ul>
    ${c.services.note ? `<p class="mt-note">${esc(c.services.note)}</p>` : ''}</section>`);
  if (b.members.length) out.push(`<section class="mt-team" id="mt-equipo"${b.mk('team')}><div class="mt-team-copy"><h2>${esc(c.team?.title || 'Tu equipo')}</h2>${c.team?.text ? `<p>${esc(c.team.text)}</p>` : ''}</div><ul>${b.members.slice(0, 4).map(m => `<li>${photo(m.photo, m.name, 'mt-team-img')}<b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</li>`).join('')}</ul></section>`);
  if (reviews.length) out.push(`<section class="mt-revs" id="mt-opiniones"${b.mk('reviews')}><h2>Pacientes contentos</h2><div>${reviews.map(r => `<figure><blockquote>${esc(r.text)}</blockquote><figcaption><i aria-hidden="true">${esc(r.name.slice(0, 1))}</i>${esc(r.name)}${r.meta ? `<small>${esc(r.meta)}</small>` : ''}</figcaption></figure>`).join('')}</div>${c.reviews?.note ? `<p class="mt-note">${esc(c.reviews.note)}</p>` : ''}</section>`);
  if (b.faq.length) out.push(`<section class="mt-faq"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="mt-visit" id="mt-visita"${b.mk('visit')}><div><h2>Visítanos</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<dl>${b.rows.slice(0, 4).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl><div class="mt-ctas">${a('mt-btn mt-btn--white', b.bookHref, esc(b.ctaTop))}${b.mapsHref ? a('mt-btn mt-btn--ghost', b.mapsHref, 'Cómo llegar') : ''}</div></div>${photo(b.visit.photo, 'Fachada', 'mt-visit-img')}</section>
  <footer class="mt-foot"><b class="mt-logo"><i aria-hidden="true"></i>${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="mt-sticky">${a('mt-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('mt-btn mt-btn--line', b.waHref, `${ICON.wa('mt-wa')}WhatsApp`) : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
