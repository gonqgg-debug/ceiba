// Diseño «Torre» para desarrollos y edificios (theme.style = 'torre'), basado en Zorge 9 (Moscú): el
// edificio dibujado al centro, piso por piso. Al pasar o tocar un piso se ilumina y lleva a la
// ficha de esa unidad, con su orientación y luz si se conocen. Gris carbón y latón.
// (Zorge 9 usa un modelo 3D; aquí es un dibujo ligero en CSS que funciona en cualquier teléfono.)
import { base, esc, ICON } from './base.js';

export const TORRE_FONTS = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap';

export function renderTorre(c = {}, opts = {}) {
  const b = base(c, opts, '#C9A86A'), { a, photo, hero, contact, name } = b;
  const U = b.listings.slice(0, 8);
  const lvl = (l, i) => l.floor || U.length - i;
  const out = [`<link rel="stylesheet" href="/assets/t-torre.css">`,
    `<div class="cx tr${b.live ? '' : ' tr-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="tr-top"><b class="tr-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><nav aria-label="Secciones">${[['tr-edificio', 'Unidades'], ['tr-proyecto', 'El proyecto'], ['tr-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('tr-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="tr-hero"${b.mk('hero')}><div><p class="tr-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div>${photo(hero.photo, hero.photoAlt || name, 'tr-hero-img')}</section>`);
  if (U.length) out.push(`<section class="tr-build" id="tr-edificio"${b.mk('services')}><div class="tr-tower" role="list" aria-label="Pisos del edificio">${U.map((l, i) => `<div role="listitem">${a('tr-floor', `#tr-u${i}`, `<span>Nivel ${esc(lvl(l, i))}</span><b>${esc(l.title)}</b><em>${esc(l.price || '')}</em>`)}</div>`).join('')}<span class="tr-base" aria-hidden="true"></span></div>
    <div class="tr-units">${U.map((l, i) => `<article id="tr-u${i}">${photo(l.img, l.title, 'tr-img')}<div><p class="tr-kick">Nivel ${esc(lvl(l, i))} · ${esc(l.op === 'renta' ? 'Renta' : 'Venta')}</p><h3>${esc(l.title)}</h3><p class="tr-facts">${b.lstFacts(l).map(x => `<span>${esc(x)}</span>`).join('')}</p>${l.orientation ? `<p class="tr-sun">☀ ${esc(l.orientation)}</p>` : ''}<div class="tr-row"><b>${esc(l.price || '')}</b>${a('tr-btn tr-btn--sm', b.lstHref(l), 'Me interesa')}</div></div></article>`).join('')}</div></section>`);
  out.push(`<section class="tr-proj" id="tr-proyecto"${b.mk('trust')}><h2>${esc(c.project?.title || 'El proyecto')}</h2><div class="tr-specs">${(c.stats || []).map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div><ul>${b.trust.map(t => `<li>${ICON.check}<span><b>${esc(t.b)}</b> ${esc(t.t)}</span></li>`).join('')}</ul></section>`);
  if (b.steps.length) out.push(`<section class="tr-steps"><h2>${esc(c.process?.title || 'Cómo comprar')}</h2><ol>${b.steps.map(s => `<li><b>${esc(s.t)}</b><span>${esc(s.d || '')}</span></li>`).join('')}</ol></section>`);
  if (b.reviews.length) out.push(`<section class="tr-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="tr-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="tr-foot" id="tr-contacto"${b.mk('visit')}><div><h2>Sala de ventas</h2><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div>${a('tr-btn', b.waHref || b.bookHref, esc(b.ctaTop))}${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}</div><div class="tr-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="tr-sticky">${a('tr-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
