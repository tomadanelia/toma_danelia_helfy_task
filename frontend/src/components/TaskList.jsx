import { useState, useEffect, useRef } from 'react';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const SLIDE_WIDTH = 80;
const OFFSET = (100 - SLIDE_WIDTH) / 2;

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
        <p>No tasks found — create one</p>
      </div>
    );
  }

  if (tasks.length === 1) {
    return (
      <div className="carousel-wrapper">
        <div className="carousel-single">
          <TaskItem task={tasks[0]} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
        </div>
      </div>
    );
  }

  const cloned = [tasks[tasks.length - 1], ...tasks, tasks[0]];
  const clonedIndex = currentIndex + 1;
  const translateX = -(clonedIndex * SLIDE_WIDTH) + OFFSET;



  function goTo(nextIdx, afterJump) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(nextIdx);

    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      if (afterJump !== undefined) setCurrentIndex(afterJump);
    }, 300);
  }

  function goNext() {
    if (currentIndex + 1 >= tasks.length) {
      goTo(currentIndex + 1, 0);
    } else {
      goTo(currentIndex + 1);
    }
  }

  function goPrev() {
    if (currentIndex - 1 < 0) {
      goTo(currentIndex - 1, tasks.length - 1);
    } else {
      goTo(currentIndex - 1);
    }
  }

  function goToIndex(i) {
    if (!isTransitioning) goTo(i);
  }

  return (
    <div className="carousel-wrapper">
      <button className="carousel-btn carousel-btn-left" onClick={goPrev}>‹</button>

      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isTransitioning ? 'transform 0.3s ease' : 'none',
          }}
        >
          {cloned.map((task, i) => (
            <div
              className={`carousel-slide${i === clonedIndex ? ' active-slide' : ''}`}
              key={`${task.id}-${i}`}
            >
              <TaskItem task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-btn carousel-btn-right" onClick={goNext}>›</button>

      <div className="carousel-dots">
        {tasks.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? 'dot-active' : ''}`}
            onClick={() => goToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}