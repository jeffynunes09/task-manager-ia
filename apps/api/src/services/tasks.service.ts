import { db } from "../db/database";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export function findAll(): Task[] {
  return db
    .prepare("SELECT * FROM tasks ORDER BY priority DESC, due_date ASC")
    .all() as Task[];
}

export function create(data: Omit<Task, "id" | "completed" | "created_at">): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (@title, @description, @priority, @due_date)
  `);
  const result = stmt.run(data);
  return findById(result.lastInsertRowid as number)!;
}

export function findById(id: number): Task | undefined {
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;
}

export function update(id: number, data: Partial<Pick<Task, "priority" | "due_date" | "title" | "description">>): Task | undefined {
  const fields = Object.keys(data)
    .map((key) => `${key} = @${key}`)
    .join(", ");
  db.prepare(`UPDATE tasks SET ${fields} WHERE id = @id`).run({ ...data, id });
  return findById(id);
}

export function markComplete(id: number): Task | undefined {
  db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
  return findById(id);
}

export function remove(id: number): void {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
}

export function findTodayTasks(): Task[] {
  const today = new Date().toISOString().split("T")[0];
  return db
    .prepare("SELECT * FROM tasks WHERE date(due_date) = ? OR due_date IS NULL")
    .all(today) as Task[];
}
