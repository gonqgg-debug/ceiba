// Diseño «Helado» para heladerías, cafés y postres (theme.style = 'helado'), basado en Malai:
// la pantalla partida en dos mitades que se deslizan en sentidos contrarios al bajar (un patrón
// de mosaico de un lado, fotos y texto del otro), bloques de color terracota, rosa y morado,
// serif elegante y un recuadro de promoción sobre la foto.
import { base, esc } from './base.js';

export const HELADO_FONTS = 'https://fonts.googleapis.com/css2?family=Italiana&family=Figtree:wght@400;500;600&display=swap';

export function renderHelado(c = {}, opts = {}) {
  const b = base(c, opts, '#C86B5A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const order = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const pics = [c.menu?.photo, ...g.map(x => x.img), hero.photo].filter(Boolean);
  const offer = b.offers[0] || (c.shop && { title: c.shop.title, desc: c.shop.text });
  const panels = [
    { t: hero.title, d: hero.sub, img: pics[0], col: 'a' },
    c.intro && { t: c.intro.title, d: c.story?.text, img: pics[1], col: 'rose' },
    c.today && { t: c.today.title, d: c.today.text, img: pics[2], col: 'plum' },
    b.visit && { t: b.visit.title || 'Visítanos', d: [contact.address, b.visit.zones].filter(Boolean).join(' · '), img: pics[3] || pics[0], col: 'a' },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-helado.css">`,
    `<div class="cx hl${b.live ? '' : ' hl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="hl-top"><nav aria-label="Secciones">${[['hl-carta', 'La carta'], ['hl-nosotros', 'Nosotros']].map(b.navLink).join('')}</nav><b class="hl-logo">${esc(b.brand.name || name)}</b><nav class="hl-r">${[['hl-visita', 'Visítanos']].map(b.navLink).join('')}${a('hl-btn hl-btn--sm', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir', b.mk('cta'))}</nav></header>`);
  // Pantalla partida: izquierda patrón y color, derecha fotos; se deslizan en sentidos contrarios
  out.push(`<section class="hl-split"${b.mk('hero')}><div class="hl-col hl-col--l">${panels.map((p, i) => `<div class="hl-cell hl-cell--${i % 2 ? 'tile' : p.col}"><div><h${i ? 2 : 1}>${esc(p.t)}</h${i ? 2 : 1}>${p.d ? `<p>${esc(p.d)}</p>` : ''}${i === 0 ? a('hl-btn', order(`Hola, quiero hacer un pedido en ${name}`), esc(hero.ctaTop || 'Pedir')) : ''}</div></div>`).join('')}</div>
    <div class="hl-col hl-col--r">${[...panels].reverse().map((p, i) => `<div class="hl-cell">${photo(p.img, '', 'hl-cell-img')}${i === panels.length - 1 && offer ? `<div class="hl-offer"><h3>${esc(offer.title)}</h3>${offer.desc ? `<p>${esc(offer.desc)}</p>` : ''}${a('hl-btn hl-btn--line', order(`Hola, me interesa: ${offer.title}`), 'Lo quiero')}</div>` : ''}</div>`).join('')}</div></section>`);
  if (menu.length) out.push(`<section class="hl-menu" id="hl-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map(m => `<div><h3>${esc(m.name)}</h3><ul>${m.items.slice(0, 6).map(i => `<li><span>${esc(i.name)}</span><b>${esc(i.price || '')}</b></li>`).join('')}</ul></div>`).join('')}</div>${a('hl-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir por WhatsApp')}</section>`);
  if (c.story?.text || b.reviews.length) out.push(`<section class="hl-plum" id="hl-nosotros"${b.mk('reviews')}><h2>${esc(c.reviews?.title || 'Lo que dicen')}</h2>${b.reviews.slice(0, 2).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="hl-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="hl-visit" id="hl-visita"${b.mk('visit')}><h2>Visítanos</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 4).map(r => `<p>${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('hl-btn hl-btn--line hl-btn--w', b.mapsHref, 'Ver ubicación') : ''}</section>
  <footer class="hl-foot"><b class="hl-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="hl-sticky">${a('hl-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir')}${b.telNum ? a('hl-btn hl-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
