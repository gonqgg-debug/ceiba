// Imágenes para los perfiles públicos de Ceiba (Google, Instagram, LinkedIn, Facebook).
//   node scripts/perfiles.cjs  ->  marca/perfiles/*.png
// Logo cuadrado sin esquinas redondeadas (cada red lo recorta en círculo), portada 16:9 y banner de LinkedIn.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'marca/perfiles');
fs.mkdirSync(out, { recursive: true });
const icon = fs.readFileSync(path.join(root, 'marca/ceiba-icono.svg'), 'utf8');
const logo = fs.readFileSync(path.join(root, 'marca/ceiba-logo.svg'), 'utf8');
const logoDark = fs.readFileSync(path.join(root, 'marca/ceiba-logo-oscuro.svg'), 'utf8');
// La gota sola, sin el cuadro redondeado del ícono
const orb = icon.replace(/<rect[^>]*\/>/, '').replace('viewBox="0 0 100 100"', 'viewBox="19 19 62 62"');
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;600&family=Geist:wght@400;500&display=swap">';
const GLOW = 'radial-gradient(60% 70% at 78% 30%,rgba(39,71,232,.55),transparent 70%),radial-gradient(45% 55% at 10% 95%,rgba(110,139,255,.25),transparent 70%),#081036';
const svg = (s, style) => s.replace('<svg ', `<svg style="${style}" `);
const pages = {
  // Perfil: gota centrada con aire para el recorte circular
  'ceiba-perfil-oscuro-720.png': [720, 720, `<body style="margin:0;width:720px;height:720px;display:grid;place-items:center;background:${GLOW}">${svg(orb, 'width:400px;height:400px')}</body>`],
  'ceiba-perfil-blanco-720.png': [720, 720, `<body style="margin:0;width:720px;height:720px;display:grid;place-items:center;background:#fff">${svg(orb, 'width:420px;height:420px')}</body>`],
  // Portada 16:9 (Google la recomienda en 1080x608): logo y la frase
  'ceiba-portada-1080x608.png': [1080, 608, `<body style="margin:0;width:1080px;height:608px;background:${GLOW};color:#fff;display:grid;align-content:center;padding:0 90px;box-sizing:border-box;font-family:Geist,sans-serif">
    ${svg(logo, 'height:62px;width:auto;display:block;margin-bottom:46px')}
    <div style="font:600 64px/1.02 'Funnel Display',sans-serif;letter-spacing:-.045em;max-width:12ch">Todo lo digital de tu negocio <span style="font-weight:300;color:#A9B4E0">empieza por tu página web.</span></div>
    <div style="margin-top:30px;font-size:24px;color:#A9B4E0">Páginas web, asistentes de WhatsApp y agentes de IA · ceibalabs.io</div></body>`],
  // Banner de LinkedIn (1584x396): el lado izquierdo lo tapa la foto de perfil
  'ceiba-linkedin-1584x396.png': [1584, 396, `<body style="margin:0;width:1584px;height:396px;background:${GLOW};color:#fff;display:grid;align-content:center;justify-items:end;padding:0 110px;box-sizing:border-box;font-family:Geist,sans-serif;text-align:right">
    <div style="font:600 54px/1.05 'Funnel Display',sans-serif;letter-spacing:-.04em">Todo lo digital de tu negocio <span style="font-weight:300;color:#A9B4E0">empieza por tu página web.</span></div>
    <div style="margin-top:18px;font-size:22px;color:#A9B4E0">Páginas web, asistentes de WhatsApp y agentes de IA para negocios · ceibalabs.io</div></body>`],
  // Logo horizontal para documentos y firmas
  'ceiba-logo-horizontal-blanco-fondo.png': [1200, 300, `<body style="margin:0;width:1200px;height:300px;display:grid;place-items:center;background:#fff">${svg(logoDark, 'height:110px;width:auto')}</body>`],
};
(async () => {
  const b = await chromium.launch();
  for (const [name, [w, h, body]] of Object.entries(pages)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8">${FONTS}</head>${body}</html>`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, name) });
    await p.close();
    console.log(name);
  }
  await b.close();
})();
