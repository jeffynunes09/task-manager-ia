# Task Manager IA

App desktop para produtividade com IA. O usuario digita texto livre ("preciso estudar nestjs amanha") e a IA estrutura a tarefa automaticamente com titulo, prioridade e deadline.

## Apps e Servicos

| App | Stack | Responsabilidade |
|-----|-------|-----------------|
| `apps/desktop` | React + Ionic + Tauri 2 | Interface desktop (janela nativa via Tauri) |
| `apps/api` | Node.js + Express + SQLite | API REST + integracao OpenAI |

## Regras globais

- TypeScript estrito em todos os projetos
- Sem `any` — usar tipos explícitos
- Variáveis de ambiente via `.env` (nunca hardcoded)
- API roda na porta `3333`, desktop na `1420` (Vite dev)
- Banco SQLite em `apps/api/data/tasks.db`

## Referencias de memoria

- `memory/MEMORY.md` — contexto global e decisoes tecnicas
- `memory/frontend.md` — padrões React + Ionic
- `memory/backend.md` — padrões Express + SQLite + OpenAI
- `memory/active-tasks.md` — progresso atual
