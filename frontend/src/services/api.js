import axios from 'axios';

const BASE = 'http://localhost:4000/api/tasks';

export async function fetchTasks() {
  const res = await axios.get(BASE);
  return res.data;
}
export async function createTask(data) {
  const res = await axios.post(BASE, data);
  return res.data;
}
export async function updateTask(id, data) {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
}
export async function deleteTask(id) {
  await axios.delete(`${BASE}/${id}`);
}
export async function toggleTask(id) {
  const res = await axios.patch(`${BASE}/${id}/toggle`);
  return res.data;
}