# Task Manager IA — Contexto Global

## Projeto

App desktop de produtividade com IA. Feature principal: usuario escreve texto livre e a IA (OpenAI gpt-4o-mini) transforma em tarefa estruturada com titulo, prioridade e deadline.

## Stack completa

- **Desktop:** React 18 + Ionic 8 + Tauri 2 + Vite
- **API:** Node.js 20 + Express 4 + better-sqlite3 + OpenAI SDK v4
- **Linguagem:** TypeScript (strict) em todos os apps
- **Banco:** SQLite via better-sqlite3 (sincrono)

## Estado atual

- [x] Estrutura de monorepo criada (npm workspaces)
- [x] Scaffold do desktop (React + Ionic + Tauri)
- [x] Scaffold da API (Express + SQLite + OpenAI)
- [x] Rotas, controllers, services e db definidos
- [ ] Instalar dependencias (`npm install` em cada app)
- [ ] Criar pasta `apps/api/data/` para o SQLite
- [ ] Copiar `.env.example` para `.env` e preencher OPENAI_API_KEY
- [ ] Implementar componentes de UI (TaskCard, TaskForm, etc.)
- [ ] Implementar hooks React (useTasks, useSummary)
- [ ] Calendário de tarefas
- [ ] Testes

## Arquivos-chave

| Arquivo | Responsabilidade |
|---------|-----------------|
| `apps/api/src/app.ts` | Entry point da API |
| `apps/api/src/services/ai.service.ts` | Chamadas OpenAI (parse + summary) |
| `apps/api/src/services/tasks.service.ts` | CRUD SQLite |
| `apps/api/src/db/database.ts` | Conexao DB + initDb() |
| `apps/desktop/src/App.tsx` | Roteamento Ionic |
| `apps/desktop/src/services/api.ts` | Wrapper fetch para API |
| `apps/desktop/src-tauri/tauri.conf.json` | Config Tauri (janela, bundle) |

## Decisoes tecnicas

- **Tauri em vez de Electron:** bundle menor (~10MB vs ~150MB), melhor performance
- **better-sqlite3:** API sincrona simplifica o codigo do service (sem async/await no DB)
- **gpt-4o-mini:** mais barato e rapido o suficiente para parse de texto e summary
- **React Router v5:** necessario para compatibilidade com IonReactRouter do Ionic 8
- **Monorepo npm workspaces:** sem Turborepo/Nx para manter simples no inicio

## Variaveis de ambiente necessarias

```
# apps/api/.env
PORT=3333
OPENAI_API_KEY=sk-...
DB_PATH=./data/tasks.db
```
