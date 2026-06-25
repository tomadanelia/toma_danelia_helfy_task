import express from "express";
import cors from "cors";
import tasks from './routes/tasks.js'; 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); 
app.use(express.json());
app.use('/tasks', tasks);
app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(PORT, () => {
  console.log(`server is running on url http://localhost:${PORT}`);
});