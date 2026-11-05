// Tiene l'app in memoria sul dispositivo. Prima prova la rete, così la versione nuova
// si vede subito; senza connessione usa la copia salvata.
const VERSIONE = "agenda-v19";
const FILE = ["./", "./index.html", "./listino.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./logo.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r.url, { cache: "no-cache" }).then(risp => {   // chiede sempre al sito se c'è una versione nuova
      if (risp.ok) { const copia = risp.clone(); caches.open(VERSIONE).then(c => c.put(r, copia)); }
      return risp;
    }).catch(() => caches.match(r, { ignoreSearch: true }))
  );
});
