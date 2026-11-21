// Diseño «Lujo» para inmobiliarias de propiedades exclusivas (theme.style = 'lujo'), basado en The
// Oppenheim Group: negro con rojo, letra condensada en mayúsculas, hero con la lista de zonas a un
// lado, propiedades destacadas en mosaico (una grande y varias chicas), etiquetas verticales
// en el borde de cada sección y cifras grandes de «por qué con nosotros».
import { base, esc, ICON } from './base.js';

export const LUJO_FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@400;500&display=swap';

export function renderLujo(c = {}, opts = {}) {
  const b = base(c, opts, '#C8102E'), { a, photo, hero, contact, name } = b;
  const L = b.listings.slice(0, 5);
  const zones = [...new Set(b.listings.map(l => String(l.zone || '').split(',')[0].trim()).filter(Boolean))].slice(0, 5);
  const side = t => `<p class="lj-side" aria-hidden="true">${esc(t)}</p>`;
  const out = [`<link rel="stylesheet" href="/assets/t-lujo.css">`,
    `<div class="cx lj${b.live ? '' : ' lj-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="lj-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'lj-hero-img')}<header class="lj-top"><b class="lj-logo">${esc(String(b.brand.name || name).toUpperCase())}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['lj-props', 'Propiedades'], ['lj-por-que', 'Nosotros'], ['lj-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('lj-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <div class="lj-hero-in"><h1>${esc(hero.title)}</h1><ul>${zones.map(z => `<li>${esc(z.toUpperCase())}</li>`).join('')}</ul></div></section>`);
  if (L.length) out.push(`<section class="lj-props" id="lj-props"${b.mk('services')}>${side('Propiedades')}<div class="lj-head"><h2><span>Destacadas</span> Propiedades</h2>${a('lj-btn', b.waHref, 'Ver todas')}</div><div class="lj-mosaic">${L.map((l, i) => `<a class="lj-tile${i ? '' : ' lj-tile--big'}" ${b.live && b.lstHref(l) ? `href="${esc(b.lstHref(l))}" target="_blank" rel="noopener"` : ''}>${photo(l.img, l.title, 'lj-tile-img')}<span class="lj-tile-in"><b>${esc(l.price || '')}</b><span>${esc(l.title)} · ${esc(String(l.zone || '').split(',')[0])}</span><small>${b.lstFacts(l).map(esc).join(' · ')}</small></span></a>`).join('')}</div></section>`);
  if ((c.stats || []).length) out.push(`<section class="lj-why" id="lj-por-que"${b.mk('trust')}><div class="lj-nums">${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div><p class="lj-why-t" aria-hidden="true">Por qué<br>con nosotros</p></section>`);
  if (c.team) out.push(`<section class="lj-team"${b.mk('team')}>${photo(c.team.photo, c.team.photoAlt || '', 'lj-team-img')}<div><h2>${esc(c.team.title || 'El equipo')}</h2><p>${esc(c.team.text || '')}</p>${(c.team.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${a('lj-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div></section>`);
  if (b.services.length) out.push(`<section class="lj-serv">${side('Servicio')}<div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('lj-link', b.serviceHref(s), `Hablemos ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="lj-revs"${b.mk('reviews')}>${side('Clientes')}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="lj-faq"><h2>Preguntas frecuentes</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="lj-foot" id="lj-contacto"${b.mk('visit')}><h2>Contáctanos</h2><div><p><b>Oficina</b>${esc(contact.address || '')}</p><p><b>Horario</b>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p><b>Teléfono</b>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="lj-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="lj-sticky">${a('lj-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
