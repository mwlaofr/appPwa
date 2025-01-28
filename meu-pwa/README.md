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
    git clone https://github.com/seu-usuario/task-manager-pwa.git
    ```

2. Navegue até o diretório da aplicação:
    ```bash
        cd task-manager-pwa
    ```

3. Abra o arquivo index.html em um navegador moderno para rodar a aplicação diretamente no navegador. 

## Como Funciona
- **Adicionar uma Tarefa:** Insira um nome de tarefa no campo de texto e clique no botão "Add Task". A tarefa será adicionada à lista de tarefas.
- **Marcar Tarefa como Concluída:** Clique na checkbox ao lado da tarefa para marcá-la como concluída. Isso riscará o texto da tarefa.
- **Excluir uma Tarefa:** Clique no botão "Delete" ao lado de qualquer tarefa para removê-la da lista.

## Arquivos Importantes
- **index.html:** O arquivo HTML principal que contém a estrutura da página.
- **style.css:** O arquivo de estilo que define o layout e a aparência da aplicação.
- **script.js:** O arquivo JavaScript que gerencia as funcionalidades da aplicação (adicionar, excluir e marcar tarefas).
- **sw.js:** O arquivo do Service Worker que garante o funcionamento offline da aplicação, armazenando arquivos em cache.
- **manifest.json:** O arquivo que define as configurações do PWA (como ícones e nome da aplicação).