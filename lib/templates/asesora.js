// Diseño «Asesora» para agentes con marca personal (theme.style = 'asesora'), basado en Tracy Tutor:
// la asesora es la portada (retrato grande, su nombre en serif y una firma), cifras grandes
// sobre una foto, propiedades destacadas, su forma de trabajar y una nota firmada.
import { base, esc, ICON } from './base.js';

export const ASESORA_FONTS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Mrs+Saint+Delafield&family=Inter:wght@300;400;500&display=swap';

export function renderAsesora(c = {}, opts = {}) {
  const b = base(c, opts, '#8A6D4B'), { a, photo, hero, contact, name } = b;
  const L = b.listings.slice(0, 4), agent = c.agent || {};
  const who = agent.name || b.brand.fullName || name;
  const out = [`<link rel="stylesheet" href="/assets/t-asesora.css">`,
    `<div class="cx as${b.live ? '' : ' as-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="as-top"><b class="as-logo">${esc(String(who).toUpperCase())}</b><nav aria-label="Secciones">${[['as-props', 'Propiedades'], ['as-forma', 'Cómo trabajo'], ['as-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('as-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="as-hero"${b.mk('hero')}><div class="as-copy"><p class="as-kick">${esc(agent.role || b.brand.tagline || 'Asesoría inmobiliaria')}</p><h1>${esc(who)}</h1><p>${esc(agent.bio || hero.sub || '')}</p>${a('as-btn', b.waHref || b.bookHref, esc(hero.ctaWhatsapp || b.ctaTop))}</div>${photo(agent.photo || c.team?.photo || hero.photo, who, 'as-portrait')}</section>`);
  if ((c.stats || []).length) out.push(`<section class="as-nums"${b.mk('trust')}>${photo(hero.photo, '', 'as-nums-img')}<div>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div></section>`);
  if (L.length) out.push(`<section class="as-props" id="as-props"${b.mk('services')}><h2>Propiedades destacadas</h2><div>${L.map((l, i) => `<article class="${i === 0 ? 'as-feat' : ''}">${photo(l.img, l.title, 'as-img')}<div><p class="as-kick">${esc(l.op === 'renta' ? 'En renta' : 'En venta')} · ${esc(String(l.zone || '').split(',')[0])}</p><h3>${esc(l.title)}</h3><p>${b.lstFacts(l).map(esc).join(' · ')}</p><p class="as-price">${esc(l.price || '')}</p>${a('as-link', b.lstHref(l), `Agendar visita ${ICON.arrow('')}`)}</div></article>`).join('')}</div></section>`);
  if (b.steps.length || b.services.length) out.push(`<section class="as-way" id="as-forma"><h2>${esc(c.process?.title || 'Cómo trabajo')}</h2><ol>${(b.steps.length ? b.steps.map(s => [s.t, s.d]) : b.services.map(s => [s.name, s.desc])).map(([t, d], i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.reviews.length) out.push(`<section class="as-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(`<section class="as-note"${b.mk('team')}><p>${esc(c.team?.text || 'Te acompaño en cada paso, desde la primera visita hasta la firma.')}</p>${(c.team?.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}<p class="as-sign">${esc(String(who).split(' ')[0])}</p></section>`);
  if (b.faq.length) out.push(`<section class="as-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="as-foot" id="as-contacto"${b.mk('visit')}><div><h2>Hablemos</h2><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div>${a('as-btn', b.waHref || b.bookHref, esc(b.ctaTop))}${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar a la oficina')}</p>` : ''}</div><div class="as-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="as-sticky">${a('as-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
