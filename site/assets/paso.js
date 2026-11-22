// Diseño «Paso» para consultorios de especialidad con trato cálido (podología, fisioterapia,
// ortopedia…) (theme.style = 'paso'), basado en Integrated Podiatry Clinic (Australia): tipografía
// grande y una historia cálida contada en primera persona, con los servicios bien organizados
// en grupos y el equipo cercano.
import { base, esc, ICON } from './base.js';

export const PASO_FONTS = 'https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;800&display=swap';

export function renderPaso(c = {}, opts = {}) {
  const b = base(c, opts, '#D9652B'), { a, photo, hero, contact, name } = b;
  const S = b.services;
  const out = [`<link rel="stylesheet" href="/assets/t-paso.css">`,
    `<div class="cx ps${b.live ? '' : ' ps-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ps-top"><b class="ps-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ps-historia', 'Nuestra historia'], ['ps-servicios', 'Servicios'], ['ps-equipo', 'Equipo'], ['ps-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ps-btn', '#ps-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ps-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><div class="ps-hrow">${photo(hero.photo, hero.photoAlt || name, 'ps-hero-img')}<div><p>${esc(hero.sub || '')}</p>${a('ps-btn', '#ps-contacto', esc(hero.cta || b.ctaTop))}${b.rating ? `<p class="ps-g">★ ${esc(b.rating.value)} · ${esc(b.rating.count)} opiniones</p>` : ''}</div></div></section>`);
  out.push(`<section class="ps-story" id="ps-historia"${b.mk('team')}><p class="ps-big">${esc(c.team?.text || 'Te atendemos como nos gustaría que nos atendieran.')}</p><div>${(c.stats || []).map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div></section>`);
  if (S.length) out.push(`<section class="ps-serv" id="ps-servicios"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${S.map((s, i) => `<details${i ? '' : ' open'}><summary><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.name)}</summary><div><p>${esc(s.desc || '')}</p>${a('ps-link', b.serviceHref(s), `Agendar ${esc(String(s.name).toLowerCase())} ${ICON.arrow('')}`)}</div></details>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="ps-team" id="ps-equipo"><h2>Quién te va a atender</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'ps-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${m.bio ? `<p class="ps-bio">${esc(m.bio)}</p>` : ''}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ps-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ps-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ps-cta" id="ps-contacto"><h2>Da el primer paso.</h2>${b.apptForm('ps-case')}</section>`);
  out.push(`<footer class="ps-foot"${b.mk('visit')}><b class="ps-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ps-sticky">${a('ps-btn', '#ps-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
