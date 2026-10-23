// Estado de la partida (un solo jugador) y logica de ayudas. Sin DOM: se prueba con node.
export const MAX_AYUDAS = 3;

// Puzzles del arranque, en orden: la ayuda apunta al primero sin resolver.
export const CADENA = ['cafe', 'mensajes', 'laberinto'];

export const AYUDAS = {
  cafe: 'Hummm… un buen café me vendría bien.',
  mensajes: 'Creo que debería ver de qué se trata',
  laberinto: 'Si solo supiera cómo llegar a la guardia?!',
  charretera: 'Hummm… creo que esto se hacía con la U ósea palpable',
  rx_piel: 'Ojalá tuviera ojos de RX',
  reduccion: 'Debería chequear que todo esté en su lugar',
  tecla: 'Humm… creo que sería un gran pianista',
  cinco_p: 'Humm… creo que debo revisar las 5 P',
};

const nuevo = (personaje, nombre) => ({
  personaje,
  nombre,
  ayudas: 0, // ayudas usadas en toda la partida (tope MAX_AYUDAS)
  resueltos: {}, // puzzles resueltos
  activo: null, // puzzle en curso: la ayuda apunta a este
  pantalla: 'sala', // contexto para los mensajes del celular
  dock: false, // el lugar del celular en el margen derecho esta visible
  celular: false, // el celular ya esta guardado en ese lugar
  atendidos: {}, // pacientes resueltos
  demandas: 0, // veces que lo demandaron
  caso: null, // paciente en el consultorio: { id, nodo, examen, dx, pedido }
});

export const game = nuevo(null, '');

export function resetGame(personaje, nombre) {
  Object.assign(game, nuevo(personaje, nombre));
}

export const activar = (id) => { game.activo = id; };

export function resolver(id) {
  game.resueltos[id] = true;
  if (game.activo === id) game.activo = null;
}

// Devuelve el texto de la ayuda, o null si no quedan.
export function pedirAyuda() {
  if (game.ayudas >= MAX_AYUDAS) return null;
  const id = game.activo ?? CADENA.find((p) => !game.resueltos[p]);
  game.ayudas++;
  return `Ayuda ${game.ayudas}/${MAX_AYUDAS}: ${AYUDAS[id] ?? 'Hummm… debería atender a algún paciente'}`;
}
