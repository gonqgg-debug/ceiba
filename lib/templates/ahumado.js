// Diseño «Ahumado» para restaurantes (theme.style = 'ahumado'), basado en Warpigs (Copenhague):
// foto cenital de la comida a todo lo ancho con el nombre en letras de esténcil enormes,
// botones de contorno arriba («Pedir» y «Reservar»), el logo se encoge al bajar, bloques de
// foto y texto alternados con títulos condensados en mayúsculas, una franja negra con la
// frase de la casa y la carta en columnas sobre papel kraft.
import { base, esc, ICON } from './base.js';

export const AHUMADO_FONTS = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Display:wght@800;900&family=Big+Shoulders+Display:wght@700;800&family=Work+Sans:wght@400;500;600&display=swap';

export function renderAhumado(c = {}, opts = {}) {
  const b = base(c, opts, '#D4472B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const book = b.waNum ? b.waMsg(`Hola, quiero reservar una mesa en ${name}`) : b.bookHref;
  const order = b.waNum ? b.waMsg(`Hola, quiero hacer un pedido para llevar en ${name}`) : b.bookHref;
  const blocks = [
    c.intro && { t: c.intro.title, d: c.story?.text, img: g[1]?.img || hero.photo, alt: g[1]?.alt },
    c.today && { t: c.today.title, d: c.today.text, img: g[2]?.img, alt: g[2]?.alt, list: (c.today.bullets || []).map(x => x.t || x) },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-ahumado.css">`,
    `<div class="cx ah${b.live ? '' : ' ah-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}" data-t-shrink>`];
  out.push(`<header class="ah-top"><span class="ah-mini">${esc(b.brand.name || name)}</span><div>${a('ah-out', order, 'Pedir para llevar')}${a('ah-out ah-out--fill', book, `Reservar mesa`, b.mk('cta'))}</div></header>`);
  out.push(`<section class="ah-hero"${b.mk('hero')}>${photo(c.menu?.photo || hero.photo, c.menu?.photoAlt || hero.photoAlt || name, 'ah-hero-img')}<h1 class="ah-name">${esc(b.brand.name || name)}</h1><p class="ah-tag">${esc(hero.title)}</p></section>`);
  out.push(`<section class="ah-blocks"${b.mk('trust')}>${blocks.map((k, i) => `<article class="ah-block${i % 2 ? ' ah-block--r' : ''}">${photo(k.img, k.alt || '', 'ah-block-img')}<div><h2>${esc(k.t)}</h2>${k.d ? `<p>${esc(k.d)}</p>` : ''}${k.list?.length ? `<ul>${k.list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></article>`).join('')}</section>`);
  if (c.statement) out.push(`<section class="ah-black"><h2>${esc(c.statement)}</h2>${b.trust.length ? `<ul>${b.trust.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b><span>${esc(t.t)}</span></li>`).join('')}</ul>` : ''}${photo(g[3]?.img, g[3]?.alt || '', 'ah-black-img')}</section>`);
  if (menu.length) out.push(`<section class="ah-menu" id="ah-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2>${c.menu?.sub ? `<p class="ah-sub">${esc(c.menu.sub)}</p>` : ''}
    <div class="ah-cols">${menu.map(m => `<div><h3>${esc(m.name)}</h3><ul>${m.items.slice(0, 8).map(i => `<li><b>${esc(i.name)}</b><span class="ah-dots" aria-hidden="true"></span><em>${esc(i.price || '')}</em>${i.desc ? `<small>${esc(i.desc)}</small>` : ''}${(i.tags || []).length ? `<i>${i.tags.map(esc).join(' · ')}</i>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>
    <div class="ah-ctas">${a('ah-out ah-out--fill ah-out--lg', book, 'Reservar mesa')}${a('ah-out ah-out--lg ah-out--dark', order, 'Pedir para llevar')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ah-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}${b.rating ? `<p class="ah-score">${esc(b.rating.value)} ★ en ${esc(b.rating.source || 'Google')} · ${esc(b.rating.count)} reseñas</p>` : ''}</section>`);
  if (b.faq.length) out.push(`<section class="ah-faq"><h2>Antes de venir</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="ah-visit" id="ah-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'ah-visit-img')}<div><h2>${esc(b.visit.title || 'Ven por aquí')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p class="ah-sub">${esc(b.visit.zones)}</p>` : ''}<dl>${b.rows.slice(0, 5).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>
    ${b.waNum ? `<form class="ah-form" data-t-form data-intro="Hola, quiero reservar en"${b.live ? '' : ' inert'}><input name="n" data-l="Nombre" placeholder="Tu nombre" autocomplete="name" required aria-label="Tu nombre"><select name="p" data-l="Personas" aria-label="Personas">${[2, 3, 4, 5, 6, 8, 10].map(n => `<option>${n} personas</option>`).join('')}</select><input name="d" data-l="Día" type="date" aria-label="Día"><select name="h" data-l="Hora" aria-label="Hora">${b.slots.map(s => `<option>${esc(s)}</option>`).join('')}</select><button class="ah-out ah-out--fill" type="submit">Reservar por WhatsApp</button></form>` : ''}
    ${b.mapsHref ? a('ah-u', b.mapsHref, 'Abrir en Google Maps') : ''}</div></section>
  <footer class="ah-foot"><span class="ah-mini">${esc(b.brand.name || name)}</span>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}<div>${b.legal()}</div></footer>`);
  out.push(`<div class="ah-sticky">${a('ah-out ah-out--fill', book, 'Reservar')}${a('ah-out ah-out--dark', order, 'Pedir')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
