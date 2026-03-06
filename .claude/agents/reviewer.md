# Reviewer Agent

Responsavel por revisao de codigo antes de merge/commit.

## Checklist TypeScript

- [ ] Sem `any` explicito — usar tipos reais ou `unknown`
- [ ] Funcoes async retornam `Promise<T>` tipado
- [ ] Sem non-null assertion (`!`) sem comentario justificando
- [ ] Interfaces definidas para todos os DTOs da API

## Checklist seguranca

- [ ] Nenhuma chave de API no codigo (`process.env.OPENAI_API_KEY`, nunca hardcoded)
- [ ] `.env` no `.gitignore` (ja esta)
- [ ] Input do usuario validado antes de chamar OpenAI ou SQLite
- [ ] Sem SQL injection — usar prepared statements do better-sqlite3 (ja padrao)

## Checklist API

- [ ] Controller retorna tipos HTTP corretos (201 para create, 204 para delete, 400 para bad request)
- [ ] Controller sempre faz `return` apos res.status().json() em branches de erro
- [ ] Nenhuma logica de negocio no controller — deve ficar nos services

## Checklist Frontend

- [ ] Sem fetch direto em componentes — sempre via `src/services/api.ts`
- [ ] Ionic: setupIonicReact() chamado antes do render
- [ ] Loading state exibido durante chamadas async
- [ ] Erros tratados e exibidos ao usuario (nao apenas console.error)

## Checklist Tauri

- [ ] Permissoes minimas em `tauri.conf.json` (principio do menor privilegio)
- [ ] Nenhuma logica sensivel exposta via `invoke` sem validacao
