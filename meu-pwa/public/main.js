window.addEventListener("load", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch((error) => {
        console.log("Falha ao registrar o Service Worker:", error);
      });
  }

  let deferredPrompt;
  const createInstallButton = () => {
    if (document.getElementById("install-pwa-btn")) return;

    const installBtn = document.createElement("button");
    installBtn.id = "install-pwa-btn";
    installBtn.textContent = "Install App";
    installBtn.style = `
      position: fixed; bottom: 20px; right: 20px;
      padding: 10px 20px; background: linear-gradient(to right, var(--pink), var(--purple));
      color: #fff; border: none; border-radius: 5px; cursor: pointer;
    `;
    document.body.appendChild(installBtn);

    installBtn.addEventListener("click", () => {
      installBtn.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome !== "accepted")
          installBtn.style.display = "block";
        deferredPrompt = null;
      });
    });
  };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    createInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    console.log("PWA instalado com sucesso.");
    const installBtn = document.getElementById("install-pwa-btn");
    if (installBtn) installBtn.remove();
  });

  if (Notification.permission !== "granted") Notification.requestPermission();

  const showNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const createTaskElement = (task) => {
    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    const task_input_el = document.createElement("div");
    task_input_el.classList.add("text");
    task_input_el.innerText = task;

    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");

    const task_checkbox_el = document.createElement("input");
    task_checkbox_el.type = "checkbox";
    task_checkbox_el.classList.add("done-checkbox");
    task_checkbox_el.id = `done-checkbox-${Date.now()}`;

    const task_checkbox_label = document.createElement("label");
    task_checkbox_label.setAttribute("for", task_checkbox_el.id);
    task_checkbox_label.innerText = "Done";
    task_checkbox_label.classList.add("done-label");

    checkboxContainer.appendChild(task_checkbox_el);
    checkboxContainer.appendChild(task_checkbox_label);
    task_actions_el.appendChild(checkboxContainer);

    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerText = "Edit";

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerText = "Delete";

    task_actions_el.append(task_edit_el, task_delete_el);

    task_content_el.appendChild(task_input_el);
    task_el.append(task_content_el, task_actions_el);
    list_el.insertBefore(task_el, list_el.firstChild);

    task_checkbox_el.addEventListener("change", () => {
      task_input_el.classList.toggle("done", task_checkbox_el.checked);
    });

    task_edit_el.addEventListener("click", () =>
      editTask(
        task_el,
        task_input_el,
        task_checkbox_el,
        task_checkbox_label,
        task_edit_el,
        task_delete_el
      )
    );

    task_delete_el.addEventListener("click", () => {
      list_el.removeChild(task_el);
      showNotification("Task Deleted", `"${task}" was removed.`);
    });

    return task_el;
  };

  const editTask = (
    task_el,
    task_input_el,
    task_checkbox_el,
    task_checkbox_label,
    task_edit_el,
    task_delete_el
  ) => {
    const originalText = task_input_el.innerText.trim();

    task_checkbox_el.style.display = "none";
    task_checkbox_label.style.display = "none";

    const task_textarea_el = document.createElement("textarea");
    task_textarea_el.value = originalText;
    task_textarea_el.classList.add("task-textarea");
    task_textarea_el.style.width = "100%";
    task_textarea_el.style.minHeight = "100px";
    task_textarea_el.addEventListener("input", () => {
      task_textarea_el.style.height = "auto";
      task_textarea_el.style.height = `${task_textarea_el.scrollHeight}px`;
    });

    const save_button = document.createElement("button");
    save_button.innerText = "Save";
    save_button.classList.add("save");

    const cancel_button = document.createElement("button");
    cancel_button.innerText = "Cancel";
    cancel_button.classList.add("cancel");

    const task_content_el = task_input_el.parentElement;
    task_content_el.replaceChild(task_textarea_el, task_input_el);
    task_textarea_el.focus();

    const task_actions_el = task_edit_el.parentElement;
    task_actions_el.replaceChild(save_button, task_edit_el);
    task_actions_el.insertBefore(cancel_button, task_delete_el);

    save_button.addEventListener("click", () => {
      const updatedTask = task_textarea_el.value.trim();
      if (updatedTask === "") {
        showNotification("Error", "Task cannot be empty!");
        return;
      }

      task_input_el.innerText = updatedTask;
      task_content_el.replaceChild(task_input_el, task_textarea_el);
      task_checkbox_el.style.display = "inline-block";
      task_checkbox_label.style.display = "inline-block";
      task_actions_el.replaceChild(task_edit_el, save_button);
      task_actions_el.removeChild(cancel_button);
      showNotification(
        "Task Updated",
        `"${updatedTask}" was successfully updated.`
      );
    });

    cancel_button.addEventListener("click", () => {
      task_content_el.replaceChild(task_input_el, task_textarea_el);
      task_checkbox_el.style.display = "inline-block";
      task_checkbox_label.style.display = "inline-block";
      task_actions_el.replaceChild(task_edit_el, save_button);
      task_actions_el.removeChild(cancel_button);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = input.value.trim();
    if (task === "") {
      showNotification("Error", "Task cannot be empty!");
      return;
    }

    createTaskElement(task);
    showNotification("Task Added", `"${task}" was successfully added.`);
    input.value = "";
  });

  if (
    "serviceWorker" in navigator &&
    "sync" in ServiceWorkerRegistration.prototype
  ) {
    navigator.serviceWorker.ready.then((swRegistration) => {
      return swRegistration.sync.register("sync-tasks").catch((err) => {
        console.log("Falha ao registrar o sync:", err);
      });
    });
  }
});
