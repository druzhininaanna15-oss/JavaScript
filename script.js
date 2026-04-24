const addButton = document.querySelector(".add-button");
const taskPanel = document.querySelector(".task-panel");
const searchInput = document.querySelector(".search-input");
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const tasksContainer = document.querySelector(".tasks");
const select = document.querySelector("#sortOrder");
const taskButton = document.querySelectorAll(".task-button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTask(taskData) {
  const task = document.createElement("article");
  const taskContent = document.createElement("div");
  const taskTitle = document.createElement("h3");
  const taskDate = document.createElement("h3");
  const taskBtn = document.createElement("div");
  const taskBtnEdit = document.createElement("button");
  const taskBtnDelete = document.createElement("button");
  taskTitle.textContent = taskData.title;

  taskBtnEdit.innerHTML = `
<svg class="task__icon" viewBox="0 0 24 24" fill="none" stroke="#6f64a3" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      <path d="M12 20h9" />
    </svg>
`;

  taskBtnDelete.innerHTML = `
<svg class="task__icon" viewBox="0 0 24 24" fill="none" stroke="#cb6e6e" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
`;
  taskDate.textContent = taskData.date;

  task.classList.add("task");
  taskContent.classList.add("task-content");
  taskTitle.classList.add("task-title");
  taskBtn.classList.add("task-btn");
  taskBtnEdit.classList.add("task__btn-edit");
  taskBtnDelete.classList.add("task__btn-delete");
  taskDate.classList.add("task-date");

  if (taskData.done) {
    taskTitle.classList.add("task-done");
  }

  taskBtnDelete.addEventListener("click", () => {
    let ok = confirm("удалить?");
    if (ok === true) {
      tasks = tasks.filter((task) => task.id !== taskData.id);
      console.log(tasks);
      saveTask();
    }
    renderAll();
  });

  taskBtnEdit.addEventListener("click", () => {
    const promt = prompt("редактировать?", taskData.title);
    if (promt.trim() !== "") {
      taskData.title = promt.trim();
      saveTask();
    }

    console.log(taskData.title);
    renderAll();
  });

  task.addEventListener("click", (event) => {
    if (event.target.closest(".task-btn")) {
      return;
    }
    taskData.done = !taskData.done;
    saveTask();

    taskTitle.classList.toggle("task-done");
    // renderAll();
  });

  taskContent.append(taskTitle, taskDate);
  task.append(taskContent, taskBtn);
  tasksContainer.append(task);
  taskBtn.append(taskBtnEdit, taskBtnDelete);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

let sortOrderTask = "new";
let currentFilter = "all";

function renderAll() {
  // const tasks = document.querySelector(".tasks");
  tasksContainer.innerHTML = "";

  let sortedTask = tasks.sort((a, b) => {
    if (sortOrderTask === "new") {
      return b.id - a.id;
    } else if (sortOrderTask === "old") {
      return a.id - b.id;
    } else if (sortOrderTask === "az") {
      return a.title.localeCompare(b.title);
    } else if (sortOrderTask === "za") {
      return b.title.localeCompare(a.title);
    }
  });

  let filtered = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.done;
    } else if (currentFilter === "done") {
      return task.done;
    } else {
      return true;
    }
  });

  let query = searchInput.value.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((task) =>
      task.title.toLowerCase().includes(query)
    );
  }

  filtered.forEach((task) => {
    renderTask(task);
  });
}

searchInput.addEventListener("input", () => {
  renderAll();
});

taskButton.forEach((button) => {
  button.addEventListener("click", (event) => {
    taskButton.forEach((btn) => {
      btn.classList.remove("active");
    });
    event.target.classList.add("active");

    if (button.textContent.includes("Активные")) currentFilter = "active";
    else if (button.textContent.includes("Завершённые")) currentFilter = "done";
    else currentFilter = "all";
    console.log(currentFilter);
    renderAll();
  });
});

// console.log(currentFilter);

function formateDate(d) {
  return `${String(d.getDate()).padStart(2, "0")}.${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${d.getFullYear()}`;
}

const newDate = new Date();

function addTask() {
  const title = taskInput.value;

  if (title.length < 3 || title.trim() === "") {
    taskInput.classList.add("incorrect-input");
    return;
  }

  taskInput.classList.remove("incorrect-input");

  const newTask = {
    id: new Date().getTime(),
    title: title.trim(),
    done: false,
    date: formateDate(new Date()),
  };

  tasks.push(newTask);
  saveTask();
  taskInput.value = "";
  renderAll();
}

select.addEventListener("change", (event) => {
  sortOrderTask = select.value;
  console.log(sortOrderTask);
  renderAll();
});

function saveTask() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
