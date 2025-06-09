const CACHE_NAME = "bucci-v1";

// Static files only
const urlsToCache = [
  "/", // Only if your homepage loads without error
  "https://placehold.co/40x40/fff/3B82F6?text=B",
  "/buccimain.png",
  "/css/style.css",
  "/js/js.js",
  "/js/formapi.js",
  // Optional: add a custom fallback page for offline
  // "/offline.html"
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("[SW] Cache addAll failed:", err);
      });
    })
  );

  self.skipWaiting(); // Force immediate activation
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      )
    )
  );

  self.clients.claim(); // Control pages ASAP
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Only cache valid responses
          if (
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return networkResponse;
        })
        .catch(() => {});
    })
  );
});
