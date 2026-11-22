// Diseño «Cuna» para embarazo, posparto, ginecología y pediatría (theme.style = 'cuna'), basado en
// Tend Health (Estados Unidos): imágenes íntimas y cálidas, formas orgánicas, lenguaje suave
// («te acompañamos», «a tu ritmo») y el acompañamiento contado por etapas.
import { base, esc, ICON } from './base.js';

export const CUNA_FONTS = 'https://fonts.googleapis.com/css2?family=Gloock&family=Figtree:wght@400;500;600&display=swap';

export function renderCuna(c = {}, opts = {}) {
  const b = base(c, opts, '#C97B6B'), { a, photo, hero, contact, name } = b;
  const g = b.gallery;
  const out = [`<link rel="stylesheet" href="/assets/t-cuna.css">`,
    `<div class="cx cu${b.live ? '' : ' cu-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="cu-top"><b class="cu-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['cu-etapas', 'Acompañamiento'], ['cu-equipo', 'Quién te cuida'], ['cu-contacto', 'Contacto']].map(b.navLink).join('')}</nav>${a('cu-btn', '#cu-contacto', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="cu-hero"${b.mk('hero')}><div class="cu-blob">${photo(hero.photo, hero.photoAlt || name, 'cu-blob-img')}</div><div class="cu-copy"><p class="cu-kick">A tu ritmo, con calma</p><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p>${a('cu-btn', '#cu-contacto', esc(hero.cta || b.ctaTop))}</div></section>`);
  if (b.steps.length) out.push(`<section class="cu-stages" id="cu-etapas"><h2>${esc(c.process?.title || 'Te acompañamos en cada etapa')}</h2><ol>${b.steps.map((s, i) => `<li><span class="cu-moon" style="--f:${(i + 1) / b.steps.length}" aria-hidden="true"></span><h3>${esc(s.t)}</h3><p>${esc(s.d || '')}</p></li>`).join('')}</ol></section>`);
  if (b.services.length) out.push(`<section class="cu-care"${b.mk('services')}><div class="cu-head"><h2>${esc(c.services?.title || 'Cuidado')}</h2><p>${esc(c.services?.sub || '')}</p></div><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('cu-link', b.serviceHref(s), `Platicarlo ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (g.length > 1) out.push(`<section class="cu-moments">${g.slice(0, 3).map((x, i) => photo(x.img, x.alt || '', `cu-m cu-m${i}`)).join('')}<p>${esc(c.team?.text || '')}</p></section>`);
  if (b.members.length) out.push(`<section class="cu-team" id="cu-equipo"${b.mk('team')}><h2>Quién te cuida</h2><div>${b.members.map(m => `<article>${photo(m.photo, m.name, 'cu-face')}<h3>${esc(m.name)}</h3><p>${esc(m.role || '')}</p></article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="cu-revs"${b.mk('reviews')}>${b.reviews.slice(0, 3).map(r => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}</cite></blockquote>`).join('')}</section>`);
  if (b.faq.length) out.push(`<section class="cu-faq"><h2>Lo que nos preguntan</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<section class="cu-cta" id="cu-contacto"><h2>Estamos aquí para ti</h2><p>${esc(c.util?.note || '')}</p>${b.apptForm('cu-case')}</section>`);
  out.push(`<footer class="cu-foot"${b.mk('visit')}><b class="cu-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join(' · ')}</p><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.mapsHref ? ` · ${a('', b.mapsHref, 'Cómo llegar')}` : ''}</p><div>${b.legal()}</div></footer>`);
  out.push(`<div class="cu-sticky">${a('cu-btn', '#cu-contacto', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}
