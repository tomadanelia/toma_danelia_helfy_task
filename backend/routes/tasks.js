import express from 'express';
import {getAll,getTaskById, createTask, updateTask,deleteTask,toggleTask} from '../data/dataStore.js';
const router = express.Router();

const PRIORITY = ['low', 'medium', 'high'];

router.get('/', (req, res) => {
  const tasks = getAll();
  res.json(tasks);
});
/*
{
id: number,
title: string,

description: string,
completed: boolean,
createdAt: Date,
priority: 'low' | 'medium' | 'high'
}*/
router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required field' });
  }

  if (priority && !PRIORITY.includes(priority)) {
    return res.status(400).json({ error: 'priority must be valid type: low,medium or high' });
  }
  if (dueDate && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: 'dueDate must be a valid date' });
  }
  const task = createTask({
    title: title.trim(),
    descr: description,
    priority,
    dueDate: dueDate || null,
  });
  res.status(201).json(task);
});


router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, priority, completed, dueDate } = req.body;
  let task= getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  if (priority !== undefined && !PRIORITY.includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (completed !== undefined) updateData.completed = Boolean(completed);
  if (dueDate !== undefined) updateData.dueDate = dueDate || null;

  const updated = updateTask(id, updateData);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = deleteTask(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

router.patch('/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const task = toggleTask(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

export default router;