import { Request, Response } from "express";
import * as tasksService from "../services/tasks.service";
import { parseTaskFromText, generateDailySummary } from "../services/ai.service";

export async function getAllTasks(_req: Request, res: Response): Promise<void> {
  const tasks = tasksService.findAll();
  res.json(tasks);
}

export async function parseAndCreateTask(req: Request, res: Response): Promise<void> {
  const { input } = req.body as { input: string };

  if (!input?.trim()) {
    res.status(400).json({ error: "Campo input e obrigatorio" });
    return;
  }

  const parsed = await parseTaskFromText(input);
  const task = tasksService.create(parsed);
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const task = tasksService.update(id, req.body as Parameters<typeof tasksService.update>[1]);

  if (!task) {
    res.status(404).json({ error: "Tarefa nao encontrada" });
    return;
  }

  res.json(task);
}

export async function completeTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const task = tasksService.markComplete(id);

  if (!task) {
    res.status(404).json({ error: "Tarefa nao encontrada" });
    return;
  }

  res.json(task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  tasksService.remove(id);
  res.status(204).send();
}

export async function getDailySummary(_req: Request, res: Response): Promise<void> {
  const tasks = tasksService.findTodayTasks();
  const summary = await generateDailySummary(
    tasks.map((t) => ({
      title: t.title,
      completed: Boolean(t.completed),
      priority: t.priority,
    }))
  );
  res.json({ summary });
}
