// Diseño «Revista» para clínicas (theme.style = 'revista'), basado en la nota de Studio Dental
// del documento de referencias: «layout tipo revista con tipografía distintiva».
// Cabecera como de revista (el nombre grande y la línea de edición), portada con titular y
// foto, índice numerado, texto a columnas con letra capital, citas destacadas de pacientes,
// fotos con pie y secciones como artículos.
import { base, esc, ICON } from './base.js';

export const REVISTA_FONTS = 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter+Tight:wght@400;500;600&display=swap';

export function renderRevista(c = {}, opts = {}) {
  const b = base(c, opts, '#B4432F'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), reviews = b.reviews.slice(0, 3), lead = b.members[0];
  const city = String(contact.address || '').split(',').slice(-1)[0].trim();
  const toc = [['rv-carta', 'Carta de bienvenida'], services.length && ['rv-trat', 'Tratamientos'], lead && ['rv-perfil', 'Perfil'], reviews.length && ['rv-voces', 'Voces'], b.faq.length && ['rv-preguntas', 'Preguntas'], ['rv-directorio', 'Directorio']].filter(Boolean);
  const out = [`<link rel="stylesheet" href="/assets/t-revista.css">`,
    `<div class="cx rv${b.live ? '' : ' rv-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="rv-mast"><div class="rv-issue"><span>${esc(b.brand.tagline || 'Clínica dental')}</span><span>Edición ${esc(city || 'local')} · ${new Date().getFullYear()}</span>${a('rv-cta', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</div><p class="rv-name">${esc(b.brand.name || name)}</p>
    <nav aria-label="Índice">${toc.map(([id, l], i) => (b.live ? `<a href="#${id}"><i>${String(i + 1).padStart(2, '0')}</i>${esc(l)}</a>` : `<span><i>${String(i + 1).padStart(2, '0')}</i>${esc(l)}</span>`)).join('')}</nav></header>`);
  out.push(`<section class="rv-cover"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'rv-cover-img')}<div class="rv-cover-copy"><p class="rv-kick">En portada</p><h1>${esc(hero.title)}</h1>${hero.sub ? `<p class="rv-dek">${esc(hero.sub)}</p>` : ''}${a('rv-cta rv-cta--lg', b.bookHref, `${esc(hero.cta || b.ctaTop)} ${ICON.arrow('rv-arr')}`)}</div></section>`);
  out.push(`<section class="rv-letter" id="rv-carta"><p class="rv-kick">01 · Carta de bienvenida</p><div class="rv-cols">${[c.team?.text, c.today?.text, ...(c.today?.bullets || []).map(x => x.t || x)].filter(Boolean).map((t, i) => `<p${i ? '' : ' class="rv-drop"'}>${esc(t)}</p>`).join('')}${lead ? `<p class="rv-sign">— ${esc(lead.name)}</p>` : ''}</div></section>`);
  if (reviews[0]) out.push(`<blockquote class="rv-pull"><p>“${esc(reviews[0].text)}”</p><cite>${esc(reviews[0].name)}${reviews[0].meta ? `, ${esc(reviews[0].meta)}` : ''}</cite></blockquote>`);
  if (services.length) out.push(`<section class="rv-trat" id="rv-trat"${b.mk('services')}><p class="rv-kick">02 · Tratamientos</p><h2>${esc(c.services.title || 'Lo que hacemos, explicado claro')}</h2>
    <div class="rv-grid">${services.map((s, i) => `<article class="rv-art${i === 0 ? ' rv-art--lead' : ''}">${photo(s.img, s.imgAlt || s.name, 'rv-art-img')}<p class="rv-cap">${esc(s.imgAlt || s.name)}</p><h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}<p class="rv-meta">${s.price ? `${esc(s.price)} · ` : ''}${a('rv-u', b.serviceHref(s), 'Agendar')}</p></article>`).join('')}</div>
    ${c.services.note ? `<p class="rv-note">${esc(c.services.note)}</p>` : ''}</section>`);
  if (lead) out.push(`<section class="rv-profile" id="rv-perfil"${b.mk('team')}><div><p class="rv-kick">03 · Perfil</p><h2>${esc(lead.name)}</h2><p class="rv-dek">${esc(lead.role || '')}${lead.cedula ? ` · Cédula ${esc(lead.cedula)}` : ''}</p>${c.team?.text ? `<p class="rv-drop">${esc(c.team.text)}</p>` : ''}
      ${b.members.length > 1 ? `<ul>${b.members.slice(1, 5).map(m => `<li><b>${esc(m.name)}</b>${m.role ? ` — ${esc(m.role)}` : ''}</li>`).join('')}</ul>` : ''}</div><figure>${photo(lead.photo, lead.name, 'rv-profile-img')}<figcaption>${esc(lead.name)} en su consultorio.</figcaption></figure></section>`);
  if (reviews.length > 1) out.push(`<section class="rv-voices" id="rv-voces"${b.mk('reviews')}><p class="rv-kick">04 · Voces</p><div>${reviews.slice(1).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</div>${b.rating ? `<p class="rv-score"><b>${esc(b.rating.value)}</b>/5 · ${esc(b.rating.count)} reseñas en ${esc(b.rating.source || 'Google')}</p>` : ''}${c.reviews?.note ? `<p class="rv-note">${esc(c.reviews.note)}</p>` : ''}</section>`);
  if (b.faq.length) out.push(`<section class="rv-faq" id="rv-preguntas"><p class="rv-kick">05 · Preguntas</p><dl>${b.faq.slice(0, 6).map(f => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl></section>`);
  out.push(`<section class="rv-dir" id="rv-directorio"${b.mk('visit')}><p class="rv-kick">06 · Directorio</p><div class="rv-dir-grid">${contact.address ? `<div><h3>Dónde</h3><p>${esc(contact.address)}</p>${b.mapsHref ? a('rv-u', b.mapsHref, 'Cómo llegar') : ''}</div>` : ''}${b.rows.length ? `<div><h3>Cuándo</h3>${b.rows.slice(0, 4).map(r => `<p>${esc(r.dt)} — ${esc(r.dd)}</p>`).join('')}</div>` : ''}<div><h3>Contacto</h3>${b.telNum ? `<p>${a('rv-u', `tel:${b.telNum}`, esc(contact.phone))}</p>` : ''}${b.waNum ? `<p>${a('rv-u', b.waHref, 'WhatsApp')}</p>` : ''}${contact.email ? `<p>${a('rv-u', `mailto:${contact.email}`, esc(contact.email))}</p>` : ''}</div></div>${a('rv-cta rv-cta--lg', b.bookHref, esc(b.ctaTop))}</section>
  <footer class="rv-foot"><p class="rv-name rv-name--s">${esc(b.brand.name || name)}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="rv-sticky">${a('rv-cta', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('rv-cta rv-cta--line', b.waHref, 'WhatsApp') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
