// Diseño «Local» para inmobiliarias independientes de su ciudad (theme.style = 'local'), basado en
// Dwelling in Maine: marca verde bosque y el mensaje «somos de aquí» frente a las franquicias.
// Un sello circular con el nombre de la ciudad, una franja que compara «nosotros» con «una
// franquicia», propiedades en tarjetas sobrias y el equipo con nombre.
import { base, esc, ICON } from './base.js';

export const LOCAL_FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Karla:wght@400;500;700&display=swap';

export function renderLocal(c = {}, opts = {}) {
  const b = base(c, opts, '#25483A'), { a, photo, hero, contact, name } = b;
  const L = b.listings, city = String(contact.address || '').split(',').slice(-2, -1)[0]?.trim() || '';
  const seal = `<svg class="lo-seal" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="lo-c" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><circle cx="60" cy="60" r="58"/><text><textPath href="#lo-c">· DE ${esc(city.toUpperCase() || 'AQUÍ')} · DESDE SIEMPRE · INDEPENDIENTES </textPath></text><path d="M60 38l14 24H46Zm0 12 10 18H50Z"/></svg>`;
  const out = [`<link rel="stylesheet" href="/assets/t-local.css">`,
    `<div class="cx lo${b.live ? '' : ' lo-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="lo-top"><b class="lo-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['lo-props', 'Propiedades'], ['lo-vender', 'Vender'], ['lo-equipo', 'Equipo']].map(b.navLink).join('')}</nav>${a('lo-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="lo-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'lo-hero-img')}<div class="lo-card">${seal}<h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('lo-btn', '#lo-props', esc(hero.cta || 'Ver propiedades'))}</div></section>`);
  out.push(`<section class="lo-vs"${b.mk('trust')}><h2>Una inmobiliaria ${city ? `de ${esc(city)}` : 'de aquí'}, no una franquicia</h2><div><ul class="lo-us"><li><b>Nosotros</b></li>${b.trust.slice(0, 4).map(t => `<li>${ICON.check}<span><b>${esc(t.b)}</b> ${esc(t.t)}</span></li>`).join('')}</ul><ul class="lo-them"><li><b>Una franquicia</b></li><li>Un asesor distinto cada vez</li><li>Decisiones desde otra ciudad</li><li>Te pasan con el call center</li><li>Te enseñan lo que hay en el sistema</li></ul></div></section>`);
  if (L.length) out.push(`<section class="lo-props" id="lo-props"${b.mk('services')}><div class="lo-head"><h2>${esc(c.listings?.title || 'Propiedades')}</h2>${b.lstFilters('lo-filt')}</div><p class="lo-count" data-t-count aria-live="polite"></p><div class="lo-grid" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'lo-img')}<div><p class="lo-tag">${esc(l.op || '')}</p><h3>${esc(l.title)}</h3><p>${esc(l.zone || '')}</p><p class="lo-facts">${b.lstFacts(l).map(esc).join(' · ')}</p></div><div class="lo-row"><b>${esc(l.price || '')}</b>${a('lo-btn lo-btn--sm', b.lstHref(l), 'Me interesa')}</div></article>`).join('')}</div></section>`);
  const sell = b.services.find(s => /vend/i.test(s.name)) || b.services[0];
  if (sell) out.push(`<section class="lo-sell" id="lo-vender"><div><h2>${esc(sell.name)} con gente de aquí</h2><p>${esc(sell.desc || '')}</p>${b.steps.length ? `<ol>${b.steps.map(s => `<li><b>${esc(s.t)}</b> ${esc(s.d || '')}</li>`).join('')}</ol>` : ''}</div>${b.valueForm('lo-val')}</section>`);
  if (c.team) out.push(`<section class="lo-team" id="lo-equipo"${b.mk('team')}><div><h2>${esc(c.team.title || 'El equipo')}</h2><p>${esc(c.team.text || '')}</p>${(c.team.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>${photo(c.team.photo, c.team.photoAlt || '', 'lo-team-img')}</section>`);
  if (b.reviews.length) out.push(`<section class="lo-revs"${b.mk('reviews')}><h2>${b.rating ? `${esc(b.rating.value)} ★ en ${esc(b.rating.source || 'Google')}` : 'Lo que dicen'}</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="lo-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="lo-foot" id="lo-contacto"${b.mk('visit')}>${seal}<div><b class="lo-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="lo-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="lo-sticky">${a('lo-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
