import OpenAI from "openai";
import { Task } from "./tasks.service";

let _openai: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export interface ParsedTask {
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
}

export async function parseTaskFromText(input: string): Promise<ParsedTask> {
  const today = new Date().toISOString().split("T")[0];

  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Hoje e ${today}. Transforme o texto do usuario em uma tarefa estruturada.
Retorne um JSON com: title (string), description (string|null), priority ("low"|"medium"|"high"), due_date (string ISO 8601|null).
Infira a prioridade e data a partir do contexto. Seja conciso no titulo.`,
      },
      { role: "user", content: input },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as ParsedTask;
}

export async function generateDailySummary(tasks: {
  title: string;
  completed: boolean;
  priority: string;
}[]): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Gere um resumo executivo do dia baseado nas tarefas. Seja direto, maximo 3 paragrafos. Em portugues.",
      },
      { role: "user", content: JSON.stringify(tasks) },
    ],
  });

  return completion.choices[0].message.content ?? "Sem resumo disponivel.";
}

export async function suggestTaskOrder(tasks: Pick<Task, "id" | "title" | "priority" | "due_date">[]): Promise<number[]> {
  if (tasks.length === 0) return [];

  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Voce e um assistente de produtividade. Sugira a melhor ordem para executar as tarefas.
Considere: prazo (due_date), prioridade e dependencias logicas.
Retorne JSON: { "order": [id1, id2, ...] } com todos os IDs fornecidos na ordem sugerida.`,
      },
      {
        role: "user",
        content: JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, due_date: t.due_date }))),
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? '{"order":[]}';
  const parsed = JSON.parse(raw) as { order: number[] };
  return parsed.order;
}
