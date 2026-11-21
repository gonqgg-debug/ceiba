// Diseño «Cabaña» para cabañas, casas de campo y casas de arquitecto (theme.style = 'cabana'), basado
// en Hutstuf (Bélgica): paleta de madera y bosque, navegación mínima, el título «Nuestras casas»
// en vertical junto a una fila de casas que se desliza, y la ubicación con un título grande.
import { base, esc, ICON } from './base.js';

export const CABANA_FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&family=Libre+Franklin:wght@300;400;500&display=swap';

export function renderCabana(c = {}, opts = {}) {
  const b = base(c, opts, '#8B5E3C'), { a, photo, hero, contact, name } = b;
  const L = b.listings, g = b.gallery;
  const area = String(contact.address || '').split(',').slice(-2, -1)[0]?.trim() || '';
  const out = [`<link rel="stylesheet" href="/assets/t-cabana.css">`,
    `<div class="cx cb${b.live ? '' : ' cb-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="cb-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'cb-hero-img')}<header class="cb-top"><b class="cb-logo">${esc(b.brand.name || name)}</b>${a('cb-btn cb-btn--w', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header><div class="cb-hero-in"><h1>${esc(hero.title)}</h1>${a('cb-btn', '#cb-casas', esc(hero.cta || 'Ver propiedades'))}</div></section>`);
  out.push(`<section class="cb-intro"><p><b>${esc(hero.sub || '')}</b> ${esc(c.team?.text || '')}</p></section>`);
  if (L.length) out.push(`<section class="cb-row" id="cb-casas"${b.mk('services')}><h2 class="cb-vert">${esc(c.listings?.title || 'Nuestras casas')}</h2><div class="cb-track">${L.map(l => `<article>${photo(l.img, l.title, 'cb-img')}<div class="cb-meta"><h3>${esc(l.title)}</h3><span>${esc(l.price || '')}</span></div><p>${esc(l.zone || '')} · ${b.lstFacts(l).slice(0, 3).map(esc).join(' · ')}</p>${a('cb-link', b.lstHref(l), `Me interesa ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  out.push(`<section class="cb-loc"><div class="cb-loc-t"><p>Nuestra zona</p><h2>${esc(area || name)}</h2></div><div class="cb-loc-c"><p>${esc(c.listings?.sub || hero.sub || '')}</p><ul>${b.trust.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b> ${esc(t.t)}</li>`).join('')}</ul></div><div class="cb-strip">${g.slice(0, 4).map(x => photo(x.img, x.alt || '', 'cb-s')).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="cb-serv">${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('cb-link', b.serviceHref(s), `Hablar de esto ${ICON.arrow('')}`)}</article>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="cb-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="cb-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="cb-foot" id="cb-contacto"${b.mk('visit')}><b class="cb-logo">${esc(b.brand.name || name)}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="cb-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="cb-sticky">${a('cb-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
