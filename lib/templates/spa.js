// Diseño «Spa» para hoteles con spa o bienestar (theme.style = 'spa'), basado en Wellness & Spa
// Hotel Kaskady: hero turquesa con textura de agua y emblema redondo, frase centrada, y las
// amenidades a pantalla completa con un recuadro blanco encima que funciona como menú
// (spa, restaurante, reservas); serif fina y mucho blanco.
import { base, esc, ICON } from './base.js';

export const SPA_FONTS = 'https://fonts.googleapis.com/css2?family=Marcellus&family=Mulish:wght@300;400;600&display=swap';

export function renderSpa(c = {}, opts = {}) {
  const b = base(c, opts, '#2C7A7B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4), am = b.amenities.slice(0, 8);
  const initials = String(b.brand.name || name).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const out = [`<link rel="stylesheet" href="/assets/t-spa.css">`,
    `<div class="cx sp${b.live ? '' : ' sp-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="sp-hero"${b.mk('hero')}><header class="sp-top"><nav aria-label="Secciones">${[['sp-habitaciones', 'Habitaciones'], ['sp-amenidades', 'Amenidades'], ['sp-visita', 'Contacto']].map(b.navLink).join('')}</nav><span class="sp-emblem" aria-hidden="true"><i>${esc(initials)}</i></span>${a('sp-book', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <div class="sp-hero-in"><h1>${esc(b.brand.fullName || name)}</h1><p>${esc(hero.title)}</p></div></section>`);
  out.push(`<section class="sp-intro"><p class="sp-lead">${esc(hero.sub || '')}</p>${b.stayForm('sp-stay')}</section>`);
  if (am.length) out.push(`<section class="sp-amen" id="sp-amenidades"${b.mk('trust')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'sp-amen-img')}<div class="sp-box"><h2>${esc(c.amenities?.title || 'Tu estancia')}</h2><ul>${am.map(x => `<li><b>${esc(x.b)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul>${a('sp-link', b.bookHref, `Reservar ${ICON.arrow('sp-arr')}`)}</div></section>`);
  if (rooms.length) out.push(`<section class="sp-rooms" id="sp-habitaciones"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2>${c.rooms?.sub ? `<p class="sp-sub">${esc(c.rooms.sub)}</p>` : ''}<div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'sp-room-img')}<h3>${esc(r.name)}</h3>${r.desc ? `<p>${esc(r.desc)}</p>` : ''}<p class="sp-specs">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`].filter(Boolean).map(esc).join(' · ')}</p><div class="sp-room-foot">${r.price ? `<span>Desde <b>${esc(r.price)}</b> / ${esc(r.unit || 'noche')}</span>` : '<span></span>'}${a('sp-book sp-book--line', b.roomHref(r), 'Reservar')}</div></article>`).join('')}</div>${c.rooms?.note ? `<p class="sp-note">${esc(c.rooms.note)}</p>` : ''}</section>`);
  if (b.reviews.length) out.push(`<section class="sp-revs"${b.mk('reviews')}>${b.rating ? `<p class="sp-score"><b>${esc(b.rating.value)}</b> de calificación · ${esc(b.rating.count)} ${esc(b.rating.source || 'reseñas')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}${r.meta ? ` · ${esc(r.meta)}` : ''}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="sp-faq"><h2>Antes de llegar</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="sp-visit" id="sp-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'sp-visit-img')}<div><h2>${esc(b.visit.title || 'Cómo llegar')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}${b.rows.map(r => `<p><b>${esc(r.dt)}</b> ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('sp-link', b.mapsHref, `Ver mapa ${ICON.arrow('sp-arr')}`) : ''}</div></section>
  <footer class="sp-foot"><span class="sp-emblem sp-emblem--s" aria-hidden="true"><i>${esc(initials)}</i></span><div>${b.legal()}</div></footer>`);
  out.push(`<div class="sp-sticky">${a('sp-book', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('sp-book sp-book--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
