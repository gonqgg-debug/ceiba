// Miniaturas de la galería de plantillas (site/plantillas/img/<id>.jpg).
// Con el servidor local corriendo en site/ (python3 -m http.server 8791):
//   node scripts/plantillas-shots.cjs [id ...]   (sin ids: todas las páginas de site/plantillas)
const { chromium } = require('playwright');
const { readdirSync } = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, '../site/plantillas');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => f.slice(0, -5));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  for (const id of ids) {
    await p.goto(`http://localhost:8791/plantillas/${id}.html`, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '.pl-back{display:none!important}' });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: path.join(dir, 'img', `${id}.jpg`), type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log('miniatura', id);
  }
  await b.close();
})();
