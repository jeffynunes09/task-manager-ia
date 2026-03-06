import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, "../../data/tasks.db");

export const db = new Database(DB_PATH);

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      priority    TEXT    NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
      due_date    TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
  console.log("Banco de dados inicializado");
}
