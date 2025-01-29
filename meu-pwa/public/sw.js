const CACHE_NAME = "task-manager-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/main.js",
    "/manifest.json",
    "/icon-192x192.png",
    "/icon-512x512.png"
];

// Instalar o Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar requisições e servir do cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// Atualizar o cache quando necessário
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => caches.delete(cache))
            );
        })
    );
});
