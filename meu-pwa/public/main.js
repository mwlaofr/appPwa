const taskInput = document.getElementById('task-input');
const addTaskButton = document.querySelector('.task-form button');
const taskList = document.querySelector('.task-list');

// Adicionar tarefa
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span>${taskText}</span>
            <div class="task-actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        // Checkbox
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            const taskTextElement = taskItem.querySelector('span');
            if (checkbox.checked) {
                taskTextElement.style.textDecoration = 'line-through';
            } else {
                taskTextElement.style.textDecoration = 'none';
            }
        });

        // Botão de deletar
        const deleteButton = taskItem.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
        });

        taskList.appendChild(taskItem);
    
        taskInput.value = '';
    }
}

addTaskButton.addEventListener('click', addTask);
