// Diseño «Noche» para bares y restaurantes de noche (theme.style = 'noche'), basado en Craft and
// Kitchen (Arts District Kitchen): una sola página con navegación por anclas, fondo negro y
// texto dorado, título con palabra manuscrita, collages de fotos desplazadas y la carta con
// categorías en columna a la izquierda que cambian la lista de la derecha.
import { base, esc } from './base.js';

export const NOCHE_FONTS = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Allura&family=Lato:wght@300;400;700&display=swap';

export function renderNoche(c = {}, opts = {}) {
  const b = base(c, opts, '#C9A45C'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 6);
  const book = b.waNum ? b.waMsg(`Hola, quiero reservar en ${name}`) : b.bookHref;
  const words = String(hero.title || '').split(/\s+/), mid = Math.ceil(words.length / 2);
  const out = [`<link rel="stylesheet" href="/assets/t-noche.css">`,
    `<div class="cx nc${b.live ? '' : ' nc-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="nc-top"><nav aria-label="Secciones">${[['nc-inicio', 'Inicio'], ['nc-nosotros', 'Nosotros'], menu.length && ['nc-carta', 'Carta'], ['nc-visita', 'Visítanos']].filter(Boolean).map(b.navLink).join('')}</nav>${b.telNum ? a('nc-tel', `tel:${b.telNum}`, esc(contact.phone)) : ''}</header>`);
  out.push(`<section class="nc-hero" id="nc-inicio"${b.mk('hero')}>${photo(c.menu?.photo || hero.photo, c.menu?.photoAlt || '', 'nc-hero-img')}<div><h1>${esc(words.slice(0, mid).join(' '))} <em>${esc(words.slice(mid).join(' '))}</em></h1>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.length ? `<p>${b.rows.slice(0, 2).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>` : ''}${a('nc-btn', book, esc(b.ctaTop), b.mk('cta'))}</div>${photo(g[2]?.img, '', 'nc-hero-2')}</section>`);
  out.push(`<section class="nc-about" id="nc-nosotros"><div class="nc-stack">${photo(g[0]?.img, g[0]?.alt || '', 'nc-s1')}${photo(g[1]?.img, g[1]?.alt || '', 'nc-s2')}</div><div><p class="nc-kick">${esc(c.intro?.kicker || 'Nosotros')}</p><h2>${esc(c.intro?.title || name)}</h2>${c.story?.text ? `<p>${esc(c.story.text)}</p>` : ''}${b.trust.length ? `<ul>${b.trust.slice(0, 4).map(t => `<li>${esc(t.b)}</li>`).join('')}</ul>` : ''}</div></section>`);
  if (menu.length) out.push(`<section class="nc-menu" id="nc-carta"${b.mk('services')} data-t-tabs><h2>${esc(c.menu?.title || 'La carta')}</h2><div class="nc-menu-in"><div class="nc-cats" role="tablist" aria-label="Categorías">${menu.map((m, i) => `<button type="button" role="tab" aria-selected="${!i}" aria-controls="nc-m${i}">${esc(m.name)}</button>`).join('')}</div>
    <div>${menu.map((m, i) => `<div role="tabpanel" id="nc-m${i}"${i ? ' hidden' : ''}>${m.items.map(x => `<p><b>${esc(x.name)}</b><span>${esc(x.price || '')}</span>${x.desc ? `<small>${esc(x.desc)}</small>` : ''}</p>`).join('')}</div>`).join('')}</div></div></section>`);
  if (b.reviews.length) out.push(`<section class="nc-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="nc-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="nc-visit" id="nc-visita"${b.mk('visit')}>${photo(b.visit.photo, b.visit.photoAlt || '', 'nc-visit-img')}<div><p class="nc-kick">Te esperamos</p><h2>${esc(b.visit.title || 'Visítanos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.rows.map(r => `<p>${esc(r.dt)} · ${esc(r.dd)}</p>`).join('')}<div class="nc-ctas">${a('nc-btn', book, esc(b.ctaTop))}${b.mapsHref ? a('nc-btn nc-btn--line', b.mapsHref, 'Cómo llegar') : ''}</div></div></section>
  <footer class="nc-foot">${b.legal()}</footer>`);
  out.push(`<div class="nc-sticky">${a('nc-btn', book, esc(b.ctaTop))}${b.telNum ? a('nc-btn nc-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
