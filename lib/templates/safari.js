// Diseño «Safari» para lodges, ecohoteles y destinos de naturaleza (theme.style = 'safari'), basado
// en Xigera (Botswana): logo dorado grande sobre blanco, una narración sensorial por capítulos
// (llegar, mirar, comer, dormir) con fotos altas y textos cortos, una escena nocturna oscura
// y un diario de historias del lugar.
import { base, esc } from './base.js';

export const SAFARI_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap';
const LEAF = '<svg class="sf-mark" viewBox="0 0 64 24" aria-hidden="true"><path d="M32 22C30 14 24 8 14 6c4 6 10 12 18 16Zm0 0c2-8 8-14 18-16-4 6-10 12-18 16Zm0 0c-1-8 0-14 0-20 0 6 1 12 0 20ZM32 22C26 18 18 16 8 16M32 22c6-4 14-6 24-6"/></svg>';

export function renderSafari(c = {}, opts = {}) {
  const b = base(c, opts, '#A2834A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const words = ['Llegar', 'Mirar', 'Probar', 'Dormir'];
  const chapters = [
    { img: hero.photo, t: hero.sub },
    ...b.amenities.slice(0, 3).map((x, i) => ({ img: g[i + 1]?.img || g[i]?.img, t: `${x.b}. ${x.t}.` })),
  ].filter(x => x.t).slice(0, 4);
  const out = [`<link rel="stylesheet" href="/assets/t-safari.css">`,
    `<div class="cx sf${b.live ? '' : ' sf-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="sf-top"><nav aria-label="Secciones">${[['sf-relato', 'El lugar'], ['sf-suites', 'Suites'], ['sf-diario', 'Diario']].map(b.navLink).join('')}</nav>${a('sf-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="sf-hero"${b.mk('hero')}>${LEAF}<p class="sf-logo">${esc(String(b.brand.name || name).toUpperCase())}</p><p class="sf-sub">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1></section>`);
  out.push(`<section class="sf-story" id="sf-relato">${chapters.map((ch, i) => `<article class="sf-ch${i % 2 ? ' sf-ch--r' : ''}">${photo(ch.img, '', 'sf-ch-img')}<div><p class="sf-word">${words[i]}</p><p>${esc(ch.t)}</p></div></article>`).join('')}</section>`);
  if (rooms.length) out.push(`<section class="sf-suites" id="sf-suites"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Suites')}</h2><div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'sf-suite-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="sf-meta">${[r.guests && `${r.guests} huéspedes`, r.size && `${r.size} m²`, r.price && `desde ${r.price}`].filter(Boolean).map(esc).join(' · ')}</p>${a('sf-link', b.roomHref(r), 'Consultar')}</article>`).join('')}</div></section>`);
  out.push(`<section class="sf-night">${photo(g[g.length - 1]?.img || hero.photo, '', 'sf-night-img')}<div>${b.reviews[0] ? `<blockquote><p>${esc(b.reviews[0].text)}</p><cite>${esc(b.reviews[0].name)}</cite></blockquote>` : ''}</div></section>`);
  out.push(`<section class="sf-book"><h2>Planea tu estancia</h2>${b.stayForm('sf-stay')}</section>`);
  if (g.length > 1) out.push(`<section class="sf-journal" id="sf-diario"><h2>Diario</h2><div>${g.slice(0, 3).map((x, i) => `<article>${photo(x.img, x.alt || '', 'sf-j-img')}<p class="sf-meta">${['El lugar', 'La mesa', 'Los días'][i]}</p><h3>${esc(x.alt || '')}</h3></article>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="sf-faq"><h2>Antes de viajar</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="sf-foot" id="sf-visita"${b.mk('visit')}>${LEAF}<p class="sf-logo">${esc(String(b.brand.name || name).toUpperCase())}</p>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="sf-sticky">${a('sf-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
