// Web app de Apps Script: recibe { token, nombre, personaje } del servidor del juego
// y agrega una fila a la hoja "jugadores" (Drive > TRAUMA2). Ver drive/README.md para desplegarlo.
const SHEET_ID = '1seJlS1VG5EaNa5cB3QDZM1jhrF3EyOF2ddneLGTDVXc';

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.token !== PropertiesService.getScriptProperties().getProperty('TOKEN')) {
    return out({ ok: false, error: 'token' });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const fila = sh.getRange(sh.getLastRow() + 1, 1, 1, 3);
    fila.setNumberFormat('@'); // texto plano: un nombre que empiece con "=" no se ejecuta como formula
    fila.setValues([[
      Utilities.formatDate(new Date(), 'America/Argentina/San_Juan', 'yyyy-MM-dd HH:mm:ss'),
      String(d.nombre || ''),
      String(d.personaje || ''),
    ]]);
  } finally {
    lock.releaseLock();
  }
  return out({ ok: true });
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
