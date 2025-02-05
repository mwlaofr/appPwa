const taskInput = document.getElementById("task-input");
const addTaskButton = document.querySelector(".task-form button");
const taskList = document.querySelector(".task-list");

// Adicionar tarefa
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox">
        <span>${taskText}</span>
      </div>
      <div class="task-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Checkbox
    const checkbox = taskItem.querySelector(".task-checkbox");
    const taskTextElement = taskItem.querySelector("span");

    // Adicionar evento para marcar/desmarcar a tarefa
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        taskTextElement.style.textDecoration = "line-through";
        taskTextElement.style.color = "#999";
      } else {
        taskTextElement.style.textDecoration = "none";
        taskTextElement.style.color = "";
      }
    });

    // Botão de deletar
    const deleteButton = taskItem.querySelector(".delete");
    deleteButton.addEventListener("click", () => {
      taskItem.remove();
    });

    // Adicionar a nova tarefa à lista
    taskList.appendChild(taskItem);

    // Limpar o campo de entrada
    taskInput.value = "";

    // Exibir a notificação após adicionar a tarefa
    showNotification("Tarefa adicionada!", {
      body: taskText,
      icon: "icons/icon-192x192.png", // Você pode adicionar um ícone
    });
  }
}

// Adicionar evento ao botão
addTaskButton.addEventListener("click", addTask);

// Função para mostrar a notificação
function showNotification(title, options) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    console.log("Permissão de notificações não concedida");
  }
}

// Permissão de notificação
if (Notification.permission !== "denied" && Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Permissão para notificações concedida.");
    }
  });
}

// Registrar o service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registrado com sucesso!"))
      .catch((error) => console.error("Erro ao registrar o Service Worker:", error));
  });
}
