# Backend — Padroes e Convencoes

## Estrutura de camadas

```
routes    →  controllers  →  services  →  db
(Express)    (req/res)       (logica)     (SQLite)
```

## Schema do banco

```sql
CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT,
  priority    TEXT    NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date    TEXT,
  completed   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

## Padrão de service (SQLite sincrono)

```ts
export function findAll(): Task[] {
  return db.prepare("SELECT * FROM tasks ORDER BY priority DESC, due_date ASC").all() as Task[];
}
```

## Padrão OpenAI

Modelo: `gpt-4o-mini`
response_format: `json_object` para parse estruturado
Temperatura: default (1.0) para summary, 0 para parse determinístico

## Middleware global

- `cors()` — aceita qualquer origem em dev
- `express.json()` — parse body JSON
- `dotenv.config()` — carrega .env antes de tudo

## Tratamento de erro

Controllers retornam `res.status(404).json({ error: "..." })` e saem com `return`.
Nao ha middleware de erro global ainda — adicionar se necessario.

## Proximos middlewares a considerar

- Rate limiting (express-rate-limit) antes de produção
- Validacao de body com zod (middleware de validacao por rota)
- Logger (pino ou morgan)
