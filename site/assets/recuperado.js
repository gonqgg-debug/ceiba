// Diseño «Recuperado» para despachos que defienden y recuperan dinero (theme.style = 'recuperado'),
// basado en Young Law Group (Estados Unidos): el monto recuperado para clientes va enorme en la
// portada, debajo los medios donde ha aparecido el despacho como prueba social (si los hay)
// y resultados concretos en tarjetas. Verde profundo con acento lima.
import { base, esc, ICON } from './base.js';

export const RECUPERADO_FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap';

export function renderRecuperado(c = {}, opts = {}) {
  const b = base(c, opts, '#C6F05A'), { a, photo, hero, contact, name } = b;
  const R = c.results || c.stats || [], big = R[0];
  const out = [`<link rel="stylesheet" href="/assets/t-recuperado.css">`,
    `<div class="cx rc2${b.live ? '' : ' rc2-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rq-top"><b class="rq-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['rq-resultados', 'Resultados'], ['rq-areas', 'Áreas'], ['rq-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${b.telNum ? a('rq-call', `tel:${b.telNum}`, `${ICON.phone}<span>${esc(contact.phone)}</span>`) : ''}${a('rq-btn', '#rq-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="rq-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'rq-hero-img')}<div>${big ? `<p class="rq-big">${esc(big.value)}</p><p class="rq-big-l">${esc(big.label)}</p>` : ''}<h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="rq-ctas">${a('rq-btn', '#rq-contacto', esc(hero.cta || b.ctaTop))}${b.rating ? `<span class="rq-stars">★★★★★ <b>${esc(b.rating.value)}</b> · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</span>` : ''}</div></div></section>`);
  if ((c.press || []).length) out.push(`<section class="rq-press"><p>Nos han entrevistado en</p><div>${c.press.map(p => `<span>${esc(p)}</span>`).join('')}</div></section>`);
  if (R.length > 1) out.push(`<section class="rq-res" id="rq-resultados"${b.mk('trust')}><h2>Resultados para nuestros clientes</h2><div>${R.map(r => `<article><b>${esc(r.value)}</b><p>${esc(r.label)}</p></article>`).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="rq-areas" id="rq-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('rq-link', b.serviceHref(s), `Revisar mi caso ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="rq-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.members.length) out.push(`<section class="rq-team"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'rq-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></div></article>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="rq-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="rq-cta" id="rq-contacto"><div><h2>Revisamos tu caso sin costo</h2><p>${esc(c.util?.note || '')}</p></div>${b.caseForm('rq-case', 'Hola, quiero que revisen mi caso')}</section>`);
  out.push(`<footer class="rq-foot"${b.mk('visit')}><b class="rq-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="rq-sticky">${b.telNum ? a('rq-btn rq-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}${a('rq-btn', '#rq-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
