import Groq from "groq-sdk";
import { Task } from "./tasks.service";

let _groq: Groq | null = null;
function getClient(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const MODEL = "llama-3.1-8b-instant";

export interface ParsedTask {
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
}

function fallbackParse(input: string): ParsedTask {
  const lower = input.toLowerCase();
  const priority = lower.includes("urgente") || lower.includes("hoje") ? "high"
    : lower.includes("amanha") || lower.includes("semana") ? "medium"
    : "low";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const due_date = lower.includes("amanha") ? tomorrow.toISOString().split("T")[0] : null;
  return { title: input.slice(0, 80), description: null, priority, due_date };
}

export async function parseTaskFromText(input: string): Promise<ParsedTask> {
  if (!process.env.GROQ_API_KEY) return fallbackParse(input);

  const today = new Date().toISOString().split("T")[0];

  const completion = await getClient().chat.completions.create({
    model: MODEL,
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
  if (!process.env.GROQ_API_KEY) return "GROQ_API_KEY nao configurada no .env da API.";
  const completion = await getClient().chat.completions.create({
    model: MODEL,
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

export async function suggestTaskOrder(
  tasks: Pick<Task, "id" | "title" | "priority" | "due_date">[]
): Promise<number[]> {
  if (tasks.length === 0) return [];
  if (!process.env.GROQ_API_KEY) return tasks.map(t => t.id);

  const completion = await getClient().chat.completions.create({
    model: MODEL,
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
        content: JSON.stringify(
          tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, due_date: t.due_date }))
        ),
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0].message.content ?? '{"order":[]}') as { order: number[] };
  return parsed.order;
}
