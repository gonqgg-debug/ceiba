// Diseño «Familiar» para despachos de familia y personas (theme.style = 'familiar'), basado en Barbara
// Legate (Canadá): diseño cálido y cercano, esquinas suaves y fotos del equipo. El botón de llamada
// muestra el teléfono y si el despacho está abierto ahora, con su horario.
import { base, esc, ICON, schedule } from './base.js';

export const FAMILIAR_FONTS = 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Nunito:wght@400;600;700&display=swap';

export function renderFamiliar(c = {}, opts = {}) {
  const b = base(c, opts, '#B5573B'), { a, photo, hero, contact, name } = b;
  const sch = schedule(c.visit?.rows);
  const callCard = cls => `<div class="fa-call ${cls}">${b.telNum ? a('fa-call-btn', `tel:${b.telNum}`, `${ICON.phone}<span><small>Llámanos</small><b>${esc(contact.phone)}</b></span>`) : ''}${sch.length ? `<p class="fa-open" data-t-open='${JSON.stringify(sch)}'>${esc(b.rows[0] ? `${b.rows[0].dt} ${b.rows[0].dd}` : 'Horario')}</p>` : ''}</div>`;
  const out = [`<link rel="stylesheet" href="/assets/t-familiar.css">`,
    `<div class="cx fa${b.live ? '' : ' fa-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="fa-top"><b class="fa-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['fa-ayuda', 'En qué ayudamos'], ['fa-nosotros', 'Nosotros'], ['fa-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${b.telNum ? a('fa-btn', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`, b.mk('cta')) : a('fa-btn', '#fa-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="fa-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${callCard('')}${a('fa-link', '#fa-contacto', `O escríbenos tu caso ${ICON.arrow('')}`)}</div>${photo(hero.photo, hero.photoAlt || name, 'fa-hero-img')}</section>`);
  out.push(`<section class="fa-trust"${b.mk('trust')}>${b.trust.map(t => `<div><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="fa-help" id="fa-ayuda"${b.mk('services')}><h2>${esc(c.services?.title || 'En qué te ayudamos')}</h2><p class="fa-sub">${esc(c.services?.sub || '')}</p><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('fa-link', b.serviceHref(s), `Platicarlo ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="fa-team" id="fa-nosotros"${b.mk('team')}><div><h2>${esc(c.team?.title || 'Quiénes somos')}</h2><p>${esc(c.team?.text || '')}</p></div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'fa-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</section>`);
  if (b.steps.length) out.push(`<section class="fa-steps"><h2>${esc(c.process?.title || 'Cómo trabajamos')}</h2><ol>${b.steps.map(s => `<li><b>${esc(s.t)}</b><span>${esc(s.d || '')}</span></li>`).join('')}</ol></section>`);
  if (b.reviews.length) out.push(`<section class="fa-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="fa-faq"><h2>Preguntas que nos hacen seguido</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="fa-cta" id="fa-contacto"><div><h2>Cuéntanos qué pasa</h2><p>${esc(c.util?.note || '')}</p>${callCard('fa-call--in')}</div>${b.caseForm('fa-case')}</section>`);
  out.push(`<footer class="fa-foot"${b.mk('visit')}><b class="fa-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}<div>${b.legal()}</div></footer>`);
  out.push(`<div class="fa-sticky">${b.telNum ? a('fa-btn', `tel:${b.telNum}`, `${ICON.phone} Llamar`) : ''}${a('fa-btn fa-btn--line', '#fa-contacto', 'Escribir')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
