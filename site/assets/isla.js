// Diseño «Isla» para inmobiliarias de playa y destinos (theme.style = 'isla'), basado en Sandpiper
// Realty (Bald Head Island): fotos de la costa, guías de cada zona con sus propiedades,
// y detalles de banderas náuticas de señales como separadores y viñetas. Azul mar, arena y blanco.
import { base, esc, ICON, digits } from './base.js';
const num = l => +digits(String(l.price || '').split('/')[0]) || Infinity;

export const ISLA_FONTS = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Nunito+Sans:wght@400;600;700&display=swap';
const FLAGS = '<span class="is-flags" aria-hidden="true"><i class="f1"></i><i class="f2"></i><i class="f3"></i><i class="f4"></i><i class="f5"></i></span>';

export function renderIsla(c = {}, opts = {}) {
  const b = base(c, opts, '#1F5F8B'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const zones = [...L.reduce((m, l) => { const z = String(l.zone || '').split(',')[0].trim(); if (z) m.set(z, [...(m.get(z) || []), l]); return m; }, new Map()).entries()].slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-isla.css">`,
    `<div class="cx is${b.live ? '' : ' is-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="is-top"><b class="is-logo">${esc(b.brand.name || name)}<small>${esc(b.brand.tagline || '')}</small></b>${FLAGS}<nav aria-label="Secciones">${[['is-props', 'Propiedades'], ['is-zonas', 'Guías de zona'], ['is-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('is-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="is-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'is-hero-img')}<div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('is-btn is-btn--w', '#is-props', esc(hero.cta || 'Ver propiedades'))}</div></section>`);
  out.push(`<section class="is-trust"${b.mk('trust')}>${b.trust.slice(0, 4).map((t, i) => `<div><i class="is-flag f${i + 1}" aria-hidden="true"></i><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (L.length) out.push(`<section class="is-props" id="is-props"${b.mk('services')}><div class="is-head"><h2>${esc(c.listings?.title || 'Propiedades')}</h2>${FLAGS}${b.lstFilters('is-filt')}</div><p class="is-count" data-t-count aria-live="polite"></p><div class="is-grid" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'is-img')}<div><p class="is-zone">${ICON.pin}${esc(l.zone || '')}</p><h3>${esc(l.title)}</h3><p class="is-facts">${b.lstFacts(l).map(esc).join(' · ')}</p></div><div class="is-row"><b>${esc(l.price || '')}</b>${a('is-link', b.lstHref(l), 'Me interesa →')}</div></article>`).join('')}</div></section>`);
  if (zones.length) out.push(`<section class="is-zones" id="is-zonas"><h2>Guías de zona</h2><p class="is-lede">Cómo se vive en cada zona y lo que tenemos ahí hoy.</p><div>${zones.map(([z, ls]) => `<article>${photo(ls[0].img, z, 'is-zone-img')}<div><h3>${esc(z)}</h3><p>${ls.length} ${ls.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'} · desde ${esc(ls.slice().sort((x, y) => num(x) - num(y))[0].price || '')}</p><ul>${ls.slice(0, 3).map(l => `<li>${esc(l.title)}</li>`).join('')}</ul>${a('is-link', b.waHref ? b.waMsg(`Hola, quiero saber más de ${z}`) : '', `Preguntar por ${esc(z)} →`)}</div></article>`).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="is-serv"><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map((s, i) => `<article><i class="is-flag f${(i % 5) + 1}" aria-hidden="true"></i><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="is-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>— ${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="is-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="is-foot" id="is-contacto"${b.mk('visit')}>${FLAGS}<b class="is-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="is-sticky">${a('is-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
