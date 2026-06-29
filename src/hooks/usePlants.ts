import { useState, useEffect } from "react";
import { db } from "../database/db";
import { plantas } from "@/database/schemas";
import { iPlanta } from "@/types";

export function usePlants() {
  const [data, setData] = useState<iPlanta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = async () => {
    try {
    setLoading(true);
    
    // 1. Busca os dados brutos do SQLite
    const resultado = await db.select().from(plantas);

    // 2. Mapeia os resultados para garantir a compatibilidade com a interface Planta
    const plantasFormatadas: iPlanta[] = resultado.map((item) => ({
      ...item,
      // Se o banco retornar null para números, definimos um valor padrão (ex: 0)
      espacamento_cm: item.espacamento_cm ?? 0,
      ciclo_dias: item.ciclo_dias ?? 0,
      
      // Realizamos o cast para os tipos literais da sua interface
      luz: (item.luz ?? 'Pleno') as iPlanta['luz'],
      rega: (item.rega ?? 'Moderada') as iPlanta['rega'],
      estrato: (item.estrato ?? 'Baixo') as iPlanta['estrato'],
      
      // O PONTO CHAVE: Converte a string do SQLite de volta para Array
      // Se você salvou como JSON no seed, use JSON.parse
      consorcio: item.consorcio ? JSON.parse(item.consorcio) : [],
      
      // Descrição Embrapa é opcional na interface [1]
      descricao_embrapa: item.descricao_embrapa ?? undefined,
    }));

    setData(plantasFormatadas);
    setError(null);
    } catch (erro) {
      console.error("Erro ao buscar plantas do SQLite:", erro);
      setError("Não foi possível carregar a base de conhecimento local.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega as plantas assim que o componente que utiliza o hook é montado
  useEffect(() => {
    loadPlants();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: loadPlants, // Permite atualizar a lista manualmente se necessário
  };
}
