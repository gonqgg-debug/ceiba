// Diseño «Virtual» para consulta en línea y telemedicina (theme.style = 'virtual'), basado en Zealthy
// (Estados Unidos): explica el modelo de atención a distancia con un «cómo funciona» en 4 pasos
// muy visual, junto a un teléfono que muestra la videollamada con el médico.
import { base, esc, ICON } from './base.js';

export const VIRTUAL_FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap';

export function renderVirtual(c = {}, opts = {}) {
  const b = base(c, opts, '#5B4BDB'), { a, photo, hero, contact, name } = b;
  const doc = b.members[0] || { name, photo: hero.photo, role: '' };
  const steps = b.steps.slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-virtual.css">`,
    `<div class="cx vt${b.live ? '' : ' vt-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="vt-top"><b class="vt-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['vt-como', 'Cómo funciona'], ['vt-tratamos', 'Qué tratamos'], ['vt-medicos', 'Médicos'], ['vt-preguntas', 'Preguntas']].map(b.navLink).join('')}</nav>${a('vt-btn', '#vt-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="vt-hero"${b.mk('hero')}><div><p class="vt-pill">● Médicos disponibles hoy</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="vt-ctas">${a('vt-btn', '#vt-contacto', esc(hero.cta || b.ctaTop))}${b.rating ? `<span>★ ${esc(b.rating.value)} · ${esc(b.rating.count)} opiniones</span>` : ''}</div></div>
    <div class="vt-phone" aria-hidden="true"><div class="vt-screen">${photo(doc.photo, '', 'vt-call')}<span class="vt-me"></span><span class="vt-tag">${esc(doc.name)}</span><span class="vt-bar"><i></i><i></i><i class="vt-end"></i></span></div></div></section>`);
  if (steps.length) out.push(`<section class="vt-how" id="vt-como"><h2>${esc(c.process?.title || 'Cómo funciona')}</h2><ol>${steps.map((s, i) => `<li><span>${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.services.length) out.push(`<section class="vt-treat" id="vt-tratamos"${b.mk('services')}><h2>${esc(c.services?.title || 'Qué tratamos')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('vt-link', b.serviceHref(s), `Empezar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  out.push(`<section class="vt-trust"${b.mk('trust')}>${b.trust.map(t => `<div>${ICON.check}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.members.length) out.push(`<section class="vt-docs" id="vt-medicos"${b.mk('team')}><h2>${esc(c.team?.title || 'Médicos')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'vt-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${m.license ? `<small>Cédula ${esc(m.license)}</small>` : ''}</div></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="vt-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="vt-faq" id="vt-preguntas"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="vt-cta" id="vt-contacto"><div><h2>Tu consulta, desde donde estés</h2><p>${esc(c.util?.note || '')}</p></div>${b.apptForm('vt-case')}</section>`);
  out.push(`<footer class="vt-foot"${b.mk('visit')}><b class="vt-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')} · también en consultorio</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="vt-sticky">${a('vt-btn', '#vt-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
