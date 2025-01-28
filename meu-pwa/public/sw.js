self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
    event.waitUntil(
        caches.open('meu-pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/styles.css',
                '/script.js',
                '/icon-192x192.png',
                '/icon-512x512.png',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
