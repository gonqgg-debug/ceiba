// GET /api/geo  ->  { country: "MX", currency: "mxn" }
// País del visitante según Vercel, para mostrar precios en su moneda.
// No guarda nada. El cobro siempre usa la moneda fijada en la propuesta.
import { currencyFor } from '../lib/catalog.js';

export async function GET(request) {
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase().slice(0, 2) || null;
  return new Response(JSON.stringify({ country, currency: currencyFor(country) }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=3600', vary: 'x-vercel-ip-country' },
  });
}
