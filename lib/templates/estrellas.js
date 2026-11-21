// Diseño «Estrellas» para clínicas de niños (theme.style = 'estrellas'), basado en The
// Little Royals: hero de cielo nocturno con estrellas que titilan y una ilustración propia
// (un diente con corona), nombre en letra manuscrita, franjas azul cielo con llamado,
// títulos manuscritos en lila, botones amarillos y una franja final amarilla.
import { base, esc, url, ICON } from './base.js';

export const ESTRELLAS_FONTS = 'https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:wght@400;500;600&family=Nunito:wght@400;600;700&display=swap';

// Ilustración original: diente sonriente con corona y una estrella
const TOOTH = `<svg class="es2-tooth" viewBox="0 0 160 150" aria-hidden="true">
  <path d="M48 26l12 14 20-20 20 20 12-14 6 30H42z" fill="#F7C45E" stroke="#2B2D52" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="60" cy="40" r="4" fill="#E58FB0"/><circle cx="80" cy="22" r="4" fill="#8FC9E8"/><circle cx="100" cy="40" r="4" fill="#E58FB0"/>
  <path d="M40 62c0-8 10-12 20-10 8 2 12 4 20 4s12-2 20-4c10-2 20 2 20 10 0 18-6 30-10 50-2 10-6 18-12 18s-8-10-10-22c-1-6-4-10-8-10s-7 4-8 10c-2 12-4 22-10 22s-10-8-12-18c-4-20-10-32-10-50z" fill="#fff" stroke="#2B2D52" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="66" cy="78" r="4" fill="#2B2D52"/><circle cx="94" cy="78" r="4" fill="#2B2D52"/>
  <path d="M68 92q12 10 24 0" fill="none" stroke="#2B2D52" stroke-width="3" stroke-linecap="round"/>
  <circle cx="58" cy="90" r="5" fill="#F5B6C9" opacity=".8"/><circle cx="102" cy="90" r="5" fill="#F5B6C9" opacity=".8"/>
  <path d="M136 30l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#F7C45E"/></svg>`;
// Estrellas del cielo: [x %, y %, tamaño px, retraso s]
const SKY = [[8, 18, 20, 0], [22, 64, 15, .8], [31, 12, 12, 1.6], [44, 80, 17, .4], [57, 22, 13, 2], [66, 70, 20, 1.2], [78, 14, 15, .6], [88, 52, 18, 1.8], [94, 84, 12, .2], [14, 86, 13, 1.4], [36, 40, 10, 2.4], [72, 40, 11, .9], [4, 48, 14, 1.1], [18, 34, 9, 2.2], [84, 28, 10, .3], [60, 88, 12, 1.7], [96, 12, 14, 2.6], [40, 6, 11, .5]];

export function renderEstrellas(c = {}, opts = {}) {
  const b = base(c, opts, '#A98BC4'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), members = b.members.slice(0, 3), reviews = b.reviews.slice(0, 3);
  const offer = b.offers[0];
  const nav = [services.length && ['es2-trat', 'Tratamientos'], members.length && ['es2-equipo', 'Doctores'], reviews.length && ['es2-papas', 'Opiniones'], ['es2-contacto', 'Contacto']].filter(Boolean);
  const star = (x, y, s, d) => `<i style="--x:${x}%;--y:${y}%;--s:${s}px;--d:${d}s"></i>`;

  const out = [`<link rel="stylesheet" href="/assets/t-estrellas.css">`,
    `<div class="cx es2${b.live ? '' : ' es2-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  out.push(`<section class="es2-hero" id="es2-inicio"${b.mk('hero')}><div class="es2-sky" aria-hidden="true">${SKY.map(s => star(...s)).join('')}<b class="es2-shoot"></b></div>
    <header class="es2-top"><span class="es2-mini">${esc(b.brand.name || name)}</span><nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav>${b.telNum ? a('es2-tel', `tel:${b.telNum}`, `${ICON.phone}${esc(contact.phone)}`) : ''}</header>
    <div class="es2-hero-copy">${TOOTH}<h1>${esc(b.brand.name || name)}</h1><p class="es2-tag">${esc(b.brand.tagline || 'Dentista para niños')}</p>
      <p class="es2-lede">${esc(hero.title)}</p>
      <div class="es2-ctas">${a('es2-btn', b.bookHref, esc(hero.cta || b.ctaTop), b.mk('cta'))}${offer ? a('es2-btn es2-btn--lilac', b.waNum ? b.waMsg(`Hola, me interesa: ${offer.title}`) : b.bookHref, esc(offer.title)) : ''}</div></div></section>`);

  // Franja azul cielo
  out.push(`<section class="es2-band"><div><p class="es2-script">${esc(c.util?.note || '¿A tu peque ya le salió su primer diente?')}</p><p class="es2-big">${esc(hero.sub || 'Ven a su primera revisión con nosotros.')}</p></div>${a('es2-out', b.bookHref, 'Agendar ahora')}</section>`);

  // Bienvenida
  out.push(`<section class="es2-intro"><div><h2>${esc(c.team?.title || `Bienvenidos a ${b.brand.name || name}`)}</h2>${[c.team?.text, c.today?.text].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}${members.length ? a('es2-btn', b.live ? '#es2-equipo' : '', 'Conoce al equipo') : ''}</div>${photo(c.team?.photo || members[0]?.photo || hero.photo, c.team?.photoAlt || '', 'es2-intro-img')}</section>`);

  // Tratamientos con íconos y títulos manuscritos
  if (services.length) out.push(`<section class="es2-trat" id="es2-trat"${b.mk('services')}><h2 class="es2-script-h">${esc(c.services.title || 'Lo que hacemos por tu peque')}</h2>${c.services.sub ? `<p class="es2-sub">${esc(c.services.sub)}</p>` : ''}
    <ul>${services.map((s, i) => `<li><span class="es2-ico" aria-hidden="true">${['★', '♛', '☾', '♥', '✦', '☀'][i % 6]}</span><div><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<p class="es2-price">${esc(s.price)}</p>` : ''}${a('es2-btn es2-btn--sm', b.serviceHref(s), 'Quiero agendar')}</div></li>`).join('')}</ul>
    ${c.services.note ? `<p class="es2-note">${esc(c.services.note)}</p>` : ''}</section>`);

  // Paquete o membresía en franja
  if (offer) out.push(`<section class="es2-band es2-band--2"><div><p class="es2-script">${esc(offer.tag || '¿Sin seguro dental?')}</p><p class="es2-big">${esc(offer.title)}${offer.price ? ` · ${esc(offer.price)}` : ''}</p>${offer.desc ? `<p class="es2-band-t">${esc(offer.desc)}</p>` : ''}</div>${a('es2-out', b.waNum ? b.waMsg(`Hola, me interesa: ${offer.title}`) : b.bookHref, 'Lo quiero')}</section>`);

  // Doctores
  if (members.length) out.push(`<section class="es2-docs" id="es2-equipo"${b.mk('team')}><h2 class="es2-script-h">Los doctores que cuidan a tu peque</h2>${members.map((m, i) => `<article class="es2-doc${i % 2 ? ' es2-doc--r' : ''}">${photo(m.photo, m.name, 'es2-doc-img')}<div><h3>${esc(m.name)}</h3>${m.role ? `<p class="es2-role">${esc(m.role)}</p>` : ''}${m.cedula ? `<p class="es2-ced">Cédula ${esc(m.cedula)}</p>` : ''}${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</div></article>`).join('')}${c.team?.note ? `<p class="es2-note">${esc(c.team.note)}</p>` : ''}</section>`);

  // Opiniones de papás
  if (reviews.length) out.push(`<section class="es2-revs" id="es2-papas"${b.mk('reviews')}><h2 class="es2-script-h">Lo que dicen los papás</h2><div class="es2-rev-list">${reviews.map(r => `<figure><blockquote>“${esc(r.text)}”</blockquote><figcaption>— ${esc(r.name)}</figcaption><span aria-label="${esc(r.stars || 5)} de 5">${ICON.star.repeat(r.stars || 5)}</span></figure>`).join('')}</div>${b.rating ? `<p class="es2-score">${esc(b.rating.value)} de 5 · ${esc(b.rating.count)} reseñas en ${esc(b.rating.source || 'Google')}</p>` : ''}${c.reviews?.note ? `<p class="es2-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Preguntas
  if (b.faq.length) out.push(`<section class="es2-faq"><h2 class="es2-script-h">Preguntas de papás</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);

  // Contacto
  out.push(`<section class="es2-contact" id="es2-contacto"${b.mk('visit')}><div class="es2-info"><h2 class="es2-script-h">Visítanos</h2>${a('es2-btn es2-btn--lilac', b.bookHref, esc(b.ctaTop))}
      ${b.telNum ? `<div><h3>Teléfono</h3>${a('', `tel:${b.telNum}`, esc(contact.phone))}</div>` : ''}${contact.address ? `<div><h3>Dirección</h3><p>${esc(contact.address)}</p>${b.mapsHref ? a('es2-link', b.mapsHref, 'Cómo llegar') : ''}</div>` : ''}${b.rows.length ? `<div><h3>Horario</h3>${b.rows.slice(0, 4).map(r => `<p><b>${esc(r.dt)}:</b> ${esc(r.dd)}</p>`).join('')}</div>` : ''}</div>
    ${b.waNum ? `<form class="es2-form" data-t-form data-intro="Hola, quiero agendar una cita para mi peque en"${b.live ? '' : ' inert'}><h3>Mándanos un mensaje</h3><input name="n" data-l="Nombre de mamá o papá" placeholder="Tu nombre" autocomplete="name" required aria-label="Tu nombre"><input name="k" data-l="Nombre y edad del peque" placeholder="Nombre y edad de tu peque" aria-label="Nombre y edad de tu peque"><textarea name="m" data-l="Mensaje" rows="3" placeholder="¿En qué te ayudamos?" aria-label="Mensaje"></textarea><button class="es2-btn" type="submit">${ICON.wa('es2-wa')}Enviar</button></form>` : ''}</section>
    <footer class="es2-foot">${b.legal()}</footer>`);
  out.push(`<div class="es2-sticky">${a('es2-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('es2-btn es2-btn--lilac', b.waHref, `${ICON.wa('es2-wa')}WhatsApp`) : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
