const API_BASE = "https://dotnettodo.onrender.com/api/todos";

const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

addBtn.addEventListener("click", createTodo);
document.addEventListener("DOMContentLoaded", loadTodos);

async function loadTodos() {
    const res = await fetch(API_BASE);
    const todos = await res.json();

    todoList.innerHTML = "";
    todos.forEach(renderTodo);
}

async function createTodo() {
    const title = todoInput.value.trim();
    if (!title) return;

    await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    todoInput.value = "";
    loadTodos();
}
async function editTodo(todo) {
    const newTitle = prompt("Edit todo", todo.title);
    if (!newTitle || !newTitle.trim()) return;

    await fetch(`${API_BASE}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: newTitle.trim(),
            isCompleted: todo.isCompleted
        })
    });

    loadTodos();
}

async function toggleTodo(todo) {
    await fetch(`${API_BASE}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: todo.title,
            isCompleted: !todo.isCompleted
        })
    });

    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    loadTodos();
}

function renderTodo(todo) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.isCompleted) span.classList.add("completed");
    span.onclick = () => toggleTodo(todo);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTodo(todo);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
}

