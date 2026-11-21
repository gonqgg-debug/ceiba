// Diseño «Glamping» para glamping, cabañas y estancias al aire libre (theme.style = 'glamping'),
// basado en Teranga Lodges: bloques rojo vino con la foto de la tienda o cabaña a un lado,
// íconos de línea con tres razones para venir, la lista de lo que trae cada alojamiento con
// palomitas, un FAQ completo para quien nunca ha ido y fotos de huéspedes.
import { base, esc, ICON } from './base.js';

export const GLAMPING_FONTS = 'https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Montserrat:wght@400;500;600&display=swap';

export function renderGlamping(c = {}, opts = {}) {
  const b = base(c, opts, '#8E2B2B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const why = b.trust.slice(0, 3);
  const out = [`<link rel="stylesheet" href="/assets/t-glamping.css">`,
    `<div class="cx gp${b.live ? '' : ' gp-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="gp-top"><b class="gp-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['gp-alojamientos', 'Alojamientos'], ['gp-preguntas', 'Preguntas'], ['gp-visita', 'Contacto']].map(b.navLink).join('')}</nav>${a('gp-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="gp-hero"${b.mk('hero')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'gp-hero-img')}<div><p class="gp-script">${esc(b.brand.name || name)}</p><h1>${esc(hero.title)}</h1>${a('gp-btn gp-btn--w', b.bookHref, esc(b.ctaTop))}</div></section>`);
  if (why.length) out.push(`<section class="gp-why"${b.mk('trust')}>${why.map((t, i) => `<div><svg viewBox="0 0 24 24" aria-hidden="true">${['<path d="M3 20h18M5 20l7-14 7 14M9 20l3-6 3 6"/>', '<path d="M12 3v18M5 8c3 0 7 2 7 6M19 8c-3 0-7 2-7 6"/>', '<circle cx="12" cy="9" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'][i]}</svg><h2>${esc(t.b)}</h2><p>${esc(t.t)}</p></div>`).join('')}</section>`);
  if (rooms.length) out.push(`<section class="gp-lodges" id="gp-alojamientos"${b.mk('services')}>${rooms.map((r, i) => `<article class="${i % 2 ? 'gp-lodge--r' : ''}">${photo(r.img, r.imgAlt || r.name, 'gp-lodge-img')}<div><p class="gp-script">${esc(c.rooms?.title || 'Alojamiento')}</p><h2>${esc(r.name)}</h2><p>${esc(r.desc || '')}</p><ul>${[...(r.amenities || []), r.guests && `Hasta ${r.guests} huéspedes`, r.beds].filter(Boolean).slice(0, 7).map(x => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul><div class="gp-row">${r.price ? `<b>${esc(r.price)}<small> / ${esc(r.unit || 'noche')}</small></b>` : ''}${a('gp-btn gp-btn--w', b.roomHref(r), 'Reservar')}</div></div></article>`).join('')}</section>`);
  out.push(`<section class="gp-book"><h2>¿Cuándo vienes?</h2>${b.stayForm('gp-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="gp-faq" id="gp-preguntas"><p class="gp-script">¿Primera vez?</p><h2>Todo lo que necesitas saber</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  if (b.reviews.length || g.length > 1) out.push(`<section class="gp-guests"${b.mk('reviews')}><h2>Lo que viven nuestros huéspedes</h2><div>${b.reviews.slice(0, 3).map((r, i) => `<figure>${photo(g[(i + 1) % g.length]?.img, '', 'gp-guest-img')}<figcaption>“${esc(r.text)}” <b>${esc(r.name)}</b></figcaption></figure>`).join('')}</div></section>`);
  out.push(`<section class="gp-visit" id="gp-visita"${b.mk('visit')}><div><h2>${esc(b.visit.title || 'Cómo llegar')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}<p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? a('gp-btn gp-btn--w', b.mapsHref, 'Ver mapa') : ''}</div>${photo(b.visit.photo, b.visit.photoAlt || '', 'gp-visit-img')}</section>
  <footer class="gp-foot"><b class="gp-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="gp-sticky">${a('gp-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('gp-btn gp-btn--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
