// Riceve i contatti dall'app sul telefono e li scrive nel foglio "Contatti".
// Va incollato in: foglio Google → Estensioni → Apps Script, poi Distribuisci → App web.
// Se lo stesso contatto arriva due volte (es. dopo un "Riapri WhatsApp") aggiorna la riga, non la duplica.

const CODICE = "__CODICE__";
const INTESTAZIONE = ["ID", "Data e ora", "Evento", "Nome", "Cognome", "Telefono", "Azienda", "Cosa fa", "Email", "Note", "Consenso", "WhatsApp aperto"];

function doPost(e) {
  let dati;
  try { dati = JSON.parse(e.postData.contents); } catch (err) { return risposta({ ok: false, errore: "formato" }); }
  if (dati.codice !== CODICE) return risposta({ ok: false, errore: "codice" });

  const foglio = prendiFoglio();
  if (dati.prova) return risposta({ ok: true, foglio: SpreadsheetApp.getActiveSpreadsheet().getName() });

  const c = dati.contatto;
  if (!c || !c.id) return risposta({ ok: false, errore: "formato" });

  const riga = [
    c.id, new Date(c.creato), c.evento, c.nome, c.cognome, c.telefono, c.azienda, c.ruolo,
    c.email, c.note, c.consenso, c.waAperto ? new Date(c.waAperto) : ""
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const trovata = foglio.getRange("A:A").createTextFinder(c.id).matchEntireCell(true).findNext();
    if (trovata) foglio.getRange(trovata.getRow(), 1, 1, riga.length).setValues([riga]);
    else foglio.appendRow(riga);
  } finally {
    lock.releaseLock();
  }
  return risposta({ ok: true });
}

function doGet() {
  return risposta({ ok: true, servizio: "contatti-evento" });
}

function prendiFoglio() {
  const file = SpreadsheetApp.getActiveSpreadsheet();
  let foglio = file.getSheetByName("Contatti");
  if (!foglio) foglio = file.insertSheet("Contatti", 0);
  if (foglio.getLastRow() === 0) {
    foglio.appendRow(INTESTAZIONE);
    foglio.getRange(1, 1, 1, INTESTAZIONE.length).setFontWeight("bold");
    foglio.setFrozenRows(1);
    foglio.getRange("F:F").setNumberFormat("@");            // telefono come testo: tiene il "+39"
    foglio.getRange("B:B").setNumberFormat("dd/MM/yyyy HH:mm");
    foglio.getRange("L:L").setNumberFormat("dd/MM/yyyy HH:mm");
    foglio.hideColumns(1);                                    // l'ID serve solo all'app
  }
  return foglio;
}

function risposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
