import { useCallback, useEffect, useState } from "react";
import { listarPlantiosPorCanteiro, type PlantioComPlanta } from "@/database/queries";

export function usePlantiosCanteiro(idCanteiro: number | null) {
  const [plantios, setPlantios] = useState<PlantioComPlanta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (idCanteiro == null || !Number.isFinite(idCanteiro)) {
      setPlantios([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await listarPlantiosPorCanteiro(idCanteiro);
      setPlantios(rows);
      setError(null);
    } catch {
      setPlantios([]);
      setError("Não foi possível carregar os plantios.");
    } finally {
      setLoading(false);
    }
  }, [idCanteiro]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const nomesAtivos = plantios
    .filter((p) => p.status === "ativo")
    .map((p) => p.nome_planta)
    .filter((n): n is string => Boolean(n));

  return { plantios, nomesAtivos, loading, error, refresh };
}
