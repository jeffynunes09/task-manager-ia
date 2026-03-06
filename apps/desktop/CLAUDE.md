# Desktop App — React + Ionic + Tauri

## Stack

- React 18 + TypeScript (strict)
- Ionic 8 (componentes de UI)
- Tauri 2 (wrapper nativo desktop)
- Vite (bundler, porta 1420)
- React Router DOM v5 (roteamento Ionic)

## Estrutura de pastas

```
src/
  pages/        # Uma pagina por rota Ionic (TasksPage, CalendarPage, SummaryPage)
  components/   # Componentes reutilizaveis
  hooks/        # Custom hooks (ex: useTasks, useAI)
  services/     # api.ts — wrapper fetch para a API Node
src-tauri/      # Configuracao Tauri (Rust)
```

## Padrão de pagina (Ionic)

```tsx
const TasksPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Tarefas</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      {/* conteudo */}
    </IonContent>
  </IonPage>
);
```

## Padrão de fetch

Sempre usar `tasksApi.*` de `src/services/api.ts` — nunca fetch direto nos componentes.

## Comandos

```bash
npm run dev          # Vite dev server (sem Tauri)
npm run tauri dev    # App completo com janela Tauri
npm run tauri build  # Build de producao
```

## Armadilhas

- Ionic requer `setupIonicReact()` no main.tsx antes de qualquer render
- React Router deve ser v5 (IonReactRouter nao suporta v6 ainda)
- Tauri dev server deve estar na porta 1420 (strictPort: true no vite.config.ts)
