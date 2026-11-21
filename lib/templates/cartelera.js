// Diseño «Cartelera» para inmobiliarias con mucho inventario (theme.style = 'cartelera'), basado en
// eXp Realty: en lugar del buscador, frases que hablan de lo que sientes al mudarte, y las
// propiedades en filas que se deslizan como en una plataforma de streaming
// («En venta», «En renta», «Lo más nuevo»), con tarjetas que crecen al pasar el cursor.
import { base, esc, ICON } from './base.js';

export const CARTELERA_FONTS = 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap';

export function renderCartelera(c = {}, opts = {}) {
  const b = base(c, opts, '#3B82F6'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const rows = [['En venta', L.filter(l => l.op === 'venta')], ['En renta', L.filter(l => l.op === 'renta')], ['Lo más nuevo', L.slice().reverse().slice(0, 6)]].filter(r => r[1].length);
  const lines = c.slogans || ['El lugar donde vas a despertar.', 'La cocina de los domingos.', 'El cuarto de los niños.'];
  const card = l => `<article${b.lstAttrs(l)}>${photo(l.img, l.title, 'ct-img')}<div class="ct-info"><b>${esc(l.price || '')}</b><h3>${esc(l.title)}</h3><p>${esc(l.zone || '')} · ${b.lstFacts(l).slice(0, 3).map(esc).join(' · ')}</p>${a('ct-btn ct-btn--sm', b.lstHref(l), `${ICON.play} Me interesa`)}</div></article>`;
  const out = [`<link rel="stylesheet" href="/assets/t-cartelera.css">`,
    `<div class="cx ct${b.live ? '' : ' ct-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ct-top"><b class="ct-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ct-filas', 'Propiedades'], ['ct-servicios', 'Servicios'], ['ct-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('ct-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ct-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'ct-hero-img')}<div><p class="ct-lines" aria-hidden="true">${lines.map(x => `<span>${esc(x)}</span>`).join('')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p><div class="ct-ctas">${a('ct-btn', '#ct-filas', `${ICON.play} ${esc(hero.cta || 'Ver propiedades')}`)}${a('ct-btn ct-btn--ghost', b.waHref, esc(hero.ctaWhatsapp || 'WhatsApp'))}</div></div></section>`);
  if (rows.length) out.push(`<section class="ct-rows" id="ct-filas"${b.mk('services')}>${rows.map(([t, items]) => `<div class="ct-row"><h2>${esc(t)} <small>${items.length}</small></h2><div class="ct-track">${items.map(card).join('')}</div></div>`).join('')}</section>`);
  if ((c.stats || []).length) out.push(`<section class="ct-stats"${b.mk('trust')}>${c.stats.map(s => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</section>`);
  if (b.services.length) out.push(`<section class="ct-serv" id="ct-servicios"><h2>${esc(c.services?.title || 'Servicios')}</h2><div>${b.services.map((s, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('ct-link', b.serviceHref(s), 'Empezar →')}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ct-revs"${b.mk('reviews')}><h2>${b.rating ? `${esc(b.rating.value)} ★ · ${esc(b.rating.count)} opiniones` : 'Opiniones'}</h2><div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="ct-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="ct-foot" id="ct-contacto"${b.mk('visit')}><b class="ct-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ct-sticky">${a('ct-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
