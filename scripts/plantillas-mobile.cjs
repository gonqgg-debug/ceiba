// Capturas de celular (300x600) de algunas plantillas para el muro de /webs: site/plantillas/img/m/<id>.jpg
// Con el servidor local en site/ (python3 -m http.server 8791): node scripts/plantillas-mobile.cjs id ...
const { chromium } = require('playwright');
const { mkdirSync } = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, '../site/plantillas/img/m'); mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 375, height: 750 }, deviceScaleFactor: 0.8 });
  for (const id of process.argv.slice(2)) {
    await p.goto(`http://localhost:8791/plantillas/${id}.html`, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '.pl-back{display:none!important}' });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: path.join(out, `${id}.jpg`), type: 'jpeg', quality: 70 });
    console.log('celular', id);
  }
  await b.close();
})();
