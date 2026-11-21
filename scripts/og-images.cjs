// Imágenes para compartir (Open Graph, 1200x630) de las páginas públicas, con la imagen nueva.
// Se toman del hero real de cada página, con solo el título y el logo.
// Uso: node scripts/og-images.cjs [http://localhost:PUERTO] (sirviendo site/)  ->  site/img/og/<nombre>.jpg
const { chromium } = require('playwright');
const path = require('path');
const base = process.argv[2] || 'http://localhost:8791';
const out = path.resolve(__dirname, '../site/img/og');
const PAGES = { inicio: 'index.html', webs: 'webs.html', ia: 'ia.html', clinicas: 'webs-clinicas.html' };
const HIDE = `.n-links,.n-cta,.n-menu,.lede,.n-acts,.w-audit,.w-alt,.i-log,.hero-tag,.audit,.crumbs,.breadcrumbs,[class*=crumb],nav[aria-label="Migas"],form,.hint{display:none!important}
  .n-nav{background:transparent!important;box-shadow:none!important}.n-nav .n-wrap{height:6rem!important}.n-brand{font-size:1.9rem!important}.n-orb{width:2.6rem!important;height:2.6rem!important}`;
(async () => {
  const b = await chromium.launch();
  for (const [name, url] of Object.entries(PAGES)) {
    const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await p.emulateMedia({ reducedMotion: name === 'inicio' ? 'no-preference' : 'no-preference' });
    await p.goto(`${base}/${url}`, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: HIDE });
    if (name === 'inicio') for (let i = 0; i < 30; i++) { await p.mouse.move(500 + i * 18, 280 + Math.sin(i / 3) * 90); await p.waitForTimeout(30); }
    await p.waitForTimeout(name === 'ia' ? 6000 : 3500);
    await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 84 });
    await p.close();
    console.log(name, 'ok');
  }
  await b.close();
})();
