// Diseño «Velo» para especialidades difíciles de explicar (neurología, psiquiatría, oncología…)
// (theme.style = 'velo'), basado en Lanham Neuro Psychology (Estados Unidos): imágenes translúcidas
// encimadas en capas suaves y textos narrativos que explican la especialidad con calma, como si
// alguien te la contara.
import { base, esc, ICON } from './base.js';

export const VELO_FONTS = 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap';

export function renderVelo(c = {}, opts = {}) {
  const b = base(c, opts, '#5B6FB5'), { a, photo, hero, contact, name } = b;
  const g = b.gallery;
  const out = [`<link rel="stylesheet" href="/assets/t-velo.css">`,
    `<div class="cx ve${b.live ? '' : ' ve-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ve-top"><b class="ve-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ve-que', 'Qué hacemos'], ['ve-proceso', 'Cómo es'], ['ve-equipo', 'Equipo'], ['ve-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ve-btn', '#ve-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ve-hero"${b.mk('hero')}><div class="ve-layers" aria-hidden="true">${photo(hero.photo, '', 've-l1')}${photo(g[0]?.img || hero.photo, '', 've-l2')}${photo(g[1]?.img || hero.photo, '', 've-l3')}</div><div class="ve-copy"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('ve-btn', '#ve-contacto', esc(hero.cta || b.ctaTop))}</div></section>`);
  if (b.services.length) out.push(`<section class="ve-story" id="ve-que"${b.mk('services')}>${b.services.map((s, i) => `<article class="ve-ch${i % 2 ? ' ve-ch--r' : ''}">${photo(g[i % Math.max(g.length, 1)]?.img || hero.photo, '', 've-ch-img')}<div><p class="ve-n">${String(i + 1).padStart(2, '0')}</p><h2>${esc(s.name)}</h2><p>${esc(s.desc || '')}</p>${a('ve-link', b.serviceHref(s), `Preguntar sobre esto ${ICON.arrow('')}`)}</div></article>`).join('')}</section>`);
  if (b.steps.length) out.push(`<section class="ve-steps" id="ve-proceso"><h2>${esc(c.process?.title || 'Cómo es el proceso')}</h2><p class="ve-sub">${esc(c.process?.sub || '')}</p><ol>${b.steps.map(s => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.members.length) out.push(`<section class="ve-team" id="ve-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 've-face')}<h3>${esc(m.name)}</h3><p class="ve-role">${esc(m.role || '')}</p>${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ve-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ve-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ve-cta" id="ve-contacto">${photo(g[2]?.img || hero.photo, '', 've-cta-img')}<div><h2>Da el primer paso</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('ve-case')}</div></section>`);
  out.push(`<footer class="ve-foot"${b.mk('visit')}><b class="ve-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ve-sticky">${a('ve-btn', '#ve-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
