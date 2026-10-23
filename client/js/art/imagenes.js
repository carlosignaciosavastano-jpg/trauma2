// Imagenes del juego (RX y foto del examen fisico). Devuelve null mientras no cargaron,
// asi las escenas dibujan un fondo liso y no se rompen si falta el archivo.
const cache = {};

export function imagen(nombre) {
  if (!(nombre in cache)) {
    if (typeof Image === 'undefined') cache[nombre] = null;
    else {
      const i = new Image();
      // la version empaquetada (pagina publicada) trae las imagenes embebidas en TRAUMA_ASSETS
      i.src = globalThis.TRAUMA_ASSETS?.[nombre] ?? new URL(`../../assets/${nombre}`, import.meta.url).href;
      cache[nombre] = i;
    }
  }
  const i = cache[nombre];
  return i && i.complete !== false && i.width > 0 ? i : null;
}
