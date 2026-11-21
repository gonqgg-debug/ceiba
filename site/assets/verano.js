// Diseño «Verano» para moteles con alberca, hostales y hoteles juguetones (theme.style = 'verano'),
// basado en las notas del documento sobre The Drifter (Nueva Orleans; al capturarla falló la
// conexión): letra gorda y juguetona, colores fuertes (rosa, verde agua, amarillo), la alberca
// como protagonista, una cinta de palabras que corre, cuartos en tarjetas de colores
// y calcomanías.
import { base, esc, ICON } from './base.js';

export const VERANO_FONTS = 'https://fonts.googleapis.com/css2?family=Shrikhand&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

export function renderVerano(c = {}, opts = {}) {
  const b = base(c, opts, '#F0567A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const words = [...b.amenities.map(x => x.b), ...b.trust.map(x => x.b)].slice(0, 6);
  const run = words.length ? `<div class="vr-run" aria-hidden="true"><div>${[...words, ...words].map(w => `<span>${esc(w)}</span><i>✺</i>`).join('')}</div></div>` : '';
  const out = [`<link rel="stylesheet" href="/assets/t-verano.css">`,
    `<div class="cx vr${b.live ? '' : ' vr-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="vr-top"><b class="vr-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['vr-cuartos', 'Cuartos'], ['vr-alberca', 'La alberca'], ['vr-visita', 'Ven']].map(b.navLink).join('')}</nav>${a('vr-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="vr-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><div class="vr-pic">${photo(hero.photo, hero.photoAlt || name, 'vr-hero-img')}<p class="vr-sticker">${b.rating ? `${esc(b.rating.value)}<small>★ ${esc(b.rating.source || 'huéspedes')}</small>` : 'Hola!'}</p></div><div class="vr-side"><p>${esc(hero.sub || '')}</p>${a('vr-btn vr-btn--big', b.bookHref, `${esc(b.ctaTop)} ${ICON.arrow('')}`)}</div></section>`);
  out.push(run);
  if (rooms.length) out.push(`<section class="vr-rooms" id="vr-cuartos"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Cuartos')}</h2><div>${rooms.map((r, i) => `<article class="vr-c${i % 4}">${photo(r.img, r.imgAlt || r.name, 'vr-room-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><div class="vr-row">${r.price ? `<b>${esc(r.price)}</b>` : '<span></span>'}${a('vr-btn vr-btn--ink', b.roomHref(r), 'Lo quiero')}</div></article>`).join('')}</div></section>`);
  out.push(`<section class="vr-pool" id="vr-alberca">${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'vr-pool-img')}<div><h2>${esc(c.gallery?.title || 'Al agua')}</h2><ul>${b.amenities.slice(0, 5).map(x => `<li><b>${esc(x.b)}</b> ${esc(x.t)}</li>`).join('')}</ul></div></section>`);
  if (b.reviews.length) out.push(`<section class="vr-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map((r, i) => `<blockquote class="vr-c${(i + 1) % 4}"><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(`<section class="vr-book"><h2>¿Cuándo llegas?</h2>${b.stayForm('vr-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="vr-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="vr-foot" id="vr-visita"${b.mk('visit')}><b class="vr-logo">${esc(b.brand.name || name)}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="vr-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="vr-sticky">${a('vr-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
