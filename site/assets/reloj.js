// Diseño «Reloj» para hoteles urbanos de diseño (theme.style = 'reloj'), basado en las notas del
// documento sobre K11 Artus (Hong Kong; al capturarla mostró una página de error): un reloj en
// vivo con la hora local que sugiere el mejor momento para cada cosa de la casa (desayuno,
// alberca, terraza, bar). Minimalista, gris piedra, cifras finas y una línea del día de 24 horas.
import { base, esc } from './base.js';

export const RELOJ_FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Bodoni+Moda:ital,opsz,wght@1,6..96,400&display=swap';
// horas sugeridas cuando el texto no trae un horario («de 8 a 11 h»)
const HINTS = [[/desayun/i, 8, 11], [/alberca|piscina|pool/i, 12, 18], [/terraza|rooftop|azotea/i, 18, 21], [/bar|coctel|mezcal/i, 19, 23], [/spa|masaje/i, 10, 20], [/caf[eé]/i, 7, 10], [/tour|paseo|recorrido/i, 10, 13], [/cena|restaurante/i, 19, 22]];

function times(items) {
  return items.map(x => {
    const txt = `${x.b} ${x.t}`, m = txt.match(/(\d{1,2})(?::\d\d)?\s*(?:a|-|–)\s*(\d{1,2})/);
    if (m && +m[1] < +m[2]) return { ...x, from: +m[1], to: +m[2] };
    const h = HINTS.find(([re]) => re.test(txt));
    return h ? { ...x, from: h[1], to: h[2] } : null;
  }).filter(Boolean).sort((a, b) => a.from - b.from);
}

export function renderReloj(c = {}, opts = {}) {
  const b = base(c, opts, '#8C6A4F'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4), day = times(b.amenities);
  const others = b.amenities.filter(x => !day.some(d => d.b === x.b));
  const out = [`<link rel="stylesheet" href="/assets/t-reloj.css">`,
    `<div class="cx rl${b.live ? '' : ' rl-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rl-top"><b class="rl-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['rl-dia', 'El día'], ['rl-cuartos', 'Habitaciones'], ['rl-visita', 'Ubicación']].map(b.navLink).join('')}</nav>${a('rl-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="rl-hero"${b.mk('hero')}><div class="rl-copy"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div>${photo(hero.photo, hero.photoAlt || name, 'rl-hero-img')}</section>`);
  if (day.length) out.push(`<section class="rl-day" id="rl-dia" data-t-clock><div class="rl-clock"><p class="rl-kick">Hora local · ${esc(String(contact.address || '').split(',').slice(-2, -1)[0]?.trim() || name)}</p><p class="rl-time" data-clock-time>${String(day[0].from).padStart(2, '0')}:00</p><p class="rl-now" data-clock-now aria-live="polite">A las ${day[0].from}:00: ${esc(day[0].b)}</p></div>
    <div class="rl-line" aria-hidden="true">${[0, 6, 12, 18, 24].map(h => `<span style="left:${h / 24 * 100}%">${String(h).padStart(2, '0')}</span>`).join('')}${day.map(d => `<i style="left:${d.from / 24 * 100}%;width:${(d.to - d.from) / 24 * 100}%"></i>`).join('')}</div>
    <ol>${day.map(d => `<li data-from="${d.from}" data-to="${d.to}" data-name="${esc(d.b)}"><span class="rl-h">${String(d.from).padStart(2, '0')}–${String(d.to).padStart(2, '0')} h</span><b>${esc(d.b)}</b><span>${esc(d.t)}</span></li>`).join('')}</ol></section>`);
  if (rooms.length) out.push(`<section class="rl-rooms" id="rl-cuartos"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2><div>${rooms.map((r, i) => `<article>${photo(r.img, r.imgAlt || r.name, 'rl-room-img')}<p class="rl-kick">${String(i + 1).padStart(2, '0')}</p><h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="rl-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`, r.price && `desde ${r.price}`].filter(Boolean).map(esc).join(' · ')}</p>${a('rl-link', b.roomHref(r), 'Reservar →')}</article>`).join('')}</div></section>`);
  if (others.length || g.length > 1) out.push(`<section class="rl-more">${photo(g[1]?.img || g[0]?.img, g[1]?.alt || '', 'rl-more-img')}<div><h2>${esc(c.amenities?.title || 'Siempre a la mano')}</h2><ul>${(others.length ? others : b.amenities).slice(0, 6).map(x => `<li><b>${esc(x.b)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul></div></section>`);
  if (b.reviews.length) out.push(`<section class="rl-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  out.push(`<section class="rl-book"><h2>Reservar</h2>${b.stayForm('rl-stay')}</section>`);
  if (b.faq.length) out.push(`<section class="rl-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="rl-foot" id="rl-visita"${b.mk('visit')}><div><b class="rl-logo">${esc(b.brand.name || name)}</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}</div><div><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join('<br>')}</p></div><div><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p>${b.mapsHref ? a('rl-link', b.mapsHref, 'Cómo llegar →') : ''}</div><div class="rl-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="rl-sticky">${a('rl-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
