// Vercel Routing Middleware: los dominios de clientes ven su propia página.
// Todo host que no sea de Ceiba (ceibalabs.io, *.vercel.app, localhost) se reescribe a
// /api/site. Los archivos compartidos (/assets, /img, /media) se sirven tal cual.
export const config = { matcher: '/((?!api/|assets/|img/|media/|_vercel).*)' };

const OURS = /^(www\.)?ceibalabs\.io$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$/;

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.hostname).toLowerCase().replace(/:\d+$/, '');
  if (OURS.test(host)) return; // sitio de Ceiba: sigue normal
  const dest = new URL('/api/site', url);
  dest.searchParams.set('host', host);
  dest.searchParams.set('path', url.pathname);
  return new Response(null, { headers: { 'x-middleware-rewrite': dest.toString() } });
}
