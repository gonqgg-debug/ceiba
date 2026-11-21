// Diseño «Atención» para despachos que atienden mucha gente (theme.style = 'atencion'), basado en
// Mission Legal Center (Estados Unidos): video en la portada (o foto en movimiento si no hay),
// el formulario de consulta muy visible desde el primer vistazo, y un botón de chat siempre a
// la mano que abre WhatsApp.
import { base, esc, url, ICON } from './base.js';

export const ATENCION_FONTS = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap';

export function renderAtencion(c = {}, opts = {}) {
  const b = base(c, opts, '#0F8B8D'), { a, photo, hero, contact, name } = b;
  const vid = url(hero.video);
  const out = [`<link rel="stylesheet" href="/assets/t-atencion.css">`,
    `<div class="cx at2${b.live ? '' : ' at2-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="an-top"><b class="an-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['an-areas', 'Servicios'], ['an-como', 'Cómo funciona'], ['an-oficina', 'Oficina']].map(b.navLink).join('')}</nav>${b.telNum ? a('an-btn an-btn--ghost', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`, b.mk('cta')) : ''}</header>`);
  out.push(`<section class="an-hero"${b.mk('hero')}>${vid ? `<video class="an-vid" src="${esc(vid)}" autoplay muted loop playsinline${hero.photo ? ` poster="${esc(url(hero.photo))}"` : ''}></video>` : photo(hero.photo, hero.photoAlt || name, 'an-hero-img')}<div class="an-copy"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><ul>${b.trust.slice(0, 3).map(t => `<li>${ICON.check}${esc(t.b)}</li>`).join('')}</ul></div><div class="an-form"><h2>Consulta gratis</h2><p>${esc(c.util?.note || 'Te contactamos hoy.')}</p>${b.caseForm('an-case')}</div></section>`);
  if (b.services.length) out.push(`<section class="an-areas" id="an-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('an-link', b.serviceHref(s), `Empezar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.steps.length) out.push(`<section class="an-how" id="an-como"><h2>${esc(c.process?.title || 'Cómo funciona')}</h2><ol>${b.steps.map((s, i) => `<li><span>${i + 1}</span><b>${esc(s.t)}</b><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.reviews.length) out.push(`<section class="an-revs"${b.mk('reviews')}>${b.rating ? `<p class="an-score"><b>${esc(b.rating.value)}</b> ★ · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="an-team"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'an-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></div></article>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="an-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="an-foot" id="an-oficina"${b.mk('visit')}><div><b class="an-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p></div><div><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div>${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}</div><div class="an-legal">${b.legal()}</div></footer>`);
  if (b.waHref) out.push(`${a('an-chat', b.waMsg(`Hola, tengo una pregunta para ${name}`), `<span>¿Te ayudamos?</span>${ICON.wa('an-wa')}`)}`);
  out.push(b.kb({}), '</div>');
  return out.join('\n');
}
