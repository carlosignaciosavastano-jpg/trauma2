// Puzzle 3: plano del hospital como laberinto. Salas y pasillos son rectangulos [x, y, w, h]
// en pixeles del canvas (320x200). Hay pasillos angostos (8), medios (12) y anchos (16), y callejones
// sin salida. El camino correcto es lineal: sala de medicos -> internado -> consultorios -> guardia.
export const SALAS = {
  inicio: { r: [8, 10, 46, 38], nombre: 'SALA DE MÉDICOS' },
  internado: { r: [80, 100, 90, 44], nombre: 'INTERNADO' },
  consultorios: { r: [190, 14, 100, 34], nombre: 'CONSULTORIOS EXTERNOS' },
  guardia: { r: [236, 150, 56, 40], nombre: 'GUARDIA' },
};

export const SIN_SALIDA = {
  archivo: { r: [26, 56, 28, 24], nombre: 'ARCHIVO' },
  farmacia: { r: [70, 174, 40, 20], nombre: 'FARMACIA' },
  quirofano: { r: [152, 60, 34, 24], nombre: 'QUIRÓFANO' },
};

// Cada union se solapa unos pixeles con la sala vecina para no dejar costuras.
export const PASILLOS = [
  [50, 24, 68, 12], // sala de medicos -> bajada
  [106, 24, 12, 80], // bajada al internado
  [50, 60, 60, 8], // callejon al archivo
  [88, 142, 8, 34], // callejon a la farmacia
  [166, 118, 76, 8], // internado -> subida (angosto)
  [232, 40, 16, 86], // subida a consultorios (ancho)
  [182, 66, 54, 8], // callejon al quirofano
  [272, 44, 12, 110], // consultorios -> guardia
];

const dentroDe = ([rx, ry, w, h], x, y) => x >= rx && x < rx + w && y >= ry && y < ry + h;

export const enSala = (id, x, y) => dentroDe(SALAS[id].r, x, y);

export const dentro = (x, y, sin = []) =>
  [...Object.entries(SALAS), ...Object.entries(SIN_SALIDA)].some(([id, s]) => !sin.includes(id) && dentroDe(s.r, x, y)) ||
  PASILLOS.some((p) => dentroDe(p, x, y));

// Sigue el recorrido del mouse. Empieza al entrar en la sala de medicos; si en algun punto del
// trayecto (se interpola entre eventos, para que un salto rapido no atraviese paredes) toca fuera
// de los pasillos, vuelve a empezar.
export class Recorrido {
  constructor() { this.reiniciar(); }

  reiniciar() {
    this.activo = false;
    this.fin = false;
    this.visto = new Set();
    this.ultimo = null;
    this.huella = [];
  }

  // Devuelve 'fuera' (reinicio), 'fin' (llego a la guardia) o null.
  mover(x, y) {
    if (this.fin) return null;
    if (!this.activo) {
      if (enSala('inicio', x, y)) { this.activo = true; this.ultimo = [x, y]; this.huella = [[x, y]]; }
      return null;
    }
    const [px, py] = this.ultimo;
    const n = Math.max(1, Math.ceil(Math.hypot(x - px, y - py) / 2));
    for (let i = 1; i <= n; i++) {
      const sx = px + ((x - px) * i) / n, sy = py + ((y - py) * i) / n;
      if (!dentro(sx, sy)) { this.reiniciar(); return 'fuera'; }
      for (const id of ['internado', 'consultorios', 'guardia']) if (enSala(id, sx, sy)) this.visto.add(id);
    }
    this.ultimo = [x, y];
    this.huella.push([x, y]);
    if (['internado', 'consultorios', 'guardia'].every((id) => this.visto.has(id))) { this.fin = true; return 'fin'; }
    return null;
  }
}
