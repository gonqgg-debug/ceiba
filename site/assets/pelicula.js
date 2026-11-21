// Diseño «Película» para hoteles de experiencia y destinos con historia (theme.style = 'pelicula'),
// basado en las notas del documento sobre Lewa House (la página abre con una película; al
// capturarla solo mostró la pantalla de audio): la portada es un video a todo lo ancho, o si
// no hay video, las fotos se suceden como escenas. Todo con franjas negras de cine, textos como
// subtítulos y secciones numeradas como escenas con su minuto.
import { base, esc, url, ICON } from './base.js';

export const PELICULA_FONTS = 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Inter+Tight:wght@400;500;600&display=swap';

export function renderPelicula(c = {}, opts = {}) {
  const b = base(c, opts, '#D9A441'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4), vid = url(hero.video);
  const reel = [hero.photo, ...g.map(x => x.img)].filter(Boolean).slice(0, 4);
  const scenes = [
    { t: hero.sub, img: g[0]?.img },
    ...b.amenities.slice(0, 2).map((x, i) => ({ t: `${x.b}. ${x.t}.`, img: g[i + 1]?.img })),
  ].filter(x => x.t);
  const tc = i => `00:${String(4 + i * 7).padStart(2, '0')}`;
  const out = [`<link rel="stylesheet" href="/assets/t-pelicula.css">`,
    `<div class="cx pl${b.live ? '' : ' pl-still'}" style="--a:${b.accent};--n:${reel.length};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<section class="pl-hero"${b.mk('hero')}><header class="pl-top"><b class="pl-logo">${esc(b.brand.name || name)}</b>${a('pl-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <div class="pl-screen">${vid ? `<video class="pl-video" src="${esc(vid)}" autoplay muted loop playsinline${hero.photo ? ` poster="${esc(url(hero.photo))}"` : ''}></video>` : `<div class="pl-reel">${reel.map((u, i) => photo(u, i ? '' : (hero.photoAlt || name), `pl-frame`)).join('')}</div>`}
    <div class="pl-sub"><p class="pl-credit">${esc(b.brand.tagline || 'Presenta')}</p><h1>${esc(hero.title)}</h1></div></div>
    <p class="pl-play">${ICON.play}<span>${vid ? 'En pantalla' : 'Escenas'} · ${esc(b.brand.name || name)}</span></p></section>`);
  out.push(`<section class="pl-scenes">${scenes.map((s, i) => `<article class="pl-scene${i % 2 ? ' pl-scene--r' : ''}">${photo(s.img, '', 'pl-scene-img')}<div><p class="pl-tc">Escena ${i + 1} · ${tc(i)}</p><p class="pl-line">${esc(s.t)}</p></div></article>`).join('')}</section>`);
  if (rooms.length) out.push(`<section class="pl-rooms" id="pl-cuartos"${b.mk('services')}><p class="pl-tc">Reparto</p><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2><div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'pl-room-img')}<h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="pl-meta">${[r.guests && `${r.guests} huéspedes`, r.size && `${r.size} m²`, r.price && `desde ${r.price}`].filter(Boolean).map(esc).join(' · ')}</p>${a('pl-link', b.roomHref(r), 'Reservar')}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="pl-crit"${b.mk('reviews')}><p class="pl-tc">La crítica</p><div>${b.reviews.slice(0, 3).map(r => `<blockquote><span aria-hidden="true">★★★★★</span><p>“${esc(r.text)}”</p><cite>— ${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  out.push(`<section class="pl-book"><p class="pl-tc">Función</p><h2>Elige tus fechas</h2>${b.stayForm('pl-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="pl-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="pl-foot" id="pl-visita"${b.mk('visit')}><p class="pl-tc">Créditos</p><b class="pl-logo">${esc(b.brand.name || name)}</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}<p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="pl-sticky">${a('pl-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
