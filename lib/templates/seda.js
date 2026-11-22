// Diseño «Seda» para consultorios premium (theme.style = 'seda'), basado en Heva Health (Reino Unido):
// serif refinada, paleta perla y ciruela, animaciones sutiles (textos que aparecen despacio, fotos
// que se acercan apenas) y una sensación de calma y exclusividad.
import { base, esc, ICON } from './base.js';

export const SEDA_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;500&display=swap';

export function renderSeda(c = {}, opts = {}) {
  const b = base(c, opts, '#6E3B5C'), { a, photo, hero, contact, name } = b;
  const out = [`<link rel="stylesheet" href="/assets/t-seda.css">`,
    `<div class="cx sd${b.live ? '' : ' sd-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="sd-top"><b class="sd-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['sd-cuidado', 'Cuidado'], ['sd-medicos', 'Médicos'], ['sd-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('sd-btn', '#sd-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="sd-hero"${b.mk('hero')}><div><p class="sd-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('sd-btn', '#sd-contacto', esc(hero.cta || b.ctaTop))}</div>${photo(hero.photo, hero.photoAlt || name, 'sd-hero-img')}</section>`);
  out.push(`<section class="sd-pillars"${b.mk('trust')}>${b.trust.map((t, i) => `<div><span>${['I', 'II', 'III', 'IV'][i] || ''}</span><b>${esc(t.b)}</b><p>${esc(t.t)}</p></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="sd-care" id="sd-cuidado"${b.mk('services')}><h2>${esc(c.services?.title || 'Cuidado')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('sd-link', b.serviceHref(s), `Reservar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="sd-docs" id="sd-medicos"${b.mk('team')}><h2>${esc(c.team?.title || 'Médicos')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'sd-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="sd-quote"${b.mk('reviews')}><blockquote><p>${esc(b.reviews[0].text)}</p><cite>${esc(b.reviews[0].name)}</cite></blockquote></section>`);
  if (b.faq.length) out.push(`<section class="sd-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="sd-cta" id="sd-contacto">${photo(b.gallery[0]?.img || hero.photo, '', 'sd-cta-img')}<div><h2>Reserva tu consulta</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('sd-case')}</div></section>`);
  out.push(`<footer class="sd-foot"${b.mk('visit')}><b class="sd-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="sd-sticky">${a('sd-btn', '#sd-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
