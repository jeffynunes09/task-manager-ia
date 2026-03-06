import { Request, Response } from "express";
import * as tasksService from "../services/tasks.service";
import { parseTaskFromText, generateDailySummary, suggestTaskOrder } from "../services/ai.service";

export async function getAllTasks(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = tasksService.findAll();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
}

export async function parseAndCreateTask(req: Request, res: Response): Promise<void> {
  try {
    const { input } = req.body as { input: string };
    if (!input?.trim()) { res.status(400).json({ error: "Campo input e obrigatorio" }); return; }
    const parsed = await parseTaskFromText(input);
    const task = tasksService.create(parsed);
    res.status(201).json(task);
  } catch (err: unknown) {
    console.error("parseAndCreateTask:", err);
    const status = (err as { status?: number }).status;
    if (status === 429) {
      res.status(402).json({ error: "Cota da Groq API esgotada. Verifique em console.groq.com" });
      return;
    }
    res.status(500).json({ error: "Erro ao processar tarefa com IA" });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const task = tasksService.update(id, req.body as Parameters<typeof tasksService.update>[1]);
    if (!task) { res.status(404).json({ error: "Tarefa nao encontrada" }); return; }
    res.json(task);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
}

export async function completeTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const task = tasksService.markComplete(id);
    if (!task) { res.status(404).json({ error: "Tarefa nao encontrada" }); return; }
    res.json(task);
  } catch {
    res.status(500).json({ error: "Erro ao completar tarefa" });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    tasksService.remove(id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
}

export async function getDailySummary(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = tasksService.findTodayTasks();
    const summary = await generateDailySummary(
      tasks.map((t) => ({ title: t.title, completed: Boolean(t.completed), priority: t.priority }))
    );
    res.json({ summary });
  } catch (err) {
    console.error("getDailySummary:", err);
    res.status(500).json({ error: "Erro ao gerar resumo" });
  }
}

export async function getSuggestedOrder(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = tasksService.findAll().filter(t => !t.completed);
    const order = await suggestTaskOrder(tasks);
    res.json({ order });
  } catch (err) {
    console.error("getSuggestedOrder:", err);
    res.status(500).json({ error: "Erro ao sugerir ordem" });
  }
}
