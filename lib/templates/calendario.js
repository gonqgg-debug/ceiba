// Diseño «Calendario» para casas vacacionales, villas y hoteles pequeños (theme.style = 'calendario'),
// basado en las notas del documento de referencias sobre Petunia Ibiza (su página no cargó al
// capturarla): el calendario de disponibilidad va hasta arriba, junto al nombre. Dos clics eligen
// llegada y salida, llenan el formulario y mandan la consulta por WhatsApp. Estilo mediterráneo:
// blanco cal, azul y fotos con esquinas redondeadas.
import { base, esc } from './base.js';

export const CALENDARIO_FONTS = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Figtree:wght@400;500;600&display=swap';
const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function months(blocked, n = 2) {
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const out = [];
  for (let k = 0; k < n; k++) {
    const first = new Date(today.getFullYear(), today.getMonth() + k, 1), days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const pad = (first.getDay() + 6) % 7, cells = Array.from({ length: pad }, () => '<span></span>');
    for (let d = 1; d <= days; d++) {
      const dt = new Date(first.getFullYear(), first.getMonth(), d), s = iso(dt), off = dt < today || blocked.has(s);
      cells.push(`<button type="button" data-d="${s}"${off ? ' disabled' : ''}${blocked.has(s) ? ' data-busy' : ''} aria-label="${d} de ${MES[first.getMonth()]}${blocked.has(s) ? ', ocupado' : ''}">${d}</button>`);
    }
    out.push(`<div class="ca-month"><p>${MES[first.getMonth()]} ${first.getFullYear()}</p><div class="ca-wd" aria-hidden="true">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span>${x}</span>`).join('')}</div><div class="ca-days">${cells.join('')}</div></div>`);
  }
  return out.join('');
}

export function renderCalendario(c = {}, opts = {}) {
  const b = base(c, opts, '#2F5D8A'), { a, photo, hero, contact, name } = b;
  const g = b.gallery, rooms = b.rooms.slice(0, 4);
  const blocked = new Set((c.availability?.blocked || []).map(String));
  const out = [`<link rel="stylesheet" href="/assets/t-calendario.css">`,
    `<div class="cx ca${b.live ? '' : ' ca-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="ca-top"><b class="ca-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['ca-casa', 'La casa'], ['ca-cuartos', 'Habitaciones'], ['ca-visita', 'Cómo llegar']].map(b.navLink).join('')}</nav>${a('ca-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="ca-hero"${b.mk('hero')}><div class="ca-intro"><p class="ca-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1>${photo(hero.photo, hero.photoAlt || name, 'ca-hero-img')}</div>
    <div class="ca-cal" data-t-cal><div class="ca-cal-head"><h2>Disponibilidad</h2><p data-cal-out aria-live="polite">Elige tu llegada</p></div><div class="ca-months">${months(blocked)}</div>${b.stayForm('ca-stay')}<p class="ca-note">Te confirmamos por WhatsApp en minutos.</p></div></section>`);
  out.push(`<section class="ca-about" id="ca-casa"><p>${esc(hero.sub || '')}</p>${b.amenities.length ? `<ul>${b.amenities.slice(0, 8).map(x => `<li><b>${esc(x.b)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul>` : ''}</section>`);
  if (g.length > 1) out.push(`<section class="ca-gal">${g.slice(0, 5).map((x, i) => photo(x.img, x.alt || '', `ca-g ca-g${i}`)).join('')}</section>`);
  if (rooms.length) out.push(`<section class="ca-rooms" id="ca-cuartos"${b.mk('services')}><h2>${esc(c.rooms?.title || 'Habitaciones')}</h2><div>${rooms.map(r => `<article>${photo(r.img, r.imgAlt || r.name, 'ca-room-img')}<div><h3>${esc(r.name)}</h3><p>${esc(r.desc || '')}</p><p class="ca-meta">${[r.guests && `${r.guests} huéspedes`, r.beds, r.size && `${r.size} m²`].filter(Boolean).map(esc).join(' · ')}</p></div><div class="ca-row">${r.price ? `<b>${esc(r.price)}<small> / noche</small></b>` : '<span></span>'}${a('ca-btn ca-btn--line', b.roomHref(r), 'Consultar')}</div></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="ca-revs"${b.mk('reviews')}>${b.rating ? `<p class="ca-score"><b>${esc(b.rating.value)}</b> · ${esc(b.rating.count)} ${esc(b.rating.source || 'opiniones')}</p>` : ''}<div>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="ca-faq"><h2>Preguntas</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="ca-foot" id="ca-visita"${b.mk('visit')}><div><b class="ca-logo">${esc(b.brand.name || name)}</b>${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}</div><div><p>${b.rows.map(r => `${esc(r.dt)} ${esc(r.dd)}`).join('<br>')}</p>${b.mapsHref ? a('ca-btn ca-btn--line', b.mapsHref, 'Cómo llegar') : ''}</div><div class="ca-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="ca-sticky">${a('ca-btn', b.bookHref, esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
