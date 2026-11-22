// Diseño «Análisis» para laboratorios y chequeos (theme.style = 'analisis'), basado en Function Health
// (Estados Unidos): gráficas animadas simples (barras y rangos que se llenan) y un catálogo de
// análisis que se filtra por categoría con un toque, cada uno con su precio y «agendar».
import { base, esc, ICON } from './base.js';

export const ANALISIS_FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&display=swap';

export function renderAnalisis(c = {}, opts = {}) {
  const b = base(c, opts, '#FF6A3D'), { a, photo, hero, contact, name } = b;
  const T = c.tests?.items || [];
  const cats = [...new Set(T.map(t => t.cat).filter(Boolean))];
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '');
  const style = `<style>${cats.map(k => `.an2-shop:has(#an2-${slug(k)}:checked) .an2-grid>[data-cat]:not([data-cat="${slug(k)}"]){display:none}`).join('')}</style>`;
  const bars = [['Glucosa', 62], ['Colesterol', 48], ['Hierro', 71], ['Vitamina D', 34], ['Tiroides', 55]];
  const out = [`<link rel="stylesheet" href="/assets/t-analisis.css">`, style,
    `<div class="cx an2${b.live ? '' : ' an2-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ay-top"><b class="ay-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ay-catalogo', 'Análisis'], ['ay-como', 'Cómo funciona'], ['ay-contacto', 'Agendar']].map(b.navLink).join('')}</nav>${a('ay-btn', '#ay-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ay-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('ay-btn', '#ay-catalogo', 'Ver análisis')}</div><div class="ay-chart" aria-hidden="true"><p class="ay-ct">Tu salud, en números</p>${bars.map(([k, v], i) => `<div class="ay-row"><span>${k}</span><i style="--v:${v}%;--d:${i * .12}s"><b></b></i></div>`).join('')}</div></section>`);
  if (T.length) out.push(`<section class="ay-cat an2-shop" id="ay-catalogo"${b.mk('services')}><div class="ay-head"><h2>${esc(c.tests?.title || 'Análisis')}</h2><fieldset class="ay-chips"><legend class="t-sr">Categoría</legend><label><input type="radio" name="an2c" checked><span>Todos</span></label>${cats.map(k => `<label><input type="radio" name="an2c" id="an2-${slug(k)}"><span>${esc(k)}</span></label>`).join('')}</fieldset></div><div class="an2-grid">${T.map(t => `<article data-cat="${slug(t.cat || '')}"><p class="ay-tag">${esc(t.cat || '')}</p><h3>${esc(t.name)}</h3><p>${esc(t.desc || '')}</p><div class="ay-pr"><b>${esc(t.price || '')}</b>${a('ay-link', b.waNum ? b.waMsg(`Hola, quiero agendar: ${t.name}`) : b.bookHref, `Agendar ${ICON.arrow('')}`)}</div></article>`).join('')}</div></section>`);
  if (b.steps.length) out.push(`<section class="ay-how" id="ay-como"><h2>${esc(c.process?.title || 'Cómo funciona')}</h2><ol>${b.steps.map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  out.push(`<section class="ay-nums"${b.mk('trust')}>${(c.stats || []).map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="ay-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ay-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ay-cta" id="ay-contacto"><h2>Agenda tu toma de muestra</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('ay-case')}</section>`);
  out.push(`<footer class="ay-foot"${b.mk('visit')}><b class="ay-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ay-sticky">${a('ay-btn', '#ay-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
