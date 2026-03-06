# API — Node.js + Express + SQLite + OpenAI

## Stack

- Node.js 20 + TypeScript (CommonJS)
- Express 4 (HTTP server)
- better-sqlite3 (banco sincrono)
- OpenAI SDK v4 (gpt-4o-mini)
- tsx (dev runner com watch)
- zod (validacao)
- Porta: 3333

## Estrutura de pastas

```
src/
  app.ts              # Entry point: Express + middlewares + listen
  routes/tasks.ts     # Definicao de rotas
  controllers/        # Handlers HTTP (req, res)
  services/
    tasks.service.ts  # CRUD SQLite
    ai.service.ts     # Chamadas OpenAI
  db/database.ts      # Conexao e initDb()
```

## Padrão de controller

```ts
export async function parseAndCreateTask(req: Request, res: Response): Promise<void> {
  const { input } = req.body as { input: string };
  if (!input?.trim()) { res.status(400).json({ error: "..." }); return; }
  const parsed = await parseTaskFromText(input);
  const task = tasksService.create(parsed);
  res.status(201).json(task);
}
```

## Rotas disponíveis

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /tasks | Listar todas |
| POST | /tasks/parse | IA: texto -> tarefa |
| PATCH | /tasks/:id | Atualizar tarefa |
| PATCH | /tasks/:id/complete | Marcar concluida |
| DELETE | /tasks/:id | Deletar |
| GET | /tasks/summary | IA: resumo do dia |
| GET | /health | Health check |

## Variaveis de ambiente

```
PORT=3333
OPENAI_API_KEY=sk-...
DB_PATH=./data/tasks.db
```

## Comandos

```bash
npm run dev    # tsx watch (hot reload)
npm run build  # tsc -> dist/
npm start      # node dist/app.js
```

## Armadilhas

- `better-sqlite3` e sincrono — nao usar async/await nas chamadas do db
- Banco criado automaticamente pelo `initDb()` no boot
- Criar a pasta `data/` antes de rodar (`mkdir -p apps/api/data`)
- Modelo OpenAI: `gpt-4o-mini` (barato, rapido o suficiente para o caso de uso)
