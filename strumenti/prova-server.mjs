// Server di prova in locale: serve l'app e finge di essere l'Apps Script su /finto-foglio.
// Uso: node strumenti/prova-server.mjs  →  http://localhost:8790
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const radice = join(dirname(fileURLToPath(import.meta.url)), "..");
const TIPI = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".webmanifest": "application/manifest+json", ".png": "image/png" };
const CODICE = "prova123";
const righe = new Map();

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/finto-foglio") {
    let corpo = "";
    for await (const pezzo of req) corpo += pezzo;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    let d; try { d = JSON.parse(corpo); } catch { return res.end('{"ok":false,"errore":"formato"}'); }
    if (d.codice !== CODICE) return res.end('{"ok":false,"errore":"codice"}');
    if (d.prova) return res.end('{"ok":true,"foglio":"Foglio finto"}');
    righe.set(d.contatto.id, d.contatto);
    console.log("RIGA", righe.size, JSON.stringify(d.contatto));
    return res.end('{"ok":true}');
  }
  if (url.pathname === "/righe") { res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify([...righe.values()])); }
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  try {
    const dati = await readFile(join(radice, file));
    res.setHeader("Content-Type", TIPI[extname(file)] || "application/octet-stream");
    res.end(dati);
  } catch { res.statusCode = 404; res.end("non trovato"); }
}).listen(8790, () => console.log("http://localhost:8790"));
