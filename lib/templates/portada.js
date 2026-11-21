// Diseño «Portada» para despachos con equipo fuerte (theme.style = 'portada'), basado en Iryce Lawyers
// (Francia): una maqueta de revista con tipografía enorme encima de las fotos del equipo, columnas
// como de artículo, numeración de páginas y citas grandes.
import { base, esc } from './base.js';

export const PORTADA_FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap';

export function renderPortada(c = {}, opts = {}) {
  const b = base(c, opts, '#D7263D'), { a, photo, hero, contact, name } = b;
  const M = b.members, word = String(b.brand.name || name).split(/[ &]/)[0];
  const out = [`<link rel="stylesheet" href="/assets/t-portada.css">`,
    `<div class="cx pt${b.live ? '' : ' pt-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="pt-top"><b class="pt-logo">${esc(b.brand.name || name)}</b><span class="pt-issue">Edición ${new Date().getFullYear()} · ${esc(String(contact.address || '').split(',').slice(-2, -1)[0]?.trim() || '')}</span>${a('pt-btn', '#pt-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="pt-cover"${b.mk('hero')}>${photo(M[0]?.photo || hero.photo, M[0]?.name || name, 'pt-cover-img')}<p class="pt-mast" aria-hidden="true">${esc(word.toUpperCase())}</p><div class="pt-cover-in"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div><span class="pt-pg">01</span></section>`);
  if (b.services.length) out.push(`<section class="pt-index"${b.mk('services')}><h2>En este número</h2><ol>${b.services.map((s, i) => `<li><span>${String(i + 2).padStart(2, '0')}</span><div><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></div>${a('pt-link', b.serviceHref(s), 'Consultar')}</li>`).join('')}</ol></section>`);
  if (M.length) out.push(`<section class="pt-feature"${b.mk('team')}>${M.slice(0, 2).map((m, i) => `<article class="pt-person${i ? ' pt-person--r' : ''}">${photo(m.photo, m.name, 'pt-p-img')}<div><p class="pt-big" aria-hidden="true">${esc(String(m.name).split(' ').slice(-1)[0].toUpperCase())}</p><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></div></article>`).join('')}<p class="pt-col">${esc(c.team?.text || '')}</p></section>`);
  if (b.reviews.length) out.push(`<section class="pt-quote"${b.mk('reviews')}><blockquote><p>“${esc(b.reviews[0].text)}”</p><cite>— ${esc(b.reviews[0].name)}</cite></blockquote>${b.reviews.slice(1, 3).map(r => `<blockquote class="pt-q-sm"><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if ((c.stats || []).length) out.push(`<section class="pt-nums"${b.mk('trust')}>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="pt-faq"><h2>Cartas al despacho</h2><div>${b.faq.map(f => `<article><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></article>`).join('')}</div></section>`);
  out.push(`<section class="pt-cta" id="pt-contacto"><h2>Su caso, en la próxima página.</h2>${b.caseForm('pt-case')}</section>`);
  out.push(`<footer class="pt-foot"${b.mk('visit')}><b class="pt-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="pt-sticky">${a('pt-btn', '#pt-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
