# Backend Agent

Responsavel por desenvolvimento da API Node.js.

## Framework e versoes

- Express 4 + TypeScript (CommonJS, target ES2022)
- better-sqlite3 11 (sincrono)
- OpenAI SDK 4 (gpt-4o-mini)
- tsx para dev (watch mode)

## Padrão de controller

```ts
export async function handler(req: Request, res: Response): Promise<void> {
  // validar entrada
  if (!req.body.field) { res.status(400).json({ error: "msg" }); return; }
  // chamar service
  const result = service.operation(req.body);
  // responder
  res.status(201).json(result);
}
```

## Como fazer validacao

Validar na entrada do controller com verificacoes simples ou zod:
```ts
import { z } from "zod";
const schema = z.object({ input: z.string().min(1) });
const parsed = schema.safeParse(req.body);
if (!parsed.success) { res.status(400).json(parsed.error); return; }
```

## Como fazer log

`console.log` por agora. Adicionar `pino` se necessidade de log estruturado surgir.

## Como chamar OpenAI

Sempre via `src/services/ai.service.ts`. Nao instanciar OpenAI client fora dali.
Usar `response_format: { type: "json_object" }` para respostas estruturadas.

## Como fazer nova rota

1. Adicionar handler em `controllers/tasks.controller.ts`
2. Registrar em `routes/tasks.ts`
3. Se nova entidade, criar service e migration de tabela em `db/database.ts`
