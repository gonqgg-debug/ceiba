// Diseño «Monstruo» para despachos que quieren explicar sin miedo (theme.style = 'monstruo'), basado en
// Krivitzky (Rusia): cada problema legal es un monstruo con su propia escena al hacer scroll. Un
// dibujo simple, el problema en palabras de la gente y cómo lo vence el despacho. Fondo crema,
// colores fuertes por escena y letra editorial.
import { base, esc, ICON } from './base.js';

export const MONSTRUO_FONTS = 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&family=Literata:ital,wght@0,400;1,400&display=swap';
const COLORS = ['#E8573F', '#3A7BD5', '#2BAE66', '#8E5BD6', '#F2A93B', '#D94F8C'];
const beast = (i, col) => {
  const eyes = i % 3 === 0 ? '<circle cx="42" cy="46" r="7" style="fill:#fff;stroke:none"/><circle cx="44" cy="47" r="3" style="fill:#1d1d1d;stroke:none"/>' : '<circle cx="34" cy="44" r="6" style="fill:#fff;stroke:none"/><circle cx="56" cy="44" r="6" style="fill:#fff;stroke:none"/><circle cx="35" cy="45" r="2.6" style="fill:#1d1d1d;stroke:none"/><circle cx="57" cy="45" r="2.6" style="fill:#1d1d1d;stroke:none"/>';
  const body = ['M14 82c0-30 10-58 31-58s31 28 31 58l-8-6-8 6-7-6-8 6-8-6-8 6-7-6Z', 'M10 80c4-26 16-50 35-50s31 24 35 50c-12-6-23 0-35 0s-23-6-35 0Z', 'M18 84V40c0-12 12-20 27-20s27 8 27 20v44l-9-7-9 7-9-7-9 7-9-7Z'][i % 3];
  const horns = i % 2 ? '<path d="M28 28 22 12l14 10M62 28l6-16-14 10" style="fill:' + col + ';stroke:none"/>' : '<path d="M45 22V8" style="fill:none;stroke:#1d1d1d;stroke-width:3"/><circle cx="45" cy="7" r="4" style="fill:#1d1d1d;stroke:none"/>';
  return `<svg class="mn-beast" viewBox="0 0 90 90" aria-hidden="true">${horns}<path d="${body}" style="fill:${col};stroke:none"/>${eyes}<path d="M34 62q11 ${i % 2 ? 8 : -6} 22 0" style="fill:none;stroke:#1d1d1d;stroke-width:3;stroke-linecap:round"/></svg>`;
};

export function renderMonstruo(c = {}, opts = {}) {
  const b = base(c, opts, '#1D1D1D'), { a, photo, hero, contact, name } = b;
  const S = b.services.slice(0, 6);
  const out = [`<link rel="stylesheet" href="/assets/t-monstruo.css">`,
    `<div class="cx mn${b.live ? '' : ' mn-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="mn-top"><b class="mn-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['mn-monstruos', 'Problemas'], ['mn-equipo', 'Equipo'], ['mn-contacto', 'Consulta']].map(b.navLink).join('')}</nav>${a('mn-btn', '#mn-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="mn-hero"${b.mk('hero')}><div class="mn-crowd" aria-hidden="true">${S.slice(0, 5).map((s, i) => beast(i, COLORS[i])).join('')}</div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><p class="mn-hint">Baja para conocer a cada uno ↓</p></section>`);
  if (S.length) out.push(`<section id="mn-monstruos"${b.mk('services')}>${S.map((s, i) => `<article class="mn-scene" style="--c:${COLORS[i % COLORS.length]}"><div class="mn-art">${beast(i, COLORS[i % COLORS.length])}<span class="mn-n">${String(i + 1).padStart(2, '0')}</span></div><div class="mn-copy"><p class="mn-kick">El monstruo de</p><h2>${esc(s.name)}</h2><p>${esc(s.desc || '')}</p>${a('mn-btn mn-btn--c', b.serviceHref(s), `Vencerlo con nosotros ${ICON.arrow('')}`)}</div></article>`).join('')}</section>`);
  if (b.steps.length) out.push(`<section class="mn-steps"><h2>${esc(c.process?.title || 'Cómo trabajamos')}</h2><ol>${b.steps.map((s, i) => `<li><span>${i + 1}</span><b>${esc(s.t)}</b><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.members.length) out.push(`<section class="mn-team" id="mn-equipo"${b.mk('team')}><h2>Los cazadores</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'mn-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="mn-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="mn-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="mn-cta" id="mn-contacto"><h2>¿Qué monstruo tienes enfrente?</h2><p>${esc(c.util?.note || 'Cuéntanos tu caso y te decimos qué hacer.')}</p>${b.caseForm('mn-case')}</section>`);
  out.push(`<footer class="mn-foot"${b.mk('visit')}><b class="mn-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="mn-sticky">${a('mn-btn', '#mn-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
