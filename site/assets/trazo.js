// Diseño «Trazo» para restaurantes (theme.style = 'trazo'), basado en Osteria Angelina: muy
// sobrio, menú vertical a la izquierda, nombre firmado, fotos con mucho aire alternadas con
// textos cortos, y un panel de reservación a pantalla completa que se desliza desde la derecha.
import { base, esc } from './base.js';

export const TRAZO_FONTS = 'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Archivo+Narrow:wght@400;500&display=swap';

export function renderTrazo(c = {}, opts = {}) {
  const b = base(c, opts, '#7A2E2E'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const items = [
    { k: 'Bienvenidos', t: c.intro?.title, d: c.story?.text, img: hero.photo },
    menu.length && { k: c.menu?.title || 'La carta', t: menu.map(m => m.name).join(' · '), d: c.menu?.sub, img: c.menu?.photo || g[0]?.img, menu: true },
    c.today && { k: c.today.title, t: c.today.text, d: (c.today.bullets || []).map(x => x.t || x).join(' · '), img: g[1]?.img },
  ].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-trazo.css">`,
    `<div class="cx tz${b.live ? '' : ' tz-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<aside class="tz-side"><nav aria-label="Secciones">${[['tz-inicio', 'Inicio'], menu.length && ['tz-carta', 'Carta'], ['tz-visita', 'Contacto']].filter(Boolean).map(b.navLink).join('')}<label class="tz-open" for="tz-panel-${esc(b.waNum || 'x')}">Reservar</label></nav><p class="tz-sign">${esc(b.brand.name || name)}</p></aside>`);
  out.push(`<input type="checkbox" class="tz-toggle" id="tz-panel-${esc(b.waNum || 'x')}" hidden><div class="tz-main">`);
  out.push(`<section class="tz-hero" id="tz-inicio"${b.mk('hero')}>${photo(g[0]?.img || hero.photo, g[0]?.alt || '', 'tz-hero-img')}<div><h1>${esc(hero.title)}</h1><label class="tz-btn" for="tz-panel-${esc(b.waNum || 'x')}"${b.mk('cta')}>${esc(b.ctaTop)}</label></div></section>`);
  out.push(items.map((it, i) => `<section class="tz-row${i % 2 ? ' tz-row--r' : ''}"${it.menu ? ` id="tz-carta"${b.mk('services')}` : ''}><div class="tz-row-copy"><p class="tz-kick">${esc(it.k)}</p>${it.t ? `<h2>${esc(it.t)}</h2>` : ''}${it.d ? `<p>${esc(it.d)}</p>` : ''}
    ${it.menu ? `<div class="tz-menu">${menu.map(m => `<div><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(x => `<p><span>${esc(x.name)}</span><em>${esc(x.price || '')}</em></p>`).join('')}</div>`).join('')}</div>` : ''}</div><figure>${photo(it.img, '', 'tz-row-img')}</figure></section>`).join(''));
  if (b.reviews.length) out.push(`<section class="tz-quote"${b.mk('reviews')}><blockquote><p>“${esc(b.reviews[0].text)}”</p><cite>${esc(b.reviews[0].name)}</cite></blockquote></section>`);
  if (b.faq.length) out.push(`<section class="tz-faq">${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="tz-visit" id="tz-visita"${b.mk('visit')}><p class="tz-kick">Visítanos</p>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.slice(0, 5).map(r => `<p>${esc(r.dt)} — ${esc(r.dd)}</p>`).join('')}${b.mapsHref ? a('tz-link', b.mapsHref, 'Cómo llegar') : ''}${b.telNum ? a('tz-link', `tel:${b.telNum}`, esc(contact.phone)) : ''}</section>
    <footer class="tz-foot">${b.legal()}</footer></div>`);
  // Panel de reservación a pantalla completa
  out.push(`<div class="tz-panel" role="dialog" aria-label="Reservar mesa"><label class="tz-close" for="tz-panel-${esc(b.waNum || 'x')}" aria-label="Cerrar">×</label>${photo(g[2]?.img || hero.photo, '', 'tz-panel-img')}
    <div class="tz-panel-in"><p class="tz-sign">${esc(b.brand.name || name)}</p><h2>Reservar mesa</h2>${b.waNum ? `<form data-t-form data-intro="Hola, quiero reservar en"${b.live ? '' : ' inert'}><label><span>Nombre</span><input name="n" data-l="Nombre" autocomplete="name" required></label><label><span>Personas</span><select name="p" data-l="Personas">${[2, 3, 4, 5, 6, 8].map(n => `<option>${n}</option>`).join('')}</select></label><label><span>Día</span><input name="d" data-l="Día" type="date"></label><label><span>Hora</span><select name="h" data-l="Hora">${b.slots.map(s => `<option>${esc(s)}</option>`).join('')}</select></label><button class="tz-btn" type="submit">Enviar por WhatsApp</button></form>` : a('tz-btn', b.bookHref, esc(b.ctaTop))}
      ${b.rows.length ? `<p class="tz-small">${b.rows.slice(0, 3).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>` : ''}</div></div>`);
  out.push(`<div class="tz-sticky"><label class="tz-btn" for="tz-panel-${esc(b.waNum || 'x')}">${esc(b.ctaTop)}</label></div>`, b.kb({}), '</div>');
  return out.join('\n');
}
