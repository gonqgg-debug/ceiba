// Diseño «Resultados» para despachos de litigio con números que mostrar (theme.style = 'resultados'),
// basado en Richard Hollawell (Estados Unidos): un menú grande que despliega todas las áreas,
// resultados en números, y la consulta gratis en una ventana que se abre desde cualquier botón
// (nunca sola, para no estorbar).
import { base, esc, ICON } from './base.js';

export const RESULTADOS_FONTS = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Source+Sans+3:wght@400;600;700&display=swap';

export function renderResultados(c = {}, opts = {}) {
  const b = base(c, opts, '#E0782F'), { a, photo, hero, contact, name } = b;
  const R = c.results || c.stats || [];
  const open = (cls, label) => (b.live ? `<button type="button" class="${cls}" data-t-dlg="rs2-dlg" aria-haspopup="dialog">${label}</button>` : `<span class="${cls}">${label}</span>`);
  const out = [`<link rel="stylesheet" href="/assets/t-resultados.css">`,
    `<div class="cx re${b.live ? '' : ' re-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="re-top"><b class="re-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones"><details class="re-mega"><summary>Áreas de práctica ${ICON.chev}</summary><div class="re-mega-in">${b.services.map(s => `<div>${a('re-mega-a', b.serviceHref(s), `<b>${esc(s.name)}</b><span>${esc(s.desc || '')}</span>`)}</div>`).join('')}</div></details>${[['re-resultados', 'Resultados'], ['re-equipo', 'Equipo'], ['re-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${b.telNum ? a('re-tel', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}${open('re-btn', esc(b.ctaTop))}</header>`);
  out.push(`<section class="re-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 're-hero-img')}<div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="re-ctas">${open('re-btn re-btn--big', 'Consulta gratis')}${b.rating ? `<span class="re-g">★ ${esc(b.rating.value)} · ${esc(b.rating.count)} opiniones</span>` : ''}</div></div></section>`);
  if (R.length) out.push(`<section class="re-nums" id="re-resultados"${b.mk('trust')}>${R.map(r => `<div><b>${esc(r.value)}</b><span>${esc(r.label)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="re-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('re-link', b.serviceHref(s), `Consultar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="re-team" id="re-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 're-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="re-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="re-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="re-cta" id="re-contacto"><h2>¿Tienes un caso? Revisémoslo sin costo.</h2>${open('re-btn re-btn--big', 'Pedir consulta gratis')}</section>`);
  out.push(`<footer class="re-foot"${b.mk('visit')}><b class="re-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<dialog class="t-dlg re-dlg" id="rs2-dlg" aria-label="Consulta gratis"><div class="re-dlg-in"><button type="button" class="re-x" data-t-close aria-label="Cerrar">×</button><h2>Consulta gratis</h2><p>${esc(c.util?.note || 'Cuéntanos tu caso y te contactamos hoy.')}</p>${b.caseForm('re-case')}</div></dialog>`);
  out.push(`<div class="re-sticky">${b.telNum ? a('re-btn re-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}${open('re-btn', 'Consulta gratis')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
