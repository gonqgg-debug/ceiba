// Diseño «Fantasía» para restaurantes de autor (theme.style = 'fantasia'), basado en The Fat Duck:
// papel con textura, manchas de acuarela de colores, título en versalitas muy espaciadas,
// la carta como lista de «experiencias» con «Ver más →», fotos sueltas como recortes y
// un botón negro discreto para reservar.
import { base, esc, ICON } from './base.js';

export const FANTASIA_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@400;500&family=Cormorant:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap';
const BLOBS = [['#7EC8C8', 6, 14, 5], ['#F2B66D', 88, 22, 3.6], ['#9FC0E6', 12, 62, 4.2], ['#E7A3B7', 82, 70, 3], ['#B9D98A', 46, 90, 3.4], ['#7EC8C8', 94, 46, 2.2]];

export function renderFantasia(c = {}, opts = {}) {
  const b = base(c, opts, '#C0392B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 6);
  const book = b.waNum ? b.waMsg(`Hola, quiero reservar en ${name}`) : b.bookHref;
  const out = [`<link rel="stylesheet" href="/assets/t-fantasia.css">`,
    `<div class="cx ft${b.live ? '' : ' ft-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<div class="ft-blobs" aria-hidden="true">${BLOBS.map(([col, x, y, s], i) => `<i style="--c:${col};--x:${x}%;--y:${y}%;--s:${s}rem;--i:${i}"></i>`).join('')}</div>`);
  out.push(`<header class="ft-top"><span>${esc(contact.address ? String(contact.address).split(',').slice(0, 2).join(',') : '')}</span><b class="ft-logo">${esc(b.brand.name || name)}</b>${a('ft-btn', book, 'Reservar', b.mk('cta'))}</header>`);
  out.push(`<section class="ft-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'ft-hero-img')}<div><p>${esc(hero.sub || '')}</p>${a('ft-btn ft-btn--light', book, esc(b.ctaTop))}</div></section>`);
  out.push(`<section class="ft-intro"><p class="ft-kick"><em>Descubre un mundo de</em></p><h1>${esc(hero.title)}</h1>${c.story?.text ? `<p class="ft-lede">${esc(c.story.text)}</p>` : ''}${c.statement ? `<p class="ft-lede">${esc(c.statement)}</p>` : ''}</section>`);
  if (menu.length) out.push(`<section class="ft-menu" id="ft-carta"${b.mk('services')}><p class="ft-kick"><em>${esc(c.menu?.title || 'La carta')}</em></p><ul>${menu.map(m => `<li><details><summary><span>${esc(m.name)}</span><small>Ver más ${ICON.arrow('ft-arr')}</small></summary><ul>${m.items.map(i => `<li><b>${esc(i.name)}</b>${i.desc ? `<span>${esc(i.desc)}</span>` : ''}<em>${esc(i.price || '')}</em></li>`).join('')}</ul></details></li>`).join('')}</ul></section>`);
  if (g.length >= 2) out.push(`<section class="ft-clips">${g.slice(0, 4).map((x, i) => `<figure style="--r:${[-3, 2, -1.5, 3][i]}deg">${photo(x.img, x.alt, 'ft-clip-img')}<figcaption><em>${esc(x.alt || '')}</em></figcaption></figure>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="ft-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ft-faq"><p class="ft-kick"><em>Antes de tu visita</em></p>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ft-visit" id="ft-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Visítanos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 5).map(r => `<p><em>${esc(r.dt)}</em> · ${esc(r.dd)}</p>`).join('')}<div class="ft-ctas">${a('ft-btn', book, esc(b.ctaTop))}${b.mapsHref ? a('ft-link', b.mapsHref, `Cómo llegar ${ICON.arrow('ft-arr')}`) : ''}</div></section>
  <footer class="ft-foot"><b class="ft-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ft-sticky">${a('ft-btn', book, esc(b.ctaTop))}${b.telNum ? a('ft-btn ft-btn--light', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
