// Diseño «Mapa» para inmobiliarias con muchas propiedades en la ciudad (theme.style = 'mapa'), basado
// en Redfin: el mapa y la lista lado a lado. Los filtros actualizan la lista sin recargar, y
// «Ver en el mapa» mueve el mapa a la zona de esa propiedad. Interfaz limpia de producto, rojo
// de acento.
import { base, esc, ICON } from './base.js';

export const MAPA_FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

export function renderMapa(c = {}, opts = {}) {
  const b = base(c, opts, '#C82021'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const embed = q => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  const first = L[0]?.zone || contact.address || '';
  const out = [`<link rel="stylesheet" href="/assets/t-mapa.css">`,
    `<div class="cx mp${b.live ? '' : ' mp-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="mp-top"><b class="mp-logo">${esc(b.brand.name || name)}</b><p class="mp-tag">${esc(hero.title)}</p>${a('mp-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="mp-app"${b.mk('services')}><div class="mp-side"><div class="mp-bar"${b.mk('hero')}>${b.lstFilters('mp-filt')}<p data-t-count aria-live="polite"></p></div><div class="mp-list" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'mp-img')}<div><p class="mp-price">${esc(l.price || '')}</p><p class="mp-facts">${b.lstFacts(l).map(x => `<span>${esc(x)}</span>`).join('')}</p><h3>${esc(l.title)}</h3><p class="mp-zone">${esc(l.zone || '')}</p><div class="mp-acts">${b.live && l.zone ? `<a class="mp-link" href="${esc(embed(l.zone))}" target="mp-map">${ICON.pin} Ver en el mapa</a>` : `<span class="mp-link">${ICON.pin} Ver en el mapa</span>`}${a('mp-btn mp-btn--sm', b.lstHref(l), 'Me interesa')}</div></div><span class="mp-op">${esc(l.op === 'renta' ? 'Renta' : 'Venta')}</span></article>`).join('')}</div>${c.listings?.note ? `<p class="mp-note">${esc(c.listings.note)}</p>` : ''}</div>
    <div class="mp-map">${b.live && first ? `<iframe name="mp-map" title="Mapa de las propiedades" src="${esc(embed(first))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<div class="mp-map-ph" aria-hidden="true">${L.slice(0, 6).map((l, i) => `<span style="left:${18 + (i * 37) % 64}%;top:${20 + (i * 23) % 60}%">${esc(String(l.price || '').split(' ')[0])}</span>`).join('')}</div>`}</div></section>`);
  out.push(`<section class="mp-why"${b.mk('trust')}>${b.trust.slice(0, 4).map(t => `<div>${ICON.check}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="mp-serv"><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('mp-link', b.serviceHref(s), `Empezar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="mp-revs"${b.mk('reviews')}><h2>${b.rating ? `${esc(b.rating.value)} ★ en ${esc(b.rating.source || 'Google')}` : 'Opiniones'}</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="mp-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="mp-foot" id="mp-contacto"${b.mk('visit')}><b class="mp-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="mp-sticky">${a('mp-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
