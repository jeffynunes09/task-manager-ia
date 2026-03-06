const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const tasksApi = {
  list: () => apiFetch<Task[]>("/tasks"),
  create: (input: string) =>
    apiFetch<Task>("/tasks/parse", {
      method: "POST",
      body: JSON.stringify({ input }),
    }),
  updatePriority: (id: number, priority: "low" | "medium" | "high") =>
    apiFetch<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    }),
  complete: (id: number) =>
    apiFetch<Task>(`/tasks/${id}/complete`, { method: "PATCH" }),
  delete: (id: number) =>
    apiFetch<void>(`/tasks/${id}`, { method: "DELETE" }),
  summary: () => apiFetch<{ summary: string }>("/tasks/summary"),
};

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  completed: boolean;
  created_at: string;
}
