// Normaliza lo que escribe el cliente: "Clinica.com/inicio" → { host, href }.
export function parseSite(raw) {
  let s = String(raw ?? '').trim();
  if (!s || s.length > 300 || /\s/.test(s)) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u; try { u = new URL(s); } catch { return null; }
  const h = u.hostname.toLowerCase();
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(h) || h.split('.').some(p => p.startsWith('-') || p.endsWith('-'))) return null;
  return { host: h.replace(/^www\./, ''), href: `https://${h}${u.pathname === '/' ? '/' : u.pathname}` };
}
