// Diseño «Mercado» para restaurantes (theme.style = 'mercado'), basado en Talat Market: una mesa
// llena de platillos vista desde arriba a todo lo ancho, el nombre en letra manuscrita de color,
// y la reservación como acción principal (botón grande + «Regalar» + suscripción). Colores
// vivos de mercado, estampado de tela en las franjas y textos cortos.
import { base, esc } from './base.js';

export const MERCADO_FONTS = 'https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@1,700&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap';

export function renderMercado(c = {}, opts = {}) {
  const b = base(c, opts, '#F2545B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4);
  const ask = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const out = [`<link rel="stylesheet" href="/assets/t-mercado.css">`,
    `<div class="cx mk${b.live ? '' : ' mk-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="mk-hero"${b.mk('hero')}>${photo(g[2]?.img || c.menu?.photo || hero.photo, g[2]?.alt || '', 'mk-hero-img')}<div class="mk-hero-in"><p class="mk-logo">${esc(b.brand.name || name)}</p>
      <div class="mk-acts">${a('mk-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar', b.mk('cta'))}${a('mk-btn mk-btn--w', ask(`Hola, quiero regalar una experiencia en ${name}`), 'Regalar')}</div>
      ${b.waNum ? `<form class="mk-news" data-t-form data-intro="Hola, quiero recibir noticias de"${b.live ? '' : ' inert'}><label class="mk-sr" for="mk-n">Tu nombre</label><input id="mk-n" name="n" data-l="Nombre" placeholder="Tu nombre para recibir noticias" autocomplete="name"><button type="submit">Avísenme</button></form>` : ''}</div></section>`);
  out.push(`<section class="mk-strip" aria-hidden="true"></section><section class="mk-intro"><h1>${esc(hero.title)}</h1>${c.story?.text ? `<p>${esc(c.story.text)}</p>` : ''}</section>`);
  if (menu.length) out.push(`<section class="mk-menu" id="mk-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map((m, i) => `<div style="--c:var(${['--a', '--mango', '--teal', '--leaf'][i % 4]})"><h3>${esc(m.name)}</h3>${m.items.slice(0, 6).map(x => `<p><span>${esc(x.name)}</span><b>${esc(x.price || '')}</b>${(x.tags || []).length ? `<i>${x.tags.map(esc).join(' · ')}</i>` : ''}</p>`).join('')}</div>`).join('')}</div></section>`);
  if (g.length >= 2) out.push(`<section class="mk-photos">${g.slice(0, 4).map(x => photo(x.img, x.alt, 'mk-photo')).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="mk-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="mk-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="mk-strip" aria-hidden="true"></section><section class="mk-visit" id="mk-visita"${b.mk('visit')}><p class="mk-logo mk-logo--s">${esc(b.brand.name || name)}</p>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.rows.slice(0, 4).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p><div class="mk-acts">${a('mk-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar')}${b.mapsHref ? a('mk-btn mk-btn--w', b.mapsHref, 'Cómo llegar') : ''}</div></section>
  <footer class="mk-foot">${b.legal()}</footer>`);
  out.push(`<div class="mk-sticky">${a('mk-btn', ask(`Hola, quiero reservar en ${name}`), 'Reservar')}${a('mk-btn mk-btn--w', ask(`Hola, quiero regalar una experiencia en ${name}`), 'Regalar')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
