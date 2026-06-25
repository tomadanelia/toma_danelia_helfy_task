let tasks = [];
let baseId = 1;

function getAll() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

function createTask({ title, descr, priority }) {
  const task = {
    id: baseId++,
    title,
    description: descr || '',
    completed: false,
    createdAt: new Date(),
    priority: priority || 'low'
  };

  tasks.push(task);

  return task;
}

function updateTask(id, updates) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return null;
  const task = tasks[index];

  for  (const key in updates) {
  task[key] = updates[key];
  }

  return task;
}


function deleteTask(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}


function toggleTask(id) {
  const task = getTaskById(id);
  if (!task) return null;

  task.completed = !task.completed;
  return task;
}

export { getAll, getTaskById, createTask, updateTask, deleteTask, toggleTask };