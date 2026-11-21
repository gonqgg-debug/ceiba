// Diseño «Abierto» para clínicas (theme.style = 'abierto'), basado en Grandridge Dental:
// práctico y de confianza. Barra café con dirección, «abierto ahora / cerrado» en vivo y la
// calificación de Google; título en serif de losa; bloque gris con dirección, horario y mapa;
// «tu primera visita» con una caja de accesos rápidos; el equipo en tarjetas con contorno y
// tratamientos que se despliegan; adornos de cuarto de círculo turquesa.
import { base, esc, list, schedule, ICON } from './base.js';

export const ABIERTO_FONTS = 'https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap';

export function renderAbierto(c = {}, opts = {}) {
  const b = base(c, opts, '#16A096'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), sch = schedule(b.rows);
  const nav = [['ab-visita', 'Visítanos'], ['ab-primera', 'Primera visita'], b.members.length && ['ab-equipo', 'Equipo'], services.length && ['ab-trat', 'Tratamientos']].filter(Boolean);
  // Tratamientos agrupados: cada uno con sus detalles (precio y descripción) al desplegar
  const out = [`<link rel="stylesheet" href="/assets/t-abierto.css">`,
    `<div class="cx ab${b.live ? '' : ' ab-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ab-top"><details class="ab-menu"><summary aria-label="Menú"><i></i></summary><nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav></details><b class="ab-logo">${esc(b.brand.name || name)}</b>
    <div class="ab-acts">${b.telNum ? `<span class="ab-call">Llámanos: ${a('', `tel:${b.telNum}`, esc(contact.phone))}</span>` : ''}${a('ab-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</div></header>
  <div class="ab-status">${contact.address ? `<span>${esc(contact.address)}</span>` : ''}${b.telNum ? `<span><b>Teléfono</b> ${a('', `tel:${b.telNum}`, esc(contact.phone))}</span>` : ''}${sch.length ? `<span class="ab-open" data-t-open='${JSON.stringify(sch)}'>Horario</span>` : ''}${b.rating ? `<span class="ab-g"><b>G</b><i aria-hidden="true">${ICON.star.repeat(5)}</i>Calificación ${esc(b.rating.value)} · ${esc(b.rating.count)} reseñas</span>` : ''}</div>`);
  out.push(`<section class="ab-hero"${b.mk('hero')}><div class="ab-hero-copy"><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}${a('ab-btn ab-btn--lg', b.bookHref, esc(hero.cta || b.ctaTop))}</div>${photo(hero.photo, hero.photoAlt || name, 'ab-hero-img')}
    <div class="ab-pills">${b.telNum ? a('ab-pill', `tel:${b.telNum}`, `${ICON.phone}Llamar`) : ''}${a('ab-pill', b.bookHref, `${ICON.clock}${esc(b.ctaTop)}`)}</div></section>`);
  out.push(`<section class="ab-visit" id="ab-visita"${b.mk('visit')}><div><h2>Visítanos</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.telNum ? `<p><b>Teléfono:</b> ${a('ab-u', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? a('ab-pill ab-pill--sq', b.mapsHref, 'Cómo llegar') : ''}</div>
    <div><h2>Horario</h2><dl>${b.rows.slice(0, 7).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl></div>
    ${b.live && contact.address ? `<iframe class="ab-map" title="Mapa de ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&amp;output=embed"></iframe>` : photo(b.visit.photo, '', 'ab-map')}</section>`);
  const quick = [b.faq.length && ['Preguntas frecuentes', b.live ? '#ab-preguntas' : ''], (b.pay.length || b.insurers.length) && ['Formas de pago', b.live ? '#ab-pagos' : ''], b.waNum && ['Escríbenos por WhatsApp', b.waHref]].filter(Boolean);
  out.push(`<section class="ab-first" id="ab-primera"><div><p class="ab-kick">Paciente nuevo</p><h2>${esc(c.process?.title || 'Tu primera visita')}</h2><p>${esc(c.process?.sub || 'Te explicamos qué esperar para que llegues tranquilo.')}</p>
      ${b.steps.length ? `<ol>${b.steps.slice(0, 4).map(s => `<li><b>${esc(s.t)}.</b> ${esc(s.d)}</li>`).join('')}</ol>` : ''}</div>
    <div class="ab-quick"><p class="ab-kick">Accesos rápidos</p>${quick.map(([l, h]) => a('ab-pill ab-pill--wide', h, esc(l))).join('')}${b.telNum ? `<p>¿Más dudas? Llámanos al ${a('ab-u', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}</div></section>`);
  if (b.members.length) out.push(`<section class="ab-team" id="ab-equipo"${b.mk('team')}><h2>Conoce al equipo</h2><ul>${b.members.slice(0, 4).map(m => `<li>${photo(m.photo, m.name, 'ab-team-img')}<h3>${esc(m.name)}</h3>${m.role ? `<p>${esc(m.role)}</p>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</li>`).join('')}</ul></section>`);
  if (services.length) out.push(`<section class="ab-trat" id="ab-trat"${b.mk('services')}><i class="ab-q ab-q--tr" aria-hidden="true"></i><i class="ab-q ab-q--bl" aria-hidden="true"></i><p class="ab-kick">Tratamientos</p><h2>${esc(c.services.title || 'Atención de calidad y cómoda')}</h2>${c.services.sub ? `<p class="ab-sub">${esc(c.services.sub)}</p>` : ''}
    <ul>${services.map(s => `<li><details><summary><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}<span class="ab-chev" aria-hidden="true">${ICON.chev}</span></summary><div>${s.price ? `<p><b>Precio:</b> ${esc(s.price)}</p>` : ''}${a('ab-u', b.serviceHref(s), `Agendar ${esc(s.name.toLowerCase())}`)}</div></details></li>`).join('')}</ul>
    ${list(c.services.more).length ? `<p class="ab-more">También: ${list(c.services.more).map(esc).join(' · ')}</p>` : ''}</section>`);
  if (b.pay.length || b.insurers.length) out.push(`<section class="ab-pay" id="ab-pagos"><h2>Formas de pago</h2>${c.payments?.text ? `<p>${esc(c.payments.text)}</p>` : ''}<ul>${[...b.pay, ...b.insurers].map(x => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul></section>`);
  if (b.faq.length) out.push(`<section class="ab-faq" id="ab-preguntas"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="ab-foot"><div>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${a('ab-btn', b.bookHref, esc(b.ctaTop))}</div><nav>${nav.map(b.navLink).join('')}</nav><div class="ab-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="ab-sticky">${a('ab-btn', b.bookHref, esc(b.ctaTop))}${b.telNum ? a('ab-pill', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
