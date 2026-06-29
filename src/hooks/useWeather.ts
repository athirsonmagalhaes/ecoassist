import { obterDadosClimaticos } from "@/services/weather/weatherService";
import { useState, useEffect } from "react";
import { coletarLocalDb } from "@/database/queries";

export function useWeather() {
  const [clima, setClima] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [localizacao, setLocalizacao] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleGetWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const dadosLocal = await coletarLocalDb();

      if (dadosLocal) {
        console.log("Localização vinda do SQLite:", dadosLocal.localizacao);
        // Atualiza o estado para a UI
        setLocalizacao(dadosLocal.localizacao);
        setLatitude(dadosLocal.latitude);
        setLongitude(dadosLocal.longitude);

        if (dadosLocal.latitude !== 0 && dadosLocal.longitude !== 0) {
          const dadosClima = await obterDadosClimaticos(
            dadosLocal.latitude,
            dadosLocal.longitude,
          );
          setClima(dadosClima);
        }
      }
    } catch (err) {
      setError("Erro ao obter clima local");
      console.error(error, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("CLIMINHA FOI ALTERADO-> ", clima);
  }, [clima]);

  return {
    handleGetWeather,
    clima,
    localizacao,
    latitude,
    longitude,
    loading,
    error,
  };
}
