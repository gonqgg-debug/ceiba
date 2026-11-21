// Diseño «Blanco» para despachos que quieren verse impecables (theme.style = 'blanco'), basado en
// Bick Law LLP (Estados Unidos, premiado): minimalista, mucho espacio en blanco, fotografía
// profesional a gran tamaño, una sola tipografía y un solo color de marca usado con disciplina.
import { base, esc, ICON } from './base.js';

export const BLANCO_FONTS = 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600&display=swap';

export function renderBlanco(c = {}, opts = {}) {
  const b = base(c, opts, '#2B5CE6'), { a, photo, hero, contact, name } = b;
  const out = [`<link rel="stylesheet" href="/assets/t-blanco.css">`,
    `<div class="cx bl${b.live ? '' : ' bl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="bl-top"><b class="bl-logo">${esc(b.brand.name || name)}<i>.</i></b><nav aria-label="Secciones">${[['bl-practica', 'Práctica'], ['bl-equipo', 'Equipo'], ['bl-contacto', 'Contacto']].map(b.navLink).join('')}</nav></header>`);
  out.push(`<section class="bl-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><div class="bl-row"><p>${esc(hero.sub || '')}</p>${a('bl-link', '#bl-contacto', `${esc(hero.cta || b.ctaTop)} ${ICON.arrow('')}`, b.mk('cta'))}</div>${photo(hero.photo, hero.photoAlt || name, 'bl-hero-img')}</section>`);
  if (b.services.length) out.push(`<section class="bl-prac" id="bl-practica"${b.mk('services')}><p class="bl-label">Práctica</p><ul>${b.services.map(s => `<li><h2>${esc(s.name)}</h2><p>${esc(s.desc || '')}</p>${a('bl-link', b.serviceHref(s), ICON.arrow(''), ` aria-label="Consultar sobre ${esc(s.name)}"`)}</li>`).join('')}</ul></section>`);
  if ((c.stats || []).length) out.push(`<section class="bl-nums"${b.mk('trust')}><p class="bl-label">En cifras</p><div>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="bl-team" id="bl-equipo"${b.mk('team')}><p class="bl-label">Equipo</p><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'bl-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="bl-quote"${b.mk('reviews')}><p class="bl-label">Clientes</p><blockquote><p>${esc(b.reviews[0].text)}</p><cite>${esc(b.reviews[0].name)}</cite></blockquote></section>`);
  if (b.faq.length) out.push(`<section class="bl-faq"><p class="bl-label">Preguntas</p><div>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);
  out.push(`<section class="bl-cta" id="bl-contacto"><p class="bl-label">Contacto</p><div><h2>${esc(c.util?.note || 'Hablemos de su caso.')}</h2>${b.caseForm('bl-case')}</div></section>`);
  out.push(`<footer class="bl-foot"${b.mk('visit')}><b class="bl-logo">${esc(b.brand.name || name)}<i>.</i></b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="bl-sticky">${a('bl-btn', '#bl-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
