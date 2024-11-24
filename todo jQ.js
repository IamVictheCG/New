// Models
class TodoCard {
    constructor(title, dueDate, description, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.description = description;
        this.priority = priority;
        this.project = project;
    }
}

class TodoProject {
    constructor(title, items = []) {
        this.title = title;
        this.items = items;
    }
}

// State Management
const state = {
    projects: JSON.parse(localStorage.getItem('Projects')) || [],
    currentProject: 'General',
    init() {
        if (!this.projects.some(proj => proj.title === 'AllTodo')) {
            this.projects.unshift(new TodoProject('AllTodo', []));
            this.saveProjects();
        }
    },
    saveProjects() {
        localStorage.setItem('Projects', JSON.stringify(this.projects));
    }
};

// DOM Elements
const dom = {
    addProjectBtn: document.getElementById('addProjectButton'),
    projectName: document.getElementById('projectTitle'),
    projectForm: document.getElementById('projectForm'),
    projectList: document.getElementById('projectList'),
    projectModal: document.getElementById('projectModal'),
    todoList: document.getElementById('todoList'),
    addTodoBtn: document.getElementById('addTodoButton'),
    todoModal: document.getElementById('todoModal'),
    todoForm: document.getElementById('todoForm'),
    todoTitle: document.getElementById('todoTitle'),
    todoDescription: document.getElementById('todoDescription'),
    todoPriority: document.getElementById('todoPriority'),
    todoDueDate: document.getElementById('todoDueDate'),
    currentProjectHeader: document.getElementById('currentProjectHeader'),
    closeTodoModalBtn: document.querySelector('#todoModal .close-button'),
    closeProjectModalBtn: document.getElementById('closeProjectModal'),
    menuItems: document.querySelectorAll('.menu-item'),
    activeTodo: document.getElementById('active-todo'),
    blackBox: document.getElementById('blackBox')
};

// Event Handlers
function setupEventListeners() {
    // Menu Navigation
    dom.menuItems.forEach(item => {
        item.addEventListener('click', () => {
            dom.menuItems.forEach(m => m.classList.remove('activeMenu'));
            item.classList.add('activeMenu');
            
            const menuName = item.dataset.menu;
            if (menuName === 'home') {
                state.currentProject = 'General';
                dom.currentProjectHeader.textContent = 'All Todos';
                document.querySelector('.main-content').classList.remove('hidden');
                document.querySelector('.projects').classList.add('hidden');
                displayTodos();
            } else {
                document.querySelector('.projects').classList.remove('hidden');
                document.querySelector('.main-content').classList.add('hidden');
                displayProjects();
            }
        });
    });

    // Todo Modal
    dom.addTodoBtn.addEventListener('click', () => {
        dom.todoModal.classList.remove('hidden');
    });

    dom.closeTodoModalBtn.addEventListener('click', () => {
        dom.todoModal.classList.add('hidden');
    });

    dom.todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTodo();
    });

    // Project Modal
    dom.addProjectBtn.addEventListener('click', () => {
        dom.projectModal.classList.remove('hidden');
    });

    dom.closeProjectModalBtn.addEventListener('click', () => {
        dom.projectModal.classList.add('hidden');
    });

    dom.projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProject();
    });
}

// Todo Functions
function saveTodo() {
    const todo = new TodoCard(
        dom.todoTitle.value,
        dom.todoDueDate.value,
        dom.todoDescription.value,
        dom.todoPriority.value,
        state.currentProject
    );

    // Add to AllTodo
    state.projects[0].items.push(todo);

    // Add to current project if not General
    if (state.currentProject !== 'General') {
        const projectIndex = state.projects.findIndex(p => p.title === state.currentProject);
        if (projectIndex !== -1) {
            state.projects[projectIndex].items.push(todo);
        }
    }

    state.saveProjects();
    dom.todoModal.classList.add('hidden');
    dom.todoForm.reset();
    displayTodos();
}

function displayTodos() {
    const todoList = dom.todoList;
    todoList.innerHTML = '';

    let currentTodos = [];
    if (state.currentProject === 'General') {
        currentTodos = state.projects[0]?.items || [];
    } else {
        const selectedProject = state.projects.find(p => p.title === state.currentProject);
        currentTodos = selectedProject?.items || [];
    }

    if (currentTodos.length === 0) {
        todoList.innerHTML = '<h2>No todos yet!</h2>';
        return;
    }

    currentTodos.forEach((todo, index) => {
        const todoElement = createTodoElement(todo, index);
        todoList.appendChild(todoElement);
    });
}

function createTodoElement(todo, index) {
    const div = document.createElement('div');
    div.className = `todo-card priority-${todo.priority}`;
    div.innerHTML = `
        <div class="todoContent">
            <h3>${todo.title}</h3>
            <p>${todo.dueDate}</p>
            <p>${todo.description.substring(0, 100)}${todo.description.length > 100 ? '...' : ''}</p>
            <b>${todo.project}</b>
        </div>
        <button class="delete-btn">Delete</button>
    `;

    div.querySelector('.todoContent').addEventListener('click', () => {
        showActiveTodoCard(todo);
    });

    div.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(index);
    });

    return div;
}

function deleteTodo(index) {
    if (state.currentProject === 'General') {
        state.projects[0].items.splice(index, 1);``````

      
    } else {
        const projectIndex = state.projects.findIndex(p => p.title === state.currentProject);
        if (projectIndex !== -1) {
            const todo = state.projects[projectIndex].items[index];
            // Remove from current project
            state.projects[projectIndex].items.splice(index, 1);
            // Remove from AllTodo
            const allTodoIndex = state.projects[0].items.findIndex(t => 
                t.title === todo.title && t.description === todo.description);
            if (allTodoIndex !== -1) {
                state.projects[0].items.splice(allTodoIndex, 1);
            }
        }
    }
    
    state.saveProjects();
    displayTodos();
}

function showActiveTodoCard(todo) {
    dom.activeTodo.innerHTML = `
        <span class="close-button">&times;</span>
        <h3>${todo.title}</h3>
        <p><strong>Due Date:</strong> ${todo.dueDate}</p>
        <p><strong>Description:</strong> ${todo.description}</p>
        <p><strong>Project:</strong> ${todo.project}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
    `;
    
    dom.activeTodo.classList.remove('hidden');
    dom.blackBox.classList.remove('hidden');
    
    dom.activeTodo.querySelector('.close-button').addEventListener('click', () => {
        dom.activeTodo.classList.add('hidden');
        dom.blackBox.classList.add('hidden');
    });
}

// Project Functions
function saveProject() {
    const title = dom.projectName.value;
    
    if (title.length === 0 || title.length > 15) {
        alert('Project name must be between 1 and 15 characters');
        return;
    }

    if (state.projects.some(p => p.title === title)) {
        alert('Project already exists');
        return;
    }

    state.projects.push(new TodoProject(title));
    state.saveProjects();
    
    dom.projectModal.classList.add('hidden');
    dom.projectForm.reset();
    displayProjects();
}

function displayProjects() {
    const projectList = dom.projectList;
    projectList.innerHTML = '';

    state.projects.slice(1).forEach((project, index) => {
        const projectElement = createProjectElement(project, index + 1);
        projectList.appendChild(projectElement);
    });
}

function createProjectElement(project, index) {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `
        <div class="projectBody">
            <h3>${project.title}</h3>
            <p>${project.items.length} tasks</p>
        </div>
        <button class="delete-btn">Delete</button>
    `;

    div.querySelector('.projectBody').addEventListener('click', () => {
        showActiveProject(project);
    });

    div.querySelector('.delete-btn').addEventListener('click', () => {
        deleteProject(index);
    });

    return div;
}

function showActiveProject(project) {
    state.currentProject = project.title;
    dom.currentProjectHeader.textContent = project.title;
    document.querySelector('.projects').classList.add('hidden');
    document.querySelector('.main-content').classList.remove('hidden');
    displayTodos();
}

function deleteProject(index) {
    if (!confirm(`Delete project "${state.projects[index].title}"?`)) return;

    const projectTitle = state.projects[index].title;
    
    // Remove todos from AllTodo
    state.projects[0].items = state.projects[0].items.filter(todo => 
        todo.project !== projectTitle);
    
    // Remove project
    state.projects.splice(index, 1);
    state.saveProjects();
    displayProjects();
}

// Initialize
state.init();
setupEventListeners();
displayTodos();