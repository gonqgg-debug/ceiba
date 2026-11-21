// Diseño «Bowl» para restaurantes de comida saludable, para llevar y entrega (theme.style = 'bowl'),
// basado en The Salad Project: foto macro gigante de un ingrediente con una frase corta, beige
// claro, la carta como tienda con filtros por etiqueta y un panel de detalle del platillo
// elegido (descripción, precio y etiquetas) con botón para pedir por WhatsApp.
import { base, esc, ICON } from './base.js';

export const BOWL_FONTS = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap';

export function renderBowl(c = {}, opts = {}) {
  const b = base(c, opts, '#2F6B4F'), { a, photo, hero, contact, name } = b;
  const dishes = b.dishes.slice(0, 16), cats = [...new Set(dishes.map(d => d.cat))], g = b.gallery;
  const order = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const pics = [c.menu?.photo, ...g.map(x => x.img), hero.photo].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-bowl.css">`,
    `<div class="cx bw${b.live ? '' : ' bw-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="bw-top"><b class="bw-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['bw-carta', 'Carta'], ['bw-nosotros', 'Nosotros'], ['bw-visita', 'Dónde']].map(b.navLink).join('')}</nav>${a('bw-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir', b.mk('cta'))}</header>`);
  out.push(`<section class="bw-hero"${b.mk('hero')}>${photo(pics[0], c.menu?.photoAlt || '', 'bw-hero-img')}<div><h1>${esc(hero.title)}</h1>${a('bw-btn bw-btn--light', order(`Hola, quiero hacer un pedido en ${name}`), esc(hero.ctaTop || 'Pedir ahora'))}</div></section>`);
  out.push(`<section class="bw-intro" id="bw-nosotros"><div><p class="bw-tag">${ICON.check}${esc(b.trust[0]?.b || 'Hecho al momento')}</p><h2>${esc(c.intro?.title || hero.sub || '')}</h2>${a('bw-btn bw-btn--line', b.live ? '#bw-carta' : '', 'Ver la carta')}</div>${photo(pics[1], '', 'bw-intro-img')}</section>`);
  if (dishes.length) out.push(`<section class="bw-shop" id="bw-carta"${b.mk('services')}><div class="bw-shop-head"><h2>${esc(c.menu?.title || 'La carta')}</h2><div class="bw-filters" role="tablist" aria-label="Categorías">${['Todo', ...cats].map((k, i) => `<button type="button" role="tab" aria-selected="${!i}" data-bw-cat="${i ? esc(k) : ''}">${esc(k)}</button>`).join('')}</div></div>
    <div class="bw-shop-in"><ul class="bw-grid">${dishes.map((d, i) => `<li data-cat="${esc(d.cat)}"><button type="button" class="bw-item" data-bw-pick="${i}" aria-pressed="${!i}">${photo(pics[(i % (pics.length - 1)) + 1] || pics[0], '', 'bw-item-img')}<b>${esc(d.name)}</b><span>${esc(d.price || '')}</span></button></li>`).join('')}</ul>
      <aside class="bw-panel" aria-live="polite">${dishes.map((d, i) => `<div data-bw-det="${i}"${i ? ' hidden' : ''}><p class="bw-cat">${esc(d.cat)}</p><h3>${esc(d.name)}</h3>${d.desc ? `<p>${esc(d.desc)}</p>` : ''}${(d.tags || []).length ? `<ul class="bw-tags">${d.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}<p class="bw-price">${esc(d.price || '')}</p>${a('bw-btn bw-btn--block', order(`Hola, quiero pedir: ${d.name}`), `${ICON.wa('bw-wa')}Pedir por WhatsApp`)}</div>`).join('')}</aside></div></section>`);
  if (b.trust.length) out.push(`<section class="bw-trust"${b.mk('trust')}>${b.trust.slice(0, 4).map(t => `<div><b>${esc(t.b)}</b><span>${esc(t.t)}</span></div>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="bw-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="bw-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="bw-visit" id="bw-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'bw-visit-img')}<div><h2>${esc(b.visit.title || 'Dónde estamos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<dl>${b.rows.slice(0, 5).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>${b.mapsHref ? a('bw-btn bw-btn--line', b.mapsHref, 'Cómo llegar') : ''}</div></section>
  <footer class="bw-foot"><b class="bw-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="bw-sticky">${a('bw-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir')}${b.telNum ? a('bw-btn bw-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
