# Task Manager IA

App desktop de produtividade com inteligência artificial. O diferencial é a criação de tarefas por linguagem natural — você escreve como falaria e a IA estrutura automaticamente título, prioridade e prazo.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Stack](https://img.shields.io/badge/Ionic-8-3880FF?logo=ionic) ![Stack](https://img.shields.io/badge/Tauri-2-FFC131?logo=tauri) ![Stack](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs) ![Stack](https://img.shields.io/badge/SQLite-003B57?logo=sqlite) ![Stack](https://img.shields.io/badge/Groq-AI-F55036)

---

## Funcionalidades

### Tarefas com IA
- Criação por linguagem natural: escreva `"preciso estudar nestjs amanhã de manhã"` e a IA transforma em tarefa estruturada com título, descrição, prioridade e prazo
- Sugestão de ordem de execução pela IA — considera prazo, prioridade e dependências lógicas
- Marcação de tarefas como concluídas
- Deleção de tarefas
- Separação visual entre tarefas pendentes e concluídas

### Calendário
- Visualização mensal das tarefas
- Dias com tarefas marcados com indicador visual
- Clique em qualquer dia para ver as tarefas daquele dia
- Navegação entre meses

### Resumo do Dia com IA
- Geração de resumo executivo das tarefas do dia
- Análise de progresso (concluídas vs pendentes)
- Texto gerado em português pelo modelo Llama 3.1

---

## Stack

### Desktop (`apps/desktop`)
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| React | 18 | Interface |
| Ionic | 8 | Componentes de UI mobile-first |
| Tauri | 2 | Wrapper nativo desktop (Rust) |
| TypeScript | 5 | Linguagem |
| Vite | 5 | Bundler (dev na porta 1420) |
| React Router | v5 | Roteamento (compatível com Ionic) |

### API (`apps/api`)
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Node.js | 20 | Runtime |
| Express | 4 | HTTP server (porta 3333) |
| TypeScript | 5 | Linguagem |
| better-sqlite3 | 11 | Banco de dados SQLite síncrono |
| Groq SDK | latest | Integração com LLM (Llama 3.1) |
| tsx | latest | Dev runner com hot reload |

### IA
| | |
|--|--|
| Provedor | Groq (gratuito, sem cartão) |
| Modelo | `llama-3.1-8b-instant` |
| Limites free tier | 14.400 req/dia, 30 req/min |

---

## Estrutura do Projeto

```
task-manager-ia/
├── apps/
│   ├── desktop/                  # Tauri + React + Ionic
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── TaskCard.tsx  # Card de tarefa com prioridade e ações
│   │   │   │   └── TaskForm.tsx  # Modal de criação via IA
│   │   │   ├── hooks/
│   │   │   │   ├── useTasks.ts   # CRUD de tarefas + reorder
│   │   │   │   └── useSummary.ts # Geração de resumo
│   │   │   ├── pages/
│   │   │   │   ├── TasksPage.tsx    # Lista + botão sugerir ordem
│   │   │   │   ├── CalendarPage.tsx # Calendário mensal
│   │   │   │   └── SummaryPage.tsx  # Resumo do dia
│   │   │   ├── services/
│   │   │   │   └── api.ts        # Wrapper fetch para a API
│   │   │   └── App.tsx           # Roteamento + IonTabBar
│   │   └── src-tauri/            # Configuração Tauri (Rust)
│   └── api/                      # Node.js + Express
│       └── src/
│           ├── controllers/
│           │   └── tasks.controller.ts
│           ├── routes/
│           │   └── tasks.ts
│           ├── services/
│           │   ├── tasks.service.ts  # CRUD SQLite
│           │   └── ai.service.ts     # Groq (parse, summary, suggest)
│           ├── db/
│           │   └── database.ts       # Conexão + initDb()
│           └── app.ts                # Entry point
├── memory/                       # Contexto para Claude Code
├── .claude/                      # Agents e settings do Claude Code
└── package.json                  # Monorepo npm workspaces
```

---

## Pré-requisitos

- **Node.js** 20+
- **Rust** (para o Tauri) — instale em https://rustup.rs
- **Chave Groq** (gratuita) — crie em https://console.groq.com
- **Visual Studio Build Tools** com workload "C++ build tools" (Windows)

---

## Como Rodar

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repo>
cd task-manager-ia
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env`:

```env
PORT=3333
GROQ_API_KEY=gsk_...sua-chave-aqui
DB_PATH=./data/tasks.db
```

### 3. Rodar a API

```bash
# Terminal 1
npm run dev --workspace=apps/api
```

Output esperado:
```
Banco de dados inicializado
API rodando em http://localhost:3333
```

### 4. Rodar o Desktop

```bash
# Terminal 2
npm run tauri dev --workspace=apps/desktop
```

Na primeira execução o Cargo vai compilar as dependências Rust (~5 min). As execuções seguintes são rápidas.

---

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks` | Listar todas as tarefas |
| `POST` | `/tasks/parse` | IA: texto livre → tarefa estruturada |
| `PATCH` | `/tasks/:id` | Atualizar campos da tarefa |
| `PATCH` | `/tasks/:id/complete` | Marcar como concluída |
| `DELETE` | `/tasks/:id` | Deletar tarefa |
| `GET` | `/tasks/summary` | IA: gerar resumo do dia |
| `GET` | `/tasks/suggest` | IA: sugerir ordem de execução |
| `GET` | `/health` | Health check |

### Exemplo — Criar tarefa via IA

```bash
curl -X POST http://localhost:3333/tasks/parse \
  -H "Content-Type: application/json" \
  -d '{"input": "preciso estudar nestjs amanhã de manhã, é urgente"}'
```

Resposta:
```json
{
  "id": 1,
  "title": "Estudar NestJS",
  "description": "Sessão de estudo pela manhã",
  "priority": "high",
  "due_date": "2026-03-07",
  "completed": false,
  "created_at": "2026-03-06T03:00:00"
}
```

---

## Schema do Banco de Dados

```sql
CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT,
  priority    TEXT    NOT NULL DEFAULT 'medium'
              CHECK (priority IN ('low', 'medium', 'high')),
  due_date    TEXT,
  completed   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

O banco SQLite é criado automaticamente em `apps/api/data/tasks.db` na primeira execução.

---

## Build de Produção

```bash
# Build da API
npm run build --workspace=apps/api

# Build do desktop (gera instalador .exe/.msi no Windows)
npm run build --workspace=apps/desktop
# ou
cd apps/desktop && npm run tauri build
```

O instalador gerado fica em:
```
apps/desktop/src-tauri/target/release/bundle/
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `GROQ_API_KEY` | Sim | Chave da API Groq (gratuita em console.groq.com) |
| `PORT` | Não | Porta da API (padrão: 3333) |
| `DB_PATH` | Não | Caminho do arquivo SQLite (padrão: ./data/tasks.db) |

> Sem `GROQ_API_KEY` o app funciona em modo fallback: tarefas são criadas com parse simples baseado em palavras-chave, sem IA.

---

## Licença

MIT
