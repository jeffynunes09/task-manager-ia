import { useState, useCallback } from "react";
import { tasksApi } from "../services/api";

export function useSummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.summary();
      setSummary(data.summary);
    } catch {
      setError("Nao foi possivel gerar o resumo. Verifique se a API esta rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { summary, loading, error, generate };
}
