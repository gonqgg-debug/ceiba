#!/usr/bin/env node
// Servidor local: sirve site/ y las funciones de api/ igual que Vercel.
//   npm run dev   →  http://localhost:3000
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 3000);
process.env.SITE_URL ||= `http://localhost:${port}`;
const { rewrites = [] } = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  const url = new URL(req.url, process.env.SITE_URL);
  // Mismas reescrituras que vercel.json
  for (const { source, destination } of rewrites) {
    const re = new RegExp('^' + source.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), m = url.pathname.match(re);
    if (m) { const dest = new URL(destination.replace(/:(\w+)/g, (_, k) => encodeURIComponent(m.groups[k])), url); url.pathname = dest.pathname; dest.searchParams.forEach((v, k) => url.searchParams.set(k, v)); break; }
  }
  try {
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.slice(5).replace(/[^a-z-]/g, '');
      if (!name) { res.writeHead(404).end(); return; }
      const mod = await import(join(root, 'api', `${name}.js`));
      const handler = mod[req.method];
      if (!handler) { res.writeHead(405).end(); return; }
      const chunks = []; for await (const c of req) chunks.push(c);
      const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    if (path.endsWith('/')) path += 'index.html';
    const file = await readFile(join(root, 'site', path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' }).end(file);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'ERR_MODULE_NOT_FOUND') { res.writeHead(404).end('No encontrado'); return; }
    console.error(err); res.writeHead(500).end('Error');
  }
}).listen(port, () => console.log(`Ceiba Labs en ${process.env.SITE_URL}`));
