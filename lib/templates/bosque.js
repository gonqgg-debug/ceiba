// Diseño «Bosque» para despachos que asesoran con calma (theme.style = 'bosque'), basado en Jakub
// Bartoszewicz (Polonia): paleta verde con fotos de naturaleza que transmiten tranquilidad, y una
// base de conocimiento con guías escritas por el despacho, además de las áreas y la consulta.
import { base, esc, ICON } from './base.js';

export const BOSQUE_FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Figtree:wght@400;500;600&display=swap';
const LEAF = '<svg class="bq-leaf" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 32C8 16 18 6 34 6c0 16-10 26-26 26Zm0 0L24 16"/></svg>';

export function renderBosque(c = {}, opts = {}) {
  const b = base(c, opts, '#2F5D46'), { a, photo, hero, contact, name } = b;
  const arts = c.articles?.items || [];
  const out = [`<link rel="stylesheet" href="/assets/t-bosque.css">`,
    `<div class="cx bq${b.live ? '' : ' bq-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="bq-top"><b class="bq-logo">${LEAF}${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['bq-areas', 'Áreas'], ['bq-guias', 'Guías'], ['bq-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('bq-btn', '#bq-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="bq-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'bq-hero-img')}<div><p class="bq-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('bq-btn bq-btn--w', '#bq-contacto', esc(hero.cta || b.ctaTop))}</div></section>`);
  out.push(`<section class="bq-trust"${b.mk('trust')}>${b.trust.map(t => `<div>${LEAF}<b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="bq-areas" id="bq-areas"${b.mk('services')}><div class="bq-head"><h2>${esc(c.services?.title || 'Áreas')}</h2><p>${esc(c.services?.sub || '')}</p></div><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('bq-link', b.serviceHref(s), `Consultar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (arts.length) out.push(`<section class="bq-guides" id="bq-guias"><div class="bq-head"><h2>${esc(c.articles?.title || 'Guías')}</h2><p>Respuestas claras a lo que más nos preguntan.</p></div><div>${arts.map((x, i) => `<article>${photo(b.gallery[i % Math.max(b.gallery.length, 1)]?.img, '', 'bq-g-img')}<p class="bq-kick">Guía ${String(i + 1).padStart(2, '0')}</p><h3>${esc(x.title)}</h3><p>${esc(x.desc || '')}</p>${a('bq-link', x.url || (b.waHref ? b.waMsg(`Hola, leí su guía «${x.title}» y tengo una duda`) : ''), `Leer o preguntar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="bq-team"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><p>${esc(c.team?.text || '')}</p><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'bq-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></div></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="bq-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="bq-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="bq-cta" id="bq-contacto">${photo(b.visit.photo || hero.photo, '', 'bq-cta-img')}<div><h2>Hablemos de tu caso</h2><p>${esc(c.util?.note || '')}</p>${b.caseForm('bq-case')}</div></section>`);
  out.push(`<footer class="bq-foot"${b.mk('visit')}><b class="bq-logo">${LEAF}${esc(b.brand.name || name)}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="bq-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="bq-sticky">${a('bq-btn', '#bq-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
