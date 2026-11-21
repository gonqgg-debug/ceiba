// Registro de diseños con portada propia (uno por sitio de referencia; ficha en catalogo.js).
// Cada diseño: render(c, { mode, marks, fontVars }), su Google Fonts y los rubros donde aplica.

import { renderEstudio, ESTUDIO_FONTS } from './estudio.js';
import { renderGaleria, GALERIA_FONTS } from './galeria.js';
import { renderFresca, FRESCA_FONTS } from './fresca.js';
import { renderCapsula, CAPSULA_FONTS } from './capsula.js';
import { renderCine, CINE_FONTS } from './cine.js';
import { renderEstrellas, ESTRELLAS_FONTS } from './estrellas.js';
import { renderGlam, GLAM_FONTS } from './glam.js';
import { renderCiudad, CIUDAD_FONTS } from './ciudad.js';
export const DESIGNS = {
  estudio: { render: renderEstudio, fonts: ESTUDIO_FONTS, kinds: ['clinica'] },
  galeria: { render: renderGaleria, fonts: GALERIA_FONTS, kinds: ['clinica'] },
  fresca: { render: renderFresca, fonts: FRESCA_FONTS, kinds: ['clinica'] },
  capsula: { render: renderCapsula, fonts: CAPSULA_FONTS, kinds: ['clinica'] },
  cine: { render: renderCine, fonts: CINE_FONTS, kinds: ['clinica'] },
  estrellas: { render: renderEstrellas, fonts: ESTRELLAS_FONTS, kinds: ['clinica'] },
  glam: { render: renderGlam, fonts: GLAM_FONTS, kinds: ['clinica'] },
  ciudad: { render: renderCiudad, fonts: CIUDAD_FONTS, kinds: ['clinica'] },
};
