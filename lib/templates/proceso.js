// Diseño «Proceso» para despachos de litigio y asuntos largos (theme.style = 'proceso'), basado en
// Chand & Co (Estados Unidos): áreas de práctica explicadas a fondo (pestañas con qué incluye y
// cuándo buscarnos) y el proceso de un caso paso a paso en una línea de tiempo, para que el
// cliente sepa qué va a pasar antes de empezar.
import { base, esc, ICON } from './base.js';

export const PROCESO_FONTS = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Work+Sans:wght@400;500;600&display=swap';

export function renderProceso(c = {}, opts = {}) {
  const b = base(c, opts, '#1E3A5F'), { a, photo, hero, contact, name } = b;
  const S = b.services;
  const out = [`<link rel="stylesheet" href="/assets/t-proceso.css">`,
    `<div class="cx pr${b.live ? '' : ' pr-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<div class="pr-util"><span>${esc(c.util?.note || '')}</span><span>${b.telNum ? a('', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}</span></div><header class="pr-top"><b class="pr-logo">${esc(b.brand.name || name)}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['pr-areas', 'Áreas de práctica'], ['pr-proceso', 'El proceso'], ['pr-equipo', 'Equipo'], ['pr-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('pr-btn', '#pr-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="pr-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="pr-ctas">${a('pr-btn', '#pr-contacto', esc(hero.cta || b.ctaTop))}${a('pr-btn pr-btn--line', '#pr-proceso', 'Ver cómo es el proceso')}</div></div>${photo(hero.photo, hero.photoAlt || name, 'pr-hero-img')}</section>`);
  if (S.length) out.push(`<section class="pr-areas" id="pr-areas" data-t-tabs${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas de práctica')}</h2><div class="pr-tabwrap"><div class="pr-tabs" role="tablist" aria-label="Áreas de práctica">${S.map((s, i) => `<button type="button" role="tab" aria-selected="${!i}" aria-controls="pr-a${i}">${esc(s.name)}</button>`).join('')}</div>${S.map((s, i) => `<div class="pr-panel" role="tabpanel" id="pr-a${i}"${i ? ' hidden' : ''}><h3>${esc(s.name)}</h3><p class="pr-lede">${esc(s.desc || '')}</p>${(s.items || s.includes || []).length ? `<ul>${(s.items || s.includes).map(x => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul>` : ''}<div class="pr-when"><b>¿Cuándo buscarnos?</b><p>${esc(s.when || `Antes de firmar, contestar o pagar algo relacionado con ${String(s.name).toLowerCase()}. Una consulta a tiempo cuesta menos que corregir después.`)}</p></div>${a('pr-btn', b.serviceHref(s), `Consultar sobre ${esc(String(s.name).toLowerCase())}`)}</div>`).join('')}</div></section>`);
  if (b.steps.length) out.push(`<section class="pr-steps" id="pr-proceso"><h2>${esc(c.process?.title || 'El proceso')}</h2><p class="pr-sub">${esc(c.process?.sub || '')}</p><ol>${b.steps.map((s, i) => `<li><span class="pr-dot">${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></div></li>`).join('')}</ol></section>`);
  if (b.members.length) out.push(`<section class="pr-team" id="pr-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'pr-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${m.license ? `<p class="pr-lic">Cédula ${esc(m.license)}</p>` : ''}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="pr-revs"${b.mk('reviews')}>${b.rating ? `<p class="pr-score">${esc(b.rating.value)} ★ · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="pr-faq"><h2>Preguntas frecuentes</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="pr-cta" id="pr-contacto"><div><h2>Agenda tu primera consulta</h2><p>${esc(c.util?.note || '')}</p><ul>${b.trust.slice(0, 3).map(t => `<li>${ICON.check}${esc(t.b)}: ${esc(t.t)}</li>`).join('')}</ul></div>${b.caseForm('pr-case')}</section>`);
  out.push(`<footer class="pr-foot"${b.mk('visit')}><div><b class="pr-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p></div><div><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p>${b.mapsHref ? a('pr-link', b.mapsHref, 'Cómo llegar') : ''}</div><div class="pr-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="pr-sticky">${a('pr-btn', '#pr-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
