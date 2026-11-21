// Diseño «Brisa» para inmobiliarias de costa y zonas residenciales (theme.style = 'brisa'), basado en
// The Malibu Life: tipografía grande en mayúsculas espaciadas, verde y crema, el precio primero en
// cada propiedad, mosaicos de colonias, y botones para agrandar el texto y escuchar la página
// en voz alta.
import { base, esc, ICON } from './base.js';

export const BRISA_FONTS = 'https://fonts.googleapis.com/css2?family=Italiana&family=Archivo:wght@400;500;600&display=swap';

export function renderBrisa(c = {}, opts = {}) {
  const b = base(c, opts, '#2E6B4A'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const zones = [...new Map(L.map(l => [String(l.zone || '').split(',')[0].trim(), l])).entries()].filter(([z]) => z).slice(0, 6);
  const out = [`<link rel="stylesheet" href="/assets/t-brisa.css">`,
    `<div class="cx bz${b.live ? '' : ' bz-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="bz-top"><nav aria-label="Secciones">${[['bz-props', 'Propiedades'], ['bz-zonas', 'Colonias'], ['bz-contacto', 'Contacto']].map(b.navLink).join('')}</nav><div class="bz-a11y"><button type="button" data-t-zoom aria-pressed="false" aria-label="Agrandar el texto">A+</button><button type="button" data-t-read aria-pressed="false" aria-label="Escuchar la página">${ICON.play}</button></div>${a('bz-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="bz-hero"${b.mk('hero')}><p class="bz-logo"><i>the</i>${esc(String(b.brand.name || name).toUpperCase())}<span>${esc(b.brand.tagline || '')}</span></p>${photo(hero.photo, hero.photoAlt || name, 'bz-hero-img')}<h1>${esc(hero.title)}</h1><p class="bz-sub">${esc(hero.sub || '')}</p></section>`);
  if (L.length) out.push(`<section class="bz-props" id="bz-props"${b.mk('services')}><h2>${esc(c.listings?.title || 'Propiedades')}</h2><div class="bz-bar">${b.lstFilters('bz-filt')}<p data-t-count aria-live="polite"></p></div><div class="bz-list" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'bz-img')}<p class="bz-price">${esc(l.price || '')}</p><h3>${esc(l.title)}</h3><p>${esc(l.zone || '')}</p><p class="bz-facts">${b.lstFacts(l).map(esc).join(' · ')}</p>${a('bz-link', b.lstHref(l), `Me interesa ${ICON.arrow('')}`)}<span class="bz-flag">${esc(l.op === 'renta' ? 'En renta' : 'En venta')}</span></article>`).join('')}</div></section>`);
  if (zones.length) out.push(`<section class="bz-zones" id="bz-zonas"><h2>Colonias</h2><div>${zones.map(([z, l]) => `<a class="bz-zone" ${b.live ? `href="${esc(b.waHref ? b.waMsg(`Hola, busco algo en ${z}`) : '#bz-props')}"` : ''}>${photo(l.img, '', 'bz-zone-img')}<span>${esc(z.toUpperCase())}</span></a>`).join('')}</div></section>`);
  out.push(`<section class="bz-about"${b.mk('team')}><div><h2>${esc(c.team?.title || name)}</h2><p>${esc(c.team?.text || hero.sub || '')}</p>${(c.team?.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>${(c.stats || []).length ? `<dl>${c.stats.map(s => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}</section>`);
  if (b.reviews.length) out.push(`<section class="bz-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(`<section class="bz-ask"><div><h2>¿Vas a comprar una casa?</h2><p>Cuéntanos qué buscas y te mandamos opciones por WhatsApp, incluidas las que aún no publicamos.</p>${a('bz-btn', b.waHref || b.bookHref, esc(hero.ctaWhatsapp || 'Escribir por WhatsApp'))}</div></section>`);
  if (b.faq.length) out.push(`<section class="bz-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="bz-foot" id="bz-contacto"${b.mk('visit')}><p class="bz-logo"><i>the</i>${esc(String(b.brand.name || name).toUpperCase())}</p><div><p><b>Oficina</b><br>${esc(contact.address || '')}</p><p><b>Horario</b><br>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p><b>Contacto</b><br>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="bz-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="bz-sticky">${a('bz-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
