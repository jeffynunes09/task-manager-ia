import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { tasksRouter } from "./routes/tasks";
import { initDb } from "./db/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

initDb();

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
