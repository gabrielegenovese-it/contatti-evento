// Genera icon-192.png e icon-512.png (zero dipendenze): fumetto bianco con un "+" su fondo verde petrolio.
// Uso: node strumenti/icone.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const qui = dirname(fileURLToPath(import.meta.url));
const FONDO = [15, 92, 85], BIANCO = [255, 255, 255];

const crcTab = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcTab[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function blocco(tipo, dati) {
  const len = Buffer.alloc(4); len.writeUInt32BE(dati.length);
  const td = Buffer.concat([Buffer.from(tipo), dati]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
}

// 0 = fondo, 1 = bianco, 2 = "+" (fondo dentro il fumetto). Coordinate normalizzate 0..1.
function forma(x, y) {
  const cx = 0.5, cy = 0.47, r = 0.25;
  const dentroCerchio = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  // coda del fumetto: triangolo in basso a sinistra
  const ax = 0.33, ay = 0.60, bx = 0.45, by = 0.69, qx = 0.29, qy = 0.77;
  const s = (px, py, ux, uy, vx, vy) => (px - vx) * (uy - vy) - (ux - vx) * (py - vy);
  const d1 = s(x, y, ax, ay, bx, by), d2 = s(x, y, bx, by, qx, qy), d3 = s(x, y, qx, qy, ax, ay);
  const dentroCoda = !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  if (!dentroCerchio && !dentroCoda) return 0;
  const braccio = 0.13, spess = 0.035;
  const piu = (Math.abs(x - cx) <= spess && Math.abs(y - cy) <= braccio) || (Math.abs(y - cy) <= spess && Math.abs(x - cx) <= braccio);
  return piu ? 2 : 1;
}

function png(lato) {
  const SS = 4, righe = [];
  for (let py = 0; py < lato; py++) {
    const riga = Buffer.alloc(1 + lato * 3); // filtro 0
    for (let px = 0; px < lato; px++) {
      let bianco = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        if (forma((px + (sx + 0.5) / SS) / lato, (py + (sy + 0.5) / SS) / lato) === 1) bianco++;
      }
      const t = bianco / (SS * SS);
      for (let k = 0; k < 3; k++) riga[1 + px * 3 + k] = Math.round(FONDO[k] + (BIANCO[k] - FONDO[k]) * t);
    }
    righe.push(riga);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lato, 0); ihdr.writeUInt32BE(lato, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8 bit, RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    blocco("IHDR", ihdr),
    blocco("IDAT", deflateSync(Buffer.concat(righe))),
    blocco("IEND", Buffer.alloc(0)),
  ]);
}

for (const lato of [192, 512]) {
  writeFileSync(join(qui, "..", `icon-${lato}.png`), png(lato));
  console.log(`icon-${lato}.png`);
}
