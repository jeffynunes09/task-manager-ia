import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ParsedTask {
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null; // ISO 8601
}

export async function parseTaskFromText(input: string): Promise<ParsedTask> {
  const today = new Date().toISOString().split("T")[0];

  const completion = await openai.chat.completions.create({
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
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Gere um resumo executivo do dia baseado nas tarefas. Seja direto, maximo 3 paragrafos. Em portugues.",
      },
      {
        role: "user",
        content: JSON.stringify(tasks),
      },
    ],
  });

  return completion.choices[0].message.content ?? "Sem resumo disponivel.";
}
