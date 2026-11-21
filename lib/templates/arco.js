// Diseño «Arco» para inmobiliarias de ciudad con carácter (theme.style = 'arco'), basado en Village
// Properties (Santa Bárbara): colores y arcos de la arquitectura local (las fotos se recortan
// en forma de arco), cifras en tarjetas con un ícono, y una barra de accesibilidad para agrandar
// la letra.
import { base, esc, ICON } from './base.js';

export const ARCO_FONTS = 'https://fonts.googleapis.com/css2?family=Marcellus&family=Mulish:wght@400;500;600;700&display=swap';
const STAR4 = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/></svg>';

export function renderArco(c = {}, opts = {}) {
  const b = base(c, opts, '#B4583A'), { a, photo, hero, contact, name } = b;
  const L = b.listings, stats = (c.stats || []).slice(0, 3);
  const out = [`<link rel="stylesheet" href="/assets/t-arco.css">`,
    `<div class="cx ar${b.live ? '' : ' ar-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<div class="ar-util"><span>${esc(c.util?.note || '')}</span><button type="button" data-t-zoom aria-pressed="false">A+ Letra grande</button></div>
  <header class="ar-top"><b class="ar-logo">${esc(b.brand.name || name)}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['ar-props', 'Propiedades'], ['ar-servicios', 'Servicios'], ['ar-equipo', 'Equipo'], ['ar-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ar-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ar-hero"${b.mk('hero')}><div class="ar-copy"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="ar-ctas">${a('ar-btn', '#ar-props', esc(hero.cta || 'Ver propiedades'))}${a('ar-btn ar-btn--line', b.waHref, esc(hero.ctaWhatsapp || 'WhatsApp'))}</div></div>${photo(hero.photo, hero.photoAlt || name, 'ar-hero-img')}</section>`);
  if (stats.length) out.push(`<section class="ar-stats"${b.mk('trust')}>${stats.map(s => `<div>${STAR4}<b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (L.length) out.push(`<section class="ar-props" id="ar-props"${b.mk('services')}><div class="ar-head"><h2>${esc(c.listings?.title || 'Propiedades')}</h2>${b.lstFilters('ar-filt')}<p data-t-count aria-live="polite"></p></div><div class="ar-grid" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'ar-arch')}<p class="ar-op">${esc(l.op || '')}</p><h3>${esc(l.title)}</h3><p class="ar-zone">${esc(l.zone || '')}</p><p class="ar-facts">${b.lstFacts(l).map(esc).join(' · ')}</p><div class="ar-row"><b>${esc(l.price || '')}</b>${a('ar-link', b.lstHref(l), `Me interesa ${ICON.arrow('')}`)}</div></article>`).join('')}</div>${c.listings?.note ? `<p class="ar-note">${esc(c.listings.note)}</p>` : ''}</section>`);
  if (b.services.length) out.push(`<section class="ar-serv" id="ar-servicios"><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map(s => `<article><span class="ar-arch-sm" aria-hidden="true"></span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('ar-link', b.serviceHref(s), `Hablar de esto ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (c.team) out.push(`<section class="ar-team" id="ar-equipo"${b.mk('team')}>${photo(c.team.photo, c.team.photoAlt || '', 'ar-arch ar-team-img')}<div><h2>${esc(c.team.title || 'Quiénes somos')}</h2><p>${esc(c.team.text || '')}</p>${(c.team.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul>` : ''}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ar-revs"${b.mk('reviews')}>${b.rating ? `<p class="ar-score">${esc(b.rating.value)} ★ · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="ar-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="ar-foot" id="ar-contacto"${b.mk('visit')}><div><b class="ar-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p></div><div><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div>${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? a('ar-link', b.mapsHref, 'Cómo llegar') : ''}</div><div class="ar-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="ar-sticky">${a('ar-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
