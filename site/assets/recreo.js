// Diseño «Recreo» para restaurantes divertidos, sandwicherías y cafés de barrio (theme.style =
// 'recreo'), basado en Middle Child (Filadelfia): animaciones con humor — texto que corre, un
// «tren» de platillos que pasa por la pantalla, el logo que parpadea como letrero —, colores
// planos, letra gruesa redondeada y tarjetas con sombra dura.
import { base, esc } from './base.js';

export const RECREO_FONTS = 'https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;900&family=Rubik+Mono+One&display=swap';

export function renderRecreo(c = {}, opts = {}) {
  const b = base(c, opts, '#FF5A36'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, menu = b.menu.slice(0, 4), dishes = b.dishes.slice(0, 8);
  const order = t => (b.waNum ? b.waMsg(t) : b.bookHref);
  const pics = [c.menu?.photo, ...g.map(x => x.img), hero.photo].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-recreo.css">`,
    `<div class="cx rc${b.live ? '' : ' rc-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rc-top"><b class="rc-logo"><span>${esc(b.brand.name || name)}</span></b><nav aria-label="Secciones">${[menu.length && ['rc-carta', 'Carta'], ['rc-nosotros', 'Nosotros'], ['rc-visita', 'Visítanos']].filter(Boolean).map(b.navLink).join('')}</nav>${a('rc-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir', b.mk('cta'))}</header>`);
  out.push(`<section class="rc-hero"${b.mk('hero')}><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}<div class="rc-ctas">${a('rc-btn rc-btn--big', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir para llevar')}${a('rc-btn rc-btn--big rc-btn--w', order(`Hola, quiero reservar en ${name}`), 'Apartar mesa')}</div></section>`);
  // Texto que corre
  out.push(`<div class="rc-run" aria-hidden="true"><div>${[0, 1].map(() => `<span>${[c.statement || hero.title, ...b.trust.map(t => t.b)].map(esc).join(' ✺ ')} ✺ </span>`).join('')}</div></div>`);
  // El tren de platillos
  if (dishes.length) out.push(`<section class="rc-train" aria-label="Algunos platillos"><div class="rc-rail">${[0, 1].map(k => `<div class="rc-cars"${k ? ' aria-hidden="true"' : ''}>${dishes.map((d, i) => `<figure>${photo(pics[i % pics.length], '', 'rc-car-img')}<figcaption>${esc(d.name)}<b>${esc(d.price || '')}</b></figcaption></figure>`).join('')}</div>`).join('')}</div></section>`);
  if (menu.length) out.push(`<section class="rc-menu" id="rc-carta"${b.mk('services')}><h2>${esc(c.menu?.title || 'La carta')}</h2><div>${menu.map((m, i) => `<article style="--c:var(${['--a', '--sun', '--sky', '--mint'][i % 4]})"><h3>${esc(m.name)}</h3><ul>${m.items.slice(0, 6).map(x => `<li><span>${esc(x.name)}</span><b>${esc(x.price || '')}</b></li>`).join('')}</ul></article>`).join('')}</div></section>`);
  out.push(`<section class="rc-about" id="rc-nosotros">${photo(pics[1], '', 'rc-about-img')}<div><h2>${esc(c.intro?.title || name)}</h2>${c.story?.text ? `<p>${esc(c.story.text)}</p>` : ''}</div></section>`);
  if (b.reviews.length) out.push(`<section class="rc-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map((r, i) => `<blockquote style="--r:${[-2, 1.5, -1][i]}deg"><p>“${esc(r.text)}”</p><cite>— ${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="rc-faq"><h2>¿Dudas?</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="rc-visit" id="rc-visita"${b.mk('visit')}><h2>${esc(b.visit.title || 'Ven a vernos')}</h2>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.rows.slice(0, 4).map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p>${b.mapsHref ? a('rc-btn rc-btn--w', b.mapsHref, 'Cómo llegar') : ''}</section>
  <footer class="rc-foot">${b.legal()}</footer>`);
  out.push(`<div class="rc-sticky">${a('rc-btn', order(`Hola, quiero hacer un pedido en ${name}`), 'Pedir')}${a('rc-btn rc-btn--w', order(`Hola, quiero reservar en ${name}`), 'Apartar')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
