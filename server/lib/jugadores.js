// Guarda al jugador en la hoja de Drive a traves de la web app de drive/Code.gs.
// Nunca lanza: si falta la URL o la llamada falla, el juego sigue igual.
export async function guardarJugador({ name, character }) {
  const { JUGADORES_URL: url, JUGADORES_TOKEN: token } = process.env;
  if (!url) return;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' }, // Apps Script lee el cuerpo igual y evita el preflight
      body: JSON.stringify({ token, nombre: name, personaje: character }),
      signal: AbortSignal.timeout(5000),
    });
    const res = await r.json();
    if (!res.ok) console.error('jugadores: rechazado:', res.error);
  } catch (e) {
    console.error('jugadores:', e.message);
  }
}
