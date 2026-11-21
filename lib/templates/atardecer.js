// Diseño «Atardecer» para inmobiliarias de costa y casas vacacionales (theme.style = 'atardecer'),
// basado en Costa Sunsets (Costa Rica): muy visual y ligero (sin librerías, carga rápida), con
// degradado de atardecer, y la búsqueda como una frase que completas («Quiero comprar con 3
// recámaras») que filtra las propiedades al momento.
import { base, esc, ICON } from './base.js';

export const ATARDECER_FONTS = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

export function renderAtardecer(c = {}, opts = {}) {
  const b = base(c, opts, '#E0613A'), { a, photo, hero, contact, name } = b;
  const L = b.listings, g = b.gallery;
  const out = [`<link rel="stylesheet" href="/assets/t-atardecer.css">`,
    `<div class="cx at${b.live ? '' : ' at-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="at-top"><b class="at-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['at-props', 'Propiedades'], ['at-vida', 'La vida aquí'], ['at-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('at-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="at-hero"${b.mk('hero')}><div class="at-sun" aria-hidden="true"></div><h1>${esc(hero.title)}</h1><form class="t-filt at-say" data-t-filt onsubmit="return false"><span>Quiero</span><label><span class="t-sr">Operación</span><select name="op"><option value="">comprar o rentar</option><option value="venta">comprar</option><option value="renta">rentar</option></select></label><span>con</span><label><span class="t-sr">Recámaras</span><select name="beds"><option value="">las recámaras que sean</option>${[1, 2, 3, 4].map(n => `<option value="${n}">${n} recámara${n > 1 ? 's' : ''} o más</option>`).join('')}</select></label></form><p class="at-count" data-t-count aria-live="polite"></p>${photo(hero.photo, hero.photoAlt || name, 'at-hero-img')}</section>`);
  if (L.length) out.push(`<section class="at-props" id="at-props"${b.mk('services')}><div class="at-grid" data-t-list>${L.map((l, i) => `<article class="${i % 5 === 0 ? 'at-wide' : ''}"${b.lstAttrs(l)}>${photo(l.img, l.title, 'at-img')}<div><p class="at-zone">${esc(l.zone || '')}</p><h3>${esc(l.title)}</h3><p class="at-facts">${b.lstFacts(l).map(esc).join(' · ')}</p><div class="at-row"><b>${esc(l.price || '')}</b>${a('at-link', b.lstHref(l), `Me interesa ${ICON.arrow('')}`)}</div></div></article>`).join('')}</div></section>`);
  out.push(`<section class="at-life" id="at-vida"><div><h2>${esc(c.life?.title || 'La vida aquí')}</h2><p>${esc(hero.sub || '')}</p><ul>${b.trust.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b> ${esc(t.t)}</li>`).join('')}</ul></div><div class="at-pics">${g.slice(0, 3).map(x => photo(x.img, x.alt || '', 'at-pic')).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="at-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="at-serv"><h2>${esc(c.services?.title || 'Cómo te ayudamos')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></article>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="at-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="at-foot" id="at-contacto"${b.mk('visit')}><h2>¿Hablamos?</h2>${a('at-btn at-btn--w', b.waHref || b.bookHref, esc(hero.ctaWhatsapp || b.ctaTop))}<p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="at-sticky">${a('at-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
