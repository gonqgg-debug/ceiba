// Diseño «Pregunta» para inmobiliarias que quieren verse modernas (theme.style = 'pregunta'), basado
// en Resider (Canadá): la portada es una sola caja donde escribes lo que buscas con tus palabras
// («casa de 3 recámaras en Zapopan hasta 5 millones»). La página lo entiende y filtra las
// propiedades al momento. Hay ejemplos para tocar, todo sobre azul noche con verde menta.
import { base, esc, ICON } from './base.js';

export const PREGUNTA_FONTS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

export function renderPregunta(c = {}, opts = {}) {
  const b = base(c, opts, '#5EEAD4'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const zone = String(L[0]?.zone || '').split(',').slice(-1)[0]?.trim() || '';
  const examples = c.searchExamples || [`Casa de 3 recámaras en ${zone || 'la ciudad'}`, 'Departamento en renta hasta 25 mil', 'Algo para comprar hasta 5 millones'];
  const out = [`<link rel="stylesheet" href="/assets/t-pregunta.css">`,
    `<div class="cx pq${b.live ? '' : ' pq-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="pq-top"><b class="pq-logo">${esc(b.brand.name || name)}<i>.</i></b><nav aria-label="Secciones">${[['pq-res', 'Propiedades'], ['pq-como', 'Cómo funciona'], ['pq-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('pq-btn pq-btn--ghost', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="pq-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${b.lstFilters('pq-filt', { q: true })}<div class="pq-ex"><span>Prueba:</span>${examples.map(x => `<button type="button" data-t-q="${esc(x)}">${esc(x)}</button>`).join('')}</div></section>`);
  if (L.length) out.push(`<section class="pq-res" id="pq-res"${b.mk('services')}><div class="pq-head"><h2>Resultados</h2><p data-t-count aria-live="polite"></p></div><div class="pq-grid" data-t-list>${L.map(l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'pq-img')}<div><div class="pq-row"><b>${esc(l.price || '')}</b><span class="pq-op">${esc(l.op || '')}</span></div><h3>${esc(l.title)}</h3><p>${ICON.pin}${esc(l.zone || '')}</p><p class="pq-facts">${b.lstFacts(l).map(esc).join(' · ')}</p>${a('pq-btn pq-btn--sm', b.lstHref(l), 'Me interesa')}</div></article>`).join('')}</div><p class="pq-none">¿No ves lo que buscas? ${a('pq-link', b.waHref, 'Escríbenos y te mandamos más opciones')}</p></section>`);
  if (b.steps.length) out.push(`<section class="pq-how" id="pq-como"><h2>${esc(c.process?.title || 'Cómo funciona')}</h2><ol>${b.steps.map((s, i) => `<li><span>${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  out.push(`<section class="pq-trust"${b.mk('trust')}>${(c.stats || []).map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}${b.trust.slice(0, 2).map(t => `<div><b>${ICON.check}</b><span><strong>${esc(t.b)}</strong> ${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="pq-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="pq-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="pq-foot" id="pq-contacto"${b.mk('visit')}><b class="pq-logo">${esc(b.brand.name || name)}<i>.</i></b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="pq-sticky">${a('pq-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
