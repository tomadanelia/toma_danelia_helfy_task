import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import SearchBar from './components/SearchBar';
import SortControls from './components/SortControls';
import useLocalStorage from './hooks/UseLocalStorage';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTask } from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'createdAt');
  const [sortOrder, setSortOrder] = useLocalStorage('sortOrder', 'asc');

  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const [cachedTasks, setCachedTasks] = useLocalStorage('cached_tasks', []);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);


  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
      setCachedTasks(data);
    } catch (err) {
      setError('Could not load online tasks. Running with local offline cache.');
      if (cachedTasks && cachedTasks.length > 0) {
        setTasks(cachedTasks);
      }
    } finally {
      setLoading(false);
    }
  }



  async function handleCreate(formData) {
    try {
      const task = await createTask(formData);
      const updated = [...tasks, task];
      setTasks(updated);
      setCachedTasks(updated);
      setShowForm(false);
    } catch (err) {
      setError('failed to create the task');
    }
  }







  async function handleUpdate(formData) {
    try {
      const updatedTask = await updateTask(editingTask.id, formData);
      const updatedList = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      setTasks(updatedList);
      setCachedTasks(updatedList);
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
      const updatedList = tasks.filter(t => t.id !== id);
      setTasks(updatedList);
      setCachedTasks(updatedList);
    } catch (err) {
      setError('failed to delete the task');
    }
  }






  async function handleToggle(id) {
    try {
      const updatedTask = await toggleTask(id);
      const updatedList = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      setTasks(updatedList);
      setCachedTasks(updatedList);
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




  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }



  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  }).filter(t => {
    const titleMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });



  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let fieldA, fieldB;

    if (sortBy === 'title') {
      fieldA = a.title.toLowerCase();
      fieldB = b.title.toLowerCase();
    } else if (sortBy === 'createdAt') {
      fieldA = new Date(a.createdAt);
      fieldB = new Date(b.createdAt);
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return sortOrder === 'asc' ? 1 : -1;
      if (!b.dueDate) return sortOrder === 'asc' ? -1 : 1;
      fieldA = new Date(a.dueDate);
      fieldB = new Date(b.dueDate);
    } else if (sortBy === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      fieldA = priorityMap[a.priority] || 0;
      fieldB = priorityMap[b.priority] || 0;
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });





  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <TaskFilter current={filter} onChange={setFilter} />

      <SortControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onOrderToggle={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')}
      />

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
          tasks={sortedTasks}
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