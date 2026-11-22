// Diseño «Portal» para consultorios y clínicas con varias especialidades (theme.style = 'portal'),
// basado en Goodall-Witcher Healthcare (Estados Unidos): el acceso al portal del paciente y la
// agenda de citas viven en el encabezado; estructura simple y ordenada con azul institucional,
// para que cualquier persona encuentre lo que busca rápido.
import { base, esc, ICON } from './base.js';

export const PORTAL_FONTS = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600&display=swap';

export function renderPortal(c = {}, opts = {}) {
  const b = base(c, opts, '#1F5AA6'), { a, photo, hero, contact, name } = b;
  const portal = c.portalUrl || (b.waNum ? b.waMsg(`Hola, quiero consultar mi expediente en ${name}`) : '');
  const out = [`<link rel="stylesheet" href="/assets/t-portal.css">`,
    `<div class="cx po${b.live ? '' : ' po-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="po-top"><div class="po-bar"><b class="po-logo">${esc(b.brand.fullName || name)}</b><div class="po-acts">${a('po-btn po-btn--line', portal, `${ICON.check} Portal del paciente`)}${a('po-btn', b.waHref || b.bookHref, `${ICON.clock} ${esc(b.ctaTop)}`, b.mk('cta'))}</div></div><nav aria-label="Secciones">${[['po-especialidades', 'Especialidades'], ['po-medicos', 'Médicos'], ['po-pacientes', 'Pacientes'], ['po-ubicacion', 'Ubicación y horario']].map(b.navLink).join('')}${b.telNum ? a('po-tel', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}</nav></header>`);
  out.push(`<section class="po-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'po-hero-img')}<div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="po-ctas">${a('po-btn', b.waHref || b.bookHref, esc(hero.cta || b.ctaTop))}${a('po-btn po-btn--w', portal, 'Ver mis resultados')}</div></div></section>`);
  out.push(`<section class="po-tiles"${b.mk('trust')}>${b.trust.map(t => `<div><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="po-spec" id="po-especialidades"${b.mk('services')}><h2>${esc(c.services?.title || 'Especialidades')}</h2><ul>${b.services.map(s => `<li>${a('po-row', b.serviceHref(s), `<b>${esc(s.name)}</b><span>${esc(s.desc || '')}</span>${ICON.arrow('')}`)}</li>`).join('')}</ul></section>`);
  if (b.members.length) out.push(`<section class="po-team" id="po-medicos"${b.mk('team')}><h2>${esc(c.team?.title || 'Médicos')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'po-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${a('po-link', b.waNum ? b.waMsg(`Hola, quiero una cita con ${m.name}`) : b.bookHref, 'Agendar con este médico')}</article>`).join('')}</div></section>`);
  out.push(`<section class="po-pat" id="po-pacientes"><div><h2>Para pacientes</h2><ul><li><b>Antes de tu cita</b>Llega 10 minutos antes con tu identificación${b.insurers.length ? ` y tu póliza (${b.insurers.map(esc).join(', ')})` : ''}.</li><li><b>Resultados</b>Te los enviamos por WhatsApp o los consultas en el portal.</li><li><b>Pagos</b>${b.pay.length ? b.pay.map(esc).join(', ') : 'Efectivo y tarjeta'}.</li></ul></div><div class="po-faq">${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="po-revs"${b.mk('reviews')}>${b.rating ? `<p><b>${esc(b.rating.value)}</b> de 5 · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  out.push(`<footer class="po-foot" id="po-ubicacion"${b.mk('visit')}><div><b class="po-logo">${esc(b.brand.fullName || name)}</b><p>${esc(contact.address || '')}</p>${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}</div><div><b>Horario</b>${b.rows.map(r => `<p>${esc(r.dt)}: ${esc(r.dd)}</p>`).join('')}</div><div><b>Contacto</b>${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${contact.email ? `<p>${esc(contact.email)}</p>` : ''}</div><div class="po-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="po-sticky">${a('po-btn po-btn--line', portal, 'Portal')}${a('po-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
