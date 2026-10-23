# Guardado de jugadores en Drive

El servidor manda cada nombre a una web app de Apps Script, que lo agrega a la hoja `jugadores` (Drive > TRAUMA2).

## Desplegar la web app

1. Abrí <https://script.new> y pegá el contenido de `Code.gs`.
2. Configuración del proyecto > Propiedades del script > agregá `TOKEN` con una clave larga cualquiera.
3. Implementar > Nueva implementación > Aplicación web. Ejecutar como: **Yo**. Acceso: **Cualquier persona**. Copiá la URL.
4. Arrancá el servidor con esas dos variables:

```
JUGADORES_URL=<la URL> JUGADORES_TOKEN=<la clave> npm start
```

Sin esas variables el juego funciona igual y no guarda nada.

## Cambiar de carpeta o de hoja

Cuando esté definida la carpeta final, copiá la hoja ahí y cambiá `SHEET_ID` en `Code.gs`. Volvé a implementar (nueva versión).
