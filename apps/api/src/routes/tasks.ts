import { Router } from "express";
import {
  getAllTasks,
  parseAndCreateTask,
  updateTask,
  completeTask,
  deleteTask,
  getDailySummary,
  getSuggestedOrder,
} from "../controllers/tasks.controller";

export const tasksRouter = Router();

tasksRouter.get("/suggest", getSuggestedOrder);   // IA: sugere ordem de execucao
tasksRouter.get("/summary", getDailySummary);     // IA: resumo do dia
tasksRouter.get("/", getAllTasks);
tasksRouter.post("/parse", parseAndCreateTask);   // IA: texto livre -> tarefa
tasksRouter.patch("/:id/complete", completeTask);
tasksRouter.patch("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);
