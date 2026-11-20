// GET /media/<slug>/<archivo>  (vercel.json lo reescribe a /api/media?p=...)
// Sirve el logo y las fotos que el cliente subió en su chat (bucket privado «materiales»)
// para usarlos en su página. Solo archivos que existen en el chat de ese cliente.
import { select } from '../lib/db.js';
import { signDownload } from '../lib/client-chat.js';

export async function GET(request) {
  const p = new URL(request.url).searchParams.get('p') || '';
  const slug = p.split('/')[0];
  if (!/^[a-z0-9-]{3,80}\/[\w.-]{1,120}$/.test(p) || p.includes('..')) return new Response('No encontrado', { status: 404 });
  try {
    const chat = (await select('client_chats', `slug=eq.${encodeURIComponent(slug)}&select=files&limit=1`))?.[0];
    const file = (chat?.files || []).find(f => f.path === p && /^image\//.test(f.type || ''));
    if (!file) return new Response('No encontrado', { status: 404 });
    const url = await signDownload(p, 60 * 60 * 24);
    return new Response(null, { status: 302, headers: { location: url, 'cache-control': 'public, max-age=3600' } });
  } catch (err) {
    console.error('media', err.message);
    return new Response('No disponible', { status: 502 });
  }
}
