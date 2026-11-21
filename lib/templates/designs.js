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
import { renderRecreo, RECREO_FONTS } from './recreo.js';
import { renderTaberna, TABERNA_FONTS } from './taberna.js';
import { renderFiesta, FIESTA_FONTS } from './fiesta.js';
import { renderMercado, MERCADO_FONTS } from './mercado.js';
import { renderSpa, SPA_FONTS } from './spa.js';
import { renderEgeo, EGEO_FONTS } from './egeo.js';
import { renderAlpes, ALPES_FONTS } from './alpes.js';
import { renderArchivo, ARCHIVO_FONTS } from './archivo.js';
import { renderClasico, CLASICO_FONTS } from './clasico.js';
import { renderSelva, SELVA_FONTS } from './selva.js';
import { renderFinca, FINCA_FONTS } from './finca.js';
import { renderGlamping, GLAMPING_FONTS } from './glamping.js';
import { renderRancho, RANCHO_FONTS } from './rancho.js';
import { renderSafari, SAFARI_FONTS } from './safari.js';
import { renderMotel, MOTEL_FONTS } from './motel.js';
import { renderCalendario, CALENDARIO_FONTS } from './calendario.js';
import { renderPelicula, PELICULA_FONTS } from './pelicula.js';
import { renderReloj, RELOJ_FONTS } from './reloj.js';
import { renderVerano, VERANO_FONTS } from './verano.js';
import { renderArco, ARCO_FONTS } from './arco.js';
import { renderLocal, LOCAL_FONTS } from './local.js';
import { renderBrisa, BRISA_FONTS } from './brisa.js';
import { renderCartelera, CARTELERA_FONTS } from './cartelera.js';
import { renderLujo, LUJO_FONTS } from './lujo.js';
import { renderIsla, ISLA_FONTS } from './isla.js';
import { renderValua, VALUA_FONTS } from './valua.js';
import { renderAsesora, ASESORA_FONTS } from './asesora.js';
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
  recreo: { render: renderRecreo, fonts: RECREO_FONTS, kinds: ['restaurante'] },
  taberna: { render: renderTaberna, fonts: TABERNA_FONTS, kinds: ['restaurante'] },
  fiesta: { render: renderFiesta, fonts: FIESTA_FONTS, kinds: ['restaurante'] },
  mercado: { render: renderMercado, fonts: MERCADO_FONTS, kinds: ['restaurante'] },
  spa: { render: renderSpa, fonts: SPA_FONTS, kinds: ['hotel'] },
  egeo: { render: renderEgeo, fonts: EGEO_FONTS, kinds: ['hotel'] },
  alpes: { render: renderAlpes, fonts: ALPES_FONTS, kinds: ['hotel'] },
  archivo: { render: renderArchivo, fonts: ARCHIVO_FONTS, kinds: ['hotel'] },
  clasico: { render: renderClasico, fonts: CLASICO_FONTS, kinds: ['hotel'] },
  selva: { render: renderSelva, fonts: SELVA_FONTS, kinds: ['hotel'] },
  finca: { render: renderFinca, fonts: FINCA_FONTS, kinds: ['hotel'] },
  glamping: { render: renderGlamping, fonts: GLAMPING_FONTS, kinds: ['hotel'] },
  rancho: { render: renderRancho, fonts: RANCHO_FONTS, kinds: ['hotel'] },
  safari: { render: renderSafari, fonts: SAFARI_FONTS, kinds: ['hotel'] },
  motel: { render: renderMotel, fonts: MOTEL_FONTS, kinds: ['hotel'] },
  calendario: { render: renderCalendario, fonts: CALENDARIO_FONTS, kinds: ['hotel'] },
  pelicula: { render: renderPelicula, fonts: PELICULA_FONTS, kinds: ['hotel'] },
  reloj: { render: renderReloj, fonts: RELOJ_FONTS, kinds: ['hotel'] },
  verano: { render: renderVerano, fonts: VERANO_FONTS, kinds: ['hotel'] },
  arco: { render: renderArco, fonts: ARCO_FONTS, kinds: ['inmobiliaria'] },
  local: { render: renderLocal, fonts: LOCAL_FONTS, kinds: ['inmobiliaria'] },
  brisa: { render: renderBrisa, fonts: BRISA_FONTS, kinds: ['inmobiliaria'] },
  cartelera: { render: renderCartelera, fonts: CARTELERA_FONTS, kinds: ['inmobiliaria'] },
  lujo: { render: renderLujo, fonts: LUJO_FONTS, kinds: ['inmobiliaria'] },
  isla: { render: renderIsla, fonts: ISLA_FONTS, kinds: ['inmobiliaria'] },
  valua: { render: renderValua, fonts: VALUA_FONTS, kinds: ['inmobiliaria'] },
  asesora: { render: renderAsesora, fonts: ASESORA_FONTS, kinds: ['inmobiliaria'] },
};
