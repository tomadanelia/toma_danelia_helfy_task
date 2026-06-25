import '../styles/SortControls.css';

export default function SortControls({ sortBy, onSortChange, sortOrder, onOrderToggle }) {
  return (
    <div className="sort-controls">
      <span className="sort-label">Sort by:</span>
      <div className="sort-select-container">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <span className="sort-select-arrow">▼</span>
      </div>
      <button 
        type="button" 
        onClick={onOrderToggle} 
        className="sort-direction-btn"
        title="Toggle Sort Direction"
      >
        {sortOrder === 'asc' ? '▲' : '▼'}
      </button>
    </div>
  );
}