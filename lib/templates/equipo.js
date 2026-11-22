// Diseño «Equipo» para clínicas con varios especialistas (theme.style = 'equipo'), basado en Deia
// Health (Reino Unido): los llamados a agendar aparecen de forma natural dentro del texto (no como
// botones gritones) y las biografías del equipo con foto, cédula y «agendar con…» son el centro.
import { base, esc, ICON } from './base.js';

export const EQUIPO_FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap';

export function renderEquipo(c = {}, opts = {}) {
  const b = base(c, opts, '#C2533A'), { a, photo, hero, contact, name } = b;
  const M = b.members;
  const book = (txt, who) => a('eq-inline', b.waNum ? b.waMsg(`Hola, quiero una cita${who ? ` con ${who}` : ''} en ${name}`) : b.bookHref, txt);
  const out = [`<link rel="stylesheet" href="/assets/t-equipo.css">`,
    `<div class="cx eq${b.live ? '' : ' eq-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="eq-top"><b class="eq-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['eq-equipo', 'Equipo'], ['eq-servicios', 'Servicios'], ['eq-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('eq-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="eq-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1><p class="eq-lede">${esc(hero.sub || '')} ${book('Agenda tu primera consulta', '')} cuando quieras, o ${a('eq-inline', '#eq-equipo', 'conoce primero al equipo')}.</p><div class="eq-faces">${M.map(m => photo(m.photo, m.name, 'eq-mini')).join('')}<span>${M.length} especialistas · ${b.rating ? `★ ${esc(b.rating.value)} en ${esc(b.rating.source || 'Google')}` : ''}</span></div></section>`);
  if (M.length) out.push(`<section class="eq-team" id="eq-equipo"${b.mk('team')}>${M.map((m, i) => `<article class="eq-p${i % 2 ? ' eq-p--r' : ''}">${photo(m.photo, m.name, 'eq-photo')}<div><p class="eq-role">${esc(m.role || '')}</p><h2>${esc(m.name)}</h2><p>${esc(m.bio || '')}</p>${m.license ? `<p class="eq-lic">Cédula profesional ${esc(m.license)}</p>` : ''}<p>${book(`Agendar con ${esc(String(m.name).split(' ').slice(0, 2).join(' '))} ${ICON.arrow('')}`, m.name)}</p></div></article>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="eq-serv" id="eq-servicios"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><ul>${b.services.map(s => `<li><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')} ${a('eq-inline', b.serviceHref(s), 'Agendar')}.</p></li>`).join('')}</ul></section>`);
  if (b.reviews.length) out.push(`<section class="eq-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="eq-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="eq-cta" id="eq-contacto"><div><h2>¿Con quién te gustaría empezar?</h2><p>Si no sabes, ${book('escríbenos', '')} y te recomendamos al especialista indicado.</p></div>${b.apptForm('eq-case')}</section>`);
  out.push(`<footer class="eq-foot"${b.mk('visit')}><b class="eq-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="eq-sticky">${a('eq-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
