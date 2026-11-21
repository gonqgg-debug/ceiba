// Diseño «Valúa» para inmobiliarias que buscan captar vendedores (theme.style = 'valua'), basado en
// Joyce Rey: el formulario «¿Cuánto vale tu casa?» aparece en todas las secciones (en la portada,
// en una franja intermedia y en una barra fija), gris y negro con serif elegante, propiedades en
// tarjetas altas con degradado y estilos de vida por zona.
import { base, esc, ICON } from './base.js';

export const VALUA_FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@300;400;500&display=swap';

export function renderValua(c = {}, opts = {}) {
  const b = base(c, opts, '#1A1A1A'), { a, photo, hero, contact, name } = b;
  const L = b.listings.slice(0, 6);
  const zones = [...new Map(b.listings.map(l => [String(l.zone || '').split(',')[0].trim(), l])).entries()].filter(([z]) => z).slice(0, 8);
  const out = [`<link rel="stylesheet" href="/assets/t-valua.css">`,
    `<div class="cx va${b.live ? '' : ' va-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="va-top"><b class="va-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><nav aria-label="Secciones">${[['va-props', 'Propiedades'], ['va-valuar', 'Vender'], ['va-zonas', 'Zonas'], ['va-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('va-btn', '#va-valuar', '¿Cuánto vale tu casa?', b.mk('cta'))}</header>`);
  out.push(`<section class="va-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'va-hero-img')}<div class="va-hero-in"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div><div class="va-card"><h2>¿Cuánto vale tu casa?</h2><p>Valuación gratis en 24 horas, sin compromiso.</p>${b.valueForm('va-val')}</div></section>`);
  if (L.length) out.push(`<section class="va-props" id="va-props"${b.mk('services')}><div class="va-head"><h2>Casas <i>|</i> que inspiran</h2><p>${esc(c.listings?.sub || '')}</p></div><div class="va-grid">${L.map(l => `<a class="va-tile" ${b.live && b.lstHref(l) ? `href="${esc(b.lstHref(l))}" target="_blank" rel="noopener"` : ''}>${photo(l.img, l.title, 'va-tile-img')}<span class="va-tile-in"><small>${esc(l.op === 'renta' ? 'En renta' : 'En venta')}</small><b>${esc(l.title)}</b><span>${esc(l.zone || '')}</span><span class="va-price">${esc(l.price || '')}</span></span></a>`).join('')}</div></section>`);
  out.push(`<section class="va-band" id="va-valuar"><div><h2>¿Vas a vender?</h2><p>${esc(b.services.find(s => /vend/i.test(s.name))?.desc || 'Valuamos tu propiedad sin costo y te decimos en cuánto se vende hoy en tu zona.')}</p>${b.steps.length ? `<ol>${b.steps.map(s => `<li><b>${esc(s.t)}</b><span>${esc(s.d || '')}</span></li>`).join('')}</ol>` : ''}</div>${b.valueForm('va-val va-val--band')}</section>`);
  if ((c.stats || []).length || b.rating) out.push(`<section class="va-acc"${b.mk('trust')}><div><p class="va-kick">Reconocimientos</p><h2>Lo que nos respalda</h2><dl>${(c.stats || []).map(s => `<div><dd>${esc(s.value)}</dd><dt>${esc(s.label)}</dt></div>`).join('')}</dl>${b.reviews[0] ? `<blockquote>“${esc(b.reviews[0].text)}” <cite>${esc(b.reviews[0].name)}</cite></blockquote>` : ''}</div></section>`);
  if (zones.length) out.push(`<section class="va-zones" id="va-zonas"><h2>Estilos de vida <i>en</i> ${esc(String(contact.address || '').split(',').slice(-2, -1)[0]?.trim() || 'la ciudad')}</h2><div>${zones.map(([z, l]) => `<a class="va-z" ${b.live && b.waHref ? `href="${esc(b.waMsg(`Hola, busco en ${z}`))}" target="_blank" rel="noopener"` : ''}>${photo(l.img, '', 'va-z-img')}<span>${esc(z.toUpperCase())}</span></a>`).join('')}</div></section>`);
  if (c.team) out.push(`<section class="va-team"${b.mk('team')}><div><h2>${esc(c.team.title || 'Quiénes somos')}</h2><p>${esc(c.team.text || '')}</p>${(c.team.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>${photo(c.team.photo, c.team.photoAlt || '', 'va-team-img')}</section>`);
  if (b.faq.length) out.push(`<section class="va-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="va-foot" id="va-contacto"${b.mk('visit')}><div><h2>Contáctanos</h2><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><p class="va-sign">${esc(b.brand.name || name)}</p><div class="va-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="va-sticky">${a('va-btn', '#va-valuar', 'Valuar mi casa')}${a('va-btn va-btn--line', b.waHref, 'WhatsApp')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
