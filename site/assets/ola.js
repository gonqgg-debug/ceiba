// Diseño «Ola» para clínicas (theme.style = 'ola'), basado en St. Clair Dental: hero verde
// claro con la foto y un borde de olas, títulos morados, tratamientos con íconos de línea,
// franja morada en tres columnas con botones de contorno y el horario con cepillos de colores.
import { base, esc, ICON } from './base.js';

export const OLA_FONTS = 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800&display=swap';
const LINE = ['<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.4 2.6.8 6 2.5 6 1.6 0 1.7-3.5 2.4-5.5.3-1 .6-1.5 2.1-1.5s1.8.5 2.1 1.5c.7 2 .8 5.5 2.4 5.5 1.7 0 2.1-3.4 2.5-6 .5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z"/>',
  '<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3l3 18 3-18"/>', '<path d="M8 3h8v6a4 4 0 0 1-8 0zM10 13v8M14 13v8M9 21h6"/>',
  '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>', '<path d="M4 20 15 9M14 4l6 6-3 3-6-6zM4 20l3-1-2-2z"/>', '<path d="M5 12h14M12 5v14"/>'];
const WAVES = '<svg class="ol-waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60c180 40 360 40 540 10s360-60 540-30 270 40 360 30v50H0z" fill="#fff" opacity=".45"/><path d="M0 80c200 30 380 20 560-5s380-40 560-10 240 30 320 25v30H0z" fill="#fff"/></svg>';

export function renderOla(c = {}, opts = {}) {
  const b = base(c, opts, '#5B2A86'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), groups = b.trust.slice(0, 3);
  const nav = [['ol-bienvenida', 'Nosotros'], b.members.length && ['ol-equipo', 'Doctora'], services.length && ['ol-trat', 'Tratamientos'], ['ol-horario', 'Contacto']].filter(Boolean);

  const out = [`<link rel="stylesheet" href="/assets/t-ola.css">`,
    `<div class="cx ol${b.live ? '' : ' ol-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ol-top"><b class="ol-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav>${b.telNum ? a('ol-tel', `tel:${b.telNum}`, `${ICON.phone}${esc(contact.phone)}`) : ''}</header>`);
  out.push(`<section class="ol-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'ol-hero-img')}<div class="ol-hero-copy"><h1>${esc(hero.title)}</h1>${hero.sub ? `<p class="ol-hello">${esc(hero.sub)}</p>` : ''}</div>${a('ol-book', b.bookHref, esc(hero.cta || b.ctaTop), b.mk('cta'))}${WAVES}</section>`);
  out.push(`<section class="ol-welcome" id="ol-bienvenida"><h2>Bienvenido a ${esc(b.brand.name || name)}</h2>${[c.team?.text, c.today?.text, ...(c.today?.bullets || []).slice(0, 2).map(x => x.t || x)].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}</section>`);
  if (services.length) out.push(`<section class="ol-icons" id="ol-trat"${b.mk('services')}><ul>${services.map((s, i) => `<li>${b.live ? `<a href="${esc(b.serviceHref(s))}" target="_blank" rel="noopener">` : '<span>'}<svg viewBox="0 0 24 24" aria-hidden="true">${LINE[i % LINE.length]}</svg><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<b>${esc(s.price)}</b>` : ''}${b.live ? '</a>' : '</span>'}</li>`).join('')}</ul></section>`);
  if (groups.length) out.push(`<section class="ol-band"${b.mk('trust')}><ul>${groups.map(g => `<li><h3>${esc(g.b)}</h3><p>${esc(g.t)}</p>${a('ol-out', b.bookHref, 'Agendar')}</li>`).join('')}</ul></section>`);
  if (b.members.length) out.push(`<section class="ol-team" id="ol-equipo"${b.mk('team')}>${b.members.slice(0, 3).map(m => `<figure>${photo(m.photo, m.name, 'ol-team-img')}<figcaption><b>${esc(m.name)}</b>${m.role ? `<span>${esc(m.role)}</span>` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</figcaption></figure>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="ol-revs"${b.mk('reviews')}><h2>Lo que dicen nuestros pacientes</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div>${c.reviews?.note ? `<p class="ol-note">${esc(c.reviews.note)}</p>` : ''}</section>`);
  if (b.faq.length) out.push(`<section class="ol-faq"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ol-hours" id="ol-horario"${b.mk('visit')}><div><h3>Horario y cómo llegar</h3><dl>${b.rows.slice(0, 7).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl></div>
    <div><h3>Contáctanos hoy</h3>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.telNum ? `<p>${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${contact.email ? `<p>${a('', `mailto:${contact.email}`, esc(contact.email))}</p>` : ''}<div class="ol-ctas">${a('ol-book ol-book--inline', b.bookHref, esc(b.ctaTop))}${b.mapsHref ? a('ol-out ol-out--dark', b.mapsHref, 'Cómo llegar') : ''}</div></div>
    <div class="ol-brushes" aria-hidden="true">${['#F2C14E', '#E86A92', '#5BC0EB', '#9BC53D', '#B084CC', '#5BC0EB'].map((col, i) => `<i style="--c:${col};--h:${62 + (i % 3) * 14}%"></i>`).join('')}</div></section>
    <footer class="ol-foot"><b class="ol-logo">${esc(b.brand.name || name)}</b><nav>${nav.map(b.navLink).join('')}</nav><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ol-sticky">${a('ol-book ol-book--inline', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('ol-out ol-out--dark', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
