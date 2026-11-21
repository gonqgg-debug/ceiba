// Diseño «Ruleta» para inmobiliarias boutique de destino (theme.style = 'ruleta'), basado en LET US
// Ibiza: una frase con carácter («No le juegues a la ruleta con tu casa»), rosa empolvado y serif,
// el mapa de la zona en la portada, y propiedades cuya ficha se abre en una ventana con la foto
// grande (o el video), el contexto de la zona y el contacto.
import { base, esc, url, ICON } from './base.js';

export const RULETA_FONTS = 'https://fonts.googleapis.com/css2?family=Gloock&family=Instrument+Sans:wght@400;500;600&display=swap';

export function renderRuleta(c = {}, opts = {}) {
  const b = base(c, opts, '#C0533F'), { a, photo, hero, contact, name } = b;
  const L = b.listings;
  const area = String(L[0]?.zone || contact.address || '').split(',').slice(-1)[0]?.trim() || '';
  const out = [`<link rel="stylesheet" href="/assets/t-ruleta.css">`,
    `<div class="cx rt${b.live ? '' : ' rt-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rt-top"><b class="rt-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><nav aria-label="Secciones">${[['rt-props', 'Propiedades'], ['rt-nosotros', 'Nosotros'], ['rt-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('rt-btn', b.waHref || b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="rt-hero"${b.mk('hero')}><div><h1>${esc(c.hero?.hook || 'No le juegues a la ruleta con tu casa.')}</h1><p>${esc(hero.title)}. ${esc(hero.sub || '')}</p>${a('rt-btn', '#rt-props', esc(hero.cta || 'Ver propiedades'))}</div><div class="rt-map">${b.live && area ? `<iframe title="Mapa de ${esc(area)}" src="https://www.google.com/maps?q=${encodeURIComponent(area)}&z=12&output=embed" loading="lazy"></iframe>` : photo(hero.photo, hero.photoAlt || name, 'rt-map-img')}</div></section>`);
  if (L.length) out.push(`<section class="rt-props" id="rt-props"${b.mk('services')}><div class="rt-head"><h2>Solo con nosotros</h2><p>${esc(c.listings?.sub || '')}</p></div><div class="rt-grid">${L.map((l, i) => `<article>${b.live ? `<button type="button" class="rt-card" data-t-dlg="rt-d${i}" aria-haspopup="dialog">` : '<div class="rt-card">'}${photo(l.img, l.title, 'rt-img')}<span class="rt-row"><b>${esc(l.title)}</b><em>${esc(l.price || '')}</em></span><span class="rt-sub">${esc(l.zone || '')} · ${b.lstFacts(l).slice(0, 3).map(esc).join(' · ')}</span>${b.live ? '</button>' : '</div>'}
      <dialog class="t-dlg rt-dlg" id="rt-d${i}" aria-label="${esc(l.title)}"><div class="rt-dlg-in">${url(l.video) ? `<video src="${esc(url(l.video))}" controls playsinline${l.img ? ` poster="${esc(url(l.img))}"` : ''}></video>` : photo(l.img, l.title, 'rt-dlg-img')}<div><button type="button" class="rt-x" data-t-close aria-label="Cerrar">×</button><p class="rt-kick">${esc(l.op === 'renta' ? 'En renta' : 'En venta')}</p><h3>${esc(l.title)}</h3><p class="rt-price">${esc(l.price || '')}</p><p>${ICON.pin}${esc(l.zone || '')}</p><ul>${b.lstFacts(l).map(x => `<li>${esc(x)}</li>`).join('')}</ul>${l.desc ? `<p>${esc(l.desc)}</p>` : ''}${a('rt-btn', b.lstHref(l), 'Quiero verla')}</div></div></dialog></article>`).join('')}</div></section>`);
  out.push(`<section class="rt-about" id="rt-nosotros"${b.mk('team')}>${photo(c.team?.photo || b.gallery[3]?.img, c.team?.photoAlt || '', 'rt-about-img')}<div><h2>${esc(c.team?.title || 'Nosotros')}</h2><p>${esc(c.team?.text || '')}</p>${(c.team?.bullets || []).length ? `<ul>${c.team.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${a('rt-link', b.waHref, `Platicar con nosotros ${ICON.arrow('')}`)}</div></section>`);
  if (b.services.length) out.push(`<section class="rt-serv">${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p></article>`).join('')}</section>`);
  if (b.reviews.length) out.push(`<section class="rt-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="rt-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="rt-foot" id="rt-contacto"${b.mk('visit')}><b class="rt-logo">${esc(String(b.brand.name || name).toUpperCase())}</b><div><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? `<br>${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p></div><div class="rt-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="rt-sticky">${a('rt-btn', b.waHref || b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
