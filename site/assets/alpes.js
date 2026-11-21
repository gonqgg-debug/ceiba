// Diseño «Alpes» para hoteles con varios tipos de viaje (theme.style = 'alpes'), basado en Swiss
// Deluxe Hotels: hero oscuro de paisaje con el título en mayúsculas finas, y un selector
// «Elige tu experiencia» (pareja, familia, descanso…) que cambia la foto, el texto y la
// habitación recomendada; después las habitaciones en filas sobrias.
import { base, esc, ICON } from './base.js';

export const ALPES_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap';

export function renderAlpes(c = {}, opts = {}) {
  const b = base(c, opts, '#B89B6A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  // Experiencias: de c.experiences [{ t, d, img, room }]; si no hay, se arman con la galería, las amenidades y las habitaciones
  const exps = (Array.isArray(c.experiences) && c.experiences.length ? c.experiences : [
    { t: 'En pareja', d: rooms[0]?.desc || hero.sub, img: rooms[0]?.img || g[0]?.img, room: rooms[0]?.name },
    { t: 'En familia', d: rooms[1]?.desc || hero.sub, img: rooms[1]?.img || g[1]?.img, room: rooms[1]?.name },
    { t: 'Para descansar', d: b.amenities.slice(0, 3).map(x => `${x.b}: ${x.t}`).join('. '), img: g[0]?.img || hero.photo },
    { t: 'Para comer bien', d: (b.amenities.find(x => /desayun|restaurante|cocina/i.test(x.b)) || {}).t || '', img: g[1]?.img || hero.photo },
  ]).filter(e => e.t).slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-alpes.css">`,
    `<div class="cx al${b.live ? '' : ' al-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="al-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'al-hero-img')}<header class="al-top"><nav aria-label="Secciones">${[['al-experiencias', 'Experiencias'], ['al-habitaciones', 'Habitaciones'], ['al-visita', 'Ubicación']].map(b.navLink).join('')}</nav><b class="al-logo">${esc(b.brand.name || name)}</b>${a('al-btn al-btn--ghost', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header><h1>${esc(hero.title)}</h1></section>`);
  out.push(`<section class="al-intro"><h2>${esc(hero.sub || '')}</h2></section>`);
  out.push(`<section class="al-exp" id="al-experiencias" data-t-tabs><p class="al-kick">Elige tu experiencia</p><div class="al-tabs" role="tablist" aria-label="Tipo de viaje">${exps.map((e, i) => `<button type="button" role="tab" aria-selected="${!i}" aria-controls="al-e${i}">${esc(e.t)}</button>`).join('')}</div>
    ${exps.map((e, i) => `<div class="al-panel" role="tabpanel" id="al-e${i}"${i ? ' hidden' : ''}>${photo(e.img, e.t, 'al-panel-img')}<div><h3>${esc(e.t)}</h3>${e.d ? `<p>${esc(e.d)}</p>` : ''}${e.room ? `<p class="al-rec">Te recomendamos: <b>${esc(e.room)}</b></p>` : ''}${a('al-btn', b.waNum ? b.waMsg(`Hola, quiero reservar una estancia ${e.t.toLowerCase()} en ${name}`) : b.bookHref, 'Reservar esta experiencia')}</div></div>`).join('')}</section>`);
  if (rooms.length) out.push(`<section class="al-rooms" id="al-habitaciones"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'al-room-img')}<div><h3>${esc(r.name)}</h3>${r.desc ? `<p>${esc(r.desc)}</p>` : ''}<p class="al-specs">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`].filter(Boolean).map(esc).join(' · ')}</p></div><div class="al-room-r">${r.price ? `<p>desde<b>${esc(r.price)}</b></p>` : ''}${a('al-link', b.roomHref(r), `Reservar ${ICON.arrow('al-arr')}`)}</div></article>`).join('')}${c.rooms?.note ? `<p class="al-note">${esc(c.rooms.note)}</p>` : ''}</section>`);
  out.push(`<section class="al-book"><h2>Consulta tus fechas</h2>${b.stayForm('al-stay')}</section>`);
  if (b.reviews.length) out.push(`<section class="al-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="al-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="al-visit" id="al-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'al-visit-img')}<div><h2>${esc(b.visit.title || 'Ubicación')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.map(r => `<p>${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('al-link', b.mapsHref, `Ver mapa ${ICON.arrow('al-arr')}`) : ''}</div></section>
  <footer class="al-foot"><b class="al-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="al-sticky">${a('al-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
