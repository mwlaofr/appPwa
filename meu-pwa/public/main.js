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

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Criar botão para instalar o PWA
    const installBtn = document.createElement("button");
    installBtn.id = "install-pwa-btn";
    installBtn.textContent = "Install App";
    installBtn.style.position = "fixed";
    installBtn.style.bottom = "20px";
    installBtn.style.right = "20px";
    installBtn.style.padding = "10px 20px";
    installBtn.style.background =
      "linear-gradient(to right, var(--pink), var(--purple))";
    installBtn.style.color = "#fff";
    installBtn.style.border = "none";
    installBtn.style.borderRadius = "5px";
    installBtn.style.cursor = "pointer";
    document.body.appendChild(installBtn);

    installBtn.addEventListener("click", () => {
      installBtn.style.display = "none"; // Esconde o botão após o clique
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuário aceitou instalar o PWA.");
        } else {
          console.log("Usuário recusou instalar o PWA.");
          installBtn.style.display = "block"; // Mostra o botão novamente caso a instalação falhe
        }
        deferredPrompt = null;
      });
    });
  });

  // Verificar se o PWA já está instalado
  window.addEventListener("appinstalled", () => {
    console.log("PWA instalado com sucesso.");
    const installBtn = document.getElementById("install-pwa-btn");
    if (installBtn) {
      installBtn.remove(); // Remove o botão após a instalação
    }
  });

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const showNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value.trim();

    if (task === "") {
      showNotification("Error", "Task cannot be empty!");
      return;
    }

    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");
    task_el.appendChild(task_content_el);

    let task_input_el = document.createElement("div");
    task_input_el.classList.add("text");
    task_input_el.innerText = task;
    task_input_el.setAttribute("readonly", "readonly");
    task_content_el.appendChild(task_input_el);

    const task_actions_wrapper = document.createElement("div");
    task_actions_wrapper.classList.add("actions-wrapper");

    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    // Create a container for the checkbox and label
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");

    // Add a checkbox for "Done"
    const task_checkbox_el = document.createElement("input");
    task_checkbox_el.type = "checkbox";
    task_checkbox_el.classList.add("done-checkbox");
    task_checkbox_el.id = `done-checkbox-${Date.now()}`; // Unique ID for each checkbox

    const task_checkbox_label = document.createElement("label");
    task_checkbox_label.setAttribute("for", task_checkbox_el.id);
    task_checkbox_label.innerText = "Done";
    task_checkbox_label.classList.add("done-label");

    // Append the checkbox and label to the container
    checkboxContainer.appendChild(task_checkbox_el);
    checkboxContainer.appendChild(task_checkbox_label);

    // Append the container to the actions element
    task_actions_el.appendChild(checkboxContainer);

    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerText = "Edit";

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerText = "Delete";

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_actions_wrapper.appendChild(task_actions_el);
    task_el.appendChild(task_actions_wrapper);

    list_el.insertBefore(task_el, list_el.firstChild);

    showNotification("Task Added", `"${task}" was successfully added.`);

    input.value = "";

    // Handle checkbox state change
    task_checkbox_el.addEventListener("change", () => {
      if (task_checkbox_el.checked) {
        task_input_el.classList.add("done");
      } else {
        task_input_el.classList.remove("done");
      }
    });

    task_edit_el.addEventListener("click", () => {
      const originalText = task_input_el.innerText.trim();

      // Hide the checkbox in edit mode
      task_checkbox_el.style.display = "none";
      task_checkbox_label.style.display = "none";

      const task_textarea_el = document.createElement("textarea");
      task_textarea_el.value = originalText;
      task_textarea_el.classList.add("task-textarea");
      task_textarea_el.style.width = "100%";
      task_textarea_el.style.minHeight = "100px";

      task_content_el.replaceChild(task_textarea_el, task_input_el);

      autoResizeTextarea(task_textarea_el);

      task_textarea_el.addEventListener("input", () => {
        autoResizeTextarea(task_textarea_el);
      });

      task_textarea_el.focus();

      const save_button = document.createElement("button");
      save_button.innerText = "Save";
      save_button.classList.add("save");

      const cancel_button = document.createElement("button");
      cancel_button.innerText = "Cancel";
      cancel_button.classList.add("cancel");

      task_actions_el.removeChild(task_edit_el);
      task_actions_el.insertBefore(save_button, task_delete_el);
      task_actions_el.insertBefore(cancel_button, task_delete_el);

      save_button.addEventListener("click", () => {
        const updatedTask = task_textarea_el.value.trim();

        if (updatedTask === "") {
          showNotification("Error", "Task cannot be empty!");
          return;
        }

        const new_task_input_el = document.createElement("div");
        new_task_input_el.classList.add("text");
        new_task_input_el.innerText = updatedTask;
        new_task_input_el.setAttribute("readonly", "readonly");

        task_content_el.replaceChild(new_task_input_el, task_textarea_el);

        task_input_el = new_task_input_el;

        // Restore the checkbox visibility after saving
        task_checkbox_el.style.display = "inline-block";
        task_checkbox_label.style.display = "inline-block";

        task_actions_el.insertBefore(task_edit_el, task_delete_el);
        task_actions_el.removeChild(save_button);
        task_actions_el.removeChild(cancel_button);

        showNotification(
          "Task Updated",
          `"${updatedTask}" was successfully updated.`
        );
      });

      cancel_button.addEventListener("click", () => {
        const new_task_input_el = document.createElement("div");
        new_task_input_el.classList.add("text");
        new_task_input_el.innerText = originalText;
        new_task_input_el.setAttribute("readonly", "readonly");

        task_content_el.replaceChild(new_task_input_el, task_textarea_el);

        task_input_el = new_task_input_el;

        // Restore the checkbox visibility after canceling
        task_checkbox_el.style.display = "inline-block";
        task_checkbox_label.style.display = "inline-block";

        task_actions_el.insertBefore(task_edit_el, task_delete_el);
        task_actions_el.removeChild(save_button);
        task_actions_el.removeChild(cancel_button);
      });
    });

    task_delete_el.addEventListener("click", () => {
      const currentTaskText = task_input_el.innerText.trim();
      list_el.removeChild(task_el);
      showNotification("Task Deleted", `"${currentTaskText}" was removed.`);
    });
  });
});

navigator.serviceWorker.ready.then((swRegistration) => {
  return swRegistration.sync.register("sync-tasks");
});
