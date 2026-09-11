// Tiene l'app in memoria sul telefono: si apre anche senza rete.
// Cambiare VERSIONE a ogni modifica dei file, così il telefono scarica quelli nuovi.
const VERSIONE = "contatti-v3";
const FILE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

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

// Prima la copia salvata (apertura istantanea), intanto aggiorna in sottofondo.
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const url = new URL(r.url);
  const base = new URL("./", self.registration.scope);
  const nome = "./" + url.pathname.slice(base.pathname.length);
  if (url.origin !== location.origin || !FILE.includes(nome)) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(salvata => {
      const rete = fetch(r).then(risp => {
        if (risp.ok) { const copia = risp.clone(); caches.open(VERSIONE).then(c => c.put(r, copia)); }
        return risp;
      }).catch(() => salvata);
      return salvata || rete;
    })
  );
});
