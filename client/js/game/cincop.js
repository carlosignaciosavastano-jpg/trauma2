// Puzzle 7 (las 5 P): llenado capilar y dolor a la extension pasiva.
// Se aprietan las dos unas (quedan blancas y tardan 7 s en volver al rojo); mientras alguna este
// blanca hay que intentar extender los dos dedos flexionados. Con las dos cosas, el puzzle se completa.
export const VENTANA = 7000; // ms que tarda la una en ponerse roja

export class CincoP {
  constructor() {
    this.unas = [null, null]; // instante en que se apreto cada una (null = no apretada)
    this.apretadas = new Set();
    this.extendidos = new Set(); // dedos flexionados que se intentaron extender dentro de la ventana
  }

  // true mientras alguna una siga blanca
  ventana(t) { return this.unas.some((u) => u !== null && t - u < VENTANA); }

  blanca(i, t) { return this.unas[i] !== null && t - this.unas[i] < VENTANA; }

  unia(i, t) {
    this.unas[i] = t;
    this.apretadas.add(i);
  }

  // Devuelve false si el intento cae fuera de la ventana (no cuenta).
  dedo(i, t) {
    if (!this.ventana(t)) return false;
    this.extendidos.add(i);
    return true;
  }

  completo() { return this.apretadas.size === 2 && this.extendidos.size === 2; }
}
