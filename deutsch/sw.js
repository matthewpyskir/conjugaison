// Offline support: keep a copy of every app file on the device.
// Bump VERSION whenever index.html changes so phones pick up the update.
const VERSION = "verben-v1";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts.css",
  "icon-256.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "fonts/Archivo-0.woff2",
  "fonts/Archivo-1.woff2",
  "fonts/Archivo-10.woff2",
  "fonts/Archivo-11.woff2",
  "fonts/Archivo-12.woff2",
  "fonts/Archivo-13.woff2",
  "fonts/Archivo-14.woff2",
  "fonts/Archivo-15.woff2",
  "fonts/Archivo-16.woff2",
  "fonts/Archivo-17.woff2",
  "fonts/Archivo-18.woff2",
  "fonts/Archivo-19.woff2",
  "fonts/Archivo-2.woff2",
  "fonts/Archivo-20.woff2",
  "fonts/Archivo-21.woff2",
  "fonts/Archivo-22.woff2",
  "fonts/Archivo-23.woff2",
  "fonts/Archivo-24.woff2",
  "fonts/Archivo-25.woff2",
  "fonts/Archivo-26.woff2",
  "fonts/Archivo-27.woff2",
  "fonts/Archivo-28.woff2",
  "fonts/Archivo-29.woff2",
  "fonts/Archivo-3.woff2",
  "fonts/Archivo-30.woff2",
  "fonts/Archivo-31.woff2",
  "fonts/Archivo-32.woff2",
  "fonts/Archivo-33.woff2",
  "fonts/Archivo-34.woff2",
  "fonts/Archivo-35.woff2",
  "fonts/Archivo-4.woff2",
  "fonts/Archivo-5.woff2",
  "fonts/Archivo-6.woff2",
  "fonts/Archivo-7.woff2",
  "fonts/Archivo-8.woff2",
  "fonts/Archivo-9.woff2"
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
