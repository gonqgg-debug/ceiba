// Diseño «Glosario» para despachos que explican sus términos (theme.style = 'glosario'), basado en
// Zachmann Lawyers (Alemania): blanco y negro, el equipo rotando en la portada y un glosario
// legal de la A a la Z con índice de letras para que el cliente entienda cada término.
import { base, esc, ICON } from './base.js';

export const GLOSARIO_FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Spectral:ital,wght@0,400;1,400&display=swap';

export function renderGlosario(c = {}, opts = {}) {
  const b = base(c, opts, '#111111'), { a, photo, hero, contact, name } = b;
  const G = (c.glossary || []).slice().sort((x, y) => x.term.localeCompare(y.term, 'es'));
  const letters = [...new Set(G.map(g => g.term[0].toUpperCase().normalize('NFD')[0]))];
  const M = b.members.length ? b.members : [{ photo: hero.photo, name }];
  const out = [`<link rel="stylesheet" href="/assets/t-glosario.css">`,
    `<div class="cx gl${b.live ? '' : ' gl-still'}" style="--a:${b.accent};--n:${M.length};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="gl-top"><b class="gl-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['gl-areas', 'Áreas'], ['gl-glosario', 'Glosario A–Z'], ['gl-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('gl-btn', '#gl-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="gl-hero"${b.mk('hero')}><div class="gl-copy"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('gl-btn', '#gl-contacto', esc(hero.cta || b.ctaTop))}</div><div class="gl-rot">${M.map((m, i) => `<figure style="--i:${i}">${photo(m.photo, m.name, 'gl-rot-img')}${m.role ? `<figcaption><b>${esc(m.name)}</b>${esc(m.role)}</figcaption>` : ''}</figure>`).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="gl-areas" id="gl-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map((s, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('gl-link', b.serviceHref(s), `Consultar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (G.length) out.push(`<section class="gl-az" id="gl-glosario"><div class="gl-az-head"><h2>Glosario legal</h2><p>Los términos que vas a escuchar, explicados sin rodeos.</p><nav class="gl-letters" aria-label="Letras">${'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(l => letters.includes(l) ? a('', `#gl-l-${l}`, l) : `<span aria-disabled="true">${l}</span>`).join('')}</nav></div><dl>${G.map((g, i) => { const l = g.term[0].toUpperCase().normalize('NFD')[0]; const first = G.findIndex(x => x.term[0].toUpperCase().normalize('NFD')[0] === l) === i; return `<div${first ? ` id="gl-l-${l}"` : ''}>${first ? `<span class="gl-letter">${l}</span>` : '<span class="gl-letter"></span>'}<dt>${esc(g.term)}</dt><dd>${esc(g.def)}</dd></div>`; }).join('')}</dl></section>`);
  if (b.reviews.length) out.push(`<section class="gl-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="gl-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="gl-cta" id="gl-contacto"><h2>¿Tu término no está aquí? Pregúntanos.</h2>${b.caseForm('gl-case')}</section>`);
  out.push(`<footer class="gl-foot"${b.mk('visit')}><b class="gl-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="gl-sticky">${a('gl-btn', '#gl-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
