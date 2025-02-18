const CACHE_NAME = "task-manager-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icones/iconApp.png",
];

// Instalar o Service Worker e armazenar os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Interceptar requisições e servir do cache se disponível
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => new Response("Offline"))
      );
    })
  );
});

// Remover caches antigos na ativação do novo Service Worker
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

// Exibir notificações push
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

// Sincronizar tarefas em segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-tasks") {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  try {
    const tasks = await getPendingTasks();
    for (const task of tasks) {
      await sendTaskToServer(task);
    }
  } catch (error) {
    console.error("Erro ao sincronizar tarefas:", error);
  }
}

// Função de placeholder para obter tarefas pendentes (deve ser implementada)
async function getPendingTasks() {
  return [];
}

// Função de placeholder para enviar tarefas ao servidor (deve ser implementada)
async function sendTaskToServer(task) {
  console.log("Enviando tarefa para o servidor:", task);
}
