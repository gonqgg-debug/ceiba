// Diseño «Rancho» para hoteles de campo y desierto (theme.style = 'rancho'), basado en el Gage
// Hotel (Texas): hero con tres palabras sobre la foto (Hospédate · Consiéntete · Come), bienvenida
// centrada con un emblema, bloques de texto con lista subrayada junto a fotos con una caja café
// desplazada detrás, tres mosaicos de experiencias, reconocimientos sobre fondo oscuro y una
// opinión en un recuadro desplazado.
import { base, esc } from './base.js';

export const RANCHO_FONTS = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=Oswald:wght@400;500&display=swap';
const EMB = '<svg class="rn-emb" viewBox="0 0 24 40" aria-hidden="true"><path d="M12 2v36M12 8c-4 0-6 3-6 6 3 0 6-2 6-6Zm0 0c4 0 6 3 6 6-3 0-6-2-6-6ZM12 18c-4 0-6 3-6 6 3 0 6-2 6-6Zm0 0c4 0 6 3 6 6-3 0-6-2-6-6Z"/></svg>';

export function renderRancho(c = {}, opts = {}) {
  const b = base(c, opts, '#5C4A32'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4), am = b.amenities;
  const tiles = (b.trust.length ? b.trust : am).slice(0, 3);
  const block = (cls, img, alt, kick, h, items, cta, href) => `<section class="rn-block ${cls}">${photo(img, alt, 'rn-block-img')}<div><p class="rn-kick">${esc(kick)}</p><h2>${esc(h)}</h2>${items}${a('rn-btn', href, esc(cta))}</div></section>`;
  const out = [`<link rel="stylesheet" href="/assets/t-rancho.css">`,
    `<div class="cx rn${b.live ? '' : ' rn-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="rn-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'rn-hero-img')}<header class="rn-top"><span></span><b class="rn-logo">${esc(String(b.brand.name || name).toUpperCase())}<small>${esc(b.brand.tagline || '')}</small></b>${a('rn-btn rn-btn--w', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <nav class="rn-words" aria-label="Secciones">${[['rn-hospedate', 'Hospédate'], ['rn-consientete', 'Consiéntete'], ['rn-visita', 'Llega']].map(b.navLink).join('')}</nav></section>`);
  out.push(`<section class="rn-welcome">${EMB}<h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></section>`);
  if (rooms.length) out.push(`<div id="rn-hospedate"${b.mk('services')}>${block('', rooms[0].img, rooms[0].imgAlt || rooms[0].name, 'Dónde dormir', c.rooms?.title || 'Quédate unos días', `<ul>${rooms.map(r => `<li>${a('', b.roomHref(r), `${esc(r.name)}${r.price ? `<small>desde ${esc(r.price)}</small>` : ''}`)}</li>`).join('')}</ul>`, 'Ver habitaciones', b.bookHref)}</div>`);
  if (tiles.length) out.push(`<section class="rn-tiles" id="rn-consientete"${b.mk('trust')}>${tiles.map((t, i) => `<article>${photo(g[(i + 1) % Math.max(g.length, 1)]?.img, '', 'rn-tile-img')}<h3>${esc(t.b)}</h3><p>${esc(t.t)}</p></article>`).join('')}</section>`);
  if (am.length) out.push(block('rn-block--r', g[2]?.img || g[0]?.img, g[2]?.alt || '', 'En la casa', c.amenities?.title || 'Todo lo que incluye', `<ul>${am.slice(0, 5).map(x => `<li><span>${esc(x.b)}<small>${esc(x.t)}</small></span></li>`).join('')}</ul>`, esc(b.ctaTop), b.bookHref));
  if (b.rating || b.trust.length) out.push(`<section class="rn-rec"><div><p class="rn-kick">Lo que dicen</p><h2>Reconocimientos</h2>${b.rating ? `<p>${esc(b.rating.value)} de calificación en ${esc(b.rating.count)} ${esc(b.rating.source || 'opiniones')}.</p>` : ''}</div><ul>${b.reviews.slice(0, 4).map(r => `<li>“${esc(r.text)}” <span>${esc(r.name)}</span></li>`).join('')}</ul></section>`);
  if (b.reviews[0]) out.push(`<section class="rn-quote"${b.mk('reviews')}><div>${photo(g[1]?.img || hero.photo, '', 'rn-quote-img')}<blockquote><p>“${esc(b.reviews[b.reviews.length > 1 ? 1 : 0].text)}”</p><cite>${esc(b.reviews[b.reviews.length > 1 ? 1 : 0].name)}</cite></blockquote></div></section>`);
  out.push(`<section class="rn-book"><p class="rn-kick">Reservar</p><h2>¿Cuándo llegas?</h2>${b.stayForm('rn-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="rn-faq"><h2>Antes de venir</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="rn-foot" id="rn-visita"${b.mk('visit')}><b class="rn-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><div class="rn-cols"><p>${esc(contact.address || '')}${b.visit.zones ? `<br>${esc(b.visit.zones)}` : ''}</p><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar →')}` : ''}</p></div><div class="rn-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="rn-sticky">${a('rn-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
