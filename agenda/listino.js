// Listino di partenza: LISTINO PREZZI AGGIORNATO AL 05.05.2025 (prezzi) + COSTO AL MINUTO (durate).
// stimata: true = quel file non dava la durata, è una stima da far controllare ad Alessia.
// Da qui in poi si cambia dalle Impostazioni dell'app: questo file serve solo al primo avvio.
// usa = dove si fa: cabina, unghie (postazione), laser e pressoterapia (cabina + la macchina), nessuna.
const usoDefault = (categoria, nome) => /laser/i.test(nome) ? "laser" : /pressoterapia/i.test(nome) ? "pressoterapia" : categoria === "Mani" ? "unghie" : "cabina";
const s = (categoria, nome, minuti, prezzo, stimata) => ({ categoria, nome, minuti, prezzo, usa: usoDefault(categoria, nome), ...(stimata ? { stimata: true } : {}) });

const LISTINO = [
  s("Mani", "Manicure", 30, 20),
  s("Mani", "Semipermanente", 40, 25),
  s("Mani", "Ricostruzione corto", 60, 50),
  s("Mani", "Ricostruzione medio", 90, 55),
  s("Mani", "Ricostruzione lungo", 90, 65),
  s("Mani", "Ricostruzione onicofagiche", 90, 55),
  s("Mani", "Gel refill corto", 60, 35),
  s("Mani", "Gel refill medio", 60, 40),
  s("Mani", "Gel refill lungo", 60, 45),
  s("Mani", "Rimozione", 15, 10),

  s("Piedi", "Drypedicure laminare", 30, 25, true),
  s("Piedi", "Drypedicure estetico", 45, 35, true),
  s("Piedi", "Drypedicure profondo", 60, 45, true),
  s("Piedi", "Drypedicure completo", 60, 50, true),
  s("Piedi", "Trattamento ragadi", 30, 30, true),
  s("Piedi", "Applicazione smalto", 15, 5, true),
  s("Piedi", "Taglio unghie", 10, 10),
  s("Piedi", "Rimozione callo (singolo)", 5, 5),

  s("Epilazione donna", "Mezza gamba", 15, 15),
  s("Epilazione donna", "Gamba intera", 15, 20),
  s("Epilazione donna", "Pancia", 5, 10),
  s("Epilazione donna", "Inguine parziale", 10, 10),
  s("Epilazione donna", "Inguine totale", 15, 15),
  s("Epilazione donna", "Glutei", 5, 5),
  s("Epilazione donna", "Interno glutei", 5, 5),
  s("Epilazione donna", "Ascelle", 3, 8),
  s("Epilazione donna", "Braccia fino al gomito", 5, 10),
  s("Epilazione donna", "Braccia intere", 10, 15),
  s("Epilazione donna", "Dita", 5, 5),
  s("Epilazione donna", "Baffetti", 2, 3),
  s("Epilazione donna", "Sopracciglia", 5, 5),
  s("Epilazione donna", "Mento", 2, 2),
  s("Epilazione donna", "Viso", 8, 10),
  s("Epilazione donna", "Narici", 3, 3),

  s("Epilazione uomo", "Mezza gamba uomo", 10, 20),
  s("Epilazione uomo", "Gamba intera uomo", 20, 25),
  s("Epilazione uomo", "Petto", 15, 20),
  s("Epilazione uomo", "Schiena", 15, 25),
  s("Epilazione uomo", "Braccia uomo", 15, 20),
  s("Epilazione uomo", "Ascelle uomo", 5, 8),
  s("Epilazione uomo", "Sopracciglia uomo", 5, 5),
  s("Epilazione uomo", "Narici uomo", 3, 3),

  s("Viso", "Pulizia viso", 60, 45),
  s("Viso", "Trattamento viso specifico", 60, 55),
  s("Viso", "Pulizia viso + maschera LED", 60, 60),
  s("Viso", "Massaggio lifting viso (Guasha)", 45, 45, true),
  s("Viso", "Face & Scalp", 60, 50, true),

  s("Ciglia e sopracciglia", "Tinta sopracciglia", 20, 15),
  s("Ciglia e sopracciglia", "Laminazione ciglia", 60, 35),
  s("Ciglia e sopracciglia", "Laminazione sopracciglia", 60, 35),

  s("Corpo", "Massaggio total body", 60, 50),
  s("Corpo", "Trattamento corpo scrub", 60, 60),
  s("Corpo", "Paraffina mani o piedi", 20, 10),
  s("Corpo", "Fango", 60, 55, true),
  s("Corpo", "Dry brushing", 60, 60, true),

  s("Apparecchiature", "Pressoterapia", 30, 30),
  s("Apparecchiature", "Pressoterapia con bendaggio", 30, 40),
  s("Apparecchiature", "Laser 1 zona", 10, 29),
  s("Apparecchiature", "Laser 2 zone", 30, 58),
  s("Apparecchiature", "Laser 3 zone", 45, 87),
];

const IMPOSTAZIONI_PARTENZA = {
  operatrici: ["Alessia", "Denisa", "Marta", "Veronica"],
  risorse: { cabina: 3, unghie: 3, laser: 1, pressoterapia: 1 },
  // 0 = domenica. null = chiuso.
  orari: { 0: null, 1: ["09:00", "18:30"], 2: ["09:00", "18:30"], 3: ["09:00", "18:30"], 4: ["09:00", "18:30"], 5: ["09:00", "18:30"], 6: ["09:00", "18:30"] },
  // pausa per giorno, dentro l'orario di apertura: [dalle, alle] o null
  pause: {},
  // {appuntamenti} = un appuntamento per riga, con giorno, ora e trattamenti
  conferma: "Ciao {nome}, ecco il riepilogo da Alessia Estetica & Benessere:\n{appuntamenti}\nMi rispondi OK per confermare? Grazie!",
  promemoria: "Ciao {nome}, ti ricordo l'appuntamento di {giorno} alle {ora} da Alessia Estetica & Benessere. Se non riesci a venire, scrivimi pure qui. A presto!",
  servizi: LISTINO,
};
