let projects = {
    "General Todos": []
};

let currentProject = "General Todos";

document.getElementById('addProjectButton').addEventListener('click', function() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        projects[projectName] = [];
        updateProjectList();
    }
});

function updateProjectList() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    for (const project in projects) {
        const projectItem = document.createElement('li');
        projectItem.textContent = project;
        projectItem.className = 'project-item';
        projectItem.dataset.project = project;
        projectItem.addEventListener('click', function() {
            currentProject = project;
            document.getElementById('currentProjectHeader').querySelector('h1').textContent = currentProject;
            displayTodos();
            updateActiveProject(projectItem);
        });
        projectList.appendChild(projectItem);
    }
}

function updateActiveProject(activeItem) {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

function displayTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    projects[currentProject].forEach(todo => {
        const todoCard = document.createElement('div');
        todoCard.className = `todo-card priority-${todo.priority}`;
        todoCard.innerHTML = `
            <h3>${todo.title}</h3>
            <p>Due: ${todo.dueDate}</p>
            <p>${todo.description}</p>
            <button class="edit-todo" data-title="${todo.title}">Edit</button>
            <button class="delete-todo" data-title="${todo.title}">Delete</button>
        `;
        todoCard.querySelector('.edit-todo').addEventListener('click', () => openModal(todo));
        todoCard.querySelector('.delete-todo').addEventListener('click', () => deleteTodo(todo.title));
        todoList.appendChild(todoCard);
    });
}

document.getElementById('addTodoButton').addEventListener('click', openModal);

function openModal(todo = {}) {
    document.getElementById('todoModal').style.display = 'block';
    document.getElementById('todoTitle').value = todo.title || '';
    document.getElementById('todoDescription').value = todo.description || '';
    document.getElementById('todoDueDate').value = todo.dueDate || '';
    document.getElementById('todoPriority').value = todo.priority || 'low';
    document.getElementById('todoNotes').value = todo.notes || '';
}

document.getElementById('todoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newTodo = {
        title: document.getElementById('todoTitle').value,
        description: document.getElementById('todoDescription').value,
        dueDate: document.getElementById('todoDueDate').value,
        priority: document.getElementById('todoPriority').value,
        notes: document.getElementById('todoNotes').value
    };
    if (newTodo.title) {
        if (projects[currentProject].some(todo => todo.title === newTodo.title)) {
            // Update existing todo
            const index = projects[currentProject].findIndex(todo => todo.title === newTodo.title);
            projects[currentProject][index] = newTodo;
        } else {
            // Add new todo
            projects[currentProject].push(newTodo);
        }
        closeModal();
        displayTodos();
    }
});

function closeModal() {
    document.getElementById('todoModal').style.display = 'none';
    document.getElementById('todoForm').reset();
}

function deleteTodo(title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        projects[currentProject] = projects[currentProject].filter(todo => todo.title !== title);
        displayTodos();
    }
}

document.querySelector('.close-button').addEventListener('click', closeModal);
window.onclick = function(event) {
    if (event.target === document.getElementById('todoModal')) {
        closeModal();
    }
};

// Initialize the display
display