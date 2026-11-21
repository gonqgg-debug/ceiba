// Diseño «Hogar» para clínicas familiares (theme.style = 'hogar'), basado en ABC Dental:
// durazno cálido con un patrón suave de íconos, un video de bienvenida de la doctora al frente
// (o su foto, si no hay video), tarjetas blancas con íconos de línea y títulos en mayúsculas
// redondeadas, una columna de testimonios en coral y la tarjeta «Platiquemos».
import { base, esc, url, ICON } from './base.js';

export const HOGAR_FONTS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Roboto+Slab:wght@300;400;600&display=swap';
const ICONS = [
  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M12 3V1M3 12H1M23 12h-2"/>',
  '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2"/>',
  '<path d="M3 12c2-3 5-3 7-1l2 2c1 1 3 1 4 0l3-3"/><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z"/>',
  '<path d="M4 15a8 8 0 1 1 3 6l-4 1 1-4"/><path d="M9 11h.01M12 11h.01M15 11h.01"/>',
];

export function renderHogar(c = {}, opts = {}) {
  const b = base(c, opts, '#E07B57'), { a, photo, hero, contact, name } = b;
  const lead = b.members[0], video = url(hero.video || c.welcomeVideo);
  const trust = b.trust.slice(0, 3), reviews = b.reviews.slice(0, 3), services = b.services.slice(0, 6);
  const cards = [
    trust[0] && { icon: 0, t: trust[0].b, k: 'Sin esperas', d: trust[0].t, l: b.ctaTop, h: b.bookHref },
    { icon: 1, t: 'Agenda tu cita', k: 'Fácil y rápido', d: hero.sub || 'Escríbenos y te damos el primer espacio disponible.', l: 'Agendar ahora', h: b.bookHref },
    (b.pay.length || b.insurers.length) && { icon: 2, t: c.payments?.title || 'Pagos que te acomodan', k: 'Formas de pago', d: c.payments?.text || [...b.pay, ...b.insurers].join(', '), l: 'Ver opciones', h: b.waNum ? b.waMsg('Hola, ¿qué formas de pago tienen?') : b.bookHref },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-hogar.css">`,
    `<div class="cx hg${b.live ? '' : ' hg-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="hg-top"><b class="hg-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[services.length && ['hg-trat', 'Tratamientos'], reviews.length && ['hg-opiniones', 'Opiniones'], ['hg-platica', 'Contacto']].filter(Boolean).map(b.navLink).join('')}</nav>${a('hg-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="hg-hero"${b.mk('hero')}><div class="hg-video">${video ? `<video src="${video}" controls playsinline preload="metadata"${url(lead?.photo || hero.photo) ? ` poster="${url(lead?.photo || hero.photo)}"` : ''}></video>` : photo(lead?.photo || hero.photo, lead?.name || name, 'hg-video-img')}
      <div class="hg-video-bar"><h1>${esc(hero.title)}</h1>${lead ? `<p>${esc(lead.name)}${lead.role ? ` · ${esc(lead.role)}` : ''}</p>` : ''}</div></div></section>`);
  out.push(`<section class="hg-cards"${b.mk('trust')}>${cards.map(k => `<article class="hg-card"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k.icon]}</svg><h2>${esc(k.t)}</h2><p class="hg-k">${esc(k.k)}</p><p>${esc(k.d)}</p>${a('hg-link', k.h, esc(k.l))}</article>`).join('')}
    ${reviews.length ? `<aside class="hg-quotes" id="hg-opiniones"${b.mk('reviews')}><h2>Lo que dicen las familias</h2>${reviews.map(r => `<blockquote><p>${esc(r.text)}</p><cite>— ${esc(r.name)}</cite></blockquote>`).join('')}${c.reviews?.note ? `<p class="hg-note">${esc(c.reviews.note)}</p>` : ''}</aside>` : ''}</section>`);
  if (services.length) out.push(`<section class="hg-trat" id="hg-trat"${b.mk('services')}><h2>${esc(c.services.title || 'Lo que hacemos por tu familia')}</h2><ul>${services.map(s => `<li>${photo(s.img, s.imgAlt || s.name, 'hg-trat-img')}<div><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<b>${esc(s.price)}</b>` : ''}${a('hg-link', b.serviceHref(s), 'Agendar')}</div></li>`).join('')}</ul></section>`);
  if (b.faq.length) out.push(`<section class="hg-faq"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="hg-chat" id="hg-platica"${b.mk('visit')}><article class="hg-card"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[3]}</svg><h2>Platiquemos</h2><p>Pregúntanos lo que quieras de la salud dental de tu familia, o solo saluda.</p>${b.telNum ? `<p class="hg-phone">${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.rows[0] ? `<p class="hg-k">${esc(b.rows[0].dt)} · ${esc(b.rows[0].dd)}</p>` : ''}${b.waNum ? a('hg-btn', b.waHref, `${ICON.wa('hg-wa')}WhatsApp`) : ''}</article>
    <div class="hg-where">${photo(b.visit.photo, 'Fachada', 'hg-where-img')}<div><h3>Visítanos</h3>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 4).map(r => `<p><b>${esc(r.dt)}:</b> ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('hg-link', b.mapsHref, 'Cómo llegar') : ''}</div></div></section>
  <footer class="hg-foot"><b class="hg-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="hg-sticky">${a('hg-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('hg-btn hg-btn--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
