import Stripe from 'stripe';

// La clave vive en STRIPE_SECRET_KEY (variable de entorno de Vercel o .env).
// Nunca se escribe en el código ni se manda al navegador.
let client;
export function stripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Falta STRIPE_SECRET_KEY');
    client = new Stripe(key, {
      appInfo: { name: 'ceibalabs-site', url: 'https://www.ceibalabs.io' },
      // Cliente basado en fetch: funciona en Vercel y respeta proxies (NODE_USE_ENV_PROXY=1).
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return client;
}

export const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
