# Frontend — Padroes e Convencoes

## Componentes Ionic usados

- `IonPage`, `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent` — estrutura basica de pagina
- `IonList`, `IonItem`, `IonLabel` — listas de tarefas
- `IonFab`, `IonFabButton`, `IonIcon` — botao flutuante de adicionar
- `IonModal` — formulario de nova tarefa
- `IonBadge` — indicador de prioridade
- `IonChip` — tags/categorias

## Padrão de hook de dados

```ts
// src/hooks/useTasks.ts
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const data = await tasksApi.list();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  return { tasks, loading, refetch: fetchTasks };
}
```

## Roteamento

Rotas definidas em `App.tsx` com `IonReactRouter` + `IonRouterOutlet`.
Navegação via `useIonRouter()` ou `<IonRouterLink>`.

## Estado global

Sem Redux/Zustand no momento. Estado local via hooks por pagina.
Se necessario compartilhar estado, usar Context API.

## Comunicacao com API

Sempre via `src/services/api.ts` — nunca fetch direto em componentes ou hooks.
Tratamento de erro no catch com `IonToast`.
