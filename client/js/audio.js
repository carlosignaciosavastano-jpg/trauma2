// Audio sintetizado: chiptune en La menor + zumbido de la lampara. Sin archivos.
// El navegador exige un gesto del usuario: start() se llama desde un click.
let ac, buzzGain;

const ARP = [220, 261.63, 329.63, 261.63, 220, 246.94, 311.13, 246.94];
const BASS = [110, 110, 103.83, 110];

function tone(f, type, vol, dur) {
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + dur);
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
    tone(ARP[i % ARP.length], 'square', 0.04, 0.18);
    if (i % 4 === 0) tone(BASS[(i / 4) % BASS.length], 'triangle', 0.08, 0.7);
    i++;
  }, 220);
}

export const on = () => !!ac;

// Zumbido encendido solo mientras la lampara esta prendida.
export const buzz = (v) => buzzGain?.gain.setTargetAtTime(v ? 0.03 : 0, ac.currentTime, 0.01);
