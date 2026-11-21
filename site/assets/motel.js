// Diseño «Motel» para hoteles de carretera, moteles renovados y hostales con onda (theme.style =
// 'motel'), basado en Amigo Motor Lodge (Colorado): letra de máquina de escribir, hero con la barra
// de reserva encima de la foto, franja rosa con la presentación, habitaciones en carrusel,
// opiniones de Google, un bloque terracota con la promoción, experiencias con tarjeta encimada
// y una cuadrícula de fotos tipo Instagram.
import { base, esc, ICON } from './base.js';

export const MOTEL_FONTS = 'https://fonts.googleapis.com/css2?family=Special+Elite&family=Work+Sans:wght@400;500;600&display=swap';

export function renderMotel(c = {}, opts = {}) {
  const b = base(c, opts, '#C0634A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms;
  const offer = b.offers[0];
  const out = [`<link rel="stylesheet" href="/assets/t-motel.css">`,
    `<div class="cx mo${b.live ? '' : ' mo-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="mo-top"><b class="mo-logo">${esc(String(b.brand.name || name).toUpperCase())}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['mo-cuartos', 'Cuartos'], ['mo-planes', 'Planes'], ['mo-fotos', 'Fotos'], ['mo-visita', 'Contacto']].map(b.navLink).join('')}</nav>${a('mo-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="mo-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'mo-hero-img')}<div><h1>${esc(hero.title)}</h1>${b.stayForm('mo-stay')}</div></section>`);
  out.push(`<section class="mo-band"><h2>${esc(b.rating ? `${b.rating.value} ★ en ${b.rating.source || 'Google'}` : (b.brand.tagline || name))}</h2><p>${esc(hero.sub || '')}</p></section>`);
  if (rooms.length) out.push(`<section class="mo-rooms" id="mo-cuartos"${b.mk('services')}><div class="mo-rooms-intro"><h2>${esc(c.rooms?.title || 'Cuartos')}</h2><p>${esc(c.rooms?.text || 'Cada cuarto tiene su propia personalidad. Escoge el tuyo.')}</p>${a('mo-btn', b.bookHref, 'Ver disponibilidad')}</div><div class="mo-track">${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'mo-room-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="mo-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.price && `desde ${r.price}`].filter(Boolean).map(esc).join(' · ')}</p>${a('mo-link', b.roomHref(r), `Reservar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="mo-revs"${b.mk('reviews')}><div class="mo-score"><p>Lo que dicen</p>${b.rating ? `<b>${esc(b.rating.value)}</b><span aria-label="cinco estrellas">★★★★★</span><small>${esc(b.rating.count)} opiniones</small>` : ''}</div>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(`<section class="mo-offer" id="mo-planes"${b.mk('offers')}><div><p class="mo-kick">${esc(offer ? 'Promoción' : 'Reserva directo')}</p><h2>${esc(offer?.title || offer?.name || 'Mejor precio reservando con nosotros')}</h2><p>${esc(offer?.desc || offer?.text || 'Escríbenos por WhatsApp con tus fechas y te confirmamos al momento, sin comisiones de plataformas.')}</p>${a('mo-btn mo-btn--w', b.bookHref, esc(b.ctaTop))}</div>${photo(g[1]?.img || hero.photo, g[1]?.alt || '', 'mo-offer-img')}</section>`);
  if (b.amenities.length) out.push(`<section class="mo-exp"${b.mk('trust')}>${photo(g[2]?.img || g[0]?.img, g[2]?.alt || '', 'mo-exp-img')}<div><h2>${esc(c.amenities?.title || 'Qué hay por aquí')}</h2><ul>${b.amenities.slice(0, 6).map(x => `<li><b>${esc(x.b)}</b> — ${esc(x.t)}</li>`).join('')}</ul></div></section>`);
  if (g.length) out.push(`<section class="mo-grid" id="mo-fotos"><div><h2>Encuéntranos</h2><p>${esc(contact.address || '')}</p>${b.mapsHref ? a('mo-link', b.mapsHref, `Cómo llegar ${ICON.arrow('')}`) : ''}</div><div class="mo-shots">${g.slice(0, 4).map(x => photo(x.img, x.alt || '', 'mo-shot')).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="mo-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="mo-foot" id="mo-visita"${b.mk('visit')}><b class="mo-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="mo-sticky">${a('mo-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
