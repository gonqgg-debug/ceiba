// Diseño «Paisaje» para psicología y bienestar (theme.style = 'paisaje'), basado en Nudge Psychology
// (Australia): textos con humor y cercanía, nada clínicos, sobre fondos de paisaje ilustrado que
// cambian (amanecer, día, atardecer, noche) mientras bajas por la página.
import { base, esc, ICON } from './base.js';

export const PAISAJE_FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Nunito:wght@400;600&display=swap';
const SCENE = (sky1, sky2, hill1, hill2, sun) => `<svg class="pj-scene" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="g${sky1.slice(1)}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs><rect width="1200" height="400" fill="url(#g${sky1.slice(1)})"/><circle cx="880" cy="170" r="70" fill="${sun}"/><path d="M0 300 C200 220 380 260 560 230 S900 200 1200 260 V400 H0Z" fill="${hill1}"/><path d="M0 340 C240 290 420 330 640 300 S1000 290 1200 320 V400 H0Z" fill="${hill2}"/></svg>`;

export function renderPaisaje(c = {}, opts = {}) {
  const b = base(c, opts, '#E86A4E'), { a, photo, hero, contact, name } = b;
  const lines = c.quips || ['Hablar ayuda. Hablar con alguien que sabe, ayuda más.', 'No tienes que estar “muy mal” para venir.', 'Tu cerebro no viene con instructivo. Nosotros tampoco, pero casi.'];
  const out = [`<link rel="stylesheet" href="/assets/t-paisaje.css">`,
    `<div class="cx pj${b.live ? '' : ' pj-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="pj-top"><b class="pj-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['pj-ayuda', 'En qué ayudamos'], ['pj-equipo', 'Quiénes somos'], ['pj-contacto', 'Hablemos']].map(b.navLink).join('')}</nav>${a('pj-btn', '#pj-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="pj-hero pj-dawn"${b.mk('hero')}>${SCENE('#FFD9B8', '#FFF1E2', '#E9A98A', '#C97F67', '#FFB067')}<div><h1>${esc(lines[0])}</h1><p>${esc(hero.sub || hero.title || '')}</p>${a('pj-btn', '#pj-contacto', esc(hero.cta || b.ctaTop))}</div></section>`);
  if (b.services.length) out.push(`<section class="pj-help pj-day" id="pj-ayuda"${b.mk('services')}>${SCENE('#9ED4F0', '#E3F4FB', '#8CC59B', '#5FA47A', '#FFE27A')}<div class="pj-in"><h2>${esc(lines[1])}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('pj-link', b.serviceHref(s), `Me interesa ${ICON.arrow('')}`)}</article>`).join('')}</div></div></section>`);
  if (b.members.length) out.push(`<section class="pj-team" id="pj-equipo"${b.mk('team')}><h2>Las personas detrás</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'pj-face')}<h3>${esc(m.name)}</h3><p class="pj-role">${esc(m.role || '')}</p>${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="pj-revs pj-dusk"${b.mk('reviews')}>${SCENE('#F59E7A', '#FBD3A6', '#8E5A7A', '#5E3A60', '#FF7F50')}<div class="pj-in"><h2>${esc(lines[2])}</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></div></section>`);
  if (b.faq.length) out.push(`<section class="pj-faq"><h2>Las dudas de siempre</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="pj-cta pj-night" id="pj-contacto">${SCENE('#1E2350', '#3B3F7A', '#2A2E5E', '#1A1D44', '#F4F1D0')}<div class="pj-in"><h2>¿Platicamos?</h2><p>${esc(c.util?.note || 'Escríbenos y te respondemos hoy.')}</p>${b.apptForm('pj-case')}</div></section>`);
  out.push(`<footer class="pj-foot"${b.mk('visit')}><b class="pj-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><p class="pj-crisis">Si estás en crisis, llama a la Línea de la Vida: 800 911 2000 (24 h, gratis).</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="pj-sticky">${a('pj-btn', '#pj-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
