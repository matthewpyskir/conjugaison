// Offline support: keep a copy of every app file on the device.
// Bump VERSION whenever index.html changes so phones pick up the update.
const VERSION = "verben-v3";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts.css",
  "icon-256.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "fonts/BodoniModa-0.woff2",
  "fonts/BodoniModa-1.woff2",
  "fonts/BodoniModa-2.woff2",
  "fonts/BodoniModa-3.woff2",
  "fonts/BodoniModa-4.woff2",
  "fonts/BodoniModa-5.woff2",
  "fonts/JosefinSans-6.woff2",
  "fonts/JosefinSans-7.woff2",
  "fonts/JosefinSans-8.woff2",
  "fonts/JosefinSans-9.woff2",
  "fonts/SourceSans3-10.woff2",
  "fonts/SourceSans3-11.woff2",
  "fonts/SourceSans3-12.woff2",
  "fonts/SourceSans3-13.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network first for the page (bypassing the browser cache so updates arrive), cache first for everything else.
// Installs download with cache: "reload" so a new version never stores stale files.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request.url, {cache: "no-cache"}).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r;
    }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request)));
});
