// Diseño «Accesos» para consultorios con muchos pacientes recurrentes (theme.style = 'accesos'),
// basado en Anna Family Healthcare (Estados Unidos): arriba, accesos rápidos para quien ya es
// paciente (agendar, resultados, recetas, formularios) y una sección de formularios descargables
// para llegar con todo listo a la primera cita.
import { base, esc, url, ICON } from './base.js';

export const ACCESOS_FONTS = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,800&display=swap';
const IC = {
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  lab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
  rx: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M12 11v6M9 14l3 3 3-3"/></svg>',
};

export function renderAccesos(c = {}, opts = {}) {
  const b = base(c, opts, '#2F7A6B'), { a, photo, hero, contact, name } = b;
  const F = c.forms || [];
  const quick = [
    ['cal', 'Agendar cita', b.waHref || b.bookHref, 'En línea o por WhatsApp'],
    ['lab', 'Mis resultados', b.waNum ? b.waMsg(`Hola, quiero recibir mis resultados de ${name}`) : '', 'Te los mandamos por WhatsApp'],
    ['rx', 'Renovar receta', b.waNum ? b.waMsg('Hola, necesito renovar mi receta') : '', 'Para tratamientos continuos'],
    ['doc', 'Formularios', '#ac-formularios', 'Llénalos antes de tu cita'],
  ];
  const out = [`<link rel="stylesheet" href="/assets/t-accesos.css">`,
    `<div class="cx ac${b.live ? '' : ' ac-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<div class="ac-util"><span>${esc(c.util?.note || '')}</span>${b.telNum ? a('', `tel:${b.telNum}`, `${ICON.phone} ${esc(contact.phone)}`) : ''}</div><header class="ac-top"><b class="ac-logo">${esc(b.brand.name || name)}<small>${esc(b.brand.tagline || '')}</small></b><nav aria-label="Secciones">${[['ac-servicios', 'Servicios'], ['ac-medicos', 'Médicos'], ['ac-formularios', 'Pacientes'], ['ac-ubicacion', 'Ubicación']].map(b.navLink).join('')}</nav>${a('ac-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ac-quick" aria-label="Accesos rápidos para pacientes">${quick.map(([ic, t, h, d]) => a('ac-q', h, `${IC[ic]}<span><b>${t}</b><small>${d}</small></span>`)).join('')}</section>`);
  out.push(`<section class="ac-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="ac-ctas">${a('ac-btn', b.waHref || b.bookHref, esc(hero.cta || b.ctaTop))}${b.rating ? `<span class="ac-g">★ ${esc(b.rating.value)} · ${esc(b.rating.count)} opiniones en ${esc(b.rating.source || 'Google')}</span>` : ''}</div></div>${photo(hero.photo, hero.photoAlt || name, 'ac-hero-img')}</section>`);
  if (b.services.length) out.push(`<section class="ac-serv" id="ac-servicios"${b.mk('services')}><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('ac-link', b.serviceHref(s), `Agendar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="ac-team" id="ac-medicos"${b.mk('team')}><h2>${esc(c.team?.title || 'Médicos')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'ac-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${m.license ? `<small>Cédula ${esc(m.license)}</small>` : ''}</div></article>`).join('')}</div></section>`);
  out.push(`<section class="ac-forms" id="ac-formularios"><div><h2>Antes de tu cita</h2><p>Descarga y llena estos formularios para que tu consulta empiece a tiempo. Si no puedes imprimirlos, los llenas aquí al llegar.</p>${b.insurers.length ? `<p class="ac-ins"><b>Seguros que aceptamos:</b> ${b.insurers.map(esc).join(', ')}</p>` : ''}</div><ul>${F.map(f => `<li>${IC.doc}<span>${esc(f.name)}</span>${url(f.url) ? a('ac-link', f.url, 'Descargar') : a('ac-link', b.waNum ? b.waMsg(`Hola, ¿me pueden mandar el formulario «${f.name}»?`) : '', 'Pedir por WhatsApp')}</li>`).join('')}</ul></section>`);
  if (b.reviews.length) out.push(`<section class="ac-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="ac-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ac-visit" id="ac-ubicacion"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'ac-visit-img')}<div><h2>${esc(b.visit.title || 'Ubicación')}</h2><p>${esc(contact.address || '')}</p>${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}<dl>${b.rows.map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>${b.mapsHref ? a('ac-link', b.mapsHref, `Cómo llegar ${ICON.arrow('')}`) : ''}</div></section>`);
  out.push(`<footer class="ac-foot"><b class="ac-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ac-sticky">${a('ac-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
