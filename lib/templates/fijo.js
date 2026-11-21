// Diseño «Fijo» para restaurantes (theme.style = 'fijo'), basado en Bresca: barra de información
// arriba (horario y dirección), una foto que se queda fija al fondo mientras los bloques de
// contenido en azul marino y ocre pasan encima, y un scroll tranquilo. Una foto de plato al
// centro con flechas, horario centrado y «nuestra historia» en un recuadro ocre.
import { base, esc } from './base.js';

export const FIJO_FONTS = 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=Libre+Baskerville:ital@0;1&display=swap';

export function renderFijo(c = {}, opts = {}) {
  const b = base(c, opts, '#E1A224'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const book = b.waNum ? b.waMsg(`Hola, quiero reservar en ${name}`) : b.bookHref;
  const bg = (g[0]?.img || hero.photo || '').replace(/'/g, '%27');
  const out = [`<link rel="stylesheet" href="/assets/t-fijo.css">`,
    `<div class="cx fj${b.live ? '' : ' fj-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<p class="fj-info">${[contact.address, b.rows[0] && `${b.rows[0].dt} ${b.rows[0].dd}`, contact.phone].filter(Boolean).map(esc).join('  ·  ')}</p>
  <header class="fj-top"><b class="fj-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[menu.length && ['fj-carta', 'Carta'], ['fj-historia', 'Historia'], ['fj-visita', 'Visítanos']].filter(Boolean).map(b.navLink).join('')}</nav>${a('fj-btn', book, 'Reservaciones', b.mk('cta'))}</header>`);
  // Fondo fijo: la foto se queda y el contenido pasa encima
  out.push(`<div class="fj-stage"><div class="fj-fixed" role="img" aria-label="${esc(g[0]?.alt || hero.photoAlt || name)}" style="background-image:url('${bg}')"></div>
    <section class="fj-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}${a('fj-btn fj-btn--light', book, esc(b.ctaTop))}</section>
    <section class="fj-block fj-block--navy"><h2>Horario</h2>${b.rows.slice(0, 6).map(r => `<p>${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}</section>
    ${menu.length ? `<section class="fj-block fj-block--paper" id="fj-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div class="fj-menu">${menu.map(m => `<div><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(i => `<p><span>${esc(i.name)}</span><em>${esc(i.price || '')}</em>${i.desc ? `<small>${esc(i.desc)}</small>` : ''}</p>`).join('')}</div>`).join('')}</div></section>` : ''}
    <div class="fj-gap" aria-hidden="true"></div>
    <section class="fj-block fj-block--navy fj-story" id="fj-historia"><div><h2>Nuestra historia</h2>${c.story?.text ? `<p>${esc(c.story.text)}</p>` : ''}${a('fj-btn', book, esc(b.ctaTop))}</div><figure>${photo(g[1]?.img || hero.photo, g[1]?.alt || '', 'fj-story-img')}</figure></section>
    <div class="fj-gap" aria-hidden="true"></div></div>`);
  if (b.reviews.length) out.push(`<section class="fj-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="fj-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="fj-visit" id="fj-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Visítanos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<div class="fj-ctas">${a('fj-btn', book, esc(b.ctaTop))}${b.mapsHref ? a('fj-btn fj-btn--line', b.mapsHref, 'Cómo llegar') : ''}</div></section>
  <footer class="fj-foot">${b.legal()}</footer>`);
  out.push(`<div class="fj-sticky">${a('fj-btn', book, esc(b.ctaTop))}${b.telNum ? a('fj-btn fj-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
