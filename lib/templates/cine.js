// Diseño «Cine» para clínicas (theme.style = 'cine'), basado en Wright Dental Center:
// oscuro y de cine. Hero a pantalla completa (video si hay, foto si no) con el logo en una
// loseta de color y el título en serif con la última palabra en cursiva; la doctora en foto
// con marco desplazado; cada especialista en una franja oscura alternada; recorrido por el
// consultorio; tratamientos en tarjetas carbón; historias de pacientes; un mini cuestionario
// «¿qué te gustaría mejorar?» y un formulario sobre fondo con textura.
import { base, esc, url, ICON } from './base.js';

export const CINE_FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600;1,700&family=Lato:wght@400;700&display=swap';

export function renderCine(c = {}, opts = {}) {
  const b = base(c, opts, '#2BB5B0'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), members = b.members.slice(0, 4), reviews = b.reviews.slice(0, 4), gallery = b.gallery.slice(0, 4);
  const words = String(hero.title || '').trim().split(/\s+/), last = words.pop() || '';
  const video = url(hero.video);
  const nav = [['cn-nosotros', 'Nosotros'], members.length && ['cn-equipo', 'Equipo'], services.length && ['cn-trat', 'Tratamientos'], reviews.length && ['cn-historias', 'Historias'], ['cn-cita', 'Agenda']].filter(Boolean);

  const out = [`<link rel="stylesheet" href="/assets/t-cine.css">`,
    `<div class="cx cn${b.live ? '' : ' cn-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  // Hero a pantalla completa
  out.push(`<section class="cn-hero" id="cn-inicio"${b.mk('hero')}>${video ? `<video class="cn-hero-media" src="${video}" autoplay muted loop playsinline${url(hero.photo) ? ` poster="${url(hero.photo)}"` : ''}></video>` : photo(hero.photo, hero.photoAlt || name, 'cn-hero-media')}
    <div class="cn-shade" aria-hidden="true"></div>
    <a class="cn-tile" href="${b.live ? '#cn-inicio' : '#'}" aria-label="${esc(name)}">${url(b.brand.logo) ? `<img src="${url(b.brand.logo)}" alt="">` : `<b>${esc((b.brand.name || name).slice(0, 1))}</b>`}</a>
    <details class="cn-menu"><summary aria-label="Menú"><i></i></summary><nav aria-label="Secciones">${nav.map(b.navLink).join('')}${a('cn-btn', b.bookHref, esc(b.ctaTop))}</nav></details>
    <div class="cn-hero-copy"><p class="cn-kicker">${esc(b.brand.tagline || name)}${contact.address ? ` · ${esc(String(contact.address).split(',').slice(-1)[0].trim())}` : ''}</p>
      <h1>${esc(words.join(' '))} <em>${esc(last)}</em></h1>
      <div class="cn-ctas">${a('cn-btn cn-btn--lg', b.bookHref, esc(hero.cta || b.ctaTop), b.mk('cta'))}${b.telNum ? a('cn-btn cn-btn--lg cn-btn--ghost', `tel:${b.telNum}`, `${ICON.phone}${esc(contact.phone)}`) : ''}</div></div>
    ${video ? '<span class="cn-play" aria-hidden="true">' + ICON.play + '</span>' : ''}</section>`);

  // Frase con enlace y botón
  if (c.util?.note || b.offers[0]) out.push(`<p class="cn-line">${a('cn-u', b.bookHref, esc(c.util?.note || b.offers[0].title))} ${esc(b.offers[0] ? `${b.offers[0].desc || ''}` : '')}</p>`);

  // Nosotros: foto con marco desplazado
  out.push(`<section class="cn-about" id="cn-nosotros"><div class="cn-frame">${photo(c.team?.photo || b.gallery[0]?.img || hero.photo, c.team?.photoAlt || '', 'cn-frame-img')}</div>
    <div class="cn-about-copy"><h2>${esc(c.today?.title || 'Atención experta, trato de familia')}</h2>${[c.today?.text, c.team?.text].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}${a('cn-btn', b.bookHref, esc(b.ctaTop))}</div></section>`);

  // Especialistas en franjas oscuras alternadas
  if (members.length) out.push(`<section class="cn-team" id="cn-equipo"${b.mk('team')}>${members.map((m, i) => `<article class="cn-doc${i % 2 ? ' cn-doc--r' : ''}"><div class="cn-doc-copy"><h2>${esc(m.name)}</h2>${m.role ? `<p class="cn-role">${esc(m.role)}</p>` : ''}${m.cedula ? `<p class="cn-ced">Cédula profesional ${esc(m.cedula)}</p>` : ''}${m.bio ? `<p>${esc(m.bio)}</p>` : ''}${a('cn-btn', b.waNum ? b.waMsg(`Hola, quiero una cita con ${m.name}`) : b.bookHref, `Cita con ${esc(m.name.split(' ').slice(0, 2).join(' '))}`)}</div>${photo(m.photo, m.name, 'cn-doc-img')}</article>`).join('')}
    ${c.team?.note ? `<p class="cn-note">${esc(c.team.note)}</p>` : ''}</section>`);

  // Recorrido por el consultorio
  if (gallery.length >= 3) out.push(`<section class="cn-tour"><p>${esc(c.gallery?.text || 'Conoce nuestro consultorio.')}</p><ul>${gallery.map(g => `<li>${photo(g.img, g.alt, 'cn-tour-img')}</li>`).join('')}</ul></section>`);

  // Tratamientos en tarjetas carbón
  if (services.length) out.push(`<section class="cn-trat" id="cn-trat"${b.mk('services')}><h2>${esc(c.services.title || 'Nuestros tratamientos')}</h2><ul>${services.map(s => `<li>${photo(s.img, s.imgAlt || s.name, 'cn-card-img')}<h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<b>${esc(s.price)}</b>` : ''}${a('cn-btn', b.serviceHref(s), 'Agendar')}</li>`).join('')}</ul>${c.services.note ? `<p class="cn-note">${esc(c.services.note)}</p>` : ''}</section>`);

  // Historias de pacientes
  if (reviews.length) out.push(`<section class="cn-stories" id="cn-historias"${b.mk('reviews')}><div class="cn-story-grid">${reviews.map((r, i) => `<figure class="cn-story">${photo([...b.gallery.map(g => g.img), ...services.map(s => s.img)][i + 1], '', 'cn-story-img')}<div><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}${r.meta ? ` · ${esc(r.meta)}` : ''}</figcaption></div></figure>`).join('')}
      <div class="cn-story cn-story--cta"><h3>Escribe tu historia</h3><p>${b.rating ? `${esc(b.rating.value)} de 5 en ${esc(b.rating.source || 'Google')} · ${esc(b.rating.count)} reseñas` : 'Agenda tu primera cita'}</p>${a('cn-btn', b.bookHref, esc(b.ctaTop))}</div></div>
    ${c.reviews?.note ? `<p class="cn-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  // Mini cuestionario y formulario
  if (b.waNum) out.push(`<section class="cn-quiz"><div class="cn-quiz-copy"><p class="cn-kicker">Responde y te contactamos</p><h2>¿Qué te gustaría mejorar?</h2><p>Te decimos cómo empezar y cuánto cuesta tu primera visita.</p></div>
    <form class="cn-quiz-box" data-t-form data-intro="Hola, me gustaría mejorar mi sonrisa en"${b.live ? '' : ' inert'}>
      <fieldset><legend>Elige una opción</legend>${services.slice(0, 5).map((s, i) => `<label><input type="radio" name="q" value="${esc(s.name)}" data-l="Me interesa"${i ? '' : ' checked'}><span>${esc(s.name)}</span></label>`).join('')}</fieldset>
      <label class="cn-in"><span>Tu nombre</span><input name="n" data-l="Mi nombre" autocomplete="name" required></label>
      <button class="cn-btn cn-btn--lg" type="submit">${ICON.wa('cn-wa')}Enviar por WhatsApp</button></form></section>`);

  // Preguntas
  if (b.faq.length) out.push(`<section class="cn-faq"><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);

  // Agenda: formulario sobre textura y datos de contacto
  out.push(`<section class="cn-book" id="cn-cita"${b.mk('visit')}><div class="cn-book-in"><h2>Agenda tu cita</h2>
      <div class="cn-book-grid"><div class="cn-book-info">${contact.address ? `<p>${ICON.pin}<span>${esc(contact.address)}</span></p>` : ''}${b.rows.slice(0, 4).map(r => `<p>${ICON.clock}<span><b>${esc(r.dt)}</b> ${esc(r.dd)}</span></p>`).join('')}${b.telNum ? `<p>${ICON.phone}${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.mapsHref ? a('cn-btn cn-btn--ghost', b.mapsHref, 'Cómo llegar') : ''}</div>
      ${b.waNum ? `<form class="cn-form" data-t-form${b.live ? '' : ' inert'}><label><span>Nombre</span><input name="n" data-l="Nombre" autocomplete="name" required></label><label><span>Teléfono</span><input name="t" data-l="Teléfono" type="tel" inputmode="tel" autocomplete="tel"></label>
        ${services.length ? `<label><span>Tratamiento</span><select name="s" data-l="Tratamiento"><option value="">Elige una opción</option>${services.map(s => `<option>${esc(s.name)}</option>`).join('')}</select></label>` : ''}<label><span>Mensaje</span><textarea name="m" data-l="Mensaje" rows="3"></textarea></label><button class="cn-btn cn-btn--lg" type="submit">Agendar por WhatsApp</button></form>` : ''}</div></div></section>
    <footer class="cn-foot">${b.legal()}</footer>`);
  out.push(`<div class="cn-sticky">${a('cn-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('cn-btn cn-btn--ghost', b.waHref, `${ICON.wa('cn-wa')}WhatsApp`) : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
