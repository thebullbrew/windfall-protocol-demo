// The Windfall Protocol (Demo) — minimal PWA shell
const CACHE = "windfall-protocol-demo-v1";
const ASSETS = [
  "./", "index.html", "manifest.webmanifest",
  "icons/icon-512.png", "icons/icon-192.png", "icons/icon-180.png", "icons/icon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      return hit || fetch(e.request).catch(() => caches.match("index.html"));
    })
  );
});
