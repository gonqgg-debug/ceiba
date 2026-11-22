// Diseño «Cirugía» para cirugía plástica, dermatología y tratamientos estéticos (theme.style =
// 'cirugia'), basado en Weber Facial Plastic Surgery (Estados Unidos): galería de antes y después
// con deslizador (solo con fotos reales y consentimiento del paciente) y un blog con artículos
// del médico. Champaña, negro suave y serif elegante.
import { base, esc, url, ICON } from './base.js';

export const CIRUGIA_FONTS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap';

export function renderCirugia(c = {}, opts = {}) {
  const b = base(c, opts, '#B08D6A'), { a, photo, hero, contact, name } = b;
  const cases = (c.cases || []).filter(k => url(k.before) && url(k.after));
  const arts = c.articles?.items || [];
  const out = [`<link rel="stylesheet" href="/assets/t-cirugia.css">`,
    `<div class="cx cg${b.live ? '' : ' cg-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="cg-top"><b class="cg-logo">${esc(b.brand.fullName || name)}</b><nav aria-label="Secciones">${[['cg-proc', 'Procedimientos'], ['cg-resultados', 'Antes y después'], ['cg-blog', 'Blog'], ['cg-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('cg-btn', '#cg-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="cg-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'cg-hero-img')}<div><p class="cg-kick">${esc(b.brand.tagline || '')}</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('cg-btn', '#cg-contacto', esc(hero.cta || b.ctaTop))}</div></section>`);
  if (b.services.length) out.push(`<section class="cg-proc" id="cg-proc"${b.mk('services')}><h2>Procedimientos</h2><div>${b.services.map((s, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('cg-link', b.serviceHref(s), `Valoración ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (cases.length || c.casesDemo) out.push(`<section class="cg-ba" id="cg-resultados"><h2>Antes y después</h2><p class="cg-sub">Desliza para comparar. Fotos de pacientes reales, publicadas con su consentimiento.</p><div class="cg-cases">${cases.length ? cases.map(k => `<figure><div class="cg-slider" data-t-case style="--p:50%"><div class="cg-b" role="img" aria-label="Antes" style="background-image:url('${url(k.before)}')"></div><div class="cg-a" role="img" aria-label="Después" style="background-image:url('${url(k.after)}')"></div><input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después"><span class="cg-tag cg-tag--b">Antes</span><span class="cg-tag cg-tag--a">Después</span></div><figcaption>${esc(k.title || '')}</figcaption></figure>`).join('') : ['Rinoplastia', 'Blefaroplastia', 'Rejuvenecimiento facial'].map(t => `<figure><div class="cg-slider cg-ph" aria-hidden="true"><span>Antes</span><span>Después</span></div><figcaption>${t} · aquí van tus fotos reales</figcaption></figure>`).join('')}</div></section>`);
  if (b.members.length) out.push(`<section class="cg-doc"${b.mk('team')}>${photo(b.members[0].photo, b.members[0].name, 'cg-doc-img')}<div><p class="cg-kick">Tu médico</p><h2>${esc(b.members[0].name)}</h2><p class="cg-role">${esc(b.members[0].role || '')}${b.members[0].license ? ` · Cédula ${esc(b.members[0].license)}` : ''}</p><p>${esc(b.members[0].bio || c.team?.text || '')}</p></div></section>`);
  if (arts.length) out.push(`<section class="cg-blog" id="cg-blog"><h2>${esc(c.articles?.title || 'Blog')}</h2><div>${arts.map((x, i) => `<article>${photo(b.gallery[i % Math.max(b.gallery.length, 1)]?.img, '', 'cg-blog-img')}<h3>${esc(x.title)}</h3><p>${esc(x.desc || '')}</p>${a('cg-link', x.url || (b.waNum ? b.waMsg(`Hola, leí «${x.title}» y tengo una pregunta`) : ''), `Leer ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="cg-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="cg-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="cg-cta" id="cg-contacto"><div><h2>Agenda tu valoración</h2><p>${esc(c.util?.note || '')}</p></div>${b.apptForm('cg-case')}</section>`);
  out.push(`<footer class="cg-foot"${b.mk('visit')}><b class="cg-logo">${esc(b.brand.fullName || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="cg-sticky">${a('cg-btn', '#cg-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
