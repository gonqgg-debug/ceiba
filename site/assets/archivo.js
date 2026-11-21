// Diseño «Archivo» para hoteles con historia (theme.style = 'archivo'), basado en Landa: papel rosado,
// el texto de su historia centrado como en una carta, un separador de cubiertos, una cuadrícula
// de fotos en blanco y negro (que toman color al pasar el cursor), y las distinciones como lista
// en cursiva. Clásico, familiar y sin prisa.
import { base, esc } from './base.js';

export const ARCHIVO_FONTS = 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@400;500&display=swap';
const CUTLERY = '<svg class="ar-sep" viewBox="0 0 60 30" aria-hidden="true"><path d="M14 2v26M10 2v8a4 4 0 0 0 8 0V2M30 2c-3 0-4 4-4 9s2 6 4 6v11M30 2v26M44 2l-2 12h4zM44 14v14"/></svg>';

export function renderArchivo(c = {}, opts = {}) {
  const b = base(c, opts, '#8C3B3B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const pics = [...g.map(x => x), ...rooms.map(r => ({ img: r.img, alt: r.name })), { img: b.visit.photo, alt: b.visit.photoAlt }].filter(x => x.img).slice(0, 6);
  const out = [`<link rel="stylesheet" href="/assets/t-archivo.css">`,
    `<div class="cx ar${b.live ? '' : ' ar-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ar-top"><nav aria-label="Secciones">${[['ar-historia', 'Historia'], ['ar-habitaciones', 'Habitaciones'], ['ar-visita', 'Cómo llegar']].map(b.navLink).join('')}</nav><b class="ar-logo">${esc(b.brand.name || name)}</b>${a('ar-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ar-letter" id="ar-historia"${b.mk('hero')}><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}${list2(c.stats).map(s => `<p>${esc(s.value)} ${esc(s.label)}.</p>`).join('')}${CUTLERY}${b.trust.length ? `<ul class="ar-honors">${b.trust.map(t => `<li><em>${esc(t.b)}</em> — ${esc(t.t)}</li>`).join('')}</ul>` : ''}</section>`);
  if (pics.length >= 3) out.push(`<section class="ar-grid" aria-label="${esc(c.gallery?.title || 'La casa')}">${pics.map(p => `<figure>${photo(p.img, p.alt, 'ar-grid-img')}${p.alt ? `<figcaption>${esc(p.alt)}</figcaption>` : ''}</figure>`).join('')}</section>`);
  if (rooms.length) out.push(`<section class="ar-rooms" id="ar-habitaciones"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2>${c.rooms?.sub ? `<p class="ar-sub">${esc(c.rooms.sub)}</p>` : ''}<ol>${rooms.map(r => `<li><h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="ar-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`, r.price && `desde ${r.price} por ${r.unit || 'noche'}`].filter(Boolean).map(esc).join(' · ')}</p>${a('ar-link', b.roomHref(r), 'Reservar esta habitación')}</li>`).join('')}</ol></section>`);
  out.push(`<section class="ar-book">${CUTLERY}<h2>Reservaciones</h2>${b.stayForm('ar-stay')}</section>`);
  if (b.amenities.length) out.push(`<section class="ar-amen"${b.mk('trust')}><h2>${esc(c.amenities?.title || 'La casa incluye')}</h2><p>${b.amenities.map(x => `<span><em>${esc(x.b)}</em>, ${esc(x.t)}</span>`).join(' · ')}</p></section>`);
  if (b.reviews.length) out.push(`<section class="ar-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>«${esc(r.text)}»</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ar-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ar-visit" id="ar-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Cómo llegar')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p><em>${esc(b.visit.zones)}</em></p>` : ''}${b.rows.map(r => `<p>${esc(r.dt)}, ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('ar-link', b.mapsHref, 'Abrir el mapa') : ''}</section>
  <footer class="ar-foot"><b class="ar-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ar-sticky">${a('ar-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
const list2 = a => (Array.isArray(a) ? a.filter(Boolean).slice(0, 3) : []);
