const toggleButton = document.getElementById("theme-toggle-btn");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

function updateToggleButton() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  toggleButton.innerText =
    currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

toggleButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateToggleButton();
});

updateToggleButton();

const tasksArray = [];

let taskCounter = parseInt(localStorage.getItem("idHighest")) || 0;

const generateId = () => {
  taskCounter++;
  localStorage.setItem("idHighest", taskCounter);
  return `task-${taskCounter}`;
};

class Task {
  constructor(title, description = "", dueDate = null) {
    this.title = title;
    this.description = description;
    this.isCompleted = false;
    this.startDate = new Date().toISOString().split("T")[0];
    this.startTime = new Date().toTimeString().split("T")[0];
    this.dueDate = dueDate;
    this.id = generateId();
  }

  markAsCompleted() {
    this.isCompleted = true;
  }

  editTask(newTitle, newDescription) {
    this.title = newTitle;
    this.description = newDescription;
  }

  formatTask() {
    return `${this.title} (Completed: ${this.isCompleted})`;
  }
}

const addTask = (task) => {
  tasksArray.push(task);
  tasksArray.sort((firstTask, secondTask) => {
    if (firstTask.title.toLowerCase() < secondTask.title.toLowerCase())
      return -1;
    if (firstTask.title.toLowerCase() > secondTask.title.toLowerCase())
      return 1;
    return new Date(firstTask.dueDate) - new Date(secondTask.dueDate);
  });
  saveToLocalStorage();
};

const removeTask = (taskId) => {
  const taskIndex = tasksArray.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasksArray.splice(taskIndex, 1);
  }
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem("tasksArray", JSON.stringify(tasksArray));
  localStorage.setItem("taskCounter", taskCounter);
};

const loadFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasksArray");
  const storedCounter = localStorage.getItem("taskCounter");

  if (storedTasks) {
    tasksArray.push(...JSON.parse(storedTasks));
  }

  if (storedCounter) {
    taskCounter = parseInt(storedCounter, 10);
  }
};

const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  if (title && description) {
    const task = {
      title,
      description,
      dueDate: new Date(),
      startDate: new Date().toISOString().split("T")[0],
      completed: false,
      id: generateId(),
    };
    addTask(task);
    setTimeout(() => {
      document.getElementById("taskTitle").value = "";
      document.getElementById("taskDescription").value = "";
    }, 2000);
  } else {
    alert("Please fill out both the title and description.");
  }
  render();
});

const createTaskCard = (task) => {
  return `
    <div class="task-card">
      <h3 class="task-title">${task.title}</h3>
      <p class="task-description">${task.description}</p>
      <p class="task-start-date">Start date: ${task.startDate}</p>
      <div class="task-actions">
        <button class="task-btn mark-complete-btn">Mark as Complete</button>
        <button class="task-btn delete-btn">Delete</button>
      </div>
    </div>
  `;
};

const render = () => {
  const taskContainer = document.querySelector(".task-container");
  const spinner = taskContainer.querySelector(".spinner");
  taskContainer.innerHTML = "";

  taskContainer.appendChild(spinner);
  spinner.classList.remove("hidden");
  spinner.classList.add("visible");
  setTimeout(() => {
    spinner.classList.remove("visible");
    spinner.classList.add("hidden");
    if (tasksArray.length === 0) {
      taskContainer.innerHTML =
        '<p class="no-tasks">Currently no tasks to display</p>';
      return;
    }
    tasksArray.forEach((task) => {
      const taskCardHtml = createTaskCard(task);
      taskContainer.innerHTML += taskCardHtml;
    });
  }, 3000);
};

loadFromLocalStorage();
render();
