// Diseño «Miel» para terapia y consultorios amigables (theme.style = 'miel'), basado en TheraHive
// (Estados Unidos): amarillo miel, letra redondeada, dibujos de línea simples (hexágonos de panal,
// una abeja) y una barra de navegación fija con la cita a la mano.
import { base, esc, ICON } from './base.js';

export const MIEL_FONTS = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600&display=swap';
const HEX = '<svg class="ml-hex" viewBox="0 0 120 104" aria-hidden="true"><path d="M30 2h60l30 50-30 50H30L0 52Z"/></svg>';
const BEE = '<svg class="ml-bee" viewBox="0 0 64 48" aria-hidden="true"><ellipse cx="32" cy="28" rx="16" ry="12"/><path d="M26 17v22M34 16v24M42 18v20"/><path d="M24 18c-6-12-18-8-14 0 2 4 8 4 14 0ZM40 18c6-12 18-8 14 0-2 4-8 4-14 0Z"/><circle cx="16" cy="28" r="1.6"/><path d="M48 28h8"/></svg>';

export function renderMiel(c = {}, opts = {}) {
  const b = base(c, opts, '#F2B230'), { a, photo, hero, contact, name } = b;
  const out = [`<link rel="stylesheet" href="/assets/t-miel.css">`,
    `<div class="cx ml${b.live ? '' : ' ml-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ml-top"><b class="ml-logo">${BEE}${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ml-servicios', 'Servicios'], ['ml-equipo', 'Equipo'], ['ml-preguntas', 'Preguntas'], ['ml-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ml-btn', '#ml-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ml-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="ml-ctas">${a('ml-btn', '#ml-contacto', esc(hero.cta || b.ctaTop))}${a('ml-btn ml-btn--line', b.waHref, esc(hero.ctaWhatsapp || 'WhatsApp'))}</div></div><div class="ml-comb">${photo(hero.photo, hero.photoAlt || name, 'ml-comb-img')}${HEX}${HEX}${BEE}</div></section>`);
  out.push(`<section class="ml-trust"${b.mk('trust')}>${b.trust.map(t => `<div>${HEX}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="ml-serv" id="ml-servicios"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map(s => `<article><span class="ml-cell" aria-hidden="true">${HEX}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('ml-link', b.serviceHref(s), `Agendar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="ml-team" id="ml-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article><div class="ml-hexphoto">${photo(m.photo, m.name, 'ml-face')}</div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ml-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ml-faq" id="ml-preguntas"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ml-cta" id="ml-contacto">${BEE}<h2>Agenda tu cita</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('ml-case')}</section>`);
  out.push(`<footer class="ml-foot"${b.mk('visit')}><b class="ml-logo">${BEE}${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ml-sticky">${a('ml-btn', '#ml-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
