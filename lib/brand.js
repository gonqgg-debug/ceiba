// Marca del cliente: colores y letras de su página, y qué letras le recomendamos.
// Lo usan /api/marca (en /empezar, mientras arma su página) y la rutina de propuestas.
import { fetchPage } from './site-reader.js';

const GENERIC = /^(uppercase|lowercase|capitalize|normal|none|bold|bolder|lighter|italic|regular|light|medium|auto|default|inherit|initial|unset|serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-[a-z-]+|-apple-system|blinkmacsystemfont|segoe ui|roboto|helvetica( neue)?|arial|tahoma|verdana|times( new roman)?|georgia|courier( new)?|apple color emoji|segoe ui (emoji|symbol)|noto color emoji|var\(.*)$/i;
const ICONS = /awesome|icon|glyph|dashicons|eicons|elementor|swiper|slick|revicons|fontello|material symbols|material icons|wp|star|social/i;
const SERIF = /serif(?!.*sans)|garamond|palatino|book antiqua|minion|freight|tiempos|canela|nantes|recoleta|ogg\b|sectra|playfair|lora|merriweather|baskerville|bodoni|didot|cormorant|fraunces|newsreader|crimson|libre caslon|caslon|spectral|cardo|prata|gloock|young serif|dm serif|instrument serif|tinos|source serif|pt serif|noto serif|eb garamond|cinzel|marcellus|bellefair|gilda/i;
const ROUND = /nunito|quicksand|varela round|comfortaa|fredoka|baloo|mplus rounded|poppins/i;
const SCRIPT = /script|pacifico|dancing|great vibes|satisfy|yellowtail|caveat|sacramento|lobster|allura|parisienne|kaushan|amatic/i;

// Letras recomendadas del catálogo (lib/templates/clinica.js → FONTS) por giro
const BY_KIND = {
  clinica: ['moderna', 'limpia', 'editorial'], restaurante: ['calida', 'retro', 'fuerte'], hotel: ['lujo', 'editorial', 'elegante'],
  inmobiliaria: ['lujo', 'sobria', 'limpia'], despacho: ['clasica', 'editorial', 'sobria'], otro: ['moderna', 'calida', 'sobria'],
};
const BY_CLASS = { serif: ['editorial', 'calida', 'lujo', 'elegante', 'clasica'], round: ['amable', 'geometrica', 'limpia'], script: ['retro', 'calida', 'lujo'], sans: ['moderna', 'limpia', 'sobria', 'geometrica', 'fuerte'] };
export const fontClass = f => (SCRIPT.test(f) ? 'script' : SERIF.test(f) ? 'serif' : ROUND.test(f) ? 'round' : 'sans');

export function recommendFonts({ fonts = [], kind = 'otro' } = {}) {
  const main = fonts[0];
  const picks = main ? [...BY_CLASS[fontClass(main)]] : [];
  for (const k of BY_KIND[kind] || BY_KIND.otro) if (!picks.includes(k)) picks.push(k);
  return picks.slice(0, 3);
}

// ---------- colores ----------
// Azules de fábrica de Webflow, Tailwind, Bootstrap y WordPress: no son de la marca
const FRAMEWORK = new Set(['#3898ec', '#3b82f6', '#007bff', '#0d6efd', '#0073aa', '#2271b1', '#1e73be', '#337ab7', '#0066cc', '#2563eb']);
const toHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
function parseColor(s) {
  s = s.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) { const h = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1]; return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  m = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}
function hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}
// Colores con personalidad (sin blancos, negros ni grises), agrupados por parecido y ordenados por uso
export function brandColors(css, themeColor) {
  const counts = new Map();
  const add = (c, w) => { const rgb = parseColor(c); if (!rgb) return; const [, s, l] = hsl(rgb); if (s < 0.28 || l < 0.12 || l > 0.9) return; const k = toHex(...rgb); if (FRAMEWORK.has(k)) return; counts.set(k, (counts.get(k) || 0) + w); };
  if (themeColor) add(themeColor, 25);
  // Sin la paleta de ejemplo de WordPress ni los colores de alertas y errores
  const clean = css.replace(/--wp--preset--[\w-]+\s*:[^;}]+/gi, '').replace(/[^{}]*(error|danger|alert|warning|invalid|notice|woocommerce|wpcf7)[^{}]*\{[^}]*\}/gi, '');
  for (const m of clean.matchAll(/(?:color|background(?:-color)?|fill|stroke|border(?:-[a-z]+)?-color|--[\w-]+)\s*:\s*(#[0-9a-f]{3,6}\b|rgba?\([^)]*\))/gi)) add(m[1], /background|--/.test(m[0]) ? 2 : 1);
  const groups = [];
  for (const [hex, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    const [h, s, l] = hsl(parseColor(hex));
    const g = groups.find(x => Math.min(Math.abs(x.h - h), 360 - Math.abs(x.h - h)) < 18 && Math.abs(x.l - l) < 0.18);
    if (g) g.n += n; else groups.push({ hex, h, s, l, n });
  }
  return groups.sort((a, b) => b.n - a.n).slice(0, 4).map(g => g.hex);
}

// ---------- letras ----------
export function brandFonts(html, css) {
  const counts = new Map();
  // Next.js y otros renombran la letra («__Cormorant_Garamond_5df062»): se limpia
  const tidy = f => f.replace(/["']/g, '').replace(/\+/g, ' ').replace(/^_+/, '').replace(/_[0-9a-f]{5,}$/i, '').replace(/_/g, ' ').replace(/\s+fallback$/i, '').trim();
  const add = (f, w) => { f = tidy(f); if (!f || f.length > 40 || !/^[a-z][a-z0-9 -]+$/i.test(f) || GENERIC.test(f) || ICONS.test(f) || /fallback/i.test(f)) return; counts.set(f, (counts.get(f) || 0) + w); };
  // Google Fonts que carga la página
  for (const m of html.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'\s>]+)/gi)) for (const fam of m[1].replace(/&amp;/g, '&').matchAll(/family=([^&:;]+)/gi)) add(decodeURIComponent(fam[1]), 6);
  // La primera letra de cada font-family (las de títulos pesan más)
  for (const m of css.matchAll(/(h1|h2|h3|title|heading)?[^{}]*\{[^}]*?font-family\s*:\s*([^;}]+)/gi)) add(m[2].split(',')[0], m[1] ? 3 : 1);
  for (const m of css.matchAll(/--[\w-]*font[\w-]*\s*:\s*([^;}]+)/gi)) add(m[1].split(',')[0], 2);
  return [...counts].sort((a, b) => b[1] - a[1]).map(([f]) => f).slice(0, 3);
}

// Lee la portada y hasta dos hojas de estilo del mismo sitio
export async function readBrand(href, kind = 'otro') {
  const page = await fetchPage(href);
  const html = page.html || '';
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n') + '\n' + [...html.matchAll(/\sstyle=["']([^"']+)["']/gi)].map(m => `x{${m[1]}}`).join('\n');
  const origin = new URL(page.finalUrl).origin;
  const sheets = [...html.matchAll(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi)].map(m => m[0].match(/href=["']([^"']+)["']/i)?.[1]).filter(Boolean)
    .map(h => { try { return new URL(h.replace(/&amp;/g, '&'), page.finalUrl); } catch { return null; } })
    .filter(u => u && (u.origin === origin || /website-files\.com|squarespace|wixstatic|parastorage|shopify|framerusercontent/i.test(u.hostname)) && !/wp-includes|plugins\/(?!.*theme)|bootstrap|font-?awesome|googleapis/i.test(u.href)).slice(0, 3);
  let css = inline;
  for (const u of sheets) { try { const p = await fetchPage(u.href); if (/css|text\/plain/i.test(p.type) || /\.css/.test(u.pathname)) css += '\n' + p.html.slice(0, 400_000); } catch { /* hoja que no abre: se ignora */ } }
  const themeColor = (html.match(/<meta[^>]+name=["']theme-color["'][^>]*>/i)?.[0].match(/content=["']([^"']+)/i) || [])[1];
  const fonts = brandFonts(html, css), colors = brandColors(css, themeColor);
  return { colors, fonts, recommended: recommendFonts({ fonts, kind }) };
}
