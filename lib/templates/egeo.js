// Diseño «Egeo» para hoteles de playa y casas vacacionales (theme.style = 'egeo'), basado en Amaris
// Mykonos: foto de mar a todo lo ancho con el título en serif a la izquierda, azul intenso, el
// nombre del hotel enorme como marca de agua, la calificación de los huéspedes a la vista, y las
// habitaciones en tarjetas con foto alta y precio.
import { base, esc, ICON } from './base.js';

export const EGEO_FONTS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600&display=swap';

export function renderEgeo(c = {}, opts = {}) {
  const b = base(c, opts, '#1C4E9C'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-egeo.css">`,
    `<div class="cx eg${b.live ? '' : ' eg-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="eg-hero"${b.mk('hero')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'eg-hero-img')}<header class="eg-top"><b class="eg-logo">${esc(b.brand.name || name)}</b>${a('eg-menu', b.bookHref, esc(b.ctaTop), ` aria-label="${esc(b.ctaTop)}"${b.mk('cta')}`)}</header>
    <div class="eg-hero-in"><h1>${esc(hero.title)}</h1>${a('eg-link', b.live ? '#eg-reserva' : '', `Ver disponibilidad ${ICON.arrow('eg-arr')}`)}</div>${b.rating ? `<p class="eg-rate"><b>${esc(b.rating.value)}</b>${esc(b.rating.count)} ${esc(b.rating.source || 'reseñas')}</p>` : ''}</section>`);
  out.push(`<section class="eg-intro"><div><h2>${esc(hero.sub || '')}</h2>${b.trust.length ? `<ul>${b.trust.map(t => `<li><b>${esc(t.b)}</b> ${esc(t.t)}</li>`).join('')}</ul>` : ''}${a('eg-btn', b.bookHref, esc(b.ctaTop))}</div><figure>${photo(g[1]?.img || hero.photo, g[1]?.alt || '', 'eg-intro-img')}<figcaption>${esc(g[1]?.alt || '')}</figcaption></figure><p class="eg-water" aria-hidden="true">${esc(b.brand.name || name)}</p></section>`);
  out.push(`<section class="eg-sea">${photo(g[2]?.img || hero.photo, g[2]?.alt || '', 'eg-sea-img')}</section>`);
  if (rooms.length) out.push(`<section class="eg-rooms" id="eg-habitaciones"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2>${c.rooms?.sub ? `<p class="eg-sub">${esc(c.rooms.sub)}</p>` : ''}<div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'eg-room-img')}<div><h3>${esc(r.name)}</h3><p>${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`].filter(Boolean).map(esc).join(' · ')}</p>${r.price ? `<p class="eg-price">Desde <b>${esc(r.price)}</b> por ${esc(r.unit || 'noche')}</p>` : ''}${a('eg-btn eg-btn--sm', b.roomHref(r), 'Reservar')}</div></article>`).join('')}</div></section>`);
  out.push(`<section class="eg-book" id="eg-reserva"><h2>Reserva directo y paga menos</h2>${b.stayForm('eg-stay')}</section>`);
  if (b.amenities.length) out.push(`<section class="eg-amen"${b.mk('trust')}><h2>${esc(c.amenities?.title || 'Incluye')}</h2><ul>${b.amenities.slice(0, 8).map(x => `<li><b>${esc(x.b)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul></section>`);
  if (b.reviews.length) out.push(`<section class="eg-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}${r.meta ? `, ${esc(r.meta)}` : ''}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="eg-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="eg-visit" id="eg-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Ubicación')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}<p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? a('eg-link eg-link--w', b.mapsHref, `Ver mapa ${ICON.arrow('eg-arr')}`) : ''}</section>
  <footer class="eg-foot"><b class="eg-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="eg-sticky">${a('eg-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('eg-btn eg-btn--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
