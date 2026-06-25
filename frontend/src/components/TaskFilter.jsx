import '../styles/TaskFilter.css';
export default function TaskFilter({ current, onChange }) {
  return (
    <div className="task-filter">
      <button
        className={`filter-btn ${current === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      <button
        className={`filter-btn ${current === 'pending' ? 'active' : ''}`}
        onClick={() => onChange('pending')}
      >
        Pending
      </button>
      <button
        className={`filter-btn ${current === 'completed' ? 'active' : ''}`}
        onClick={() => onChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}