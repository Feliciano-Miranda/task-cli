const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

// Criar arquivo JSON caso não exista
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// Ler tarefas
function loadTasks() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Salvar tarefas
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Gerar ID
function generateId(tasks) {
  if (tasks.length === 0) return 1;
  return tasks[tasks.length - 1].id + 1;
}

// Adicionar tarefa
function addTask(description) {
  if (!description) {
    console.log("Informe a descrição da tarefa.");
    return;
  }

  const tasks = loadTasks();

  const task = {
    id: generateId(tasks),
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(task);
  saveTasks(tasks);

  console.log(`Task adicionada com sucesso (ID: ${task.id})`);
}

// Atualizar tarefa
function updateTask(id, description) {
  const tasks = loadTasks();

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    console.log("Task não encontrada.");
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);

  console.log("Task atualizada com sucesso.");
}

// Deletar tarefa
function deleteTask(id) {
  let tasks = loadTasks();

  const taskExists = tasks.some(t => t.id === Number(id));

  if (!taskExists) {
    console.log("Task não encontrada.");
    return;
  }

  tasks = tasks.filter(t => t.id !== Number(id));

  saveTasks(tasks);

  console.log("Task removida com sucesso.");
}

// Atualizar status
function updateStatus(id, status) {
  const tasks = loadTasks();

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    console.log("Task não encontrada.");
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);

  console.log(`Task marcada como ${status}.`);
}

// Listar tarefas
function listTasks(status) {
  let tasks = loadTasks();

  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }

  if (tasks.length === 0) {
    console.log("Nenhuma tarefa encontrada.");
    return;
  }

  console.table(tasks);
}

// Captura argumentos
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

// Comandos
switch (command) {
  case "add":
    addTask(arg1);
    break;

  case "update":
    updateTask(arg1, arg2);
    break;

  case "delete":
    deleteTask(arg1);
    break;

  case "mark-in-progress":
    updateStatus(arg1, "in-progress");
    break;

  case "mark-done":
    updateStatus(arg1, "done");
    break;

  case "list":
    listTasks(arg1);
    break;

  default:
    console.log(`
Comandos disponíveis:

node task-cli.js add "Descrição"
node task-cli.js update ID "Nova descrição"
node task-cli.js delete ID
node task-cli.js mark-in-progress ID
node task-cli.js mark-done ID
node task-cli.js list
node task-cli.js list done
node task-cli.js list todo
node task-cli.js list in-progress
`);
}