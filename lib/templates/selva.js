// Diseño «Selva» para hoteles en la naturaleza y villas (theme.style = 'selva'), basado en Samsara
// Ubud: oscuro carbón, palabras enormes muy espaciadas como marca de agua («Historia», el nombre
// del lugar) detrás del texto, fotos de naturaleza a todo lo ancho y una sección que presenta a
// los dueños.
import { base, esc } from './base.js';

export const SELVA_FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Nunito+Sans:wght@300;400;600&display=swap';

export function renderSelva(c = {}, opts = {}) {
  const b = base(c, opts, '#A5B58C'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const owners = c.owners || (c.team?.text ? { text: c.team.text, photo: c.team.photo } : null);
  const out = [`<link rel="stylesheet" href="/assets/t-selva.css">`,
    `<div class="cx sv${b.live ? '' : ' sv-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="sv-top"><b class="sv-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['sv-historia', 'Historia'], ['sv-villas', 'Habitaciones'], ['sv-visita', 'Llegar']].map(b.navLink).join('')}</nav>${a('sv-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="sv-hero"${b.mk('hero')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'sv-hero-img')}<h1>${esc(hero.title)}</h1></section>`);
  out.push(`<section class="sv-story" id="sv-historia"><p class="sv-water" aria-hidden="true">Historia</p><div><h2>${esc(hero.sub || '')}</h2>${b.trust.length ? `<ul>${b.trust.map(t => `<li><b>${esc(t.b)}</b><span>${esc(t.t)}</span></li>`).join('')}</ul>` : ''}</div></section>`);
  if (rooms.length) out.push(`<section class="sv-villas" id="sv-villas"${b.mk('services')}><p class="sv-water" aria-hidden="true">${esc(String(b.brand.name || name).split(' ').slice(-1)[0])}</p>${rooms.map((r, i) => `<article class="sv-villa${i % 2 ? ' sv-villa--r' : ''}">${photo(r.img, r.imgAlt || r.name, 'sv-villa-img')}<div><p class="sv-kick">${String(i + 1).padStart(2, '0')}</p><h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="sv-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`, r.price && `desde ${r.price}`].filter(Boolean).map(esc).join(' · ')}</p>${a('sv-btn sv-btn--line', b.roomHref(r), 'Reservar')}</div></article>`).join('')}</section>`);
  out.push(`<section class="sv-wide">${photo(g[1]?.img || hero.photo, g[1]?.alt || '', 'sv-wide-img')}<p>${esc(c.gallery?.text || '')}</p></section>`);
  if (owners) out.push(`<section class="sv-owners"${b.mk('team')}>${photo(owners.photo || g[2]?.img, 'Los dueños', 'sv-owners-img')}<div><p class="sv-kick">Quiénes te reciben</p><h2>${esc(c.team?.title || 'Nuestra familia')}</h2><p>${esc(owners.text)}</p></div></section>`);
  out.push(`<section class="sv-book"><h2>Tu estancia</h2>${b.stayForm('sv-stay')}${b.amenities.length ? `<p class="sv-amen">${b.amenities.map(x => esc(x.b)).join(' · ')}</p>` : ''}</section>`);
  if (b.reviews.length) out.push(`<section class="sv-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="sv-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="sv-visit" id="sv-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Cómo llegar')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}<p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? a('sv-btn sv-btn--line', b.mapsHref, 'Ver mapa') : ''}</section>
  <footer class="sv-foot"><b class="sv-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="sv-sticky">${a('sv-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
