// Diseño «Fundadores» para despachos con historia familiar (theme.style = 'fundadores'), basado en
// Roman Austin (Estados Unidos): maquetación clásica con acentos rojos, atención en español e
// inglés, y un video (o foto) de los fundadores contando por qué abrieron el despacho.
import { base, esc, url, ICON } from './base.js';

export const FUNDADORES_FONTS = 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Roboto+Flex:opsz,wght@8..144,400;8..144,500;8..144,700&display=swap';

export function renderFundadores(c = {}, opts = {}) {
  const b = base(c, opts, '#B3122E'), { a, photo, hero, contact, name } = b;
  const M = b.members, vid = url(c.team?.video || hero.video);
  const langs = c.languages || ['Español', 'English'];
  const out = [`<link rel="stylesheet" href="/assets/t-fundadores.css">`,
    `<div class="cx fd${b.live ? '' : ' fd-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<div class="fd-util"><span>${langs.map(esc).join(' · ')}</span><span>${esc(c.util?.note || '')}</span>${b.telNum ? a('', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}</div><header class="fd-top"><b class="fd-logo">${esc(b.brand.name || name)}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['fd-historia', 'Nuestra historia'], ['fd-areas', 'Áreas'], ['fd-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('fd-btn', '#fd-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="fd-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'fd-hero-img')}<div><p class="fd-badge">Hablamos ${langs.map(esc).join(' y ')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="fd-ctas">${a('fd-btn', '#fd-contacto', esc(hero.cta || b.ctaTop))}${a('fd-btn fd-btn--w', '#fd-historia', `${ICON.play} Conoce a los fundadores`)}</div></div></section>`);
  out.push(`<section class="fd-strip"${b.mk('trust')}>${b.trust.map(t => `<div><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  out.push(`<section class="fd-story" id="fd-historia"${b.mk('team')}><div class="fd-video">${vid ? `<video src="${esc(vid)}" controls playsinline preload="none"${hero.photo ? ` poster="${esc(url(hero.photo))}"` : ''}></video>` : `<div class="fd-poster">${M.slice(0, 2).map(m => photo(m.photo, m.name, 'fd-pp')).join('')}</div>`}</div><div><p class="fd-kick">Nuestra historia</p><h2>${esc(c.team?.title || 'Los fundadores')}</h2><p>${esc(c.team?.text || '')}</p><ul>${M.map(m => `<li><b>${esc(m.name)}</b> — ${esc(m.role || '')}</li>`).join('')}</ul></div></section>`);
  if (b.services.length) out.push(`<section class="fd-areas" id="fd-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('fd-link', b.serviceHref(s), `Más información ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if ((c.stats || []).length) out.push(`<section class="fd-nums">${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="fd-revs"${b.mk('reviews')}><h2>Lo que dicen nuestros clientes</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="fd-faq"><h2>Preguntas frecuentes</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="fd-cta" id="fd-contacto"><div><h2>Consulta sin costo</h2><p>${esc(c.util?.note || '')} · ${langs.map(esc).join(' / ')}</p></div>${b.caseForm('fd-case')}</section>`);
  out.push(`<footer class="fd-foot"${b.mk('visit')}><b class="fd-logo">${esc(b.brand.name || name)}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="fd-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="fd-sticky">${b.telNum ? a('fd-btn fd-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}${a('fd-btn', '#fd-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
