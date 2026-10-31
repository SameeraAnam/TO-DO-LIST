
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const total = document.getElementById("total");
const completed = document.getElementById("completed");
const pending = document.getElementById("pending");
const progressText = document.getElementById("progressText");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";

// Show today's date
document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now() + Math.random(),
        name: taskName,
        done: false
    };

    tasks.unshift(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "pending") {
            return !task.done;
        }

        if (currentFilter === "completed") {
            return task.done;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.done) {
            li.classList.add("done");
        }

        // Complete button
        const checkBtn = document.createElement("button");
        checkBtn.className = "check-btn";
        checkBtn.textContent = task.done ? "✓" : "";
        checkBtn.setAttribute(
            "aria-label",
            task.done ? "Mark as pending" : "Mark as completed"
        );

        checkBtn.addEventListener("click", function () {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        // Task text
        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.appendChild(checkBtn);
        li.appendChild(name);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    // Update statistics
    const doneCount = tasks.filter(function (task) {
        return task.done;
    }).length;

    total.textContent = tasks.length;
    completed.textContent = doneCount;
    pending.textContent = tasks.length - doneCount;

    progressText.textContent =
        doneCount + " of " + tasks.length + " tasks completed";

    // Show empty message when needed
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Filter buttons
document.querySelectorAll(".filter").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelector(".filter.active")
            .classList.remove("active");

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Delete all completed tasks
clearCompleted.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.done;
    });

    saveTasks();
    renderTasks();
});

// Load saved tasks when page opens
renderTasks();
