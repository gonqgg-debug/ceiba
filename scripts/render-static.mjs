// Escribe site/propuesta-clinica-arrayan.html con el mismo render que /p/[slug].
import { writeFileSync } from 'node:fs';
import demo from '../lib/demos/clinica-arrayan.js';
import { renderProposal } from '../lib/render-proposal.js';

const out = new URL('../site/propuesta-clinica-arrayan.html', import.meta.url);
writeFileSync(out, renderProposal({ ...demo, allowedPlans: ['esencial', 'negocio', 'avanzado'] }));
console.log('site/propuesta-clinica-arrayan.html (render de lib/render-proposal.js)');
