// Diseño «Reseñas» para despachos con clientes satisfechos (theme.style = 'resenas'), basado en M&Y
// Personal Injury (Estados Unidos): las reseñas de 5 estrellas son protagonistas desde la portada
// (calificación grande, muro de opiniones), seguidas de casos destacados y las áreas.
// Azul marino con dorado de estrellas.
import { base, esc, ICON } from './base.js';

export const RESENAS_FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap';

export function renderResenas(c = {}, opts = {}) {
  const b = base(c, opts, '#F5B70A'), { a, photo, hero, contact, name } = b;
  const R = b.reviews, stars = '★★★★★';
  const out = [`<link rel="stylesheet" href="/assets/t-resenas.css">`,
    `<div class="cx rs${b.live ? '' : ' rs-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rs-top"><b class="rs-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['rs-opiniones', 'Opiniones'], ['rs-casos', 'Casos'], ['rs-areas', 'Áreas'], ['rs-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('rs-btn', '#rs-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="rs-hero"${b.mk('hero')}><div><p class="rs-score">${b.rating ? `<b>${esc(b.rating.value)}</b><span><i aria-hidden="true">${stars}</i>${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</span>` : `<i aria-hidden="true">${stars}</i>`}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('rs-btn', '#rs-contacto', esc(hero.cta || b.ctaTop))}</div>${R[0] ? `<blockquote class="rs-hq"><i aria-hidden="true">${stars}</i><p>“${esc(R[0].text)}”</p><cite>${esc(R[0].name)}</cite></blockquote>` : photo(hero.photo, '', 'rs-hero-img')}</section>`);
  if (R.length) out.push(`<section class="rs-wall" id="rs-opiniones"${b.mk('reviews')}><h2>Lo que dicen de nosotros</h2><div>${R.slice(0, 9).map((r, i) => `<blockquote class="${i % 3 === 1 ? 'rs-alt' : ''}"><i aria-hidden="true">${stars}</i><p>${esc(r.text)}</p><cite><span>${esc(String(r.name)[0])}</span>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  const cases = c.cases || (c.results || []).map(r => ({ title: r.value, desc: r.label }));
  if (cases.length) out.push(`<section class="rs-cases" id="rs-casos"${b.mk('trust')}><h2>Casos destacados</h2><div>${cases.map(k => `<article><b>${esc(k.title)}</b><p>${esc(k.desc || '')}</p></article>`).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="rs-areas" id="rs-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('rs-link', b.serviceHref(s), `Consultar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="rs-team"${b.mk('team')}>${b.members.map(m => `<article>${photo(m.photo, m.name, 'rs-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></div></article>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="rs-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="rs-cta" id="rs-contacto"><div><h2>Sé el próximo cliente contento</h2><p>${esc(c.util?.note || '')}</p></div>${b.caseForm('rs-case')}</section>`);
  out.push(`<footer class="rs-foot"${b.mk('visit')}><b class="rs-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="rs-sticky">${a('rs-btn', '#rs-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
