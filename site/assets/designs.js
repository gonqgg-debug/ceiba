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
import { renderNogal, NOGAL_FONTS } from './nogal.js';
import { renderOla, OLA_FONTS } from './ola.js';
import { renderAbierto, ABIERTO_FONTS } from './abierto.js';
import { renderHogar, HOGAR_FONTS } from './hogar.js';
import { renderMenta, MENTA_FONTS } from './menta.js';
import { renderClara, CLARA_FONTS } from './clara.js';
import { renderRevista, REVISTA_FONTS } from './revista.js';
import { renderAhumado, AHUMADO_FONTS } from './ahumado.js';
import { renderDeli, DELI_FONTS } from './deli.js';
import { renderBanquete, BANQUETE_FONTS } from './banquete.js';
import { renderFantasia, FANTASIA_FONTS } from './fantasia.js';
import { renderBowl, BOWL_FONTS } from './bowl.js';
import { renderHelado, HELADO_FONTS } from './helado.js';
import { renderTrazo, TRAZO_FONTS } from './trazo.js';
import { renderTienda, TIENDA_FONTS } from './tienda.js';
import { renderFijo, FIJO_FONTS } from './fijo.js';
import { renderNoche, NOCHE_FONTS } from './noche.js';
export const DESIGNS = {
  estudio: { render: renderEstudio, fonts: ESTUDIO_FONTS, kinds: ['clinica'] },
  galeria: { render: renderGaleria, fonts: GALERIA_FONTS, kinds: ['clinica'] },
  fresca: { render: renderFresca, fonts: FRESCA_FONTS, kinds: ['clinica'] },
  capsula: { render: renderCapsula, fonts: CAPSULA_FONTS, kinds: ['clinica'] },
  cine: { render: renderCine, fonts: CINE_FONTS, kinds: ['clinica'] },
  estrellas: { render: renderEstrellas, fonts: ESTRELLAS_FONTS, kinds: ['clinica'] },
  glam: { render: renderGlam, fonts: GLAM_FONTS, kinds: ['clinica'] },
  ciudad: { render: renderCiudad, fonts: CIUDAD_FONTS, kinds: ['clinica'] },
  nogal: { render: renderNogal, fonts: NOGAL_FONTS, kinds: ['clinica'] },
  ola: { render: renderOla, fonts: OLA_FONTS, kinds: ['clinica'] },
  abierto: { render: renderAbierto, fonts: ABIERTO_FONTS, kinds: ['clinica'] },
  hogar: { render: renderHogar, fonts: HOGAR_FONTS, kinds: ['clinica'] },
  menta: { render: renderMenta, fonts: MENTA_FONTS, kinds: ['clinica'] },
  clara: { render: renderClara, fonts: CLARA_FONTS, kinds: ['clinica'] },
  revista: { render: renderRevista, fonts: REVISTA_FONTS, kinds: ['clinica'] },
  ahumado: { render: renderAhumado, fonts: AHUMADO_FONTS, kinds: ['restaurante'] },
  deli: { render: renderDeli, fonts: DELI_FONTS, kinds: ['restaurante'] },
  banquete: { render: renderBanquete, fonts: BANQUETE_FONTS, kinds: ['restaurante'] },
  fantasia: { render: renderFantasia, fonts: FANTASIA_FONTS, kinds: ['restaurante'] },
  bowl: { render: renderBowl, fonts: BOWL_FONTS, kinds: ['restaurante'] },
  helado: { render: renderHelado, fonts: HELADO_FONTS, kinds: ['restaurante'] },
  trazo: { render: renderTrazo, fonts: TRAZO_FONTS, kinds: ['restaurante'] },
  tienda: { render: renderTienda, fonts: TIENDA_FONTS, kinds: ['restaurante'] },
  fijo: { render: renderFijo, fonts: FIJO_FONTS, kinds: ['restaurante'] },
  noche: { render: renderNoche, fonts: NOCHE_FONTS, kinds: ['restaurante'] },
};
