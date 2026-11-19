// Lee la página pública de un negocio: la abre de forma segura (SSRF),
// hace la revisión rápida y extrae el contenido que usa la rutina de propuestas.
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 CeibaLabsRevision/1.0 (+https://www.ceibalabs.io)';
const MAX_BYTES = 2_000_000;

// Evita que alguien use la revisión para llegar a redes internas (SSRF).
const privateIp = ip => /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(ip)
  || /^(::1$|::$|f[cd]|fe80:|::ffff:(10\.|127\.|192\.168\.|169\.254\.))/i.test(ip);
async function assertPublic(hostname) {
  if (isIP(hostname)) throw Object.assign(new Error('ip'), { user: 'Escribe la dirección con nombre, como tunegocio.com.' });
  if (/(^|\.)(localhost|local|internal|vercel\.internal)$/i.test(hostname)) throw Object.assign(new Error('local'), { user: 'Esa dirección no es pública.' });
  // Con un proxy de salida (desarrollo local), el proxy resuelve y filtra.
  if (process.env.NODE_USE_ENV_PROXY && process.env.HTTPS_PROXY) return;
  const addrs = await lookup(hostname, { all: true }).catch(() => { throw Object.assign(new Error('dns'), { user: 'No encontramos esa dirección. Revisa cómo la escribiste.', code: 'dns' }); });
  if (!addrs.length || addrs.some(a => privateIp(a.address))) throw Object.assign(new Error('private'), { user: 'Esa dirección no es pública.' });
}

export async function fetchPage(href) {
  let url = href;
  const started = Date.now();
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw Object.assign(new Error('proto'), { user: 'La página redirige a una dirección que no podemos abrir.' });
    await assertPublic(u.hostname);
    const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': UA, accept: 'text/html,*/*;q=0.8', 'accept-language': 'es-MX,es;q=0.9' }, signal: AbortSignal.timeout(9000) });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { url = new URL(res.headers.get('location'), url).href; continue; }
    const firstByte = Date.now() - started;
    const reader = res.body?.getReader(); const chunks = []; let size = 0;
    while (reader) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length; chunks.push(value);
      if (size > MAX_BYTES) { reader.cancel(); break; }
    }
    const html = new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks.map(c => Buffer.from(c))));
    return { finalUrl: url, status: res.status, html, size, firstByte, total: Date.now() - started, type: res.headers.get('content-type') || '' };
  }
  throw Object.assign(new Error('redirects'), { user: 'La página redirige demasiadas veces.' });
}

const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const meta = (html, name) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0]; return tag ? (tag.match(/content=["']([^"']*)["']/i)?.[1] ?? '').trim() : null;
};

export function review(page) {
  const { html, finalUrl } = page;
  const lower = html.toLowerCase();
  const text = strip(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')).toLowerCase();
  const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || meta(html, 'og:title') || '';
  const desc = meta(html, 'description');
  const viewport = meta(html, 'viewport');
  const year = new Date().getFullYear();
  const years = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d{2})/g)].map(m => +m[1]);
  const copyright = years.length ? Math.max(...years) : null;
  const checks = [];
  const add = (id, label, status, detail) => checks.push({ id, label, status, detail });

  add('https', 'Conexión segura', finalUrl.startsWith('https://') ? 'ok' : 'bad',
    finalUrl.startsWith('https://') ? 'Tu página abre con candado (https).'
      : 'Tu página abre sin candado. Algunos navegadores la marcan como «No segura» y eso espanta a los clientes.');

  const mobile = viewport && /width\s*=\s*device-width/i.test(viewport);
  add('mobile', 'Se adapta al celular', mobile ? 'ok' : 'bad',
    mobile ? 'La página está preparada para verse en pantallas chicas. En la propuesta revisamos qué se ve primero.'
      : 'La página no está preparada para el celular: se ve como la versión de computadora, en chiquito. La mayoría de tus clientes entra desde el teléfono.');

  const secs = page.total / 1000;
  add('speed', 'Velocidad', secs < 2 ? 'ok' : secs < 4 ? 'warn' : 'bad',
    `Tardó ${secs.toFixed(1)} segundos en descargar desde nuestro servidor${page.size > 1_500_000 ? ' y pesa mucho para un celular con datos' : ''}. ${secs < 2 ? 'Está bien.' : 'Cada segundo de espera hace que más gente se regrese a Google.'}`);

  const wa = /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/|web\.whatsapp\.com|wa\.link\//i.test(html);
  add('whatsapp', 'WhatsApp', wa ? 'ok' : 'bad',
    wa ? 'Tiene un enlace directo a WhatsApp.' : 'No encontramos un botón que abra WhatsApp. Es por donde la mayoría prefiere escribir.');

  const tel = /href=["']tel:/i.test(html);
  add('call', 'Llamar con un toque', tel ? 'ok' : 'warn',
    tel ? 'El teléfono se puede tocar para llamar.' : 'El teléfono no se puede tocar para llamar desde el celular: hay que copiarlo a mano.');

  const bookingTool = /calendly\.com|doctoralia|agendapro|reservo\.cl|simplybook|setmore|square\.site\/book|opentable|booksy|fresha|cal\.com\//i.test(html);
  const bookingWord = /\b(agenda|agendar|reserva|reservar|haz tu cita|pide tu cita|solicita tu cita|cotiza|cotizar|cotización)\b/i.test(text);
  const form = /<form[\s>]/i.test(html);
  add('cta', 'Pedir cita o cotización', bookingTool ? 'ok' : (bookingWord || form) ? 'warn' : 'bad',
    bookingTool ? 'Se puede agendar en línea.'
      : (bookingWord || form) ? 'Hay forma de contactarte, pero no encontramos una agenda o cotizador en línea en la portada.'
        : 'No encontramos un botón claro para pedir cita, reservar o cotizar.');

  const titleOk = title.length >= 15 && title.length <= 65;
  const descOk = desc && desc.length >= 50 && desc.length <= 170;
  add('google', 'Cómo te ve Google', titleOk && descOk ? 'ok' : title ? 'warn' : 'bad',
    !title ? 'No encontramos el título de la página en su código. Sin él, Google tarda más en entender de qué trata.'
      : `El título en Google es «${title.slice(0, 80)}${title.length > 80 ? '…' : ''}». ${descOk ? 'Tiene descripción.' : 'No tiene una descripción clara, así que Google la inventa con cualquier texto de la página.'}`);

  const map = /google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|waze\.com/i.test(html);
  add('map', 'Cómo llegar', map ? 'ok' : 'warn',
    map ? 'Tiene mapa o enlace para llegar.' : 'No encontramos un mapa ni un botón para abrir la ubicación en Google Maps o Waze.');

  if (copyright) add('fresh', 'Información al día', copyright >= year - 1 ? 'ok' : 'warn',
    copyright >= year - 1 ? `El pie de página dice ${copyright}.` : `El pie de página dice © ${copyright}. Un dato viejo hace dudar de todo lo demás, como precios y horarios.`);

  const reviews = /reseñas|opiniones|testimonios|google reviews|estrellas|★/i.test(text) || /elfsight|trustindex|embedsocial/i.test(lower);
  add('reviews', 'Opiniones de clientes', reviews ? 'ok' : 'warn',
    reviews ? 'Muestra opiniones de clientes.' : 'No muestra opiniones de clientes. Las reseñas de Google son lo que más convence a quien no te conoce.');

  const counts = checks.reduce((a, c) => (a[c.status]++, a), { ok: 0, warn: 0, bad: 0 });
  return { title, description: desc, checks, counts };
}


const abs = (u, base) => { try { const x = new URL(u.trim(), base); return /^https?:$/.test(x.protocol) ? x.href : null; } catch { return null; } };
const uniq = (arr, n) => [...new Set(arr.filter(Boolean))].slice(0, n);
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// Contenido útil para armar la propuesta. Todo es texto de un sitio ajeno:
// la rutina lo trata como datos, nunca como instrucciones.
export function extract(page) {
  const { html, finalUrl } = page;
  const body = html.replace(/<!--[\s\S]*?-->/g, ' ');
  const noScript = body.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>/gi, ' ');
  const tags = (re) => [...noScript.matchAll(re)].map(m => strip(m[1]));
  const text = strip(noScript.replace(/<script[\s\S]*?<\/script>/gi, ' '));

  const jsonld = [];
  for (const m of body.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1].trim());
      const items = [data, ...(data['@graph'] || [])].flat();
      for (const it of items) {
        const t = [].concat(it?.['@type'] || []).join(',');
        if (/Business|Dentist|Medical|Clinic|Physician|Restaurant|Hotel|Store|Organization|RealEstate|Legal|Accounting|Place/i.test(t)) jsonld.push(clip(JSON.stringify(it), 3000));
      }
    } catch { /* JSON-LD inválido: se ignora */ }
  }

  const links = [...body.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({ href: m[1].replace(/&amp;/g, '&').trim(), label: strip(m[2]) }));
  const hrefs = links.map(l => l.href);
  const images = [];
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = tag.match(/\s(?:data-src|data-lazy-src|src)=["']([^"']+)["']/i)?.[1] || tag.match(/\ssrcset=["']([^\s"',]+)/i)?.[1];
    const url = src && abs(src, finalUrl);
    if (!url || /\.svg(\?|$)|data:|pixel|spacer|blank\.gif|gravatar|facebook\.com\/tr/i.test(url)) continue;
    const w = +(tag.match(/\swidth=["']?(\d+)/i)?.[1] || 0);
    if (w && w < 120) continue;
    images.push({ url, alt: clip(strip(tag.match(/\salt=["']([^"']*)["']/i)?.[1] || ''), 120), logo: /logo/i.test(tag) });
  }
  for (const m of body.matchAll(/background-image:\s*url\((['"]?)([^'")]+)\1\)/gi)) { const url = abs(m[2], finalUrl); if (url && !/\.svg/i.test(url)) images.push({ url, alt: '', logo: false }); }

  const lines = uniq(tags(/<(?:p|li|td|dd|address|span|div)\b[^>]*>([^<]{25,400})</gi).map(t => t.trim()), 400);
  const pick = (re, n) => uniq(lines.filter(l => re.test(l)), n);
  const phonesText = [...text.matchAll(/(?:\+?52[\s.-]?)?(?:\(?\d{2,3}\)?[\s.-]?)\d{3,4}[\s.-]?\d{4}/g)].map(m => m[0].trim());

  return {
    url: finalUrl,
    lang: html.match(/<html[^>]*\slang=["']([^"']+)/i)?.[1] || null,
    title: strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || meta(html, 'og:title'),
    description: meta(html, 'description') || meta(html, 'og:description'),
    themeColor: meta(html, 'theme-color'),
    ogImage: abs(meta(html, 'og:image') || '', finalUrl),
    jsonld: jsonld.slice(0, 3),
    headings: uniq(tags(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi).map(t => clip(t, 160)), 40),
    nav: uniq(links.filter(l => l.label && l.label.length < 30 && !/^https?:|^mailto|^tel/i.test(l.label)).map(l => l.label), 20),
    phones: uniq([...hrefs.filter(h => /^tel:/i.test(h)).map(h => decodeURIComponent(h.slice(4))), ...phonesText], 6),
    whatsapp: uniq(hrefs.filter(h => /wa\.me|whatsapp\.com|wa\.link/i.test(h)), 3),
    emails: uniq([...hrefs.filter(h => /^mailto:/i.test(h)).map(h => h.slice(7).split('?')[0]), ...(text.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/g) || [])], 3),
    social: uniq(hrefs.filter(h => /instagram\.com|facebook\.com|tiktok\.com|youtube\.com|linkedin\.com/i.test(h) && !/sharer|share\.php|intent/i.test(h)), 6),
    maps: uniq(hrefs.filter(h => /google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|waze\.com/i.test(h)), 2),
    booking: uniq(hrefs.filter(h => /calendly|doctoralia|agendapro|simplybook|setmore|booksy|fresha|opentable|cal\.com/i.test(h)), 3),
    address: pick(/\b(col\.|colonia|c\.p\.|cp\s?\d|av\.|avenida|calle|blvd|boulevard|local \d|piso \d)/i, 4),
    hours: pick(/\b(lunes|martes|sábado|sabado|domingo|horario|lun\s?a\s?vie|l-v)\b/i, 5),
    prices: pick(/\$\s?\d/, 12),
    paragraphs: lines.filter(l => l.length >= 40).slice(0, 60).map(l => clip(l, 400)),
    images: uniq(images.map(i => JSON.stringify(i)), 30).map(j => JSON.parse(j)),
  };
}

// Abre la página (con respaldo a http) y devuelve revisión + contenido.
export async function readSite(href) {
  const page = await fetchPage(href).catch(err => { if (err.user) throw err; return fetchPage(href.replace('https://', 'http://')); });
  if (page.status >= 400 || !/html/i.test(page.type)) return { page, reachable: false };
  return { page, reachable: true, review: review(page), content: extract(page) };
}
