// Offline support: keep a copy of every app file on the device.
// Bump VERSION whenever index.html changes so phones pick up the update.
const VERSION = "conjugaison-v1";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts.css",
  "icon-256.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "fonts/CormorantGaramond-500-latin-ext.woff2",
  "fonts/CormorantGaramond-500-latin.woff2",
  "fonts/CormorantGaramond-500i-latin-ext.woff2",
  "fonts/CormorantGaramond-500i-latin.woff2",
  "fonts/CormorantGaramond-600-latin-ext.woff2",
  "fonts/CormorantGaramond-600-latin.woff2",
  "fonts/CormorantGaramond-600i-latin-ext.woff2",
  "fonts/CormorantGaramond-600i-latin.woff2",
  "fonts/Jost-300-latin-ext.woff2",
  "fonts/Jost-300-latin.woff2",
  "fonts/Jost-400-latin-ext.woff2",
  "fonts/Jost-400-latin.woff2",
  "fonts/Jost-500-latin-ext.woff2",
  "fonts/Jost-500-latin.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network first for the page (so updates arrive), cache first for everything else.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r;
    }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
