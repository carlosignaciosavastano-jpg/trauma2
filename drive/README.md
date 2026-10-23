# Guardado de jugadores en Drive

El servidor manda cada nombre a una web app de Apps Script, que lo agrega a la hoja `jugadores` (Drive > TRAUMA2).

## Desplegar la web app

1. Abrí <https://script.new> y pegá el contenido de `Code.gs`.
2. Configuración del proyecto > Propiedades del script > agregá `TOKEN` con una clave larga cualquiera.
3. Implementar > Nueva implementación > Aplicación web. Ejecutar como: **Yo**. Acceso: **Cualquier persona**. Copiá la URL.
4. Copiá `.env.example` a `.env`, completá `JUGADORES_URL` (la URL) y `JUGADORES_TOKEN` (la misma clave del paso 2) y arrancá con `npm start`. `.env` está en `.gitignore`.

Sin esas variables el juego funciona igual y no guarda nada.

## Cambiar de carpeta o de hoja

Cuando esté definida la carpeta final, copiá la hoja ahí y cambiá `SHEET_ID` en `Code.gs`. Volvé a implementar (nueva versión).
