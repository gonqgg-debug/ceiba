// Diseño «Folleto» para desarrollos y preventas (theme.style = 'folleto'), basado en 111 West 57th St
// (Nueva York): un folleto digital de desarrollador. Capítulos con numeral romano, fotos a todo lo
// ancho, tipografía premium, cifras técnicas en tabla, la lista de unidades como una hoja de
// precios y la cita en la sala de ventas.
import { base, esc } from './base.js';

export const FOLLETO_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Questrial&display=swap';
const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export function renderFolleto(c = {}, opts = {}) {
  const b = base(c, opts, '#7A6243'), { a, photo, hero, contact, name } = b;
  const L = b.listings, g = b.gallery;
  let n = 0; const ch = t => `<p class="fo-ch"><span>${ROM[n++]}</span>${esc(t)}</p>`;
  const out = [`<link rel="stylesheet" href="/assets/t-folleto.css">`,
    `<div class="cx fo${b.live ? '' : ' fo-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="fo-top"><b class="fo-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['fo-residencias', 'Residencias'], ['fo-precios', 'Disponibilidad'], ['fo-visita', 'Sala de ventas']].map(b.navLink).join('')}</nav>${a('fo-btn', b.waHref || b.bookHref, 'Agendar visita', b.mk('cta'))}</header>`);
  out.push(`<section class="fo-cover"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'fo-cover-img')}<div><p class="fo-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1></div></section>`);
  out.push(`<section class="fo-intro">${ch('La visión')}<p class="fo-lede">${esc(hero.sub || '')}</p>${(c.stats || []).length ? `<dl>${c.stats.map(s => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}</section>`);
  if (L.length) out.push(`<section class="fo-res" id="fo-residencias"${b.mk('services')}>${ch('Residencias')}${L.slice(0, 3).map((l, i) => `<article class="fo-r${i % 2 ? ' fo-r--r' : ''}">${photo(l.img, l.title, 'fo-r-img')}<div><h2>${esc(l.title)}</h2><p>${esc(l.zone || '')}</p><p class="fo-meta">${b.lstFacts(l).map(esc).join('  ·  ')}</p></div></article>`).join('')}</section>`);
  if (L.length) out.push(`<section class="fo-sheet" id="fo-precios">${ch('Disponibilidad')}<div class="fo-table" role="table" aria-label="Unidades disponibles"><div role="row" class="fo-th"><span role="columnheader">Unidad</span><span role="columnheader">Recámaras</span><span role="columnheader">m²</span><span role="columnheader">Precio</span><span role="columnheader"><span class="t-sr">Acción</span></span></div>${L.map(l => `<div role="row"><span role="cell">${esc(l.title)}<small>${esc(l.zone || '')}</small></span><span role="cell">${esc(l.beds || '—')}</span><span role="cell">${esc(l.m2 || '—')}</span><span role="cell">${esc(l.price || 'Consultar')}</span><span role="cell">${a('fo-link', b.lstHref(l), 'Solicitar')}</span></div>`).join('')}</div>${c.listings?.note ? `<p class="fo-note">${esc(c.listings.note)}</p>` : ''}</section>`);
  if (g.length > 1) out.push(`<section class="fo-plate">${photo(g[1].img, g[1].alt || '', 'fo-plate-img')}<p>${esc(g[1].alt || '')}</p></section>`);
  out.push(`<section class="fo-team"${b.mk('team')}>${ch('El equipo')}<div><p class="fo-lede">${esc(c.team?.text || '')}</p>${(c.team?.bullets || b.trust.map(t => t.b)).length ? `<ul>${(c.team?.bullets || b.trust.map(t => t.b)).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></section>`);
  if (b.reviews.length) out.push(`<section class="fo-revs"${b.mk('reviews')}>${b.reviews.slice(0, 2).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="fo-faq">${ch('Preguntas')}${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="fo-foot" id="fo-visita"${b.mk('visit')}><h2>Sala de ventas</h2><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p>${a('fo-btn', b.waHref || b.bookHref, 'Agendar una visita privada')}<p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="fo-sticky">${a('fo-btn', b.waHref || b.bookHref, 'Agendar visita')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
