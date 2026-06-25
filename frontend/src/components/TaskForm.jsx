import { useState } from 'react';
import '../styles/TaskForm.css';

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ title: title.trim(), description, priority });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit Task' : 'New Task'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label>Title *</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary">
          {initial ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}