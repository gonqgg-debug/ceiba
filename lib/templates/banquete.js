// Diseño «Banquete» para restaurantes, banquetes y catering (theme.style = 'banquete'), basado
// en Dinner Ladies: crema, letra de display con carácter, foto grande de una mesa servida con
// el título encima, franja amarilla mostaza, tarjetas con contorno para cada tipo de evento y
// enlaces subrayados con flecha. (Sus dibujos de línea son propios; aquí van fotos del cliente.)
import { base, esc, ICON } from './base.js';

export const BANQUETE_FONTS = 'https://fonts.googleapis.com/css2?family=Gloock&family=DM+Serif+Text&family=Instrument+Sans:wght@400;500;600&display=swap';

export function renderBanquete(c = {}, opts = {}) {
  const b = base(c, opts, '#E8A817'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const ask = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const events = [
    c.today && { t: c.today.title, d: c.today.text, l: 'Cotizar', h: ask(`Hola, quiero cotizar: ${c.today.title}`) },
    { t: 'Reservar mesa', d: hero.sub || 'Aparta tu mesa y te confirmamos por WhatsApp.', l: 'Reservar', h: ask(`Hola, quiero reservar una mesa en ${name}`) },
    c.shop && { t: c.shop.title, d: c.shop.text, l: 'Pedir', h: ask(`Hola, quiero pedir de ${c.shop.title}`) },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-banquete.css">`,
    `<div class="cx bq${b.live ? '' : ' bq-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="bq-top"><span class="bq-logo">${esc(b.brand.name || name)}</span><nav aria-label="Secciones">${[['bq-nosotros', 'Nosotros'], ['bq-eventos', 'Eventos'], menu.length && ['bq-carta', 'La carta'], ['bq-visita', 'Visítanos']].filter(Boolean).map(b.navLink).join('')}</nav></header>`);
  out.push(`<section class="bq-hero"${b.mk('hero')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'bq-hero-img')}<div><h1>${esc(hero.title)}</h1>${a('bq-link bq-link--y', ask(`Hola, quiero reservar en ${name}`), `${esc(b.ctaTop)} ▸`, b.mk('cta'))}</div></section>`);
  out.push(`<section class="bq-intro" id="bq-nosotros">${photo(g[1]?.img, g[1]?.alt || '', 'bq-intro-img')}<div><h2>${esc(c.intro?.title || name)}</h2>${c.story?.text ? `<p>${esc(c.story.text)}</p>` : ''}${a('bq-link', ask(`Hola, quiero saber más de ${name}`), 'Platiquemos ▸')}</div></section>`);
  if (c.statement) out.push(`<section class="bq-mustard"${b.mk('trust')}><div><h2>${esc(c.statement)}</h2>${b.trust.length ? `<ul>${b.trust.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b> — ${esc(t.t)}</li>`).join('')}</ul>` : ''}</div>${photo(g[2]?.img, g[2]?.alt || '', 'bq-mustard-img')}</section>`);
  out.push(`<section class="bq-events" id="bq-eventos">${events.map(e => `<article><h3>${esc(e.t)}</h3><p>${esc(e.d || '')}</p>${a('bq-link bq-link--y', e.h, `${esc(e.l)} ▸`)}</article>`).join('')}</section>`);
  if (menu.length) out.push(`<section class="bq-menu" id="bq-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map(m => `<div><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(i => `<p><b>${esc(i.name)}</b> <span>${esc(i.price || '')}</span>${i.desc ? `<br><small>${esc(i.desc)}</small>` : ''}</p>`).join('')}</div>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="bq-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="bq-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="bq-visit" id="bq-visita"${b.mk('visit')}><div><h2>${esc(b.visit.title || 'Visítanos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 5).map(r => `<p><b>${esc(r.dt)}</b> ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('bq-link', b.mapsHref, 'Cómo llegar ▸') : ''}${b.telNum ? a('bq-link', `tel:${b.telNum}`, `${esc(contact.phone)} ▸`) : ''}</div>${photo(b.visit.photo, b.visit.photoAlt || '', 'bq-visit-img')}</section>
  <footer class="bq-foot"><span class="bq-logo">${esc(b.brand.name || name)}</span><div>${b.legal()}</div></footer>`);
  out.push(`<div class="bq-sticky">${a('bq-btn', ask(`Hola, quiero reservar en ${name}`), esc(b.ctaTop))}${b.waNum ? a('bq-btn bq-btn--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
