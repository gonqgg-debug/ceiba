// Diseño «Clara» para clínicas (theme.style = 'clara'), basado en la nota de Cox Bond Dental
// del documento de referencias: «look profesional y limpio, todo accesible desde la portada».
// La portada como tablero: título y, al lado, mosaicos con todo lo que la gente busca
// (agendar, horario de hoy en vivo, llamar, cómo llegar, precios, urgencias); después cada
// sección con su índice fijo a la izquierda. Líneas finas, azul marino y mucho aire.
import { base, esc, schedule, ICON } from './base.js';

export const CLARA_FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Serif:wght@400;500&display=swap';

export function renderClara(c = {}, opts = {}) {
  const b = base(c, opts, '#1D3D6E'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 8), sch = schedule(b.rows), priced = services.filter(s => s.price);
  const sections = [services.length && ['cl-trat', 'Tratamientos'], b.steps.length && ['cl-visita', 'Tu primera visita'], b.members.length && ['cl-equipo', 'Equipo'], b.reviews.length && ['cl-opiniones', 'Opiniones'], b.faq.length && ['cl-preguntas', 'Preguntas'], ['cl-contacto', 'Contacto']].filter(Boolean);
  const tiles = [
    ['Agendar', b.ctaTop, b.bookHref, ICON.clock, true],
    sch.length && ['Hoy', '', '', ICON.clock, false, true],
    b.telNum && ['Llamar', contact.phone, `tel:${b.telNum}`, ICON.phone],
    b.mapsHref && ['Cómo llegar', String(contact.address || '').split(',').slice(0, 2).join(','), b.mapsHref, ICON.pin],
    priced.length && ['Precios', `${priced.length} tratamientos con precio`, b.live ? '#cl-trat' : '', ICON.check],
    c.util?.note && ['Urgencias', c.util.note, b.waNum ? b.waMsg('Hola, tengo una urgencia') : b.bookHref, ICON.phone],
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-clara.css">`,
    `<div class="cx cl${b.live ? '' : ' cl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="cl-top"><b class="cl-logo">${esc(b.brand.fullName || name)}</b><nav aria-label="Secciones">${sections.map(b.navLink).join('')}</nav>${a('cl-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="cl-dash"${b.mk('hero')}><div class="cl-dash-copy"><p class="cl-kick">${esc(b.brand.tagline || 'Clínica dental')}${contact.address ? ` · ${esc(String(contact.address).split(',').slice(-1)[0].trim())}` : ''}</p><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}${photo(hero.photo, hero.photoAlt || name, 'cl-dash-img')}</div>
    <ul class="cl-tiles">${tiles.map(([k, v, h, ic, main, live]) => `<li class="${main ? 'cl-tile--main' : ''}">${live ? `<span class="cl-tile"><small>${ic}${k}</small><b data-t-open='${JSON.stringify(sch)}'>Horario</b><span>${b.rows.slice(0, 2).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</span></span>` : a('cl-tile', h, `<small>${ic}${esc(k)}</small><b>${esc(v || k)}</b><span class="cl-go">${ICON.arrow('cl-arr')}</span>`)}</li>`).join('')}</ul></section>`);
  out.push(`<div class="cl-body"><aside class="cl-index" aria-label="En esta página"><p>En esta página</p>${sections.map(([id, l], i) => (b.live ? `<a href="#${id}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(l)}</a>` : `<span><span>${String(i + 1).padStart(2, '0')}</span>${esc(l)}</span>`)).join('')}</aside><div class="cl-main">`);
  if (services.length) out.push(`<section class="cl-sec" id="cl-trat"${b.mk('services')}><h2>${esc(c.services.title || 'Tratamientos')}</h2>${c.services.sub ? `<p class="cl-lede">${esc(c.services.sub)}</p>` : ''}<table class="cl-table"><thead><tr><th scope="col">Tratamiento</th><th scope="col">Qué incluye</th><th scope="col">Precio</th><th><span class="cl-sr">Agendar</span></th></tr></thead><tbody>${services.map(s => `<tr><th scope="row">${esc(s.name)}</th><td>${esc(s.desc || '')}</td><td>${esc(s.price || '—')}</td><td>${a('cl-mini', b.serviceHref(s), 'Agendar')}</td></tr>`).join('')}</tbody></table>${c.services.note ? `<p class="cl-note">${esc(c.services.note)}</p>` : ''}</section>`);
  if (b.steps.length) out.push(`<section class="cl-sec" id="cl-visita"><h2>${esc(c.process?.title || 'Tu primera visita')}</h2>${c.process?.sub ? `<p class="cl-lede">${esc(c.process.sub)}</p>` : ''}<ol class="cl-steps">${b.steps.map(s => `<li><b>${esc(s.t)}</b><p>${esc(s.d)}</p></li>`).join('')}</ol></section>`);
  if (b.members.length) out.push(`<section class="cl-sec" id="cl-equipo"${b.mk('team')}><h2>${esc(c.team?.title || 'Equipo')}</h2>${c.team?.text ? `<p class="cl-lede">${esc(c.team.text)}</p>` : ''}<ul class="cl-people">${b.members.slice(0, 6).map(m => `<li>${photo(m.photo, m.name, 'cl-person')}<div><b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula profesional ${esc(m.cedula)}</small>` : ''}</div></li>`).join('')}</ul></section>`);
  if (b.reviews.length) out.push(`<section class="cl-sec" id="cl-opiniones"${b.mk('reviews')}><h2>Opiniones</h2>${b.rating ? `<p class="cl-lede"><b>${esc(b.rating.value)}</b> de 5 · ${esc(b.rating.count)} reseñas en ${esc(b.rating.source || 'Google')}</p>` : ''}<div class="cl-quotes">${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}${r.meta ? ` · ${esc(r.meta)}` : ''}</cite></blockquote>`).join('')}</div>${c.reviews?.note ? `<p class="cl-note">${esc(c.reviews.note)}</p>` : ''}</section>`);
  if (b.faq.length) out.push(`<section class="cl-sec" id="cl-preguntas"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 8).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="cl-sec" id="cl-contacto"${b.mk('visit')}><h2>Contacto</h2><div class="cl-contact"><dl>${contact.address ? `<div><dt>Dirección</dt><dd>${esc(contact.address)}</dd></div>` : ''}${b.telNum ? `<div><dt>Teléfono</dt><dd>${a('', `tel:${b.telNum}`, esc(contact.phone))}</dd></div>` : ''}${contact.email ? `<div><dt>Correo</dt><dd>${a('', `mailto:${contact.email}`, esc(contact.email))}</dd></div>` : ''}${b.rows.map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>
    <div class="cl-ctas">${a('cl-btn', b.bookHref, esc(b.ctaTop))}${b.mapsHref ? a('cl-btn cl-btn--line', b.mapsHref, 'Cómo llegar') : ''}</div></div></section></div></div>
  <footer class="cl-foot">${b.legal()}</footer>`);
  out.push(`<div class="cl-sticky">${a('cl-btn', b.bookHref, esc(b.ctaTop))}${b.telNum ? a('cl-btn cl-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
