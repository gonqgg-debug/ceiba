// POST /api/publish  (uso interno del equipo de Ceiba)
// Se llama el día en que se publica la web del cliente: crea la suscripción
// mensual con la tarjeta que guardó al pagar la activación.
//
//   curl -X POST https://www.ceibalabs.io/api/publish \
//     -H "Authorization: Bearer $CEIBA_ADMIN_TOKEN" \
//     -H "Content-Type: application/json" \
//     -d '{"customer":"cus_..."}'
//
// Es idempotente: si el cliente ya tiene su suscripción, la devuelve sin crear otra.
import { timingSafeEqual } from 'node:crypto';
import { json, stripe } from '../lib/stripe.js';
import { startSubscription } from '../lib/subscription.js';

function authorized(request) {
  const expected = process.env.CEIBA_ADMIN_TOKEN;
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!expected || !given) return false;
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!authorized(request)) return json({ error: 'No autorizado.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }
  const s = stripe();

  // Acepta el cliente o la sesión de Checkout de la activación.
  let customerId = body?.customer;
  if (!customerId && body?.session_id) customerId = (await s.checkout.sessions.retrieve(body.session_id)).customer;
  if (!customerId) return json({ error: 'Indica "customer" o "session_id".' }, 400);

  try { return json(await startSubscription(customerId)); }
  catch (err) { return json({ error: err.message }, err.status || 502); }
}
