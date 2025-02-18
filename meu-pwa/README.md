# Task Manager PWA (Progressive Web App)

Este é um **Task Manager** simples, desenvolvido como uma **Progressive Web App (PWA)**. Ele permite que você adicione, edite, marque como concluída e delete tarefas. A aplicação é feita com **HTML**, **CSS**, **JavaScript**, e utiliza **Service Workers** para cache de arquivos e funcionamento offline.

## Funcionalidades

- **Adicionar tarefas**: Você pode adicionar novas tarefas através de um formulário.
- **Marcar como concluída**: Ao marcar a checkbox, a tarefa é riscada, indicando que foi concluída.
- **Editar tarefas**: Tarefas podem ser editas após serem criadas.
- **Excluir tarefas**: Tarefas podem ser removidas da lista.
- **Trabalhando offline**: A aplicação utiliza **Service Workers** para garantir que ela funcione offline, armazenando os arquivos em cache.

## Tecnologias Utilizadas

- **HTML**: Estrutura da aplicação.
- **CSS**: Estilo da interface.
- **JavaScript**: Funcionalidade para adicionar, editar e excluir tarefas.
- **Node.js (Opcional)**: Para servir a aplicação localmente, caso deseje rodar em um servidor local.
- **PWA (Progressive Web App)**: Com suporte a **Service Workers** e **Cache**.

## Como Rodar a Aplicação

1. Clone este repositório para o seu computador:

    ```bash
    git clone https://github.com/mwlaofr/appPWA
    ```

2. Navegue até o diretório da aplicação:
    ```bash
        cd meu-pwa
    ```

3. Instale as dependências:
    ```bash
        npm install
    ```

4. Inicie o servidor:
    ```bash
        node server.js
    ```

5. Acesse a aplicação no seu navegador em http://localhost:3000.

## Como Funciona
- **Adicionar uma Tarefa:** Insira um nome de tarefa no campo de texto e clique no botão "Add Task". A tarefa será adicionada à lista de tarefas.
- **Marcar Tarefa como Concluída:** Clique na checkbox ao lado da tarefa para marcá-la como concluída. Isso riscará o texto da tarefa.
- **Excluir uma Tarefa:** Clique no botão "Delete" ao lado de qualquer tarefa para removê-la da lista.

## Arquivos Importantes
- **index.html:** O arquivo HTML principal que contém a estrutura da página.
- **style.css:** O arquivo de estilo que define o layout e a aparência da aplicação.
- **main.js:** O arquivo JavaScript que gerencia as funcionalidades da aplicação (adicionar, excluir e marcar tarefas).
- **sw.js:** O arquivo do Service Worker que garante o funcionamento offline da aplicação, armazenando arquivos em cache.
- **manifest.json:** O arquivo que define as configurações do PWA (como ícones e nome da aplicação).

## Código
### 1️⃣ `manifest.json` - Configuração do PWA
O **Web App Manifest** define as configurações do PWA, permitindo sua instalação como um aplicativo.

**Principais elementos:**
```json
{
  "name": "Task Manager",             // Nome completo do aplicativo
  "short_name": "TaskManager",        // Nome curto exibido em ícones
  "description": "Manage your tasks efficiently", // Descrição do app
  "start_url": "/",                   // Página inicial ao abrir o app
  "display": "standalone",            // Modo de exibição (standalone = sem barra do navegador)
  "background_color": "#ffffff",      // Cor de fundo ao iniciar
  "theme_color": "#4CAF50",           // Cor do tema principal
  "icons": [
    {
      "src": "icones/iconApp.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icones/iconApp.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2️⃣ `package.json` - Configuração do Node.js
Esse arquivo gerencia as dependências e scripts do projeto, garantindo que o servidor funcione corretamente.

**Principais elementos:**
```json
{
  "name": "meu_pwa",         // Nome do projeto
  "version": "1.0.0",       // Versão do aplicativo
  "main": "server.js",      // Arquivo principal da aplicação
  "dependencies": {           // Dependências necessárias
    "express": "^4.21.2"
  },
  "scripts": {
    "start": "node server.js",   // Comando para iniciar o servidor
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 3️⃣ `server.js` - Servidor Express
Este arquivo configura o servidor **Node.js** usando o **Express**, permitindo que o PWA seja acessado pelo navegador.

**Código do servidor:**
```js
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000; // Define a porta do servidor

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal servindo o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
```

### 4️⃣ `sw.js` - Service Worker
O **Service Worker** é responsável por tornar o PWA funcional offline, armazenando arquivos no cache e gerenciando notificações push.

**Principais funcionalidades:**
- **Instalação e cache dos arquivos principais**
- **Interceptação de requisições para servir conteúdo offline**
- **Atualização do cache**
- **Notificações Push**

```js
const CACHE_NAME = "task-manager-cache-v2";
const urlsToCache = [
  "/", "/index.html", "/style.css", "/main.js", "/manifest.json", "/icones/iconApp.png"
];

// Instalação do Service Worker (cache dos arquivos)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Interceptação de requisições para resposta via cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Atualização do cache ao ativar um novo Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache))
      );
    })
  );
});

// Notificações push
self.addEventListener("push", (event) => {
  const options = {
    body: "Task Added",
    icon: "/icones/iconApp.png",
    badge: "/icones/iconApp.png"
  };

  event.waitUntil(
    self.registration.showNotification("Notificação do Task Manager", options)
  );
});
```

## 📌 Conclusão
- O **`manifest.json`** permite a instalação do PWA.
- O **`package.json`** gerencia dependências do Node.js.
- O **`server.js`** serve os arquivos do app com Express.
- O **`sw.js`** habilita o funcionamento offline e as notificações.

Com esses arquivos configurados corretamente, o PWA pode ser instalado e utilizado de forma eficiente! 🚀

