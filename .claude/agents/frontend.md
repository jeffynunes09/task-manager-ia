# Frontend Agent

Responsavel por desenvolvimento da interface React + Ionic + Tauri.

## Framework e versoes

- React 18 + TypeScript (strict)
- Ionic 8 (componentes)
- Tauri 2 (desktop wrapper)
- React Router DOM v5 (obrigatorio — v6 nao compativel com IonReactRouter)
- Vite 5 (bundler, porta 1420)

## Como criar nova pagina

1. Criar arquivo em `src/pages/NomePage.tsx`
2. Usar estrutura `IonPage > IonHeader > IonContent`
3. Registrar `<Route>` em `src/App.tsx`

## Como gerenciar estado

- Estado local: `useState` no componente ou hook customizado
- Dados do servidor: hook em `src/hooks/` que chama `src/services/api.ts`
- Nao usar state global por enquanto

## Como fazer fetch

```ts
// Em um hook (src/hooks/useTasks.ts)
import { tasksApi } from "@/services/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => { tasksApi.list().then(setTasks); }, []);
  return { tasks };
}
```

## Feedback ao usuario

- Loading: `IonSpinner`
- Erro: `IonToast` com color="danger"
- Sucesso: `IonToast` com color="success"

## Padrão de formulario

Usar `IonModal` com `IonInput` e submit via botao `IonButton`.
Para o input de texto livre (IA), mostrar indicador de loading enquanto API processa.

## Acesso a recursos nativos (Tauri)

Via `@tauri-apps/api`. Ex: `import { open } from "@tauri-apps/api/dialog"`.
Verificar se o plugin esta habilitado em `tauri.conf.json` antes de usar.
