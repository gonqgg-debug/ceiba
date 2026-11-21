// Diseño «Fiesta» para bares y lugares de fiesta (theme.style = 'fiesta'), basado en Simmons Bar:
// retro y maximalista. Fondo morado con brillo neón, una figura que sigue al cursor, una
// televisión vieja que enmarca la foto del lugar, letras como fichas de juego de palabras para
// «Encuentra tu sucursal» y fondos de papel tapiz con estampado.
import { base, esc } from './base.js';

export const FIESTA_FONTS = 'https://fonts.googleapis.com/css2?family=Monoton&family=Bowlby+One&family=Space+Grotesk:wght@400;500;700&display=swap';

export function renderFiesta(c = {}, opts = {}) {
  const b = base(c, opts, '#FF3EA5'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const ask = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const tiles = String(b.brand.name || name).toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ ]/g, '').slice(0, 12).split('');
  const out = [`<link rel="stylesheet" href="/assets/t-fiesta.css">`,
    `<div class="cx fs${b.live ? '' : ' fs-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}" data-t-follow>`];
  out.push(`<span class="fs-follow" aria-hidden="true">✦</span>`);
  out.push(`<header class="fs-top"><b class="fs-logo">${esc(b.brand.name || name)}</b>${a('fs-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar', b.mk('cta'))}</header>`);
  out.push(`<section class="fs-hero"${b.mk('hero')}><h1><span>${esc(hero.title)}</span></h1>${hero.sub ? `<p class="fs-note">${esc(hero.sub)}</p>` : ''}<div class="fs-ctas">${a('fs-btn fs-btn--big', ask(`Hola, quiero reservar en ${name}`), 'Reservar mesa')}${a('fs-btn fs-btn--big fs-btn--y', ask(`Hola, quiero información de eventos en ${name}`), 'Fiestas y grupos')}</div></section>`);
  out.push(`<section class="fs-tv-wrap"><div class="fs-tv"><div class="fs-screen">${photo(g[3]?.img || hero.photo, g[3]?.alt || '', 'fs-screen-img')}</div><div class="fs-knobs" aria-hidden="true"><i></i><i></i><b></b></div><span class="fs-ant" aria-hidden="true"></span></div><p class="fs-cap">${esc(c.statement || c.intro?.title || '')}</p></section>`);
  out.push(`<section class="fs-find" id="fs-visita"${b.mk('visit')}><div class="fs-tiles" aria-label="${esc(b.brand.name || name)}">${tiles.map((t, i) => (t === ' ' ? '<i class="fs-gap"></i>' : `<span style="--r:${(i % 3) - 1}deg"><b>${esc(t)}</b><small>${(t.charCodeAt(0) % 9) + 1}</small></span>`)).join('')}</div>
    <div class="fs-find-card">${photo(b.visit.photo, b.visit.photoAlt || '', 'fs-find-img')}<div><h2>Encuéntranos</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 4).map(r => `<p>${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('fs-btn fs-btn--y', b.mapsHref, 'Cómo llegar') : ''}</div></div></section>`);
  if (menu.length) out.push(`<section class="fs-menu" id="fs-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map(m => `<div><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(x => `<p><span>${esc(x.name)}</span><b>${esc(x.price || '')}</b></p>`).join('')}</div>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="fs-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map((r, i) => `<figure style="--r:${[-4, 3, -2][i]}deg">${photo(g[i]?.img, '', 'fs-pol-img')}<figcaption>“${esc(r.text)}” <b>— ${esc(r.name)}</b></figcaption></figure>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="fs-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="fs-foot"><b class="fs-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="fs-sticky">${a('fs-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar')}${b.telNum ? a('fs-btn fs-btn--y', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
