const projects = JSON.parse(localStorage.getItem("Projects")) || [];
const AllTodo = {
    title: "AllTodo",
    items: []
};
console.log(projects);

// let allTodo_Title;
// let allTodo_items;

// Ensure "AllTodo" project exists
if (!projects.some((proj) => proj.title === "AllTodo")) {
    projects.unshift(AllTodo);
    localStorage.setItem("Projects", JSON.stringify(projects));
}
const getLocalProjects = localStorage.getItem('Projects')
console.log(getLocalProjects);
console.log(projects[0].items);

const cachedDom = () => {
    return {
        addProjectBtn: $("#addProjectButton"),
        projectName: $("#projectTitle"),
        saveProject: $("#ProjectModal button"),
        projectList: $("#projectList"),
        addProjectModal: $("#ProjectModal"),
        todoList: $("#todoList"),
        addTodoBtn: $("#addTodoButton img"),
        addTodoModal: $(".modal"),
        saveTodo: $("#todoForm button"),
        todoTitle: $("#todoTitle"),
        todoDescription: $("#todoDescription"),
        todoPriority: $("#todoPriority"),
        todoDueDate: $("#todoDueDate"),
        currentProjectHeader: $("#currentProjectHeader"),
        closeTodoModalBtn: $(".close-button"),
        closeProjectModalBtn: $("#closeProjectModal"),
        menu: $(".menu-item"),
        activeTodo: $("#active-todo"),
        blackBox: $("#blackBox"),
    };
};

const dom = cachedDom();
const closeActiveTodo = dom.closeTodoModalBtn;
let parentProject = "General";
// const menu = new Array(dom.menu)
const menu = dom.menu
console.log(menu);
const addTodoBtn = dom.addTodoBtn;


menu.each(function() {
    console.log($(menu[0]));
    const currentProjectHeader = dom.currentProjectHeader
    
    $(this).click(() => {
        menu.removeClass('activeMenu')

        $(this).addClass('activeMenu')

        const menuName = $(this).attr('data-menu')
        console.log(`${menuName} menu item clicked`);
        if (menuName === 'home') {
            // const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
            displayTodos();
            parentProject = 'General'
            // $(addTodoBtn).attr('data-projectName', parentProject)
            $(currentProjectHeader).html('All Todos')
            $('.main-content').removeClass('hidden')
            $('.projects').addClass('hidden')
            console.log(parentProject);
        } else {
            displayProject()
            $('.projects').removeClass('hidden')
            $('.main-content').addClass('hidden')
        }
    })
});

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
    constructor(title, items) {
        this.title = title;
        this.items = items;
    }
}

addTodoBtn.click(() => {
    let addTodoModal = dom.addTodoModal;
    addTodo(parentProject);
    $(addTodoModal).removeClass("hidden");
    console.log(addTodoBtn);
});
const addTodo = (parentProject) => {
    let addTodoModal = dom.addTodoModal;
    let closeTodoModalBtn = dom.closeTodoModalBtn;
    let saveTodo = dom.saveTodo;
    console.log($(addTodoBtn).attr('data-projectName'))
    closeTodoModalBtn.click(() => $(addTodoModal).addClass("hidden"));
    console.log(parentProject);
    console.log(projects[0].items);
    const nonDefaultProject = projects.slice(1); 
    // console.log(nonDefaultProject);
    
    saveTodo.click((e) => {
        e.preventDefault();
        const title = dom.todoTitle.val();
        const description = dom.todoDescription.val();
        const dueDate = dom.todoDueDate.val() || "";
        const priority = dom.todoPriority.val() || "low";
        let allTodo_items = projects[0].items
        console.log(allTodo_items);
        
        
        // const otherProjects = projects.slice(1);
        // console.log(otherProjects);

        if (!title && !description) {
            alert("Task is Void")
            return;
        }

        if(projects[0].items.length < 1) {
            localStorage.setItem("AllTodo", JSON.stringify(projects[0].items));
        }
            
            
            const todo = new TodoCard(title, dueDate, description, priority, parentProject);
        
        if (parentProject === 'General') {
            console.log(allTodo_items);
            allTodo_items.push(todo);
            // console.log(allTodo_Title);
            console.log(allTodo_items);
            console.log(projects[0]);
        }
        
        nonDefaultProject.forEach((proj) => {
            if(proj.title === parentProject) {
                proj.items.push(todo);
                allTodo_items.push(todo);
                console.log(proj.title);
            }
        })
        
        localStorage.setItem("Projects", JSON.stringify(projects));
        



        // Clear input fields after saving the todo
        dom.todoTitle.val("");
        dom.todoDescription.val("");
        dom.todoDueDate.val("");
        dom.todoPriority.val("low");

        $(addTodoModal).addClass("hidden");
        displayTodos();
    });
};

const addProject = () => {
    let addProjectModal = dom.addProjectModal;
    let addProjectBtn = dom.addProjectBtn;
    let closeProjectModalBtn = dom.closeProjectModalBtn;
    let projectName = dom.projectName;
    let saveProject = dom.saveProject;
    console.log(addProjectModal);
    console.log(projectName);
    console.log(closeProjectModalBtn);

    addProjectBtn.click(() => {
        $(addProjectModal).removeClass("hidden");
        // console.log(addProjectBtn);
    });

    closeProjectModalBtn.click(() => $(addProjectModal).addClass("hidden"));

    saveProject.click((e) => {
        e.preventDefault();
        const title = projectName.val();
        console.log(title);
        const projectItems = [];
        
        projects.forEach((elem) => {
            console.log("object");
            if (elem.title === title) {
                alert("Project already exists");
                return;
            }
        })

        if (title.length === 0 || title.length > 15) {
            alert("Invalid project name. Name should not exceed 15 characters");
        } else {
            const newProject = new TodoProject(title, projectItems);
            projects.push(newProject);
            localStorage.setItem("Projects", JSON.stringify(projects));
            console.log(projects);
        }

        projectName.val("");
        $(addProjectModal).addClass("hidden");
        displayProject();
    });
};
addProject();

// const display = () => {
    // console.table(`LocalStorage: ${JSON.stringify(updateTodo)}`);
    // displayTodos();
    // displayProject();
// };

const displayTodos = () => {
    const todoList = dom.todoList;
    todoList.html(""); // Clear existing list

    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
    let currentTodos = [];
    if (parentProject === "General") {
        currentTodos = updateProject[0]?.items || [];
    } else {
        var selectedProject = updateProject.find((proj) => proj.title === parentProject);
        currentTodos = selectedProject?.items || [];
    }

    if (currentTodos.length > 0) {
        currentTodos.forEach((todo, index) => {
            const truncatedDescription =
                todo.description.length > 100
                    ? todo.description.substring(0, 97) + "..."
                    : todo.description;

            const todoCard = $(`  
                <div class="todo-card" data-index="${index}">
                    <div class="todoContent priority-${todo.priority}">
                        <h3 class="title">${todo.title}</h3>
                        <p class="dueDate">${todo.dueDate}</p>
                        <p class="description">${truncatedDescription}</p>
                        <b class="parentProject">${todo.project}</b>
                    </div>
                    <div class="delete">Delete</div>
                </div>
            `);

            // Attach click listeners
            todoCard.find(".todoContent").click(() => {
                showActiveTodoCard(index, updateProject.indexOf(selectedProject || updateProject[0]));
            });

            todoCard.find(".delete").click(() => {
                console.log(selectedProject);
                handleDeleteTodo(index, updateProject.indexOf(selectedProject || updateProject[0]));
            });

            todoList.append(todoCard);
        });
    } else {
        todoList.html(`<h1>You've got nothing to do, have fun!</h1>`);
    }
};


const slideEffect =((slider) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.mousedown((e) => {
        isDown =true
        startX = e.pageX - slider.offset().right;
        scrollLeft = slider.scrollRight
        slider.addClass('active')
        console.log('Mouse is Down');
        console.log(e);
        // console.log(e);
        console.log(startX);
        console.log(scrollLeft);
    })
    slider.mouseup(() => {
        isDown = false
        slider.removeClass('active')
        console.log('Mouse is not Down');
        
    })
    slider.mouseleave(() => {
        isDown = false;
        slider.removeClass('active')
    })
    slider.mousemove((e) => {
        e.preventDefault()
        const x = e.pageX - slider.offset().right;
        if (!isDown) return;
        console.log(startX);
        console.count('Mouse is Down');
        let walk = (x - startX) * 600;
        console.log(walk);
        slider.scrollRight = scrollLeft - walk
    })
})

const displayProject = () => {
    const projectList = dom.projectList;
    projectList.html(""); // Clear existing list
    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
    console.log(updateProject);
    console.log(updateProject[0].items);
    if (updateProject.length > 0) {
        updateProject.forEach((project, index) => {
            const projectCard = $(`
                <div class="project-item" data-index="${index}" data-project="${project.title}">
                    <div class="projectBody">
                        <h3 class="title">${project.title}</h3>
                        <p class="projectTasks">${project.items.length} tasks</p>
                    </div>
                    <div class="delete"><p>Delete</p></div>
                </div>
                `);
            projectList.append(projectCard);
            projectCard.find(".projectBody").click(() => {
                showActiveProjectCard(index);
            });
            projectCard.find(".delete").click(() => {
                console.log(`Deleting project: ${project.title}`);
                const AllTodoArr = updateProject[0].items;
                
                
                // Filter out the items that don't match the project title
                updateProject[0].items = AllTodoArr.filter(item => item.project !== project.title);
                
                // Optional: Call a function to handle further deletion logic
                console.log(updateProject[0].items);
                console.log("Updated items:", updateProject[0].items);
                localStorage.setItem("Projects", JSON.stringify(projects));
                handleDeleteProject(index);
                // displayProject()
            });
            
        });
    } else {
        const emptyMsg = `<h1>No projects yet, start creating!</h1>`;
        projectList.html(emptyMsg);
    }
};


const showActiveProjectCard = (index) => {
    // const projectList = dom.projectList;
    const todoList = dom.todoList;
    // const addTodoBtn = dom.addTodoBtn;
    const currentProjectHeader = dom.currentProjectHeader
    // let blackBox = dom.blackBox;
    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
    const currentProject = updateProject[index];
    parentProject = currentProject.title
    console.log(parentProject);
    
    if (!currentProject) {
        console.error("Invalid project index");
        return;
    }
    const currentProject_Items = updateProject[index].items || [];
    // console.log(currentProject_Items);
    parentProject = currentProject.title
    
    currentProjectHeader.html(currentProject.title)
    $(todoList).html('')

    

    // console.log(currentProjectHeader.html());
    $('.projects').addClass('hidden');
    $('.main-content').removeClass('hidden');
    console.log(currentProject);
    console.log(currentProject_Items);


    if (!currentProject_Items.length) {
        $(todoList).html(`<h2>There are no tasks in in this Project.</h2>`)
    }

    currentProject_Items.forEach((todo) => {
        console.log(todo);
        const truncatedDescription =
            todo.description.length > 100
                ? todo.description.substring(0, 97) + "..."
                : todo.description;

        const todoCard = $(`
            <div class="todo-card" data-index="${index}">
                <div class="todoContent priority-${todo.priority}">
                    <h3 class="title">${todo.title}</h3>
                    <p class="dueDate">${todo.dueDate}</p>
                    <p class="description">${truncatedDescription}</p>
                    <b class="parentProject">${todo.project}</b>
                </div>
                <div class="delete">Delete</div>
            </div>
        `);

        todoList.append(todoCard);
    })


    // const activeProjectCard = `
    //     <header>
    //             <h1>${project.title}</h1>
    //         </header>
    // `;

    // $(blackBox).css("display", "block");
    // $(activeTodo).css("display", "grid");
    // $(activeTodo).removeClass('hidden');
    // $(closeActiveTodo).css('display','grid');
    $(menu[0]).addClass('activeMenu')
    $(menu[1]).removeClass('activeMenu')
};

const showActiveTodoCard = (todoIndex, projectIndex) => {
    const activeTodo = dom.activeTodo;
    const addTodoBtn = dom.addTodoBtn;
    let blackBox = dom.blackBox;
    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
    const selectedProject = updateProject[projectIndex];
    const todo = selectedProject?.items[todoIndex]
    console.log(todo);
    if (!selectedProject || !todo) {
        console.error("Todo not found");
        return;
    }
    
    console.log(todo);
    const activeCard = `
            <h3 class="title">${todo.title}</h3>
            <p class="dueDate">${todo.dueDate}</p>
            <p class="description">${todo.description}</p>
            <b class="parentProject">${todo.project}</b>
            <p class="MainPriority"><strong>Priority:</strong> ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</p>
    `;
    console.log(activeCard);
    activeTodo.html(activeCard); // Replace content

    $(blackBox).css("display", "block");
    $(activeTodo).css("display", "grid");
    addTodoBtn.css("display", "none");
    $(closeActiveTodo).removeClass("hidden");
};

closeActiveTodo.click(() => {
    const activeTodo = dom.activeTodo;
    const addTodoBtn = dom.addTodoBtn;

    addTodoBtn.css("display", "block");
    closeActiveTodo.addClass("hidden");
    // $(closeActiveTodo).css('display','none');
    $(activeTodo).css("display", "none");
    $(blackBox).css("display", "none");
});


const handleDeleteTodo = (todoIndex, projectIndex) => {
    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];
    const selectedProject = updateProject[projectIndex];

    if (!selectedProject || !selectedProject.items[todoIndex]) {
        console.error("Todo not found");
        return;
    }

    // Remove the todo from the selected project
    const deletedTodo = selectedProject.items.splice(todoIndex, 1)[0];

    // If the todo exists in "AllTodo", remove it from there as well
    const allTodoItems = updateProject[0]?.items || [];
    const todoIndexInAllTodo = allTodoItems.findIndex(
        (item) => item.title === deletedTodo.title && item.description === deletedTodo.description
    );
    if (todoIndexInAllTodo > -1) {
        allTodoItems.splice(todoIndexInAllTodo, 1);
    }

    // Save the updated projects back to localStorage
    localStorage.setItem("Projects", JSON.stringify(updateProject));

    // Refresh the display
    displayTodos();
    displayProject();
};


const handleDeleteProject = (projectIndex) => {
    const updateProject = JSON.parse(localStorage.getItem("Projects")) || [];

    // Prevent deletion of the default "General" or "AllTodo" projects
    if (projectIndex === 0) {
        alert("Cannot delete the default 'General' or 'AllTodo' project.");
        return;
    }

    const selectedProject = updateProject[projectIndex];
    if (!selectedProject) {
        console.error("Project not found");
        return;
    }

    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete the project: ${selectedProject.title}?`)) {
        return;
    }

    // Remove the project from the list
    updateProject.splice(projectIndex, 1);
    projects.splice(projectIndex, 1);
    console.log(updateProject);
    console.log(projects);
    // Save the updated projects back to localStorage
    localStorage.setItem("Projects", JSON.stringify(projects));

    // Refresh the display
    displayProject();
};



// console.log(TodoCard.length);
// console.log(TodoCard);

// Initialize
$(menu[0]).addClass('activeMenu')
displayTodos();
$('.main-content').removeClass('hidden')
