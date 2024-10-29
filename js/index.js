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

let taskCounter = 0;

const generateId = () => {
  taskCounter++;
  return `task-${taskCounter}`;
};

class Task {
  constructor(title, description = "", dueDate = null) {
    this.title = title;
    this.description = description;
    this.isCompleted = false;
    this.startDate = new Date().toISOString().split("T")[0];
    this.startTime = new Date().toTimeString().split(" ")[0];
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

loadFromLocalStorage();
