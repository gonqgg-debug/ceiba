// Diseño «Fonda» para restaurantes (page.kind = 'restaurante', theme.style = 'fonda', el de
// por defecto para ese rubro). Bloques de color de pared a pared, títulos en mayúsculas,
// palabras resaltadas y trazos a mano que se dibujan al aparecer. Mismo JSON que la plantilla
// «clinica», con campos opcionales propios: intro, story, shop, booking. Si falta un dato, la
// sección no aparece. Estilos en /assets/fonda.css; interacción en /assets/clinica.js (.fx).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);
const digits = s => String(s ?? '').replace(/\D/g, '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#C8302B');

// Trazos a mano (SVG con pathLength=1 para dibujarlos con stroke-dashoffset)
const UNDER = '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 14 C 50 4, 120 18, 197 8"/></svg>';
const RING = '<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M20 30 C 20 6, 180 4, 190 28 C 198 52, 30 58, 12 34 C 6 24, 30 10, 60 8"/></svg>';
const under = t => `<span class="mk u">${t}${UNDER}</span>`;
const ring = t => `<span class="mk o">${t}${RING}</span>`;
// Resalta en el título las frases de `marks` (texto ya escapado)
const highlight = (title, marks) => list(marks).reduce((t, m) => {
  const e = esc(m); const i = t.toLowerCase().indexOf(e.toLowerCase());
  return i < 0 ? t : `${t.slice(0, i)}<span class="hl">${t.slice(i, i + e.length)}</span>${t.slice(i + e.length)}`;
}, esc(title));

export const FONDA_FONTS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Lora:ital,wght@0,400;0,500;1,400&family=Yellowtail&family=Caveat:wght@500;700&display=swap';

export function renderFonda(c = {}, { mode = 'live', marks = {}, view = 'home', pages = null, href = null, fontVars = '' } = {}) {
  const live = mode === 'live';
  const linkTo = slug => (href ? href(slug) : `/${slug}`);
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const name = brand.fullName || brand.name || '';
  const waNum = digits(contact.whatsapp), telNum = digits(contact.phone);
  const waMsg = t => `https://wa.me/${waNum}?text=${encodeURIComponent(t)}`;
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const mk = sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`;
  const a = (h, inner, cls = '', extra = '') => (live && h ? `<a${cls ? ` class="${cls}"` : ''} href="${esc(h)}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}${extra}>${inner}</a>` : `<span${cls ? ` class="${cls}"` : ''}${extra}>${inner}</span>`);
  const bg = (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : '');

  const cats = list(c.menu?.categories).filter(m => list(m.items).length).slice(0, 8);
  const gallery = list(c.gallery?.images).filter(g => url(g.img));
  const photos = [...new Set([url(c.menu?.photo), ...gallery.map(g => url(g.img)), url(hero.photo)].filter(Boolean))];
  const review = list(c.reviews?.items)[0];
  const rows = list(c.visit?.rows);
  const story = c.story || {};
  const storyText = story.text || c.statement || c.today?.text || '';
  const storyPhoto = url(story.photo) || url(c.team?.photo) || url(list(c.team?.members)[0]?.photo) || photos[1] || '';
  const shop = c.shop?.title || list(c.shop?.items).length ? c.shop : null;
  const intro = c.intro?.title ? c.intro : { title: hero.title || name, marks: [] };
  const book = c.booking || {};
  const slots = list(book.slots).length ? list(book.slots) : list(hero.slots).map(s => (String(s).match(/\d{1,2}:\d{2}/) || [])[0]).filter(Boolean);
  const kb = { wa: waNum, name, slots: slots.length ? slots : ['14:00', '15:30', '19:00', '20:30'], closed: list(book.closed).map(Number).filter(n => n >= 0 && n <= 6) };

  const out = [];
  const style = `--a:${hex(brand.accent)};${fontVars}`;
  out.push(`<div class="cx fx" style="${style}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  // Barra: reservar a la izquierda y menú a la derecha (dentro de la página, no fija a la ventana)
  const navItems = pages?.length && live
    ? pages.map(pg => `<a href="${esc(linkTo(pg.slug))}">${esc(pg.nav || pg.title)}</a>`).join('')
    : ['Reservar', 'La carta', shop && 'La tiendita', 'Nuestra historia', 'Cómo llegar'].filter(Boolean).map(t => `<a href="#${{ Reservar: 'fx-reserva', 'La carta': 'fx-carta', 'La tiendita': 'fx-tiendita', 'Nuestra historia': 'fx-historia', 'Cómo llegar': 'fx-visita' }[t]}">${t}</a>`).join('');
  out.push(`<div class="fx-bar"${mk('cta')}>${a('#fx-reserva', esc(hero.ctaTop || 'Reservar'), 'fx-book')}<button type="button" class="fx-burger" aria-label="Abrir menú" aria-expanded="false"><i></i></button></div>
    <nav class="fx-nav" aria-label="Menú">${navItems}${contact.address ? `<p>${esc(contact.address)}</p>` : ''}</nav>`);

  // 1. Apertura: la foto de origen y el nombre manuscrito
  if (view !== 'contacto') out.push(`<header class="fx-hero"${mk('hero')}>${bg(hero.photo, hero.photoAlt || name, 'fx-hero-img')}<h1 class="fx-logo">${brand.tagline ? `<small>${esc(brand.tagline)}</small>` : ''}<b>${esc(brand.name || name)}</b></h1></header>`);

  if (view === 'home') {
    // 2. Bloque rojo: quiénes son, con el plato que gira
    out.push(`<section class="fx-red" id="fx-historia"${mk('trust')}><h2 class="rv">${intro.kicker ? `${under(esc(intro.kicker))} ` : ''}${highlight(intro.title, intro.marks)}</h2>${photos[0] ? bg(photos[0], c.menu?.photoAlt || 'Platillo de la casa', 'fx-plate') : ''}</section>`);
    // 3. La historia: foto con nota encima, pie a mano y sello
    if (storyText && storyPhoto) out.push(`<section class="fx-origin"${mk('team')}>${bg(storyPhoto, story.photoAlt || story.caption || name, 'fx-origin-img')}<p class="fx-note">${esc(storyText)}</p>${story.caption ? `<span class="fx-tag">${ring(esc(story.caption))}</span>` : ''}${story.badge ? `<div class="fx-stamp">${esc(story.badge)}${story.badgeSub ? `<small>${esc(story.badgeSub)}</small>` : ''}</div>` : ''}</section>`);
    // 4. Bloque amarillo: una reseña real
    if (review?.text) out.push(`<section class="fx-yellow"${mk('reviews')}><blockquote class="rv">“${esc(review.text)}”</blockquote><cite class="rv">${ring(esc([review.name, review.source || (c.rating?.source ? `reseña en ${c.rating.source}` : '')].filter(Boolean).join(', ')))}</cite></section>`);
    // 5. Pizarrón: carta y reservación
    out.push(`<section class="fx-board"${mk('services')}><div class="fx-big">${cats.length ? `<a href="#fx-carta" class="rv" data-fx-carta>Ve nuestra ${ring('carta')}</a>` : ''}<a href="#fx-reserva" class="rv">Haz tu ${under('reservación')}</a></div>
      <div class="fx-pics">${photos.slice(0, 2).map((p, i) => `<div style="background-image:url('${p}')" role="img" aria-label="${esc(gallery[i]?.alt || 'Platillos de la casa')}"></div>`).join('')}</div></section>`);
  }

  // La carta: en la portada se despliega al tocar; en la página de la carta ya está abierta
  if (cats.length && view !== 'contacto') out.push(`<section class="fx-carta${view === 'home' ? '' : ' show'}" id="fx-carta"><h2>${esc(c.menu?.title || 'La carta')}</h2>${c.menu?.sub ? `<p class="fx-sub">${esc(c.menu.sub)}</p>` : ''}
    <div class="fx-cols">${cats.map(m => `<div><h3>${esc(m.name)}</h3><ul>${list(m.items).slice(0, 16).map(it => `<li><b>${esc(it.name)}${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</b><i></i><span>${esc(it.price || '')}</span></li>`).join('')}</ul></div>`).join('')}</div>
    ${c.menu?.note ? `<p class="fx-sub">${esc(c.menu.note)}</p>` : ''}</section>`);

  // 6. La tiendita (si venden productos)
  if (shop && view === 'home') out.push(`<section class="fx-shop" id="fx-tiendita"><div class="rv"><h2>${under(esc(shop.title || 'La tiendita'))}${shop.sub ? `<em>${esc(shop.sub)}</em>` : ''}</h2>${shop.text ? `<p>${esc(shop.text)}</p>` : ''}${waNum ? `<p>${a(waMsg(`Hola, quiero pedir de ${shop.title || 'la tiendita'}`), `${esc(shop.cta || 'Pide por WhatsApp y pasa por tu pedido')} →`)}</p>` : ''}</div>
    <div class="fx-grid3">${(list(shop.images).length ? list(shop.images).map(x => url(x.img || x)).filter(Boolean) : photos.slice(1, 4)).slice(0, 3).map(p => `<div style="background-image:url('${p}')" role="img" aria-label="${esc(shop.title || 'La tiendita')}"></div>`).join('')}</div></section>`);

  // 7. Reservación: boleto
  if (waNum) out.push(`<section class="fx-book-sec" id="fx-reserva"${mk('visit')}><h2 class="rv">¿Te apartamos ${under('mesa?')}</h2><p>Elige día, hora y cuántos son. Te confirmamos por WhatsApp.</p>
    <div class="fx-ticket"><div class="fx-t-main">
      <div class="fx-field"><b>¿Qué día?</b><div class="fx-chips" data-fx-days></div></div>
      <div class="fx-field"><b>¿A qué hora?</b><div class="fx-chips" data-fx-hours><span>Primero elige el día</span></div></div>
      <div class="fx-field"><b>¿Cuántos son?</b><div class="fx-step"><button type="button" data-fx-ppl="-1" aria-label="Menos personas">−</button><output data-fx-n>2</output><button type="button" data-fx-ppl="1" aria-label="Más personas">+</button></div></div>
      <div class="fx-field"><b>¿A nombre de quién?</b><input data-fx-who autocomplete="name" placeholder="Tu nombre"${live ? '' : ' disabled'}></div>
    </div><div class="fx-t-stub"><b data-fx-sum>Elige día y hora</b><button type="button" class="fx-go" data-fx-go>Reservar</button></div></div></section>`);

  // 8. Pie: horario, dónde y contacto
  out.push(`<footer class="fx-foot" id="fx-visita">
    ${rows.length ? `<div><h3>${ring('Horario')}</h3><p>${rows.slice(0, 6).map(r => `${esc(r.dt)} — ${esc(r.dd)}`).join('<br>')}</p></div>` : ''}
    ${contact.address ? `<div><h3>${ring('Dónde')}</h3><p>${esc(contact.address)}${mapsHref ? `<br>${a(mapsHref, 'Cómo llegar')}` : ''}</p></div>` : ''}
    <div><h3>${ring('Contacto')}</h3><p>${telNum ? a(`tel:${telNum}`, esc(contact.phone)) : ''}${waNum ? `<br>${a(waMsg(`Hola, tengo una pregunta para ${name}`), 'WhatsApp')}` : ''}${contact.email ? `<br>${a(`mailto:${contact.email}`, esc(contact.email))}` : ''}</p></div>
    <p class="fx-legal">© ${new Date().getFullYear()} ${esc(name)} · Aviso de privacidad${c.footer?.note ? ` · ${esc(c.footer.note)}` : ''}</p></footer>`);
  if (waNum) out.push(`<div class="fx-fab">${a(waMsg(`Hola, quiero reservar en ${name}`), '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>', 'fx-wa', ' aria-label="WhatsApp"')}</div>`);
  out.push(`<script type="application/json" class="fx-kb">${JSON.stringify(kb).replace(/</g, '\\u003c')}</script></div>`);
  return out.join('\n');
}
