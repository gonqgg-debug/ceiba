// Diseño «Tienda» para restaurantes, panaderías y negocios que venden por pedido (theme.style =
// 'tienda'), basado en Rebel Cheese: barra de aviso, hero con titular grueso en mayúsculas, franja
// de íconos de beneficios, citas cortas con estrellas, «los más pedidos» en carrusel con botón
// «Agregar» y un carrito que arma el pedido completo y lo manda por WhatsApp; filtros por etiqueta.
import { base, esc, ICON } from './base.js';

export const TIENDA_FONTS = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap';

export function renderTienda(c = {}, opts = {}) {
  const b = base(c, opts, '#0E6E62'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, dishes = b.dishes.slice(0, 12);
  const tags = [...new Set(dishes.flatMap(d => d.tags || []))].slice(0, 6);
  const pics = [c.menu?.photo, ...g.map(x => x.img), hero.photo].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-tienda.css">`,
    `<div class="cx td${b.live ? '' : ' td-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<p class="td-bar">${esc(c.util?.note || hero.sub || '')}</p><header class="td-top"><b class="td-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['td-mas', 'Lo más pedido'], ['td-nosotros', 'Nosotros'], ['td-visita', 'Visítanos']].map(b.navLink).join('')}</nav><a class="td-cart-btn" href="${b.live ? '#td-carrito' : '#'}" aria-label="Ver mi pedido">${ICON.check}<span data-t-count>0</span></a></header>`);
  out.push(`<section class="td-hero"${b.mk('hero')}>${photo(pics[0], c.menu?.photoAlt || '', 'td-hero-img')}<div><p class="td-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1>${a('td-btn', b.live ? '#td-mas' : '', 'Ver lo más pedido', b.mk('cta'))}</div></section>`);
  if (b.trust.length) out.push(`<ul class="td-perks"${b.mk('trust')}>${b.trust.slice(0, 5).map(t => `<li>${ICON.check}${esc(t.b)}</li>`).join('')}</ul>`);
  if (b.reviews.length) out.push(`<section class="td-press"${b.mk('reviews')}>${b.reviews.slice(0, 4).map(r => `<blockquote><b aria-label="5 de 5">★★★★★</b><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}${b.rating ? `<p class="td-score">★ ${esc(b.rating.value)} de ${esc(b.rating.count)} reseñas</p>` : ''}</section>`);
  if (dishes.length) out.push(`<section class="td-best" id="td-mas"${b.mk('services')}><div class="td-best-head"><h2>Lo más pedido</h2>${tags.length ? `<div class="td-filters" role="tablist" aria-label="Filtrar">${['Todo', ...tags].map((t, i) => `<button type="button" role="tab" aria-selected="${!i}" data-td-tag="${i ? esc(t) : ''}">${esc(t)}</button>`).join('')}</div>` : ''}</div>
    <ul class="td-row" tabindex="0" aria-label="Productos, desliza para ver más">${c.shop ? `<li class="td-promo"><p>${esc(c.shop.title)}</p><h3>${esc(c.shop.sub || c.shop.title)}</h3>${c.shop.text ? `<span>${esc(c.shop.text)}</span>` : ''}</li>` : ''}
      ${dishes.map((d, i) => `<li data-tags="${esc((d.tags || []).join('|'))}">${photo(pics[(i % (pics.length - 1)) + 1] || pics[0], '', 'td-card-img')}<div><b>${esc(d.name)}</b>${d.desc ? `<small>${esc(d.desc)}</small>` : ''}<span>${esc(d.price || '')}</span></div><button type="button" class="td-add" data-t-add="${esc(d.name)}" data-price="${esc(d.price || '')}">Agregar</button></li>`).join('')}</ul></section>`);
  out.push(`<section class="td-cart" id="td-carrito" data-t-cartbox><h2>Tu pedido</h2><ul data-t-lines><li class="td-empty">Agrega productos con el botón «Agregar».</li></ul><p class="td-total">Total aproximado: <b data-t-total>$0</b></p>${b.waNum ? `<button type="button" class="td-btn" data-t-cartsend>${ICON.wa('td-wa')}Enviar pedido por WhatsApp</button>` : ''}</section>`);
  if (c.story?.text) out.push(`<section class="td-story" id="td-nosotros"><div><h2>${esc(c.intro?.title || 'Nuestra historia')}</h2><p>${esc(c.story.text)}</p></div>${photo(pics[2], '', 'td-story-img')}</section>`);
  if (b.faq.length) out.push(`<section class="td-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="td-visit" id="td-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Visítanos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.rows.slice(0, 4).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? a('td-btn td-btn--line', b.mapsHref, 'Cómo llegar') : ''}</section>
  <footer class="td-foot"><b class="td-logo">${esc(b.brand.name || name)}</b><div>${b.legal()}</div></footer>`);
  out.push(`<div class="td-sticky"><a class="td-btn" href="${b.live ? '#td-carrito' : '#'}">Ver mi pedido (<span data-t-count>0</span>)</a></div>`, b.kb({}), '</div>');
  return out.join('\n');
}
