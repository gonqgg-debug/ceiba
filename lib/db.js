// Acceso a Supabase desde el servidor, por la API REST (sin dependencias).
// SUPABASE_SERVICE_ROLE_KEY salta RLS: vive solo en Vercel, nunca en el navegador.
const cfg = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
export const dbReady = () => !!cfg();

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const c = cfg();
  if (!c) throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  const res = await fetch(`${c.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: c.key,
      authorization: `Bearer ${c.key}`,
      'content-type': 'application/json',
      ...(prefer ? { prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

export const insert = async (table, row) => (await rest(table, { method: 'POST', body: row, prefer: 'return=representation' }))[0];
export const select = (table, query) => rest(`${table}?${query}`);
export const update = (table, query, patch) => rest(`${table}?${query}`, { method: 'PATCH', body: patch, prefer: 'return=representation' });
