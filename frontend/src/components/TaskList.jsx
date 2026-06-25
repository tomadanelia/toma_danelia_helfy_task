import { useState, useEffect, useRef } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [tasks.length]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="carousel-empty">
        <p>no tasks have been found create one</p>
      </div>
    );
  }

  if (tasks.length === 1) {
    return (
      <div className="carousel-wrapper">
        <div className="carousel-single">
          <TaskItem
            task={tasks[0]}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        </div>
      </div>
    );
  }

  const cloned = [tasks[tasks.length - 1], ...tasks, tasks[0]];
  const clonedIndex = currentIndex + 1;
  function goNext() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const nextIdx = currentIndex + 1;  
    if (nextIdx >= tasks.length) { 
      setCurrentIndex(next);
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 300);
    } else {
      setCurrentIndex(next);
      timeoutRef.current = setTimeout(() => setIsTransitioning(false), 300);
    }
  }

  function goPrev() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const prev = currentIndex - 1;

    if (prev < 0) {
      setCurrentIndex(prev);
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(tasks.length - 1);
      }, 300);
    } else {
      setCurrentIndex(prev);
      timeoutRef.current = setTimeout(() => setIsTransitioning(false), 300);
    }
  }

  const translateX = -(clonedIndex * 100);

  return (
    <div className="carousel-wrapper">
      <button className="carousel-btn carousel-btn-left" onClick={goPrev}>
        ‹
      </button>

      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isTransitioning ? 'transform 0.3s ease' : 'none'
          }}
        >
          {cloned.map((task, i) => (
            <div className="carousel-slide" key={`${task.id}-${i}`}>
              <TaskItem
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-btn carousel-btn-right" onClick={goNext}>
        ›
      </button>

      <div className="carousel-dots">
        {tasks.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? 'dot-active' : ''}`}
            onClick={() => !isTransitioning && setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}