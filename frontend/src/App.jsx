import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTask } from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('could not load any tasks server may be crushed');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData) {
    try {
      const task = await createTask(formData);
      setTasks(prev => [...prev, task]);
      setShowForm(false);
    } catch (err) {
      setError('failed to create the task');
    }
  }

  async function handleUpdate(formData) {
    try {
      const updated = await updateTask(editingTask.id, formData);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError('failed to update the task');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('failed to delete the task');
    }
  }

  async function handleToggle(id) {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      setError('failed to toggle task completion');
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleFormClose() {
    setEditingTask(null);
    setShowForm(false);
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
        <h1>Task Manager</h1>

        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <TaskFilter current={filter} onChange={setFilter} />

      {showForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <TaskForm
              initial={editingTask}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
      <div className="new-task-div">
        <p>Manage your tasks</p>
         <button className="btn-primary" onClick={() => setShowForm(true)}>
        New Task
        </button>
        </div>
       
    </div>
  );

}