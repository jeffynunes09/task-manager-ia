import { Router } from "express";
import {
  getAllTasks,
  parseAndCreateTask,
  updateTask,
  completeTask,
  deleteTask,
  getDailySummary,
} from "../controllers/tasks.controller";

export const tasksRouter = Router();

tasksRouter.get("/", getAllTasks);
tasksRouter.post("/parse", parseAndCreateTask);   // IA: texto livre -> tarefa
tasksRouter.patch("/:id", updateTask);
tasksRouter.patch("/:id/complete", completeTask);
tasksRouter.delete("/:id", deleteTask);
tasksRouter.get("/summary", getDailySummary);     // IA: resumo do dia
