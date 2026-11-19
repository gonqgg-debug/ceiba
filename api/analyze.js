// POST /api/analyze   { "url": "clinica.com" }
// Revisión automática y rápida de la página de un negocio. No guarda nada.
// Devuelve una lista de puntos en lenguaje simple: bien / mejorable / falta.
import { json } from '../lib/stripe.js';
import { parseSite } from '../lib/url.js';
import { readSite } from '../lib/site-reader.js';

export async function POST(request) {
  let body; try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }
  const site = parseSite(body?.url);
  if (!site) return json({ error: 'Esa dirección no parece válida. Debe verse como tunegocio.com' }, 400);

  let page, result;
  try {
    result = await readSite(site.href); page = result.page;
  } catch (err) {
    const timeout = err.name === 'TimeoutError' || err.cause?.name === 'TimeoutError';
    console.warn('analyze: no se pudo abrir', site.host, err.code || err.name, err.message);
    return json({
      host: site.host, reachable: false,
      reason: err.user || (timeout ? 'Tu página tardó demasiado en responder (más de 9 segundos).' : 'No pudimos abrir tu página desde nuestro servidor. Puede estar caída o bloquear revisiones automáticas.'),
    });
  }
  if (page.status >= 400 || !/html/i.test(page.type)) {
    return json({ host: site.host, reachable: false, reason: page.status >= 400 ? `Tu página respondió con un error (${page.status}).` : 'La dirección no lleva a una página web.' });
  }
  return json({ host: site.host, finalUrl: page.finalUrl, reachable: true, checkedAt: new Date().toISOString(), seconds: +(page.total / 1000).toFixed(1), ...result.review });
}
