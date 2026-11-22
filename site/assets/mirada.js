// Diseño «Mirada» para oftalmología, optometría y consultorios con una idea fuerte (theme.style =
// 'mirada'), basado en MyHealthPrac (Australia): un video en loop de un ojo unido a la frase
// «See beyond». Si el consultorio no tiene video, un ojo dibujado mira de un lado a otro y
// parpadea junto a la frase «Mira más allá».
import { base, esc, url, ICON } from './base.js';

export const MIRADA_FONTS = 'https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Inter:wght@400;500&display=swap';
const EYE = '<svg class="mr-eye" viewBox="0 0 240 140" aria-hidden="true"><defs><clipPath id="mr-lid"><path class="mr-lidp" d="M10 70C60 10 180 10 230 70C180 130 60 130 10 70Z"/></clipPath><radialGradient id="mr-iris"><stop offset="0" stop-color="#0B1E2D"/><stop offset=".35" stop-color="#1E6F8C"/><stop offset=".8" stop-color="#3FB6C9"/><stop offset="1" stop-color="#0B3A4A"/></radialGradient></defs><path d="M10 70C60 10 180 10 230 70C180 130 60 130 10 70Z" fill="#F4F7F8"/><g clip-path="url(#mr-lid)"><g class="mr-pupil"><circle cx="120" cy="70" r="38" fill="url(#mr-iris)"/><circle cx="120" cy="70" r="15" fill="#05121B"/><circle cx="132" cy="58" r="6" fill="#fff" opacity=".85"/></g></g><path d="M10 70C60 10 180 10 230 70C180 130 60 130 10 70Z" fill="none" stroke="#0B1E2D" stroke-width="4"/><rect class="mr-blink" x="0" y="0" width="240" height="0" fill="#0B1E2D"/></svg>';

export function renderMirada(c = {}, opts = {}) {
  const b = base(c, opts, '#3FB6C9'), { a, photo, hero, contact, name } = b;
  const vid = url(hero.video);
  const out = [`<link rel="stylesheet" href="/assets/t-mirada.css">`,
    `<div class="cx mi${b.live ? '' : ' mi-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="mi-top"><b class="mi-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['mi-servicios', 'Servicios'], ['mi-equipo', 'Equipo'], ['mi-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('mi-btn', '#mi-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="mi-hero"${b.mk('hero')}><div class="mi-vis">${vid ? `<video src="${esc(vid)}" autoplay muted loop playsinline></video>` : EYE}</div><h1><span>${esc(c.hero?.hook || 'Mira')}</span> <span>${esc(c.hero?.hook2 || 'más allá.')}</span></h1><p>${esc(hero.title)}. ${esc(hero.sub || '')}</p>${a('mi-btn', '#mi-contacto', esc(hero.cta || b.ctaTop))}</section>`);
  if (b.services.length) out.push(`<section class="mi-serv" id="mi-servicios"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map((s, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('mi-link', b.serviceHref(s), `Agendar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  out.push(`<section class="mi-split"${b.mk('trust')}>${photo(b.gallery[0]?.img || hero.photo, '', 'mi-split-img')}<div><h2>Lo que vas a notar</h2><ul>${b.trust.map(t => `<li>${ICON.check}<span><b>${esc(t.b)}</b> ${esc(t.t)}</span></li>`).join('')}</ul></div></section>`);
  if (b.members.length) out.push(`<section class="mi-team" id="mi-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'mi-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="mi-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="mi-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="mi-cta" id="mi-contacto"><h2>Agenda tu cita</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('mi-case')}</section>`);
  out.push(`<footer class="mi-foot"${b.mk('visit')}><b class="mi-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="mi-sticky">${a('mi-btn', '#mi-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
