// Diseño «Guía» para consultorios que educan a sus pacientes (theme.style = 'guia'), basado en Mayo
// Clinic (Estados Unidos): referente de contenido educativo. Colores calmados, navegación fácil,
// temas de salud de la A a la Z explicados en dos líneas, y la cita siempre a un clic.
import { base, esc, ICON } from './base.js';

export const GUIA_FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600&family=Noto+Sans:wght@400;500;600&display=swap';

export function renderGuia(c = {}, opts = {}) {
  const b = base(c, opts, '#0057B8'), { a, photo, hero, contact, name } = b;
  const T = (c.topics || []).slice().sort((x, y) => x.t.localeCompare(y.t, 'es'));
  const arts = c.articles?.items || [];
  const letters = [...new Set(T.map(t => t.t[0].toUpperCase()))];
  const out = [`<link rel="stylesheet" href="/assets/t-guia.css">`,
    `<div class="cx gu${b.live ? '' : ' gu-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="gu-top"><b class="gu-logo">${esc(b.brand.fullName || name)}</b><nav aria-label="Secciones">${[['gu-cita', 'Pedir cita'], ['gu-temas', 'Temas de salud'], ['gu-especialidades', 'Especialidades'], ['gu-ubicacion', 'Ubicación']].map(b.navLink).join('')}</nav></header>`);
  out.push(`<section class="gu-hero"${b.mk('hero')}><div><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div><div class="gu-cards"><a class="gu-card gu-card--main" ${b.live ? 'href="#gu-cita"' : ''}${b.mk('cta')}><b>Pedir una cita</b><span>Agenda en línea o por WhatsApp ${ICON.arrow('')}</span></a><a class="gu-card" ${b.live ? 'href="#gu-temas"' : ''}><b>Temas de salud</b><span>Explicados por nuestros médicos ${ICON.arrow('')}</span></a><a class="gu-card" ${b.live ? 'href="#gu-especialidades"' : ''}><b>Especialidades</b><span>Quién te puede atender ${ICON.arrow('')}</span></a></div></section>`);
  if (T.length) out.push(`<section class="gu-topics" id="gu-temas"><div class="gu-head"><h2>Temas de salud de la A a la Z</h2><nav class="gu-az" aria-label="Letras">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => letters.includes(l) ? a('', `#gu-l-${l}`, l) : `<span aria-disabled="true">${l}</span>`).join('')}</nav></div><div class="gu-grid">${T.map((t, i) => { const l = t.t[0].toUpperCase(); const first = T.findIndex(x => x.t[0].toUpperCase() === l) === i; return `<article${first ? ` id="gu-l-${l}"` : ''}><h3>${esc(t.t)}</h3><p>${esc(t.d || '')}</p>${a('gu-link', b.waNum ? b.waMsg(`Hola, tengo una duda sobre ${t.t}`) : b.bookHref, `Preguntar a un médico ${ICON.arrow('')}`)}</article>`; }).join('')}</div></section>`);
  if (arts.length) out.push(`<section class="gu-arts"><h2>${esc(c.articles?.title || 'Artículos')}</h2><div>${arts.map((x, i) => `<article>${photo(b.gallery[i % Math.max(b.gallery.length, 1)]?.img, '', 'gu-art-img')}<h3>${esc(x.title)}</h3><p>${esc(x.desc || '')}</p></article>`).join('')}</div></section>`);
  if (b.services.length) out.push(`<section class="gu-spec" id="gu-especialidades"${b.mk('services')}><h2>${esc(c.services?.title || 'Especialidades')}</h2><ul>${b.services.map(s => `<li><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('gu-link', b.serviceHref(s), 'Pedir cita')}</li>`).join('')}</ul></section>`);
  if (b.members.length) out.push(`<section class="gu-team"${b.mk('team')}><h2>${esc(c.team?.title || 'Médicos')}</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'gu-face')}<div><h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p>${m.license ? `<small>Cédula ${esc(m.license)}</small>` : ''}</div></article>`).join('')}</div></section>`);
  if (b.faq.length) out.push(`<section class="gu-faq"><h2>Preguntas frecuentes</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="gu-cta" id="gu-cita"><div><h2>Pedir una cita</h2><p>${esc(c.util?.note || '')}</p>${b.telNum ? `<p>O llama al ${a('', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}</div>${b.apptForm('gu-case')}</section>`);
  out.push(`<footer class="gu-foot" id="gu-ubicacion"${b.mk('visit')}><div><b class="gu-logo">${esc(b.brand.fullName || name)}</b><p>${esc(contact.address || '')}</p>${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}</div><div>${b.rows.map(r => `<p>${esc(r.dt)}: ${esc(r.dd)}</p>`).join('')}</div><p class="gu-disc">La información de esta página es educativa y no sustituye una consulta médica.</p><div class="gu-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="gu-sticky">${a('gu-btn', '#gu-cita', 'Pedir cita')}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
