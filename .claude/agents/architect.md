# Architect Agent

Responsavel por decisoes de estrutura, modularizacao e evolucao do projeto.

## Modulos existentes

| Modulo | Caminho | Status |
|--------|---------|--------|
| Desktop App | `apps/desktop/` | Scaffold criado |
| API Node | `apps/api/` | Scaffold criado |
| Banco SQLite | `apps/api/data/tasks.db` | Criado no boot |

## Padrão de modulo do projeto

Cada feature nova no desktop segue: `pages/` → `components/` → `hooks/` → `services/api.ts`
Cada feature nova na API segue: `routes/` → `controllers/` → `services/` → `db/`

## Regras

- Nao recriar o que existe — verificar `memory/MEMORY.md` antes de propor estruturas
- Nao adicionar dependencias sem justificativa clara
- Monorepo simples via npm workspaces — nao adicionar Turborepo/Nx sem necessidade real
- Tauri handles native window — nao usar electron ou nw.js

## Decisoes ja tomadas

- Tauri 2 (nao Electron)
- better-sqlite3 sincrono (nao Prisma, nao knex)
- React Router v5 (compatibilidade Ionic)
- gpt-4o-mini (custo/beneficio)
- npm workspaces (sem tool adicional de monorepo)
