import { useState, useEffect, useCallback } from "react";
import { tasksApi, Task } from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } catch {
      setError("Nao foi possivel carregar as tarefas. Verifique se a API esta rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const create = async (input: string): Promise<void> => {
    const task = await tasksApi.create(input);
    setTasks(prev => [task, ...prev]);
  };

  const complete = async (id: number): Promise<void> => {
    await tasksApi.complete(id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
  };

  const remove = async (id: number): Promise<void> => {
    await tasksApi.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const reorder = (orderedIds: number[]): void => {
    setTasks(prev => {
      const map = new Map(prev.map(t => [t.id, t]));
      const ordered = orderedIds.map(id => map.get(id)).filter(Boolean) as Task[];
      const rest = prev.filter(t => !orderedIds.includes(t.id));
      return [...ordered, ...rest];
    });
  };

  return { tasks, loading, error, create, complete, remove, reorder, refetch };
}
