export const W = 320, H = 200;

// Rectangulo relleno con coordenadas enteras (todo el arte se dibuja con esto).
export const R = (c, col, x, y, w, h) => {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

export const mk = (w = W, h = H) =>
  typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(w, h)
    : Object.assign(document.createElement('canvas'), { width: w, height: h });

// Desenfoque barato: achicar dos veces a la mitad y volver a subir suavizado.
export function blur(src) {
  let cur = src, w = W, h = H;
  for (let i = 0; i < 2; i++) {
    w /= 2; h /= 2;
    const s = mk(w, h), sc = s.getContext('2d');
    sc.imageSmoothingEnabled = true;
    sc.drawImage(cur, 0, 0, w, h);
    cur = s;
  }
  const d = mk(), dc = d.getContext('2d');
  dc.imageSmoothingEnabled = true;
  dc.imageSmoothingQuality = 'high';
  dc.drawImage(cur, 0, 0, W, H);
  return d;
}
