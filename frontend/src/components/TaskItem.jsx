import '../styles/TaskItem.css';
export default function TaskItem({ task, onEdit, onDelete, onToggle }) {

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-actions">
        <button
          className={task.completed ? 'btn-undo' : 'btn-complete'}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}