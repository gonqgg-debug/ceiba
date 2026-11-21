// Diseño «Taberna» para bares y restaurantes con varias sucursales (theme.style = 'taberna'), basado
// en Darwin & Wallace (Portobello Pubs): barra de aviso, foto de ambiente, frase centrada, «qué
// está pasando» como tarjetas de noticias con botón de reservar, una tarjeta por sucursal con su
// propio botón y un bloque de programa de recompensas/paquete. Crema, azul marino y dorado viejo.
// Sucursales opcionales en c.locations (como en «Ciudad»); si no hay, se arma una con contact.
import { base, esc, list } from './base.js';

export const TABERNA_FONTS = 'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap';

export function renderTaberna(c = {}, opts = {}) {
  const b = base(c, opts, '#A6814C'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const ask = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const locs = (list(c.locations).length ? list(c.locations) : [{ name: b.brand.name || name, zone: (String(contact.address || '').match(/col\.?\s*([^,]+)/i) || [])[1] || b.brand.tagline, address: contact.address, photo: b.visit.photo, rows: b.rows }]).slice(0, 4);
  const news = [
    c.today && { t: c.today.title, d: c.today.text, img: g[0]?.img },
    c.shop && { t: c.shop.title, d: c.shop.text, img: g[1]?.img },
    b.trust[0] && { t: b.trust[0].b, d: b.trust[0].t, img: g[2]?.img },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-taberna.css">`,
    `<div class="cx tb${b.live ? '' : ' tb-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<p class="tb-bar">${esc(c.util?.note || hero.sub || '')}</p><header class="tb-top"><b class="tb-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['tb-noticias', 'Qué hay'], ['tb-sucursales', locs.length > 1 ? 'Sucursales' : 'Dónde'], menu.length && ['tb-carta', 'Carta']].filter(Boolean).map(b.navLink).join('')}</nav>${a('tb-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar', b.mk('cta'))}</header>`);
  out.push(`<section class="tb-hero"${b.mk('hero')}>${photo(g[3]?.img || hero.photo, g[3]?.alt || '', 'tb-hero-img')}</section><section class="tb-intro"><h1>${esc(hero.title)}</h1>${a('tb-btn', b.live ? '#tb-sucursales' : '', locs.length > 1 ? 'Ver nuestras sucursales' : 'Cómo llegar')}</section>`);
  if (news.length) out.push(`<section class="tb-news" id="tb-noticias"${b.mk('trust')}><div class="tb-head"><h2>Qué está pasando en ${esc(b.brand.name || name)}</h2></div><div class="tb-cards">${news.map(n => `<article>${photo(n.img, '', 'tb-card-img')}<h3>${esc(n.t)}</h3><p>${esc(n.d || '')}</p><div>${a('tb-btn tb-btn--sm', ask(`Hola, me interesa: ${n.t}`), 'Reservar')}${a('tb-link', ask(`Hola, quiero más información de: ${n.t}`), 'Más info ↗')}</div></article>`).join('')}</div></section>`);
  if (b.offers[0] || c.shop) { const o = b.offers[0] || { title: c.shop.title, desc: c.shop.text }; out.push(`<section class="tb-perk"><div><p class="tb-kick">${esc(o.tag || 'Para ti')}</p><h2>${esc(o.title)}</h2>${o.desc ? `<p>${esc(o.desc)}</p>` : ''}${a('tb-btn', ask(`Hola, me interesa: ${o.title}`), 'Lo quiero')}</div>${photo(g[1]?.img || hero.photo, '', 'tb-perk-img')}</section>`); }
  out.push(`<section class="tb-locs" id="tb-sucursales"${b.mk('visit')}><h2>${locs.length > 1 ? 'Nuestras sucursales' : 'Dónde estamos'}</h2><div>${locs.map(l => `<article>${photo(l.photo, l.name, 'tb-loc-img')}<div><h3>${esc(l.zone || l.name)}</h3>${l.address ? `<p>${esc(l.address)}</p>` : ''}${list(l.rows).slice(0, 3).map(r => `<p class="tb-small">${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}<div>${a('tb-btn tb-btn--sm', ask(`Hola, quiero reservar en ${l.zone || l.name}`), 'Reservar mesa')}${l.address ? a('tb-link', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`, 'Cómo llegar ↗') : ''}</div></div></article>`).join('')}</div></section>`);
  if (menu.length) out.push(`<section class="tb-menu" id="tb-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map(m => `<div><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(x => `<p><span>${esc(x.name)}</span><b>${esc(x.price || '')}</b></p>`).join('')}</div>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="tb-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="tb-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="tb-foot"><b class="tb-logo">${esc(b.brand.name || name)}</b>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}<div>${b.legal()}</div></footer>`);
  out.push(`<div class="tb-sticky">${a('tb-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar')}${b.telNum ? a('tb-btn tb-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
