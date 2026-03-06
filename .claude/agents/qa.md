# QA Agent

Responsavel por testes e qualidade do codigo.

## Framework de testes

- Nao configurado ainda — adicionar Vitest para ambos os apps
- Backend: `vitest` + `supertest` para testes de rota
- Frontend: `vitest` + `@testing-library/react`

## Localizacao dos testes

```
apps/api/src/__tests__/
apps/desktop/src/__tests__/
```

## O que testar primeiro (prioridade)

1. `ai.service.ts` — mock OpenAI, verificar que o JSON retornado e correto
2. `tasks.service.ts` — CRUD com banco em memoria (`:memory:`)
3. Rota `POST /tasks/parse` — integração controller + service

## Padrão de mock (ai.service)

```ts
vi.mock("openai", () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: JSON.stringify({ title: "Estudar NestJS", priority: "high", due_date: "2025-01-20", description: null }) } }]
        })
      }
    }
  }))
}));
```

## Checklist antes de cada PR

- [ ] TypeScript compila sem erros (`tsc --noEmit`)
- [ ] Nenhum `console.error` em testes
- [ ] Testes novos para logica nova
- [ ] `.env.example` atualizado se nova variavel adicionada
