// Diseño «Deli» para restaurantes, cafés y delis (theme.style = 'deli'), basado en Lox in a Box:
// la página como una pila de fotos a todo lo ancho, cada una con un titular condensado en
// mayúsculas al centro y un botón blanco redondo; logo en letra de rótulo retro, franja de
// reseñas y la carta como letrero de deli.
import { base, esc, ICON } from './base.js';

export const DELI_FONTS = 'https://fonts.googleapis.com/css2?family=League+Gothic&family=Yellowtail&family=Rubik:wght@400;500;600&display=swap';

export function renderDeli(c = {}, opts = {}) {
  const b = base(c, opts, '#1F6B45'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const book = b.waNum ? b.waMsg(`Hola, quiero reservar en ${name}`) : b.bookHref;
  const order = b.waNum ? b.waMsg(`Hola, quiero hacer un pedido en ${name}`) : b.bookHref;
  // Paneles: cada uno es una foto con titular y botón
  const panels = [
    { img: c.menu?.photo || hero.photo, t: hero.title, l: hero.ctaTop || 'Pedir ahora', h: order, alt: c.menu?.photoAlt },
    c.today && { img: g[0]?.img, t: c.today.title, l: 'Apartar mesa', h: book, alt: g[0]?.alt },
    c.shop && { img: g[1]?.img, t: c.shop.title, l: 'Pedir de la tiendita', h: b.waNum ? b.waMsg(`Hola, quiero pedir de ${c.shop.title}`) : b.bookHref, alt: g[1]?.alt },
    b.trust[0] && { img: g[2]?.img, t: `${b.trust[0].b}, ${b.trust[0].t}`, l: 'Ver la carta', h: b.live ? '#dl-carta' : '', alt: g[2]?.alt },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-deli.css">`,
    `<div class="cx dl${b.live ? '' : ' dl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="dl-top"><span class="dl-logo">${esc(b.brand.name || name)}</span><nav aria-label="Secciones">${[['dl-carta', 'La carta'], ['dl-historia', 'Nuestra historia'], ['dl-visita', 'Dónde estamos']].map(b.navLink).join('')}</nav>${a('dl-pill dl-pill--line', order, 'Pedir ahora', b.mk('cta'))}</header>`);
  out.push(panels.map((p, i) => `<section class="dl-panel${i ? '' : ' dl-panel--hero'}"${i ? '' : b.mk('hero')}>${photo(p.img, p.alt || '', 'dl-panel-img')}<div><h${i ? 2 : 1}>${esc(p.t)}</h${i ? 2 : 1}>${a('dl-pill', p.h, esc(p.l))}</div></section>`).join(''));
  if (b.reviews.length) out.push(`<section class="dl-revs"${b.mk('reviews')}><div class="dl-track">${[0, 1].map(k => `<div${k ? ' aria-hidden="true"' : ''}>${b.reviews.map(r => `<p><b>★★★★★</b> “${esc(r.text)}” <i>— ${esc(r.name)}</i></p>`).join('')}</div>`).join('')}</div></section>`);
  if (menu.length) out.push(`<section class="dl-menu" id="dl-carta"${b.mk('services')}><h2><span>La carta</span>${esc(c.menu?.sub || '')}</h2><div class="dl-board">${menu.map(m => `<div><h3>${esc(m.name)}</h3><ul>${m.items.slice(0, 7).map(i => `<li><span>${esc(i.name)}${i.desc ? `<small>${esc(i.desc)}</small>` : ''}</span><b>${esc(i.price || '')}</b></li>`).join('')}</ul></div>`).join('')}</div>
    <div class="dl-ctas">${a('dl-pill dl-pill--green', order, 'Pedir para llevar')}${a('dl-pill dl-pill--green dl-pill--line2', book, 'Reservar mesa')}</div></section>`);
  if (c.story?.text) out.push(`<section class="dl-story" id="dl-historia">${photo(g[3]?.img || hero.photo, g[3]?.alt || '', 'dl-story-img')}<div><p class="dl-script">${esc(c.intro?.kicker || 'Nuestra historia')}</p><h2>${esc(c.intro?.title || 'Recetas de familia')}</h2><p>${esc(c.story.text)}</p></div></section>`);
  if (b.faq.length) out.push(`<section class="dl-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="dl-visit" id="dl-visita"${b.mk('visit')}><div><p class="dl-script">Te esperamos</p><h2>${esc(b.visit.title || 'Dónde estamos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<dl>${b.rows.slice(0, 5).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl><div class="dl-ctas">${b.mapsHref ? a('dl-pill', b.mapsHref, 'Cómo llegar') : ''}${b.telNum ? a('dl-pill dl-pill--line', `tel:${b.telNum}`, esc(contact.phone)) : ''}</div></div>${photo(b.visit.photo, b.visit.photoAlt || '', 'dl-visit-img')}</section>
  <footer class="dl-foot"><span class="dl-logo">${esc(b.brand.name || name)}</span><div>${b.legal()}</div></footer>`);
  out.push(`<div class="dl-sticky">${a('dl-pill dl-pill--green', order, 'Pedir')}${a('dl-pill dl-pill--green dl-pill--line2', book, 'Reservar')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
