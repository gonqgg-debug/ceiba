// Diseño «Perfil» para abogados con marca personal (theme.style = 'perfil'), basado en Marc Hanslin
// (Estados Unidos): una sola página con fotos en blanco y negro, el nombre en grande, textos
// que aparecen con suavidad y la trayectoria contada en pocas líneas.
import { base, esc, ICON } from './base.js';

export const PERFIL_FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=Inter+Tight:wght@300;400;500&display=swap';

export function renderPerfil(c = {}, opts = {}) {
  const b = base(c, opts, '#9A7B4F'), { a, photo, hero, contact, name } = b;
  const p = b.members[0] || { name: b.brand.fullName || name, role: b.brand.tagline, photo: hero.photo };
  const parts = String(p.name).replace(/^(Lic\.|Mtro\.|Dr\.|C\.P\.)\s*/, '').split(' ');
  const out = [`<link rel="stylesheet" href="/assets/t-perfil.css">`,
    `<div class="cx pf${b.live ? '' : ' pf-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="pf-top"><b class="pf-logo">${esc(parts.map(x => x[0]).join(''))}</b><nav aria-label="Secciones">${[['pf-sobre', 'Sobre mí'], ['pf-practica', 'Práctica'], ['pf-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('pf-btn', '#pf-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="pf-hero"${b.mk('hero')}>${photo(p.photo, p.name, 'pf-hero-img')}<div><h1><span>${esc(parts[0])}</span><span>${esc(parts.slice(1).join(' '))}</span></h1><p class="pf-role">${esc(p.role || '')}</p><p>${esc(hero.title)}</p></div></section>`);
  out.push(`<section class="pf-about" id="pf-sobre"${b.mk('team')}><p class="pf-num">01</p><div><h2>Sobre mí</h2><p class="pf-lede">${esc(hero.sub || '')}</p><p>${esc(c.team?.text || '')}</p></div></section>`);
  if ((c.stats || []).length) out.push(`<section class="pf-stats"${b.mk('trust')}>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="pf-prac" id="pf-practica"${b.mk('services')}><p class="pf-num">02</p><div><h2>Práctica</h2><ul>${b.services.map(s => `<li><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></li>`).join('')}</ul></div></section>`);
  if (b.gallery.length > 1) out.push(`<section class="pf-strip">${b.gallery.slice(0, 3).map(g => photo(g.img, g.alt || '', 'pf-s')).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="pf-revs"${b.mk('reviews')}><p class="pf-num">03</p><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="pf-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="pf-cta" id="pf-contacto"><h2>Hablemos.</h2><p>${esc(c.util?.note || '')}</p>${b.caseForm('pf-case')}<p class="pf-direct">${b.telNum ? a('', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}${b.waHref ? ` · ${a('', b.waHref, 'WhatsApp')}` : ''}</p></section>`);
  out.push(`<footer class="pf-foot"${b.mk('visit')}><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="pf-sticky">${a('pf-btn', '#pf-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
