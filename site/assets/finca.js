// Diseño «Finca» para haciendas, fincas y casas de lujo (theme.style = 'finca'), basado en Kinross
// House: presentación sobria y exclusiva. Bienvenida centrada en serif con un ornamento, dos
// fotos lado a lado (interior y fachada), texto corto, una cita grande sobre fondo oscuro
// y «cómo reservar la casa completa».
import { base, esc } from './base.js';

export const FINCA_FONTS = 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Lato:wght@300;400;700&display=swap';
const ORN = '<svg class="fn-orn" viewBox="0 0 80 16" aria-hidden="true"><path d="M2 8h28M50 8h28M40 2c-4 4-4 8 0 12 4-4 4-8 0-12ZM34 8c2-2 4-2 6 0-2 2-4 2-6 0ZM40 8c2-2 4-2 6 0-2 2-4 2-6 0Z"/></svg>';

export function renderFinca(c = {}, opts = {}) {
  const b = base(c, opts, '#7B5E3B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-finca.css">`,
    `<div class="cx fn${b.live ? '' : ' fn-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="fn-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'fn-hero-img')}<header class="fn-top"><span></span><b class="fn-logo">${esc(b.brand.name || name)}</b><div>${a('fn-btn fn-btn--w', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</div></header><p class="fn-tag">${esc(b.brand.tagline || '')}</p></section>`);
  out.push(`<section class="fn-welcome"><h1>${esc(hero.title)}</h1>${ORN}</section>`);
  out.push(`<section class="fn-pair">${photo(g[3]?.img || rooms[0]?.img, g[3]?.alt || '', 'fn-p1')}<div>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'fn-p2')}<h2>${esc(c.gallery?.title || 'La casa')}</h2><p>${esc(hero.sub || '')}</p>${a('fn-btn', b.bookHref, 'Consultar fechas')}</div></section>`);
  if (b.reviews[0]) out.push(`<section class="fn-quote"${b.mk('reviews')}><span aria-hidden="true">“</span><p>${esc(b.reviews[0].text)}</p><cite>${esc(b.reviews[0].name)}</cite></section>`);
  if (rooms.length) out.push(`<section class="fn-rooms" id="fn-habitaciones"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2>${ORN}<div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'fn-room-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p>${a('fn-link', b.roomHref(r), 'Consultar')}</article>`).join('')}</div></section>`);
  if (b.amenities.length) out.push(`<section class="fn-amen"${b.mk('trust')}><h2>${esc(c.amenities?.title || 'La estancia')}</h2><ul>${b.amenities.slice(0, 8).map(x => `<li><b>${esc(x.b)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul></section>`);
  out.push(`<section class="fn-book"><h2>Reservar la casa</h2><p>Para estancias, celebraciones privadas o la casa completa, escríbenos con tus fechas.</p>${b.stayForm('fn-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="fn-faq"><h2>Preguntas</h2>${ORN}${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="fn-visit" id="fn-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'fn-visit-img')}<div><h2>${esc(b.visit.title || 'Ubicación')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}${b.mapsHref ? a('fn-link', b.mapsHref, 'Cómo llegar') : ''}</div></section>
  <footer class="fn-foot"><b class="fn-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="fn-sticky">${a('fn-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
