const CACHE_NAME = "task-manager-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icones/iconApp.png",
];

// Instalar o Service Worker, faz o cache dos arquivos essenciais p rodar offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar requisições e servir do cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se encontrar a requisição no cache, retorna ela
      return response || fetch(event.request); // Senão, faz o fetch normalmente
    })
  );
});

// Atualizar o cache quando necessário
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

//executar notificações em background
self.addEventListener("push", (event) => {
  const options = {
    body: "Você tem uma nova tarefa!",
    icon: "/icones/iconApp.png",
    badge: "/icones/iconApp.png",
  };

  event.waitUntil(
    self.registration.showNotification("Notificação do Task Manager", options)
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-tasks") {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  const tasks = await getPendingTasks();
  for (const task of tasks) {
    await sendTaskToServer(task);
  }
}
