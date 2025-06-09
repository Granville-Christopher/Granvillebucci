const CACHE_NAME = "bucci-site-cache-v1";

const urlsToCache = [
  "/",
  "/buccimain.png",
  "/css/style.css",
  "/js/js.js",
  "/js/formapi.js", 
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
