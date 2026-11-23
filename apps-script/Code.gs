/**
 * Feminario — Calendario de adviento
 * Hojas (se crean solas):
 *  · Registro   → una fila por mujer que empieza (correo, nombre, fecha)
 *  · Respuestas → una fila por día completado (correo, día, datos en JSON). Si repite el día, se agrega otra fila.
 *  · Muro       → frases del día 10. Escribe "sí" en la columna Aprobada para que aparezcan en el muro público.
 * Instalación: Hoja nueva → Extensiones → Apps Script → pega este archivo →
 * Implementar → Aplicación web → Ejecutar como YO · Acceso: Cualquier persona → copia la URL /exec en assets/config.js (API_URL).
 */
var TABS = {
  registro: ["Fecha", "Correo", "Nombre"],
  respuestas: ["Fecha", "Correo", "Nombre", "Día", "Datos (JSON)"],
  muro: ["Fecha", "Correo", "Frase", "Aprobada"]
};

function hoja_(clave) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nombre = { registro: "Registro", respuestas: "Respuestas", muro: "Muro" }[clave];
  var sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(TABS[clave]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, TABS[clave].length).setFontWeight("bold").setBackground("#C2CBFF");
  }
  return sh;
}
function seguro_(v) { v = String(v == null ? "" : v); return /^[=+\-@]/.test(v) ? "'" + v : v; } // evita fórmulas

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = JSON.parse(e.postData.contents), ahora = new Date();
    if (d.tipo === "registro") {
      var sh = hoja_("registro"), existe = sh.getLastRow() > 1 && sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().some(function (r) { return String(r[0]).toLowerCase() === String(d.correo).toLowerCase(); });
      if (!existe) sh.appendRow([ahora, seguro_(d.correo), seguro_(d.nombre)]);
    } else if (d.tipo === "dia") {
      hoja_("respuestas").appendRow([ahora, seguro_(d.correo), seguro_(d.nombre), d.dia, seguro_(JSON.stringify(d.datos || {}))]);
    } else if (d.tipo === "muro") {
      hoja_("muro").appendRow([ahora, seguro_(d.correo), seguro_(String(d.frase || "").slice(0, 400)), ""]);
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.accion === "muro") {
    var sh = hoja_("muro"), n = sh.getLastRow();
    var frases = n > 1 ? sh.getRange(2, 3, n - 1, 2).getValues().filter(function (r) { return String(r[1]).toLowerCase().trim() === "sí" || String(r[1]).toLowerCase().trim() === "si"; }).map(function (r) { return r[0]; }) : [];
    return out_({ ok: true, frases: frases });
  }
  return out_({ ok: true, service: "feminario-calendario-adviento" });
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
