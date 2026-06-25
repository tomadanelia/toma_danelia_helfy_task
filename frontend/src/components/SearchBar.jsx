import '../styles/SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="search tasks by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      {value && (
        <button className="search-clear-btn" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  );
}