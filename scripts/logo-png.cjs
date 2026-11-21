// PNG del logo a partir de los SVG de marca/ (correr después de scripts/logo.py).
//   node scripts/logo-png.cjs   ->  site/apple-touch-icon.png, site/img/ceiba-icono.png, site/img/ceiba-logo.png,
//                                  marca/ceiba-icono.png, marca/ceiba-logo.png (fondo transparente) y una base para favicon.ico
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');
(async () => {
  const b = await chromium.launch();
  const shot = async (svgFile, w, h, out, { pad = 0, bg = null } = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const svg = fs.readFileSync(path.join(root, svgFile), 'utf8');
    await p.setContent(`<body style="margin:0;background:${bg || 'transparent'};display:grid;place-items:center;width:${w}px;height:${h}px">
      <div style="width:${w - pad * 2}px;height:${h - pad * 2}px;display:grid;place-items:center">${svg.replace('<svg ', '<svg style="width:100%;height:100%" ')}</div></body>`);
    await p.screenshot({ path: path.join(root, out), omitBackground: !bg });
    await p.close();
  };
  await shot('marca/ceiba-icono.svg', 180, 180, 'site/apple-touch-icon.png');
  await shot('marca/ceiba-icono.svg', 512, 512, 'site/img/ceiba-icono.png');
  await shot('marca/ceiba-icono.svg', 512, 512, 'marca/ceiba-icono.png');
  await shot('marca/ceiba-icono.svg', 256, 256, 'marca/favicon-256.png');
  await shot('marca/ceiba-logo.svg', 1200, 260, 'site/img/ceiba-logo.png', { pad: 20, bg: '#081036' });
  await shot('marca/ceiba-logo.svg', 1200, 260, 'marca/ceiba-logo.png', { pad: 20 });
  await shot('marca/ceiba-logo-oscuro.svg', 1200, 260, 'marca/ceiba-logo-oscuro.png', { pad: 20 });
  await b.close();
  console.log('PNG listos');
})();
