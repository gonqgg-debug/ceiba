// Diseño «Clásico» para hoteles urbanos (theme.style = 'clasico'), basado en The Wallace (Nueva York):
// hero negro con la distinción o calificación al centro y el logo en versalitas espaciadas,
// «una invitación a descansar» con foto desplazada, bloques color arena con fotos superpuestas
// y el barrio como parte de la experiencia.
import { base, esc } from './base.js';

export const CLASICO_FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Montserrat:wght@400;500&display=swap';

export function renderClasico(c = {}, opts = {}) {
  const b = base(c, opts, '#A88B67'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-clasico.css">`,
    `<div class="cx cs${b.live ? '' : ' cs-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="cs-hero"${b.mk('hero')}><header class="cs-top"><nav aria-label="Secciones">${[['cs-habitaciones', 'Habitaciones'], ['cs-barrio', 'El barrio'], ['cs-visita', 'Contacto']].map(b.navLink).join('')}</nav><b class="cs-logo">·${esc(String(b.brand.name || name).toUpperCase())}·</b>${a('cs-btn cs-btn--w', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <div class="cs-award">${b.rating ? `<p class="cs-big">${esc(b.rating.value)}</p><p>calificación de ${esc(b.rating.count)} ${esc(b.rating.source || 'huéspedes')}</p>` : ''}<h1>${esc(hero.title)}</h1></div></section>`);
  out.push(`<section class="cs-invite"><div><h2>Una invitación<br>a descansar</h2><p>${esc(hero.sub || '')}</p>${a('cs-btn', b.bookHref, 'Ver habitaciones')}</div><figure>${photo(rooms[0]?.img || g[0]?.img || hero.photo, '', 'cs-invite-img')}</figure></section>`);
  out.push(`<section class="cs-sand">${photo(g[1]?.img || hero.photo, g[1]?.alt || '', 'cs-sand-img')}<div><h2>${esc(c.amenities?.title || 'La casa')}</h2><p>${b.amenities.slice(0, 4).map(x => `${esc(x.b)}: ${esc(x.t)}`).join('. ')}.</p>${a('cs-btn', b.bookHref, 'Reservar')}</div></section>`);
  if (rooms.length) out.push(`<section class="cs-rooms" id="cs-habitaciones"${b.mk('services')}><p class="cs-kick">Descubre</p><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2><div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'cs-room-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="cs-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`].filter(Boolean).map(esc).join(' · ')}${r.price ? ` · desde ${esc(r.price)}` : ''}</p>${a('cs-link', b.roomHref(r), 'Reservar')}</article>`).join('')}</div></section>`);
  out.push(`<section class="cs-hood" id="cs-barrio"><div><p class="cs-kick">El barrio</p><h2>${esc(b.visit.title || 'Ubicación')}</h2>${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}${b.trust.length ? `<ul>${b.trust.map(t => `<li>${esc(t.b)} — ${esc(t.t)}</li>`).join('')}</ul>` : ''}</div>${photo(b.visit.photo, b.visit.photoAlt || '', 'cs-hood-img')}</section>`);
  out.push(`<section class="cs-book"><h2>Reservar</h2>${b.stayForm('cs-stay')}</section>`);
  if (b.reviews.length) out.push(`<section class="cs-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="cs-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="cs-foot" id="cs-visita"${b.mk('visit')}><b class="cs-logo">·${esc(String(b.brand.name || name).toUpperCase())}·</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="cs-sticky">${a('cs-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
