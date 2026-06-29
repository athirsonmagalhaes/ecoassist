import { useCallback, useEffect, useState } from "react";
import { buscarCanteiroPorId } from "@/database/queries";
import type { iCanteiro } from "@/types/index";

export function useCanteiro(id: number | null) {
  const [canteiro, setCanteiro] = useState<iCanteiro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (id == null || !Number.isFinite(id)) {
      setCanteiro(null);
      return;
    }
    setLoading(true);
    try {
      const rows = await buscarCanteiroPorId(id);
      setCanteiro(rows[0] ?? null);
      setError(null);
    } catch {
      setCanteiro(null);
      setError("Não foi possível carregar o canteiro.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { canteiro, loading, error, refresh };
}
