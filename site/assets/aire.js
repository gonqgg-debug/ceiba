// Diseño «Aire» para terapia y consultorios de salud mental (theme.style = 'aire'), basado en Hope
// Therapy Center (Estados Unidos): diseño aireado con mucho espacio, colores suaves y un blog activo
// que explica los distintos enfoques de terapia.
import { base, esc, ICON } from './base.js';

export const AIRE_FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Karla:wght@400;500&display=swap';

export function renderAire(c = {}, opts = {}) {
  const b = base(c, opts, '#7C9A92'), { a, photo, hero, contact, name } = b;
  const arts = c.articles?.items || [];
  const out = [`<link rel="stylesheet" href="/assets/t-aire.css">`,
    `<div class="cx ai${b.live ? '' : ' ai-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ai-top"><b class="ai-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ai-enfoques', 'Enfoques'], ['ai-blog', 'Blog'], ['ai-equipo', 'Equipo'], ['ai-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ai-btn', '#ai-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ai-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><div class="ai-hrow"><p>${esc(hero.sub || '')}</p>${a('ai-btn', '#ai-contacto', esc(hero.cta || b.ctaTop))}</div>${photo(hero.photo, hero.photoAlt || name, 'ai-hero-img')}</section>`);
  if (b.services.length) out.push(`<section class="ai-ways" id="ai-enfoques"${b.mk('services')}><h2>${esc(c.services?.title || 'Cómo podemos ayudarte')}</h2><div>${b.services.map(s => `<article><span class="ai-dot" aria-hidden="true"></span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></article>`).join('')}</div></section>`);
  if (arts.length) out.push(`<section class="ai-blog" id="ai-blog"><div class="ai-head"><h2>${esc(c.articles?.title || 'Blog')}</h2><p>Lo que escribimos sobre terapia y bienestar.</p></div><div>${arts.map((x, i) => `<article class="${i ? '' : 'ai-feat'}">${photo(b.gallery[i % Math.max(b.gallery.length, 1)]?.img, '', 'ai-blog-img')}<div><p class="ai-tag">Artículo</p><h3>${esc(x.title)}</h3><p>${esc(x.desc || '')}</p>${a('ai-link', x.url || (b.waNum ? b.waMsg(`Hola, leí «${x.title}»`) : ''), `Leer ${ICON.arrow('')}`)}</div></article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="ai-team" id="ai-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><p class="ai-sub">${esc(c.team?.text || '')}</p><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'ai-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ai-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ai-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ai-cta" id="ai-contacto"><h2>Cuando estés listo, aquí estamos.</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('ai-case')}</section>`);
  out.push(`<footer class="ai-foot"${b.mk('visit')}><b class="ai-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ai-sticky">${a('ai-btn', '#ai-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
