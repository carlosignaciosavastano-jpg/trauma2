// Audio sintetizado, sin archivos: chiptune en La menor, musica de terror y efectos.
// El navegador exige un gesto del usuario: start() se llama desde un click.
// Antes de start() todos los efectos son no-ops.
let ac, buzzGain, modo = 'chip';

const ARP = [220, 261.63, 329.63, 261.63, 220, 246.94, 311.13, 246.94];
const BASS = [110, 110, 103.83, 110];

// Oscilador con envolvente; `to` desliza la frecuencia, `lp` filtra (voz gruesa).
function tone(f, type, vol, dur, to, lp) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let out = o;
  if (lp) {
    const fl = ac.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = lp;
    out = o.connect(fl);
  }
  out.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + dur);
}

function noise(dur, vol, lp) {
  if (!ac) return;
  const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
  fl.type = 'lowpass';
  fl.frequency.value = lp;
  g.gain.value = vol;
  s.buffer = buf;
  s.connect(fl).connect(g).connect(ac.destination);
  s.start();
}

export function start() {
  if (ac) return;
  ac = new AudioContext();
  ac.resume();
  const o = ac.createOscillator();
  buzzGain = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.value = 100;
  buzzGain.gain.value = 0;
  o.connect(buzzGain).connect(ac.destination);
  o.start();
  let i = 0;
  setInterval(() => {
    if (modo === 'chip') {
      tone(ARP[i % ARP.length], 'square', 0.04, 0.18);
      if (i % 4 === 0) tone(BASS[(i / 4) % BASS.length], 'triangle', 0.08, 0.7);
    } else if (modo === 'scare') {
      if (i % 8 === 0) { tone(55, 'sawtooth', 0.09, 1.7, 52, 300); tone(77.8, 'sawtooth', 0.07, 1.7, 74, 300); } // tritono
      if (Math.random() < 0.25) tone(1400 + Math.random() * 900, 'sine', 0.025, 0.4, 900);
    }
    i++;
  }, 220);
}

export const on = () => !!ac;

// Musica de fondo: 'chip' (normal), 'scare' (terror) o 'off'.
export const musica = (m) => { modo = m; };

// Zumbido encendido solo mientras la lampara esta prendida.
export const buzz = (v) => buzzGain?.gain.setTargetAtTime(v ? 0.03 : 0, ac.currentTime, 0.01);

// Efectos
export const tunck = () => tone(95, 'square', 0.25, 0.14, 45);
export const hum = () => tone(112, 'sawtooth', 0.16, 0.8, 92, 380); // "Hummm" de voz gruesa
export const type = () => tone(850 + Math.random() * 250, 'square', 0.02, 0.03);
export const yawn = () => { tone(330, 'sawtooth', 0.07, 1.1, 110, 500); noise(1, 0.05, 900); };
export const sip = () => { noise(0.3, 0.08, 1400); tone(200, 'sine', 0.06, 0.3, 120); };
export const door = () => { noise(0.35, 0.35, 350); tone(70, 'sine', 0.3, 0.35, 35); };
export const babble = () => { for (let i = 0; i < 12; i++) setTimeout(() => tone(520 + Math.random() * 260, 'square', 0.03, 0.05), i * 85); };
export const triumph = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 'square', 0.07, 0.32), i * 120));
export const scream = () => tone(700, 'sawtooth', 0.1, 0.5, 1900);
export const stinger = () => { tone(80, 'sawtooth', 0.15, 0.9, 40); noise(0.5, 0.15, 500); };
export const ding = () => tone(1320, 'sine', 0.06, 0.25);
