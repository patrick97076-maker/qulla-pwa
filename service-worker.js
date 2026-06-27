self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("q-cache").then(cache => {
      return cache.addAll([
        "/qulla-pwa/",
        "/qulla-pwa/index.html",
        "/qulla-pwa/app.js",
        "/qulla-pwa/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
