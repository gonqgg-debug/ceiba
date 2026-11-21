// Diseño «Dorado» para despachos corporativos (theme.style = 'dorado'), basado en JGA Legal Advisor
// (Polonia): blanco y dorado, mucho aire, frases del despacho que corren en horizontal, áreas en
// lista elegante con número, y el equipo en tarjetas sobrias.
import { base, esc, ICON } from './base.js';

export const DORADO_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;1,500&family=Manrope:wght@300;400;500;600&display=swap';

export function renderDorado(c = {}, opts = {}) {
  const b = base(c, opts, '#B8954E'), { a, photo, hero, contact, name } = b;
  const tags = c.taglines || [...b.trust.map(t => t.b), ...b.services.map(s => s.name)].slice(0, 8);
  const run = `<div class="dr-run" aria-hidden="true"><div>${[...tags, ...tags].map(t => `<span>${esc(t)}</span><i>◆</i>`).join('')}</div></div>`;
  const out = [`<link rel="stylesheet" href="/assets/t-dorado.css">`,
    `<div class="cx dr${b.live ? '' : ' dr-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="dr-top"><b class="dr-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><nav aria-label="Secciones">${[['dr-areas', 'Áreas'], ['dr-equipo', 'Equipo'], ['dr-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('dr-btn', '#dr-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="dr-hero"${b.mk('hero')}><div><p class="dr-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('dr-btn', '#dr-contacto', esc(hero.cta || b.ctaTop))}</div>${photo(hero.photo, hero.photoAlt || name, 'dr-hero-img')}</section>`);
  out.push(run);
  if (b.services.length) out.push(`<section class="dr-areas" id="dr-areas"${b.mk('services')}><div class="dr-head"><p class="dr-kick">Áreas de práctica</p><h2>${esc(c.services?.sub || c.services?.title || '')}</h2></div><ol>${b.services.map((s, i) => `<li>${a('dr-area', b.serviceHref(s), `<span>${String(i + 1).padStart(2, '0')}</span><b>${esc(s.name)}</b><em>${esc(s.desc || '')}</em>${ICON.arrow('')}`)}</li>`).join('')}</ol></section>`);
  if ((c.stats || []).length) out.push(`<section class="dr-nums"${b.mk('trust')}>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.members.length) out.push(`<section class="dr-team" id="dr-equipo"${b.mk('team')}><div class="dr-head"><p class="dr-kick">Equipo</p><h2>${esc(c.team?.text || '')}</h2></div><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'dr-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="dr-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(run.replace('dr-run', 'dr-run dr-run--rev'));
  if (b.faq.length) out.push(`<section class="dr-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="dr-cta" id="dr-contacto"><div><p class="dr-kick">Contacto</p><h2>Agenda una reunión con un socio</h2><p>${esc(c.util?.note || '')}</p></div>${b.caseForm('dr-case')}</section>`);
  out.push(`<footer class="dr-foot"${b.mk('visit')}><b class="dr-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="dr-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="dr-sticky">${a('dr-btn', '#dr-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
